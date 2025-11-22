/**
 * streaming.js
 * Robust, optimized FFmpeg pipeline for ingesting WebM binary frames over WebSocket
 * and forwarding to an RTMPS endpoint (Mux).
 *
 * Replaces previous streaming.js. Copy-paste entire file.
 */

const { spawn } = require('child_process')
const url = require('url')
const os = require('os')

// In-memory state for active streams
const streams = {}

/** Configurable tuning via environment variables */
const FFMPEG_BITRATE = process.env.FFMPEG_BITRATE || '2500k' // target video bitrate
const FFMPEG_MAXRATE = process.env.FFMPEG_MAXRATE || '2800k'
const FFMPEG_BUF_SIZE = process.env.FFMPEG_BUF_SIZE || '4000k'
const FFMPEG_PRESET = process.env.FFMPEG_PRESET || 'veryfast'
const FFMPEG_THREADS = process.env.FFMPEG_THREADS || '0' // 0 => auto
const FFMPEG_GOP_FACTOR = Number(process.env.FFMPEG_GOP_FACTOR || 2) // gop = fps * factor
const FFMPEG_RESTART_LIMIT = Number(process.env.FFMPEG_RESTART_LIMIT || 3) // restarts per WINDOW
const FFMPEG_RESTART_WINDOW_MS = Number(process.env.FFMPEG_RESTART_WINDOW_MS || 60_000) // 60s

// Backpressure queue config
const MAX_QUEUE_FRAMES = Number(process.env.MAX_QUEUE_FRAMES || 60) // how many chunks we buffer max per stream

// Small utility: bounded FIFO queue
class BoundedQueue {
  constructor(limit) {
    this.limit = limit
    this.queue = []
  }
  push(item) {
    if (this.queue.length >= this.limit) {
      // Drop the oldest frame to make room (tail drop is safer for live)
      this.queue.shift()
    }
    this.queue.push(item)
  }
  shift() {
    return this.queue.shift()
  }
  get length() {
    return this.queue.length
  }
  clear() {
    this.queue.length = 0
  }
}

// Helper that spawns ffmpeg with tuned args and returns { ffmpegProc, stdin }
function spawnFfmpegForStream(rtmpUrl, fps = 30) {
  const gop = Math.max(2, Math.floor(fps * FFMPEG_GOP_FACTOR))

  const args = [
    '-fflags',
    'nobuffer',
    '-hide_banner',
    '-loglevel',
    'warning',

    // Input (stdin) as webm container
    '-f',
    'webm',
    '-i',
    '-',

    // Video encoding
    '-c:v',
    'libx264',
    '-preset',
    FFMPEG_PRESET,
    '-tune',
    'zerolatency',
    '-profile:v',
    'main',
    '-pix_fmt',
    'yuv420p',
    '-r',
    String(fps),
    '-g',
    String(gop),
    '-keyint_min',
    String(gop),
    '-b:v',
    FFMPEG_BITRATE,
    '-maxrate',
    FFMPEG_MAXRATE,
    '-bufsize',
    FFMPEG_BUF_SIZE,
    '-threads',
    String(FFMPEG_THREADS),

    // Audio encoding
    '-c:a',
    'aac',
    '-ar',
    '44100',
    '-b:a',
    '128k',
    '-ac',
    '2',

    // Output to RTMP(s)
    '-f',
    'flv',
    rtmpUrl,
  ]

  // Spawn with stdio pipes so we can push binary to stdin
  const ffmpeg = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] })
  return ffmpeg
}

// Simple restart limiter per streamKey to avoid crash loop
function makeRestartTracker() {
  let attempts = []
  return {
    record() {
      const now = Date.now()
      attempts.push(now)
      // prune older than window
      attempts = attempts.filter((t) => now - t <= FFMPEG_RESTART_WINDOW_MS)
      return attempts.length
    },
    reset() {
      attempts = []
    },
  }
}

module.exports = function setupStreamingRoutes(wss) {
  wss.on('connection', (ws, req) => {
    // Defensive try/catch for whole connection lifecycle
    try {
      const pathname = url.parse(req.url).pathname || ''
      const parts = pathname.split('/')
      const streamKey = parts[parts.length - 1]

      if (!streamKey) {
        console.error('[Streaming Service] Stream key missing. Closing connection.')
        try {
          ws.close()
        } catch (e) {}
        return
      }

      console.log(`[Streaming Service] WS connected for streamKey=${streamKey}`)

      const rtmpUrl = `rtmps://global-live.mux.com:443/app/${streamKey}`

      // Per-connection state
      const state = {
        ffmpeg: null,
        queue: new BoundedQueue(MAX_QUEUE_FRAMES),
        writable: true, // whether ffmpeg.stdin returned true recently
        fps: 30,
        restartTracker: makeRestartTracker(),
      }

      // Spawn ffmpeg
      function startFfmpeg() {
        if (state.ffmpeg) {
          console.warn(`[Streaming Service] ffmpeg already running for ${streamKey}`)
          return
        }

        console.log(`[Streaming Service] Spawning ffmpeg for ${streamKey} -> ${rtmpUrl}`)
        const ffmpeg = spawnFfmpegForStream(rtmpUrl, state.fps)
        state.ffmpeg = ffmpeg

        // pipe stderr for diagnostics
        ffmpeg.stderr.on('data', (d) => {
          // keep limited logs to avoid flooding
          const msg = d.toString()
          console.error(`FFMPEG stderr [${streamKey}]: ${msg.slice(0, 1000)}`)
        })

        ffmpeg.stdout.on('data', () => {
          // usually unused for ffmpeg -> rtmp, kept for future usage
        })

        ffmpeg.on('error', (err) => {
          console.error(`FFMPEG failed to start [${streamKey}]:`, err && err.message)
        })

        ffmpeg.stdin.on('drain', () => {
          // ffmpeg consumed buffered data; resume accepting frames
          state.writable = true
          // flush queued frames until drain returns false again
          flushQueueToFfmpeg()
        })

        ffmpeg.stdin.on('error', (err) => {
          console.error(`ffmpeg.stdin error [${streamKey}]:`, err && err.message)
        })

        ffmpeg.on('close', (code, signal) => {
          console.warn(`FFMPEG exited [${streamKey}] code=${code} signal=${signal}`)
          state.ffmpeg = null
          // decide whether to restart ffmpeg
          const attempts = state.restartTracker.record()
          if (attempts <= FFMPEG_RESTART_LIMIT) {
            console.log(
              `[Streaming Service] Restart attempt ${attempts}/${FFMPEG_RESTART_LIMIT} for ${streamKey}`,
            )
            // small backoff before restart
            setTimeout(() => {
              if (ws.readyState === ws.OPEN) {
                startFfmpeg()
              } else {
                // ws closed — cleanup
                cleanup()
              }
            }, 1000 * attempts) // increasing backoff
          } else {
            console.error(
              `[Streaming Service] Restart limit reached for ${streamKey}. Not restarting.`,
            )
            // notify client if possible and close ws
            try {
              if (ws.readyState === ws.OPEN) ws.close()
            } catch (e) {}
            cleanup()
          }
        })
      }

      function flushQueueToFfmpeg() {
        if (!state.ffmpeg || !state.ffmpeg.stdin || state.ffmpeg.stdin.destroyed) {
          return
        }
        // flush while writable
        while (state.writable && state.queue.length > 0) {
          const buf = state.queue.shift()
          try {
            const ok = state.ffmpeg.stdin.write(buf)
            if (!ok) {
              state.writable = false
            }
          } catch (err) {
            console.error(
              `[Streaming Service] Error writing queued frame to ffmpeg for ${streamKey}:`,
              err && err.message,
            )
            // if write fails, drop remaining queued frames to avoid memory growth
            state.queue.clear()
            state.writable = false
            break
          }
        }
      }

      function cleanup() {
        // kill ffmpeg if running
        if (state.ffmpeg) {
          try {
            state.ffmpeg.kill('SIGINT')
          } catch (e) {}
          state.ffmpeg = null
        }
        // clear queue
        try {
          state.queue.clear()
        } catch (e) {}
        delete streams[streamKey]
      }

      // initialize ffmpeg
      startFfmpeg()

      // store connection state
      streams[streamKey] = { ws, state }

      // Accept only binary frames; ignore/parse text control frames optionally
      ws.on('message', (msg, isBinary) => {
        if (!isBinary) {
          // allow small JSON control messages (e.g., {"type":"meta","fps":24})
          try {
            const s = msg.toString()
            if (s && (s.startsWith('{') || s.startsWith('['))) {
              const parsed = JSON.parse(s)
              if (parsed && parsed.type === 'meta' && parsed.fps) {
                const newFps = Number(parsed.fps) || state.fps
                if (newFps !== state.fps) {
                  console.log(
                    `[Streaming Service] fps meta updated for ${streamKey}: ${state.fps} -> ${newFps}`,
                  )
                  state.fps = newFps
                  // restart ffmpeg to apply new fps/gop if needed
                  if (state.ffmpeg) {
                    try {
                      state.ffmpeg.kill('SIGINT')
                    } catch (e) {}
                    // ffmpeg 'close' handler will try restart with new fps
                  }
                }
              }
            } else {
              // ignore freeform text
            }
          } catch (e) {
            console.warn(`[Streaming Service] Ignoring non-binary WS message for ${streamKey}`)
          }
          return
        }

        // msg is Buffer (binary chunk)
        if (!state.ffmpeg || !state.ffmpeg.stdin || state.ffmpeg.stdin.destroyed) {
          // queue up frames while ffmpeg is down (bounded)
          state.queue.push(msg)
          return
        }

        // Try to write directly; if backpressure, push to queue
        try {
          const ok = state.ffmpeg.stdin.write(msg)
          if (!ok) {
            state.writable = false
            // push to queue so drain handler continues flushing afterwards
            state.queue.push(msg)
          }
        } catch (err) {
          console.error(
            `[Streaming Service] Error writing to ffmpeg.stdin for ${streamKey}:`,
            err && err.message,
          )
          // try to queue as fallback
          try {
            state.queue.push(msg)
          } catch (e) {}
        }
      })

      ws.on('close', () => {
        console.log(`[Streaming Service] WS disconnected for ${streamKey}`)
        cleanup()
      })

      ws.on('error', (err) => {
        console.error(`[Streaming Service] WS error for ${streamKey}:`, err && (err.message || err))
        cleanup()
      })
    } catch (err) {
      console.error('[Streaming Service] Unexpected connection error:', err && err.message)
      try {
        ws.close()
      } catch (e) {}
    }
  })
}

// streaming.js

const { spawn } = require('child_process')
const url = require('url')

// In-memory store for active ffmpeg processes
const streams = {}

function spawnFfmpeg(rtmpUrl, streamKey) {
  const args = [
    // --- Input Options ---
    '-hide_banner',
    '-loglevel',
    'debug', // Keep debug logs for now to catch any issues

    // *** THE FIX: Add flags to help FFmpeg analyze the initial stream data ***
    '-analyzeduration',
    '1M', // Analyze up to 1MB of data to determine format
    '-probesize',
    '1M', // Probe up to 1MB of data

    '-f',
    'webm',
    '-i',
    '-',

    // --- Video Options (FIXED a typo here) ---
    '-c:v',
    'libx264', // Corrected from 'libx24' to the correct 'libx264'
    '-preset',
    'veryfast',
    '-tune',
    'zerolatency',
    '-pix_fmt',
    'yuv420p',
    '-b:v',
    '2500k',
    '-maxrate',
    '3000k',
    '-bufsize',
    '4000k',
    '-g',
    '60', // Keyframe every 2 seconds for 30fps stream

    // --- Audio Options ---
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-ar',
    '44100',

    // --- Output Options ---
    '-f',
    'flv',
    rtmpUrl,
  ]

  console.log(`[FFMPEG] Spawning for stream ${streamKey} with args: ffmpeg ${args.join(' ')}`)
  const ffmpeg = spawn('ffmpeg', args)

  // Listen to FFmpeg's output streams to catch any errors or info
  ffmpeg.stderr.on('data', (data) => {
    console.error(`[FFMPEG STDERR - ${streamKey}]: ${data.toString()}`)
  })

  ffmpeg.stdout.on('data', (data) => {
    console.log(`[FFMPEG STDOUT - ${streamKey}]: ${data.toString()}`)
  })

  ffmpeg.on('close', (code, signal) => {
    console.warn(`[FFMPEG - ${streamKey}] Process exited with code ${code}, signal ${signal}`)
  })

  ffmpeg.on('error', (err) => {
    console.error(`[FFMPEG - ${streamKey}] Failed to start process:`, err.message)
  })

  ffmpeg.stdin.on('error', (err) => {
    // This error often happens when the WebSocket closes and we try to write to a closed pipe.
    // It's usually not critical but good to log.
    console.warn(`[FFMPEG STDIN Error - ${streamKey}]:`, err.message)
  })

  return ffmpeg
}

module.exports = function setupStreamingRoutes(wss) {
  wss.on('connection', (ws, req) => {
    const pathname = url.parse(req.url).pathname || ''
    const parts = pathname.split('/')
    const streamKey = parts[parts.length - 1]

    if (!streamKey) {
      console.error('[WS] Connection rejected: Stream key missing.')
      ws.close()
      return
    }

    console.log(`[WS] Client connected for stream key: ${streamKey}`)
    const rtmpUrl = `rtmps://global-live.mux.com:443/app/${streamKey}`

    const ffmpeg = spawnFfmpeg(rtmpUrl, streamKey)
    streams[streamKey] = ffmpeg

    ws.on('message', (message) => {
      if (ffmpeg.stdin && ffmpeg.stdin.writable) {
        ffmpeg.stdin.write(message)
      } else {
        console.warn(`[WS - ${streamKey}] FFmpeg stdin not writable, dropping frame.`)
      }
    })

    ws.on('close', (code, reason) => {
      const reasonString = reason ? reason.toString() : 'No reason given'
      console.log(
        `[WS] Client disconnected for stream key: ${streamKey}. Code: ${code}, Reason: ${reasonString}`,
      )

      if (streams[streamKey]) {
        console.log(`[FFMPEG] Terminating process for stream key: ${streamKey}`)
        streams[streamKey].kill('SIGINT')
        delete streams[streamKey]
      }
    })

    ws.on('error', (err) => {
      console.error(`[WS - ${streamKey}] Error:`, err.message)
      if (streams[streamKey]) {
        streams[streamKey].kill('SIGINT')
        delete streams[streamKey]
      }
    })
  })
}

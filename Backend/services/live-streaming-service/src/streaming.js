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
    'debug', // MAXIMUM LOGGING! This will show everything.
    '-f',
    'webm',
    '-i',
    '-',

    // --- Video Options ---
    '-c:v',
    'libx264',
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

  // *** CRITICAL FOR DEBUGGING ***
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
    console.error(`[FFMPEG STDIN Error - ${streamKey}]:`, err.message)
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
      // Forward the binary message from the browser to FFmpeg's standard input
      if (ffmpeg.stdin && ffmpeg.stdin.writable) {
        ffmpeg.stdin.write(message)
      } else {
        console.warn(`[WS - ${streamKey}] FFmpeg stdin not writable, dropping frame.`)
      }
    })

    ws.on('close', (code, reason) => {
      // The reason buffer needs to be converted to a string to be readable
      const reasonString = reason ? reason.toString() : 'No reason given'
      console.log(
        `[WS] Client disconnected for stream key: ${streamKey}. Code: ${code}, Reason: ${reasonString}`,
      )

      if (streams[streamKey]) {
        console.log(`[FFMPEG] Terminating process for stream key: ${streamKey}`)
        streams[streamKey].kill('SIGINT') // Gracefully kill FFmpeg
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

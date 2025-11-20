// File: Backend/services/live-streaming-service/src/streaming.js (MUKAMMAL AUR SAHI CODE)

const { spawn } = require('child_process')

// Yeh object har stream ke FFMPEG process ko store karega
const streams = {}

// Ab hum ek router nahi, balke ek function export kar rahe hain jo 'app' object leta hai
module.exports = function setupStreamingRoutes(app) {
  // WebSocket route ko direct `app` object par define karein (`app.ws`)
  // Yeh path API Gateway se aane wale request (`/stream/live/:streamKey`) se match hoga
  app.ws('/live/:streamKey', (ws, req) => {
    const { streamKey } = req.params
    if (!streamKey) {
      console.error('[Streaming Service] Stream key is missing. Closing connection.')
      ws.close()
      return
    }

    console.log(`[Streaming Service] WebSocket client connected for stream key: ${streamKey}`)

    const rtmpUrl = `rtmps://global-live.mux.com:443/app/${streamKey}`

    // FFMPEG command setup
    const ffmpeg = spawn('ffmpeg', [
      '-i',
      '-', // Input stdin se lein (browser se aane wala data)
      '-c:v',
      'libx264', // Video codec
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-max_muxing_queue_size',
      '1024',
      '-c:a',
      'aac', // Audio codec
      '-ar',
      '44100',
      '-b:a',
      '128k',
      '-f',
      'flv', // Output format (RTMP ke liye zaroori)
      rtmpUrl,
    ])

    // Process ko store karein
    streams[streamKey] = ffmpeg

    // FFMPEG ke logs ko console par dikhayein (debugging ke liye bohot zaroori hai)
    ffmpeg.stdout.on('data', (data) => {
      console.log(`FFMPEG (stdout) [${streamKey}]: ${data.toString()}`)
    })
    ffmpeg.stderr.on('data', (data) => {
      console.error(`FFMPEG (stderr) [${streamKey}]: ${data.toString()}`)
    })
    ffmpeg.on('close', (code) => {
      console.log(`FFMPEG [${streamKey}] process exited with code ${code}`)
      delete streams[streamKey] // Process khatam hone par cleanup karein
    })

    // Browser se jab bhi video chunk aaye
    ws.on('message', (msg) => {
      if (ffmpeg.stdin.writable) {
        // Us chunk ko foran FFMPEG ko bhej dein
        ffmpeg.stdin.write(msg)
      }
    })

    // Connection band hone par
    ws.on('close', () => {
      console.log(`[Streaming Service] WebSocket client disconnected for stream key: ${streamKey}`)
      // FFMPEG process ko bhi band kar dein
      if (streams[streamKey]) {
        streams[streamKey].kill('SIGINT')
      }
    })

    // Error handle karein
    ws.on('error', (err) => {
      console.error(`[Streaming Service] WebSocket error for ${streamKey}:`, err)
      if (streams[streamKey]) {
        streams[streamKey].kill('SIGINT')
      }
    })
  })
}

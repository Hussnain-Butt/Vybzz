require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const WebSocket = require('ws')
const url = require('url')

// Route handlers
const streamHttpRoutes = require('./routes') // HTTP routes (POST /create, etc.)
const setupStreamingRoutes = require('./streaming') // WebSocket route setup function

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ noServer: true })

const PORT = process.env.PORT || 3004

// Middlewares
app.use(cors())
app.use(express.json())

// Health Check Endpoint
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

// API Routes (HTTP)
app.use('/', streamHttpRoutes)

// Pass the WebSocketServer instance (wss) to our streaming setup.
setupStreamingRoutes(wss)

// This is the core of the fix. We listen for the HTTP 'upgrade' event.
server.on('upgrade', (request, socket, head) => {
  try {
    const pathname = url.parse(request.url).pathname

    // Only accept paths that start with /stream/live/
    if (pathname && pathname.startsWith('/stream/live/')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        // Emit connection so streaming.js can pick it up
        wss.emit('connection', ws, request)
      })
    } else {
      // For any other path, politely reject and destroy the socket
      console.warn(`[WebSocket] Rejecting connection for unknown path: ${pathname}`)
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      socket.destroy()
    }
  } catch (err) {
    console.error('[upgrade] Error handling upgrade:', err)
    try {
      socket.destroy()
    } catch (e) {
      // ignore
    }
  }
})

// Graceful shutdown wiring (so ffmpeg processes can be cleaned up by streaming module)
process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down HTTP server.')
  server.close(() => process.exit(0))
})

server.listen(PORT, () => {
  console.log('-------------------------------------------')
  console.log(`🚀 Live Streaming Service (HTTP & WS) is running on port ${PORT}`)
  console.log('-------------------------------------------')
})

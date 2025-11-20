// File: Backend/services/live-streaming-service/src/index.js (MUKAMMAL AUR SAHI CODE)

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const expressWs = require('express-ws')

// Route handlers
const streamHttpRoutes = require('./routes') // HTTP routes (POST /create, etc.)
const setupStreamingRoutes = require('./streaming') // Naye function ko import karein

const app = express()
const server = http.createServer(app)

// `express-ws` ko initialize karein. Yeh `app` object mein `.ws()` method daal dega.
const wss = expressWs(app, server)

const PORT = process.env.PORT || 3004

// Middlewares
app.use(cors())
app.use(express.json())

// Health Check Endpoint
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

// API Routes (HTTP) - Yeh pehle ki tarah kaam karenge
app.use('/', streamHttpRoutes)

// WebSocket Routes ko setup karein
// Hum yahan function ko call karke `app` object pass kar rahe hain
setupStreamingRoutes(app)

// App ke bajaye `server` ko listen karein taake WebSockets bhi kaam karein
server.listen(PORT, () => {
  console.log('-------------------------------------------')
  console.log(`🚀 Live Streaming Service (HTTP & WS) is running on port ${PORT}`)
  console.log('-------------------------------------------')
})

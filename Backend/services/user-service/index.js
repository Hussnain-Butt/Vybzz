// user-service/server.js
const express = require('express')
const path = require('path')
const cors = require('cors')
const { handleClerkWebhook } = require('./controllers/user.controller')
const userRoutes = require('./routes/user.routes')

// Load .env file for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, './.env') })
  console.log('✅ .env file loaded for local development')
}

// Global process-level error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! Unhandled Rejection at:', promise, 'reason:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('!!! Uncaught Exception thrown:', err)
})

const app = express()
const PORT = Number(process.env.PORT || 3002)

// CORS ko yahan enable karein
app.use(cors())

// Request logger
app.use((req, res, next) => {
  const start = Date.now()
  console.log(`[US] Incoming -> ${req.method} ${req.originalUrl}`)
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[US] Completed ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`)
  })
  next()
})

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Root message
app.get('/', (_req, res) => res.json({ message: 'User service is active!' }))

// ----------------------------------------------------------------
// MIDDLEWARE KI TARTEEB THEEK KARDI GAYI HAI (YAHI ASAL FIX HAI)
// ----------------------------------------------------------------

// 1. WEBHOOK ROUTE SABSE PEHLE: Yeh route express.json() se PEHLE aani chahiye.
//    Yeh express.raw() istemal karti hai taake request body signature verification
//    ke liye original format mein rahe.
app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook)

// 2. JSON PARSER AB BAAD MEIN: Yeh middleware ab un tamam routes par apply hoga
//    jo iske BAAD define ki jayengi.
app.use(express.json({ limit: '2mb' }))

// 3. API ROUTES AAKHIR MEIN: Ab yeh routes JSON body ko theek se receive karengi.
app.use('/users', userRoutes)

// Server shuru karein
app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 Users service is running on http://localhost:${PORT}`)
  if (!process.env.DATABASE_URL) {
    console.error('❌ CRITICAL ERROR: DATABASE_URL environment variable is not set!')
  } else {
    console.log('✅ DATABASE_URL is configured.')
  }
  console.log('----------------------------------------------------')
})

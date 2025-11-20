// File: Backend/services/user-service/server.js (MUKAMMAL AUR FINAL CODE)
const express = require('express')
const path = require('path')
const cors = require('cors')
const { handleClerkWebhook } = require('./controllers/user.controller')
const userRoutes = require('./routes/user.routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, './.env') })
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! Unhandled Rejection at:', promise, 'reason:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('!!! Uncaught Exception thrown:', err)
})

const app = express()
const PORT = Number(process.env.PORT || 3002)

app.use(cors())

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  console.log(`[US] Incoming -> ${req.method} ${req.originalUrl}`)
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[US] Completed ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`)
  })
  next()
})

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook)

app.use(express.json({ limit: '2mb' }))

app.use('/', userRoutes)

app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 Users service is running on http://localhost:${PORT}`)
})

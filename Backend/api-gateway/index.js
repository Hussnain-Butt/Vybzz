// api-gateway/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

// -------- Config --------
const PORT = Number(process.env.PORT || 3000)
const DOCKER = String(process.env.DOCKER || '').toLowerCase() === 'true'
const AUTH_URL =
  process.env.AUTH_URL || (DOCKER ? 'http://auth-service:3001' : 'http://localhost:3001')
const USER_URL =
  process.env.USER_URL || (DOCKER ? 'http://user-service:3002' : 'http://localhost:3002')

// -------- App setup --------
const app = express()
app.set('trust proxy', 1)

// --- CORS ko globally handle karein ---
// Yeh browser ki OPTIONS (preflight) requests ko theek se handle karega
// aur saare proxied requests ke liye bhi kaam karega. Yeh aapke purane
// cors({ origin: true, credentials: true }) se behtar hai.
app.use(cors())

// --- Global request logger ---
app.use((req, res, next) => {
  console.log(`[GW] ${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`)
  next()
})

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// -----------------------------
// WEBHOOKS ko raw forward karne ka behtar aur SAHI tareeqa
// /webhooks/* par aane wali har request ko user-service par bhej do
// Yeh aapke manual http.request wale code se 100% behtar aur stable hai.
// -----------------------------
app.use(
  '/webhooks',
  proxy(USER_URL, {
    proxyReqPathResolver: (req) => {
      // Pura path aage bhej do, jaise /webhooks/clerk
      console.log(`[GW] Forwarding RAW webhook to user-service: ${req.originalUrl}`)
      return req.originalUrl
    },
    // Yeh sabse zaroori option hai. Yeh proxy ko batata hai ke request body ko
    // parse na kare, balke usay jaisa hai waisa aage bhej de (raw format mein).
    parseReqBody: false,
  }),
)

// -------- JSON parsing baaki sab routes ke liye --------
// Yeh webhook route ke BAAD aana chahiye.
app.use(express.json({ limit: '2mb' }))

// Proxy to auth-service
app.use(
  '/auth',
  proxy(AUTH_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Proxying to AUTH service: ${req.method} ${req.url}`)
      return req.url
    },
  }),
)

// Proxy to user-service (webhook ke ilawa baaki sab routes)
app.use(
  '/users',
  proxy(USER_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Proxying to USER service: ${req.method} ${req.originalUrl}`)
      return req.originalUrl
    },
  }),
)

app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 API Gateway is listening on http://localhost:${PORT}`)
  console.log(`   -> Forwarding to AUTH_URL: ${AUTH_URL}`)
  console.log(`   -> Forwarding to USER_URL: ${USER_URL}`)
  console.log('----------------------------------------------------')
  console.log('Routes configured:')
  // Yahan route ka naam update kar diya hai taake confusion na ho
  console.log('🔔 Webhook: /webhooks/clerk -> user-service (raw body)')
  console.log('👤 API:     /users/*        -> user-service (JSON body)')
  console.log('🔐 API:     /auth/*         -> auth-service (JSON body)')
  console.log('----------------------------------------------------')
})

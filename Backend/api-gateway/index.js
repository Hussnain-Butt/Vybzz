// File: api-gateway/index.js (MUKAMMAL, FINAL, AUR SAHI CODE)

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { clerkMiddleware, requireAuth } = require('@clerk/express')

// -------- Config --------
const PORT = Number(process.env.PORT || 3000)
const DOCKER = String(process.env.DOCKER || '').toLowerCase() === 'true'

// Service URLs
const AUTH_URL = DOCKER ? 'http://auth-service:3001' : 'http://localhost:3001'
const USER_URL = DOCKER ? 'http://user-service:3002' : 'http://localhost:3002'
const POST_URL = DOCKER ? 'http://post-service:3003' : 'http://localhost:3003'
const LIVE_STREAM_URL = DOCKER ? 'http://live-streaming-service:3004' : 'http://localhost:3004'

// -------- Authentication Middleware --------
// FIX: Isko ek simple array bana diya gaya hai for better readability and usage.
const protect = [
  clerkMiddleware(),
  requireAuth(),
  (req, res, next) => {
    // === YEH SABSE BADA FIX HAI ===
    // 'req.auth' ko property ke bajaye function 'req.auth()' ke tor par call karein.
    // Yeh deprecation warning ko fix karta hai aur middleware chain ko tootne se bachata hai.
    const auth = req.auth()
    const userId = auth?.userId

    if (userId) {
      req.headers['x-user-id'] = userId // Header set karein
      console.log(`[GW Auth] User authenticated: ${userId}. Forwarding to service.`)
      return next() // Agle middleware (proxy) par jayein
    } else {
      console.warn('[GW Auth Error] User ID not found after authentication.')
      return res.status(401).json({ error: 'User ID missing after authentication.' })
    }
  },
]

// -------- App setup --------
const app = express()
app.set('trust proxy', 1)
app.use(cors())
app.use((req, res, next) => {
  console.log(`[GW] Incoming -> ${req.method} ${req.originalUrl}`)
  next()
})
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// -------- Helper for creating proxy with logging --------
const createProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true, // WebSocket support sab proxies ke liye enable kar dein
    pathRewrite,
    onProxyReq: (proxyReq, req, res) => {
      // Yeh log confirm karega ke request proxy tak pohanch gayi hai
      console.log(
        `[GW Proxy] Forwarding ${req.method} request from ${req.originalUrl} to ${target}${proxyReq.path}`,
      )
    },
    onError: (err, req, res) => {
      console.error('[GW Proxy] Error:', err)
    },
  })
}

// -------- Public Routes (In par authentication nahi chahiye) --------
app.use('/auth', createProxy(AUTH_URL))
app.use('/webhooks', createProxy(USER_URL)) // /webhooks/clerk
app.use(
  '/stream/webhooks/mux',
  createProxy(LIVE_STREAM_URL, {
    '^/stream/webhooks/mux': '/webhooks/mux',
  }),
)

// -------- Protected Routes (In par authentication lazmi hai) --------
app.use('/users', protect, createProxy(USER_URL))
app.use('/posts', protect, createProxy(POST_URL, { '^/posts': '' }))
app.use('/stream', protect, createProxy(LIVE_STREAM_URL, { '^/stream': '' }))

// -------- Server Start --------
const server = app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 API Gateway (SMART & SECURE) is listening on http://localhost:${PORT}`)
  console.log('----------------------------------------------------')
  console.log('Routes configured:')
  console.log('🔒 PROTECTED: /users/*, /posts/*, /stream/*')
  console.log('📢 PUBLIC:    /auth/*, /webhooks/*, /stream/webhooks/*')
  console.log('----------------------------------------------------')
})

server.on('upgrade', (req, socket, head) => {
  console.log(`[GW] Detected WebSocket upgrade for: ${req.url}`)
})

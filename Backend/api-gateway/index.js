// File: Backend/api-gateway/index.js (COMPLETE AND FINAL UPDATED VERSION)

require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { clerkMiddleware, requireAuth } = require('@clerk/express')

// -------- Config --------
const PORT = Number(process.env.PORT || 3000)
const DOCKER = String(process.env.DOCKER || '').toLowerCase() === 'true'

// Service URLs (dynamic based on DOCKER env variable)
const AUTH_URL = DOCKER ? 'http://auth-service:3001' : 'http://localhost:3001'
const USER_URL = DOCKER ? 'http://user-service:3002' : 'http://localhost:3002'
const POST_URL = DOCKER ? 'http://post-service:3003' : 'http://localhost:3003'
const LIVE_STREAM_URL = DOCKER ? 'http://live-streaming-service:3004' : 'http://localhost:3004'

// -------- Authentication Middleware --------
const protect = [
  clerkMiddleware(),
  requireAuth(),
  (req, res, next) => {
    // Pass Clerk user ID to downstream services
    const userId = req.auth?.userId
    if (userId) {
      req.headers['x-user-id'] = userId
      return next()
    }
    return res.status(401).json({ error: 'User ID missing after authentication.' })
  },
]

// -------- App setup --------
const app = express()
const server = http.createServer(app)
app.set('trust proxy', 1)
app.use(cors())
app.use((req, res, next) => {
  console.log(`[GW] Incoming -> ${req.method} ${req.originalUrl}`)
  next()
})
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// -------- Proxy Creation --------
const defaultProxyOptions = {
  changeOrigin: true,
  logLevel: 'debug', // Enable detailed logs to see what's happening
  onError: (err, req, res) => {
    console.error('[GW Proxy Error]', err)
    if (res && !res.headersSent) {
      res.status(502).send('Proxy error occurred')
    }
  },
}

// -------- Public Routes --------
app.use('/auth', createProxyMiddleware({ ...defaultProxyOptions, target: AUTH_URL }))
app.use('/webhooks/clerk', createProxyMiddleware({ ...defaultProxyOptions, target: USER_URL }))

// ==================================================================================
// === FINAL FIX FOR MUX WEBHOOKS (404 ERROR SOLVED)                              ===
// ==================================================================================
// Express 'app.use' path ko strip kar deta hai. Jab request '/webhooks/mux' par aati hai,
// to proxy middleware ko sirf '/' milta hai. Live service '/webhooks/mux' expect kar rahi hai.
// Isliye hum pathRewrite use karke path ko forcefully wapis '/webhooks/mux' set kar rahe hain.
app.use(
  '/webhooks/mux',
  createProxyMiddleware({
    ...defaultProxyOptions,
    target: LIVE_STREAM_URL,
    pathRewrite: () => '/webhooks/mux', // Force the path to be exactly this
  }),
)

// ==================================================================================
// === PROTECTED ROUTES (Path Stripping logic remains for these)                  ===
// ==================================================================================

app.use(
  '/users',
  protect,
  createProxyMiddleware({
    ...defaultProxyOptions,
    target: USER_URL,
    pathRewrite: { '^/users': '' }, // Rewrite /users/me to /me
  }),
)

app.use(
  '/posts',
  protect,
  createProxyMiddleware({
    ...defaultProxyOptions,
    target: POST_URL,
    pathRewrite: { '^/posts': '' }, // Rewrite /posts to / and /posts/123 to /123
  }),
)

// -------- Streaming Routes (Special Handling) --------
// 1. HTTP routes for streaming (e.g., /stream/create) - PROTECTED
app.use(
  '/stream',
  protect,
  createProxyMiddleware({
    ...defaultProxyOptions,
    target: LIVE_STREAM_URL,
    ws: false,
    pathRewrite: { '^/stream': '' }, // Rewrite /stream/create to /create
  }),
)

// 2. WebSocket proxy for the actual live stream - PUBLIC
// Note: We do NOT use pathRewrite here because WebSocket upgrades handle the URL differently
// and live-streaming-service expects the full path for validation.
const wsProxy = createProxyMiddleware({
  ...defaultProxyOptions,
  target: LIVE_STREAM_URL,
  ws: true,
})
app.use('/stream/live', wsProxy)

// -------- WebSocket Upgrade Handling --------
server.on('upgrade', (req, socket, head) => {
  const pathname = req.url || ''
  if (pathname.startsWith('/stream/live/')) {
    console.log(`[GW] Delegating WebSocket upgrade for ${pathname} to wsProxy.`)
    wsProxy.upgrade(req, socket, head)
  } else {
    console.warn(`[GW] No WebSocket proxy configured for ${pathname}. Destroying socket.`)
    socket.destroy()
  }
})

// -------- Server Start --------
server.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 API Gateway is listening on http://localhost:${PORT}`)
  console.log('----------------------------------------------------')
  console.log('Routes configured:')
  console.log('🔒 PROTECTED: /users, /posts, /stream (for HTTP create)')
  console.log('📢 PUBLIC:    /auth, /webhooks, /stream/live (for WebSocket)')
  console.log('----------------------------------------------------')
})

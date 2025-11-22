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
const protect = [
  clerkMiddleware(),
  requireAuth(),
  (req, res, next) => {
    const auth = req.auth
    const userId = auth?.userId

    if (userId) {
      req.headers['x-user-id'] = userId
      console.log(`[GW Auth] User authenticated: ${userId}. Forwarding to service.`)
      return next()
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
    ws: true, // WebSocket support is enabled
    pathRewrite,
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[GW Proxy] Forwarding ${req.method} request from ${req.originalUrl} to ${target}${proxyReq.path}`,
      )
    },
    onError: (err, req, res) => {
      console.error('[GW Proxy] Error:', err)
    },
  })
}

// =================================================================
// === ROUTING SECTION ===
// =================================================================

// -------- Public Routes (No authentication required) --------
app.use('/auth', createProxy(AUTH_URL))

// --- Clerk Webhook Rule ---
app.use(
  '/webhooks/clerk',
  createProxy(USER_URL, {
    '^/webhooks/clerk': '/webhooks/clerk',
  }),
)

// --- Mux Webhook Rule ---
app.use(
  '/webhooks/mux',
  createProxy(LIVE_STREAM_URL, {
    '^/webhooks/mux': '/webhooks/mux',
  }),
)

// -------- Protected Routes (Authentication required) --------
app.use('/users', protect, createProxy(USER_URL))
app.use('/posts', protect, createProxy(POST_URL, { '^/posts': '' }))

// =================================================================
// === FIX: REMOVED pathRewrite FROM STREAM PROXY ===
// We want to forward the *entire* path (e.g., /stream/live/stream_key)
// to the streaming service, not just a part of it.
// =================================================================
app.use('/stream', protect, createProxy(LIVE_STREAM_URL))

// -------- Server Start --------
const server = app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 API Gateway (SMART & SECURE) is listening on http://localhost:${PORT}`)
  console.log('----------------------------------------------------')
  console.log('Routes configured:')
  console.log('🔒 PROTECTED: /users/*, /posts/*, /stream/*')
  console.log('📢 PUBLIC:    /auth/*, /webhooks/clerk, /webhooks/mux')
  console.log('----------------------------------------------------')
})

// This is necessary for the proxy to handle WebSocket upgrades.
server.on('upgrade', (req, socket, head) => {
  console.log(`[GW] Detected WebSocket upgrade for: ${req.url}`)
  // The http-proxy-middleware attached to the '/stream' route will automatically handle this.
})

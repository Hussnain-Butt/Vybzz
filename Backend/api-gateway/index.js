require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { clerkMiddleware, requireAuth } = require('@clerk/express')

// -------- Config --------
const PORT = Number(process.env.PORT || 3000)
const DOCKER = String(process.env.DOCKER || '').toLowerCase() === 'true'

const AUTH_URL = DOCKER ? 'http://auth-service:3001' : 'http://localhost:3001'
const USER_URL = DOCKER ? 'http://user-service:3002' : 'http://localhost:3002'
const POST_URL = DOCKER ? 'http://post-service:3003' : 'http://localhost:3003'
const LIVE_STREAM_URL = DOCKER ? 'http://live-streaming-service:3004' : 'http://localhost:3004'

// -------- Authentication Middleware --------
const protect = () => {
  return [
    clerkMiddleware(),
    requireAuth(),
    (req, res, next) => {
      // HAL: Clerk ki deprecation warning ko fix kiya gaya hai.
      // Naye @clerk/express ke mutabiq req.auth se userId aise hasil ki jaati hai.
      const userId = req.auth?.userId
      if (userId) {
        req.headers['x-user-id'] = userId
        console.log(`[GW Auth] User authenticated: ${userId}`)
        next()
      } else {
        console.warn('[GW Auth Warning] User ID not found after authentication.')
        return res.status(401).json({ error: 'User ID missing after authentication.' })
      }
    },
  ]
}

// -------- App setup --------
const app = express()
app.set('trust proxy', 1)
app.use(cors())
app.use((req, res, next) => {
  console.log(`[GW] ${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`)
  next()
})
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// -------- Public Routes (In par authentication nahi chahiye) --------
// Yeh proxy /webhooks/* ki tamam requests ko user-service par bhej dega.
app.use('/webhooks', createProxyMiddleware({ target: USER_URL, changeOrigin: true }))
app.use('/auth', createProxyMiddleware({ target: AUTH_URL, changeOrigin: true }))
app.use(
  '/stream/webhooks/mux', // Mux webhooks
  createProxyMiddleware({
    target: LIVE_STREAM_URL,
    changeOrigin: true,
    pathRewrite: { '^/stream': '' },
  }),
)

// -------- Protected Routes (In par authentication lazmi hai) --------

const userProxy = createProxyMiddleware({
  target: USER_URL,
  changeOrigin: true,

  onProxyReq: (proxyReq, req, res) => {
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('x-user-id', req.headers['x-user-id'])
    }
  },
})

const postProxy = createProxyMiddleware({
  target: POST_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/posts': '/', // Yeh maan kar ke post-service root paths expect karti hai
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('x-user-id', req.headers['x-user-id'])
    }
  },
})

const streamProxy = createProxyMiddleware({
  target: LIVE_STREAM_URL,
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/stream': '/',
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('x-user-id', req.headers['x-user-id'])
    }
  },
})

app.use('/users', protect(), userProxy)
app.use('/posts', protect(), postProxy)
app.use('/stream', protect(), streamProxy)

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

// WebSocket ko handle karne ke liye
server.on('upgrade', (req, socket, head) => {
  console.log('[GW] Detected WebSocket upgrade request.')
})

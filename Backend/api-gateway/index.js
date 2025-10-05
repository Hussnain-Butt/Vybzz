// api-gateway/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

// -------- Config (works local + Docker) --------
const PORT = Number(process.env.PORT || 3000)

// If DOCKER=true, use container DNS names; else localhost ports
const DOCKER = String(process.env.DOCKER || '').toLowerCase() === 'true'

const AUTH_URL =
  process.env.AUTH_URL || (DOCKER ? 'http://auth-service:3000' : 'http://localhost:3001')

const USER_URL =
  process.env.USER_URL || (DOCKER ? 'http://user-service:3000' : 'http://localhost:3002')

// -------- App setup --------
const app = express()
app.set('trust proxy', 1)
app.use(cors({ origin: true, credentials: true }))

// Health first (so compose healthcheck passes immediately)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// -------- Clerk webhook (RAW body forward; no JSON parsing) --------
// This route is PUBLIC and relies on Svix signature verification in the user-service.
// It MUST come BEFORE any JSON body parser and BEFORE Clerk JWT auth.
app.use('/users/clerk', (req, _res, next) => {
  console.log(
    '[GW] incoming WEBHOOK',
    req.method,
    req.originalUrl,
    'len=',
    req.headers['content-length'] || 0,
  )
  next()
})

// RAW proxy to users-service /clerk
app.use(
  '/users/clerk',
  proxy(USER_URL, {
    // IMPORTANT: The path inside user-service is just '/clerk'
    // but the user-service itself mounts the handler at '/users/clerk'.
    // We need to adjust the path resolver to send it to the correct internal path.
    // Based on your user-service code: app.post('/users/clerk', ...),
    // the full path is required. So the default resolver is correct.
    // Let's proxy to '/users/clerk'.
    proxyReqPathResolver: (req) => req.originalUrl,
    parseReqBody: false, // << very important for webhooks
    timeout: 15_000,
    proxyErrorHandler: (err, res, next) => {
      console.error('[GW] /users/clerk upstream error:', err?.message)
      if (!res.headersSent) {
        res.status(502).json({ error: 'upstream_error', detail: err?.message })
      } else {
        next(err)
      }
    },
  }),
)

// -------- JSON parsing AFTER webhook --------
app.use(express.json({ limit: '1mb' }))

// -------- Regular service proxies --------

// Auth service proxy does not need protection as it might handle sign-in related logic.
// Or you can add ClerkExpressRequireAuth() here as well if needed.
app.use(
  '/auth',
  proxy(AUTH_URL, {
    timeout: 15_000,
    proxyErrorHandler: (err, res, next) => {
      console.error('[GW] /auth upstream error:', err?.message)
      if (!res.headersSent) {
        res.status(502).json({ error: 'upstream_error', detail: err?.message })
      } else {
        next(err)
      }
    },
  }),
)

// ✅ PROTECTED USER SERVICE PROXY
// All requests to '/users' (except '/users/clerk' handled above) will now require a valid JWT.
// If the token is invalid, Clerk middleware will automatically return a 401 Unauthorized error.
app.use(
  '/users',
  ClerkExpressRequireAuth(), // <<<< THIS IS THE AUTHENTICATION MIDDLEWARE
  (req, res, next) => {
    console.log(`[GW] Authenticated user ${req.auth.userId} accessing ${req.originalUrl}`)
    next()
  },
  proxy(USER_URL, {
    timeout: 15_000,
    proxyErrorHandler: (err, res, next) => {
      console.error('[GW] /users upstream error:', err?.message)
      if (!res.headersSent) {
        res.status(502).json({ error: 'upstream_error', detail: err?.message })
      } else {
        next(err)
      }
    },
  }),
)

// -------- Start --------
app.listen(PORT, () => {
  console.log(`🚀 Gateway listening on http://localhost:${PORT}`)
  console.log(`   AUTH_URL  -> ${AUTH_URL}`)
  console.log(`   USER_URL  -> ${USER_URL}`)
  console.log('🔔 Webhook: POST /users/clerk  ->  users-service:/users/clerk (raw)')
  console.log('🔒 Protected Route: /users/*')
})

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
const POST_URL =
  process.env.POST_URL || (DOCKER ? 'http://post-service:3003' : 'http://localhost:3003')

// -------- App setup --------
const app = express()
app.set('trust proxy', 1)

app.use(cors())

app.use((req, res, next) => {
  console.log(`[GW] ${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`)
  next()
})

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use(
  '/webhooks',
  proxy(USER_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Forwarding RAW webhook to user-service: ${req.originalUrl}`)
      return req.originalUrl
    },
    parseReqBody: false,
  }),
)

app.use(
  '/auth',
  proxy(AUTH_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Proxying to AUTH service: ${req.method} ${req.url}`)
      return req.url
    },
  }),
)

app.use(
  '/users',
  proxy(USER_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Proxying to USER service: ${req.method} ${req.originalUrl}`)
      return req.originalUrl
    },
    parseReqBody: false,
  }),
)

app.use(
  '/posts',
  proxy(POST_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Proxying to POST service: ${req.method} ${req.originalUrl}`)
      return req.originalUrl
    },
    // Files aur JSON dono ko handle karne ke liye
    parseReqBody: false,
  }),
)

app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 API Gateway is listening on http://localhost:${PORT}`)
  console.log(`   -> Forwarding to AUTH_URL: ${AUTH_URL}`)
  console.log(`   -> Forwarding to USER_URL: ${USER_URL}`)
  console.log(`   -> Forwarding to POST_URL: ${POST_URL}`)
  console.log('----------------------------------------------------')
  console.log('Routes configured:')
  console.log('🔔 Webhook: /webhooks/clerk -> user-service (raw body)')
  console.log('👤 API:     /users/*        -> user-service (raw body for JSON & files)')
  console.log('🔐 API:     /auth/*         -> auth-service (JSON body)')
  console.log('✍️  API:     /posts/*        -> post-service (raw body for JSON & files)')
  console.log('----------------------------------------------------')
})

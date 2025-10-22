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
// aur saare proxied requests ke liye bhi kaam karega.
app.use(cors())

// --- Global request logger ---
app.use((req, res, next) => {
  console.log(`[GW] ${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`)
  next()
})

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// -----------------------------
// WEBHOOKS ko raw forward karne ka tareeqa
// /webhooks/* par aane wali har request ko user-service par bhej do
// -----------------------------
app.use(
  '/webhooks',
  proxy(USER_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Forwarding RAW webhook to user-service: ${req.originalUrl}`)
      return req.originalUrl
    },
    // Yeh proxy ko batata hai ke request body ko parse na kare (raw format mein rakhe).
    parseReqBody: false,
  }),
)

// -------- JSON parsing (SIRF UN ROUTES KE LIYE JO JSON HAIN) --------
// Isko alag se define karna zaroori nahi kyunke proxy ab body ko khud handle nahi kar raha.
// Destination service (user-service) ab body parsing ki zimmedar hai.
// app.use(express.json({ limit: '2mb' })) // Iski ab yahan zaroorat nahi.

// Proxy to auth-service
app.use(
  '/auth',
  proxy(AUTH_URL, {
    proxyReqPathResolver: (req) => {
      console.log(`[GW] Proxying to AUTH service: ${req.method} ${req.url}`)
      return req.url
    },
    // auth-service sirf JSON istemal karta hai, isliye yahan parseReqBody ki zaroorat nahi.
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
    // === YEH HAI IMAGE UPLOAD KA FINAL FIX ===
    // Is option (`parseReqBody: false`) se API Gateway ab file uploads
    // (multipart/form-data) aur JSON requests, dono ko baghair process kiye
    // seedha user-service tak pohncha dega.
    parseReqBody: false,
  }),
)

app.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`🚀 API Gateway is listening on http://localhost:${PORT}`)
  console.log(`   -> Forwarding to AUTH_URL: ${AUTH_URL}`)
  console.log(`   -> Forwarding to USER_URL: ${USER_URL}`)
  console.log('----------------------------------------------------')
  console.log('Routes configured:')
  console.log('🔔 Webhook: /webhooks/clerk -> user-service (raw body)')
  // Log message ko update kar diya hai
  console.log('👤 API:     /users/*        -> user-service (raw body for JSON & files)')
  console.log('🔐 API:     /auth/*         -> auth-service (JSON body)')
  console.log('----------------------------------------------------')
})

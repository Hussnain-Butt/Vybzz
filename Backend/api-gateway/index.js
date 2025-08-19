// api-gateway/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

const app = express()
const port = 4000

app.use(cors())

// 🔎 Debug log: dekhna hai request aa bhi rahi hai?
app.use('/users/clerk', (req, _res, next) => {
  console.log('[GW] incoming', req.method, req.originalUrl, 'len=', req.headers['content-length'])
  next()
})

// ✅ Clerk webhook: RAW forward, no body parsing
app.use(
  '/users/clerk',
  proxy('http://localhost:3002', {
    proxyReqPathResolver: () => '/clerk', // users-service route
    parseReqBody: false, // <<< most important
  }),
)

// Ab yahan JSON parser lagao
app.use(express.json())

// Baqi services
app.use('/auth', proxy('http://localhost:3001'))
app.use('/users', proxy('http://localhost:3002'))

app.listen(port, () => {
  console.log(`🚀 Gateway http://localhost:${port}`)
  console.log('🔔 Webhook: POST /users/clerk  ->  :3002/clerk (raw)')
})

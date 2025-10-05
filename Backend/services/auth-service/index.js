// auth-service/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

const app = express()
const PORT = Number(process.env.PORT || 3001)

// enable CORS if other services / frontend will call this API
app.use(cors())
app.use(express.json())

// ✅ Health endpoint for docker-compose healthcheck
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ✅ Protected route
// This middleware verifies the Authorization header’s token.
// If token is invalid, a 401 Unauthorized is returned automatically.
app.get('/verify', ClerkExpressRequireAuth(), (req, res) => {
  // If token is valid, req.auth contains the user session claims.
  res.status(200).json(req.auth)
})

app.listen(PORT, () => {
  console.log(`🚀 Auth service is running on http://localhost:${PORT}`)
})

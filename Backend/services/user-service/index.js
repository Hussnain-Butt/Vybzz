// user-service/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { handleClerkWebhook } = require('./controllers/user.controller')
const userRoutes = require('./routes/user.routes')

const app = express()
const PORT = Number(process.env.PORT || 3002)

app.use(cors())

// ✅ Clerk webhook: keep RAW body BEFORE express.json
// (for signature verification we must NOT parse body)
app.post('/users/clerk', express.raw({ type: '*/*' }), handleClerkWebhook)

// ✅ Normal APIs – after webhook raw handler
app.use(express.json())

app.get('/', (_req, res) => res.json({ message: 'User service is active!' }))

// 🔁 Mount router at /users (so internal paths are '/', '/by-clerk/:id', etc.)
app.use('/users', userRoutes)

// ✅ Health endpoint for docker-compose healthcheck
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`🚀 Users service is running on http://localhost:${PORT}`)
})

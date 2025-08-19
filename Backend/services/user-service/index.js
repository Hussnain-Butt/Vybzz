require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { handleClerkWebhook } = require('./controllers/user.controller')
const userRoutes = require('./routes/user.routes')

const app = express()
const port = process.env.PORT || 3002

app.use(cors())

// Clerk webhook: keep RAW + before json
app.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook)

// normal APIs
app.use(express.json())
app.get('/', (_req, res) => res.json({ message: 'User service is active!' }))

// 🔁 mount router at /users (so paths inside are '/', '/by-clerk/:id')
app.use('/users', userRoutes)

app.listen(port, () => {
  console.log(`🚀 Users service http://localhost:${port}`)
})

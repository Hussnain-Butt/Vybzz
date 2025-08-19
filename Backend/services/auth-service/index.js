require('dotenv').config()
const express = require('express')
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

const app = express()
const port = 3001

// Yeh middleware 'Authorization' header se token ko verify karega.
// Agar token valid nahin hai, to yeh 401 Unauthorized error bhejega.
app.get('/verify', ClerkExpressRequireAuth(), (req, res) => {
  // Agar token valid hai, to req.auth mein user data (session claims) hoga.
  // Hum woh data wapas bhej rahe hain.
  res.status(200).json(req.auth)
})

app.listen(port, () => {
  console.log(`🚀 Auth service is running on http://localhost:${port}`)
})

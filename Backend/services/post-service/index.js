// File: Backend/services/post-service/server.js (COMPLETE AND FINAL UPDATED VERSION)

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const postRoutes = require('./routes/post.routes')
const { prisma } = require('./db/prisma') // Prisma client ko import karein
const internalRoutes = require('./routes/internal.routes') // <-- Naya route import karein

const PORT = process.env.PORT || 3003
const app = express()

// Middleware
app.use(cors())
// JSON payload ki limit barhayi gayi hai taake badi files (base64) bhi handle ho sakein
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// =================================================================
// === YEH SABSE ZAROORI CHANGE HAI ===
// =================================================================
// API Gateway pehle se hi `/posts` ke requests ko is service par bhej raha hai.
// Isliye, is service ko dobara `/posts` prefix lagane ki zaroorat nahi hai.
// Hum yahan root path (`/`) par routes ko mount karenge.
// Pehle: app.use('/posts', postRoutes)
// Ab: app.use('/', postRoutes)
app.use('/', postRoutes)

// ----------------------------------------------------------------
// YAHAN SE UPDATE HUA HAI - DATABASE CONNECTION LOGIC
// ----------------------------------------------------------------
app.use('/internal', internalRoutes) // <-- Naye internal routes yahan register karein

// Server ko start karne wala function
const startServer = async () => {
  try {
    // Database se connect karne ki koshish karein
    await prisma.$connect()
    console.log('✅ Database connected successfully!')

    // Connection kamyaab hone ke baad hi server ko requests sunne ke liye start karein
    app.listen(PORT, () => {
      console.log('-----------------------------------')
      console.log(`🚀 Post Service running on port ${PORT}`)
      console.log('-----------------------------------')
    })
  } catch (error) {
    console.error('❌ Failed to connect to the database. Shutting down.', error)
    // Agar DB se connect na ho, to process ko band kar dein taake Docker isay restart kare
    process.exit(1)
  }
}

// Server start karne ke liye function ko call karein
startServer()

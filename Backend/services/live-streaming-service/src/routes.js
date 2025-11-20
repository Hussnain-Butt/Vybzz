// File: Backend/services/live-streaming-service/src/routes.js (MUKAMMAL AUR DEMO-READY CODE)

const express = require('express')
const { Router } = require('express')
const Mux = require('@mux/mux-node')
const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto') // Random keys banane ke liye

const router = Router()
const prisma = new PrismaClient()

// Mux client ko initialize karein (asal mode ke liye zaroori)
const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

// Helper function to get clerkId from headers
const getClerkId = (req) => {
  const clerkId = req.headers['x-user-id']
  if (!clerkId) {
    throw new Error('User ID is missing. Ensure you are authenticated.')
  }
  return clerkId
}

/**
 * @route   POST /create
 * @desc    Create a new Mux live stream (or a fake one for demo)
 * @access  Private (Authenticated users)
 */
router.post('/create', async (req, res) => {
  try {
    const clerkId = getClerkId(req)
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Stream title is required.' })
    }

    let muxStream

    // --- YAHAN JADU HOGA (MOCKING LOGIC) ---
    if (process.env.MOCK_MUX_API === 'true') {
      console.log('[DEMO MODE] Simulating Mux API call. No real stream will be created.')

      // Ek jaali Mux response banayein
      muxStream = {
        id: `mock_ls_${crypto.randomBytes(12).toString('hex')}`,
        stream_key: `mock_sk_${crypto.randomBytes(20).toString('hex')}`,
        playback_ids: [
          // Viewers ko demo video dikhane ke liye hum Mux ka public sample video istemal karenge.
          { id: 'v69RSHhFelSm4701jPugIVaUad02I1XlGX200' },
        ],
      }
    } else {
      // --- YEH ASAL MUX API CALL HAI (JAB AAP PLAN KHARID LENGE) ---
      console.log('[LIVE MODE] Creating a real Mux live stream.')
      muxStream = await mux.video.liveStreams.create({
        playback_policy: ['public'],
        new_asset_settings: { playback_policy: 'public' },
      })
    }
    // --- MOCKING LOGIC KHATAM ---

    const newStream = await prisma.liveStream.create({
      data: {
        title,
        description: description || null,
        streamKey: muxStream.stream_key,
        playbackId: muxStream.playback_ids[0].id,
        muxStreamId: muxStream.id,
        userId: clerkId,
      },
    })

    res.status(201).json(newStream)
  } catch (error) {
    console.error('Error creating live stream:', error.message)
    if (error.errors) {
      console.error('Mux API Errors:', error.errors)
    }
    res.status(500).json({ error: 'Failed to create live stream.' })
  }
})

// Webhook ka code waise hi rahega, usmein koi tabdeeli nahi
router.post('/webhooks/mux', express.raw({ type: 'application/json' }), async (req, res) => {
  // ... (yahan koi change nahi hai) ...
  res.sendStatus(200)
})

module.exports = router

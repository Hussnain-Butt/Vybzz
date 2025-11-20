// File: Backend/services/live-streaming-service/src/routes.js (MUKAMMAL AUR FINAL CODE)

const express = require('express')
const { Router } = require('express')
const Mux = require('@mux/mux-node')
const { PrismaClient } = require('@prisma/client')

const router = Router()
const prisma = new PrismaClient()
const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

// Helper function to get clerkId from headers
const getClerkId = (req) => {
  const clerkId = req.headers['x-user-id'] // Gateway se clerkId is header mein aayegi
  if (!clerkId) {
    throw new Error('User ID is missing. Ensure you are authenticated.')
  }
  return clerkId
}

/**
 * @route   POST /create
 * @desc    Create a new Mux live stream and save its details
 * @access  Private (Authenticated users)
 */
router.post('/create', async (req, res) => {
  try {
    const clerkId = getClerkId(req)
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Stream title is required.' })
    }

    // Pehle user ko clerkId ke zariye dhoondein ya create karein (UPSERT)
    const user = await prisma.user.upsert({
      where: { clerkId: clerkId },
      update: {}, // Agar user mil jaye to kuch update nahi karna
      create: { clerkId: clerkId }, // Agar na miley to naya user banayein
    })

    const muxStream = await Video.LiveStreams.create({
      playback_policy: 'public',
      new_asset_settings: { playback_policy: 'public' },
    })

    const newStream = await prisma.liveStream.create({
      data: {
        title,
        description,
        streamKey: muxStream.stream_key,
        playbackId: muxStream.playback_ids[0].id,
        muxStreamId: muxStream.id,
        userId: user.id, // Yahan ab sahi user.id istemal hogi
      },
    })

    res.status(201).json(newStream)
  } catch (error) {
    console.error('Error creating live stream:', error.message)
    res.status(500).json({ error: 'Failed to create live stream.' })
  }
})

/**
 * @route   POST /webhooks/mux
 * @desc    Handle webhooks from Mux to update stream status
 * @access  Public
 */
router.post('/webhooks/mux', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['mux-signature']
  if (!signature) {
    return res.status(400).send('Mux signature is missing.')
  }
  try {
    const event = Mux.Webhooks.verifyHeader(
      req.body,
      signature,
      process.env.MUX_WEBHOOK_SIGNING_SECRET,
    )
    const { type, data: muxStream } = event

    if (type === 'video.live_stream.active') {
      await prisma.liveStream.updateMany({
        where: { muxStreamId: muxStream.id },
        data: { isLive: true },
      })
    } else if (type === 'video.live_stream.idle') {
      await prisma.liveStream.updateMany({
        where: { muxStreamId: muxStream.id },
        data: { isLive: false },
      })
    }
    res.sendStatus(200)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

module.exports = router

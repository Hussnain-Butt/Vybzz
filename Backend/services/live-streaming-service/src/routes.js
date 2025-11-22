const express = require('express')
const { Router } = require('express')
const Mux = require('@mux/mux-node')
const { PrismaClient } = require('@prisma/client')
const axios = require('axios') // <-- Axios ko import karein

const router = Router()
const prisma = new PrismaClient()

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

// Service URLs (Internal communication ke liye)
const POST_SERVICE_URL =
  String(process.env.DOCKER || '').toLowerCase() === 'true'
    ? 'http://post-service:3003'
    : 'http://localhost:3003'

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

    // Yeh setting Mux ko batati hai ke stream khatam hone par ek asset (video) record karein.
    // Yeh VOD (Video on Demand) feature ke liye bohot zaroori hai.
    const muxStream = await mux.video.liveStreams.create({
      playback_policy: ['public'],
      new_asset_settings: { playback_policy: 'public' },
    })

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

/**
 * @route   POST /webhooks/mux
 * @desc    Handle webhooks from Mux to update stream status and create VODs
 * @access  Public
 */
router.post('/webhooks/mux', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = mux.webhooks.verifyHeader(
      req.body,
      req.headers['mux-signature'],
      process.env.MUX_WEBHOOK_SIGNING_SECRET,
    )

    const { type, data: eventData } = event

    console.log(`[Mux Webhook] Received event: ${type}`)

    switch (type) {
      case 'video.live_stream.active':
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: true },
        })
        console.log(`[Mux Webhook] Stream ${eventData.id} is now LIVE.`)
        break

      case 'video.live_stream.idle':
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: false },
        })
        console.log(`[Mux Webhook] Stream ${eventData.id} is now IDLE.`)
        break

      // === YEH NAYA AUR SABSE ZAROORI HISSA HAI ===
      // Jab Mux live stream ko record karke asset bana dega, yeh event aayega
      case 'video.asset.ready':
        // Sirf un assets ko process karein jo live stream se bane hain
        if (eventData.live_stream_id) {
          console.log(`[Mux Webhook] Asset ready for live_stream_id: ${eventData.live_stream_id}`)

          // Asal live stream ki details database se nikalein
          const originalStream = await prisma.liveStream.findFirst({
            where: { muxStreamId: eventData.live_stream_id },
          })

          if (originalStream) {
            console.log(`[Mux Webhook] Found original stream for user: ${originalStream.userId}`)
            // Post-Service ko internal request bhej kar naya post banwayein
            try {
              await axios.post(`${POST_SERVICE_URL}/internal/create-post-from-stream`, {
                creatorId: originalStream.userId,
                title: `${originalStream.title} (Replay)`,
                description:
                  originalStream.description || 'Watch the replay of my recent live stream!',
                muxPlaybackId: eventData.playback_ids[0].id,
                muxAssetId: eventData.id,
              })
              console.log(
                `[Mux Webhook] Successfully requested post creation for user ${originalStream.userId}.`,
              )
            } catch (apiError) {
              console.error(
                '[Mux Webhook] FAILED to call Post Service:',
                apiError.response ? apiError.response.data : apiError.message,
              )
            }
          } else {
            console.warn(
              `[Mux Webhook] Could not find original stream for muxStreamId: ${eventData.live_stream_id}`,
            )
          }
        }
        break

      default:
        // Baaki events ko ignore karein
        break
    }

    res.sendStatus(200)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

module.exports = router

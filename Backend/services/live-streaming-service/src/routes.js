// Backend/services/live-streaming-service/routes.js

const express = require('express')
const { Router } = require('express')
const Mux = require('@mux/mux-node')
const { Webhooks } = require('@mux/mux-node')
const { PrismaClient } = require('@prisma/client')
const axios = require('axios')

const router = Router()
const prisma = new PrismaClient()

// Mux Initialization
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

// =========================================================
// === FINAL DOCKER FIX: URL CONFIGURATION ===
// =========================================================
// Aap Docker use kar rahe hain, isliye hum 'post-service' (container name)
// use karenge. 127.0.0.1 Docker containers ke beech kaam nahi karta.
const POST_SERVICE_URL = 'http://post-service:3003'

console.log('----------------------------------------------------')
console.log(`[Streaming Service] Post Service URL set to: ${POST_SERVICE_URL}`)
console.log('----------------------------------------------------')

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
 */
router.post('/create', async (req, res) => {
  try {
    const clerkId = getClerkId(req)
    const { title, description, tags, thumbnailUrl } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Stream title is required.' })
    }

    const muxStream = await mux.video.liveStreams.create({
      playback_policy: ['public'],
      new_asset_settings: {
        playback_policy: ['public'],
      },
    })

    const newStream = await prisma.liveStream.create({
      data: {
        title,
        description: description || null,
        tags: tags || [],
        thumbnailUrl: thumbnailUrl || null,
        streamKey: muxStream.stream_key,
        playbackId: muxStream.playback_ids[0].id,
        muxStreamId: muxStream.id,
        userId: clerkId,
      },
    })

    res.status(201).json(newStream)
  } catch (error) {
    console.error('[Stream Create] Error:', error.message)
    res.status(500).json({ error: 'Failed to create live stream.' })
  }
})

/**
 * @route   POST /webhooks/mux
 * @desc    Handle webhooks from Mux to update stream status and create VODs
 */
router.post('/webhooks/mux', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7) // Unique ID for tracking logs

  try {
    const rawBody = req.body.toString('utf8')
    const signature = req.headers['mux-signature']

    // ✅ FIX: Secret key se accidental spaces remove karna (trim)
    const secret = (process.env.MUX_WEBHOOK_SIGNING_SECRET || '').trim()

    // Debugging Log: Secret ke last 5 digits print karein taake confirm ho
    if (!secret) {
      console.error(`[Webhook ${requestId}] ❌ Secret Key is MISSING in .env!`)
      return res.status(500).send('Server Configuration Error: Missing Webhook Secret')
    }
    console.log(`[Webhook ${requestId}] 🔐 Verifying with Secret ending in: ...${secret.slice(-5)}`)

    // 1. Signature Verification
    let event
    try {
      const webhooks = new Webhooks(secret)
      event = webhooks.verifySignature(rawBody, signature)
    } catch (verifyError) {
      console.error(`[Webhook ${requestId}] ❌ Signature Verification Failed!`)
      console.error(`[Webhook ${requestId}] Reason: ${verifyError.message}`)

      // Development Fallback (Optional: Remove in production strict mode)
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Webhook ${requestId}] ⚠️ Parsing manually (DEV MODE fallback).`)
        event = JSON.parse(rawBody)
      } else {
        return res.status(400).send(`Webhook Error: ${verifyError.message}`)
      }
    }

    const { type, data: eventData } = event

    // Log only relevant events
    if (type.includes('live_stream') || type.includes('asset')) {
      console.log(`[Webhook ${requestId}] 📨 Event Type: ${type} | ID: ${eventData.id}`)
    }

    switch (type) {
      // --- STREAM LIVE STATUS ---
      case 'video.live_stream.active':
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: true },
        })
        console.log(`[Webhook ${requestId}] 🔴 Stream is now LIVE`)
        break

      case 'video.live_stream.idle':
      case 'video.live_stream.disconnected':
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: false },
        })
        console.log(`[Webhook ${requestId}] ⚫ Stream is now OFFLINE`)
        break

      // --- VOD / POST CREATION LOGIC ---
      // ✅ FIX: Sirf 'video.asset.ready' event handle karenge to avoid duplicate posts
      case 'video.asset.ready':
        // Sirf un assets ko process karein jo live stream se bane hain
        if (eventData.live_stream_id) {
          console.log(`[Webhook ${requestId}] 🎬 VOD Event Triggered. Asset ID: ${eventData.id}`)

          // Step A: Database se stream dhundien
          const originalStream = await prisma.liveStream.findFirst({
            where: { muxStreamId: eventData.live_stream_id },
          })

          if (!originalStream) {
            console.warn(`[Webhook ${requestId}] ⚠️ Stream not found in DB.`)
            break
          }

          console.log(`[Webhook ${requestId}] ✅ Found original stream: "${originalStream.title}"`)

          // ✅ NEW: Check if already processed
          if (originalStream.processed) {
            console.log(`[Webhook ${requestId}] ⚠️ Stream already processed, skipping...`)
            break
          }

          // Validate Playback ID
          const muxPlaybackId = eventData.playback_ids?.[0]?.id
          if (!muxPlaybackId) {
            console.error(`[Webhook ${requestId}] ❌ No playback IDs found in asset!`)
            break
          }

          // Step B: Payload tayyar karein
          const postPayload = {
            creatorId: originalStream.userId,
            title: originalStream.title,
            description: originalStream.description || 'Watch the replay of my live stream!',
            tags: originalStream.tags || [],
            thumbnailUrl: originalStream.thumbnailUrl,
            muxPlaybackId: muxPlaybackId,
            muxAssetId: eventData.id,
          }

          // Step C: Post Service ko call karein (USING DOCKER SERVICE NAME)
          const targetUrl = `${POST_SERVICE_URL}/internal/create-post-from-stream`
          console.log(`[Webhook ${requestId}] 📤 Sending request to: ${targetUrl}`)

          try {
            const response = await axios.post(targetUrl, postPayload, {
              timeout: 10000, // 10 seconds timeout
              headers: { 'Content-Type': 'application/json' },
            })

            console.log(
              `[Webhook ${requestId}] 🎉 SUCCESS! Post Service Responded: ${response.status}`,
            )
            console.log(`[Webhook ${requestId}] 🆔 New Post ID: ${response.data?.id}`)

            // ✅ NEW: Mark stream as processed
            await prisma.liveStream.update({
              where: { id: originalStream.id },
              data: { processed: true },
            })
            console.log(`[Webhook ${requestId}] ✅ Marked stream as processed`)
          } catch (apiError) {
            console.error(`[Webhook ${requestId}] ❌ FAILED to create VOD post!`)

            if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ENOTFOUND') {
              console.error(`[Webhook ${requestId}] ❌ Connection Failed to: ${POST_SERVICE_URL}`)
              console.error(
                `[Webhook ${requestId}] 👉 Docker Networking Issue. Ensure containers are on the same network.`,
              )
            } else if (apiError.response) {
              console.error(
                `[Webhook ${requestId}] ❌ Server Error ${apiError.response.status}:`,
                JSON.stringify(apiError.response.data),
              )
            } else {
              console.error(`[Webhook ${requestId}] ❌ Error Message:`, apiError.message)
            }
          }
        }
        break

      default:
        // Ignore other events
        break
    }

    res.sendStatus(200)
  } catch (err) {
    console.error(`[Webhook ${requestId}] ❌ FATAL ERROR:`, err.message)
    console.error(`[Webhook ${requestId}] Stack:`, err.stack)
    res.status(500).send(`Webhook Processing Error: ${err.message}`)
  }
})

module.exports = router

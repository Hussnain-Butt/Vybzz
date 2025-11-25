// Backend/services/live-streaming-service/routes.js

const express = require('express')
const { Router } = require('express')
const Mux = require('@mux/mux-node')
// ✅ FIX: v7 Style Import (Destructuring to ensure we get the class)
const { Webhooks } = Mux
const { PrismaClient } = require('@prisma/client')
const axios = require('axios')

const router = Router()
const prisma = new PrismaClient()

// Mux Initialization
// Check if keys exist before initializing
if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  console.error('❌ CRITICAL: MUX_TOKEN_ID or MUX_TOKEN_SECRET is missing in .env')
}

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

// =========================================================
// === FINAL DOCKER FIX: URL CONFIGURATION ===
// =========================================================
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
 * @desc    Create a new Mux live stream
 */
router.post('/create', async (req, res) => {
  try {
    const clerkId = getClerkId(req)
    const { title, description, tags, thumbnailUrl } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Stream title is required.' })
    }

    console.log(`[Stream Create] Creating stream for User: ${clerkId} with Title: ${title}`)

    const muxStream = await mux.Video.LiveStreams.create({
      playback_policy: 'public',
      new_asset_settings: {
        playback_policy: 'public',
      },
    })

    console.log(`[Stream Create] Mux Stream Created. ID: ${muxStream.id}`)

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

    console.log(`[Stream Create] Database Entry Created. ID: ${newStream.id}`)
    res.status(201).json(newStream)
  } catch (error) {
    console.error('[Stream Create] ❌ Error:', error.message)
    console.error('[Stream Create] Stack:', error.stack)
    res.status(500).json({ error: 'Failed to create live stream.' })
  }
})

/**
 * @route   POST /webhooks/mux
 * @desc    Handle webhooks
 */
router.post('/webhooks/mux', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7) // Tracking ID

  try {
    // 1. Basic Info Logging
    const signature = req.headers['mux-signature']
    console.log(
      `[Webhook ${requestId}] 📥 Received Webhook. Signature Header: ${
        signature ? 'Present' : 'MISSING'
      }`,
    )

    if (!signature) {
      console.error(`[Webhook ${requestId}] ❌ Missing mux-signature header.`)
      return res.status(401).send('Missing Signature')
    }

    // 2. Secret Extraction & Validation
    const secret = (process.env.MUX_WEBHOOK_SIGNING_SECRET || '').trim()
    if (!secret) {
      console.error(
        `[Webhook ${requestId}] ❌ CRITICAL: MUX_WEBHOOK_SIGNING_SECRET is MISSING in .env!`,
      )
      return res.status(500).send('Server Configuration Error')
    }
    console.log(`[Webhook ${requestId}] 🔐 Verifying with Secret ending in: ...${secret.slice(-5)}`)

    // 3. Raw Body Logging (Size check)
    const rawBody = req.body.toString('utf8')
    console.log(`[Webhook ${requestId}] 📦 Payload Size: ${rawBody.length} bytes`)

    // 4. Signature Verification
    let event
    try {
      // Using v7 style instantiation
      const webhook = new Webhooks(secret)
      event = webhook.verifySignature(rawBody, signature)
      console.log(`[Webhook ${requestId}] ✅ Signature Verified Successfully!`)
    } catch (verifyError) {
      console.error(`[Webhook ${requestId}] ❌ Signature Verification Failed!`)
      console.error(`[Webhook ${requestId}] Error Name: ${verifyError.name}`)
      console.error(`[Webhook ${requestId}] Error Message: ${verifyError.message}`)

      // IMPORTANT: Development Fallback
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[Webhook ${requestId}] ⚠️ DEV MODE: Parsing manually despite signature failure.`,
        )
        try {
          event = JSON.parse(rawBody)
        } catch (jsonError) {
          console.error(`[Webhook ${requestId}] ❌ JSON Parse failed:`, jsonError.message)
          return res.status(400).send('Invalid JSON')
        }
      } else {
        return res.status(400).send(`Webhook Error: ${verifyError.message}`)
      }
    }

    const { type, data: eventData } = event

    if (type.includes('live_stream') || type.includes('asset')) {
      console.log(
        `[Webhook ${requestId}] 📨 Processing Event: ${type} | Resource ID: ${eventData.id}`,
      )
    } else {
      console.log(`[Webhook ${requestId}] ℹ️ Ignoring Event: ${type}`)
    }

    switch (type) {
      // --- STREAM STATUS ---
      case 'video.live_stream.active':
        console.log(`[Webhook ${requestId}] 🔴 Update DB: Stream ${eventData.id} is LIVE`)
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: true },
        })
        break

      case 'video.live_stream.idle':
      case 'video.live_stream.disconnected':
        console.log(`[Webhook ${requestId}] ⚫ Update DB: Stream ${eventData.id} is OFFLINE`)
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: false },
        })
        break

      // --- VOD CREATION ---
      case 'video.asset.ready':
        // Check if this asset belongs to a live stream
        if (eventData.live_stream_id) {
          console.log(
            `[Webhook ${requestId}] 🎬 VOD Triggered for Live Stream ID: ${eventData.live_stream_id}`,
          )

          // Find original stream
          const originalStream = await prisma.liveStream.findFirst({
            where: { muxStreamId: eventData.live_stream_id },
          })

          if (!originalStream) {
            console.warn(
              `[Webhook ${requestId}] ⚠️ Stream not found in DB for ID: ${eventData.live_stream_id}`,
            )
            break
          }

          if (originalStream.processed) {
            console.log(
              `[Webhook ${requestId}] ⚠️ Stream ID ${originalStream.id} already processed. Skipping.`,
            )
            break
          }

          const muxPlaybackId = eventData.playback_ids?.[0]?.id
          if (!muxPlaybackId) {
            console.error(`[Webhook ${requestId}] ❌ No playback IDs found in Mux Asset payload!`)
            break
          }

          const postPayload = {
            creatorId: originalStream.userId,
            title: originalStream.title,
            description: originalStream.description || 'Watch the replay of my live stream!',
            tags: originalStream.tags || [],
            thumbnailUrl: originalStream.thumbnailUrl,
            muxPlaybackId: muxPlaybackId,
            muxAssetId: eventData.id,
          }

          const targetUrl = `${POST_SERVICE_URL}/internal/create-post-from-stream`
          console.log(`[Webhook ${requestId}] 📤 Sending Request to: ${targetUrl}`)

          try {
            const response = await axios.post(targetUrl, postPayload, {
              timeout: 15000, // Increased timeout to 15s
              headers: { 'Content-Type': 'application/json' },
            })

            console.log(
              `[Webhook ${requestId}] 🎉 SUCCESS! VOD Post Created. Service Response: ${response.status}`,
            )

            // Mark as processed
            await prisma.liveStream.update({
              where: { id: originalStream.id },
              data: { processed: true },
            })
            console.log(
              `[Webhook ${requestId}] ✅ Marked stream ${originalStream.id} as processed in DB.`,
            )
          } catch (apiError) {
            console.error(`[Webhook ${requestId}] ❌ FAILED to call Post Service.`)
            if (apiError.response) {
              // Server responded with a status code outside 2xx
              console.error(`[Webhook ${requestId}] Status: ${apiError.response.status}`)
              console.error(`[Webhook ${requestId}] Data:`, JSON.stringify(apiError.response.data))
            } else if (apiError.request) {
              // Request was made but no response received
              console.error(`[Webhook ${requestId}] No Response received! Is Post Service running?`)
            } else {
              console.error(`[Webhook ${requestId}] Error Message:`, apiError.message)
            }
          }
        } else {
          console.log(
            `[Webhook ${requestId}] ℹ️ 'video.asset.ready' received but no 'live_stream_id' present (Direct Upload?). Ignoring here.`,
          )
        }
        break

      default:
        break
    }

    // Always return 200 to Mux so they don't keep retrying
    res.status(200).send('Webhook received')
  } catch (err) {
    console.error(`[Webhook ${requestId}] ❌ FATAL INTERNAL ERROR:`, err.message)
    console.error(`[Webhook ${requestId}] Stack:`, err.stack)
    // Return 500 so Mux knows something went wrong on our end (unless verification failed earlier)
    if (!res.headersSent) {
      res.status(500).send(`Internal Server Error: ${err.message}`)
    }
  }
})

module.exports = router

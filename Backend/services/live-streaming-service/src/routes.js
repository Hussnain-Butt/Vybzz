// Backend/services/live-streaming-service/routes.js

const express = require('express')
const { Router } = require('express')
const Mux = require('@mux/mux-node')
const { PrismaClient } = require('@prisma/client')
const axios = require('axios')

const router = Router()
const prisma = new PrismaClient()

// ========================================================
// 1. MUX INITIALIZATION (FIXED FOR NEW SDK)
// ========================================================
// New SDK uses lowerCamelCase properties (e.g., mux.video)
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

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

    console.log(`[Stream Create] Request for User: ${clerkId}, Title: ${title}`)

    // ✅ FIX 1: Using correct property casing for Mux SDK v8
    const muxStream = await mux.video.liveStreams.create({
      playback_policy: ['public'],
      new_asset_settings: {
        playback_policy: ['public'],
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

    res.status(201).json(newStream)
  } catch (error) {
    console.error('[Stream Create] ❌ Error:', error.message)
    console.error('[Stream Create] Stack:', error.stack)
    res.status(500).json({ error: 'Failed to create live stream.' })
  }
})

/**
 * @route   POST /webhooks/mux
 * @desc    Handle webhooks from Mux
 */
router.post('/webhooks/mux', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7) // Tracking ID

  try {
    const rawBody = req.body.toString('utf8')
    const signature = req.headers['mux-signature']

    // ✅ FIX 2: Secret Key Trim
    const secret = (process.env.MUX_WEBHOOK_SIGNING_SECRET || '').trim()

    if (!secret) {
      console.error(`[Webhook ${requestId}] ❌ CRITICAL: Secret Key MISSING in .env`)
      return res.status(500).send('Configuration Error')
    }

    console.log(`[Webhook ${requestId}] 🔐 Verifying with Secret ending in: ...${secret.slice(-5)}`)

    // ✅ FIX 3: Using Static Verification Method (Works in most versions)
    let event
    try {
      // Try v8 style first (Static)
      if (Mux.Webhooks && typeof Mux.Webhooks.verifySignature === 'function') {
        event = Mux.Webhooks.verifySignature(rawBody, req.headers, secret)
      }
      // Fallback to v7 style if static method not found (though 'require' usually gives class)
      else {
        const { Webhooks } = require('@mux/mux-node')
        event = Webhooks.verifyHeader(rawBody, signature, secret)
      }
    } catch (verifyError) {
      console.error(`[Webhook ${requestId}] ❌ Verification Failed: ${verifyError.message}`)

      // DEV MODE FALLBACK
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Webhook ${requestId}] ⚠️ Parsing manually (DEV MODE).`)
        event = JSON.parse(rawBody)
      } else {
        return res.status(400).send(`Webhook Error: ${verifyError.message}`)
      }
    }

    const { type, data: eventData } = event

    if (type.includes('live_stream') || type.includes('asset')) {
      console.log(`[Webhook ${requestId}] 📨 Event: ${type} | ID: ${eventData.id}`)
    }

    switch (type) {
      case 'video.live_stream.active':
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: true },
        })
        console.log(`[Webhook ${requestId}] 🔴 Stream LIVE`)
        break

      case 'video.live_stream.idle':
      case 'video.live_stream.disconnected':
        await prisma.liveStream.updateMany({
          where: { muxStreamId: eventData.id },
          data: { isLive: false },
        })
        console.log(`[Webhook ${requestId}] ⚫ Stream OFFLINE`)
        break

      case 'video.asset.ready':
        if (eventData.live_stream_id) {
          console.log(`[Webhook ${requestId}] 🎬 VOD Event. Stream ID: ${eventData.live_stream_id}`)

          const originalStream = await prisma.liveStream.findFirst({
            where: { muxStreamId: eventData.live_stream_id },
          })

          if (!originalStream) {
            console.warn(`[Webhook ${requestId}] ⚠️ Stream not found in DB`)
            break
          }

          if (originalStream.processed) {
            console.log(`[Webhook ${requestId}] ⚠️ Already processed`)
            break
          }

          const muxPlaybackId = eventData.playback_ids?.[0]?.id
          if (!muxPlaybackId) {
            console.error(`[Webhook ${requestId}] ❌ No Playback ID`)
            break
          }

          const postPayload = {
            creatorId: originalStream.userId,
            title: originalStream.title,
            description: originalStream.description || 'Live Stream Replay',
            tags: originalStream.tags || [],
            thumbnailUrl: originalStream.thumbnailUrl,
            muxPlaybackId: muxPlaybackId,
            muxAssetId: eventData.id,
          }

          const targetUrl = `${POST_SERVICE_URL}/internal/create-post-from-stream`

          try {
            const response = await axios.post(targetUrl, postPayload, {
              timeout: 15000,
              headers: { 'Content-Type': 'application/json' },
            })
            console.log(`[Webhook ${requestId}] 🎉 VOD Post Created! Status: ${response.status}`)

            await prisma.liveStream.update({
              where: { id: originalStream.id },
              data: { processed: true },
            })
          } catch (apiError) {
            console.error(`[Webhook ${requestId}] ❌ Post Creation Failed:`, apiError.message)
          }
        }
        break

      default:
        break
    }

    res.sendStatus(200)
  } catch (err) {
    console.error(`[Webhook ${requestId}] ❌ FATAL ERROR:`, err.message)
    res.status(500).send(`Error: ${err.message}`)
  }
})

module.exports = router

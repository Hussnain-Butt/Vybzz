// user-service/controllers/user.controller.js

const { Webhook } = require('svix')
const { prisma } = require('../db/prisma')

const WEBHOOK_SECRET =
  process.env.CLERK_WEBHOOK_SIGNING_SECRET || 'whsec_Exv1t8Dryq2i7Q+4oNDwlFGo805VlGNT'

// Helper: primary email nikaalna
const getPrimaryEmail = (data) => {
  const list = data?.email_addresses || []
  const e = list.find((x) => x.id === data?.primary_email_address_id) || list[0]
  return e?.email_address || null
}

// Helper: full name compose
const fullName = (f, l) => [f, l].filter(Boolean).join(' ').trim() || null

// Clerk webhook handler (RAW body required at route level)
const handleClerkWebhook = async (req, res) => {
  console.log('[Webhook] Received a request from Clerk...')

  try {
    if (!WEBHOOK_SECRET) {
      console.error('CRITICAL: Missing CLERK_WEBHOOK_SIGNING_SECRET in .env file')
      throw new Error('Missing CLERK_WEBHOOK_SIGNING_SECRET')
    }

    const sid = req.headers['svix-id']
    const ts = req.headers['svix-timestamp']
    const sig = req.headers['svix-signature']

    if (!sid || !ts || !sig) {
      console.warn('[Webhook] Request is missing Svix headers.')
      return res.status(400).send('Missing Svix headers')
    }

    // Body is raw Buffer (set in index.js route with express.raw)
    const payloadString = req.body?.toString('utf8') || ''

    // Verify signature & parse event
    const webhook = new Webhook(WEBHOOK_SECRET)
    const evt = webhook.verify(payloadString, {
      'svix-id': sid,
      'svix-timestamp': ts,
      'svix-signature': sig,
    })

    const { type, data } = evt
    console.log('[Webhook] VERIFIED! Event type:', type, 'User ID:', data?.id)

    if (type === 'user.created' || type === 'user.updated') {
      const email = getPrimaryEmail(data)
      const userData = {
        clerkId: data.id,
        email,
        name: fullName(data.first_name, data.last_name),
        imageUrl: data.image_url || null,
        updatedAt: new Date(),
      }

      if (!email) {
        console.warn('[Webhook] User has no primary email, skipping upsert:', data.id)
        return res.status(400).send('Missing primary email')
      }

      console.log('[Webhook] Preparing to upsert user into DB:', userData)

      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: userData,
        create: { ...userData, createdAt: new Date() },
      })

      console.log(`[Webhook] SUCCESS: User upserted: ${data.id}`)
    }

    if (type === 'user.deleted') {
      // data object for deleted user only contains { id, object }
      const clerkId = data?.id
      if (clerkId) {
        await prisma.user.deleteMany({ where: { clerkId: clerkId } })
        console.log(`[Webhook] SUCCESS: User deleted: ${clerkId}`)
      } else {
        console.warn('[Webhook] Received user.deleted event without an ID.')
      }
    }

    return res.status(200).send('OK')
  } catch (err) {
    console.error('!!! [Webhook] Webhook verification or processing FAILED:', err?.message || err)
    return res.status(400).send('Webhook failed')
  }
}

// List all users (latest first)
const listUsers = async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(users)
}

// Get a single user by Clerk ID
const getUserByClerkId = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { clerkId: req.params.clerkId } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
}

module.exports = { handleClerkWebhook, listUsers, getUserByClerkId }

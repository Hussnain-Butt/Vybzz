// users-service/controllers/user.controller.js
const { Webhook } = require('svix')
const { prisma } = require('../db/prisma')

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

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
  try {
    if (!WEBHOOK_SECRET) throw new Error('Missing CLERK_WEBHOOK_SIGNING_SECRET')

    const sid = req.headers['svix-id']
    const ts = req.headers['svix-timestamp']
    const sig = req.headers['svix-signature']
    if (!sid || !ts || !sig) {
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
    console.log('[clerk webhook] received:', type, 'user:', data?.id)

    if (type === 'user.created' || type === 'user.updated') {
      const email = getPrimaryEmail(data)
      const userData = {
        clerkId: data.id,
        email, // should be non-null per your schema
        name: fullName(data.first_name, data.last_name),
        imageUrl: data.image_url || null,
        updatedAt: new Date(),
      }

      if (!email) {
        console.warn('[clerk webhook] user has no primary email, skipping upsert:', data.id)
        return res.status(400).send('Missing primary email')
      }

      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: userData,
        create: { ...userData, createdAt: new Date() },
      })

      console.log(`[clerk webhook] user upserted: ${data.id}`)
    }

    if (type === 'user.deleted') {
      await prisma.user.deleteMany({ where: { clerkId: data.id } })
      console.log(`[clerk webhook] user deleted: ${data.id}`)
    }

    return res.status(200).send('OK')
  } catch (err) {
    // Prisma or verification error
    console.error('Webhook error:', err?.message || err)
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

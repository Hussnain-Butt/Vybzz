// users-service/controllers/user.controller.js
const { Webhook } = require('svix')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

const getPrimaryEmail = (data) => {
  const list = data?.email_addresses || []
  const e = list.find((x) => x.id === data?.primary_email_address_id) || list[0]
  return e?.email_address || null
}
const fullName = (f, l) => [f, l].filter(Boolean).join(' ').trim() || null

const handleClerkWebhook = async (req, res) => {
  try {
    if (!WEBHOOK_SECRET) throw new Error('Missing CLERK_WEBHOOK_SIGNING_SECRET')

    const sid = req.headers['svix-id']
    const ts = req.headers['svix-timestamp']
    const sig = req.headers['svix-signature']
    if (!sid || !ts || !sig) return res.status(400).send('Missing Svix headers')

    const payloadString = req.body?.toString('utf8') || ''
    const evt = new Webhook(WEBHOOK_SECRET).verify(payloadString, {
      'svix-id': sid,
      'svix-timestamp': ts,
      'svix-signature': sig,
    })

    const { type, data } = evt
    console.log('Received event:', type)

    if (type === 'user.created' || type === 'user.updated') {
      const userData = {
        clerkId: data.id,
        email: getPrimaryEmail(data),
        name: fullName(data.first_name, data.last_name),
        imageUrl: data.image_url || null,
        updatedAt: new Date(),
      }

      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: userData,
        create: { ...userData, createdAt: new Date() },
      })
      console.log(`User ${data.id} upserted.`)
    }

    if (type === 'user.deleted') {
      await prisma.user.deleteMany({ where: { clerkId: data.id } })
      console.log(`User ${data.id} deleted.`)
    }

    return res.status(200).send('OK')
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send('Webhook failed')
  }
}

const listUsers = async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(users)
}
const getUserByClerkId = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { clerkId: req.params.clerkId } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
}

module.exports = { handleClerkWebhook, listUsers, getUserByClerkId }

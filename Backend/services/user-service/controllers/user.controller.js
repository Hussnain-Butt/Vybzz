// user-service/controllers/user.controller.js

const { Webhook } = require('svix')
const { prisma } = require('../db/prisma')
const { uploadToCloudinary } = require('../utils/cloudinary')

const WEBHOOK_SECRET =
  process.env.CLERK_WEBHOOK_SIGNING_SECRET || 'whsec_xeTb2X35/E+kbYPVLIU5ut6x8ND3bzzb'

// Debug bypass .env file se control hoga
const DEBUG_BYPASS = String(process.env.DEBUG_WEBHOOK_BYPASS_VERIFY || '').toLowerCase() === 'true'

if (DEBUG_BYPASS) {
  console.warn('**************************************************')
  console.warn('*** WARNING: WEBHOOK SIGNATURE VERIFICATION IS OFF! ***')
  console.warn('***         THIS IS FOR DEBUGGING ONLY!          ***')
  console.warn('**************************************************')
}

// Helper functions (inmein koi change nahi)
const getPrimaryEmail = (data) => {
  const list = data?.email_addresses || []
  const e = list.find((x) => x.id === data?.primary_email_address_id) || list[0]
  return e?.email_address || null
}
const fullName = (f, l) => [f, l].filter(Boolean).join(' ').trim() || null
const createUrlSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
}

// Clerk webhook handler - Naya aur behtar version debugging ke liye
const handleClerkWebhook = async (req, res) => {
  console.log('--- [Webhook Handler Called] ---')

  try {
    if (!WEBHOOK_SECRET && !DEBUG_BYPASS) {
      console.error('[Webhook] CRITICAL: Missing CLERK_WEBHOOK_SIGNING_SECRET in .env file')
      return res.status(500).send('Webhook secret not configured')
    }

    // DEBUG: Aane wale headers ko log karein
    console.log('[Webhook] Headers Received:', {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature-present': !!req.headers['svix-signature'],
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
    })

    // DEBUG: Raw body ke buffer ki length check karein
    const payloadBuffer = req.body
    if (!Buffer.isBuffer(payloadBuffer)) {
      console.error(
        '[Webhook] ERROR: Request body is not a buffer! Middleware order might be wrong.',
      )
      return res.status(400).send('Invalid request body format.')
    }
    console.log(`[Webhook] Raw payload received. Size: ${payloadBuffer.length} bytes.`)

    if (payloadBuffer.length === 0) {
      console.warn('[Webhook] WARNING: Received an empty payload.')
      return res.status(400).send('Empty payload received.')
    }

    const payloadString = payloadBuffer.toString('utf8')
    let evt

    if (!DEBUG_BYPASS) {
      // --- NORMAL PRODUCTION LOGIC ---
      console.log('[Webhook] Verifying signature...')
      const svix_id = req.headers['svix-id']
      const svix_timestamp = req.headers['svix-timestamp']
      const svix_signature = req.headers['svix-signature']

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send('Error: Missing Svix headers')
      }

      const wh = new Webhook(WEBHOOK_SECRET)
      try {
        evt = wh.verify(payloadString, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        })
        console.log('[Webhook] ✅ SIGNATURE VERIFIED SUCCESSFULLY!')
      } catch (err) {
        console.error('[Webhook] ❌ ERROR: SIGNATURE VERIFICATION FAILED!', err.message)
        return res.status(400).send('Error: Webhook signature verification failed')
      }
    } else {
      // --- DEBUG BYPASS LOGIC ---
      console.log('[Webhook] DEBUG MODE: Bypassing signature verification.')
      try {
        evt = JSON.parse(payloadString)
        console.log('[Webhook] ✅ DEBUG MODE: Payload parsed successfully.')
      } catch (parseErr) {
        console.error('[Webhook] ❌ DEBUG MODE: Failed to parse JSON payload!', parseErr.message)
        return res.status(400).send('Bad JSON payload')
      }
    }

    const { type, data } = evt
    console.log(`[Webhook] Event Type: ${type}, User ID: ${data?.id}`)

    // Database operations
    if (type === 'user.created' || type === 'user.updated') {
      const email = getPrimaryEmail(data)
      if (!email) {
        console.warn('[Webhook] User has no primary email, skipping upsert:', data.id)
        return res.status(400).send('Missing primary email')
      }

      const userData = {
        clerkId: data.id,
        email,
        name: fullName(data.first_name, data.last_name),
        imageUrl: data.image_url || null,
        updatedAt: new Date(),
      }

      console.log('[Webhook] Preparing to upsert user into DB:', userData.clerkId)
      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: userData,
        create: { ...userData, createdAt: new Date() },
      })
      console.log(`[Webhook] ✅ DATABASE SUCCESS: User upserted: ${data.id}`)
    } else if (type === 'user.deleted') {
      const clerkId = data?.id
      if (clerkId) {
        await prisma.user.deleteMany({ where: { clerkId: clerkId } })
        console.log(`[Webhook] ✅ DATABASE SUCCESS: User deleted: ${clerkId}`)
      }
    }

    return res.status(200).send('OK')
  } catch (err) {
    console.error('!!! [Webhook] UNEXPECTED ERROR in webhook handler:', err.message)
    return res.status(500).send('Internal Server Error')
  }
}

// --- Baaki Saare Functions Jese The Wese Hi Rahenge ---

// List all users
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

const setupCreatorProfileName = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { pageName } = req.body
    if (!clerkId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    if (!pageName || pageName.trim().length < 3) {
      return res.status(400).json({ error: 'Page name must be at least 3 characters long.' })
    }
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found in our database.' })
    }
    const pageUrl = createUrlSlug(pageName)
    const creatorProfile = await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      update: {
        pageName: pageName.trim(),
        pageUrl,
      },
      create: {
        pageName: pageName.trim(),
        pageUrl,
        userId: user.id,
        status: 'ACTIVE',
      },
    })
    res.status(201).json({
      message: 'Creator page name saved successfully!',
      profile: creatorProfile,
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'This page name is already taken. Please choose another one.' })
    }
    console.error('Error setting up creator profile:', error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const checkPageNameAvailability = async (req, res) => {
  try {
    const { pageUrl } = req.body
    if (!pageUrl || pageUrl.trim().length < 3) {
      return res.status(400).json({ available: false, message: 'URL slug is too short.' })
    }
    const existingProfile = await prisma.creatorProfile.findUnique({
      where: { pageUrl: pageUrl.trim() },
    })
    if (existingProfile) {
      return res.status(200).json({ available: false, message: 'This name is already taken.' })
    }
    return res.status(200).json({ available: true })
  } catch (error) {
    console.error('Error checking page name availability:', error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getMe = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    if (!clerkId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        creatorProfile: true,
      },
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching current user:', error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateCreatorSocials = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { youtube, instagram, twitter, facebook, twitch, tiktok } = req.body
    if (!clerkId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const updatedProfile = await prisma.creatorProfile.update({
      where: { userId: user.id },
      data: {
        youtubeUrl: youtube || null,
        instagramUrl: instagram || null,
        twitterUrl: twitter || null,
        facebookUrl: facebook || null,
        twitchUrl: twitch || null,
        tiktokUrl: tiktok || null,
      },
    })
    res.status(200).json({
      message: 'Social links updated successfully!',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating social links:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Creator profile not found for this user.' })
    }
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getPublicCreatorByUrl = async (req, res) => {
  try {
    const { pageUrl } = req.params
    if (!pageUrl) {
      return res.status(400).json({ error: 'Page URL is required.' })
    }
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { pageUrl },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        tiers: {
          orderBy: { price: 'asc' },
        },
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    })
    if (!creatorProfile) {
      return res.status(404).json({ error: 'Creator not found.' })
    }
    if (creatorProfile.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'This creator page is not active.' })
    }
    const publicData = {
      name: creatorProfile.user.name,
      imageUrl: creatorProfile.user.imageUrl,
      bannerUrl: creatorProfile.bannerUrl,
      pageName: creatorProfile.pageName,
      bio: creatorProfile.bio,
      joinedDate: new Date(creatorProfile.createdAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
      tiers: creatorProfile.tiers,
      posts: creatorProfile.posts,
    }
    res.status(200).json(publicData)
  } catch (error) {
    console.error('Error fetching public creator data:', error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateCreatorProfileDetails = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { bio, onboardingStep, pageStatus } = req.body
    if (!clerkId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const dataToUpdate = {}
    if (bio !== undefined) dataToUpdate.bio = bio
    if (onboardingStep !== undefined) dataToUpdate.onboardingStep = Number(onboardingStep)
    if (pageStatus !== undefined) dataToUpdate.status = pageStatus
    const updatedProfile = await prisma.creatorProfile.update({
      where: { userId: user.id },
      data: dataToUpdate,
    })
    res.status(200).json({
      message: 'Profile updated successfully!',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating profile details:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Creator profile not found for this user.' })
    }
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateCreatorImages = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    if (!clerkId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const dataToUpdate = {}
    if (req.files && req.files.profileImage) {
      const profileImageUrl = await uploadToCloudinary(req.files.profileImage[0])
      if (profileImageUrl) dataToUpdate.profileImageUrl = profileImageUrl
    }
    if (req.files && req.files.bannerImage) {
      const bannerUrl = await uploadToCloudinary(req.files.bannerImage[0])
      if (bannerUrl) dataToUpdate.bannerUrl = bannerUrl
    }
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: 'No image files provided.' })
    }
    const updatedProfile = await prisma.creatorProfile.update({
      where: { userId: user.id },
      data: dataToUpdate,
    })
    res.status(200).json({
      message: 'Images updated successfully!',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating images:', error)
    res.status(500).json({ error: 'Something went wrong during image upload.' })
  }
}

module.exports = {
  handleClerkWebhook,
  listUsers,
  getUserByClerkId,
  getMe,
  setupCreatorProfileName,
  checkPageNameAvailability,
  updateCreatorSocials,
  getPublicCreatorByUrl,
  updateCreatorProfileDetails,
  updateCreatorImages,
}

// user-service/controllers/user.controller.js

const { Webhook } = require('svix')
const { prisma } = require('../db/prisma')
const { uploadToCloudinary } = require('../utils/cloudinary')
// ✅ FIX: Clerk SDK ko sahi tareeqay se import kiya gaya hai
const clerk = require('@clerk/clerk-sdk-node')

const WEBHOOK_SECRET =
  process.env.CLERK_WEBHOOK_SIGNING_SECRET || 'whsec_xeTb2X35/E+kbYPVLIU5ut6x8ND3bzzb'

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error(
    'FATAL ERROR: CLERK_SECRET_KEY is not set in the environment variables for user-service.',
  )
}

const DEBUG_BYPASS = String(process.env.DEBUG_WEBHOOK_BYPASS_VERIFY || '').toLowerCase() === 'true'

if (DEBUG_BYPASS) {
  console.warn('**************************************************')
  console.warn('*** WARNING: WEBHOOK SIGNATURE VERIFICATION IS OFF! ***')
  console.warn('***         THIS IS FOR DEBUGGING ONLY!          ***')
  console.warn('**************************************************')
}

// Helper functions (koi badlav nahi)
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

// ✅ FIX: Webhook handler ab email aur user deletion dono ko theek se handle karta hai
const handleClerkWebhook = async (req, res) => {
  try {
    const payloadBuffer = req.body
    if (!Buffer.isBuffer(payloadBuffer)) {
      return res.status(400).send('Invalid request body format.')
    }
    const payloadString = payloadBuffer.toString('utf8')
    let evt = JSON.parse(payloadString)

    const { type, data } = evt

    if (type === 'user.created' || type === 'user.updated') {
      const email = getPrimaryEmail(data)
      if (!email) {
        return res.status(400).send('Missing primary email')
      }

      const userData = {
        clerkId: data.id,
        email,
        name: fullName(data.first_name, data.last_name),
        imageUrl: data.image_url || null,
      }

      // Upsert logic (agar user clerkId se mil jaye to update karo, warna naya banao)
      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: userData,
        create: userData,
      })
    } else if (type === 'user.deleted') {
      const clerkId = data?.id
      if (clerkId) {
        // User delete karne se pehle, usay dhoondo
        const userToDelete = await prisma.user.findUnique({
          where: { clerkId: clerkId },
        })

        if (userToDelete) {
          // Agar user mil jaye, to pehle uska CreatorProfile delete karo
          await prisma.creatorProfile.deleteMany({
            where: { userId: userToDelete.id },
          })

          // Ab User ko delete karo
          await prisma.user.delete({
            where: { id: userToDelete.id },
          })
          console.log(`[Webhook] ✅ SUCCESS: User and their profile deleted: ${clerkId}`)
        } else {
          console.warn(`[Webhook] User to delete not found in DB: ${clerkId}`)
        }
      }
    }
    return res.status(200).send('OK')
  } catch (err) {
    console.error('!!! [Webhook] UNEXPECTED ERROR in webhook handler:', err)
    return res.status(500).send('Internal Server Error')
  }
}

// getMe function with the FINAL FIX
const getMe = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    if (!clerkId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: { creatorProfile: true },
    })

    if (user) {
      return res.status(200).json(user)
    }

    console.log(`[getMe] User NOT in DB. Fetching from Clerk API for clerkId: ${clerkId}`)
    const clerkUser = await clerk.users.getUser(clerkId)

    const newUserPayload = {
      clerkId: clerkUser.id,
      email: getPrimaryEmail(clerkUser),
      name: fullName(clerkUser.firstName, clerkUser.lastName),
      imageUrl: clerkUser.imageUrl,
    }

    // Dobara check karein, ho sakta hai webhook ne user abhi abhi banaya ho
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: newUserPayload.email },
    })

    if (existingUserByEmail) {
      user = await prisma.user.update({
        where: { email: newUserPayload.email },
        data: { clerkId: newUserPayload.clerkId }, // Sirf clerkId update karein
        include: { creatorProfile: true },
      })
    } else {
      user = await prisma.user.create({
        data: newUserPayload,
        include: { creatorProfile: true },
      })
    }

    console.log(`[getMe] User synced/created successfully: ${clerkId}`)
    return res.status(201).json(user)
  } catch (error) {
    console.error('--- !!! UNEXPECTED GENERIC ERROR in getMe controller !!! ---', error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

// --- Baaki Controller Functions (Inmein koi badlav nahi) ---
const listUsers = async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(users)
}

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
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found in our database.' })
    }
    const pageUrl = createUrlSlug(pageName)
    const creatorProfile = await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      update: { pageName: pageName.trim(), pageUrl },
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
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const checkPageNameAvailability = async (req, res) => {
  try {
    const { pageUrl } = req.body
    const existingProfile = await prisma.creatorProfile.findUnique({
      where: { pageUrl: pageUrl.trim() },
    })
    if (existingProfile) {
      return res.status(200).json({ available: false, message: 'This name is already taken.' })
    }
    return res.status(200).json({ available: true })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateCreatorSocials = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { youtube, instagram, twitter, facebook, twitch, tiktok } = req.body
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found.' })

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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Creator profile not found for this user.' })
    }
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getPublicCreatorByUrl = async (req, res) => {
  try {
    const { pageUrl } = req.params
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { pageUrl },
      include: {
        user: {
          select: { name: true, imageUrl: true },
        },
      },
    })
    if (!creatorProfile || creatorProfile.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Creator not found.' })
    }
    const publicData = {
      name: creatorProfile.user.name,
      imageUrl: creatorProfile.profileImageUrl || creatorProfile.user.imageUrl,
      bannerUrl: creatorProfile.bannerUrl,
      pageName: creatorProfile.pageName,
      bio: creatorProfile.bio,
    }
    res.status(200).json(publicData)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateCreatorProfileDetails = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { bio, onboardingStep, pageStatus } = req.body
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found.' })

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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Creator profile not found.' })
    }
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateCreatorImages = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found.' })

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

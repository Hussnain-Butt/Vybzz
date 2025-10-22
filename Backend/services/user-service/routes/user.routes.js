// user-service/routes/user.routes.js

const express = require('express')
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node')
const {
  // handleClerkWebhook yahan se hata diya gaya hai
  listUsers,
  getUserByClerkId,
  getMe,
  setupCreatorProfileName,
  checkPageNameAvailability,
  updateCreatorSocials,
  getPublicCreatorByUrl,
  updateCreatorProfileDetails,
  updateCreatorImages,
} = require('../controllers/user.controller')
const { multerUploads } = require('../middleware/multer')

const router = express.Router()

// ----------------------------------------------------------------
// NOTE: Clerk webhook route ko ab server.js mein handle kiya ja raha hai
// taake middlewares ka order theek rahe.
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// PUBLIC ROUTES (In par authentication ki zaroorat nahi)
// ----------------------------------------------------------------
router.get('/', listUsers)
router.get('/by-clerk/:clerkId', getUserByClerkId)
router.get('/page/:pageUrl', getPublicCreatorByUrl)

// ----------------------------------------------------------------
// AUTHENTICATED ROUTES (Inke liye user ka logged-in hona zaroori hai)
// ----------------------------------------------------------------
const clerkAuth = ClerkExpressWithAuth()

// Logged in user ki profile ke liye
router.get('/me', clerkAuth, getMe)

// Creator profile setup ke liye routes
router.post('/creator/check-availability', clerkAuth, checkPageNameAvailability)
router.post('/creator/setup-name', clerkAuth, setupCreatorProfileName)
router.put('/creator/socials', clerkAuth, updateCreatorSocials)
router.put('/creator/details', clerkAuth, updateCreatorProfileDetails)
router.put('/creator/images', clerkAuth, multerUploads, updateCreatorImages)

module.exports = router

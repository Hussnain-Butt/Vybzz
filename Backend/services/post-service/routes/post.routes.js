// File: routes/post.routes.js (COMPLETE AND FINAL UPDATED VERSION)

const express = require('express')
const { requireAuth } = require('../middleware/requireAuth')

// CHANGE 1: Import BOTH middleware functions from the corrected multer file.
// We need the 'multiple' one for creating a post and the 'single' one for the other route.
const { multerMultipleMediaUpload, multerSingleMediaUpload } = require('../middleware/multer')

// Import the controller functions
const postController = require('../controllers/post.controller')

// Diagnostic logs to confirm functions are imported correctly
console.log('--- Checking imported controller functions ---')
console.log('postController object:', postController)
console.log('typeof createPost:', typeof postController.createPost)
console.log('typeof getMyPosts:', typeof postController.getMyPosts)
console.log('typeof getPostById:', typeof postController.getPostById)
console.log('typeof uploadMedia:', typeof postController.uploadMedia)
console.log('-------------------------------------------')

// Destructure the controller functions
const { createPost, getMyPosts, getPostById, uploadMedia } = postController

// Error check to catch import issues early
if (!createPost || !getMyPosts || !getPostById || !uploadMedia) {
  throw new Error(
    'One or more controller functions are undefined. Check for circular dependencies or errors in post.controller.js.',
  )
}

const router = express.Router()

// Apply authentication middleware to all routes defined in this file
router.use(requireAuth)

// --- MAIN POST CREATION ROUTE ---
// CHANGE 2: Use the `multerMultipleMediaUpload` middleware here.
// This is the crucial fix. This middleware will now correctly process the FormData
// from your frontend, parse all the files from the 'media' field, and make them
// available in `req.files` for your controller to handle.
router.post('/', multerMultipleMediaUpload, createPost)

// --- SEPARATE ROUTE FOR SINGLE MEDIA UPLOAD ---
// This route remains as it was. It uses `multerSingleMediaUpload` to handle
// a single file upload from a field named 'media'.
router.post('/upload-media', multerSingleMediaUpload, uploadMedia)

// Other routes for getting posts
router.get('/', getMyPosts)
router.get('/:id', getPostById)

module.exports = router

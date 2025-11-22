const { Router } = require('express')
const { createPostFromStream } = require('../controllers/post.controller')

const router = Router()

/**
 * @route   POST /internal/create-post-from-stream
 * @desc    Creates a new post from a finished Mux live stream (VOD).
 *          This is an internal route, only to be called by other microservices.
 * @access  Internal
 */
router.post('/create-post-from-stream', createPostFromStream)

module.exports = router

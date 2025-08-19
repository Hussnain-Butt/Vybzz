const express = require('express')
const { listUsers, getUserByClerkId } = require('../controllers/user.controller')

const router = express.Router()

// now these are relative to /users
router.get('/', listUsers) // GET /users
router.get('/by-clerk/:clerkId', getUserByClerkId) // GET /users/by-clerk/:clerkId

module.exports = router

// user-service/middleware/multer.js
const multer = require('multer')

// Hum files ko disk par save nahi karenge, balki memory mein buffer olarak rakhenge
const storage = multer.memoryStorage()

const multerUploads = multer({ storage }).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
])

module.exports = { multerUploads }

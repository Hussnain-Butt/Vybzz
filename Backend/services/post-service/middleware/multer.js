// File: middleware/multer.js (COMPLETE AND FINAL UPDATED VERSION)

const multer = require('multer')
const path = require('path')

// Configure storage to use memory. This is efficient because it holds the file
// as a buffer in RAM before it's passed to a cloud upload service like Cloudinary,
// avoiding the need to save it to the server's disk first.
const storage = multer.memoryStorage()

// A filter to ensure only specific image and video file types are accepted.
const fileFilter = (req, file, cb) => {
  // Define allowed file extensions and mime types
  const allowedFiletypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|webm/

  // Check the file's extension
  const isExtensionAllowed = allowedFiletypes.test(path.extname(file.originalname).toLowerCase())

  // Check the file's mime type
  const isMimeTypeAllowed = allowedFiletypes.test(file.mimetype)

  if (isExtensionAllowed && isMimeTypeAllowed) {
    // If the file type is allowed, accept the file
    cb(null, true)
  } else {
    // If the file type is not allowed, reject it with an error
    cb(new Error('Invalid file type. Only specific image and video formats are allowed.'), false)
  }
}

// --- MIDDLEWARE FOR CREATING A POST ---
// This middleware is specifically for the main post creation route.
// It is configured to accept up to 10 files from a single form field named 'media'.
const multerMultipleMediaUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Set a generous 100 MB file size limit
  },
  fileFilter: fileFilter,
}).array('media', 10) // '.array('media', 10)' is the key part for multiple files

// --- MIDDLEWARE FOR A SINGLE, GENERIC FILE UPLOAD ---
// This middleware can be used for other routes where you only need to upload one file.
// It expects a single file from a form field named 'media'.
const multerSingleMediaUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: fileFilter,
}).single('media')

// Export both middleware functions so they can be used in different routes.
module.exports = {
  multerMultipleMediaUpload, // For creating posts with multiple files
  multerSingleMediaUpload, // For single file uploads
}

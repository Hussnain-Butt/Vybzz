// File: utils/cloudinary.js (COMPLETE AND FINAL UPDATED VERSION)

const cloudinary = require('cloudinary').v2
// streamifier library helps convert a buffer into a readable stream easily.
const streamifier = require('streamifier')

// Configure Cloudinary with your credentials from environment variables.
// Make sure these are correctly set in your backend's .env file.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer The buffer of the file to upload.
 * @param {object} options Cloudinary upload options (e.g., folder, resource_type).
 * @returns {Promise<object>} A promise that resolves with the complete Cloudinary upload result object.
 */
const uploadToCloudinary = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream that pipes data to Cloudinary.
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        // If Cloudinary returns an error, reject the promise with the error.
        console.error('Cloudinary Upload Error:', error)
        return reject(error)
      }

      // FIX: Resolve with the ENTIRE result object from Cloudinary.
      // Your controller expects this object so it can access `result.secure_url`.
      // Previously, you were only resolving the URL string, which caused the error.
      resolve(result)
    })

    // Use streamifier to create a readable stream from the buffer and
    // pipe it to the Cloudinary upload stream. This starts the upload.
    streamifier.createReadStream(fileBuffer).pipe(uploadStream)
  })
}

module.exports = {
  uploadToCloudinary,
}

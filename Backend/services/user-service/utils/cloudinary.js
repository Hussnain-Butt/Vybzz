// user-service/utils/cloudinary.js
const cloudinary = require('cloudinary').v2
const DatauriParser = require('datauri/parser')
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const parser = new DatauriParser()

const uploadToCloudinary = async (file) => {
  if (!file) return null

  try {
    // File buffer ko base64 string mein convert karein
    const extName = path.extname(file.originalname).toString()
    const file64 = parser.format(extName, file.buffer)

    const result = await cloudinary.uploader.upload(file64.content, {
      // Folder mein organize karne ke liye
      folder: 'vybzz_creators',
    })
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload failed:', error)
    throw new Error('Image could not be uploaded.')
  }
}

module.exports = { uploadToCloudinary }

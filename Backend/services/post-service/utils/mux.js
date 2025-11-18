const Mux = require('@mux/mux-node')

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

const createMuxUploadUrl = async () => {
  try {
    const upload = await Video.Uploads.create({
      cors_origin: '*', // Production mein isko frontend URL se replace karein
      new_asset_settings: {
        playback_policy: 'public',
        encoding_tier: 'smart',
      },
    })
    return upload
  } catch (error) {
    console.error('Error creating Mux upload URL:', error)
    throw new Error('Could not create Mux upload URL.')
  }
}

module.exports = { createMuxUploadUrl, MuxVideo: Video }

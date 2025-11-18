// File: src/controllers/post.controller.js (COMPLETE AND FINAL UPDATED VERSION)

const { prisma } = require('../db/prisma')
const { uploadToCloudinary } = require('../utils/cloudinary')

/**
 * Parses HTML content to find base64 images, uploads them to Cloudinary,
 * and replaces the base64 src with the Cloudinary URL.
 * @param {string} htmlContent The HTML content from the editor.
 * @returns {Promise<string>} The updated HTML content with Cloudinary URLs.
 */
const processAndUploadImagesFromContent = async (htmlContent) => {
  if (!htmlContent) return ''

  const base64ImageRegex = /<img src="(data:image\/[^;]+;base64,([^"]+))"/g
  let updatedContent = htmlContent
  let match
  const uploadPromises = new Map()

  while ((match = base64ImageRegex.exec(htmlContent)) !== null) {
    const fullBase64Src = match[1]
    const base64Data = match[2]

    if (!uploadPromises.has(fullBase64Src)) {
      try {
        const buffer = Buffer.from(base64Data, 'base64')
        const uploadPromise = uploadToCloudinary(buffer, {
          folder: 'vybzz/posts_content',
          resource_type: 'image',
        }).then((uploadResult) => uploadResult.secure_url)
        uploadPromises.set(fullBase64Src, uploadPromise)
      } catch (error) {
        console.error('Error processing a base64 image for upload:', error)
        uploadPromises.set(fullBase64Src, Promise.resolve('#'))
      }
    }
  }

  const uploadedUrls = new Map()
  for (const [base64Src, promise] of uploadPromises.entries()) {
    const url = await promise
    uploadedUrls.set(base64Src, url)
  }

  if (uploadedUrls.size > 0) {
    updatedContent = htmlContent.replace(base64ImageRegex, (match, base64Src) => {
      const cloudinaryUrl = uploadedUrls.get(base64Src)
      return `<img src="${cloudinaryUrl || ''}"`
    })
  }

  return updatedContent
}

/**
 * Creates a new post with media uploads.
 */
const createPost = async (req, res) => {
  const { userId: creatorId } = req.auth
  const { title, content, audience, isDrop, isScheduled, publishDate, allowComments } = req.body

  const tags = req.body.tags ? JSON.parse(req.body.tags) : []
  const collectionIds = req.body.collectionIds ? JSON.parse(req.body.collectionIds) : []
  const files = req.files

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required.' })
  }

  try {
    const processedContent = await processAndUploadImagesFromContent(content)

    const mediaAssets = []
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => {
        return uploadToCloudinary(file.buffer, {
          folder: 'vybzz/posts',
          resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
        })
      })
      const uploadResults = await Promise.all(uploadPromises)
      uploadResults.forEach((result, index) => {
        mediaAssets.push({
          url: result.secure_url,
          type: files[index].mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE',
        })
      })
    }

    const newPost = await prisma.$transaction(async (tx) => {
      let createdOrFoundTags = []
      if (tags && Array.isArray(tags) && tags.length > 0) {
        const tagOperations = tags.map((tagName) =>
          tx.tag.upsert({
            where: { name: tagName.toLowerCase() },
            update: {},
            create: { name: tagName.toLowerCase() },
          }),
        )
        createdOrFoundTags = await Promise.all(tagOperations)
      }

      const isScheduledBool = isScheduled === 'true'
      let postStatus = 'PUBLISHED'
      let finalPublishDate = new Date()
      if (isScheduledBool && publishDate) {
        postStatus = 'SCHEDULED'
        finalPublishDate = new Date(publishDate)
      }
      const accessLevel = audience === 'paid' ? 'PAID' : 'FREE'

      const post = await tx.post.create({
        data: {
          title,
          content: processedContent,
          creatorId,
          accessLevel,
          status: postStatus,
          isDrop: isDrop === 'true',
          allowComments: allowComments === 'true',
          publishedAt: finalPublishDate,
          mediaAssets: {
            create: mediaAssets,
          },
          tags: {
            create: createdOrFoundTags.map((tag) => ({
              tag: { connect: { id: tag.id } },
            })),
          },
          collections: {
            create:
              collectionIds && Array.isArray(collectionIds)
                ? collectionIds.map((id) => ({
                    collection: { connect: { id } },
                  }))
                : [],
          },
        },
        include: {
          tags: { include: { tag: true } },
          collections: { include: { collection: true } },
          mediaAssets: true,
        },
      })
      return post
    })

    res.status(201).json(newPost)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Could not create the post. An internal error occurred.' })
  }
}

/**
 * Fetch all posts for the authenticated creator.
 */
const getMyPosts = async (req, res) => {
  const { userId: creatorId } = req.auth
  try {
    const posts = await prisma.post.findMany({
      where: { creatorId },
      // FIX: Yahan se 'creator: true' ko hata diya gaya hai kyunki schema mein yeh relation nahi hai.
      include: {
        tags: { include: { tag: true } },
        mediaAssets: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    res.status(200).json(posts)
  } catch (error) {
    // Error ko behtar tareeqe se log karein taake debug karna aasan ho.
    console.error('Error fetching posts for creator:', error)
    res.status(500).json({ error: 'Could not fetch posts.' })
  }
}

/**
 * Fetch a specific post by its ID.
 */
const getPostById = async (req, res) => {
  const { userId: creatorId } = req.auth
  const { id } = req.params
  try {
    const post = await prisma.post.findFirst({
      where: { id, creatorId },
      // FIX: Yahan se bhi 'creator: true' ko hata diya gaya hai.
      include: {
        tags: { include: { tag: true } },
        collections: { include: { collection: true } },
        mediaAssets: true,
      },
    })

    if (!post) {
      return res.status(404).json({ error: "Post not found or you don't have access." })
    }
    res.status(200).json(post)
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    res.status(500).json({ error: 'Could not fetch the post.' })
  }
}

// This function can remain for other potential uses (e.g., profile picture upload).
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' })
    }
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'vybzz/posts',
      resource_type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    })
    res.status(200).json({ url: result.secure_url })
  } catch (error) {
    console.error('Error uploading media:', error)
    res.status(500).json({ error: 'Failed to upload the file.' })
  }
}

module.exports = {
  createPost,
  getMyPosts,
  getPostById,
  uploadMedia,
}

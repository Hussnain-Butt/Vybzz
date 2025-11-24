// File: Frontend/src/api/apiClient.js (COMPLETE AND FINAL UPDATED VERSION)

import axios from 'axios'
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!clerkPubKey) {
  throw new Error('CRITICAL ERROR: Missing VITE_CLERK_PUBLISHABLE_KEY in your frontend .env file')
}
if (!apiBaseUrl) {
  throw new Error('CRITICAL ERROR: Missing VITE_API_BASE_URL in your frontend .env file.')
}

const clerk = new Clerk(clerkPubKey)

clerk.load().then(() => {
  console.log('[apiClient] Clerk JS loaded.')
})

const apiClient = axios.create({
  baseURL: apiBaseUrl,
})

apiClient.interceptors.request.use(
  async (config) => {
    await clerk.load()
    const token = await clerk.session?.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      `[apiClient] Response ERROR for ${error.config.url}:`,
      error.response ? error.response.data : error.message,
    )
    return Promise.reject(error)
  },
)

export const createNewPost = async (formData) => {
  const response = await apiClient.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getMyPosts = async () => {
  const response = await apiClient.get('/posts')
  return response.data
}

export const getPostById = async (postId) => {
  console.log(`[apiClient] getPostById function called for ID: ${postId}`)
  const response = await apiClient.get(`/posts/${postId}`)
  console.log('[apiClient] getPostById response received:', JSON.stringify(response.data, null, 2))
  console.log('[apiClient] Media Assets:', response.data.mediaAssets)
  return response.data
}

// ===================================================================
// === YEH NAYA FUNCTION LIVE STREAM CREATE KAREGA ===
// ===================================================================
/**
 * Requests the backend to create a new Mux live stream.
 * @param {{ title: string; description?: string }} streamData Data for the new stream.
 */
export const createLiveStream = async (streamData) => {
  const response = await apiClient.post('/stream/create', streamData)
  return response.data // Should return { streamKey, playbackId, ... }
}

export const getCurrentUser = async () => {
  const response = await apiClient.get('/users/me')
  return response.data
}

export const getOwnCreatorProfile = async () => {
  const response = await apiClient.get('/users/me')
  return response.data
}

export const updateDetails = async (data) => {
  const response = await apiClient.put('/users/creator/details', data)
  return response.data
}

export const uploadImages = async (formData) => {
  const response = await apiClient.put('/users/creator/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export default apiClient

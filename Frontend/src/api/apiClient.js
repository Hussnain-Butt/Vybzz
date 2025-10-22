// src/api/apiClient.ts (COMPLETE UPDATED CODE WITH LOGGING)
import axios from 'axios'
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!clerkPubKey) {
  throw new Error('CRITICAL ERROR: Missing VITE_CLERK_PUBLISHABLE_KEY in your frontend .env file')
}
if (!apiBaseUrl) {
  throw new Error(
    'CRITICAL ERROR: Missing VITE_API_BASE_URL in your frontend .env file. It should be http://localhost:3000',
  )
}

console.log('[apiClient] Initializing with API_BASE_URL:', apiBaseUrl)

const clerk = new Clerk(clerkPubKey)

clerk.load().then(() => {
  console.log('[apiClient] Clerk JS loaded.')
})

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor (adds auth token)
apiClient.interceptors.request.use(
  async (config) => {
    console.log('[apiClient] Interceptor: Preparing to add auth token...')
    await clerk.load() // Ensure clerk is loaded
    const token = await clerk.session?.getToken()

    if (token) {
      console.log('[apiClient] Interceptor: Token found. Adding to Authorization header.')
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('[apiClient] Interceptor: No token found for this request.')
    }

    console.log(`[apiClient] Interceptor: Making request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('[apiClient] Interceptor: Request error:', error)
    return Promise.reject(error)
  },
)

// Response Interceptor (logs the outcome)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[apiClient] Response SUCCESS for ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error(
      `[apiClient] Response ERROR for ${error.config.url}:`,
      error.toJSON ? error.toJSON() : error,
    )
    return Promise.reject(error)
  },
)

export const getCurrentUser = async () => {
  console.log('[apiClient] getCurrentUser function called.')
  const response = await apiClient.get('/users/me')
  console.log('[apiClient] getCurrentUser response received.')
  return response.data
}

// Function to update creator profile details (bio, status, etc.)
export const updateDetails = async (data) => {
  const response = await apiClient.put('/users/creator/details', data)
  return response.data
}

// Function to upload images (profile, banner)
export const uploadImages = async (formData) => {
  const response = await apiClient.put('/users/creator/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export default apiClient

// frontend/src/api/apiClient.js

import axios from 'axios'
import { Clerk } from '@clerk/clerk-js'

// IMPORTANT: Replace with your actual Clerk Publishable Key from your .env file
// We need to instantiate Clerk here to get access to the session token.
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}
const clerk = new Clerk(clerkPubKey)

// Load the clerk instance
clerk.load()

// Ek naya axios instance banayein
const apiClient = axios.create({
  // .env file se base URL get karein
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Har request ke saath authentication token bhejne ke liye.
// This function will run before each request is sent.
apiClient.interceptors.request.use(
  async (config) => {
    // Wait for Clerk to be loaded and get the token
    await clerk.load()
    const token = await clerk.session?.getToken()

    // Agar token hai, to usse 'Authorization' header mein add karein
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  },
)

export default apiClient

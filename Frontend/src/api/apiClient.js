// frontend/src/api/apiClient.js

import axios from 'axios'

// Ek naya axios instance banayein
const apiClient = axios.create({
  // .env file se base URL get karein
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Aap yahan par request/response interceptors bhi add kar sakte hain
// maslan, har request ke saath authentication token bhejne ke liye.

export default apiClient

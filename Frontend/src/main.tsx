// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// ---- ENV ----
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CLERK_SIGN_IN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL || '/login'
const CLERK_SIGN_UP_URL = import.meta.env.VITE_CLERK_SIGN_UP_URL || '/login'
const CLERK_AFTER_SIGN_IN_URL = import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || '/member/home'
const CLERK_AFTER_SIGN_UP_URL = import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || '/member/home'

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key from .env file')
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        // ✅ Explicit props: isse Clerk kabhi undefined URL pass nahi karega
        signInUrl={CLERK_SIGN_IN_URL}
        signUpUrl={CLERK_SIGN_UP_URL}
        afterSignInUrl={CLERK_AFTER_SIGN_IN_URL}
        afterSignUpUrl={CLERK_AFTER_SIGN_UP_URL}
        // ⚠️ navigate prop hata diya — agar yahan galat value aaye to /undefined ban jata hai
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

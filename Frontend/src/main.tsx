// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App'
import './index.css'

// ---- ENV ----
const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_d2VsY29tZS1kZWVyLTAuY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key from .env file')
}

// ClerkProvider ko BrowserRouter ke andar wrap karna zaroori hai
// taake hum routing ke liye useNavigate hook istemal kar sakein.
const ClerkProviderWithRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      // ✅ Sahi aur modern tareeqa redirection handle karne ka
      signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL || '/login'}
      signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL || '/login'}
      signInFallbackRedirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || '/member/home'}
      signUpFallbackRedirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || '/member/home'}
    >
      {children}
    </ClerkProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRoutes>
        <App />
      </ClerkProviderWithRoutes>
    </BrowserRouter>
  </React.StrictMode>,
)

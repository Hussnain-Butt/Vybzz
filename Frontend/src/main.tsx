// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query' // ✅ [CHANGE 1] React Query ko import karein
import App from './App'
import './index.css'

// ---- ENV ----
const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_d2VsY29tZS1kZWVyLTAuY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key from .env file')
}

// ✅ [CHANGE 2] React Query ka client banayein. Yeh data ko cache karne ke liye zaroori hai.
const queryClient = new QueryClient()

// ClerkProvider ko BrowserRouter ke andar wrap karna zaroori hai
// taake hum routing ke liye useNavigate hook istemal kar sakein.
const ClerkProviderWithRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL || '/login'}
      signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL || '/login'}
      // ✅ [CHANGE 3] SABSE AHEM TABDEELI!
      // Hum Clerk ko hidayat de rahe hain ke sign-in ya sign-up ke baad hamesha hamare Gatekeeper page par jaye.
      // Is se yeh yakeeni hoga ke hamari custom redirection logic hamesha chalti hai aur koi conflict nahi hota.
      signInFallbackRedirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || '/auth-redirect'}
      signUpFallbackRedirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || '/auth-redirect'}
    >
      {children}
    </ClerkProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <>
    <BrowserRouter>
      <ClerkProviderWithRoutes>
        {/* ✅ [CHANGE 4] Poori application ko QueryClientProvider se wrap karein */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProviderWithRoutes>
    </BrowserRouter>
    ,
  </>,
)

// src/pages/Auth/SsoCallbackPage.tsx
import React from 'react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'

const SsoCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams()

  // Step 3: Social site (Google) se wapas aane ke baad, URL se 'role' ko dobara parho.
  // LoginPage ne yeh role yahan tak pohunchaya hai.
  const role = searchParams.get('role') || 'member'

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] flex flex-col items-center justify-center p-6 space-y-4">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"
        aria-label="Loading..."
        role="status"
      />
      <div className="text-center">
        <p className="text-base font-medium">Finalizing sign-in...</p>
        <p className="text-sm opacity-70">Please wait a moment.</p>
      </div>

      {/* 
        Step 4: Clerk ko batao ke sign-in complete hone ke baad 'role' ko Gatekeeper page 
        (AuthRedirectPage) ke URL mein daal de. Yeh is silsile ki aakhri aur mazboot kadi hai.
      */}
      <AuthenticateWithRedirectCallback
        afterSignInUrl={`/auth-redirect?role=${role}`}
        afterSignUpUrl={`/auth-redirect?role=${role}`}
      />
    </div>
  )
}

export default SsoCallbackPage

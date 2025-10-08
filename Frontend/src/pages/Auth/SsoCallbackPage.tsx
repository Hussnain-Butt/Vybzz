// src/pages/Auth/SsoCallbackPage.tsx
import React from 'react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

const SsoCallbackPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] flex flex-col items-center justify-center p-6 space-y-4">
      {/* ---- Efficient Pure CSS Loader ---- */}
      {/* Yeh loader foran render hoga kyunki is mein JavaScript animation nahi hai. */}
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"
        aria-label="Loading..."
        role="status"
      />

      {/* ---- Contextual Text ---- */}
      <div className="text-center">
        <p className="text-base font-medium">Finalizing sign-in...</p>
        <p className="text-sm opacity-70">Please wait a moment.</p>
      </div>

      {/* Yeh component background mein authentication handle karega. UI iske upar foran dikh jayega. */}
      <AuthenticateWithRedirectCallback />
    </div>
  )
}

export default SsoCallbackPage

// src/pages/Auth/SsoCallbackPage.tsx
import React from 'react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

const SsoCallbackPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] flex items-center justify-center p-6">
      {/* ---- Branded loader UI ---- */}
      <div className="flex flex-col items-center gap-4">
        {/* spinner */}
        <div
          aria-label="Loading"
          className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin"
        />
        <div className="text-center">
          <p className="text-base font-medium">Signing you in…</p>
          <p className="text-sm opacity-70">Completing secure OAuth handshake</p>
        </div>
      </div>

      <AuthenticateWithRedirectCallback />
    </div>
  )
}

export default SsoCallbackPage

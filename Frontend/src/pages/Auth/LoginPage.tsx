// src/pages/Auth/LoginPage.tsx

import React, { useState, useEffect, useRef } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'

import VybzzLogo from '../../assets/Logo.png'
import AppleLogo from '../../assets/apple.png'
import FacebookLogo from '../../assets/facebook.png'
import GoogleLogo from '../../assets/google.png'

const LoginPage: React.FC = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URL se user ka irada (role) nikalo. Default 'member' hai.
  const role = searchParams.get('role') || 'member'

  const [email, setEmail] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const formContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formContainerRef.current) {
      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
      )
    }
  }, [])

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    if (pendingVerification) {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        })
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          // Email login ke baad, role ke saath Gatekeeper par bhejo
          navigate(`/auth-redirect?role=${role}`)
        }
      } catch (err: any) {
        setError(err?.errors?.[0]?.longMessage || 'Verification failed')
      }
      return
    }

    try {
      const signInAttempt = await signIn.create({ identifier: email })
      if (signInAttempt.status === 'needs_first_factor') {
        setPendingVerification(true)
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || 'Sign in failed')
    }
  }

  // ✅ --- [UPDATED PART START] --- ✅
  // Hum ab user ke 'role' ko URL ke bajaye sessionStorage mein save karenge.
  const handleSocialLogin = async (strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook') => {
    if (!isLoaded) return
    try {
      // Step A: Clerk ko call karne se PEHLE user ka irada (role) sessionStorage mein save kar lein.
      // Yeh 100% reliable tareeqa hai.
      sessionStorage.setItem('authIntent', role)

      // Step B: Ab Clerk ko redirect karne dein.
      // Clerk ki global settings (jo main.tsx mein hain) usay automatically `/auth-redirect` par bhej dengi.
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/auth-redirect',
      })
    } catch (err: any) {
      console.error(`Error during ${strategy} auth:`, err)
      setError(err?.errors?.[0]?.longMessage || 'OAuth failed')
    }
  }
  // ✅ --- [UPDATED PART END] --- ✅

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] p-4 font-sans flex flex-col items-center justify-center">
      <div ref={formContainerRef} className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={VybzzLogo} alt="Vybzz Nation Logo" className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] text-center mb-6">
          {role === 'creator' ? 'Creator Login' : 'Log in or sign up'}
        </h1>

        <div className="bg-[rgb(var(--color-background-light))] rounded-2xl p-8 border border-[rgb(var(--color-surface-2))]">
          {!pendingVerification && (
            <>
              <div className="space-y-3">
                <button
                  onClick={() => handleSocialLogin('oauth_google')}
                  disabled={!isLoaded}
                  className="relative w-full flex items-center justify-center py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={GoogleLogo}
                    alt="Google"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6"
                  />
                  <span>Continue with Google</span>
                </button>
                <button
                  onClick={() => handleSocialLogin('oauth_apple')}
                  disabled={!isLoaded}
                  className="relative w-full flex items-center justify-center py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={AppleLogo}
                    alt="Apple"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6"
                  />
                  <span>Continue with Apple</span>
                </button>
                <button
                  onClick={() => handleSocialLogin('oauth_facebook')}
                  disabled={!isLoaded}
                  className="relative w-full flex items-center justify-center py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={FacebookLogo}
                    alt="Facebook"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6"
                  />
                  <span>Continue with Facebook</span>
                </button>
              </div>

              <div className="flex items-center my-6">
                <hr className="w-full border-[rgb(var(--color-surface-3))]" />
                <span className="px-3 text-sm text-[rgb(var(--color-text-muted))]">or</span>
                <hr className="w-full border-[rgb(var(--color-surface-3))]" />
              </div>
            </>
          )}

          <form onSubmit={handleEmailContinue} className="space-y-4">
            {pendingVerification ? (
              <>
                <p className="text-center text-sm text-[rgb(var(--color-text-secondary))]">
                  A verification code has been sent. Please enter it below.
                </p>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] placeholder-[rgb(var(--color-text-secondary)/0.8)] focus:border-[rgb(var(--color-text-link))] focus:ring-[rgb(var(--color-text-link))] focus:ring-1 outline-none transition-colors duration-300"
                />
              </>
            ) : (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] placeholder-[rgb(var(--color-text-secondary)/0.8)] focus:border-[rgb(var(--color-text-link))] focus:ring-[rgb(var(--color-text-link))] focus:ring-1 outline-none transition-colors duration-300"
              />
            )}
            <button
              type="submit"
              disabled={!isLoaded}
              className="w-full p-3 bg-slate-300 text-black font-bold rounded-lg hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pendingVerification ? 'Verify Code' : 'Continue'}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </form>
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="text-sm text-[rgb(var(--color-text-link))] font-medium underline hover:text-[rgb(var(--color-text-link)/0.9)] transition-colors"
          >
            Need help signing in?
          </a>
        </div>
        <p className="text-xs text-[rgb(var(--color-text-muted))] text-center mt-10 max-w-xs mx-auto">
          By signing up, you agree to Vybzz Nation's{' '}
          <a href="#" className="underline hover:text-[rgb(var(--color-text-secondary))]">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-[rgb(var(--color-text-secondary))]">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default LoginPage

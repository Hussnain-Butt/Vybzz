// src/pages/Auth/LoginPage.tsx
import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

// --- Importing all necessary image assets ---
import VybzzLogo from '../../assets/Logo.png'
import AppleLogo from '../../assets/apple.png'
import FacebookLogo from '../../assets/facebook.png'

// --- SVG Icon for Google (Brand colors are kept as is) ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M44.5 24.3h-2.5v-2.2h-1.8v2.2h-2.2v1.8h2.2v2.2h1.8v-2.2h2.5v-1.8z" fill="#4285F4" />
    <path d="M24 44c11.05 0 20-8.95 20-20S35.05 4 24 4 4 12.95 4 24s8.95 20 20 20z" fill="#fff" />
    <path d="M36 24c0-6.63-5.37-12-12-12v12h12z" fill="#1A73E8" />
    <path d="M12 24c0 6.63 5.37 12 12 12V24H12z" fill="#34A853" />
    <path d="M24 12c-6.63 0-12 5.37-12 12h12V12z" fill="#FBBC05" />
  </svg>
)

// The main page component
const LoginPage: React.FC = () => {
  const formContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const formContainer = formContainerRef.current
    if (formContainer) {
      gsap.fromTo(
        formContainer,
        { opacity: 0, y: 50, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
      )
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] p-4 font-sans flex flex-col items-center justify-center">
      <div ref={formContainerRef} className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={VybzzLogo} alt="Vybzz Nation Logo" className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] text-center mb-6">
          Log in or sign up
        </h1>

        {/* --- Form Card --- */}
        <div className="bg-[rgb(var(--color-background-light))] rounded-2xl p-8 border border-[rgb(var(--color-surface-2))]">
          <div className="space-y-3">
            {/* Continue as User Button */}
            <button className="w-full flex items-center justify-between text-left p-3 bg-[rgb(var(--color-surface-interactive))] rounded-lg border border-[rgb(var(--color-surface-3))] hover:border-[rgb(var(--color-text-link))] transition-colors duration-300">
              <div className="flex items-center gap-3">
                <img
                  src="https://picsum.photos/seed/bhussnain/40/40"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                    Continue as hussnain
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary)/0.8)]">
                    bhussnain966@gmail.com
                  </p>
                </div>
              </div>
              <GoogleIcon />
            </button>

            {/* Social Login Buttons */}
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-300">
              <img src={AppleLogo} alt="Apple" className="w-6 h-6" />
              Continue with Apple
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-300">
              <img src={FacebookLogo} alt="Facebook" className="w-6 h-6" />
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="w-full border-[rgb(var(--color-surface-3))]" />
            <span className="px-3 text-sm text-[rgb(var(--color-text-muted))]">or</span>
            <hr className="w-full border-[rgb(var(--color-surface-3))]" />
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border border-[rgb(var(--color-surface-3))] placeholder-[rgb(var(--color-text-secondary)/0.8)] focus:border-[rgb(var(--color-text-link))] focus:ring-[rgb(var(--color-text-link))] focus:ring-1 outline-none transition-colors duration-300"
            />
            <button className="w-full p-3 bg-slate-300 text-black font-bold rounded-lg hover:bg-white transition-colors duration-300">
              Continue
            </button>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center mt-8">
          <a
            href="#"
            className="text-sm text-[rgb(var(--color-text-link))] font-medium underline hover:text-[rgb(var(--color-text-link)/0.9)] transition-colors"
          >
            Need help signing in?
          </a>
        </div>

        {/* Terms and Policy */}
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

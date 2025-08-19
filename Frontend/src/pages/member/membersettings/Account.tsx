import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  FaGoogle,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaTwitch,
  FaTiktok,
  FaInfoCircle,
} from 'react-icons/fa'

// Reusable custom Toggle Switch for a modern feel
const ToggleSwitch = ({ enabled, setEnabled }) => (
  <button
    type="button"
    onClick={() => setEnabled(!enabled)}
    className={`
      relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out
      ${enabled ? 'bg-[rgb(var(--color-primary-blue))]' : 'bg-[rgb(var(--color-surface-3))]'}
    `}
  >
    <span
      className={`
        inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out
        ${enabled ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
)

// Reusable Card component for consistent section styling
const SettingsCard = ({ title, children, className }) => (
  <div
    className={`account-card bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-6 sm:p-8 ${className}`}
  >
    <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>
    {children}
  </div>
)

const Account = () => {
  const [isCommunityProfile, setIsCommunityProfile] = React.useState(true)
  const [isFullProfile, setIsFullProfile] = React.useState(false)
  const [showAdult, setShowAdult] = React.useState(false)

  // GSAP animation for staggering card load-in
  useEffect(() => {
    gsap.fromTo(
      '.account-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      },
    )
  }, [])

  const socialAccounts = [
    { icon: <FaYoutube className="text-red-600" />, name: 'YouTube' },
    { icon: <FaInstagram className="text-pink-500" />, name: 'Instagram' },
    { icon: <FaTwitter className="text-blue-400" />, name: 'Twitter' },
    { icon: <FaFacebookF className="text-blue-600" />, name: 'Facebook' },
    { icon: <FaTwitch className="text-purple-500" />, name: 'Twitch' },
    { icon: <FaTiktok />, name: 'TikTok' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Login Section */}
      <SettingsCard title="Login">
        <div className="space-y-6">
          <div className="bg-[rgb(var(--color-surface-2))] rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              You haven't set a password for your account.
            </p>
            <button className="bg-white text-[rgb(var(--color-background-dark))] font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              Set Password
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaGoogle size={22} />
              <span className="text-sm font-medium">Log in with Google</span>
            </div>
            <div>
              <a
                href="#"
                className="text-sm font-bold text-[rgb(var(--color-primary-blue))] hover:underline"
              >
                Disconnect
              </a>
              <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                You must have a password before disconnecting.
              </p>
            </div>
          </div>
          <div className="border-t border-[rgb(var(--color-surface-3))] my-4"></div>
          <div>
            <h3 className="text-md font-bold flex items-center gap-2 mb-3">
              Two-factor authentication
              <FaInfoCircle className="text-[rgb(var(--color-text-muted))]" />
            </h3>
            <div className="flex gap-4">
              <button className="flex-1 bg-[rgb(var(--color-surface-interactive))] hover:bg-[rgb(var(--color-surface-3))] text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                Use text message
              </button>
              <button className="flex-1 bg-[rgb(var(--color-surface-interactive))] hover:bg-[rgb(var(--color-surface-3))] text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                Use authenticator app
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Social Links Section */}
      <SettingsCard title="Social links">
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-6 -mt-2">
          Add your social accounts to display them on your public profile.
        </p>
        <div className="space-y-4">
          {socialAccounts.map(({ icon, name }) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 bg-[rgb(var(--color-surface-2))] rounded-lg"
            >
              <div className="flex items-center gap-4">
                {icon}
                <span className="font-medium text-sm">{name}</span>
              </div>
              <button className="text-sm font-bold text-[rgb(var(--color-primary-cyan))] hover:underline">
                Connect
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Privacy Section */}
      <SettingsCard title="Privacy">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">Full public profile</h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-md mt-1">
                Your public profile always includes your name, photo, and join date. If this is on,
                additional details will be public.
              </p>
              <a
                href="#"
                className="text-sm font-bold text-[rgb(var(--color-primary-blue))] hover:underline mt-1 inline-block"
              >
                Learn more
              </a>
            </div>
            <ToggleSwitch enabled={isFullProfile} setEnabled={setIsFullProfile} />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">Community profile</h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-md mt-1">
                Your community profile shows more information and is visible to people in
                communities that you're both part of.
              </p>
              <a
                href="#"
                className="text-sm font-bold text-[rgb(var(--color-primary-blue))] hover:underline mt-1 inline-block"
              >
                Learn more
              </a>
            </div>
            <ToggleSwitch enabled={isCommunityProfile} setEnabled={setIsCommunityProfile} />
          </div>
        </div>
      </SettingsCard>

      {/* Adult Content Section */}
      <SettingsCard title="Adult content">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">See 18+ creators</h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-md mt-1">
              You must be 18 years or older to see adult/18+ images, videos, written content, and
              other media.
            </p>
            <a
              href="#"
              className="text-sm font-bold text-[rgb(var(--color-primary-blue))] hover:underline mt-1 inline-block"
            >
              Learn more
            </a>
          </div>
          <ToggleSwitch enabled={showAdult} setEnabled={setShowAdult} />
        </div>
      </SettingsCard>
    </div>
  )
}

export default Account

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'

const menuLinks = [
  'News',
  'Patreon for Creators',
  'Help Center & FAQ',
  'Feature Requests',
  'Terms of Use',
  'Privacy Policy',
  'Community Policies',
]

interface ProfileMenuProps {
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement>
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, buttonRef }) => {
  const [activeTheme, setActiveTheme] = useState('System')
  const menuRef = useRef<HTMLDivElement>(null)

  const { signOut } = useClerk()
  const navigate = useNavigate()

  // Menu open/close ke liye animation
  useLayoutEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' },
      )
    }
  }, [isOpen])

  // Menu ke bahar click karne par use band karne ka logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, buttonRef])

  // Sign-out process ko handle karne wala function
  const handleSignOut = () => {
    signOut(() => navigate('/'))
  }

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 right-0 mb-2 w-72 bg-[rgb(var(--color-surface-2))] rounded-xl shadow-2xl border border-[rgb(var(--color-surface-3))] z-50"
    >
      <div className="p-2">
        {/* Appearance Section */}
        <div className="px-3 pt-2 pb-1">
          <p className="text-sm font-semibold text-[rgb(var(--color-text-secondary))]">
            Appearance
          </p>
          <div className="mt-2 flex items-center bg-[rgb(var(--color-surface-1))] rounded-lg p-1">
            {['Light', 'Dark', 'System'].map((theme) => (
              <button
                key={theme}
                onClick={() => setActiveTheme(theme)}
                className={`flex-1 text-sm py-1.5 rounded-md font-semibold transition-colors duration-200 ${
                  activeTheme === theme
                    ? 'bg-[rgb(var(--color-surface-3))] text-white'
                    : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-2))]'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div className="my-2 border-t border-[rgb(var(--color-surface-3))]"></div>
        <nav className="py-1">
          {menuLinks.map((link) => (
            <a
              href="#"
              key={link}
              className="block px-3 py-2 text-sm rounded-lg text-white hover:bg-[rgb(var(--color-surface-3))]"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="my-1 border-t border-[rgb(var(--color-surface-3))]"></div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-[rgb(var(--color-surface-3))]"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

export default ProfileMenu

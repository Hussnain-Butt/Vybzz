// src/components/dashboard/ProfileMenu.tsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { LogOut } from 'lucide-react'

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
  // We'll receive the button reference to position the menu
  buttonRef: React.RefObject<HTMLButtonElement>
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, buttonRef }) => {
  const [activeTheme, setActiveTheme] = useState('System')
  const menuRef = useRef<HTMLDivElement>(null)

  // Animation for menu open/close
  useLayoutEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' },
      )
    }
  }, [isOpen])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close if click is outside the menu AND outside the button that opens it
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

  if (!isOpen) return null

  return (
    // ✅ FIX: Changed positioning classes to be above the parent
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
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-[rgb(var(--color-surface-3))]">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </div>
  )
}

export default ProfileMenu

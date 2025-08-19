import React, { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { FaChevronDown } from 'react-icons/fa'

const MemberSettings = () => {
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef(null)
  const activeLinkRef = useRef(null)
  const activeLineRef = useRef(null)

  const tabs = [
    { name: 'Basics', path: 'basics' },
    { name: 'Account', path: 'account' },
    { name: 'Email notifications', path: 'notifications' },
    { name: 'Memberships', path: 'memberships' },
    { name: 'Billing history', path: 'billing' },
  ]

  const moreTabs = [
    { name: 'Payment methods', path: 'payment-methods' },
    { name: 'Connected apps', path: 'connected-apps' },
    { name: 'Blocked users', path: 'blocked-users' },
  ]

  const isMoreTabActive = moreTabs.some((tab) => location.pathname.includes(tab.path))

  // GSAP Animation for active tab indicator
  useEffect(() => {
    const activeElement = activeLinkRef.current
    const line = activeLineRef.current

    if (activeElement && line) {
      gsap.to(line, {
        width: activeElement.offsetWidth,
        x: activeElement.offsetLeft,
        duration: 0.4,
        ease: 'power3.inOut',
      })
    }
  }, [location.pathname]) // Trigger animation on route change

  // GSAP Animation for page content
  useEffect(() => {
    const content = contentRef.current
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      )
    }
  }, [location.pathname])

  return (
    <div className="bg-[rgb(var(--color-background-dark))] text-white min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header can be added here if needed */}
        {/* <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </header> */}

        {/* Professional Navigation Tabs */}
        <nav className="relative border-b border-[rgb(var(--color-surface-2))]">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                ref={(el) => {
                  if (location.pathname.includes(tab.path)) {
                    activeLinkRef.current = el
                  }
                }}
                className={({ isActive }) =>
                  `py-4 px-2 sm:px-4 text-sm font-bold transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-[rgb(var(--color-text-muted))] hover:text-white'
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}

            {/* "More" Dropdown */}
            <div className="relative">
              <button
                ref={(el) => {
                  if (isMoreTabActive) activeLinkRef.current = el
                }}
                onClick={() => setMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center gap-2 py-4 px-2 sm:px-4 text-sm font-bold transition-colors duration-300 ${
                  isMoreTabActive
                    ? 'text-white'
                    : 'text-[rgb(var(--color-text-muted))] hover:text-white'
                }`}
              >
                More
                <FaChevronDown
                  className={`transition-transform duration-200 ${
                    isMoreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isMoreMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[rgb(var(--color-surface-1))] rounded-lg shadow-2xl z-10 animate-fadeIn border border-[rgb(var(--color-surface-2))]">
                  <ul className="py-2">
                    {moreTabs.map((tab) => (
                      <li key={tab.name}>
                        <NavLink
                          to={tab.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className={({ isActive }) =>
                            `block w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                              isActive
                                ? 'bg-[rgb(var(--color-primary-cyan))] text-white'
                                : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                            }`
                          }
                        >
                          {tab.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Animated Active Line */}
          <div
            ref={activeLineRef}
            className="absolute bottom-0 h-0.5 bg-white"
            style={{ transition: 'width 0.4s, transform 0.4s' }}
          />
        </nav>

        {/* Content Outlet with animation */}
        <main ref={contentRef} className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MemberSettings

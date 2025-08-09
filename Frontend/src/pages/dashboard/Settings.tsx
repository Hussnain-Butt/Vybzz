// src/pages/dashboard/Settings.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { gsap } from 'gsap'

const TABS = [
  { name: 'Account', path: 'account' },
  { name: 'Team', path: 'team' },
  { name: 'Apps', path: 'apps' },
  { name: 'Podcast and audio', path: 'podcast' },
  { name: 'Notifications', path: 'notifications' },
  { name: 'Billing and payouts', path: 'billing' },
]

const Settings = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-header',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.gsap-tab',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.2, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-8 text-[rgb(var(--color-text-primary))] min-h-screen"
    >
      <div className="max-w-full mx-auto">
        <header className="gsap-header">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Settings</h1>
        </header>

        <div className="border-b border-[rgb(var(--color-surface-2))] mt-8 mb-8">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {TABS.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({
                  isActive,
                }) => `gsap-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                  ${
                                    isActive
                                      ? 'border-[rgb(var(--color-primary-blue))] text-[rgb(var(--color-primary-blue))]'
                                      : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-white'
                                  }`}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Settings

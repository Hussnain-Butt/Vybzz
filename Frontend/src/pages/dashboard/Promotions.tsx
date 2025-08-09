// src/pages/dashboard/Promotions.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ShieldAlert } from 'lucide-react'

const TABS = [
  { name: 'Autopilot', path: 'autopilot', feature: 'Autopilot' },
  { name: 'Discounts', path: 'discounts', feature: 'Membership discounts' },
  { name: 'Gifts', path: 'gifts', feature: 'Gifting' },
]

const VerificationBanner = ({ featureName }: { featureName: string }) => (
  <div className="gsap-banner bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex items-start gap-4">
      <ShieldAlert className="h-8 w-8 text-[rgb(var(--color-text-secondary))] flex-shrink-0" />
      <div>
        <h3 className="font-bold text-white">
          You must verify your identity to access {featureName}
        </h3>
        <p className="text-[rgb(var(--color-text-secondary))] text-sm">
          Please verify your identity now.
        </p>
      </div>
    </div>
    <button className="bg-slate-200 text-slate-900 font-bold py-2.5 px-6 rounded-lg hover:bg-white transition-colors w-full sm:w-auto flex-shrink-0">
      Verify your identity
    </button>
  </div>
)

const Promotions = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const activeTab = TABS.find((tab) => location.pathname.includes(tab.path)) || TABS[0]

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
        { y: 0, opacity: 1, stagger: 0.1, delay: 0.2, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.gsap-banner',
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.4, ease: 'power3.out' },
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
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Promotions</h1>
        </header>

        <div className="border-b border-[rgb(var(--color-surface-2))] mt-8 mb-8">
          <nav className="-mb-px flex space-x-6">
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

        <div className="mb-8">
          <VerificationBanner featureName={activeTab.feature} />
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Promotions

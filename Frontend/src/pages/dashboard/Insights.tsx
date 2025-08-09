// src/pages/dashboard/Insights.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { Info, ChevronDown, CheckCircle } from 'lucide-react'

const TABS = [
  { name: 'Membership', path: 'membership' },
  { name: 'Earnings', path: 'earnings' },
  { name: 'Posts', path: 'posts' },
  { name: 'Surveys', path: 'surveys' },
  { name: 'Traffic', path: 'traffic' },
]

const Insights = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const activePath = location.pathname

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
        '.gsap-toolbar',
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.4, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Toolbar ko conditional render karne ke liye functions
  const shouldShowToolbar = () => !activePath.includes('surveys')
  const getTimeframe = () => {
    if (activePath.includes('posts')) return 'Past 28 days'
    if (activePath.includes('earnings')) return 'Past 6 months'
    return 'Past 30 days'
  }
  const getLastUpdated = () => {
    if (activePath.includes('posts')) return 'Last updated at 8:06 AM'
    if (activePath.includes('traffic')) return 'Last updated at 3:37 AM'
    return 'Last updated at 5:06 AM'
  }

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-8 text-[rgb(var(--color-text-primary))] min-h-screen"
    >
      <div className="max-w-full mx-auto">
        <header className="gsap-header">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Insights</h1>
        </header>

        <div className="border-b border-[rgb(var(--color-surface-2))] mt-8 mb-6">
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

        {shouldShowToolbar() && (
          <div className="gsap-toolbar flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors">
              <span className="font-medium text-sm">{getTimeframe()}</span>
              <ChevronDown size={16} />
            </button>
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
              {activePath.includes('posts') && <CheckCircle size={14} className="text-green-500" />}
              <span className={activePath.includes('posts') ? 'text-green-500' : ''}>
                {activePath.includes('posts') ? 'All data available' : <Info size={14} />}
              </span>
              <span>{getLastUpdated()}</span>
            </div>
          </div>
        )}

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Insights

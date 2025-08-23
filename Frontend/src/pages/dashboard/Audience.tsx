// src/pages/dashboard/Audience.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { gsap } from 'gsap'
import { Search, Send, Download, SlidersHorizontal, Settings, X } from 'lucide-react'

const TABS = [
  { name: 'Relationship manager', path: 'relationship-manager' },
  { name: 'Benefits', path: 'benefits' },
  { name: 'Exit surveys', path: 'exit-surveys' },
  // { name: 'Blocked users', path: '#' },
]

const Audience = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isRelationshipManager = window.location.pathname.includes('relationship-manager')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.gsap-header', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }).fromTo(
        '.gsap-tabs nav a',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.3',
      )

      if (isRelationshipManager) {
        tl.fromTo(
          '.gsap-toolbar',
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.4',
        ).fromTo(
          '.gsap-filters',
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.3',
        )
      }
    }, containerRef)
    return () => ctx.revert()
  }, [isRelationshipManager])

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-8 text-[rgb(var(--color-text-primary))] min-h-screen"
    >
      <div className="max-w-full mx-auto">
        <header className="gsap-header mb-6 flex justify-between items-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Audience</h1>
        </header>

        <div className="gsap-tabs border-b border-[rgb(var(--color-surface-2))] mb-6">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {TABS.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({
                  isActive,
                }) => `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${
                    isActive
                      ? 'border-[rgb(var(--color-primary-blue))] text-[rgb(var(--color-primary-blue))]'
                      : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-surface-3))]'
                  }`}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Toolbar (Only for Relationship Manager) */}
        {isRelationshipManager && (
          <>
            <div className="gsap-toolbar flex flex-col sm:flex-row items-center gap-4 mb-5">
              <div className="relative w-full sm:w-72">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
                />
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="w-full bg-[rgb(var(--color-surface-2))] pl-10 pr-8 py-2.5 rounded-lg border-2 border-transparent focus:border-[rgb(var(--color-primary-cyan))] outline-none"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[rgb(var(--color-surface-2))] rounded-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors">
                <Send size={16} />
                <span className="font-medium text-sm">Message</span>
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[rgb(var(--color-surface-2))] rounded-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors">
                <Download size={16} />
                <span className="font-medium text-sm">CSV</span>
              </button>
            </div>
            <div className="gsap-filters flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] rounded-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors">
                  <SlidersHorizontal size={16} />
                  <span className="font-medium text-sm">Filters</span>
                </button>
                <span className="bg-[rgb(var(--color-surface-1))] text-xs font-semibold px-2.5 py-1 rounded-full">
                  New this month
                </span>
                <a href="#" className="text-sm text-[rgb(var(--color-text-link))] hover:underline">
                  Clear all
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[rgb(var(--color-text-muted))]">Showing 0 of 0</span>
                <button className="text-[rgb(var(--color-text-muted))] hover:text-white">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Child Route Content Yahan Render Hoga */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Audience

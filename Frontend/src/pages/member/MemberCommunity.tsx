// src/pages/dashboard/MemberComunity.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { Search, ListFilter } from 'lucide-react'

const TABS = [
  { name: 'Chats', path: 'chats' },
  { name: 'Direct Messages', path: 'direct-messages' },
]

const MemberComunity = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isDirectMessages = location.pathname.includes('direct-messages')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.gsap-header', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }).fromTo(
        '.gsap-tab',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1 },
        '-=0.4',
      )

      if (isDirectMessages) {
        tl.fromTo(
          '.gsap-dm-toolbar',
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3',
        )
      }
    }, containerRef)
    return () => ctx.revert()
  }, [isDirectMessages])

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-8 text-[rgb(var(--color-text-primary))] min-h-screen"
    >
      <div className="max-w-full mx-auto">
        <header className="gsap-header">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Community</h1>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 mb-8 gap-4">
          {/* Tabs */}
          <div className="bg-[rgb(var(--color-surface-1))] p-1.5 rounded-lg flex items-center gap-2">
            {TABS.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({
                  isActive,
                }) => `gsap-tab px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300
                                    ${
                                      isActive
                                        ? 'bg-[rgb(var(--color-surface-3))] text-white'
                                        : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))]'
                                    }`}
              >
                {tab.name}
              </NavLink>
            ))}
          </div>

          {/* Conditional Toolbar for Direct Messages */}
          {isDirectMessages && (
            <div className="gsap-dm-toolbar flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
                />
                <input
                  type="text"
                  placeholder="Search or start new conversation"
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--color-surface-2))] text-white rounded-lg border-2 border-transparent focus:border-[rgb(var(--color-primary-cyan))] outline-none"
                />
              </div>
              <button className="p-3 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors">
                <ListFilter size={20} />
              </button>
            </div>
          )}
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MemberComunity

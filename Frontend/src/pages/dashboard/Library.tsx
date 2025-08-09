// src/pages/dashboard/Library.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { Search, Filter } from 'lucide-react'

// Tabs ke liye data structure, routing ke liye path ke saath
const TABS = [
  { name: 'Posts', path: 'posts' },
  { name: 'Collections', path: 'collections' },
  { name: 'Drafts', path: 'drafts' },
]

const Library = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Active tab ka naam URL se hasil karein, search bar mein dikhane ke liye
  const activeTabName = TABS.find((tab) => location.pathname.includes(tab.path))?.name || 'Posts'

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(
        '.gsap-title',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
        .fromTo(
          '.gsap-tab',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' },
          '-=0.3',
        )
        .fromTo(
          '.gsap-toolbar',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
          '-=0.3',
        )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-8 text-[rgb(var(--color-text-primary))] min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gsap-title">Library</h1>
          <p className="text-lg text-[rgb(var(--color-text-muted))] mt-2 gsap-title">
            Manage your creative content with ease.
          </p>
        </header>

        {/* Tabs aur Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Tabs Navigation (ab NavLink ka istemal kar raha hai) */}
          <nav className="bg-[rgb(var(--color-surface-1))] p-1.5 rounded-lg">
            <ul className="flex items-center gap-2">
              {TABS.map((tab) => (
                <li key={tab.name} className="gsap-tab">
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ease-in-out ${
                        isActive
                          ? 'bg-[rgb(var(--color-primary-blue))] text-white'
                          : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))]'
                      }`
                    }
                  >
                    {tab.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Toolbar: Filter and Search */}
          <div className="flex w-full sm:w-auto items-center gap-3 gsap-toolbar">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors duration-200">
              <Filter size={18} />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <div className="relative flex-grow">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
              />
              <input
                type="text"
                placeholder={`Search in ${activeTabName}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--color-surface-interactive))] text-[rgb(var(--color-text-primary))] rounded-lg border-2 border-transparent focus:border-[rgb(var(--color-primary-cyan))] focus:ring-0 outline-none transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Child Route Content Yahan Render Hoga */}
        <Outlet />
      </div>
    </div>
  )
}

export default Library

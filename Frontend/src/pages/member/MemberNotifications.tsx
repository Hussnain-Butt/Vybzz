// src/pages/dashboard/MemberNotifications.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Bell, Filter, Settings } from 'lucide-react'

const MemberNotifications = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.gsap-header', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }).fromTo(
        '.gsap-empty-state',
        { y: 20, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' },
        '-=0.3',
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-8 text-[rgb(var(--color-text-primary))] min-h-screen flex flex-col"
    >
      <div className="max-w-full mx-auto w-full">
        {/* Page Header */}
        <header className="gsap-header flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Notifications</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors">
              <Filter size={18} />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="p-3 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Empty State Content */}
        <main className="flex-grow flex items-center justify-center">
          <div className="gsap-empty-state text-center py-16">
            <div className="inline-flex items-center justify-center p-5 bg-[rgb(var(--color-surface-2))] rounded-full mb-6">
              <Bell size={32} className="text-[rgb(var(--color-text-secondary))]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No notifications yet</h2>
            <p className="max-w-md text-[rgb(var(--color-text-muted))]">
              You'll get updates when people join your community, interact with your posts, and
              more.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MemberNotifications

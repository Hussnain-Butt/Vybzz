// src/pages/dashboard/promotions/GiftsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Gift, Plus, ArrowUpDown } from 'lucide-react'

const HEADERS = ['Title', 'Status', 'Begins', 'Ends', 'Redeemed']

const GiftsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}>
      <div className="bg-[rgb(var(--color-surface-1))] rounded-2xl border border-[rgb(var(--color-surface-2))]">
        {/* Table Header */}
        <div className="flex justify-between items-center p-4 border-b border-[rgb(var(--color-surface-2))]">
          <div className="flex-1 grid grid-cols-5 items-center text-xs font-semibold text-[rgb(var(--color-text-muted))] uppercase">
            {HEADERS.map((header) => (
              <span key={header} className="flex items-center gap-1">
                {header}{' '}
                {header.includes('Begins') || header.includes('Ends') ? (
                  <ArrowUpDown size={14} />
                ) : (
                  ''
                )}
              </span>
            ))}
          </div>
          <button className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--color-surface-3))] text-white font-semibold rounded-lg hover:bg-[rgb(var(--color-surface-interactive))] transition-colors text-sm">
            <Plus size={16} /> Add
          </button>
        </div>
        {/* Empty State Body */}
        <div className="text-center py-20 px-6">
          <div className="inline-flex items-center justify-center p-4 bg-[rgb(var(--color-surface-2))] rounded-full mb-5">
            <Gift size={32} className="text-[rgb(var(--color-text-secondary))]" />
          </div>
          <h3 className="text-xl font-bold mb-2">No gifts yet</h3>
          <p className="text-[rgb(var(--color-text-muted))]">
            When you add a gift, it'll show up here
          </p>
          <button className="mt-6 bg-[rgb(var(--color-surface-3))] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[rgb(var(--color-surface-interactive))] transition-colors">
            Add a gift
          </button>
        </div>
      </div>
    </div>
  )
}

export default GiftsPage

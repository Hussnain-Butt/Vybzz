// src/pages/dashboard/insights/MembershipPage.tsx
import React, { useState, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Info, ChevronDown, BarChartHorizontal } from 'lucide-react'

const STAT_CARDS = [
  { title: 'Active members', value: '0' },
  { title: 'New members', value: '0' },
  { title: 'Cancelled', value: '0' },
]

const MembershipPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] rounded-lg">
          <span>Past 30 days</span>
          <ChevronDown size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
          <Info size={14} />
          <span>Last updated at 5:06 AM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {STAT_CARDS.map((card, index) => (
          <div
            key={card.title}
            className={`p-6 rounded-xl ${
              index === 0 ? 'bg-[rgb(var(--color-surface-2))]' : 'bg-[rgb(var(--color-surface-1))]'
            }`}
          >
            <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] mb-2">
              <span className="font-medium text-sm">{card.title}</span>
              <Info size={14} />
            </div>
            <p className="text-5xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] rounded-lg mb-6">
          <span className="text-sm">Daily</span>
          <ChevronDown size={16} />
        </button>
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-[rgb(var(--color-surface-1))] rounded-xl p-6">
          <div className="p-3 bg-[rgb(var(--color-surface-2))] rounded-full mb-4">
            <BarChartHorizontal size={24} className="text-[rgb(var(--color-text-secondary))]" />
          </div>
          <p className="font-semibold text-white">No data to show</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Upgrades and downgrades</h3>
        <p className="text-[rgb(var(--color-text-muted))] mb-4">
          Here you'll see the number of active members who have upgraded or downgraded recently.
        </p>
        <p className="text-[rgb(var(--color-text-secondary))]">
          No upgrades or downgrades to show.
        </p>
      </div>
    </div>
  )
}

export default MembershipPage

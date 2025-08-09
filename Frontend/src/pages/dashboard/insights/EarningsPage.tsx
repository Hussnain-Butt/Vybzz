// src/pages/dashboard/insights/EarningsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ChevronDown, BarChartHorizontal } from 'lucide-react'

const EarningsPage = () => {
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
      <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-6 relative min-h-[500px] flex flex-col">
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-[rgb(var(--color-text-muted))]">Total of selected time frame</p>
            <p className="text-4xl font-bold text-white mt-1">$0.00</p>
          </div>
          <span className="text-xs text-[rgb(var(--color-text-muted))]">$20.00</span>
        </div>
        <div className="w-full h-px bg-[rgb(var(--color-surface-2))] my-4"></div>

        <div className="flex-grow flex items-center justify-center">
          <div className="bg-[rgba(var(--color-surface-2),0.8)] p-4 rounded-lg flex items-center gap-3">
            <BarChartHorizontal size={20} className="text-[rgb(var(--color-text-secondary))]" />
            <p className="font-semibold">Your earnings over time will show up here.</p>
          </div>
        </div>

        <div className="w-full h-px bg-[rgb(var(--color-surface-2))] my-4"></div>
        <div className="flex justify-between text-xs text-[rgb(var(--color-text-muted))]">
          <span>Jul</span>
          <span>$0.00</span>
          <span>Feb</span>
        </div>
      </div>
    </div>
  )
}

export default EarningsPage

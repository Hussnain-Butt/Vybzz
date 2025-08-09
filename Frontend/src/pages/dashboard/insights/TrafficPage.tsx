// src/pages/dashboard/insights/TrafficPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Info, ChevronDown } from 'lucide-react'

const TrafficPage = () => {
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
      <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-1 text-[rgb(var(--color-text-muted))]">
              <p>Total visits</p>
              <Info size={14} />
            </div>
            <p className="text-5xl font-bold mt-1">2</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[rgb(var(--color-text-muted))]">
              <p>Public visits</p>
              <Info size={14} />
            </div>
            <p className="text-5xl font-bold mt-1">2</p>
          </div>
        </div>

        <div className="w-full h-px bg-[rgb(var(--color-surface-2))]"></div>

        {/* Chart Mockup */}
        <div className="h-72 w-full flex items-end gap-4 py-4 pr-4">
          {/* Y-Axis Labels */}
          <div className="h-full flex flex-col justify-between text-right text-xs text-[rgb(var(--color-text-muted))] pr-2 border-r border-[rgb(var(--color-surface-2))]">
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>
          {/* Chart Bars */}
          <div className="w-full h-full flex justify-around items-end">
            <div
              className="w-4 h-full bg-[rgb(var(--color-primary-blue))] rounded-t-sm"
              title="07/10: 2 visits"
            ></div>
            <div className="w-4 h-0"></div>
            <div className="w-4 h-0"></div>
            <div className="w-4 h-0"></div>
            <div className="w-4 h-0"></div>
          </div>
        </div>

        <div className="w-full h-px bg-[rgb(var(--color-surface-2))]"></div>
        <div className="flex justify-around text-xs text-[rgb(var(--color-text-muted))] pt-2">
          <span>07/10</span>
          <span>07/17</span>
          <span>07/24</span>
          <span>07/31</span>
          <span>08/07</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] rounded-lg">
            <span className="text-sm">Daily</span>
            <ChevronDown size={16} />
          </button>
          <div className="flex items-center bg-[rgb(var(--color-surface-2))] p-1 rounded-lg">
            <button className="px-3 py-1 bg-[rgb(var(--color-surface-3))] rounded-md text-sm font-semibold">
              Overall
            </button>
            <button className="px-3 py-1 text-sm font-semibold text-[rgb(var(--color-text-muted))]">
              Sources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficPage

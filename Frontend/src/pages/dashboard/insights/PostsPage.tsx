// src/pages/dashboard/insights/PostsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  ChevronDown,
  CheckCircle,
  Info,
  BarChartHorizontal,
  ArrowDown,
  Eye,
  CameraOff,
} from 'lucide-react'

const PostsPage = () => {
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
    <div ref={containerRef} className="space-y-10">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] rounded-lg">
          <span className="text-sm">Past 28 days</span>
          <ChevronDown size={16} />
        </button>
        <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-muted))]">
          <span className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" /> All data available
          </span>
          <span className="flex items-center gap-2">
            <Info size={14} /> Last updated at 8:06 AM
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[rgb(var(--color-surface-1))] p-6 rounded-xl">
          <p className="font-semibold">Total reach</p>
          <p className="text-5xl font-bold mt-2">0</p>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">0 seen</p>
        </div>
        <div className="bg-[rgb(var(--color-surface-1))] p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <CameraOff size={28} className="text-[rgb(var(--color-text-muted))] mb-2" />
          <p className="font-semibold">Conversions</p>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">Coming soon</p>
        </div>
      </div>

      {/* Total Reach Chart */}
      <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold">Total reach</h3>
            <p className="text-[rgb(var(--color-text-muted))]">
              This includes when your post appears across Patreon, and when it's sent as an email or
              a push notification.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-2))] rounded-lg self-start md:self-center">
            <span className="text-sm">Daily</span>
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-6">
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <p className="text-[rgb(var(--color-text-muted))] flex items-center gap-1">
                Impressions <Info size={14} />
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="text-center">
              <p className="text-[rgb(var(--color-text-muted))] flex items-center gap-1">
                Seen <Info size={14} />
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <div className="min-h-[200px] flex flex-col items-center justify-center bg-[rgb(var(--color-surface-2))] rounded-lg">
            <BarChartHorizontal size={24} />
            <p className="mt-2">No data to show</p>
          </div>
        </div>
      </div>

      {/* Per Post Performance */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Per post performance</h3>
        <div className="flex items-center gap-2 mb-4">
          <button className="px-4 py-2 bg-[rgb(var(--color-surface-2))] rounded-full text-sm font-semibold">
            Total reach
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-semibold text-[rgb(var(--color-text-muted))]">
            Email and notification results
          </button>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="bg-transparent rounded border-2 border-[rgb(var(--color-surface-3))]"
            />{' '}
            Patreon website and app only
          </label>
        </div>
        <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-6">
          <div className="flex justify-between text-sm text-[rgb(var(--color-text-muted))] border-b border-[rgb(var(--color-surface-2))] pb-4">
            <span className="flex items-center gap-1">
              <ArrowDown size={14} /> Latest posts
            </span>
            <div className="flex gap-8">
              <span className="flex items-center gap-1">
                <ArrowDown size={14} /> Impressions <Info size={14} />
              </span>
              <span className="flex items-center gap-1">
                <ArrowDown size={14} /> Seen <Info size={14} />
              </span>
            </div>
          </div>
          <div className="min-h-[150px] flex flex-col items-center justify-center">
            <BarChartHorizontal size={24} />
            <p className="mt-2">No data available</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostsPage

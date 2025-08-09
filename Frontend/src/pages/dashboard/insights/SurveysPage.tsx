// src/pages/dashboard/insights/SurveysPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Download, HelpCircle } from 'lucide-react'

const SurveysPage = () => {
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
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl">
        <p className="font-bold text-white text-lg">Welcome survey results</p>
        <p className="mt-4 mb-2 text-white">What are you looking forward to the most?</p>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">No responses yet</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[rgb(var(--color-surface-2))] p-6 rounded-2xl text-center">
          <h4 className="font-bold text-white">Preview survey</h4>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] my-3">
            New members will see the survey when they join your membership.
          </p>
          <button className="w-full bg-slate-200 text-slate-900 font-bold py-2.5 px-5 rounded-lg hover:bg-white transition-colors mb-3">
            Preview
          </button>
          <button className="w-full text-[rgb(var(--color-text-secondary))] font-bold py-2.5 px-5 rounded-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors">
            Turn off survey
          </button>
        </div>

        <div className="text-center space-y-3">
          <a
            href="#"
            className="flex items-center justify-center gap-2 text-sm text-[rgb(var(--color-text-link))] font-semibold hover:underline"
          >
            <Download size={16} /> Export welcome survey results
          </a>
          <a
            href="#"
            className="flex items-center justify-center gap-2 text-sm text-[rgb(var(--color-text-link))] font-semibold hover:underline"
          >
            <HelpCircle size={16} /> Learn more about surveys
          </a>
        </div>
      </div>
    </div>
  )
}

export default SurveysPage

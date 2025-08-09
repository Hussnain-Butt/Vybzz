// src/pages/dashboard/audience/BenefitsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'

const benefitsData = [
  { name: 'Patron Sticker', status: '10 due', type: 'due' },
  { name: 'Thank You Message', status: '2 completed', type: 'completed' },
]

const BenefitsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.gsap-benefit-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, delay: 0.2 },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto py-10 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        Easily manage and track what you give your members.
      </h2>

      <div className="space-y-4 my-8">
        {benefitsData.map((benefit, index) => (
          <div
            key={index}
            className="gsap-benefit-item flex items-center justify-between p-4 bg-[rgb(var(--color-surface-1))] border border-[rgb(var(--color-primary-blue))] rounded-lg cursor-pointer hover:bg-[rgb(var(--color-surface-2))] transition-colors"
          >
            <span className="font-semibold text-white">{benefit.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {benefit.type === 'due' ? (
                  <Circle size={16} className="text-yellow-400 fill-current" />
                ) : (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {benefit.status}
                </span>
              </div>
              <ChevronRight size={20} className="text-[rgb(var(--color-text-muted))]" />
            </div>
          </div>
        ))}

        {/* Skeleton loaders */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="gsap-benefit-item flex items-center justify-between p-4 bg-[rgb(var(--color-surface-1))] border border-dashed border-[rgb(var(--color-primary-blue))] rounded-lg opacity-50"
          >
            <div className="h-4 bg-[rgb(var(--color-surface-3))] rounded w-1/3"></div>
            <ChevronRight size={20} className="text-[rgb(var(--color-text-muted))]" />
          </div>
        ))}
      </div>

      <p className="text-[rgb(var(--color-text-muted))] mb-8">
        Edit your tiers to include what you'd like to track.{' '}
        <a href="#" className="text-[rgb(var(--color-text-link))] hover:underline">
          Learn more
        </a>
      </p>

      <button className="bg-slate-200 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-white transition-colors">
        Get started
      </button>
    </div>
  )
}

export default BenefitsPage

// src/pages/dashboard/promotions/AutopilotPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ChevronRight } from 'lucide-react'

const offers = [
  {
    title: 'Free member upgrade offer',
    description:
      'Automatically send selected free members a one-time offer to upgrade to paid membership.',
  },
  {
    title: 'Annual membership',
    description: 'Allow fans to pay for a year of membership upfront.',
  },
  {
    title: 'Cancellation offer',
    description:
      'Offer select members who are cancelling their paid membership a discount on their next month.',
  },
]

const AutopilotPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-autopilot-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Autopilot Info Card */}
      <div className="gsap-autopilot-item bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))]">
        <h3 className="text-2xl font-bold text-white">Autopilot</h3>
        <p className="text-[rgb(var(--color-text-secondary))] mt-2">
          Autopilot automatically sends offers to your members at the right time to help you grow.{' '}
          <a href="#" className="text-[rgb(var(--color-text-link))] font-semibold hover:underline">
            Learn more
          </a>
        </p>
        <a
          href="#"
          className="flex items-center gap-1 text-[rgb(var(--color-text-link))] font-semibold mt-4 hover:underline"
        >
          View insights <ChevronRight size={16} />
        </a>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.title}
            className="gsap-autopilot-item bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))] flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-lg font-bold text-white">{offer.title}</h4>
                <span className="text-xs font-bold bg-[rgb(var(--color-surface-3))] px-2 py-0.5 rounded-full text-[rgb(var(--color-text-secondary))]">
                  Off
                </span>
              </div>
              <p className="text-[rgb(var(--color-text-secondary))] max-w-lg">
                {offer.description}
              </p>
            </div>
            <button className="mt-4 sm:mt-0 bg-[rgb(var(--color-surface-3))] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[rgb(var(--color-surface-interactive))] transition-colors flex-shrink-0">
              Set up
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AutopilotPage

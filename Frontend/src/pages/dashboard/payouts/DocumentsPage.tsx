// src/pages/dashboard/payouts/DocumentsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Info } from 'lucide-react'

const DocumentSection = ({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`gsap-doc-section bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))] ${className}`}
  >
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    {children}
  </div>
)

const DocumentsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-doc-section',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-8">
      <DocumentSection title="Payouts">
        <p className="text-[rgb(var(--color-text-secondary))]">
          Your payout documents will be available for download if you are receiving payments from
          your members.
        </p>
      </DocumentSection>

      <DocumentSection title="Income tax">
        <div className="space-y-4">
          <div className="bg-[rgb(var(--color-surface-2))] p-4 rounded-lg flex items-start gap-4">
            <Info size={20} className="text-[rgb(var(--color-text-muted))] mt-1 flex-shrink-0" />
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              Please note that starting 2023, earnings are shown on a gross basis without regard to
              any adjustments for credits, cash equivalents, discount amounts, fees, refunded
              amounts, or any other amounts. See our{' '}
              <a
                href="#"
                className="text-[rgb(var(--color-text-link))] font-semibold hover:underline"
              >
                Help Center
              </a>{' '}
              for additional info.
            </p>
          </div>
          <p className="text-[rgb(var(--color-text-secondary))]">
            Tax statements are for creators who are U.S. citizens or residents and are receiving
            1099-K forms. To provide your tax information go to{' '}
            <a
              href="#"
              className="text-[rgb(var(--color-text-link))] font-semibold hover:underline"
            >
              Tax settings
            </a>
            .
          </p>
        </div>
      </DocumentSection>

      <DocumentSection title="Sales tax">
        <p className="text-[rgb(var(--color-text-secondary))]">
          Your sales tax documents will be available for download if you are receiving payments from
          your members.
        </p>
      </DocumentSection>
    </div>
  )
}

export default DocumentsPage

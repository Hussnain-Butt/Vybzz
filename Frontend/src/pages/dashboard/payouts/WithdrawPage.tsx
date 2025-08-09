// src/pages/dashboard/payouts/WithdrawPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const WithdrawPage = () => {
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
    <div
      ref={containerRef}
      className="bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))] flex flex-col sm:flex-row justify-between items-center"
    >
      <div>
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">Available to withdraw</p>
        <p className="text-6xl font-bold text-white my-2">$0.00</p>
        <a
          href="#"
          className="text-sm font-semibold text-[rgb(var(--color-text-link))] hover:underline"
        >
          View details
        </a>
      </div>
      <button className="mt-6 sm:mt-0 w-full sm:w-auto bg-[rgb(var(--color-surface-3))] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[rgb(var(--color-surface-interactive))] transition-colors">
        Add payout method
      </button>
    </div>
  )
}

export default WithdrawPage

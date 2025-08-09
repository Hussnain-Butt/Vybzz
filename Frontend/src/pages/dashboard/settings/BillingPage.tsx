// src/pages/dashboard/settings/BillingPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Rocket } from 'lucide-react'

const BillingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rocketRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the main container
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
      )

      // Animate the illustration elements
      gsap.fromTo(
        '.gsap-star',
        { scale: 0, opacity: 0, rotation: -45 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          stagger: 0.1,
          duration: 0.7,
          delay: 0.5,
          ease: 'back.out(2)',
        },
      )

      // Rocket floating animation
      gsap.to(rocketRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="flex items-center justify-center mt-8">
      <div
        ref={containerRef}
        className="max-w-3xl w-full text-center bg-[rgb(var(--color-surface-1))] p-12 rounded-2xl border border-[rgb(var(--color-surface-2))]"
      >
        {/* New, professional SVG Illustration */}
        <div className="mx-auto h-32 mb-8 relative flex items-center justify-center">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Stars */}
            <path
              className="gsap-star"
              d="M50 15 L55 35 L75 35 L60 45 L65 65 L50 55 L35 65 L40 45 L25 35 L45 35 Z"
              fill="rgb(var(--color-accent-orange)/0.7)"
            />
            <path
              className="gsap-star"
              d="M150 45 L154 60 L170 60 L158 70 L162 85 L150 78 L138 85 L142 70 L130 60 L146 60 Z"
              fill="rgb(var(--color-accent-pink)/0.7)"
            />
            <path
              className="gsap-star"
              d="M175 10 L178 20 L190 20 L181 26 L184 36 L175 30 L166 36 L169 26 L160 20 L172 20 Z"
              fill="rgb(var(--color-primary-cyan)/0.6)"
            />

            {/* Rocket */}
            <g ref={rocketRef}>
              <path d="M100 0 L120 40 L80 40 Z" fill="rgb(var(--color-primary-blue))" />
              <rect
                x="85"
                y="40"
                width="30"
                height="50"
                rx="15"
                fill="rgb(var(--color-surface-3))"
              />
              <circle
                cx="100"
                cy="65"
                r="10"
                fill="rgb(var(--color-primary-cyan)/0.5)"
                stroke="white"
                strokeWidth="1.5"
              />
              <path d="M80 90 L70 110 L90 90 Z" fill="rgb(var(--color-accent-orange))" />
              <path d="M120 90 L130 110 L110 90 Z" fill="rgb(var(--color-accent-orange))" />
              <path d="M100 90 L90 120 L110 120 Z" fill="rgb(var(--color-accent-pink))" />
            </g>
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white">Ready to Launch Your Creative Business?</h2>
        <p className="text-[rgb(var(--color-text-secondary))] mt-3 max-w-xl mx-auto">
          Start earning from your passion by offering memberships or selling one-time purchases.
          It's time to build your community and get paid.
        </p>

        <button className="mt-8 flex items-center gap-3 mx-auto bg-[rgb(var(--color-primary-blue))] text-white font-bold py-3 px-8 rounded-lg hover:bg-[rgb(var(--color-primary-cyan))] transition-all duration-300 ease-in-out transform hover:scale-105">
          <Rocket size={20} />
          Become a Creator
        </button>
      </div>
    </div>
  )
}

export default BillingPage

// src/components/PodcastersPage/TestimonialQuote.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TestimonialQuote: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const authorRef = useRef<HTMLDivElement>(null)
  const quoteMarkRef = useRef<HTMLSpanElement>(null)
  const bgImageRef = useRef<HTMLImageElement>(null)

  const quoteText =
    'Vybzz Nation provides a space for artists to sustain ourselves by connecting us directly to our own communities.'

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // --- Background Image Ken Burns Effect ---
    gsap.fromTo(
      bgImageRef.current,
      { scale: 1.15, y: -50 },
      {
        scale: 1,
        y: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      },
    )

    // --- Quote Word-by-Word Animation ---
    if (quoteRef.current) {
      quoteRef.current.innerHTML = quoteText
        .split(' ')
        .map((word) => `<span class="inline-block opacity-0 translate-y-8">${word}</span>`)
        .join(' ')
      const words = Array.from(quoteRef.current.querySelectorAll('.inline-block')) as HTMLElement[]

      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    // --- Author and Quotation Mark Reveal Animation ---
    const authorAndMarkTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    })

    authorAndMarkTimeline
      .fromTo(
        quoteMarkRef.current,
        { scale: 1.5, opacity: 0, y: -50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
        0,
      )
      .fromTo(
        authorRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'expo.out' },
        0.5, // Start after the quote animation begins
      )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 sm:py-40 bg-[rgb(var(--color-surface-1))] overflow-hidden"
    >
      {/* Background Image */}
      <img
        ref={bgImageRef}
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1920&q=80"
        alt="KAMAUU"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Dark Overlay using Theme Colors */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-background-dark))] via-[rgb(var(--color-background-dark)/0.7)] to-transparent"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Decorative Quotation Mark */}
        <span
          ref={quoteMarkRef}
          className="absolute -top-16 left-1/2 -translate-x-1/2 text-9xl text-[rgb(var(--color-text-link)/0.1)] font-serif opacity-0"
        >
          “
        </span>

        {/* The Quote */}
        <p
          ref={quoteRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-light text-[rgb(var(--color-text-primary))] leading-tight sm:leading-snug mb-16"
        >
          {/* Text will be populated by JavaScript */}
        </p>

        {/* Author Card */}
        <div ref={authorRef} className="inline-block opacity-0">
          <div className="flex items-center gap-4 bg-[rgb(var(--color-surface-2)/0.4)] backdrop-blur-md p-4 pr-6 rounded-full border border-[rgb(var(--color-surface-3)/0.5)]">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
              alt="KAMAUU"
              className="w-16 h-16 rounded-full object-cover border-2 border-[rgb(var(--color-text-link))]"
            />
            <div className="text-left">
              <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">KAMAUU</h3>
              <p className="text-md text-[rgb(var(--color-text-link)/0.9)]">Musician & Artist</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialQuote

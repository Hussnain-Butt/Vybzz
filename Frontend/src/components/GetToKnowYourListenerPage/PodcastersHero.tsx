// src/components/PodcastersPage/PodcastersHero.tsx
import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Button from '../Shared/Button'
import Hero from '../../assets/Podcasters/1.jpg'

const PodcastersHero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      backgroundRef.current,
      { scale: 1.1, autoAlpha: 0.8 },
      { scale: 1, autoAlpha: 1, duration: 2, ease: 'power2.out' },
    )
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } })
    tl.fromTo(
      titleRef.current?.children,
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, delay: 0.3 },
    )
      .fromTo(subtitleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.8')
      .fromTo(buttonRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1 }, '-=0.8')
  }, [])

  return (
    // Replaced hardcoded colors with root variables
    <section
      id="podcasters-hero"
      className="relative min-h-screen flex items-center justify-center text-center bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div ref={backgroundRef} className="w-full h-full">
          <img
            src={Hero}
            alt="Person speaking into a podcast microphone in a studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[rgb(var(--color-background-dark)/0.7)]"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h1
          ref={titleRef}
          className="text-7xl sm:text-8xl lg:text-[7rem] font-black leading-none tracking-tighter"
        >
          <div className="overflow-hidden">
            <span className="inline-block">Vybzz Nation for</span>
          </div>
          <div className="overflow-hidden">
            <span className="inline-block text-[rgb(var(--color-text-link))]">podcasters</span>
          </div>
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-[rgb(var(--color-text-secondary))] mt-8 max-w-2xl mx-auto"
        >
          Connect with your listeners, share your work directly with audiences, and earn income
          beyond ad revenue.
        </p>
        <div ref={buttonRef} className="mt-10 inline-block">
          <Button variant="tertiary" className="text-lg px-8 py-4">
            Create on Vybzz Nation
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PodcastersHero

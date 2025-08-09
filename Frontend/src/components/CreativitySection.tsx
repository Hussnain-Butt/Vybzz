// src/components/PodcastersPage/CreativitySection.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Data for the creators
const creatorsData = [
  {
    name: 'Tina Yu',
    role: 'Content Creator',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
  },
  {
    name: 'Kevin Woo',
    role: 'Podcaster',
    image:
      'https://i0.wp.com/nextpittsburgh.com/wp-content/uploads/2016/02/marta2.jpg?fit=1200%2C801&ssl=1',
  },
  {
    name: 'Ross Draws',
    role: 'Digital Artist',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&q=80',
  },
  {
    name: 'KAMAUU',
    role: 'Musician & Poet',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
  },
]

const CreativitySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Timeline>()

  useEffect(() => {
    const container = cardsContainerRef.current
    if (!container) return

    const cards = gsap.utils.toArray<HTMLElement>('.creator-card', container)

    const setupCards = () => {
      gsap.set(cards, {
        y: (i: number) => i * -30,
        scale: (i: number) => 1 - i * 0.04,
        rotation: 0,
        zIndex: (i: number) => cards.length - i,
      })
    }

    setupCards()

    // The animation cycle for the cards
    const cycle = () => {
      const lastCard = cards[cards.length - 1]
      const otherCards = cards.slice(0, cards.length - 1)

      animationRef.current = gsap.timeline({
        onComplete: () => {
          const newOrder = [lastCard, ...otherCards]
          cards.length = 0 // Clear the array
          cards.push(...newOrder) // Re-populate with new order
          cycle() // Loop the animation
        },
      })

      animationRef.current
        .to(lastCard, { x: '100%', rotation: 15, duration: 0.7, ease: 'power2.in' })
        .set(lastCard, { x: '-100%' })
        .to(lastCard, {
          x: '0%',
          y: 0,
          scale: 1,
          rotation: 0,
          zIndex: cards.length,
          duration: 0.7,
          ease: 'power3.out',
        })
        .to(
          otherCards,
          {
            y: (i: number) => (i + 1) * -30,
            scale: (i: number) => 1 - (i + 1) * 0.04,
            zIndex: (i: number) => cards.length - (i + 1),
            duration: 0.9,
            ease: 'power3.inOut',
            stagger: 0.05,
          },
          '-=0.8',
        )
    }

    gsap.delayedCall(2, cycle) // Start the cycle after a delay

    const handleMouseEnter = () => animationRef.current?.pause()
    const handleMouseLeave = () => animationRef.current?.resume()

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    // GSAP animations for the title and paragraph
    const title = sectionRef.current?.querySelector('.section-title')
    const paragraph = sectionRef.current?.querySelector('.section-paragraph')
    const rootStyles = getComputedStyle(document.documentElement)
    const cyanColor = rootStyles.getPropertyValue('--color-primary-cyan').trim()

    if (title && paragraph) {
      const chars = title.querySelectorAll('.char')
      gsap.fromTo(
        chars,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1.2,
          ease: 'expo.out',
          // Use the fetched CSS variable to construct the text shadow
          textShadow: `0 0 15px rgba(${cyanColor}, 0.6), 0 0 30px rgba(${cyanColor}, 0.4)`,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        },
      )
      gsap.fromTo(
        paragraph,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%' },
        },
      )
    }

    // Cleanup function
    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      animationRef.current?.kill()
    }
  }, [])

  const titleLines = 'Creativity Powered'.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[rgb(var(--color-background-dark))] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(var(--color-primary-cyan),0.2),_transparent_60%)]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="z-10 text-center lg:text-left">
          <h2 className="section-title text-6xl sm:text-8xl lg:text-8xl font-extrabold text-[rgb(var(--color-text-primary))] leading-none tracking-tight">
            {titleLines.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.split('').map((char, charIndex) => (
                  <span key={charIndex} className="char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="section-paragraph text-xl text-[rgb(var(--color-text-secondary))] max-w-xl mx-auto lg:mx-0 mt-8 leading-relaxed">
            Vybzz Nation gives you the tools to energize your fanbase, create exclusive content, and
            build a community that powers your work for years to come.
          </p>
        </div>

        {/* Right Auto-Sliding Cards Stack */}
        <div
          className="relative h-[550px] w-full max-w-md mx-auto flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          <div ref={cardsContainerRef} className="relative w-full h-[450px]">
            {creatorsData.map((creator) => (
              <div
                key={creator.name}
                className="creator-card absolute top-0 left-0 w-full h-full bg-[rgb(var(--color-surface-2)/0.4)] backdrop-blur-lg rounded-2xl border border-[rgb(var(--color-surface-3)/0.5)] shadow-2xl shadow-[rgb(var(--color-background-dark)/0.75)] shadow-[rgb(var(--color-primary-cyan)/0.1)] overflow-hidden transform-gpu transition-all duration-300 hover:border-[rgb(var(--color-text-link)/0.5)]"
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-background-dark)/0.8)] via-[rgb(var(--color-background-dark)/0.2)] to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-bold text-[rgb(var(--color-text-primary))] text-3xl">
                    {creator.name}
                  </h3>
                  <p className="text-lg text-[rgb(var(--color-text-link))]">{creator.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreativitySection

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

// Professional font name (import this in your index.css)
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
const professionalFont = "'Inter', sans-serif"

const CreativitySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Timeline>()

  useEffect(() => {
    const container = cardsContainerRef.current
    if (!container) return

    const cards = gsap.utils.toArray<HTMLElement>('.creator-card', container)

    // Function that sets the initial position of the cards
    const setupCards = () => {
      // === ERROR FIX: Added 'number' type to the index 'i' ===
      gsap.set(cards, {
        y: (i: number) => i * -30,
        scale: (i: number) => 1 - i * 0.04,
        rotation: 0,
        zIndex: (i: number) => cards.length - i,
      })
    }

    setupCards()

    const cycle = () => {
      const lastCard = cards[cards.length - 1]
      const otherCards = cards.slice(0, cards.length - 1)

      animationRef.current = gsap.timeline({
        onComplete: () => {
          const newOrder = [lastCard, ...otherCards]
          cards.length = 0
          cards.push(...newOrder)
          cycle()
        },
      })

      animationRef.current
        .to(lastCard, {
          x: '100%',
          rotation: 15,
          duration: 0.7,
          ease: 'power2.in',
        })
        .set(lastCard, {
          x: '-100%',
        })
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
            // === ERROR FIX: Added 'number' type to the index 'i' ===
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

    gsap.delayedCall(2, cycle)

    const handleMouseEnter = () => animationRef.current?.pause()
    const handleMouseLeave = () => animationRef.current?.resume()

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    const title = sectionRef.current?.querySelector('.section-title')
    const paragraph = sectionRef.current?.querySelector('.section-paragraph')

    if (title && paragraph) {
      const chars = gsap.utils.toArray<HTMLElement>('.char')
      gsap.fromTo(
        chars,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1.2,
          ease: 'expo.out',
          textShadow: '0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)',
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
      className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden"
      style={{ fontFamily: professionalFont }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,50,80,0.3),_transparent_60%)]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="z-10 text-center lg:text-left">
          <h2 className="section-title text-6xl sm:text-8xl lg:text-8xl font-extrabold text-white leading-none tracking-tight">
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
          <p className="section-paragraph text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 mt-8 leading-relaxed">
            Patreon gives you the tools to energize your fanbase, create exclusive content, and
            build a community that powers your work for years to come.
          </p>
        </div>

        {/* Right Auto-Sliding Cards Stack */}
        <div className="relative h-[550px] w-full max-w-md mx-auto flex items-center justify-center perspective-1200">
          <div ref={cardsContainerRef} className="relative w-full h-[450px]">
            {creatorsData.map((creator) => (
              <div
                key={creator.name}
                className="creator-card absolute top-0 left-0 w-full h-full bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/75 shadow-cyan-500/10 overflow-hidden transform-gpu transition-all duration-300 hover:border-cyan-400/50"
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-bold text-white text-3xl">{creator.name}</h3>
                  <p className="text-lg text-cyan-300">{creator.role}</p>
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

// src/components/PodcastersPage/CreativeControlSection.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Brush, Feather } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Data for the content cards
const cardData = [
  {
    icon: <Play className="w-8 h-8 text-[rgb(var(--color-text-primary))]" />,
    title: 'Your VIP Pass to Fiction Podcast Royalty',
    meta: '3 Days Ago • 64 Comments',
    description:
      "Experience the allure of 'The Royals of Malibu,' the #1 Fiction Podcast that keeps listeners captivated.",
    initialStyle: { transform: 'rotate(-5deg) translate(0, 0)', zIndex: 3 },
  },
  {
    icon: <Brush className="w-8 h-8 text-[rgb(var(--color-text-primary))]" />,
    title: 'A Visual Odyssey Through Illustrations',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&q=80',
    description:
      'Delve into the vibrant universe of RossDraws, where each artwork serves as a masterclass in creativity.',
    initialStyle: { transform: 'translate(20px, 120px) rotate(8deg)', zIndex: 2 },
  },
  {
    icon: <Feather className="w-8 h-8 text-[rgb(var(--color-text-primary))]" />,
    title: 'Author Spotlight',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    description:
      'Discover exclusive content and behind-the-scenes insights from your favorite creators.',
    initialStyle: { transform: 'translate(-10px, 280px) rotate(-3deg)', zIndex: 1 },
  },
]

const CreativeControlSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentCardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Title animation
    const title = titleRef.current
    if (title) {
      const titleText = 'Complete creative control'
      title.innerHTML = titleText
        .split(' ')
        .map((word) => `<span class="inline-block char mr-4">${word}</span>`) // Added margin for spacing
        .join('')
      const chars = title.querySelectorAll('.char')
      gsap.fromTo(
        chars,
        { y: 80, opacity: 0, rotationX: -90 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.5,
          stagger: 0.1, // Adjusted stagger for better word-by-word feel
          ease: 'elastic.out(1, 0.75)',
          scrollTrigger: { trigger: section, start: 'top 60%' },
        },
      )
    }

    // Paragraph animation
    const paragraph = section.querySelector('.section-paragraph')
    if (paragraph) {
      gsap.fromTo(
        paragraph,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.5,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 50%' },
        },
      )
    }

    // Content cards animation
    const cards = Array.from(
      contentCardsRef.current?.querySelectorAll('.content-card') ?? [],
    ) as HTMLElement[]
    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 120,
        scale: 0.8,
        duration: 1.2,
        delay: 0.3 + index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentCardsRef.current,
          start: 'top 80%',
        },
      })

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -20, // Simplified y translation
          scale: 1.05,
          rotation: 0,
          zIndex: 10,
          duration: 0.4,
          ease: 'power2.out',
        })
        cards.forEach((otherCard) => {
          if (otherCard !== card) {
            gsap.to(otherCard, { scale: 0.95, opacity: 0.7, duration: 0.4, ease: 'power2.out' })
          }
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          ...cardData[index].initialStyle,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.75)', // Smoother return animation
        })
        cards.forEach((otherCard) => {
          if (otherCard !== card) {
            gsap.to(otherCard, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' })
          }
        })
      })
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[rgb(var(--color-background-dark))] overflow-hidden"
    >
      {/* Replaced gradient with a theme-consistent color */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(var(--color-primary-cyan),0.15),_transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Title & Description */}
          <div className="z-10 text-center lg:text-left">
            <h2
              ref={titleRef}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-[rgb(var(--color-text-primary))] leading-tight tracking-tight"
            ></h2>
            <p className="section-paragraph text-xl text-[rgb(var(--color-text-secondary))] max-w-xl mx-auto lg:mx-0 mt-8 leading-relaxed">
              You own your content, control your work, and build a direct, meaningful connection
              with your audience. No algorithms, no ads, just pure creativity.
            </p>
          </div>

          {/* Right Floating Content Cards */}
          <div
            ref={contentCardsRef}
            className="relative h-[600px] w-full max-w-lg mx-auto"
            style={{ perspective: '1200px' }}
          >
            {cardData.map((card, index) => (
              <div
                key={index}
                className="content-card group absolute w-full p-1.5 bg-gradient-to-br from-[rgb(var(--color-primary-cyan)/0.5)] to-[rgb(var(--color-primary-blue)/0.5)] rounded-2xl"
                style={card.initialStyle}
              >
                <div className="bg-[rgb(var(--color-surface-2)/0.8)] backdrop-blur-xl rounded-[14px] p-6 h-full transition-all duration-300 group-hover:bg-[rgb(var(--color-surface-2)/0.6)]">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-[rgb(var(--color-surface-3)/0.5)] rounded-xl flex items-center justify-center border border-[rgb(var(--color-surface-3))]">
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[rgb(var(--color-text-primary))]">
                        {card.title}
                      </h3>
                      {card.meta && (
                        <p className="text-sm text-[rgb(var(--color-text-secondary)/0.8)]">
                          {card.meta}
                        </p>
                      )}
                    </div>
                  </div>
                  {card.image ? (
                    <div className="rounded-lg overflow-hidden mt-4">
                      <img src={card.image} alt={card.title} className="w-full h-32 object-cover" />
                    </div>
                  ) : (
                    <p className="text-[rgb(var(--color-text-secondary))] text-sm leading-relaxed mt-2">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreativeControlSection

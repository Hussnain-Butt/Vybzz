// src/pages/OtherVideoCreators.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaDollarSign, FaChartBar, FaGraduationCap, FaUsers } from 'react-icons/fa'

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// --- MOCK DATA (REDESIGNED & EXPANDED) ---

const allCreators = [
  // A diverse set of profile images for the hero section
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 13,
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
  {
    id: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&h=200&auto=format&fit=crop&crop=faces',
  },
]

const creatorCategories = [
  {
    title: 'The Gaming Galaxy',
    accentVar: '--color-accent-pink',
    creators: [
      {
        name: 'PixelPlayz',
        imageUrl:
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&h=500&auto=format&fit=crop',
      },
      {
        name: 'QuestQueen',
        imageUrl:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=500&auto=format&fit=crop',
      },
      {
        name: 'ArcadeAce',
        imageUrl:
          'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?q=80&w=400&h=500&auto=format&fit=crop',
      },
      {
        name: 'VRVanguard',
        imageUrl:
          'https://plus.unsplash.com/premium_photo-1687558246422-e94f0864d467?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
  },
  {
    title: 'The Tech Nebula',
    accentVar: '--color-primary-blue',
    creators: [
      {
        name: 'NOMAD',
        imageUrl:
          'https://images.unsplash.com/photo-1664277497095-424e085175e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        name: 'CodeCraft',
        imageUrl:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&h=500&auto=format&fit=crop',
      },
      {
        name: 'SynthWave',
        imageUrl:
          'https://plus.unsplash.com/premium_photo-1679079456789-15b8e1deccee?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        name: 'FutureFile',
        imageUrl:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=500&auto=format&fit=crop',
      },
    ],
  },
  {
    title: 'The Art Supernova',
    accentVar: '--color-accent-orange',
    creators: [
      {
        name: 'AURA',
        imageUrl:
          'https://images.unsplash.com/photo-1501472193205-56ffb66400f0?q=80&w=400&h=500&auto=format&fit=crop',
      },
      {
        name: 'CanvasClash',
        imageUrl:
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&h=500&auto=format&fit=crop',
      },
      {
        name: 'Clayform',
        imageUrl:
          'https://plus.unsplash.com/premium_photo-1679362665746-616b9adba66c?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        name: 'DesignDruid',
        imageUrl:
          'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=400&h=500&auto=format&fit=crop',
      },
    ],
  },
]

const journeyCreator = {
  name: 'AURA',
  handle: '@auradesigns',
  imageUrl:
    'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1887&auto=format&fit=crop',
  milestones: [
    {
      year: '2021',
      title: 'Genesis',
      description: 'AURA joins Vybzz, uploading her first digital dreamscape.',
    },
    {
      year: '2022',
      title: 'First Light',
      description: 'Her "Cyber-Sunset" animation goes viral, reaching 1M views.',
    },
    {
      year: '2023',
      title: 'Constellation',
      description: 'Collaborates with tech creator NOMAD on a VR art experience.',
    },
    {
      year: '2024',
      title: 'Supernova',
      description: 'Launches her own collection of digital assets, becoming a top earner.',
    },
  ],
}

const ecosystemFeatures = [
  {
    title: 'Monetization',
    description: 'Multiple revenue streams, from ads to merch.',
    icon: <FaDollarSign />,
  },
  {
    title: 'Creator Studio',
    description: 'Powerful analytics and tools to grow your audience.',
    icon: <FaChartBar />,
  },
  {
    title: 'Vybzz Academy',
    description: 'Learn from the best with exclusive tutorials and workshops.',
    icon: <FaGraduationCap />,
  },
  {
    title: 'Community',
    description: 'Connect and collaborate with a vibrant network of creators.',
    icon: <FaUsers />,
  },
]

// --- MAIN COMPONENT ---
const OtherVideoCreators = () => {
  const mainRef = useRef<HTMLDivElement | null>(null)
  const horizontalScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Performance-friendly GSAP defaults
    gsap.ticker.lagSmoothing(1000, 16)
    gsap.config({ force3D: true })

    const ctx = gsap.context(() => {
      if (!horizontalScrollRef.current) return

      // --- 1. HERO "BIG BANG" ANIMATION ---
      const heroAvatars = gsap.utils.toArray<HTMLImageElement>('.hero-avatar')
      gsap.set(heroAvatars, { opacity: 0, scale: 0, willChange: 'transform, opacity' })

      const tlHero = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '+=1200',
          scrub: 1,
          pin: true,
        },
      })

      tlHero
        .to('.hero-title-char', {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          ease: 'power3.out',
          duration: 0.8,
        })
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .to(
          heroAvatars,
          {
            opacity: 1,
            scale: 1,
            stagger: { each: 0.08, from: 'center', grid: 'auto' },
            ease: 'power2.out',
          },
          '-=0.6',
        )
        .to(
          heroAvatars,
          {
            x: () => gsap.utils.random(-320, 320, 5),
            y: () => gsap.utils.random(-320, 320, 5),
            rotation: () => gsap.utils.random(-360, 360),
            scale: () => gsap.utils.random(0.6, 1.05),
            opacity: 0.85,
            ease: 'power3.inOut',
          },
          '>',
        )

      // --- 2. HORIZONTAL SCROLL SPOTLIGHTS (CORRECTED) ---
      const sections = gsap.utils.toArray<HTMLElement>('.panel')

      const horizontalTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalScrollRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => `+=${horizontalScrollRef.current?.offsetWidth || 0}`,
        },
      })

      sections.forEach((panel) => {
        const cards = panel.querySelectorAll('.creator-card')
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTween, // important: pass tween
            start: 'left 80%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      // --- 3. CREATOR JOURNEY TIMELINE ---
      const journeyItems = gsap.utils.toArray<HTMLElement>('.journey-item')
      gsap.to('.timeline-progress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.journey-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      journeyItems.forEach((item) => {
        gsap.from(item, {
          opacity: 0.25,
          y: 40,
          scale: 0.96,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1,
          },
        })
      })

      // --- 4. ECOSYSTEM FEATURES ANIMATION ---
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.ecosystem-section',
        },
        opacity: 0,
        y: 40,
        scale: 0.96,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.6)',
      })

      // --- 5. FINAL CTA ---
      const cta = '.cta-section'
      gsap.from(`${cta} h2, ${cta} p, ${cta} button`, {
        scrollTrigger: {
          trigger: cta,
          start: 'top 80%',
        },
        opacity: 0,
        y: 32,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  // Force first letter uppercase, rest lowercase
  const HeroTitleRaw = 'A Universe Of Creators'
  const displayTitle = HeroTitleRaw.charAt(0).toUpperCase() + HeroTitleRaw.slice(1).toLowerCase()

  return (
    <main
      ref={mainRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      <div className="relative z-10">
        {/* Section 1: Immersive Hero Section */}
        <section className="hero-section min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
          {/* Background avatar grid */}
          <div
            className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 place-items-center pointer-events-none select-none"
            style={{ contain: 'paint' }}
          >
            {allCreators.slice(0, 16).map((creator) => (
              <img
                key={creator.id}
                src={creator.imageUrl}
                alt="Creator avatar"
                className="hero-avatar w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-[rgb(var(--color-surface-2))]"
                loading="lazy"
                decoding="async"
                width={56}
                height={56}
                sizes="(max-width: 768px) 48px, 56px"
              />
            ))}
          </div>

          {/* Foreground content (alignment + performance) */}
          <div className="relative z-10 bg-[rgb(var(--color-background-dark)/0.55)] backdrop-blur-[2px] px-6 py-8 md:px-10 md:py-10 rounded-2xl max-w-[1100px] mx-auto">
            <h1 className="mx-auto leading-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
              {displayTitle.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-hidden align-baseline">
                  <span className="hero-title-char inline-block translate-y-full opacity-0 will-change-transform">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-subtitle text-base sm:text-lg md:text-xl max-w-2xl mt-5 mx-auto text-[rgb(var(--color-text-secondary))] opacity-0 translate-y-4">
              Discover the brilliant minds and powerful storytellers shaping the Vybzz Nation.
            </p>
          </div>
        </section>

        {/* Section 2: Themed Creator Spotlights (Horizontal Scroll) */}
        <section
          ref={horizontalScrollRef}
          className="relative h-screen bg-[rgb(var(--color-surface-1))] content-visibility-auto"
        >
          <div
            className="flex h-full will-change-transform"
            style={{ width: `${creatorCategories.length * 100}vw` }}
          >
            {creatorCategories.map((category, index) => (
              <div
                key={index}
                className="panel w-screen h-full flex flex-col justify-center items-center px-4 md:px-12"
              >
                <h2
                  className="text-3xl md:text-5xl font-extrabold mb-8 md:mb-12 text-center"
                  style={{ color: `rgb(var(${category.accentVar}))` }}
                >
                  {category.title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
                  {category.creators.map((creator) => (
                    <div key={creator.name} className="creator-card group [perspective:1000px]">
                      <div
                        className="relative rounded-lg overflow-hidden transition-transform duration-400 ease-in-out [transform-style:preserve-3d] group-hover:-translate-y-1.5 shadow-md shadow-[rgb(var(--color-background-dark)/0.45)] group-hover:shadow-lg"
                        style={{ '--shadow-color': `rgb(var(${category.accentVar}))` } as any}
                      >
                        <img
                          src={creator.imageUrl}
                          alt={creator.name}
                          className="w-full h-full object-cover aspect-[3/4]"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width:768px) 45vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <p className="absolute bottom-3 left-3 text-lg font-bold">{creator.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Deep Dive - A Creator's Journey */}
        <section className="journey-section py-16 md:py-28 bg-[rgb(var(--color-background-dark))] content-visibility-auto">
          <div className="container mx-auto px-6 text-center max-w-[1100px]">
            <p className="text-sm font-bold text-[rgb(var(--color-primary-cyan))] tracking-widest uppercase">
              A star's rise
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold my-3">
              The journey of {journeyCreator.name}
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))] mb-14">
              Follow the trajectory of a Vybzz visionary, from their first upload to becoming a
              platform icon.
            </p>
          </div>
          <div className="container mx-auto px-6 max-w-3xl relative">
            <div className="absolute left-4 md:left-1/2 top-0 h-full w-1 bg-[rgb(var(--color-surface-2))] rounded-full -translate-x-1/2">
              <div className="timeline-progress w-full bg-[rgb(var(--color-primary-cyan))] rounded-full"></div>
            </div>
            <div className="space-y-20">
              {journeyCreator.milestones.map((item, index) => (
                <div key={index} className="journey-item pl-12 md:pl-0 will-change-transform">
                  <div
                    className={`flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="hidden md:flex flex-1 items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[rgb(var(--color-primary-cyan))] ring-8 ring-[rgb(var(--color-surface-1))] z-10"></div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-[rgb(var(--color-surface-1))] p-6 rounded-xl shadow-md border-l-4 md:border-l-0 md:border-t-4 border-[rgb(var(--color-primary-cyan))]">
                        <p className="text-xl font-bold text-[rgb(var(--color-text-secondary))]">
                          {item.year}
                        </p>
                        <h3 className="text-2xl font-extrabold my-1.5">{item.title}</h3>
                        <p className="text-[rgb(var(--color-text-muted))]">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: The Vybzz Ecosystem */}
        <section className="ecosystem-section py-16 md:py-28 bg-[rgb(var(--color-surface-1))] content-visibility-auto">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3">The creator's toolkit</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))] mb-12">
              We provide the tools. You bring the vision. Together, we build legacies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {ecosystemFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="feature-card bg-[rgb(var(--color-surface-2))] p-7 rounded-2xl flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="text-4xl md:text-5xl text-[rgb(var(--color-primary-cyan))] mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1.5">{feature.title}</h3>
                  <p className="text-[rgb(var(--color-text-muted))] text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Call to Action (CTA) */}
        <section className="cta-section py-16 md:py-28 relative bg-[rgb(var(--color-background-dark))] overflow-hidden content-visibility-auto">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(rgb(var(--color-surface-2)) 1px, transparent 1px)',
              backgroundSize: '1.25rem 1.25rem',
              contain: 'paint',
            }}
          ></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3">Your star is waiting</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))] mb-8">
              Forge your legacy in the Vybzz universe. Your stage is waiting.
            </p>
            <button className="bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] text-white font-bold py-3.5 px-8 rounded-full text-base md:text-lg transform hover:scale-[1.03] transition-transform duration-300 shadow-lg shadow-[rgb(var(--color-primary-blue)/0.35)] hover:shadow-[rgb(var(--color-primary-cyan)/0.45)]">
              Become a Vybzz creator
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default OtherVideoCreators

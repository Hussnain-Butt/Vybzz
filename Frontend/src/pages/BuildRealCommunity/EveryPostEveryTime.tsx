import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// GSAP plugins ko register karne ki ab zaroorat nahi agar aap ScrollTrigger use nahi kar rahe.
// Lekin baaki sections ke liye, hum isko rakhenge.
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const EveryPostEveryTime = () => {
  const main = useRef()
  const heroRef = useRef(null)

  useGSAP(
    () => {
      // --- NEW: Minimalist Hero Section Animations ---

      // 1. Content fade-in animation
      const tl = gsap.timeline({ delay: 0.5 })
      tl.from('.hero-heading-char', {
        opacity: 0,
        y: 40,
        rotateX: -90,
        stagger: 0.05,
        duration: 1,
        ease: 'power3.out',
      })
        .from(
          '.hero-paragraph',
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.8',
        )
        .from(
          '.hero-cta-button',
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          '-=0.6',
        )

      // 2. Floating Orbs continuous animation
      gsap.to('.orb-1', {
        y: -30,
        x: 20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.orb-2', {
        y: 25,
        x: -15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1, // thoda alag time pe start ho
      })

      // 3. Mouse-move parallax effect for the entire hero section
      const hero = heroRef.current
      if (hero) {
        hero.addEventListener('mousemove', (e) => {
          const { clientX, clientY } = e
          const xPercent = (clientX / window.innerWidth - 0.5) * 100
          const yPercent = (clientY / window.innerHeight - 0.5) * 100

          // Parallax for content
          gsap.to('.hero-content', {
            duration: 1,
            x: xPercent / 10,
            y: yPercent / 10,
            ease: 'power3.out',
          })

          // Parallax for orbs (zyada move honge)
          gsap.to('.orb-1', { duration: 1.2, x: xPercent / 3, y: yPercent / 3, ease: 'power3.out' })
          gsap.to('.orb-2', { duration: 1.2, x: xPercent / 5, y: yPercent / 5, ease: 'power3.out' })

          // Parallax for background glows (sabse kam move honge)
          gsap.to('.glow-1', {
            duration: 1.5,
            x: -xPercent / 15,
            y: -yPercent / 15,
            ease: 'power3.out',
          })
          gsap.to('.glow-2', {
            duration: 1.5,
            x: xPercent / 12,
            y: yPercent / 12,
            ease: 'power3.out',
          })
        })
      }

      // --- Scroll Animations for other sections (same as before) ---
      const sections = gsap.utils.toArray('.section:not(.hero-section)')
      sections.forEach((section) => {
        gsap.fromTo(
          section.children,
          { y: '+=30', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
            },
          },
        )
      })
    },
    { scope: main },
  )

  // Heading ko words mein split karna for animation
  const headingWords = 'Every Post, Every Time'.split(' ').map((word, index) => (
    <span key={index} className="inline-block mr-4">
      {word.split('').map((char, charIndex) => (
        <span key={charIndex} className="hero-heading-char inline-block">
          {char}
        </span>
      ))}
    </span>
  ))

  return (
    <div ref={main} className="text-white bg-background-dark overflow-hidden ">
      {/* --- HERO SECTION (UNCHANGED) --- */}
      <section
        ref={heroRef}
        className="section hero-section min-h-screen flex items-center justify-center text-center relative"
      >
        {/* Background Glows */}
        <div className="glow-1 absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary-cyan rounded-full opacity-20 blur-3xl filter pointer-events-none"></div>
        <div className="glow-2 absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-pink rounded-full opacity-15 blur-3xl filter pointer-events-none"></div>

        {/* Floating Orbs */}
        <div className="orb-1 absolute top-[20%] left-[15%] w-4 h-4 bg-primary-cyan rounded-full shadow-lg shadow-primary-cyan/50 pointer-events-none"></div>
        <div className="orb-2 absolute top-[40%] left-[25%] w-20 h-20 border-2 border-primary-cyan/30 rounded-full pointer-events-none"></div>

        {/* Hero Content */}
        <div className="hero-content z-10 container mx-auto px-4">
          <h1
            className="hero-heading text-5xl md:text-8xl font-bold text-text-primary mb-6"
            style={{ perspective: '500px' }}
          >
            {headingWords}
          </h1>
          <p className="hero-paragraph text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Unleash consistent, high-impact content across all your platforms. We handle the posts,
            so you can focus on your passion.
          </p>
          <button className="hero-cta-button bg-gradient-to-r from-accent-pink to-accent-orange text-white font-bold py-4 px-10 rounded-full text-lg hover:scale-105 transform transition-transform duration-300 shadow-lg shadow-accent-pink/30">
            Get Started
          </button>
        </div>
      </section>

      {/* --- CONSISTENCY SECTION (UNCHANGED) --- */}
      <section className="section py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Consistency is{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-blue">
              Key
            </span>
          </h2>
          <p className="text-text-secondary max-w-3xl mx-auto mb-12">
            Hum samajhte hain ki social media par consistency kitni zaroori hai. Hamari services yeh
            yakeeni banati hain ki aapka brand hamesha aapke audience ke saamne rahe.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-1 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Scheduled Posts</h3>
              <p className="text-text-muted">
                Aapke content ko pehle se schedule karke, hum yeh yakeeni banate hain ki aap kabhi
                bhi post karna na bhoolein.
              </p>
            </div>
            <div className="bg-surface-1 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Regular Engagement</h3>
              <p className="text-text-muted">
                Hum aapke audience ke saath regular interact karte hain, jisse aapki community
                strong hoti hai.
              </p>
            </div>
            <div className="bg-surface-1 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Content Calendar</h3>
              <p className="text-text-muted">
                Ek well-planned content calendar ke saath, aap hamesha aage rehte hain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: OUR PROCESS SECTION --- */}
      <section className="section py-20 bg-surface-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Our Simple{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-pink to-accent-orange">
              4-Step Process
            </span>
          </h2>
          <div className="relative">
            {/* Dotted Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-700/50 -translate-y-1/2"></div>
            <div className="grid md:grid-cols-4 gap-12 relative">
              <div className="text-center">
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-surface-1 rounded-full border-2 border-primary-cyan text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Discovery & Strategy</h3>
                <p className="text-text-muted">
                  Hum aapke brand ko samajhte hain aur ek winning content strategy banate hain.
                </p>
              </div>
              <div className="text-center">
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-surface-1 rounded-full border-2 border-primary-cyan text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Content Creation</h3>
                <p className="text-text-muted">
                  Hamari expert team aapke liye high-quality, engaging content create karti hai.
                </p>
              </div>
              <div className="text-center">
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-surface-1 rounded-full border-2 border-primary-cyan text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Review & Approval</h3>
                <p className="text-text-muted">
                  Aap content ko post hone se pehle review aur approve karte hain. Aapka
                  satisfaction first priority hai.
                </p>
              </div>
              <div className="text-center">
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-surface-1 rounded-full border-2 border-primary-cyan text-2xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold mb-2">Schedule & Dominate</h3>
                <p className="text-text-muted">
                  Hum content ko best time par schedule karte hain taaki aapko maximum reach mile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: WHY CHOOSE US SECTION --- */}
      <section className="section py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-4">
                More Than Just Posts,
                <br />
                We Deliver{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-blue">
                  Growth
                </span>
              </h2>
              <p className="text-text-secondary mb-8">
                Hamara maqsad sirf post karna nahi, balki aapke brand ko grow karna hai. Hum
                strategy, creativity, aur data ka istemal karke aapko real results dete hain.
              </p>
              <button className="bg-gradient-to-r from-accent-pink to-accent-orange text-white font-bold py-3 px-8 rounded-full text-lg hover:scale-105 transform transition-transform duration-300">
                Explore Features
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface-1 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Save Your Time</h3>
                <p className="text-text-muted">
                  Content ki chinta chhodein aur apne business par focus karein.
                </p>
              </div>
              <div className="bg-surface-1 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Expert Quality</h3>
                <p className="text-text-muted">
                  Professionals dwara banaya gaya content jo aapke brand value ko badhata hai.
                </p>
              </div>
              <div className="bg-surface-1 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Data-Driven Strategy</h3>
                <p className="text-text-muted">
                  Hum trends aur data ko analyze karke content banate hain jo kaam karta hai.
                </p>
              </div>
              <div className="bg-surface-1 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Your Brand, Your Voice</h3>
                <p className="text-text-muted">
                  Hum yeh yakeeni banate hain ki har post aapki brand voice se match kare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: FINAL CTA SECTION --- */}
      <section className="section py-24 text-center">
        <div className="container mx-auto px-4 relative">
          {/* Background Glows for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-cyan rounded-full opacity-10 blur-3xl filter pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-6">Ready to Elevate Your Content Game?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg">
              Consistency laayein, audience badhayein, aur apne goals achieve karein. Chaliye, saath
              milkar shuru karte hain.
            </p>
            <button className="hero-cta-button bg-gradient-to-r from-accent-pink to-accent-orange text-white font-bold py-4 px-10 rounded-full text-xl hover:scale-105 transform transition-transform duration-300 shadow-lg shadow-accent-pink/30">
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EveryPostEveryTime

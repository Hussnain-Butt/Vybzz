import React, { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

// GSAP plugins ko register karein
gsap.registerPlugin(ScrollTrigger, TextPlugin)

const TurnYourViewers = () => {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Hero Section Animation ---
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
      heroTimeline
        .from('.hero-title-char', {
          y: 100,
          opacity: 0,
          stagger: 0.05,
          willChange: 'transform, opacity',
        })
        .to(
          // .from() ki bajaye .to() istemal karein kyunke humne initial state JSX mein de di hai
          '.hero-subtitle',
          { y: 0, opacity: 1, duration: 0.8, willChange: 'transform, opacity' },
          '-=0.8',
        )
        .to(
          // .from() ki bajaye .to() istemal karein
          '.hero-cta',
          { scale: 1, opacity: 1, duration: 0.6, willChange: 'transform, opacity' },
          '-=0.6',
        )
        .from(
          '.hero-glow',
          {
            scale: 0,
            opacity: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            willChange: 'transform, opacity',
          },
          '-=0.5',
        )

      // --- Problem Section Animation ---
      gsap.from('.problem-card', {
        scrollTrigger: {
          trigger: '.problem-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: 'power3.out',
        willChange: 'transform, opacity',
      })

      // --- Process Section Animation ---
      const processCards = gsap.utils.toArray('.process-card')
      processCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            y: 100,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            willChange: 'transform, opacity',
          },
        )
      })
      gsap.from('.process-line', {
        scrollTrigger: {
          trigger: '.process-section',
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1,
        },
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        willChange: 'transform',
      })

      // --- Features Section Animation ---
      const featureCards = gsap.utils.toArray('.feature-card')
      featureCards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          scale: 0.8,
          duration: 0.7,
          ease: 'back.out(1.4)',
          willChange: 'transform, opacity',
        })
      })

      // --- CTA Section Animation ---
      gsap.from('.cta-content > *', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        willChange: 'transform, opacity',
      })
    }, pageRef)

    // Cleanup function
    return () => ctx.revert()
  }, [])

  // Performance optimization ke liye title characters ko memoize karein
  const heroTitleChars = useMemo(() => {
    return 'Turn Your Viewers Into Loyal Fans'.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block hero-title-char"
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char}
      </span>
    ))
  }, [])

  return (
    <div
      ref={pageRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      <main>
        {/* Section 1: Hero */}
        <section className="min-h-screen flex flex-col justify-start relative overflow-hidden pt-40 md:pt-48 pb-20">
          <div className="absolute inset-0 hero-glow">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--color-primary-cyan)/0.2)] rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent-pink)/0.2)] rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[rgb(var(--color-text-primary))] hero-title">
              {heroTitleChars}
            </h1>

            {/* FIX: Shuru mein chupanay ke liye 'opacity-0' add kiya gaya hai */}
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-[rgb(var(--color-text-secondary))] hero-subtitle opacity-0 -translate-y-5">
              At Vybzz Nation, we transform passive scrolling into active engagement. We help you
              build a dedicated community that supports and grows with your brand.
            </p>

            {/* FIX: Shuru mein chupanay ke liye 'opacity-0' aur scale-50 add kiya gaya hai */}
            <button className="mt-10 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 hero-cta opacity-0 scale-50">
              Discover How
            </button>
          </div>
        </section>

        {/* Section 2: The Problem */}
        <section className="py-20 md:py-28 bg-[rgb(var(--color-surface-1)/0.5)] problem-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">High Views, Low Engagement?</h2>
              <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))]">
                You're creating amazing content, but viewers remain just numbers. Let's bridge the
                gap between watching and belonging.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-[rgb(var(--color-surface-2))] rounded-xl problem-card">
                <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Passive Audience
                </h3>
                <p className="mt-2 text-[rgb(var(--color-text-secondary))]">
                  Viewers consume content and leave, creating no lasting connection or brand
                  loyalty.
                </p>
              </div>
              <div className="p-8 bg-[rgb(var(--color-surface-2))] rounded-xl problem-card">
                <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Missed Opportunities
                </h3>
                <p className="mt-2 text-[rgb(var(--color-text-secondary))]">
                  Every unengaged viewer is a potential customer, advocate, or community member
                  lost.
                </p>
              </div>
              <div className="p-8 bg-[rgb(var(--color-surface-2))] rounded-xl problem-card">
                <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Inconsistent Growth
                </h3>
                <p className="mt-2 text-[rgb(var(--color-text-secondary))]">
                  Relying on viral hits is unpredictable. A loyal community ensures stable,
                  long-term growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Process */}
        <section className="py-20 md:py-28 relative process-section">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-[rgb(var(--color-surface-2))] hidden md:block">
            <div className="w-full h-full bg-[rgb(var(--color-primary-cyan))] process-line"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 bg-[rgb(var(--color-background-dark))] px-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                From Viewer to Superfan: Our 3-Step Strategy
              </h2>
              <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))]">
                We use a data-driven approach to build genuine connections.
              </p>
            </div>
            <div className="relative flex flex-col items-center gap-12">
              {/* Step 1 */}
              <div className="w-full max-w-md p-8 bg-[rgb(var(--color-surface-1))] rounded-lg shadow-lg process-card">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[rgb(var(--color-primary-cyan)/0.2)] text-xl font-bold text-[rgb(var(--color-primary-cyan))]">
                    1
                  </div>
                  <h3 className="text-2xl font-bold">Attract & Analyze</h3>
                </div>
                <p className="mt-4 text-[rgb(var(--color-text-secondary))]">
                  We identify your ideal audience and analyze their behavior to understand what
                  truly captivates them, ensuring your content always hits the mark.
                </p>
              </div>
              {/* Step 2 */}
              <div className="w-full max-w-md p-8 bg-[rgb(var(--color-surface-1))] rounded-lg shadow-lg process-card">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[rgb(var(--color-primary-cyan)/0.2)] text-xl font-bold text-[rgb(var(--color-primary-cyan))]">
                    2
                  </div>
                  <h3 className="text-2xl font-bold">Engage & Interact</h3>
                </div>
                <p className="mt-4 text-[rgb(var(--color-text-secondary))]">
                  We create interactive experiences, from live Q&As to exclusive content, making
                  your viewers feel seen, heard, and valued.
                </p>
              </div>
              {/* Step 3 */}
              <div className="w-full max-w-md p-8 bg-[rgb(var(--color-surface-1))] rounded-lg shadow-lg process-card">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[rgb(var(--color-primary-cyan)/0.2)] text-xl font-bold text-[rgb(var(--color-primary-cyan))]">
                    3
                  </div>
                  <h3 className="text-2xl font-bold">Convert & Empower</h3>
                </div>
                <p className="mt-4 text-[rgb(var(--color-text-secondary))]">
                  We provide pathways for your engaged audience to become loyal customers, brand
                  advocates, and the foundation of your thriving community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Features */}
        <section className="py-20 md:py-28 bg-[rgb(var(--color-surface-1)/0.5)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">What You Get With Vybzz Nation</h2>
              <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))]">
                Tools and strategies designed for meaningful growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-xl feature-card text-center">
                <h3 className="text-xl font-semibold">Community Platforms</h3>
                <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                  We build and manage dedicated spaces for your fans.
                </p>
              </div>
              <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-xl feature-card text-center">
                <h3 className="text-xl font-semibold">Content Strategy</h3>
                <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                  Tailored content that sparks conversation and sharing.
                </p>
              </div>
              <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-xl feature-card text-center">
                <h3 className="text-xl font-semibold">Data Analytics</h3>
                <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                  Deep insights into audience engagement and sentiment.
                </p>
              </div>
              <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-xl feature-card text-center">
                <h3 className="text-xl font-semibold">Monetization Models</h3>
                <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                  Unlock new revenue streams from your loyal fanbase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="py-20 md:py-32 cta-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-primary-cyan))] rounded-2xl p-10 md:p-16 text-center cta-content">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                Ready to Build Your Nation?
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-lg text-slate-200">
                Stop counting views and start building relationships. Let's talk about how Vybzz
                Nation can transform your audience.
              </p>
              <button className="mt-8 px-10 py-4 text-lg font-bold text-[rgb(var(--color-primary-blue))] bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                Schedule a Free Consultation
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default TurnYourViewers

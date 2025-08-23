import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaChartLine, FaUsers, FaLightbulb, FaBullseye, FaCogs, FaHandshake } from 'react-icons/fa'

// Register GSAP with ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const UnlockGrowth = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Hero Section Animation ---
      gsap.fromTo(
        '.hero-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
        },
      )

      gsap.fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.5,
        },
      )

      gsap.fromTo(
        '.hero-cta',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 1,
        },
      )

      gsap.fromTo(
        '.hero-glow',
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: 'power3.out',
          delay: 0.2,
        },
      )

      // --- Sections Animation (Scroll-Triggered) ---
      const sections = ['.growth-section']
      sections.forEach((selector) => {
        const section = document.querySelector(selector)
        if (section) {
          gsap.fromTo(
            section.querySelectorAll('.fade-in-up'),
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.2,
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            },
          )
        }
      })

      // --- Growth Cards Animation ---
      gsap.fromTo(
        '.growth-card',
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.growth-cards-container',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        },
      )

      // --- Process Steps Animation ---
      const steps = document.querySelectorAll('.process-step')
      steps.forEach((step, index) => {
        gsap.fromTo(
          step,
          { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )
      })

      // --- CTA Section Animation ---
      gsap.fromTo(
        '.cta-content',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.75)',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, containerRef)

    // Cleanup function
    return () => ctx.revert()
  }, [])

  const growthStrategies = [
    {
      icon: <FaChartLine className="h-10 w-10 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Data-Driven Strategies',
      description:
        'We use market trends and data analytics to create targeted growth plans for your business.',
    },
    {
      icon: <FaUsers className="h-10 w-10 text-[rgb(var(--color-primary-blue))]" />,
      title: 'Audience Engagement',
      description:
        'We identify your target audience and build strong relationships that boost brand loyalty.',
    },
    {
      icon: <FaLightbulb className="h-10 w-10 text-[rgb(var(--color-accent-orange))]" />,
      title: 'Innovative Solutions',
      description:
        'Through creative marketing campaigns and cutting-edge technology, we keep you ahead of the competition.',
    },
    {
      icon: <FaBullseye className="h-10 w-10 text-[rgb(var(--color-accent-pink))]" />,
      title: 'Precision Targeting',
      description:
        'Reaching the right audience is critical. We maximize your ROI with advanced targeting techniques.',
    },
    {
      icon: <FaCogs className="h-10 w-10 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Process Automation',
      description:
        'We automate your marketing and sales processes to save time and increase efficiency.',
    },
    {
      icon: <FaHandshake className="h-10 w-10 text-[rgb(var(--color-primary-blue))]" />,
      title: 'Strategic Partnerships',
      description:
        'We connect your brand with other businesses to open new opportunities and paths to growth.',
    },
  ]

  return (
    <div
      ref={containerRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[rgb(var(--color-primary-blue))] opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter">
            <span className="hero-title inline-block">Unlock</span>
            <span className="hero-title inline-block text-[rgb(var(--color-primary-cyan))] ml-3">
              Exponential
            </span>
            <span className="hero-title inline-block">Growth</span>
          </h1>
          <p className="hero-subtitle mt-4 sm:mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))]">
            Vybzz Nations takes your business to the next level through data, creativity, and
            strategy.
          </p>
          <a
            href="#contact"
            className="hero-cta inline-block mt-8 sm:mt-10 px-8 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.4)]"
          >
            Start Your Growth Journey
          </a>
        </div>
      </section>

      {/* Growth Strategies Section */}
      <section className="growth-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="fade-in-up text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Our Strategies for Your{' '}
              <span className="text-[rgb(var(--color-primary-cyan))]">Growth</span>
            </h2>
            <p className="fade-in-up mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              We don’t just market — we build growth engines for you. Every strategy is designed to
              achieve your unique goals.
            </p>
          </div>

          <div className="growth-cards-container mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {growthStrategies.map((strategy, index) => (
              <div
                key={index}
                className="growth-card bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))] transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.1)]"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[rgb(var(--color-surface-2))] mb-6">
                  {strategy.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{strategy.title}</h3>
                <p className="text-[rgb(var(--color-text-muted))] leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="growth-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="fade-in-up text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              How We Deliver <span className="text-[rgb(var(--color-accent-orange))]">Growth</span>
            </h2>
            <p className="fade-in-up mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              A clear, transparent, and result-oriented process that supports you at every step.
            </p>
          </div>
          <div className="relative">
            {/* Dotted line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-[rgb(var(--color-surface-2))] -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
              {/* Step 1 */}
              <div className="process-step text-center relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-accent-orange))] text-[rgb(var(--color-accent-orange))] text-3xl font-bold mb-4 z-10">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Discovery & Research</h3>
                <p className="text-[rgb(var(--color-text-muted))]">
                  Gaining a deep understanding of your business, market, and goals.
                </p>
              </div>
              {/* Step 2 */}
              <div className="process-step text-center relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-accent-orange))] text-[rgb(var(--color-accent-orange))] text-3xl font-bold mb-4 z-10">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Strategy & Planning</h3>
                <p className="text-[rgb(var(--color-text-muted))]">
                  Building a strong, actionable plan based on data.
                </p>
              </div>
              {/* Step 3 */}
              <div className="process-step text-center relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-accent-orange))] text-[rgb(var(--color-accent-orange))] text-3xl font-bold mb-4 z-10">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Execution & Launch</h3>
                <p className="text-[rgb(var(--color-text-muted))]">
                  Launching campaigns and monitoring them closely.
                </p>
              </div>
              {/* Step 4 */}
              <div className="process-step text-center relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-accent-orange))] text-[rgb(var(--color-accent-orange))] text-3xl font-bold mb-4 z-10">
                  4
                </div>
                <h3 className="text-xl font-bold mb-2">Analyze & Optimize</h3>
                <p className="text-[rgb(var(--color-text-muted))]">
                  Tracking results and optimizing for better performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative bg-[rgb(var(--color-surface-2))] rounded-3xl p-10 sm:p-16 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[rgb(var(--color-primary-cyan))] opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[rgb(var(--color-accent-pink))] opacity-20 rounded-full blur-2xl"></div>
          <div className="cta-content relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to Unlock Your Growth?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
              Your business potential is limitless. Let’s work together to turn that potential into
              reality. Talk to us today for a free consultation.
            </p>
            <a
              href="#"
              className="inline-block mt-8 sm:mt-10 px-10 py-4 bg-[rgb(var(--color-accent-pink))] text-white font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[rgb(var(--color-accent-pink)/0.4)]"
            >
              Get Free Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UnlockGrowth

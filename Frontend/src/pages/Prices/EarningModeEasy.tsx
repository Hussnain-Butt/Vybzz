import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaDollarSign,
  FaUsers,
  FaShareAlt,
  FaChartLine,
  FaRegSmile,
  FaPlayCircle,
} from 'react-icons/fa'

// GSAP ko ScrollTrigger plugin ke saath register karein
gsap.registerPlugin(ScrollTrigger)

const EarningModeEasy = () => {
  const componentRef = useRef(null)

  const earningSteps = [
    {
      icon: <FaUsers className="h-10 w-10 text-white" />,
      title: 'Join a Campaign',
      description:
        'Browse campaigns from your favorite brands and participate in those that fit your audience.',
    },
    {
      icon: <FaShareAlt className="h-10 w-10 text-white" />,
      title: 'Create & Share Content',
      description:
        'Use your creativity to produce engaging content and share it across your social channels.',
    },
    {
      icon: <FaDollarSign className="h-10 w-10 text-white" />,
      title: 'Get Paid Instantly',
      description:
        'Once your content is approved and campaign goals are met, earnings go straight to your account.',
    },
  ]

  const benefits = [
    { icon: <FaDollarSign />, text: 'Competitive Payouts' },
    { icon: <FaChartLine />, text: 'Real-time Tracking' },
    { icon: <FaUsers />, text: 'Top Brand Collaborations' },
    { icon: <FaRegSmile />, text: 'Flexible & Easy' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO ANIMATION ---
      gsap.fromTo(
        '.hero-title',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 },
      )
      gsap.fromTo(
        '.hero-subtitle',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 },
      )
      gsap.fromTo(
        '.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.75)', delay: 1 },
      )
      gsap.fromTo(
        '.hero-glow',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: 'power3.out', delay: 0.2 },
      )

      // --- HOW IT WORKS SECTION ---
      gsap.fromTo(
        '.section-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.how-it-works-section', start: 'top 80%' },
        },
      )

      const steps = document.querySelectorAll('.earning-step')
      steps.forEach((step, index) => {
        gsap.fromTo(
          step,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.steps-container',
              start: 'top 80%',
              stagger: 0.2,
            },
          },
        )
      })

      // --- BENEFITS SECTION ---
      gsap.fromTo(
        '.benefits-section .section-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.benefits-section', start: 'top 80%' },
        },
      )

      gsap.fromTo(
        '.benefit-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.benefits-grid', start: 'top 80%' },
        },
      )

      // --- FINAL CTA ANIMATION ---
      gsap.fromTo(
        '.final-cta',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.75)',
          scrollTrigger: { trigger: '.final-cta-section', start: 'top 85%' },
        },
      )
    }, componentRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={componentRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-[rgb(var(--color-accent-pink))] opacity-15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter">
            <span className="hero-title inline-block">Earning Mode:</span>
            <span className="hero-title inline-block bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))] ml-3">
              Easy
            </span>
          </h1>
          <p className="hero-subtitle mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))]">
            Earning with Vybzz Nations is easier than ever. Turn your passion into profit—with no
            hassle.
          </p>
          <a
            href="#start-earning"
            className="hero-cta inline-flex items-center gap-3 mt-10 px-8 py-4 bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))] text-white font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[rgb(var(--color-accent-pink)/0.3)]"
          >
            <FaPlayCircle />
            Start Earning Now
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Earn in Just{' '}
              <span className="text-[rgb(var(--color-primary-cyan))]">3 Simple Steps</span>
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              Our process is so simple that anyone can start.
            </p>
          </div>

          <div className="steps-container relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Dashed line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[rgb(var(--color-surface-2))] -translate-y-1/2"></div>

            {earningSteps.map((step, index) => (
              <div key={index} className="earning-step relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[rgb(var(--color-surface-2))] to-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-primary-cyan))] mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-[rgb(var(--color-text-muted))] leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--color-surface-1))]">
        <div className="max-w-6xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              What’s the <span className="text-[rgb(var(--color-accent-orange))]">Benefit</span> for
              You?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              On Vybzz Nations, earning isn’t just about money — it’s about growing your career.
            </p>
          </div>

          <div className="benefits-grid grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="benefit-card flex items-center gap-4 bg-[rgb(var(--color-surface-2))] p-4 sm:p-6 rounded-xl"
              >
                <div className="text-2xl sm:text-3xl text-[rgb(var(--color-accent-orange))]">
                  {benefit.icon}
                </div>
                <span className="font-semibold text-base sm:text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="start-earning" className="final-cta-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="final-cta max-w-4xl mx-auto text-center relative bg-gradient-to-br from-[rgb(var(--color-surface-1))] to-transparent rounded-3xl p-10 sm:p-16 border border-[rgb(var(--color-surface-2))]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Start Your Earning Journey Today!
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Join thousands of creators on Vybzz Nations. Sign up and apply to your first campaign.
          </p>
          <a
            href="/signup"
            className="inline-block mt-8 sm:mt-10 px-10 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.4)]"
          >
            Sign Up for Free
          </a>
        </div>
      </section>
    </div>
  )
}

export default EarningModeEasy

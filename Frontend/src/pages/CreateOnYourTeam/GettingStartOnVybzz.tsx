import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FiUserPlus,
  FiEdit,
  FiCompass,
  FiUploadCloud,
  FiStar,
  FiTrendingUp,
  FiDollarSign,
} from 'react-icons/fi'

// GSAP ko ScrollTrigger plugin ke saath register karein
gsap.registerPlugin(ScrollTrigger)

const GettingStartOnVybzz = () => {
  const mainRef = useRef(null)

  useEffect(() => {
    // GSAP animations ke liye context set karein
    const ctx = gsap.context(() => {
      // --- Hero Section Animation ---
      gsap.from('.hero-element', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out',
      })

      // --- Steps Section Animation ---
      const stepCards = gsap.utils.toArray('.step-card')
      stepCards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          duration: 0.8,
          y: 60,
          opacity: 0,
          ease: 'power3.out',
        })
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
          duration: 1,
          scale: 0.9,
          opacity: 0,
          ease: 'expo.out',
        })
      })

      // --- CTA Section Animation ---
      gsap.from('.cta-content > *', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        duration: 1,
        y: 40,
        opacity: 0,
        stagger: 0.3,
        ease: 'power3.out',
      })
    }, mainRef)

    // Cleanup function
    return () => ctx.revert()
  }, [])

  const steps = [
    {
      icon: <FiUserPlus className="h-8 w-8 mb-4 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Create Your Account',
      description:
        'Sign up in seconds. Join the elite community of creators and fans on Vybzz Nation.',
    },
    {
      icon: <FiEdit className="h-8 w-8 mb-4 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Customize Your Profile',
      description:
        'Craft a profile that truly represents you. Add your bio, links, and showcase your best work.',
    },
    {
      icon: <FiCompass className="h-8 w-8 mb-4 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Discover & Connect',
      description:
        'Explore content from other creators. Follow, collaborate, and build your network within the Nation.',
    },
    {
      icon: <FiUploadCloud className="h-8 w-8 mb-4 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Share Your Vibe',
      description:
        "Start sharing your content. Whether it's videos, music, or art, let your vibe be known.",
    },
  ]

  const features = [
    {
      icon: <FiStar className="h-10 w-10 text-[rgb(var(--color-accent-pink))]" />,
      title: 'Exclusive Creator Tools',
      description:
        'Access a suite of powerful tools designed to help you create, manage, and grow your content effortlessly.',
    },
    {
      icon: <FiTrendingUp className="h-10 w-10 text-[rgb(var(--color-accent-orange))]" />,
      title: 'Audience Growth',
      description:
        "Our platform's algorithm is built to promote undiscovered talent. Reach a wider audience organically.",
    },
    {
      icon: <FiDollarSign className="h-10 w-10 text-[rgb(var(--color-primary-blue))]" />,
      title: 'Monetization Ready',
      description:
        'Turn your passion into a profession. We provide multiple streams to monetize your content from day one.',
    },
  ]

  return (
    <div
      ref={mainRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      {/* --- Hero Section --- */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-surface-1))]/30 to-[rgb(var(--color-background-dark))] opacity-50"></div>
        <div className="absolute inset-0 grain-bg opacity-5"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold hero-element">
          Getting Started On
          <span className="block mt-2 md:mt-4 bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))]">
            Vybzz Nation
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl text-[rgb(var(--color-text-secondary))] hero-element">
          Your journey to becoming a part of the most elite creator community starts here. Follow
          these simple steps to unleash your potential.
        </p>
        <button className="mt-10 px-8 py-3 bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 hero-element">
          Join The Nation
        </button>
      </section>

      {/* --- Steps Section --- */}
      <section className="py-20 md:py-28 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Your Path to Success</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))] max-w-xl mx-auto">
              A simple, straightforward guide to get you up and running in no time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="step-card bg-[rgb(var(--color-surface-1))] p-8 rounded-xl border border-[rgb(var(--color-surface-2))] transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:-translate-y-2 shadow-lg"
              >
                {step.icon}
                <h3 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))] mb-3">
                  {step.title}
                </h3>
                <p className="text-[rgb(var(--color-text-secondary))]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Key Features Section --- */}
      <section className="py-20 md:py-28 px-6 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Unlock Your Potential</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))] max-w-xl mx-auto">
              We provide the tools, you bring the talent.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-[rgb(var(--color-background-dark))] p-10 rounded-2xl border border-transparent hover:border-[rgb(var(--color-surface-3))]"
              >
                <div className="flex justify-center items-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[rgb(var(--color-text-secondary))]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="cta-section py-20 md:py-32 px-6">
        <div className="container mx-auto text-center cta-content max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-extrabold">
            Ready to Join the
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))]">
              {' '}
              Vybzz Nation
            </span>
            ?
          </h2>
          <p className="mt-6 text-xl text-[rgb(var(--color-text-secondary))]">
            Don't wait. The community is waiting for your unique vibe. Become a part of the future
            of content creation today.
          </p>
          <button className="mt-12 px-10 py-4 bg-white text-[rgb(var(--color-background-dark))] font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 text-lg">
            Create Your Profile Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default GettingStartOnVybzz

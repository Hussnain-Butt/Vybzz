import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiLayout, FiBox, FiGift, FiStar, FiSettings } from 'react-icons/fi'
import { TfiPalette } from 'react-icons/tfi'

// GSAP ko ScrollTrigger plugin ke saath register karein
gsap.registerPlugin(ScrollTrigger)

const MakeItYourOwn = () => {
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

      gsap.from('.hero-visual', {
        duration: 1.5,
        scale: 0.9,
        opacity: 0,
        delay: 0.5,
        ease: 'expo.out',
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
          duration: 0.8,
          y: 60,
          opacity: 0,
          ease: 'power3.out',
        })
      })

      // --- Showcase Section Animation ---
      gsap.from('.showcase-content > *', {
        scrollTrigger: {
          trigger: '.showcase-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.3,
        ease: 'expo.out',
      })
    }, mainRef)

    // Cleanup function
    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: <FiLayout className="h-8 w-8 mb-4 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Dynamic Profile Layouts',
      description:
        'Choose from multiple layouts or drag-and-drop modules to create a profile that is uniquely yours.',
    },
    {
      icon: <TfiPalette className="h-8 w-8 mb-4 text-[rgb(var(--color-accent-pink))]" />,
      title: 'Branded Color Schemes',
      description:
        'Apply your own brand colors across your profile, ensuring a consistent and professional look for your audience.',
    },
    {
      icon: <FiBox className="h-8 w-8 mb-4 text-[rgb(var(--color-accent-orange))]" />,
      title: 'Custom Content Modules',
      description:
        'Showcase what matters most. Highlight featured videos, top-selling products, or upcoming events.',
    },
    {
      icon: <FiGift className="h-8 w-8 mb-4 text-[rgb(var(--color-primary-blue))]" />,
      title: 'Personalized Fan Tiers',
      description:
        'Design your own subscription tiers with custom names, perks, and pricing to engage your community.',
    },
  ]

  return (
    <div
      ref={mainRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-hidden"
    >
      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center p-8 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgb(var(--color-background-dark))]"></div>

        <div className="z-10 relative">
          <h1 className="text-5xl md:text-7xl font-extrabold hero-element">
            Make It
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))]">
              {' '}
              Your Own
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-[rgb(var(--color-text-secondary))] hero-element">
            Your space, your rules, your brand. Vybzz Nation gives you the ultimate freedom to forge
            a unique identity.
          </p>
          <div className="mt-12 hero-element">
            <a
              href="#features"
              className="px-8 py-3 bg-white text-[rgb(var(--color-background-dark))] font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              Discover Customization
            </a>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">The Canvas is Yours</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))] max-w-xl mx-auto">
              We provide the tools. You bring the vision. Here's how you can customize your corner
              of the Nation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-[rgb(var(--color-surface-1))] p-8 rounded-xl border border-[rgb(var(--color-surface-2))] transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:-translate-y-2 shadow-lg flex items-start space-x-6"
              >
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[rgb(var(--color-text-secondary))]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Visual Showcase Section --- */}
      <section className="showcase-section py-20 md:py-28 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center showcase-content">
          {/* Text Content */}
          <div className="text-content">
            <FiSettings className="h-12 w-12 mb-4 text-[rgb(var(--color-primary-blue))]" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Profile, Reimagined</h2>
            <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-4">
              Move beyond static pages. Our interactive profile builder allows you to construct a
              dynamic experience for your audience.
            </p>
            <p className="text-lg text-[rgb(var(--color-text-secondary))]">
              From a minimalist portfolio to a vibrant media hub, the power to craft your digital
              storefront is in your hands.
            </p>
          </div>
          {/* Visual Content with 3D effect */}
          <div className="group perspective-1000">
            <div className="w-full bg-[rgb(var(--color-surface-2))] rounded-xl p-4 border border-[rgb(var(--color-surface-3))] transform-style-3d transition-transform duration-500 group-hover:rotate-y-10 group-hover:rotate-x-2 group-hover:scale-105">
              {/* Mock Header */}
              <div className="flex items-center space-x-4 p-4 border-b border-[rgb(var(--color-surface-3))]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))]"></div>
                <div>
                  <div className="h-4 w-32 bg-[rgb(var(--color-text-muted))] rounded"></div>
                  <div className="h-3 w-24 bg-[rgb(var(--color-surface-3))] rounded mt-2"></div>
                </div>
              </div>
              {/* Mock Content */}
              <div className="p-4 grid grid-cols-3 gap-3">
                <div className="h-24 bg-[rgb(var(--color-surface-3))] rounded-lg col-span-1"></div>
                <div className="h-24 bg-[rgb(var(--color-surface-3))] rounded-lg col-span-2"></div>
                <div className="h-24 bg-[rgb(var(--color-surface-3))] rounded-lg col-span-2"></div>
                <div className="h-24 bg-[rgb(var(--color-surface-3))] rounded-lg col-span-1"></div>
                <div className="h-24 bg-[rgb(var(--color-surface-3))] rounded-lg col-span-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 md:py-28 px-6 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto text-center max-w-3xl">
          <FiStar className="h-12 w-12 mx-auto mb-6 text-[rgb(var(--color-accent-orange))]" />
          <h2 className="text-4xl md:text-5xl font-extrabold">Ready to Build Your Universe?</h2>
          <p className="mt-6 text-xl text-[rgb(var(--color-text-secondary))]">
            Stop fitting in. Start standing out. Your audience is waiting for a creator just like
            you.
          </p>
          <button className="mt-10 px-10 py-4 bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 text-lg">
            Start Customizing Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default MakeItYourOwn

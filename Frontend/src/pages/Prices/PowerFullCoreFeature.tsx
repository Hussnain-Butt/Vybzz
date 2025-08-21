import React from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import {
  FaChartPie,
  FaCogs,
  FaUsers,
  FaShieldAlt,
  FaRocket,
  FaHeadset,
  FaSyncAlt,
  FaPaintBrush,
  FaShareAlt,
  FaBullseye,
  FaFileContract,
  FaBrain,
} from 'react-icons/fa'

// GSAP ko ScrollTrigger plugin ke saath register karein
gsap.registerPlugin(ScrollTrigger)

const PowerFullCoreFeature = () => {
  const componentRef = useRef(null)

  // Hero section mein dikhane ke liye icons
  const heroIcons = [
    { icon: <FaChartPie />, position: 'top-[15%] left-[10%] sm:top-[20%] sm:left-[15%]' },
    { icon: <FaRocket />, position: 'top-[15%] right-[10%] sm:top-[20%] sm:right-[15%]' },
    { icon: <FaShieldAlt />, position: 'bottom-[15%] left-[20%] sm:bottom-[20%] sm:left-[25%]' },
    { icon: <FaCogs />, position: 'bottom-[15%] right-[20%] sm:bottom-[20%] sm:right-[25%]' },
    {
      icon: <FaUsers className="hidden sm:block" />,
      position: 'top-[45%] left-[25%] sm:top-[40%] sm:left-[20%]',
    },
    {
      icon: <FaBrain className="hidden sm:block" />,
      position: 'top-[45%] right-[25%] sm:top-[40%] sm:right-[20%]',
    },
  ]

  // (Baki features ka data waisa hi rahega)
  const featureCategories = {
    'Analytics & Insights': [
      {
        icon: <FaChartPie className="h-8 w-8 text-[rgb(var(--color-primary-cyan))]" />,
        title: 'Advanced Analytics',
        description:
          'Real-time data aur deep insights se apni performance ko track karein aur behtar business decisions lein.',
      },
      {
        icon: <FaUsers className="h-8 w-8 text-[rgb(var(--color-primary-cyan))]" />,
        title: 'Audience Segmentation',
        description:
          'Apni audience ko unke behavior, demographics, aur interests ke base par segment karke personalized campaigns chalayein.',
      },
      {
        icon: <FaBrain className="h-8 w-8 text-[rgb(var(--color-primary-cyan))]" />,
        title: 'AI-Powered Predictions',
        description:
          'Artificial Intelligence ka istemal karke future trends aur customer behavior ko predict karein taaki aap hamesha aage rahein.',
      },
    ],
    'Automation & Tools': [
      {
        icon: <FaCogs className="h-8 w-8 text-[rgb(var(--color-accent-orange))]" />,
        title: 'Workflow Automation',
        description:
          'Repetitive marketing tasks ko automate karein taaki aapka waqt bache aur aap strategy par focus kar sakein.',
      },
      {
        icon: <FaRocket className="h-8 w-8 text-[rgb(var(--color-accent-orange))]" />,
        title: 'Multi-Channel Campaigns',
        description:
          'Email, social media, aur doosre channels par campaigns ko ek hi dashboard se manage aur launch karein.',
      },
      {
        icon: <FaShareAlt className="h-8 w-8 text-[rgb(var(--color-accent-orange))]" />,
        title: 'Social Media Integration',
        description:
          'Apne saare social media accounts ko connect karke content schedule karein aur engagement ko track karein.',
      },
    ],
    'Platform & Support': [
      {
        icon: <FaShieldAlt className="h-8 w-8 text-[rgb(var(--color-primary-blue))]" />,
        title: 'Enterprise-Grade Security',
        description:
          'Aapka data hamare paas mehfooz hai. Hum top-level security protocols ka istemal karte hain.',
      },
      {
        icon: <FaPaintBrush className="h-8 w-8 text-[rgb(var(--color-primary-blue))]" />,
        title: 'Full Customization',
        description:
          'Platform ko apni brand identity ke mutabik customize karein, jisse aapko ek consistent look and feel milti hai.',
      },
      {
        icon: <FaHeadset className="h-8 w-8 text-[rgb(var(--color-primary-blue))]" />,
        title: '24/7 Priority Support',
        description:
          'Hamari expert support team aapki madad ke liye hamesha taiyar hai, jab bhi aapko zaroorat ho.',
      },
    ],
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- NEW ATTRACTIVE HERO ANIMATION ---

      // 1. Animate Text Content
      gsap.fromTo(
        '.hero-content',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
        },
      )

      // 2. Animate Floating Icons Entrance
      gsap.fromTo(
        '.floating-icon',
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)',
          stagger: 0.1,
          delay: 0.5,
        },
      )

      // 3. Add continuous floating animation to icons
      const icons = document.querySelectorAll('.floating-icon')
      icons.forEach((icon) => {
        gsap.to(icon, {
          y: 'random(-20, 20)',
          x: 'random(-15, 15)',
          rotation: 'random(-10, 10)',
          duration: 'random(4, 8)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })

      // --- Feature Categories Animation (Same as before) ---
      const categories = document.querySelectorAll('.feature-category')
      categories.forEach((category) => {
        gsap.fromTo(
          category.querySelector('.category-title'),
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: category,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        )

        gsap.fromTo(
          category.querySelectorAll('.feature-card'),
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: category,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        )
      })

      // --- CTA Section Animation (Same as before) ---
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
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
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
      {/* ====== NEW & IMPROVED HERO SECTION ====== */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
        {/* Background Glows and Grids */}
        <div className="absolute inset-0 z-0 bg-grid-slate-800 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] max-w-[600px] max-h-[600px] bg-[rgb(var(--color-primary-blue))] opacity-10 rounded-full blur-3xl"></div>

        {/* Floating Icons */}
        <div className="absolute inset-0 z-10">
          {heroIcons.map((item, index) => (
            <div
              key={index}
              className={`floating-icon absolute ${item.position} w-16 h-16 sm:w-20 sm:h-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center`}
            >
              <span className="text-3xl sm:text-4xl text-white/80">{item.icon}</span>
            </div>
          ))}
        </div>

        {/* Text Content */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="hero-content text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter">
            Powerful Core Features
          </h1>
          <p className="hero-content mt-6 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
            Vybzz Nations ke wo features jo aapke business ko aage badhane ke liye banaye gaye hain.
            Har tool aapko behtar results dene ke liye design kiya gaya hai.
          </p>
        </div>
      </section>

      {/* ====== Baki Page Waisa Hi Hai ====== */}

      {/* Features Grid Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
          {Object.entries(featureCategories).map(([category, features], index) => (
            <div key={index} className="feature-category">
              <h2 className="category-title text-3xl sm:text-4xl font-bold tracking-tight mb-10 sm:mb-12 border-l-4 border-[rgb(var(--color-primary-cyan))] pl-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, fIndex) => (
                  <div
                    key={fIndex}
                    className="feature-card bg-[rgb(var(--color-surface-1))] p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(var(--color-background-dark)/0.5)] flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-[rgb(var(--color-text-muted))] leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="cta-content">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Sab Kuch Jo Aapko{' '}
              <span className="text-[rgb(var(--color-primary-cyan))]">Growth</span> Ke Liye Chahiye
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
              Hamare plans aapki zaroorat ke hisab se banaye gaye hain. Explore karein aur apne
              business ke liye best plan chunein.
            </p>
            <a
              href="/pricing"
              className="inline-block mt-8 sm:mt-10 px-10 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.4)]"
            >
              View Pricing Plans
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PowerFullCoreFeature

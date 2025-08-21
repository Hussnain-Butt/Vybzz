import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaStore,
  FaLink,
  FaChartBar,
  FaShoppingCart,
  FaTshirt,
  FaDollarSign,
  FaArrowRight,
  FaCheck,
} from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const Commerce = () => {
  const componentRef = useRef(null)

  const coreFeatures = [
    {
      icon: <FaStore className="h-8 w-8 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Unified Creator Hub',
      description:
        'Manage your storefront, affiliate links, and earnings from a single, intuitive dashboard.',
    },
    {
      icon: <FaLink className="h-8 w-8 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Smart Link Generation',
      description:
        'Instantly create trackable affiliate links for thousands of products from our partnered brands.',
    },
    {
      icon: <FaChartBar className="h-8 w-8 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Actionable Analytics',
      description:
        'Get deep insights into your sales performance, audience behavior, and top-earning products.',
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO ANIMATION ---
      gsap.fromTo(
        '.hero-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 },
      )

      gsap.fromTo(
        '.hero-glow',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: 'power3.out' },
      )

      // --- SECTION HEADER ANIMATION ---
      gsap.fromTo(
        '.section-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.section-header',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )

      // --- CORE FEATURES CARDS ANIMATION ---
      gsap.fromTo(
        '.feature-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.features-section', start: 'top 80%' },
        },
      )

      // --- REDESIGNED "TWO PATHS" ANIMATION ---
      const paths = document.querySelectorAll('.monetization-path')
      paths.forEach((path) => {
        gsap.fromTo(
          path,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: path, start: 'top 85%' },
          },
        )
        gsap.fromTo(
          path.querySelector('.bg-icon'),
          { scale: 0.5, opacity: 0, rotation: -30 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3,
            scrollTrigger: { trigger: path, start: 'top 85%' },
          },
        )
      })

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
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[rgb(var(--color-accent-orange))] opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-slate-900 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="hero-content text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
            Your Influence, Your Empire.
          </h1>
          <p className="hero-content mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))]">
            Go beyond sponsorships. With Vybzz Nations Commerce, build a lasting business by selling
            products and promoting brands your audience truly loves.
          </p>
          <a
            href="#start-selling"
            className="hero-content inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[rgb(var(--color-accent-orange))] text-white font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-[rgb(var(--color-accent-orange)/0.2)]"
          >
            Activate Commerce Hub
          </a>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="features-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="feature-card flex items-start gap-5 p-6 bg-[rgb(var(--color-surface-1))] rounded-xl border border-[rgb(var(--color-surface-2))] transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:bg-[rgb(var(--color-surface-2))]"
              >
                <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REDESIGNED Monetization Paths Section */}
      <section className="monetization-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
              Two Powerful Paths to Profit
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              Choose your strategy or combine both to maximize your earnings.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 perspective-1000">
            {/* Path 1: Affiliate */}
            <div className="monetization-path relative overflow-hidden bg-[rgb(var(--color-surface-1))] p-8 sm:p-10 rounded-2xl border border-[rgb(var(--color-surface-2))] transform-style-3d transition-transform duration-500 hover:transform hover:-translate-y-2 hover:rotate-x-4">
              <FaLink className="bg-icon absolute -right-10 -bottom-10 text-9xl text-white/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[rgb(var(--color-primary-cyan))]">
                    <FaLink className="text-2xl text-[rgb(var(--color-background-dark))]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Affiliate Marketing</h3>
                </div>
                <p className="text-[rgb(var(--color-text-muted))] mb-8">
                  Promote products and earn commissions. No inventory, no hassle.
                </p>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-[rgb(var(--color-primary-cyan))] flex-shrink-0" />
                    <span>Access our exclusive brand marketplace.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-[rgb(var(--color-primary-cyan))] flex-shrink-0" />
                    <span>Share custom links in your content.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-[rgb(var(--color-primary-cyan))] flex-shrink-0" />
                    <span>Earn automatically when your followers buy.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Path 2: Merchandise */}
            <div className="monetization-path relative overflow-hidden bg-[rgb(var(--color-surface-1))] p-8 sm:p-10 rounded-2xl border border-[rgb(var(--color-surface-2))] transform-style-3d transition-transform duration-500 hover:transform hover:-translate-y-2 hover:rotate-x-4">
              <FaTshirt className="bg-icon absolute -right-10 -bottom-10 text-9xl text-white/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[rgb(var(--color-accent-pink))]">
                    <FaTshirt className="text-2xl text-[rgb(var(--color-background-dark))]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Your Merchandise</h3>
                </div>
                <p className="text-[rgb(var(--color-text-muted))] mb-8">
                  Sell your own branded products, from t-shirts to digital goods.
                </p>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-[rgb(var(--color-accent-pink))] flex-shrink-0" />
                    <span>Design and list products in minutes.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-[rgb(var(--color-accent-pink))] flex-shrink-0" />
                    <span>Connect with print-on-demand services.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-[rgb(var(--color-accent-pink))] flex-shrink-0" />
                    <span>Keep the majority of the profit from sales.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="start-selling" className="final-cta-section py-20 sm:py-28 px-4">
        <div className="final-cta max-w-4xl mx-auto text-center">
          <FaShoppingCart className="mx-auto text-4xl text-[rgb(var(--color-primary-cyan))] mb-4" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Ready to Turn Content into Commerce?
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Unlock new revenue streams and give your audience products they'll love. Activate your
            Commerce Hub and build your empire today.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-[rgb(var(--color-primary-cyan)/0.3)]"
          >
            Get Started for Free
            <FaArrowRight />
          </a>
        </div>
      </section>
    </div>
  )
}

export default Commerce

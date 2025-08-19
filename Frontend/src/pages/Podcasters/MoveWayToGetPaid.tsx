import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom' // Link component import karein
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image1 from '../../assets/Podcasters/3.jpg'
import Image2 from '../../assets/Podcasters/2.jpg'
import Image3 from '../../assets/Podcasters/4.jpg'

import {
  FaArrowRight,
  FaGlobe,
  FaShieldAlt,
  FaBolt,
  FaDollarSign,
  FaChartBar,
  FaRss,
} from 'react-icons/fa'

// Company logos ke liye image imports
import stripe from '../../assets/Podcasters/Company Logos/stripe.png'
import figma from '../../assets/Podcasters/Company Logos/figma.png'
import shopify from '../../assets/Podcasters/Company Logos/shopify.png'
import paypal from '../../assets/Podcasters/Company Logos/paypal.png'

const featureImage1 = Image1
const featureImage2 = Image2
const featureImage3 = Image3
gsap.registerPlugin(ScrollTrigger)

// Chhota sa component scroll indicator ke liye
const ScrollDownIndicator = () => (
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
    <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center items-start p-1">
      <div className="w-1 h-2 rounded-full bg-slate-500 animate-bounce"></div>
    </div>
  </div>
)

// "Trusted By" section ke liye ab image logo component
const CompanyLogo = ({ name, src }) => (
  <div
    className="logo-item flex items-center justify-center transition-all duration-300"
    style={{ willChange: 'transform, opacity' }}
    title={name}
  >
    <img
      src={src}
      alt={`${name} logo`}
      // YAHAN SIZE INCREASE KIYA GAYA HAI
      className="h-32 sm:h-32 w-auto grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
    />
  </div>
)

const MoveWayToGetPaid = () => {
  const mainRef = React.useRef(null)

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO ANIMATION ---
      const hero = mainRef.current.querySelector('.hero-section')
      gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 1 } })
        .fromTo(hero.querySelector('h1'), { y: 50, opacity: 0 }, { y: 0, opacity: 1 })
        .fromTo(hero.querySelector('p'), { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.7')
        .fromTo(
          hero.querySelector('.hero-cta'),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1 },
          '-=0.7',
        )
        .fromTo(
          hero.querySelector('.scroll-indicator'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1 },
          '-=0.5',
        )

      // --- TRUSTED BY ANIMATION ---
      const trustedSection = mainRef.current.querySelector('.trusted-section')
      gsap.from(trustedSection.querySelectorAll('.logo-item'), {
        scrollTrigger: { trigger: trustedSection, start: 'top 85%' },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        ease: 'power2.out',
      })

      // --- FEATURES ANIMATION ---
      gsap.utils.toArray('.feature-item').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: 'top 80%' },
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
        })
      })

      // --- VISUAL DEMO ANIMATION ---
      const demoSection = mainRef.current.querySelector('.demo-section')
      const counter = { val: 0 }
      gsap
        .timeline({ scrollTrigger: { trigger: demoSection, start: 'top 60%' } })
        .fromTo(
          demoSection.querySelector('.demo-card'),
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1 },
        )
        .fromTo(
          demoSection.querySelectorAll('.demo-line'),
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.7, stagger: 0.2 },
          '-=0.5',
        )
        .to(counter, {
          val: 2450.75,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            const amountEl = demoSection.querySelector('.demo-amount')
            if (amountEl) amountEl.textContent = `$${counter.val.toFixed(2)}`
          },
        })
        .to(demoSection.querySelector('.demo-status-indicator'), {
          backgroundColor: '#22c55e',
          duration: 0.5,
        })
        .to(
          demoSection.querySelector('.demo-status-text'),
          { textContent: 'Paid Successfully', duration: 0.5 },
          '<',
        )

      // --- PODCASTER & CTA ANIMATION ---
      gsap.utils.toArray('.animated-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.animated-item'), {
          scrollTrigger: { trigger: section, start: 'top 80%' },
          opacity: 0,
          y: 50,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
        })
      })
    }, mainRef)
    return () => ctx.revert()
  }, [])

  const logos = [
    { name: 'Stripe', path: stripe },
    { name: 'PayPal', path: paypal },
    { name: 'Shopify', path: shopify },
  ]

  return (
    <div
      ref={mainRef}
      className="overflow-x-hidden"
      style={{
        backgroundColor: 'rgb(var(--color-background-dark))',
        color: 'rgb(var(--color-text-primary))',
      }}
    >
      {/* SECTION 1: HERO */}
      <section className="hero-section min-h-screen w-full flex flex-col justify-center items-center text-center relative overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[rgba(var(--color-primary-blue),0.2)] to-transparent filter blur-3xl opacity-50 animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-[rgba(var(--color-accent-pink),0.2)] to-transparent filter blur-3xl opacity-50 animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDIU1LDIU1LDAuMDUKSI+jxwYXRoIGQ9Ik0wIC41SDMyTTUuNSAwVjMyTTguNSAwVjMyTTExLjUgMFYzMk0xNC41IDBWMzJNMjAuNSAwVjMyTTIzLjUgMFYzMk0yNi41IDBWMzJNMzIgMTQuNVYxLjVIMDB2MzIiLz48L3N2Zz4=')] opacity-50"></div>
        </div>

        <div className="relative z-10">
          <h1
            className="text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4"
            style={{ willChange: 'transform, opacity' }}
          >
            The Smartest Way to
            <br />
            Get{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))]">
              Paid
            </span>
            .
          </h1>
          <p
            className="max-w-md md:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[rgb(var(--color-text-secondary))] mb-8"
            style={{ willChange: 'transform, opacity' }}
          >
            Move is the all-in-one platform for businesses to manage payments, invoices, and cash
            flow with unprecedented speed and security.
          </p>
          <div className="hero-cta" style={{ willChange: 'transform, opacity' }}>
            <Link to="/signup">
              <button className="bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] hover:scale-105 transform transition-transform duration-300 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg shadow-lg shadow-[rgba(var(--color-primary-blue),0.3)] flex items-center mx-auto">
                Get Started for Free <FaArrowRight className="ml-2 sm:ml-3" />
              </button>
            </Link>
          </div>
        </div>
        <div className="scroll-indicator" style={{ willChange: 'transform, opacity' }}>
          <ScrollDownIndicator />
        </div>
      </section>

      {/* SECTION 2: TRUSTED BY */}
      <section className="trusted-section py-12 sm:py-16 bg-[rgb(var(--color-surface-1))] bg-opacity-30">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-muted))] tracking-widest uppercase mb-6 sm:mb-8">
            Powering payments for industry leaders
          </p>
          {/* YAHAN SPACING INCREASE KI GAYI HAI */}
          <div className="flex justify-center items-center flex-wrap gap-x-16 gap-y-8 sm:gap-x-20 ">
            {logos.map((logo) => (
              <CompanyLogo key={logo.name} name={logo.name} src={logo.path} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES */}
      <section className="features-section py-16 sm:py-20 lg:py-28 space-y-20 sm:space-y-28">
        <div
          className="feature-item container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-12 items-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="text-left">
            <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 bg-[rgba(var(--color-primary-cyan),0.1)] text-[rgb(var(--color-primary-cyan))] px-3 py-1 rounded-full text-sm font-bold">
              <FaBolt /> <span>Instant Payouts</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Receive funds in seconds, not days
            </h2>
            <p className="text-base sm:text-lg text-[rgb(var(--color-text-secondary))]">
              Why wait? With Move, your revenue hits your bank account instantly. Improve your cash
              flow and never miss an opportunity.
            </p>
          </div>
          <div>
            <img
              src={featureImage1}
              alt="Abstract representation of fast data transfer"
              className="rounded-2xl shadow-2xl aspect-video object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div
          className="feature-item container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-12 items-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="md:order-2">
            <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 bg-[rgba(var(--color-primary-cyan),0.1)] text-[rgb(var(--color-primary-cyan))] px-3 py-1 rounded-full text-sm font-bold">
              <FaGlobe /> <span>Global Reach</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Go global from day one</h2>
            <p className="text-base sm:text-lg text-[rgb(var(--color-text-secondary))]">
              Accept payments from over 190 countries. We handle currency conversion and compliance,
              so you can focus on expansion.
            </p>
          </div>
          <div className="md:order-1">
            <img
              src={featureImage2}
              alt="Digital globe with connection charts showing global reach"
              className="rounded-2xl shadow-2xl aspect-video object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div
          className="feature-item container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-12 items-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <div>
            <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 bg-[rgba(var(--color-primary-cyan),0.1)] text-[rgb(var(--color-primary-cyan))] px-3 py-1 rounded-full text-sm font-bold">
              <FaShieldAlt /> <span>Ironclad Security</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Bank-grade security built-in</h2>
            <p className="text-base sm:text-lg text-[rgb(var(--color-text-secondary))]">
              Our platform uses advanced fraud detection and encryption to ensure every transaction
              is safe and secure.
            </p>
          </div>
          <div>
            <img
              src={featureImage3}
              alt="Laptop screen with security code representing cybersecurity"
              className="rounded-2xl shadow-2xl aspect-video object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: VISUAL DEMO */}
      <section className="demo-section py-16 sm:py-20 lg:py-28 flex justify-center items-center px-4 sm:px-6">
        <div
          className="demo-card w-full max-w-md sm:max-w-lg bg-[rgb(var(--color-surface-2))] p-6 sm:p-8 rounded-2xl shadow-2xl border border-[rgb(var(--color-surface-3))]"
          style={{ willChange: 'transform, opacity' }}
        >
          <div
            className="flex justify-between items-center mb-6 demo-line"
            style={{ transformOrigin: 'left' }}
          >
            <h3 className="text-lg sm:text-xl font-bold">Incoming Payment</h3>
            <p className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-slate-500">
              Move
            </p>
          </div>
          <div className="space-y-4 mb-6">
            <div
              className="flex justify-between text-sm sm:text-base demo-line"
              style={{ transformOrigin: 'left' }}
            >
              <span className="text-[rgb(var(--color-text-muted))]">From</span>
              <span className="font-semibold">Vybzz Nation Inc.</span>
            </div>
            <div
              className="flex justify-between text-sm sm:text-base demo-line"
              style={{ transformOrigin: 'left' }}
            >
              <span className="text-[rgb(var(--color-text-muted))]">Invoice ID</span>
              <span className="font-semibold">#VN-2025-08</span>
            </div>
          </div>
          <div
            className="bg-[rgb(var(--color-background-dark))] p-4 sm:p-6 rounded-lg text-center mb-6 demo-line"
            style={{ transformOrigin: 'left' }}
          >
            <p className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))] mb-1">AMOUNT</p>
            <p
              className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))] demo-amount"
              style={{ willChange: 'contents' }}
            >
              $0.00
            </p>
          </div>
          <div
            className="flex items-center justify-center text-base sm:text-lg font-semibold demo-line"
            style={{ transformOrigin: 'left' }}
          >
            <div className="demo-status-indicator w-3 h-3 rounded-full bg-yellow-500 mr-3 transition-colors duration-500"></div>
            <span className="demo-status-text">Processing...</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: NAYA PODCASTER SECTION */}
      <section className="podcaster-section animated-section py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animated-item">
            Empowering Podcasters to Succeed
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto mb-12 sm:mb-16 animated-item">
            We provide the tools you need to grow your show, engage your listeners, and build a
            thriving business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Monetize */}
            <div
              className="podcaster-card animated-item bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-surface-3))] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:border-[rgb(var(--color-primary-cyan))]"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="p-4 bg-[rgba(var(--color-primary-cyan),0.1)] rounded-full mb-4">
                <FaDollarSign className="text-3xl text-[rgb(var(--color-primary-cyan))]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Monetize Your Content</h3>
              <p className="text-[rgb(var(--color-text-muted))] flex-grow">
                From ads and sponsorships to premium subscriptions, we make it easy to earn money
                from your hard work.
              </p>
            </div>

            {/* Card 2: Analytics */}
            <div
              className="podcaster-card animated-item bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-surface-3))] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:border-[rgb(var(--color-primary-cyan))]"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="p-4 bg-[rgba(var(--color-primary-cyan),0.1)] rounded-full mb-4">
                <FaChartBar className="text-3xl text-[rgb(var(--color-primary-cyan))]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Understand Your Audience</h3>
              <p className="text-[rgb(var(--color-text-muted))] flex-grow">
                Get detailed insights on your listeners. Know where they are from, what they like,
                and how they engage.
              </p>
            </div>

            {/* Card 3: Distribution */}
            <div
              className="podcaster-card animated-item bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-surface-3))] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:border-[rgb(var(--color-primary-cyan))]"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="p-4 bg-[rgba(var(--color-primary-cyan),0.1)] rounded-full mb-4">
                <FaRss className="text-3xl text-[rgb(var(--color-primary-cyan))]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Distribute Seamlessly</h3>
              <p className="text-[rgb(var(--color-text-muted))] flex-grow">
                Publish your episodes to all major platforms like Spotify, Apple Podcasts, and more
                with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="cta-section animated-section text-center py-16 sm:py-20 lg:py-28 bg-[rgb(var(--color-surface-1))] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-[rgba(var(--color-primary-blue),0.3)] to-transparent filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-[rgba(var(--color-accent-pink),0.3)] to-transparent filter blur-3xl opacity-50"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 animated-item">
            Ready to Move Faster?
          </h2>
          <p className="text-base sm:text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto mb-8 animated-item">
            Create an account in minutes and start accepting payments today. Join the future of
            finance.
          </p>
          <div className="animated-item">
            <Link to="/signup">
              <button className="bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] hover:scale-105 transform transition-transform duration-300 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full text-base sm:text-xl shadow-lg shadow-[rgba(var(--color-primary-blue),0.3)]">
                Sign Up Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default React.memo(MoveWayToGetPaid)

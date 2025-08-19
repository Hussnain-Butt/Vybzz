// src/pages/MoreWayToGetPaid.jsx
import React, { useLayoutEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- Memoized SVG Icons ---
const MonetizationIcon = memo(() => (
  <svg className="w-8 h-8 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 0c-1.11 0-2.08-.402-2.599-1M9.401 15c-.519-.598-1.401-1-2.401-1m4.599 4c.519.598 1.401 1 2.401 1m-4.599-4c-.519-.598-.401-1.5-.401-2.5s0-2 .401-2.5m4.599 4c.519.598.401-1.5.401-2.5s0-2-.401-2.5M12 6V5m0 14v-1m0-1c-3.866 0-7-1.79-7-4s3.134-4 7-4 7 1.79 7 4-3.134 4-7 4z"
    />
  </svg>
))
MonetizationIcon.displayName = 'MonetizationIcon'

const BrandIcon = memo(() => (
  <svg className="w-8 h-8 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6"
    />
  </svg>
))
BrandIcon.displayName = 'BrandIcon'

const FanIcon = memo(() => (
  <svg className="w-8 h-8 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
))
FanIcon.displayName = 'FanIcon'

const ProductIcon = memo(() => (
  <svg className="w-8 h-8 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
))
ProductIcon.displayName = 'ProductIcon'

const MoreWayToGetPaid = () => {
  const mainRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // SAFETY: ensure visible by default
      gsap.set('.monetization-card', { opacity: 1, y: 0 })
      gsap.set('.step-item', { opacity: 1, x: 0 })
      gsap.set('.testimonial-card', { opacity: 1, y: 0, scale: 1 })

      // Hero
      gsap.from('.hero-title-char', {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.hero-cta', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: 'back.out(1.7)',
      })

      // Sections
      gsap.utils.toArray('.animated-section').forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 100,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      // Cards
      gsap.from('.monetization-card', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.monetization-grid', start: 'top 80%', once: true },
      })

      // Steps
      gsap.utils.toArray('.step-item').forEach((step, i) => {
        gsap.from(step, {
          opacity: 0,
          x: i % 2 === 0 ? -100 : 100,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 85%', once: true },
        })
      })

      // Testimonials
      gsap.from('.testimonial-card', {
        opacity: 0,
        scale: 0.9,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.testimonial-grid', start: 'top 80%', once: true },
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  const splitText = (text) =>
    text.split('').map((char, i) => (
      <span key={i} className="hero-title-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))

  return (
    <div ref={mainRef} className="bg-zinc-950 text-white overflow-x-hidden">
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950 opacity-50" />
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen blur-3xl animate-pulse" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter mb-4">
            {splitText('More Ways To')}
            <br />
            <span className="text-cyan-400">{splitText('Get Paid')}</span>
          </h1>
          <p className="hero-subtitle max-w-2xl mx-auto text-lg lg:text-xl text-zinc-300 mb-8">
            Vybzz Nation empowers video creators like you to unlock diverse revenue streams. Turn
            your passion into a profession, beyond just ad revenue.
          </p>
          <div className="hero-cta">
            <button className="bg-cyan-400 hover:bg-blue-500 transition-all duration-300 text-zinc-950 font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105">
              Start Earning Now
            </button>
          </div>
        </div>
      </section>

      {/* MONETIZATION */}
      <section className="py-20 lg:py-32 px-4 md:px-8 animated-section relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Unlock Your <span className="text-pink-500">Earning Potential</span>
          </h2>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto mb-16">
            We provide the tools and opportunities to diversify your income. Explore multiple ways
            to get paid for your creative work.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 monetization-grid">
            {['Ad Revenue Plus', 'Brand Partnerships', 'Fan Subscriptions', 'Digital Products'].map(
              (title, index) => (
                <div
                  key={index}
                  className="monetization-card bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2 will-change-transform will-change-opacity"
                >
                  {index === 0 && <MonetizationIcon />}
                  {index === 1 && <BrandIcon />}
                  {index === 2 && <FanIcon />}
                  {index === 3 && <ProductIcon />}
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-zinc-400">
                    {index === 0 &&
                      'Maximize your earnings with our premium ad network and higher CPM rates.'}
                    {index === 1 &&
                      'Connect with top brands for sponsorships and integrated campaigns.'}
                    {index === 2 &&
                      'Build a loyal community with exclusive content for your paying members.'}
                    {index === 3 &&
                      'Sell your own merch, courses, or digital downloads directly to your audience.'}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-32 px-4 md:px-8 bg-zinc-900 animated-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Get Started in <span className="text-blue-500">Minutes</span>
            </h2>
            <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
              Our process is simple and transparent. Follow these steps to start monetizing your
              content with Vybzz Nation.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-800 hidden md:block" />
            {[
              {
                title: 'Sign Up & Connect',
                desc: 'Create your Vybzz Nation account and securely link your video channels.',
              },
              {
                title: 'Explore Options',
                desc: 'Browse our marketplace of brand deals and enable fan funding features.',
              },
              {
                title: 'Track & Get Paid',
                desc: 'Monitor your earnings in real-time on your dashboard and get paid instantly.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className={`step-item mb-12 flex ${
                  i % 2 === 0 ? 'md:justify-end md:mr-12' : 'md:justify-start md:ml-12'
                }`}
              >
                <div className="md:w-5/12 p-8 bg-zinc-800 rounded-xl relative border-l-4 md:border-l-0 md:border-r-4 border-orange-500 will-change-transform will-change-opacity">
                  <div
                    className={`absolute hidden md:block w-4 h-4 bg-orange-500 rounded-full top-1/2 -translate-y-1/2 ${
                      i % 2 === 0 ? '-right-[3.35rem]' : '-left-[3.35rem]'
                    }`}
                  />
                  <p className="text-sm font-semibold text-orange-400 mb-1">STEP 0{i + 1}</p>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-zinc-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-32 px-4 md:px-8 bg-zinc-900 animated-section">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Join Successful Creators</h2>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto mb-16">
            See what other creators are saying about growing their income with Vybzz Nation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 testimonial-grid">
            {[
              {
                name: 'Jessica "TechieJess"',
                role: 'Tech Reviewer',
                quote:
                  '"Vybzz Nation revolutionized my monetization strategy. The brand marketplace is a game-changer, and I\'ve doubled my monthly income!"',
                imgId: 'a042581f4e29026704d',
              },
              {
                name: 'Mike "GamerX"',
                role: 'Gaming Streamer',
                quote:
                  '"The ability to offer fan subscriptions so easily has created a stable, predictable income for me. My community loves the exclusive content."',
                imgId: 'a042581f4e29026704e',
              },
              {
                name: 'Chloe "TravelLight"',
                role: 'Travel Vlogger',
                quote:
                  '"Finally, a platform that understands creators. The instant payouts are incredible for managing my cash flow as a full-time creator."',
                imgId: 'a042581f4e29026704f',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="testimonial-card bg-zinc-800 p-8 rounded-xl text-left will-change-transform will-change-opacity"
              >
                <p className="text-zinc-300 italic mb-6">{t.quote}</p>
                <div className="flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${t.imgId}`}
                    alt={`${t.name} profile`}
                    className="w-12 h-12 rounded-full mr-4"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{t.name}</h4>
                    <p className="text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 lg:py-32 px-4 md:px-8 animated-section">
        <div className="max-w-4xl mx-auto text-center bg-zinc-800 p-10 md:p-16 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Amplify Your Earnings?</h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            Join the nation of creators who are taking control of their financial future. Signing up
            is free and takes just a few minutes.
          </p>
          <button className="bg-cyan-400 hover:bg-blue-500 transition-all duration-300 text-zinc-950 font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105">
            Sign Up for Free
          </button>
        </div>
      </section>
    </div>
  )
}

export default MoreWayToGetPaid

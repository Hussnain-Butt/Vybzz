import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP Plugins ko register karna
gsap.registerPlugin(ScrollTrigger)

// --- ICONS ---
// Inhe aap ek alag file (e.g., Icons.js) mein bhi rakh sakte hain.

const CheckCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z"
      clipRule="evenodd"
    />
  </svg>
)

const ChartBarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c-1.036 0-1.875.84-1.875 1.875v9.375c0 1.036.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V10.5c0-1.036-.84-1.875-1.875-1.875h-.75zM3 13.125c-1.036 0-1.875.84-1.875 1.875v3.75c0 1.036.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875v-3.75c0-1.036-.84-1.875-1.875-1.875H3z" />
  </svg>
)
const GlobeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.093c-1.46.244-2.753 1.118-3.697 2.246a.75.75 0 001.06 1.06A6.703 6.703 0 0112 8.25c1.625 0 3.123.634 4.243 1.757a.75.75 0 001.06-1.06A8.223 8.223 0 0012.75 6.093V6zM15 11.25a.75.75 0 00-1.5 0v2.073a2.25 2.25 0 01-2.25 2.25h-.129a2.25 2.25 0 01-2.25-2.25V11.25a.75.75 0 00-1.5 0v2.073c0 2.06 1.69 3.75 3.75 3.75h.129c2.06 0 3.75-1.69 3.75-3.75V11.25z"
      clipRule="evenodd"
    />
  </svg>
)

const MoreWayToGetPaid = () => {
  const main = useRef()

  useGSAP(
    () => {
      // 1. Hero Animation
      gsap.from('.hero-element', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'power4.out',
      })

      // 2. Section 1: Analytics Dashboard Animation
      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: '.analytics-section',
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1,
        },
        opacity: 0,
        scale: 0.9,
        y: 50,
        stagger: 0.1,
        ease: 'power3.out',
      })
      gsap.from('.analytics-image', {
        scrollTrigger: { trigger: '.analytics-section', start: 'top 80%' },
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
      })

      // 3. Section 2: Subscription Tiers Animation
      gsap.from('.tier-card', {
        scrollTrigger: { trigger: '.tiers-section', start: 'top 70%' },
        opacity: 0,
        y: 100,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      })

      // 4. Section 3: Merchandise Horizontal Scroll (Responsive Animation)
      // GSAP MatchMedia ka use karke responsive animations create karte hain
      const mm = gsap.matchMedia()

      // Desktop animation (1024px se upar)
      mm.add('(min-width: 1024px)', () => {
        const merchSection = document.querySelector('.merch-section')
        const gallery = document.querySelector('.merch-gallery')
        if (merchSection && gallery) {
          const scrollAmount = gallery.offsetWidth - merchSection.offsetWidth

          gsap.to(gallery, {
            x: -scrollAmount,
            ease: 'none',
            scrollTrigger: {
              trigger: merchSection,
              start: 'top top',
              end: () => `+=${scrollAmount}`,
              scrub: 1.5,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
        }
      })

      // Mobile animation (1023px se neeche) - isme sirf fade-in add kar sakte hain
      mm.add('(max-width: 1023px)', () => {
        gsap.from('.merch-card', {
          scrollTrigger: { trigger: '.merch-gallery', start: 'top 80%' },
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.7,
        })
      })

      // 5. Section 4: Live vs Virtual Panels Animation
      gsap.from('.live-panel', {
        scrollTrigger: { trigger: '.gigs-section', start: 'top 70%' },
        xPercent: -50,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      })
      gsap.from('.virtual-panel', {
        scrollTrigger: { trigger: '.gigs-section', start: 'top 70%' },
        xPercent: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      })

      // 6. Section 5: Sync Licensing Logos Animation
      gsap.from('.sync-logo', {
        scrollTrigger: { trigger: '.sync-section', start: 'top 80%' },
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(2)',
      })
    },
    { scope: main },
  )

  // Tailwind CSS Custom Colors (aap inhen tailwind.config.js mein daal sakte hain)
  // --background-dark: #0D1117;
  // --surface-1: #161B22;
  // --surface-2: #21262D;
  // --text-primary: #E6EDF3;
  // --text-secondary: #8B949E;
  // --primary-cyan: #22d3ee;
  // --primary-blue: #3b82f6;

  return (
    <div ref={main} className="bg-[#0D1117] text-[#E6EDF3] antialiased overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 py-24">
        {/* Background Grid & Glow Effect */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_80%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-primary-cyan/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-4xl">
          <p className="hero-element text-base md:text-lg font-semibold text-primary-cyan mb-3">
            Vybzz Nation for Artists
          </p>
          <h1 className="hero-element text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            More Than Music. It&apos;s Your Empire.
          </h1>
          <p className="hero-element text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Your talent is priceless. We show you every path where your work can turn into real,
            sustainable income and financial freedom.
          </p>
          <button className="hero-element bg-primary-cyan text-background-dark font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-cyan/30">
            Explore Your Revenue
          </button>
        </div>
      </section>

      {/* Section 2: Streaming & Analytics Dashboard */}
      <section className="analytics-section py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Master Your Streaming Income
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Every stream, every download builds your career. Our powerful dashboard gives you
              real-time insights to grow faster.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="analytics-image">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
                alt="Artist analytics dashboard on a screen"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="stat-card bg-[#161B22] border border-white/10 p-6 rounded-2xl">
                <GlobeIcon className="w-8 h-8 text-primary-cyan mb-3" />
                <p className="text-3xl font-bold text-white">150+</p>
                <p className="text-text-secondary mt-1">Digital Stores Worldwide</p>
              </div>
              <div className="stat-card bg-[#161B22] border border-white/10 p-6 rounded-2xl">
                <ChartBarIcon className="w-8 h-8 text-primary-cyan mb-3" />
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-text-secondary mt-1">Royalties Are Yours</p>
              </div>
              <div className="stat-card bg-[#161B22] border border-white/10 p-6 rounded-2xl">
                <p className="text-3xl font-bold text-white">Daily</p>
                <p className="text-text-secondary mt-1">Earning Trends</p>
              </div>
              <div className="stat-card bg-[#161B22] border border-white/10 p-6 rounded-2xl">
                <p className="text-3xl font-bold text-white">Global</p>
                <p className="text-text-secondary mt-1">Audience Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Fan Subscriptions */}
      <section className="tiers-section py-20 md:py-32 px-6 bg-[#161B22] border-t border-b border-white/10">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Build Your Fan Army
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-16">
            Your most loyal fans want to support you directly. Give them exclusive content and
            unlock recurring income.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tier 1 */}
            <div className="tier-card bg-[#21262D] p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 hover:border-primary-cyan">
              <h3 className="text-2xl font-bold text-white mb-4">Bronze Fan</h3>
              <p className="text-4xl font-bold mb-6">
                ₹99<span className="text-lg font-normal text-text-secondary">/month</span>
              </p>
              <ul className="space-y-4 text-left text-text-secondary">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-cyan mr-3 shrink-0" /> Exclusive
                  Community Access
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-cyan mr-3 shrink-0" /> Early Song
                  Previews
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-cyan mr-3 shrink-0" />{' '}
                  Behind-the-scenes Photos
                </li>
              </ul>
            </div>
            {/* Tier 2 - Highlighted */}
            <div className="tier-card relative bg-primary-blue text-white p-8 rounded-2xl ring-4 ring-primary-cyan transform md:scale-105 shadow-2xl shadow-primary-blue/30">
              <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary-cyan text-background-dark text-xs font-bold px-3 py-1 rounded-full uppercase">
                Most Popular
              </span>
              <h3 className="text-2xl font-bold mb-4">Silver Supporter</h3>
              <p className="text-4xl font-bold mb-6">
                ₹299<span className="text-lg font-normal opacity-90">/month</span>
              </p>
              <ul className="space-y-4 text-left">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-white mr-3 shrink-0" /> Everything in
                  Bronze
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-white mr-3 shrink-0" /> Monthly Live
                  Q&amp;A
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-white mr-3 shrink-0" /> Exclusive Merch
                  Discount
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-white mr-3 shrink-0" /> Vote on the Next
                  Song
                </li>
              </ul>
            </div>
            {/* Tier 3 */}
            <div className="tier-card bg-[#21262D] p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 hover:border-primary-cyan">
              <h3 className="text-2xl font-bold text-white mb-4">Gold Patron</h3>
              <p className="text-4xl font-bold mb-6">
                ₹999<span className="text-lg font-normal text-text-secondary">/month</span>
              </p>
              <ul className="space-y-4 text-left text-text-secondary">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-cyan mr-3 shrink-0" /> Everything
                  in Silver
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-cyan mr-3 shrink-0" /> Personal
                  Video Message
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-cyan mr-3 shrink-0" /> Signed
                  Merch Item
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Merchandise (Horizontal Scroll on Desktop, Swipe on Mobile) */}
      <section className="merch-section lg:h-screen flex flex-col justify-center overflow-hidden py-20 lg:py-0">
        <div className="container mx-auto px-6 relative z-10 lg:pointer-events-none">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Wear Your Sound. Sell Your Brand.
            </h2>
            <p className="text-lg text-text-secondary mt-4">
              Your music is a lifestyle. We help you design, produce, and ship high-quality
              merchandise—with zero upfront cost.
            </p>
          </div>
        </div>

        {/* Gallery Container */}
        {/* Desktop: Absolute position for pinning */}
        {/* Mobile: Standard block with overflow for swiping */}
        <div className="merch-gallery lg:absolute lg:top-0 lg:left-0 lg:h-full w-full lg:w-[300vw] flex items-center gap-6 md:gap-8 px-6 lg:px-8 mt-12 lg:mt-0 overflow-x-auto lg:overflow-x-visible">
          {[
            {
              src: 'https://plus.unsplash.com/premium_photo-1681503973682-29cec46571b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              alt: 'Stylish artist merchandise hoodie',
            },
            {
              src: 'https://plus.unsplash.com/premium_photo-1681503973682-29cec46571b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              alt: 'Vinyl record in artistic lighting',
            },
            {
              src: 'https://plus.unsplash.com/premium_photo-1681503973682-29cec46571b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              alt: 'Graphic t-shirt merchandise',
            },
            {
              src: 'https://plus.unsplash.com/premium_photo-1681503973682-29cec46571b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              alt: 'Embroidered cap merchandise',
            },
            {
              src: 'https://plus.unsplash.com/premium_photo-1737730796397-50a0c397cc51?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8',
              alt: 'Artistic music posters',
            },
            {
              src: 'https://plus.unsplash.com/premium_photo-1737730796397-50a0c397cc51?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8',
              alt: 'Custom branded artist merchandise',
            },
          ].map((img, index) => (
            <div key={index} className="merch-card flex-shrink-0 lg:h-3/5 w-4/5 sm:w-2/5 lg:w-auto">
              <img
                src={img.src}
                alt={img.alt}
                className="rounded-xl object-cover w-full h-full shadow-2xl"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Live & Virtual Gigs */}
      <section className="gigs-section relative w-full grid md:grid-cols-2">
        <div
          className="live-panel clip-path-polygon-md relative min-h-[60vh] md:min-h-screen flex items-center justify-center p-8 text-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Roar of the Crowd</h2>
            <p className="mt-4 text-lg text-text-secondary">
              Tours, local gigs, festivals—nothing beats the energy of live performance. We help you
              get on stage.
            </p>
          </div>
        </div>
        <div
          className="virtual-panel clip-path-polygon-md-inverted relative min-h-[60vh] md:min-h-screen flex items-center justify-center p-8 text-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1964&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-primary-blue/80"></div>
          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Global Stage</h2>
            <p className="mt-4 text-lg text-white/90">
              Ticketed virtual concerts let you reach fans everywhere. No borders—just music.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Sync Licensing */}
      <section className="sync-section py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get Your Music on Screen
            </h2>
            <p className="text-lg text-text-secondary mb-10">
              Imagine your song in a Netflix series, a blockbuster film, or a viral video game. Sync
              licensing opens doors to significant revenue and new audiences.
            </p>
            <button className="bg-primary-cyan text-background-dark font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-cyan/30">
              Submit for Sync
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {['NETFLIX', 'HBO MAX', 'PRIME VIDEO', 'EA SPORTS', 'SONY PICTURES', 'DISNEY+'].map(
              (name) => (
                <div
                  key={name}
                  className="sync-logo bg-[#161B22] border border-white/10 p-6 rounded-xl flex items-center justify-center aspect-video backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                >
                  <span className="text-lg md:text-xl font-bold text-text-secondary tracking-wider text-center">
                    {name}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MoreWayToGetPaid

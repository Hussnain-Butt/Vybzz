import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaUsers,
  FaTshirt,
  FaVideo,
  FaBookOpen,
  FaRocket,
  FaLock,
  FaChartLine,
  FaComments,
  FaCheck,
  FaQuoteLeft,
} from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const ShareMoreThan = () => {
  const rootRef = useRef(null)

  // Split text for character-level hero animation (Gradient moved onto each span)
  const splitChars = (txt) =>
    txt.split('').map((c, i) => (
      <span
        key={i}
        className="inline-block hero-char bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400"
      >
        {c === ' ' ? '\u00A0' : c}
      </span>
    ))

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.hero-char', {
        opacity: 0,
        y: 40,
        skewX: -10,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.02,
      })
        .from('.hero-sub', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .from(
          '.hero-cta',
          { opacity: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.6)' },
          '-=0.3',
        )
        .from(
          '.hero-stat',
          { opacity: 0, y: 14, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          '-=0.3',
        )

      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      gsap.utils.toArray('.stagger-grid').forEach((grid) => {
        const items = grid.querySelectorAll('.stagger-item')
        gsap.from(items, {
          opacity: 0,
          y: 24,
          scale: 0.98,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 80%' },
        })
      })

      gsap.to('.parallax-float', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-wrap', start: 'top top', end: '+=600', scrub: true },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="bg-background-dark text-text-primary overflow-x-hidden">
      {/* ===================== HERO ===================== */}
      <section className="hero-wrap relative min-h-screen flex items-center py-16">
        {/* background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-60 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(closest-side,var(--color-primary-cyan),transparent)]" />
          <div className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-40 bg-[radial-gradient(closest-side,var(--color-accent-pink),transparent)]" />
        </div>

        <div className="container mx-auto px-5 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            {/* h1 no longer has text-transparent; gradient sits on spans */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight tracking-tighter">
              {splitChars('Share More Than Music.')}
            </h1>

            <p className="hero-sub mt-6 text-lg md:text-xl text-text-secondary max-w-xl">
              On Vybzz Nation, your sound is just the beginning. Share your story, your vision, and
              your world—built for creators who want depth, community, and growth.
            </p>

            <div className="hero-cta mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <a
                href="#why"
                className="group inline-flex items-center justify-center rounded-full px-6 py-3.5 text-base font-bold bg-gradient-to-r from-primary-cyan to-primary-blue text-white shadow-lg shadow-primary-cyan/20 hover:shadow-primary-cyan/40 transition-shadow duration-300"
              >
                Discover How
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#join"
                className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-base font-semibold bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition"
              >
                Explore Features
              </a>
            </div>

            <div className="hero-stat mt-12 grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <p className="text-3xl font-bold">200k+</p>
                <p className="text-text-muted text-sm">Active Fans</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">4.9/5</p>
                <p className="text-text-muted text-sm">Creator Rated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">+180%</p>
                <p className="text-text-muted text-sm">Avg. Earnings</p>
              </div>
            </div>
          </div>

          {/* Right art */}
          <div className="parallax-float">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <CardArt title="Behind the Scenes" icon={<FaBookOpen />} color="cyan" />
                <CardArt title="Fan Q&As" icon={<FaComments />} color="blue" />
              </div>
              <div className="space-y-4 sm:space-y-6 mt-10">
                <CardArt title="Music Videos" icon={<FaVideo />} color="pink" />
                <CardArt title="Merch Drops" icon={<FaTshirt />} color="orange" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY SECTION ===================== */}
      <section id="why" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 -z-10 bg-surface-1/30 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
        <div className="absolute inset-0 -z-20 opacity-10 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />

        <div className="container mx-auto px-5 lg:px-8">
          <header className="reveal-up max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Why creators choose <span className="text-primary-cyan">Vybzz</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Tools that go beyond streaming—build a community, tell fuller stories, and monetize
              sustainably.
            </p>
          </header>

          <div className="stagger-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<FaUsers />}
              title="Community Hub"
              text="Private posts, tiers, DMs and gated drops for super-fans."
            />
            <FeatureCard
              icon={<FaChartLine />}
              title="Growth Analytics"
              text="Audience insights, churn alerts, and campaign tracking."
            />
            <FeatureCard
              icon={<FaLock />}
              title="Gated Content"
              text="Lock videos, audio, files—unlock with tiers or one-offs."
            />
            <FeatureCard
              icon={<FaRocket />}
              title="Monetize More"
              text="Merch, events, collabs, affiliates—stack multiple revenue lines."
            />
          </div>
        </div>
      </section>

      {/* ===================== MONETIZATION ===================== */}
      <section className="py-20 md:py-28 bg-slate-900/30">
        <div className="container mx-auto px-5 lg:px-8">
          <header className="reveal-up text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Launch your empire.</h2>
            <p className="mt-4 text-lg text-text-secondary">
              Turn art into income—with no pressure to “go viral.”
            </p>
          </header>

          <div className="stagger-grid mt-12 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <MonoCard
              icon={<FaTshirt />}
              title="Merch Store"
              bullets={[
                'Tier-exclusive product access',
                'Inventory & order sync',
                'Hyped drop countdowns',
              ]}
              color="pink"
            />
            <MonoCard
              icon={<FaRocket />}
              title="Events & Tickets"
              bullets={['IRL + virtual experiences', 'Seat & Tier gating', 'Full fan list export']}
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* ===================== MICRO TESTIMONIALS ===================== */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="stagger-grid grid md:grid-cols-3 gap-6">
            {[
              ['“Finally a place where my fans feel close—and I don’t feel burnt out.”', 'Nova L.'],
              [
                '“Memberships and merch paid for my entire EP in just 3 months. Game changer.”',
                'Rayen',
              ],
              ['“Love the analytics. I know exactly what my audience wants more of.”', 'Mira V.'],
            ].map((q, i) => (
              <blockquote
                key={i}
                className="stagger-item relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
              >
                <FaQuoteLeft className="absolute top-4 left-5 text-4xl text-slate-700/60" />
                <p className="relative z-10 text-base text-text-secondary">{q[0]}</p>
                <footer className="relative z-10 mt-4 text-text-muted text-sm font-semibold">
                  — {q[1]}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section id="join" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-[-20%] top-[-10%] w-[900px] h-[900px] rounded-full blur-3xl opacity-40 bg-[radial-gradient(closest-side,var(--color-accent-pink),transparent)]" />
          <div className="absolute left-[-20%] bottom-[-10%] w-[900px] h-[900px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(closest-side,var(--color-primary-cyan),transparent)]" />
        </div>

        <div className="container mx-auto px-5 lg:px-8 text-center max-w-3xl">
          <h2 className="reveal-up text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
            Ready to share your world?
          </h2>
          <p className="reveal-up mt-5 text-lg text-text-secondary">
            Join the new wave of creators on Vybzz Nation and redefine what it means to be an
            artist.
          </p>
          <div className="reveal-up mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-bold bg-gradient-to-r from-primary-cyan to-primary-blue text-white shadow-lg shadow-primary-cyan/20 hover:shadow-primary-cyan/40 transition-shadow duration-300"
            >
              Get Started for Free
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#why"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ======= Redesigned Presentational Subcomponents ======= */

const colorClasses = {
  cyan: 'from-primary-cyan/80 to-primary-cyan/20 text-primary-cyan',
  blue: 'from-primary-blue/80 to-primary-blue/20 text-primary-blue',
  pink: 'from-accent-pink/80 to-accent-pink/20 text-accent-pink',
  orange: 'from-accent-orange/80 to-accent-orange/20 text-accent-orange',
}

const CardArt = ({ title, icon, color = 'cyan' }) => (
  <div
    className="stagger-item group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 transition-all duration-300 will-change-transform hover:!opacity-100 hover:-translate-y-2 hover:scale-[1.03] hover:border-white/20"
    role="figure"
    aria-label={title}
  >
    <div
      className={`relative w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="absolute inset-0 rounded-full opacity-50 blur-md bg-current" />
      <span className="relative text-white">{icon}</span>
    </div>
    <p className="mt-4 font-bold text-lg">{title}</p>
    <div className="mt-4 h-32 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0))] border border-white/10" />
  </div>
)

const FeatureCard = ({ icon, title, text }) => (
  <div className="stagger-item p-[1px] rounded-2xl bg-gradient-to-b from-slate-700 to-transparent">
    <article className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 h-full">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary-cyan to-primary-blue text-white text-xl">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-text-muted">{text}</p>
    </article>
  </div>
)

const Tile = ({ icon, title }) => (
  <div className="stagger-item snap-start group relative min-h-[200px] sm:min-h-[240px] bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-primary-cyan/50 hover:-translate-y-1">
    <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top,var(--color-primary-cyan)_0%,transparent_50%)]" />
    <div className="relative z-10 text-2xl text-text-secondary group-hover:text-primary-cyan transition-colors">
      {icon}
    </div>
    <div className="relative z-10">
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="text-text-muted text-sm mt-1">Exclusive for members</p>
    </div>
  </div>
)

const MonoCard = ({ icon, title, bullets, color = 'cyan' }) => (
  <div
    className={`stagger-item bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 ${
      color === 'pink' ? 'border-l-accent-pink/50' : 'border-l-primary-blue/50'
    } border-l-4`}
  >
    <div
      className={`text-3xl shrink-0 ${color === 'pink' ? 'text-accent-pink' : 'text-primary-blue'}`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-base text-text-secondary">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-1.5 flex h-5 w-5 items-center justify-center rounded-full ${
                color === 'pink'
                  ? 'bg-accent-pink/20 text-accent-pink'
                  : 'bg-primary-blue/20 text-primary-blue'
              }`}
            >
              <FaCheck className="h-2.5 w-2.5" />
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default ShareMoreThan

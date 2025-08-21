// src/pages/BringInNewFans.jsx
import React, { useLayoutEffect, useRef } from 'react'

// GSAP for animations
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Icons
import {
  FiUsers,
  FiBarChart2,
  FiTarget,
  FiAtSign,
  FiMusic,
  FiFilm,
  FiArrowRight,
} from 'react-icons/fi'

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger)

const BringInNewFans = () => {
  const main = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO SECTION ANIMATION ---
      gsap.fromTo(
        '.hero-title-char',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, duration: 0.8, ease: 'power3.out', delay: 0.2 },
      )
      gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6,
      })
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 })
      gsap.from('.fan-card', {
        opacity: 0,
        y: 100,
        rotationX: -90,
        rotationZ: -15,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      })

      // --- STRATEGY SECTION ANIMATIONS (ON SCROLL) ---
      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: '.strategy-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
      })

      gsap.from('.process-rail', {
        scrollTrigger: {
          trigger: '.strategy-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        width: 0,
        duration: 1.2,
        ease: 'power2.out',
      })

      gsap.from('.strategy-step', {
        scrollTrigger: {
          trigger: '.strategy-steps',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
      })

      gsap.from('.playbook-cta', {
        scrollTrigger: {
          trigger: '.strategy-footer',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      })

      // --- CREATORS SECTION ANIMATION (ON SCROLL) ---
      gsap.from('.creator-card', {
        scrollTrigger: {
          trigger: '.creators-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.7)',
      })
    }, main)

    return () => ctx.revert()
  }, [])

  const heroTitle = 'Bring In New Fans'

  return (
    <div
      ref={main}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] font-sans"
    >
      {/* =================================== */}
      {/* HERO SECTION */}
      {/* =================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 perspective-1000 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgb(var(--color-surface-1))] to-[rgb(var(--color-background-dark))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--color-primary-cyan),0.15)_0,_transparent_50%)]"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4">
            {heroTitle.split('').map((char, index) => (
              <span
                key={index}
                className="hero-title-char inline-block"
                style={{ whiteSpace: 'pre' }}
              >
                {char}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle text-lg md:text-xl max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))] mb-8">
            Use Vybzz Nations&apos; powerful tools and data-driven strategies to get your content in
            front of audiences ready to become your next biggest supporters.
          </p>
          <button className="hero-cta text-lg font-semibold text-white bg-gradient-to-r from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-primary-cyan))] px-8 py-4 rounded-full flex items-center gap-2 mx-auto transition-transform duration-300 hover:scale-105 shadow-lg shadow-[rgb(var(--color-primary-cyan)/0.4)]">
            <span>Get Started for Free</span>
            <FiArrowRight />
          </button>
        </div>
        <div className="absolute bottom-0 w-full h-1/3 transform-style-3d flex justify-center items-end gap-4">
          <FanCard
            name="Aarav"
            location="Mumbai"
            icon={<FiMusic />}
            className="fan-card rotate-[-10deg] translate-x-[-50%] mb-12"
          />
          <FanCard
            name="Priya"
            location="Delhi"
            icon={<FiFilm />}
            className="fan-card z-10 mb-20"
          />
          <FanCard
            name="Rohan"
            location="Bangalore"
            icon={<FiUsers />}
            className="fan-card rotate-[12deg] translate-x-[50%] mb-8"
          />
        </div>
      </section>

      {/* ================================================== */}
      {/* RICH PLAYBOOK / STRATEGY SECTION  (REPLACES: "The Vybzz Nations Method") */}
      {/* ================================================== */}
      <section className="strategy-section relative isolate py-20 lg:py-32 bg-[rgb(var(--color-surface-1))] overflow-hidden">
        {/* soft blobs */}
        <div className="pointer-events-none absolute z-0 -top-20 -left-24 w-[38rem] h-[38rem] rounded-full bg-[rgb(var(--color-primary-cyan)/0.10)] blur-3xl" />
        <div className="pointer-events-none absolute z-0 -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full bg-[rgb(var(--color-primary-blue)/0.10)] blur-3xl" />

        <div className="container mx-auto px-4 relative z-20">
          {/* Heading */}
          <div className="text-center mb-12 md:mb-16">
            <div className="w-28 h-[3px] bg-gradient-to-r from-transparent via-[rgb(var(--color-primary-cyan))] to-transparent mx-auto mb-5" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              The <span className="text-[rgb(var(--color-primary-cyan))]">Vybzz Nations</span>{' '}
              Playbook
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))] max-w-3xl mx-auto">
              A proven, multi-stage system that discovers your audience, amplifies your content, and
              converts attention into loyal fans.
            </p>
          </div>

          {/* KPI / Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <StatCard label="Avg. Audience Lift" value="+128%" />
            <StatCard label="CPM Reduction" value="-34%" />
            <StatCard label="Retention Uplift" value="+41%" />
            <StatCard label="Creators Served" value="12K+" />
          </div>

          {/* Process rail */}
          <div className="relative mb-12 md:mb-16">
            <div className="hidden md:block absolute left-0 right-0 top-9 h-[2px] process-rail bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] via-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-primary-cyan))] opacity-40" />
            <ol className="strategy-steps grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <StrategyStep
                step="01"
                icon={<FiTarget className="text-2xl" />}
                title="Audience Map"
                desc="Identify high-intent cohorts by interest, platform, and timing."
              />
              <StrategyStep
                step="02"
                icon={<FiBarChart2 className="text-2xl" />}
                title="Signal Scan"
                desc="Analyze watch-time, saves, and shares to locate breakout hooks."
              />
              <StrategyStep
                step="03"
                icon={<FiAtSign className="text-2xl" />}
                title="Channel Plan"
                desc="Pick the right surfaces—Reels, Shorts, Live, or Newsletter."
              />
              <StrategyStep
                step="04"
                icon={<FiUsers className="text-2xl" />}
                title="Creative System"
                desc="Batch-create variations; test thumbnails, intros, and CTAs."
              />
              <StrategyStep
                step="05"
                icon={<FiBarChart2 className="text-2xl" />}
                title="Boost & Learn"
                desc="Spark with smart spend; scale what outperforms baseline."
              />
              <StrategyStep
                step="06"
                icon={<FiUsers className="text-2xl" />}
                title="Own the Fan"
                desc="Convert to community: memberships, email, and gated drops."
              />
            </ol>
          </div>

          {/* Mini testimonial / proof strip */}
          <div className="rounded-2xl border border-white/10 bg-[rgb(var(--color-surface-2))/60] backdrop-blur-sm p-6 md:p-8 mb-10">
            <div className="grid md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3">
                <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  “We hit our first{' '}
                  <span className="text-[rgb(var(--color-primary-cyan))]">50K</span> followers in 6
                  weeks. The playbook didn’t just boost views — it built a community that buys.”
                </p>
                <p className="mt-3 text-sm text-[rgb(var(--color-text-muted))]">
                  — Ziya, Indie Producer
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <Badge title="+3.2x Watch-Time" />
                <Badge title="-27% CAC" />
                <Badge title="+19% AOV" />
                <Badge title="2.1x Repeat" />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="strategy-footer text-center">
            <button className="playbook-cta inline-flex items-center gap-2 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-primary-cyan))] px-7 md:px-9 py-3 md:py-4 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg shadow-[rgb(var(--color-primary-cyan)/0.35)]">
              Start My Growth Plan
              <FiArrowRight />
            </button>
            <p className="mt-3 text-sm text-[rgb(var(--color-text-muted))]">
              No credit card. Your first audit is free.
            </p>
          </div>
        </div>
      </section>

      {/* =================================== */}
      {/* FEATURED CREATORS SECTION */}
      {/* =================================== */}
      <section className="creators-section py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Join a Growing Community</h2>
            <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
              Creators on Vybzz Nations are expanding their fanbase every day.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            <CreatorCard
              imgSrc="https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              name="DJ Sonic"
              category="Music Producer"
              growth="+15K New Fans"
            />
            <CreatorCard
              imgSrc="https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              name="Anika Vlogs"
              category="Travel Vlogger"
              growth="+22K New Fans"
            />
            <CreatorCard
              imgSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              name="Rhythm Raj"
              category="Dancer & Choreographer"
              growth="+18K New Fans"
            />
            <CreatorCard
              imgSrc="https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              name="Pixel Pro"
              category="Gaming Streamer"
              growth="+30K New Fans"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper Components
const FanCard = ({ name, location, icon, className }) => (
  <div
    className={`w-40 h-24 bg-[rgb(var(--color-surface-2))] rounded-xl shadow-2xl p-4 flex flex-col justify-between transform-style-3d ${className}`}
  >
    <div className="flex justify-between items-center">
      <h4 className="font-bold text-sm">{name}</h4>
      <span className="text-[rgb(var(--color-primary-cyan))]">{icon}</span>
    </div>
    <p className="text-xs text-[rgb(var(--color-text-muted))]">{location}</p>
  </div>
)

const StatCard = ({ label, value }) => (
  <div className="stat-card rounded-xl border border-white/10 bg-[rgb(var(--color-surface-2))/60] backdrop-blur-sm p-5">
    <p className="text-sm text-[rgb(var(--color-text-muted))]">{label}</p>
    <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
  </div>
)

const StrategyStep = ({ step, icon, title, desc }) => (
  <li className="strategy-step">
    <div className="relative">
      {/* connector dot for desktop */}
      <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[rgb(var(--color-primary-cyan))] shadow-[0_0_0_6px_rgba(56,189,248,0.2)]" />
      <div className="rounded-2xl border border-white/10 bg-[rgb(var(--color-surface-2))/60] backdrop-blur-sm p-5 h-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(var(--color-primary-cyan)/0.12)] text-[rgb(var(--color-primary-cyan))] font-bold">
            {icon}
          </div>
          <span className="text-xs font-semibold tracking-widest text-[rgb(var(--color-text-muted))]">
            STEP {step}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">{desc}</p>
      </div>
    </div>
  </li>
)

const Badge = ({ title }) => (
  <div className="text-center rounded-lg border border-white/10 bg-[rgb(var(--color-surface-1))] px-3 py-2 text-sm">
    {title}
  </div>
)

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card relative z-10 bg-[rgb(var(--color-surface-2))]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:-translate-y-2 text-left min-h-[220px]">
    <div className="text-3xl text-[rgb(var(--color-primary-cyan))] mb-5">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-[rgb(var(--color-text-primary))]">{title}</h3>
    <p className="text-[rgb(var(--color-text-muted))] leading-relaxed">{description}</p>
  </div>
)

const CreatorCard = ({ imgSrc, name, category, growth }) => (
  <div className="creator-card group transform-style-3d transition-transform duration-500 ease-in-out hover:!opacity-100 hover:!scale-105">
    <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[rgb(var(--color-primary-cyan)/0.2)] transform group-hover:rotate-y-10">
      <img
        src={imgSrc}
        alt={name}
        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        height="320"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-[rgb(var(--color-text-secondary))]">{category}</p>
        <p className="mt-2 text-lg font-semibold text-[rgb(var(--color-primary-cyan))]">{growth}</p>
      </div>
    </div>
  </div>
)

export default BringInNewFans

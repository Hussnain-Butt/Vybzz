import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaUserFriends, FaMusic, FaBroadcastTower, FaStar } from 'react-icons/fa'

// GSAP plugin ko register karein
gsap.registerPlugin(ScrollTrigger)

const OtherMusicians = () => {
  const mainRef = useRef(null)

  useLayoutEffect(() => {
    // Reduced motion respect
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReduced) return

      // --- Hero Section Animation ---
      gsap.from('.hero-title', {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from('.hero-subtitle', {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      })
      // Button ko fromTo se animate kar rahe hain taa ke mount par clear state mile
      gsap.fromTo(
        '.hero-cta',
        { autoAlpha: 0, y: 50, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out',
          clearProps: 'transform',
        },
      )

      // --- Generic Section Animation ---
      const sections = gsap.utils.toArray('.animated-section')
      sections.forEach((section) => {
        gsap.from(section, {
          autoAlpha: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      })

      // --- Stats Section Animation ---
      const stats = gsap.utils.toArray('.stat-item')
      gsap.from(stats, {
        autoAlpha: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
      })

      // --- Feature Cards Animation ---
      const cards = gsap.utils.toArray('.feature-card')
      gsap.from(cards, {
        autoAlpha: 0,
        y: 50,
        scale: 0.95,
        stagger: 0.2,
        duration: 0.7,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 70%',
        },
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="bg-background-dark text-text-primary overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden bg-surface-1">
        {/* IMPORTANT: overlay par pointer-events-none taa ke button clickable/visible rahe */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="z-10 p-8">
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4">
            Discover Other Musicians on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-blue">
              Vybzz
            </span>
          </h1>
          <p className="hero-subtitle text-base md:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Connect, collaborate, and create with a universe of artists. Your next masterpiece is
            just a connection away.
          </p>
          <button
            className="hero-cta bg-primary-cyan text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-blue transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-cyan"
            type="button"
          >
            Start Exploring
          </button>
        </div>
      </section>

      {/* Section 2: Why Vybzz for Musicians? */}
      <section className="animated-section py-20 md:py-28 bg-background-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">A Symphony of Opportunities</h2>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto mb-16">
            Vybzz is more than a platform; it's an ecosystem designed for artists to thrive. We
            provide the tools, you bring the talent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 features-section">
            <div className="feature-card bg-surface-1 p-8 rounded-2xl shadow-lg border border-surface-2 transform transition-transform duration-300 hover:-translate-y-2">
              <FaUserFriends className="text-4xl text-accent-pink mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Collaborate Seamlessly</h3>
              <p className="text-text-muted">
                Find your perfect musical match. Filter by genre, skill, and location to build your
                dream band or project.
              </p>
            </div>
            <div className="feature-card bg-surface-1 p-8 rounded-2xl shadow-lg border border-surface-2 transform transition-transform duration-300 hover:-translate-y-2">
              <FaMusic className="text-4xl text-primary-blue mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Showcase Your Talent</h3>
              <p className="text-text-muted">
                Upload your tracks, share your demos, and create a stunning portfolio that gets you
                noticed by industry professionals.
              </p>
            </div>
            <div className="feature-card bg-surface-1 p-8 rounded-2xl shadow-lg border border-surface-2 transform transition-transform duration-300 hover:-translate-y-2">
              <FaBroadcastTower className="text-4xl text-accent-orange mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Get Discovered</h3>
              <p className="text-text-muted">
                Our algorithm connects you with labels, event organizers, and fans who are actively
                searching for new sounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Vybzz Community in Numbers */}
      <section className="animated-section stats-section py-20 md:py-28 bg-surface-1">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Join a Thriving Community</h2>
            <p className="text-lg text-text-secondary mt-2">
              Numbers that speak the language of music.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item bg-surface-2 p-8 rounded-lg">
              <p className="text-5xl font-bold text-primary-cyan">150K+</p>
              <p className="text-text-muted mt-2">Active Musicians</p>
            </div>
            <div className="stat-item bg-surface-2 p-8 rounded-lg">
              <p className="text-5xl font-bold text-primary-cyan">2M+</p>
              <p className="text-text-muted mt-2">Tracks Shared</p>
            </div>
            <div className="stat-item bg-surface-2 p-8 rounded-lg">
              <p className="text-5xl font-bold text-primary-cyan">50K+</p>
              <p className="text-text-muted mt-2">Collaborations Formed</p>
            </div>
            <div className="stat-item bg-surface-2 p-8 rounded-lg">
              <p className="text-5xl font-bold text-primary-cyan">98%</p>
              <p className="text-text-muted mt-2">Artist Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Success Stories */}
      <section className="animated-section py-20 md:py-28 bg-background-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            From Vybzz to the Main Stage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-8">
              <h3 className="text-3xl font-bold text-accent-pink mb-4">
                "Vybzz changed everything."
              </h3>
              <p className="text-text-secondary text-lg mb-6">
                "I was a solo bedroom producer for years. Through Vybzz, I met my lead vocalist and
                a drummer. A year later, we were signed and playing our first festival. It all
                started with a simple message on this platform."
              </p>
              <div className="flex items-center">
                <img
                  src="https://i.pravatar.cc/100?u=a"
                  alt="Alina Rose"
                  className="w-16 h-16 rounded-full mr-4 border-2 border-accent-pink"
                />
                <div>
                  <p className="font-bold text-xl">Alina Rose</p>
                  <p className="text-text-muted">Lead Singer, 'Crimson Bloom'</p>
                </div>
              </div>
            </div>
            <div
              className="p-8 rounded-lg h-80 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80')",
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Section 5: Call to Action */}
      <section className="animated-section py-20 md:py-32 bg-gradient-to-r from-primary-cyan to-primary-blue text-center">
        <div className="container mx-auto px-6">
          <FaStar className="text-5xl text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Amplify Your Sound?
          </h2>
          <p className="text-slate-100 text-lg max-w-2xl mx-auto mb-10">
            Create your free profile today and start connecting with the most vibrant community of
            musicians online. Your next big break is waiting.
          </p>
          <button className="bg-white text-primary-blue font-bold py-4 px-10 rounded-full text-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Sign Up and Make Some Noise
          </button>
        </div>
      </section>
    </div>
  )
}

export default OtherMusicians

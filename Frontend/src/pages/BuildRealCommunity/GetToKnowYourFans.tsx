import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaUsers,
  FaMapMarkedAlt,
  FaChartLine,
  FaHeart,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa'

// GSAP Plugin Register karna zaroori hai
gsap.registerPlugin(ScrollTrigger)

// --- Data for Cards ---

const fanInsights = [
  {
    icon: FaUsers,
    title: 'Audience Demographics',
    description:
      'Discover the age, gender, and key characteristics of your most engaged followers.',
    gradient: 'from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-primary-cyan))]',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Geographic Hotspots',
    description: 'Pinpoint the cities and countries where your fan base is growing the fastest.',
    gradient: 'from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))]',
  },
  {
    icon: FaChartLine,
    title: 'Engagement Patterns',
    description: 'Analyze when your fans are most active to optimize your content schedule.',
    gradient: 'from-[rgb(var(--color-primary-cyan))] to-sky-500',
  },
  {
    icon: FaHeart,
    title: 'Fan Affinity',
    description: 'Understand the other artists, brands, and interests that your audience loves.',
    gradient: 'from-[rgb(var(--color-accent-orange))] to-amber-500',
  },
]

const testimonials = [
  {
    name: 'Alex Rivera',
    title: 'Indie Musician',
    quote:
      "This platform is a game-changer. I finally understand who's listening and where. My last tour was a massive success because I targeted the right cities.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    name: 'Samantha Bee',
    title: 'Podcast Host',
    quote:
      'The engagement insights helped me triple my listener interaction. I now know exactly when to drop new episodes for maximum impact. Absolutely essential tool!',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
  },
  {
    name: 'David Chen',
    title: 'Content Creator',
    quote:
      "Understanding fan affinity opened up so many collaboration opportunities. I'm now partnering with brands my audience genuinely loves. It feels authentic and effective.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
  },
]

// --- Reusable Components ---

const InsightCard = ({ icon: Icon, title, description, gradient }) => {
  return (
    <div className="insight-card group perspective-1000">
      <div
        className="transform-style-3d relative flex h-full flex-col justify-between overflow-hidden
                   rounded-2xl bg-[rgb(var(--color-surface-1))] p-8 shadow-lg transition-transform duration-500 ease-in-out
                   group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[rgb(var(--color-primary-cyan))/0.1]
                   md:group-hover:rotate-y-10"
      >
        <div className="z-10">
          <div
            className={`mb-6 inline-block rounded-xl bg-gradient-to-br ${gradient} p-4 text-white`}
          >
            <Icon size={32} />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-[rgb(var(--color-text-primary))]">{title}</h3>
          <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">{description}</p>
        </div>
        <div
          className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${gradient}
                     opacity-5 blur-3xl transition-opacity duration-500 group-hover:opacity-10`}
        ></div>
      </div>
    </div>
  )
}

const TestimonialCard = ({ name, title, quote, avatar }) => {
  return (
    <div className="testimonial-card flex flex-col justify-between rounded-2xl bg-[rgb(var(--color-surface-1))] p-8 shadow-lg">
      <p className="mb-6 text-lg italic text-[rgb(var(--color-text-secondary))]">"{quote}"</p>
      <div className="flex items-center">
        <img
          src={avatar}
          alt={name}
          className="h-14 w-14 rounded-full border-2 border-[rgb(var(--color-primary-cyan))]"
        />
        <div className="ml-4">
          <p className="font-bold text-[rgb(var(--color-text-primary))]">{name}</p>
          <p className="text-sm text-[rgb(var(--color-accent-pink))]">{title}</p>
        </div>
      </div>
    </div>
  )
}

// --- Main Page Component ---

const FanInsightsLandingPage = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animation
      gsap.from('.hero-title', { opacity: 0, y: -50, duration: 1, ease: 'power3.out' })
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      })
      gsap.from('.hero-cta-button', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 0.6,
      })

      // Sections animation with ScrollTrigger
      const sections = gsap.utils.toArray('.animated-section')
      sections.forEach((section) => {
        // Animate section header
        gsap.from(section.querySelector('.section-header'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: -50,
          duration: 1,
          ease: 'power3.out',
        })

        // Animate cards inside section
        gsap.from(section.querySelectorAll('.insight-card, .testimonial-card'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full overflow-hidden bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))]"
    >
      {/* --- Hero Section --- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 h-full w-full bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="hero-title text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            From Data to{' '}
            <span className="bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))] bg-clip-text text-transparent">
              Devotion
            </span>
          </h1>
          <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-lg text-[rgb(var(--color-text-secondary))] md:text-xl">
            Stop guessing. Start connecting. Unlock powerful fan insights to build a loyal community
            that lasts a lifetime.
          </p>
          <div className="hero-cta-button mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#get-started"
              className="transform rounded-full bg-gradient-to-r from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-primary-cyan))] px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              Get Started for Free
            </a>
            <a
              href="#demo"
              className="transform rounded-full bg-transparent px-8 py-3 text-lg font-semibold text-[rgb(var(--color-text-secondary))] transition-transform hover:scale-105 hover:text-white"
            >
              Watch Demo →
            </a>
          </div>
        </div>
      </section>

      {/* --- Insights Grid Section --- */}
      <section id="insights" className="animated-section px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="section-header mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Dive Deeper Than Ever Before
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-[rgb(var(--color-text-secondary))]">
              Our platform transforms raw data into a clear picture of your audience, helping you
              make smarter decisions.
            </p>
          </header>
          <main>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {fanInsights.map((insight, index) => (
                <InsightCard key={index} {...insight} />
              ))}
            </div>
          </main>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section
        id="testimonials"
        className="animated-section bg-[rgb(var(--color-surface-1))] bg-opacity-50 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <header className="section-header mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Loved by Creators{' '}
              <span className="bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))] bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-[rgb(var(--color-text-secondary))]">
              Don't just take our word for it. See how creators like you are building stronger
              fanbases.
            </p>
          </header>
          <main>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </main>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section id="get-started" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Ready to Connect with Your True Fans?
          </h2>
          <p className="mx-auto mt-6 text-lg text-[rgb(var(--color-text-secondary))] md:text-xl">
            Join thousands of artists, podcasters, and creators who are turning listeners into loyal
            advocates.
          </p>
          <div className="mt-10">
            <a
              href="#signup"
              className="inline-block transform rounded-full bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))] px-10 py-4 text-xl font-bold text-white shadow-xl transition-transform hover:scale-105"
            >
              Sign Up Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FanInsightsLandingPage

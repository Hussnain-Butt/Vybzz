import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaArrowRight, FaPlay, FaMicrophone, FaUsers, FaChartLine } from 'react-icons/fa'
import Episode from '../../assets/Podcasters/2.jpg'

// GSAP Plugin Register karna zaroori hai
gsap.registerPlugin(ScrollTrigger)

// Podcasters ka Mock Data
const podcasters = [
  {
    name: 'Aisha Khan',
    topic: 'Tech & Future',
    img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Leo Rivera',
    topic: 'Mindful Living',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Zara Ahmed',
    topic: 'Global Stories',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Daniel Chen',
    topic: 'Creative Entrepreneurship',
    img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sofia Reyes',
    topic: 'Art & Design',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
  },
]

const CutThroughTheNoise = () => {
  const mainRef = useRef(null)

  useEffect(() => {
    // GSAP Context se saare animations ko manage karna best practice hai
    const ctx = gsap.context(() => {
      // --- 1. HERO SECTION ANIMATION ---
      const hero = mainRef.current.querySelector('.hero-section')
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .fromTo(
          hero.querySelectorAll('.hero-title-char'),
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        )
        .fromTo(
          hero.querySelector('.hero-subtitle'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.5',
        )
        .fromTo(
          hero.querySelector('.hero-button'),
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          '-=0.6',
        )

      // --- 2. SLIDER SECTION ANIMATION ---
      const slider = mainRef.current.querySelector('.slider-section')
      const sliderTrack = slider.querySelector('.slider-track')
      const horizontalScrollTween = gsap.to(sliderTrack, {
        x: () => -(sliderTrack.scrollWidth - slider.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: slider,
          start: 'top top',
          end: () => `+=${sliderTrack.scrollWidth - slider.clientWidth}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray('.podcaster-card').forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          x: -50,
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScrollTween,
            start: 'left 90%',
            toggleActions: 'play reverse play reverse',
          },
        })
      })

      // --- 3. "WHY VYBZZ NATION" SECTION ANIMATION ---
      const featuresSection = mainRef.current.querySelector('.features-section')
      gsap.from(featuresSection.querySelectorAll('.feature-card'), {
        scrollTrigger: {
          trigger: featuresSection,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
      })

      // --- 4. "OUR PROCESS" TIMELINE ANIMATION ---
      const processSection = mainRef.current.querySelector('.process-section')
      const steps = gsap.utils.toArray('.process-step')
      const timelineLine = processSection.querySelector('.timeline-line-progress')
      gsap.to(timelineLine, {
        height: '100%',
        scrollTrigger: {
          trigger: processSection,
          start: 'top 50%',
          end: 'bottom 80%',
          scrub: true,
        },
      })
      steps.forEach((step) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          },
          opacity: 0,
          x: -50,
          duration: 1,
          ease: 'power3.out',
        })
      })

      // --- 5. FEATURED EPISODE ANIMATION ---
      const featuredSection = mainRef.current.querySelector('.featured-section')
      gsap.from(featuredSection, {
        scrollTrigger: {
          trigger: featuredSection,
          start: 'top 80%',
        },
        opacity: 0,
        scale: 0.95,
        duration: 1,
      })

      // --- 6. CTA SECTION ANIMATION ---
      const ctaSection = mainRef.current.querySelector('.cta-section')
      gsap.from(ctaSection.querySelectorAll('.cta-content > *'), {
        scrollTrigger: {
          trigger: ctaSection,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        stagger: 0.3,
        duration: 1,
      })
    }, mainRef)

    return () => ctx.revert() // Cleanup
  }, [])

  const heroTitle = 'Voices That Resonate.'

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
      <section className="hero-section h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(var(--color-primary-cyan),0.1)] to-transparent opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(var(--color-primary-blue),0.15)] rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(var(--color-accent-pink),0.15)] rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="text-center z-10 px-4">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 hero-title"
            aria-label={heroTitle}
          >
            {heroTitle.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block hero-title-char"
                style={{ whiteSpace: 'pre', willChange: 'transform, opacity' }}
              >
                {char}
              </span>
            ))}
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-[rgb(var(--color-text-secondary))] mb-8 hero-subtitle"
            style={{ willChange: 'transform, opacity' }}
          >
            Welcome to{' '}
            <span className="font-bold text-[rgb(var(--color-primary-cyan))]">Vybzz Nation</span>.
            We cut through the noise to bring you the most influential podcasters of our time.
          </p>
          <button
            className="hero-button bg-[rgb(var(--color-primary-blue))] hover:bg-[rgba(var(--color-primary-blue),0.8)] transition-all duration-300 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg shadow-[rgba(var(--color-primary-blue),0.3)] flex items-center mx-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            Discover Creators <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* SECTION 2: PODCASTER SLIDER */}
      <section className="slider-section h-screen w-full relative overflow-hidden">
        <div
          className="h-full w-full flex flex-nowrap items-center slider-track"
          style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
        >
          <div className="flex-shrink-0 w-[40vw] h-[60vh] flex flex-col justify-center pr-16 podcaster-card">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Meet The <span className="text-[rgb(var(--color-accent-pink))]">Visionaries</span>
            </h2>
            <p className="text-lg text-[rgb(var(--color-text-secondary))] mt-4">
              A curated collection of talent from the Vybzz Nation family.
            </p>
          </div>
          {podcasters.map((p, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] h-[450px] mx-8 podcaster-card group"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden transition-transform duration-500 hover:scale-105">
                <img
                  src={p.img}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{p.name}</h3>
                  <p className="text-md text-[rgb(var(--color-text-secondary))]">{p.topic}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-[40vw] h-[60vh] flex flex-col justify-center items-center text-center pl-16 podcaster-card">
            <h2 className="text-5xl font-bold tracking-tight">
              Your <span className="text-[rgb(var(--color-primary-cyan))]">Voice</span> Awaits.
            </h2>
            <button className="mt-8 bg-transparent border-2 border-[rgb(var(--color-primary-cyan))] hover:bg-[rgb(var(--color-primary-cyan))] transition-all duration-300 text-white font-bold py-3 px-8 rounded-full text-lg">
              Join The Nation
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY VYBZZ NATION? */}
      <section className="features-section py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Why <span className="text-[rgb(var(--color-primary-cyan))]">Vybzz Nation</span>?
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto mb-16">
            We provide the tools, community, and platform to help you succeed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="feature-card bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-surface-3))] transform hover:-translate-y-2 transition-transform duration-300"
              style={{ willChange: 'transform, opacity' }}
            >
              <FaMicrophone className="text-4xl text-[rgb(var(--color-accent-pink))] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Amplify Your Voice</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Reach a global audience and grow your community with our state-of-the-art
                distribution platform.
              </p>
            </div>
            <div
              className="feature-card bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-surface-3))] transform hover:-translate-y-2 transition-transform duration-300"
              style={{ willChange: 'transform, opacity' }}
            >
              <FaUsers className="text-4xl text-[rgb(var(--color-accent-pink))] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Engage & Connect</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Connect with fellow creators and your listeners through exclusive events and forums.
              </p>
            </div>
            <div
              className="feature-card bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-surface-3))] transform hover:-translate-y-2 transition-transform duration-300"
              style={{ willChange: 'transform, opacity' }}
            >
              <FaChartLine className="text-4xl text-[rgb(var(--color-accent-pink))] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Powerful Analytics</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Understand your audience with in-depth analytics and insights to guide your content
                strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR PROCESS */}
      <section className="process-section py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            Your Journey Starts Here
          </h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="timeline-line absolute left-4 top-0 w-1 h-full bg-[rgb(var(--color-surface-3))] rounded-full"></div>
            <div
              className="timeline-line-progress absolute left-4 top-0 w-1 h-0 bg-[rgb(var(--color-primary-blue))] rounded-full"
              style={{ willChange: 'height' }}
            ></div>

            <div
              className="process-step relative pl-12 pb-16"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-primary-blue))]">
                <div className="w-3 h-3 bg-[rgb(var(--color-primary-blue))] rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-accent-pink))] mb-2">
                Step 1: Sign Up
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Create your Vybzz Nation account in minutes and set up your podcast profile.
              </p>
            </div>
            <div
              className="process-step relative pl-12 pb-16"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-primary-blue))]"></div>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-accent-pink))] mb-2">
                Step 2: Upload & Publish
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Easily upload your audio files, add show notes, and publish your first episode to
                the world.
              </p>
            </div>
            <div
              className="process-step relative pl-12"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(var(--color-surface-1))] border-2 border-[rgb(var(--color-primary-blue))]"></div>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-accent-pink))] mb-2">
                Step 3: Grow & Earn
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Utilize our growth tools and monetization features to turn your passion into a
                profession.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED EPISODE */}
      <section className="featured-section py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="bg-[rgb(var(--color-surface-2))] rounded-2xl p-8 md:p-12 lg:flex items-center gap-12 shadow-2xl border border-[rgb(var(--color-surface-3))]">
            <div className="lg:w-1/3 mb-8 lg:mb-0">
              <img
                src={Episode}
                alt="Featured Episode Art"
                className="rounded-xl w-full shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="lg:w-2/3">
              <p className="text-sm font-bold text-[rgb(var(--color-accent-pink))] mb-2">
                FEATURED EPISODE
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                The Art of Storytelling with Zara Ahmed
              </h2>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                In this captivating episode, Zara Ahmed breaks down the core principles of effective
                storytelling and shares her journey of finding stories in the most unexpected
                places.
              </p>
              <button className="bg-[rgb(var(--color-accent-pink))] hover:bg-[rgba(236,72,153,0.8)] transition-colors duration-300 text-white font-bold py-3 px-6 rounded-full text-lg flex items-center">
                <FaPlay className="mr-2" /> Listen Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA & FOOTER */}
      <section className="cta-section text-center py-20 lg:py-32 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto px-6 cta-content">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Make Some Noise?
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto mb-8">
            Join the fastest-growing community of podcasters and listeners. Your audience is
            waiting.
          </p>
          <button className="bg-[rgb(var(--color-primary-blue))] hover:bg-[rgba(var(--color-primary-blue),0.8)] transition-colors duration-300 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg shadow-[rgba(var(--color-primary-blue),0.3)]">
            Become a Vybzz Creator
          </button>
        </div>
      </section>
    </div>
  )
}

export default React.memo(CutThroughTheNoise)

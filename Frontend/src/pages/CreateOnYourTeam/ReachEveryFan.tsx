import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGlobe, FaBullhorn, FaChartLine, FaRegClock, FaRocket, FaUserCheck } from 'react-icons/fa'

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const ReachEveryFan = () => {
  const main = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO ANIMATION ---
      const heroTl = gsap.timeline()
      heroTl
        .from('.hero-title-word', {
          y: 100,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .from(
          '.hero-cta',
          { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.4',
        )

      // --- FEATURES SECTION ANIMATION ---
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.out',
      })

      // --- GLOBAL REACH SECTION ANIMATION ---
      gsap.from('.global-reach-content', {
        scrollTrigger: {
          trigger: '.global-reach-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      })
      gsap.from('.map-dot', {
        scrollTrigger: {
          trigger: '.global-reach-section',
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(2)',
      })

      // --- TIMELINE SECTION ANIMATION ---
      const timelineItems = gsap.utils.toArray('.timeline-item')
      timelineItems.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          x: item.classList.contains('timeline-left') ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      })

      // --- TESTIMONIALS SECTION ANIMATION ---
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        stagger: 0.25,
        duration: 0.8,
        ease: 'power3.out',
      })

      // --- CTA SECTION ANIMATION ---
      gsap.from('.cta-content > *', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'expo.out',
      })
    }, main) // <- Scope the animations to the main ref

    return () => ctx.revert() // <- Cleanup
  }, [])

  // Data for sections to keep JSX clean
  const features = [
    {
      icon: <FaBullhorn />,
      title: 'Unified Broadcast',
      description:
        'Publish your content across all social platforms with a single click. Save time, maximize reach.',
    },
    {
      icon: <FaChartLine />,
      title: 'Deep Fan Analytics',
      description:
        'Understand who your fans are, where they are, and what they love. Make data-driven decisions.',
    },
    {
      icon: <FaGlobe />,
      title: 'Global Content Delivery',
      description:
        'Our smart CDN ensures your content is delivered fast and reliably to fans, no matter their location.',
    },
  ]

  const testimonials = [
    {
      name: 'Alex "SynthWave" Chen',
      quote:
        'This platform changed the game. I spend more time creating and less time managing. My engagement has skyrocketed!',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
      name: 'Maria "PixelArt" Rodriguez',
      quote:
        'The analytics are insane! I finally understand my audience on a deeper level and can tailor my art to what they love most.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    },
  ]

  return (
    <div
      ref={main}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      {/* Section 1: Hero -- CORRECTED */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-[rgb(var(--color-primary-cyan))]/10 via-transparent to-[rgb(var(--color-accent-pink))]/10 rounded-full blur-3xl"></div>

        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black capitalize tracking-tight hero-title-word">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))]">
              Reach
            </span>
            <span> every fan.</span>
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black capitalize tracking-tight mt-2 md:mt-4 hero-title-word">
            <span>every </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))]">
              TIME.
            </span>
          </h1>
          <p className="hero-subtitle max-w-2xl mx-auto mt-8 text-lg md:text-xl text-[rgb(var(--color-text-secondary))]">
            The ultimate platform for creators to connect, engage, and grow their audience across
            the globe, without limits.
          </p>
          <button className="hero-cta mt-16 px-12 py-6 bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] text-white font-bold rounded-full shadow-lg shadow-[rgb(var(--color-primary-blue))]/30 transform hover:scale-105 transition-transform duration-300 text-2xl uppercase tracking-widest">
            Start Connecting Now
          </button>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="features-section py-20 md:py-32 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Your Fanbase, <span className="text-[rgb(var(--color-primary-cyan))]">Unified</span>.
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              We provide the tools you need to break through the noise and build a direct,
              meaningful relationship with every single fan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-[rgb(var(--color-surface-2))] p-8 rounded-xl border border-[rgb(var(--color-surface-3))] shadow-xl transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="text-4xl text-[rgb(var(--color-primary-cyan))] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[rgb(var(--color-text-muted))]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Global Reach */}
      <section className="global-reach-section py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="global-reach-content">
            <FaGlobe className="text-4xl text-[rgb(var(--color-accent-pink))] mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold">
              From Local Hero to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))]">
                Global Icon
              </span>
            </h2>
            <p className="mt-6 text-lg text-[rgb(var(--color-text-secondary))]">
              Geographical barriers are a thing of the past. Our platform is built to deliver your
              content to fans in any corner of the world, ensuring a seamless experience for
              everyone, everywhere.
            </p>
          </div>
          <div className="relative w-full max-w-2xl mx-auto lg:mx-0 min-h-[200px]">
            <svg
              viewBox="0 0 400 200"
              className="w-full h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <path
                d="M 20 100 C 100 20, 300 20, 380 100"
                fill="none"
                stroke="rgb(var(--color-surface-3))"
                strokeWidth="1"
              />
              <path
                d="M 20 100 C 100 180, 300 180, 380 100"
                fill="none"
                stroke="rgb(var(--color-surface-3))"
                strokeWidth="1"
              />
              <circle
                className="map-dot"
                cx="50"
                cy="78"
                r="5"
                fill="rgb(var(--color-primary-blue))"
              />
              <circle
                className="map-dot"
                cx="155"
                cy="35"
                r="5"
                fill="rgb(var(--color-accent-pink))"
              />
              <circle
                className="map-dot"
                cx="340"
                cy="55"
                r="5"
                fill="rgb(var(--color-text-primary))"
              />
              <circle
                className="map-dot"
                cx="80"
                cy="140"
                r="5"
                fill="rgb(var(--color-text-secondary))"
              />
              <circle
                className="map-dot"
                cx="350"
                cy="90"
                r="5"
                fill="rgb(var(--color-primary-cyan))"
              />
              <circle
                className="map-dot"
                cx="250"
                cy="155"
                r="5"
                fill="rgb(var(--color-primary-blue))"
              />
              <circle
                className="map-dot"
                cx="200"
                cy="100"
                r="7"
                fill="rgb(var(--color-accent-orange))"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Section 4: Automated Timeline */}
      <section className="py-20 md:py-32 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold">
              Connect on Their Time,{' '}
              <span className="text-[rgb(var(--color-primary-blue))]">Every Time</span>.
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              Automate your outreach and schedule content for peak engagement hours across different
              time zones. Never miss an opportunity to connect.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-[rgb(var(--color-surface-3))] hidden md:block"></div>
            <div className="space-y-12 md:space-y-0">
              <div className="timeline-item timeline-left md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="md:text-right">
                  <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-lg border border-[rgb(var(--color-surface-3))]">
                    <div className="flex items-center gap-3 text-2xl text-[rgb(var(--color-primary-cyan))] mb-2">
                      <FaRegClock />
                    </div>
                    <h3 className="text-xl font-bold">Smart Scheduling</h3>
                    <p className="text-[rgb(var(--color-text-muted))] mt-1">
                      AI-powered suggestions for the best time to post for each platform and region.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
              </div>
              <div className="timeline-item timeline-right md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="hidden md:block"></div>
                <div>
                  <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-lg border border-[rgb(var(--color-surface-3))]">
                    <div className="flex items-center gap-3 text-2xl text-[rgb(var(--color-accent-pink))] mb-2">
                      <FaRocket />
                    </div>
                    <h3 className="text-xl font-bold">Automated Campaigns</h3>
                    <p className="text-[rgb(var(--color-text-muted))] mt-1">
                      Set up multi-step campaigns for new releases that run automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="timeline-item timeline-left md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="md:text-right">
                  <div className="p-6 bg-[rgb(var(--color-surface-2))] rounded-lg border border-[rgb(var(--color-surface-3))]">
                    <div className="flex items-center gap-3 text-2xl text-[rgb(var(--color-primary-blue))] mb-2">
                      <FaUserCheck />
                    </div>
                    <h3 className="text-xl font-bold">Personalized Engagement</h3>
                    <p className="text-[rgb(var(--color-text-muted))] mt-1">
                      Automatically welcome new followers or thank top fans to build loyalty.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section className="testimonials-section py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Trusted by{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))]">
                Creators Like You
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card bg-[rgb(var(--color-surface-2))] p-8 rounded-xl border border-[rgb(var(--color-surface-3))]"
              >
                <p className="text-lg text-[rgb(var(--color-text-secondary))] italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Call to Action */}
      <section className="cta-section py-20 md:py-32 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto px-6 text-center">
          <div className="cta-content">
            <h2 className="text-4xl md:text-6xl font-black">Ready to Connect With Your World?</h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              Stop juggling platforms and start building your legacy. Join thousands of creators who
              are reaching every fan, every time.
            </p>
            <button className="mt-10 px-10 py-5 bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))] text-white font-bold rounded-full text-xl shadow-lg shadow-[rgb(var(--color-accent-pink))]/20 transform hover:scale-105 transition-transform duration-300">
              Claim Your Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ReachEveryFan

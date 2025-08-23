import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaUsers,
  FaCalendarAlt,
  FaComments,
  FaStar,
  FaUserPlus,
  FaSignInAlt,
  FaRocket,
  FaQuoteLeft,
} from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const MoreWayToStayClose = () => {
  const pageRef = useRef(null)

  useEffect(() => {
    // Split the main heading into words for individual animation
    const mainHeadingWords = document.querySelectorAll('.main-heading-word')
    const subHeading = document.querySelector('.sub-heading')

    const ctx = gsap.context(() => {
      // Animate the hero section text
      gsap.from(mainHeadingWords, {
        duration: 1.2,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2,
      })

      gsap.from(subHeading, {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.8,
      })

      // Animate each major section on scroll
      const sections = gsap.utils.toArray('.content-section')
      sections.forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%', // Start animation a bit earlier
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 60,
          duration: 1.2,
          ease: 'power3.out',
        })
      })

      // Staggered animation for the feature cards
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })

      // Staggered animation for "How it works" steps
      gsap.from('.how-it-works-step', {
        scrollTrigger: {
          trigger: '.how-it-works-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.25,
        ease: 'back.out(1.7)',
      })

      // Staggered animation for Testimonial cards
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })
    }, pageRef)

    return () => ctx.revert() // Cleanup GSAP animations on component unmount
  }, [])

  // --- Data for the component sections ---

  const features = [
    {
      icon: <FaUsers className="text-4xl md:text-5xl text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Exclusive Community Hub',
      description:
        'Join our private community forums and discussion groups. Connect with fellow Vybzz fans and share behind-the-scenes content.',
    },
    {
      icon: (
        <FaCalendarAlt className="text-4xl md:text-5xl text-[rgb(var(--color-primary-blue))]" />
      ),
      title: 'Interactive Live Events',
      description:
        'Join exclusive live streams, Q&A sessions, and virtual meet-and-greets. Interact with your favorite creators in real time.',
    },
    {
      icon: <FaComments className="text-4xl md:text-5xl text-[rgb(var(--color-accent-pink))]" />,
      title: 'Direct Messaging & AMAs',
      description:
        "Send direct messages to creators and get answers in 'Ask Me Anything' (AMA) sessions. Get even closer to them.",
    },
    {
      icon: <FaStar className="text-4xl md:text-5xl text-[rgb(var(--color-accent-orange))]" />,
      title: 'Get Loyalty Rewards',
      description:
        'Earn points and rewards for being a loyal fan. Your support matters at Vybzz Nations—and we recognize it.',
    },
  ]

  const howItWorksSteps = [
    {
      icon: <FaSignInAlt />,
      title: 'Sign Up & Join',
      description:
        'Create your account on Vybzz Nations and join the nation of your favorite creator.',
    },
    {
      icon: <FaUserPlus />,
      title: 'Choose Your Tier',
      description:
        'Pick a membership tier that fits your budget and preferences to unlock exclusive benefits.',
    },
    {
      icon: <FaRocket />,
      title: 'Engage & Enjoy',
      description:
        'Connect with the community, join events, and enjoy getting closer to your creator.',
    },
  ]

  const testimonials = [
    {
      quote:
        'Vybzz Nations gave me a way to connect with my favorite gamer. The live streams and community events are amazing!',
      name: 'Rohan Sharma',
      handle: '@GamerProRohan',
      avatar: 'RS',
    },
    {
      quote:
        'Getting access to an artist’s exclusive content has never been this easy. I look forward to new tutorials every month.',
      name: 'Priya Singh',
      handle: '@ArtisticPriya',
      avatar: 'PS',
    },
    {
      quote:
        "The community is so positive and engaging. It's not just about the creator—it's about the amazing fans you meet.",
      name: 'Aakash Verma',
      handle: '@TechieAakash',
      avatar: 'AV',
    },
  ]

  return (
    <div
      ref={pageRef}
      className="min-h-screen text-[rgb(var(--color-text-primary))] p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden"
      style={{ background: 'rgb(var(--color-background-dark))' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* --- Enhanced Hero Section --- */}
        <header className="relative text-center mb-20 md:mb-32 pt-16 md:pt-24 pb-16 md:pb-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(var(--color-primary-cyan),0.1)_0%,_rgba(var(--color-background-dark),0)_60%)]"></div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            {'More Ways To'.split(' ').map((word, i) => (
              <span key={i} className="main-heading-word inline-block mr-3">
                {word}
              </span>
            ))}
            <br />
            <span className="main-heading-word inline-block bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))]">
              Stay Close
            </span>
          </h1>
          <p className="sub-heading text-lg md:text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
            Vybzz Nations gives you unique ways to connect with your favorite creators on a deeper
            level. Not just content—an experience.
          </p>
        </header>

        {/* --- Features Grid Section --- */}
        <main className="features-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24 md:mb-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-[rgb(var(--color-surface-1))] p-6 md:p-8 rounded-2xl shadow-lg transition-transform duration-300 transform-style-3d perspective-1000 group hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.15)]"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="p-4 bg-[rgb(var(--color-surface-2))] rounded-xl">
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* --- NEW SECTION: How It Works --- */}
        <section className="content-section text-center mb-24 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in Three Easy Steps</h2>
          <p className="text-lg text-[rgb(var(--color-text-muted))] mb-16 max-w-2xl mx-auto">
            Joining the community is quick and simple. Just follow these steps.
          </p>
          <div className="how-it-works-container relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {/* Dashed line for desktop view */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-12">
              <svg width="100%" height="2px">
                <line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="stroke-[rgb(var(--color-surface-3))]"
                />
              </svg>
            </div>

            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="how-it-works-step relative z-10 flex flex-col items-center"
              >
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[rgb(var(--color-surface-2))] to-[rgb(var(--color-surface-1))] text-[rgb(var(--color-primary-cyan))] text-4xl rounded-full border-2 border-[rgb(var(--color-surface-3))] mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[rgb(var(--color-text-secondary))] max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- NEW SECTION: Testimonials --- */}
        <section className="content-section mb-24 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Voices of the <span className="text-[rgb(var(--color-primary-blue))]">Nation</span>
            </h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))] max-w-2xl mx-auto">
              Hear what our community members are saying.
            </p>
          </div>
          <div className="testimonials-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card bg-[rgb(var(--color-surface-2))] p-8 rounded-xl flex flex-col"
              >
                <FaQuoteLeft className="text-3xl text-[rgb(var(--color-surface-3))] mb-4" />
                <p className="text-[rgb(var(--color-text-secondary))] italic flex-grow mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))] flex items-center justify-center font-bold text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[rgb(var(--color-text-primary))]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Enhanced Call to Action Section --- */}
        <section className="content-section relative text-center mt-24 py-16 px-6 bg-[rgb(var(--color-surface-1))] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(var(--color-primary-blue),0.15)_0%,_rgba(var(--color-surface-1),0)_50%)]"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Dive Deeper?</h2>
          <p className="text-lg text-[rgb(var(--color-text-muted))] mb-8 max-w-2xl mx-auto">
            Become a part of the Vybzz Nations community and unlock exclusive benefits today.
          </p>
          <button className="bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-[rgb(var(--color-primary-cyan)/0.3)] focus:outline-none focus:ring-4 focus:ring-[rgb(var(--color-primary-cyan)/0.5)]">
            Join The Nation
          </button>
        </section>
      </div>
    </div>
  )
}

export default MoreWayToStayClose

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaRocket,
  FaWrench,
  FaBullhorn,
  FaGift,
  FaRegLightbulb,
  FaArrowRight,
} from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const Updates = () => {
  const componentRef = useRef(null)

  // --- Data for the page ---
  const updatesData = [
    {
      date: 'August 15, 2025',
      category: 'New Feature',
      icon: <FaRocket />,
      color: 'bg-blue-500/10 text-[rgb(var(--color-primary-blue))]',
      title: 'Introducing: The Vybzz Commerce Hub!',
      description:
        "We're excited to launch our biggest feature yet! Creators can now build personalized storefronts, create affiliate links, and sell their own merchandise directly from the Vybzz Nations platform. Monetize your influence like never before.",
      link: '/commerce',
    },
    {
      date: 'August 02, 2025',
      category: 'Improvement',
      icon: <FaWrench />,
      color: 'bg-green-500/10 text-green-400',
      title: 'Upgraded Analytics Dashboard & Reporting',
      description:
        'Our analytics dashboard has been completely revamped. Enjoy a faster interface, deeper insights, new data visualizations, and the ability to export custom PDF reports to share with brands.',
      link: '#',
    },
    {
      date: 'July 21, 2025',
      category: 'Announcement',
      icon: <FaBullhorn />,
      color: 'bg-purple-500/10 text-purple-400',
      title: 'New Partnership with Global Tech Inc.',
      description:
        'Vybzz Nations is proud to announce a strategic partnership with Global Tech Inc. This will bring exclusive, high-budget campaigns from their portfolio of world-class brands to our Pro creators.',
      link: '#',
    },
    {
      date: 'July 05, 2025',
      category: 'Improvement',
      icon: <FaWrench />,
      color: 'bg-green-500/10 text-green-400',
      title: 'Faster Payouts with Stripe & PayPal',
      description:
        "We've optimized our payment infrastructure. Creator payouts are now processed up to 48 hours faster, ensuring you get your earnings quicker than ever.",
      link: '/payments',
    },
    {
      date: 'June 18, 2025',
      category: 'New Feature',
      icon: <FaGift />,
      color: 'bg-blue-500/10 text-[rgb(var(--color-primary-blue))]',
      title: 'Creator Gifting Feature is Now Live',
      description:
        'Brands can now send product gifts directly through the platform, streamlining the process for gifted collaborations. Manage your shipping information securely in your new profile settings.',
      link: '#',
    },
  ]

  const upcomingFeatures = [
    {
      title: 'Mobile App (iOS & Android)',
      description: 'Manage your campaigns and earnings on the go.',
    },
    {
      title: 'Advanced Content Scheduling Tools',
      description: 'Plan and schedule your collaboration posts across platforms.',
    },
    {
      title: 'AI-Powered Campaign Matching',
      description: 'Get instantly matched with brands that perfectly fit your audience.',
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const animateUp = (selector, trigger, stagger = 0.15) => {
        gsap.fromTo(
          selector,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger,
            scrollTrigger: { trigger: trigger || selector, start: 'top 85%' },
          },
        )
      }

      animateUp('.hero-content', null, 0.2)

      const timelineItems = document.querySelectorAll('.timeline-item')
      timelineItems.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%' },
          },
        )
      })

      animateUp('.section-header')
      animateUp('.upcoming-card', '.upcoming-section')
      animateUp('.final-cta', '.final-cta-section')
    }, componentRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={componentRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-28 text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0 bg-grid-slate-900 [mask-image:radial-gradient(ellipse_at_center,white_5%,transparent_60%)]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="hero-content text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
            What's New at Vybzz Nations
          </h1>
          <p className="hero-content mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))]">
            We're constantly shipping updates and improvements. Follow along with our progress and
            see what's new on the platform.
          </p>
        </div>
      </section>

      {/* Updates Timeline Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* The vertical timeline bar */}
            <div className="absolute left-6 sm:left-8 top-1 bottom-1 w-0.5 bg-[rgb(var(--color-surface-2))]"></div>

            {updatesData.map((update, index) => (
              <div key={index} className="timeline-item relative pl-16 sm:pl-20 mb-12">
                {/* The icon on the timeline */}
                <div className="absolute left-6 sm:left-8 top-1 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-[rgb(var(--color-surface-1))] rounded-full border-2 border-[rgb(var(--color-surface-2))]">
                  <span className={`text-lg ${update.color.split(' ')[1]}`}>{update.icon}</span>
                </div>

                <div className="bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))]">
                  <p className="text-sm text-[rgb(var(--color-text-muted))] mb-2">{update.date}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${update.color}`}
                    >
                      {update.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold">{update.title}</h2>
                  </div>
                  <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                    {update.description}
                  </p>
                  <a
                    href={update.link}
                    className="inline-flex items-center gap-2 font-semibold text-[rgb(var(--color-primary-cyan))] hover:underline"
                  >
                    Learn More <FaArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-[rgb(var(--color-surface-2))] font-semibold rounded-full hover:bg-[rgb(var(--color-surface-3))] transition-colors">
              Load More Updates
            </button>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="upcoming-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--color-surface-1))]">
        <div className="max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">On The Horizon</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              We're hard at work building the future of the creator economy. Here's a sneak peek at
              what we're cooking up next.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={index}
                className="upcoming-card bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl"
              >
                <FaRegLightbulb className="text-3xl text-[rgb(var(--color-accent-orange))] mb-4" />
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-[rgb(var(--color-text-muted))] mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section py-20 px-4">
        <div className="final-cta max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Never Miss an Update</h2>
          <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Subscribe to our newsletter to be the first to know about new features, improvements,
            and platform announcements.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-5 py-3 bg-[rgb(var(--color-surface-1))] border border-[rgb(var(--color-surface-2))] rounded-full focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))] focus:border-[rgb(var(--color-primary-cyan))] outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full transition-transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Updates

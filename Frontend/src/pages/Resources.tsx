import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaBookOpen,
  FaPlayCircle,
  FaRocket,
  FaBullhorn,
  FaSearch,
  FaArrowRight,
  FaCalendarAlt,
} from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const Resources = () => {
  const componentRef = useRef(null)

  // --- Data for the page ---
  const featuredArticles = [
    {
      category: 'Creator Growth',
      title: '10 Proven Strategies to Grow Your Audience in 2025',
      description:
        'Learn actionable tips from top creators on how to expand your reach and build a loyal community.',
      image:
        'bg-gradient-to-br from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))]',
      color: 'text-[rgb(var(--color-primary-cyan))]',
    },
    {
      category: 'Monetization',
      title: 'Beyond Sponsorships: Diversifying Your Income Streams',
      description:
        'Explore how to leverage affiliate marketing, digital products, and our Commerce Hub to maximize your earnings.',
      image:
        'bg-gradient-to-br from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))]',
      color: 'text-[rgb(var(--color-accent-pink))]',
    },
    {
      category: 'Brand Collaboration',
      title: 'How to Pitch Brands and Negotiate Like a Pro',
      description:
        'A step-by-step guide to crafting the perfect pitch, understanding contracts, and getting the rates you deserve.',
      image: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      color: 'text-purple-400',
    },
    {
      category: 'Platform Guide',
      title: 'Mastering the Vybzz Nations Analytics Dashboard',
      description:
        'Unlock the full potential of your data. Learn what metrics to track and how to turn insights into action.',
      image: 'bg-gradient-to-br from-emerald-500 to-green-600',
      color: 'text-emerald-400',
    },
    {
      category: 'Content Strategy',
      title: 'The Ultimate Guide to Creating Viral Short-Form Video',
      description:
        'Discover the secrets behind engaging Reels, TikToks, and Shorts that capture attention and drive results.',
      image: 'bg-gradient-to-br from-rose-500 to-red-600',
      color: 'text-rose-400',
    },
    {
      category: 'Productivity',
      title: 'How Top Creators Plan Their Content (and Avoid Burnout)',
      description:
        'Learn about the best tools, workflows, and mindset shifts for staying consistent and creative.',
      image: 'bg-gradient-to-br from-sky-500 to-cyan-600',
      color: 'text-sky-400',
    },
  ]

  const resourceTypes = [
    { icon: <FaBookOpen />, title: 'Guides & Articles' },
    { icon: <FaPlayCircle />, title: 'Video Tutorials' },
    { icon: <FaRocket />, title: 'Case Studies' },
    { icon: <FaBullhorn />, title: 'Webinars' },
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
      animateUp('.search-bar', null, 0)

      animateUp('.section-header')
      animateUp('.resource-type-card', '.resource-types')
      animateUp('.article-card', '.articles-grid')
      animateUp('.webinar-card', '.webinars-section')
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
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0 bg-grid-slate-900 [mask-image:radial-gradient(ellipse_at_center,white_5%,transparent_60%)]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="hero-content text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
            Your Growth Toolkit
          </h1>
          <p className="hero-content mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))]">
            Explore expert articles, in-depth guides, and tutorials designed to help you succeed as
            a creator on Vybzz Nations and beyond.
          </p>
          <div className="search-bar relative mt-12 max-w-2xl mx-auto">
            <FaSearch className="absolute top-1/2 left-6 -translate-y-1/2 text-[rgb(var(--color-text-muted))]" />
            <input
              type="text"
              placeholder="Search for articles, guides, and more..."
              className="w-full pl-14 pr-4 py-4 bg-[rgb(var(--color-surface-1))] border border-[rgb(var(--color-surface-2))] rounded-full focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))] focus:border-[rgb(var(--color-primary-cyan))] outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Resource Types Section */}
      <section className="resource-types py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {resourceTypes.map((type, index) => (
            <div
              key={index}
              className="resource-type-card flex items-center gap-4 p-6 bg-[rgb(var(--color-surface-1))] rounded-xl border border-[rgb(var(--color-surface-2))] transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(var(--color-primary-cyan))]"
            >
              <div className="text-3xl text-[rgb(var(--color-primary-cyan))]">{type.icon}</div>
              <span className="text-lg font-semibold">{type.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--color-surface-1))]">
        <div className="max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Featured Insights</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              Hand-picked articles from our team to help you navigate the creator economy.
            </p>
          </div>
          <div className="articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div
                key={index}
                className="article-card flex flex-col bg-[rgb(var(--color-surface-2))] rounded-2xl overflow-hidden group transition-transform duration-300 hover:-translate-y-2"
              >
                <div className={`h-40 w-full ${article.image}`}></div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className={`text-sm font-bold mb-2 ${article.color}`}>{article.category}</p>
                  <h3 className="text-xl font-bold mb-3 flex-grow">{article.title}</h3>
                  <p className="text-sm text-[rgb(var(--color-text-muted))] mb-4">
                    {article.description}
                  </p>
                  <a
                    href="#"
                    className="flex items-center gap-2 font-semibold text-[rgb(var(--color-primary-cyan))] group-hover:gap-3 transition-all"
                  >
                    Read More <FaArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="webinars-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
              Upcoming Live Events
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              Join our live webinars to learn from industry experts and get your questions answered
              in real-time.
            </p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Webinar Card 1 */}
            <div className="webinar-card flex flex-col sm:flex-row items-center gap-6 p-6 bg-[rgb(var(--color-surface-1))] rounded-xl border border-[rgb(var(--color-surface-2))]">
              <div className="flex-shrink-0 text-center">
                <p className="text-lg font-bold text-[rgb(var(--color-accent-orange))]">AUG</p>
                <p className="text-4xl font-extrabold">28</p>
              </div>
              <div className="border-l-2 border-[rgb(var(--color-surface-2))] h-16 hidden sm:block"></div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-bold">
                  Live Q&A: Secrets of Successful Brand Partnerships
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                  With special guest, industry veteran Sarah Chen.
                </p>
              </div>
              <a
                href="#"
                className="flex-shrink-0 inline-block px-6 py-3 bg-[rgb(var(--color-accent-orange))] text-white font-bold rounded-full transition-transform hover:scale-105"
              >
                Register Now
              </a>
            </div>
            {/* Webinar Card 2 */}
            <div className="webinar-card flex flex-col sm:flex-row items-center gap-6 p-6 bg-[rgb(var(--color-surface-1))] rounded-xl border border-[rgb(var(--color-surface-2))]">
              <div className="flex-shrink-0 text-center">
                <p className="text-lg font-bold text-[rgb(var(--color-primary-cyan))]">SEP</p>
                <p className="text-4xl font-extrabold">12</p>
              </div>
              <div className="border-l-2 border-[rgb(var(--color-surface-2))] h-16 hidden sm:block"></div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-bold">
                  Workshop: Turning Your Audience into a Business
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                  A deep dive into the Vybzz Nations Commerce Hub.
                </p>
              </div>
              <a
                href="#"
                className="flex-shrink-0 inline-block px-6 py-3 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full transition-transform hover:scale-105"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section py-20 px-4">
        <div className="final-cta max-w-4xl mx-auto text-center bg-[rgb(var(--color-surface-1))] p-10 sm:p-16 rounded-3xl border border-[rgb(var(--color-surface-2))]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Become a Vybzz Nations Insider
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest creator news, platform updates, and
            exclusive resources delivered straight to your inbox.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-5 py-3 bg-[rgb(var(--color-surface-2))] border border-[rgb(var(--color-surface-3))] rounded-full focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))] focus:border-[rgb(var(--color-primary-cyan))] outline-none"
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

export default Resources

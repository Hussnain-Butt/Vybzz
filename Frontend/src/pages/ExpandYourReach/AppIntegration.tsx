import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiZap, FiGrid, FiBarChart2, FiLock } from 'react-icons/fi'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// --- Dummy Data for Integrations ---
// Replace with your actual integration logos
const integrations = [
  { name: 'Slack', logo: 'SL' },
  { name: 'Google Drive', logo: 'GD' },
  { name: 'Trello', logo: 'TR' },
  { name: 'Jira', logo: 'JI' },
  { name: 'GitHub', logo: 'GH' },
  { name: 'Asana', logo: 'AS' },
  { name: 'Mailchimp', logo: 'MC' },
  { name: 'Salesforce', logo: 'SF' },
  { name: 'Zapier', logo: 'ZP' },
  { name: 'Notion', logo: 'NT' },
  { name: 'Figma', logo: 'FG' },
  { name: 'HubSpot', logo: 'HS' },
]

const AppIntegration = () => {
  const mainRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Hero Animation ---
      gsap.fromTo(
        '.hero-element',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        },
      )

      // --- Benefits Section Animation ---
      gsap.fromTo(
        '.benefit-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.benefits-section',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      )

      // --- Integration Grid Animation ---
      gsap.fromTo(
        '.integration-logo',
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.integration-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      )

      // --- CTA Animation ---
      gsap.fromTo(
        '.cta-element',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, mainRef)

    // Cleanup function
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={mainRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-hidden"
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 relative perspective-1000">
        <div className="absolute inset-0 bg-grid-slate-900 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-background-dark))] via-[rgb(var(--color-background-dark)/0.9)] to-transparent"></div>
        <div className="z-10 max-w-4xl mx-auto">
          <h1 className="hero-element text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--color-text-primary))] to-[rgb(var(--color-text-muted))]">
            App Integrations
          </h1>
          <p className="hero-element mt-6 text-lg md:text-xl text-[rgb(var(--color-text-secondary))]">
            Seamlessly connect Vybzz Nations with the tools you already love. Streamline your
            workflow, centralize your data, and unlock new levels of productivity.
          </p>
          <div className="hero-element mt-10">
            <a
              href="#integrations"
              className="px-8 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Explore Integrations
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text-primary))]">
            Why Integrate with Vybzz?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))]">
            Our powerful integration ecosystem is designed to make your life easier and your work
            more efficient.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit Card 1 */}
            <div className="benefit-card bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))] transform-style-3d transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.1)]">
              <FiZap className="text-4xl text-[rgb(var(--color-primary-cyan))]" />
              <h3 className="mt-6 text-xl font-semibold">Streamline Workflow</h3>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                Automate tasks between Vybzz and your favorite apps to eliminate repetitive work and
                save time.
              </p>
            </div>
            {/* Benefit Card 2 */}
            <div className="benefit-card bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))] transform-style-3d transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-blue)/0.1)]">
              <FiGrid className="text-4xl text-[rgb(var(--color-primary-blue))]" />
              <h3 className="mt-6 text-xl font-semibold">Centralize Data</h3>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                Keep all your important information in one place by syncing data across platforms in
                real-time.
              </p>
            </div>
            {/* Benefit Card 3 */}
            <div className="benefit-card bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))] transform-style-3d transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(var(--color-accent-pink)/0.1)]">
              <FiBarChart2 className="text-4xl text-[rgb(var(--color-accent-pink))]" />
              <h3 className="mt-6 text-xl font-semibold">Boost Productivity</h3>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                Reduce context switching and stay focused by accessing key features from other apps
                within Vybzz.
              </p>
            </div>
            {/* Benefit Card 4 */}
            <div className="benefit-card bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))] transform-style-3d transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(var(--color-accent-orange)/0.1)]">
              <FiLock className="text-4xl text-[rgb(var(--color-accent-orange))]" />
              <h3 className="mt-6 text-xl font-semibold">Secure & Reliable</h3>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                Our integrations are built with enterprise-grade security to ensure your data is
                always safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Grid Section */}
      <section
        id="integrations"
        className="py-20 md:py-32 px-4 bg-[rgb(var(--color-surface-1)/0.5)]"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text-primary))]">
            Connect With Your Favorite Tools
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[rgb(var(--color-text-secondary))]">
            From project management to communication, Vybzz Nations connects to hundreds of apps.
          </p>
          <div className="integration-grid mt-16 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-8">
            {integrations.map((app) => (
              <div
                key={app.name}
                className="integration-logo group aspect-square flex flex-col items-center justify-center bg-[rgb(var(--color-surface-2))] p-4 rounded-2xl border border-transparent hover:border-[rgb(var(--color-primary-cyan))] transition-all duration-300 cursor-pointer"
              >
                {/* Replace this div with an <img> tag for real logos */}
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[rgb(var(--color-surface-3))] rounded-full text-xl md:text-2xl font-bold text-[rgb(var(--color-primary-cyan))] group-hover:scale-110 transition-transform duration-300">
                  {app.logo}
                </div>
                <span className="mt-3 text-xs md:text-sm font-medium text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-text-primary))] transition-colors duration-300">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 md:py-32 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="cta-element text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-accent-pink))] to-[rgb(var(--color-accent-orange))]">
            Ready to build your own?
          </h2>
          <p className="cta-element mt-5 text-lg text-[rgb(var(--color-text-secondary))]">
            Our robust and well-documented API makes it easy for developers to build custom
            integrations. Extend Vybzz Nations to fit your unique needs.
          </p>
          <div className="cta-element mt-10">
            <a
              href="/developers" // Link to your developer/API page
              className="px-8 py-4 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-primary))] font-semibold rounded-full text-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors duration-300"
            >
              Explore Developer API
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AppIntegration

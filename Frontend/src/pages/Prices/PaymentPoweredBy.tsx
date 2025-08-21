import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaStripe,
  FaPaypal,
  FaLock,
  FaGlobe,
  FaCreditCard,
  FaShieldAlt,
  FaRocket,
} from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const PaymentPoweredBy = () => {
  const componentRef = useRef(null)

  const securityFeatures = [
    {
      icon: <FaShieldAlt className="h-10 w-10 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Bank-Grade Security',
      description:
        'All transactions are protected with PCI DSS Level 1 compliance, the highest level of security certification.',
    },
    {
      icon: <FaLock className="h-10 w-10 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'End-to-End Encryption',
      description:
        'Your sensitive financial data is encrypted from the moment you enter it until the transaction is complete.',
    },
    {
      icon: <FaGlobe className="h-10 w-10 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'Global & Versatile',
      description:
        'We support payments and payouts in multiple currencies across the globe, accepting all major credit cards and digital wallets.',
    },
  ]

  const payoutSteps = [
    {
      title: 'Campaign Completed',
      description: 'You successfully finish your brand collaboration.',
    },
    {
      title: 'Payout Approved',
      description: 'The brand approves the work and we process your payment.',
    },
    { title: 'Secure Transfer', description: 'Our partners securely transfer the funds.' },
    { title: 'Money in Your Account', description: 'Your earnings arrive quickly and safely.' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO ANIMATION ---
      gsap.fromTo(
        '.hero-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 },
      )
      gsap.fromTo(
        '.partner-logo',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.15, delay: 0.6 },
      )

      // --- GENERAL SECTION ANIMATION FUNCTION ---
      const animateUp = (selector, trigger, stagger = 0.15) => {
        gsap.fromTo(
          selector,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: stagger,
            scrollTrigger: { trigger: trigger || selector, start: 'top 85%' },
          },
        )
      }

      // --- APPLYING ANIMATIONS ---
      animateUp('.section-header')
      animateUp('.feature-card', '.features-section')
      animateUp('.step-item', '.payout-steps', 0.2)
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
          <p className="hero-content text-lg font-semibold text-[rgb(var(--color-primary-cyan))]">
            Powered by Trust
          </p>
          <h1 className="hero-content text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mt-2">
            Secure & Seamless Payments
          </h1>
          <p className="hero-content mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))]">
            At Vybzz Nations, your financial security is our top priority. We partner with industry
            leaders to ensure every transaction is fast, safe, and reliable.
          </p>
          <div className="hero-content mt-12 flex items-center justify-center gap-8 sm:gap-12">
            <div className="partner-logo flex items-center gap-3 text-3xl sm:text-4xl font-bold text-gray-300">
              <FaStripe className="text-[#635BFF]" /> Stripe
            </div>
            <div className="partner-logo flex items-center gap-3 text-3xl sm:text-4xl font-bold text-gray-300">
              <FaPaypal className="text-[#0070BA]" /> PayPal
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="features-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--color-surface-1))]">
        <div className="max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
              A Payment System You Can Rely On
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto">
              We've built our payment infrastructure with multiple layers of protection for your
              peace of mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl border border-transparent transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:-translate-y-2"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[rgb(var(--color-text-muted))] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payout Process Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="section-header text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Your Payout Journey</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              From campaign completion to cash in hand, the process is simple and transparent.
            </p>
          </div>

          <div className="payout-steps relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
            {/* Dashed line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[rgb(var(--color-surface-2))] -translate-y-4"></div>
            {/* Vertical line for mobile */}
            <div className="block md:hidden absolute top-0 left-1/2 w-0.5 h-full border-l-2 border-dashed border-[rgb(var(--color-surface-2))] -translate-x-1/2"></div>

            {payoutSteps.map((step, index) => (
              <div
                key={index}
                className="step-item relative z-10 flex flex-col md:items-center text-center w-full md:w-1/4 px-4"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section py-20 px-4">
        <div className="final-cta max-w-4xl mx-auto text-center">
          <FaRocket className="mx-auto text-4xl text-[rgb(var(--color-accent-orange))] mb-4" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Focus On Your Creativity
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Leave the payment complexities to us. We ensure you get paid securely and on time, every
            time, so you can focus on what you do best: creating amazing content.
          </p>
          <a
            href="/signup"
            className="inline-block mt-8 px-8 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105"
          >
            Join Vybzz Nations Today
          </a>
        </div>
      </section>
    </div>
  )
}

export default PaymentPoweredBy

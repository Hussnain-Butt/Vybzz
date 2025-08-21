import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaCheckCircle, FaStar, FaArrowRight, FaTimesCircle } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const PaidMembership = () => {
  const componentRef = useRef(null)
  const [isYearly, setIsYearly] = useState(false)

  // --- Data for the page ---
  const comparisonFeatures = [
    { feature: 'Access to Public Campaigns', free: true, pro: true },
    { feature: 'Standard Analytics', free: true, pro: true },
    { feature: 'Standard Support', free: true, pro: true },
    { feature: 'Access to Exclusive Campaigns', free: false, pro: true },
    { feature: 'Advanced Performance Analytics', free: false, pro: true },
    { feature: 'Priority 24/7 Support', free: false, pro: true },
    { feature: "Verified 'Pro' Badge on Profile", free: false, pro: true },
    { feature: 'Early Access to New Features', free: false, pro: true },
    { feature: 'Zero Platform Fees', free: false, pro: true },
  ]

  const faqs = [
    {
      q: 'Can I cancel my membership anytime?',
      a: 'Yes, you can cancel your Pro membership at any time. You will retain Pro access until the end of your current billing period.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, including Visa, Mastercard, and American Express, as well as PayPal.',
    },
    {
      q: 'Is there a discount for yearly billing?',
      a: 'Absolutely! You can save over 15% by choosing the yearly billing option. The toggle on the pricing section shows the exact savings.',
    },
    {
      q: 'What happens when I upgrade to Pro?',
      a: 'Your account will be instantly upgraded, unlocking all Pro features immediately. Your new billing cycle begins the day you upgrade.',
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- ANIMATIONS ---
      gsap.fromTo(
        '.hero-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 },
      )

      const animateUp = (selector, trigger) => {
        gsap.fromTo(
          selector,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: { trigger: trigger || selector, start: 'top 85%' },
          },
        )
      }

      animateUp('.section-header')
      animateUp('.comparison-table', '.comparison-section')
      animateUp('.plan-card', '.pricing-section')
      animateUp('.faq-item', '.faq-section')
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
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-[rgb(var(--color-primary-cyan))] opacity-15 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-slate-900 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="hero-content text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
            Unlock <span className="text-[rgb(var(--color-primary-cyan))]">Premium Access</span>
          </h1>
          <p className="hero-content mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))]">
            Elevate your creator journey with the Vybzz Nations Pro plan. Get exclusive access to
            high-paying campaigns, advanced tools, and priority support.
          </p>
          <a
            href="#pricing"
            className="hero-content inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105"
          >
            View Pricing Plans
          </a>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
              Free vs.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))]">
                Pro
              </span>
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              See what you get when you upgrade.
            </p>
          </div>

          <div className="comparison-table w-full bg-[rgb(var(--color-surface-1))] border border-[rgb(var(--color-surface-2))] rounded-2xl p-4 sm:p-6">
            <div className="hidden sm:grid grid-cols-3 gap-4 text-center font-bold text-xl mb-4 px-4">
              <div className="text-left">Feature</div>
              <div>Free</div>
              <div>Pro</div>
            </div>
            {comparisonFeatures.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 sm:grid-cols-3 gap-4 items-center p-4 rounded-lg ${
                  index % 2 === 0 ? 'bg-[rgb(var(--color-surface-2))]' : ''
                }`}
              >
                <div className="col-span-3 sm:col-span-1 text-sm sm:text-base font-medium">
                  {item.feature}
                </div>
                <div className="sm:hidden col-span-1 text-xs font-bold text-[rgb(var(--color-text-muted))]">
                  FREE
                </div>
                <div className="sm:hidden col-span-1 text-xs font-bold text-[rgb(var(--color-primary-cyan))]">
                  PRO
                </div>
                <div className="text-center">
                  {item.free ? (
                    <FaCheckCircle className="mx-auto text-green-500" />
                  ) : (
                    <FaTimesCircle className="mx-auto text-[rgb(var(--color-text-muted))]/50" />
                  )}
                </div>
                <div className="text-center">
                  {item.pro ? (
                    <FaCheckCircle className="mx-auto text-[rgb(var(--color-primary-cyan))]" />
                  ) : (
                    <FaTimesCircle className="mx-auto text-[rgb(var(--color-text-muted))]/50" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="pricing-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--color-surface-1))]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-header mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))]">
              Start with a free plan or unlock your full potential with Pro.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center space-x-4 mb-10">
            <span
              className={`font-medium ${
                !isYearly ? 'text-white' : 'text-[rgb(var(--color-text-muted))]'
              }`}
            >
              Monthly
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[rgb(var(--color-surface-2))] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[rgb(var(--color-primary-cyan))]"></div>
            </label>
            <span
              className={`font-medium ${
                isYearly ? 'text-white' : 'text-[rgb(var(--color-text-muted))]'
              }`}
            >
              Yearly <span className="text-green-400 text-sm">(Save 15%)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="plan-card bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl border border-transparent">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-[rgb(var(--color-text-muted))] mt-2">
                Perfect for getting started
              </p>
              <p className="text-5xl font-extrabold my-6">$0</p>
              <button className="w-full py-3 font-bold rounded-lg bg-[rgb(var(--color-surface-3))]">
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="plan-card relative bg-[rgb(var(--color-surface-2))] p-8 rounded-2xl border border-[rgb(var(--color-primary-cyan))]">
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] px-4 py-1 text-sm font-bold rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-[rgb(var(--color-text-muted))] mt-2">For creators ready to grow</p>
              <p className="text-5xl font-extrabold my-6">
                {isYearly ? '$12' : '$15'}
                <span className="text-lg font-medium text-[rgb(var(--color-text-muted))]">/mo</span>
              </p>
              <a
                href="#"
                className="w-full block py-3 font-bold rounded-lg bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] transition-transform hover:scale-105"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="section-header text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item bg-[rgb(var(--color-surface-1))] p-6 rounded-lg">
                <h3 className="font-bold text-lg text-[rgb(var(--color-text-primary))]">{faq.q}</h3>
                <p className="mt-2 text-[rgb(var(--color-text-secondary))]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section py-20 px-4">
        <div className="final-cta max-w-4xl mx-auto text-center">
          <FaStar className="mx-auto text-4xl text-yellow-400 mb-4" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Ready to Supercharge Your Growth?
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Join hundreds of Pro creators who are earning more, saving time, and building their
            careers with Vybzz Nations.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[rgb(var(--color-primary-cyan))] text-[rgb(var(--color-background-dark))] font-bold rounded-full text-lg transition-transform duration-300 hover:scale-105"
          >
            Upgrade Your Plan
            <FaArrowRight />
          </a>
        </div>
      </section>
    </div>
  )
}

export default PaidMembership

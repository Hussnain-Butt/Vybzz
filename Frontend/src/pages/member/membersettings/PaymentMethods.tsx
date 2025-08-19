import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { FaPlus, FaShieldAlt } from 'react-icons/fa'

// Reusable Card component for a consistent and professional look
const SettingsCard = ({ title, children, className }) => (
  <div
    className={`payment-card bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-6 sm:p-8 ${className}`}
  >
    <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>
    {children}
  </div>
)

const PaymentMethods = () => {
  // GSAP animation for a smooth, staggered entrance of cards
  useEffect(() => {
    gsap.fromTo(
      '.payment-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      },
    )
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Page Title */}
      <h1 className="text-3xl font-bold text-white mb-8">Payment methods</h1>

      <div className="space-y-8">
        {/* Payment Methods Card */}
        <SettingsCard title="Payment Methods">
          <div className="flex flex-col items-start space-y-5">
            <button
              className="flex items-center gap-2 bg-[rgb(var(--color-surface-interactive))] text-white font-semibold py-2 px-5 
                         rounded-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors duration-300"
            >
              <FaPlus />
              Add Payment Method
            </button>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              You do not currently have any payment methods.
            </p>
          </div>
        </SettingsCard>

        {/* Backup Payments Card */}
        <SettingsCard title="Backup payments">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-md leading-relaxed">
              Turn on backup payments to automatically try one of your other payment methods when
              your primary method fails. This helps make sure you don’t lose access to your
              membership benefits.
            </p>
            <button
              className="flex-shrink-0 flex items-center gap-2 bg-[rgb(var(--color-surface-interactive))] text-white font-semibold 
                         py-2 px-5 rounded-lg hover:bg-[rgb(var(--color-surface-3))] transition-colors duration-300"
            >
              <FaShieldAlt />
              Turn on backup payments
            </button>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

export default PaymentMethods

import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { FaFileInvoiceDollar } from 'react-icons/fa'

const BillingHistory = () => {
  // GSAP animation for a professional entrance
  useEffect(() => {
    gsap.fromTo(
      '.billing-card',
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      },
    )
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="billing-card flex flex-col items-center justify-center text-center bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-10 sm:p-16">
        {/* Relevant Icon for Billing */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-surface-2))] mb-6">
          <FaFileInvoiceDollar className="text-[rgb(var(--color-primary-blue))]" size={36} />
        </div>

        {/* Clear Headline */}
        <h2 className="text-2xl font-bold text-white mb-3">Your Billing History is Empty</h2>

        {/* Informative and Helpful Text */}
        <p className="text-md text-[rgb(var(--color-text-secondary))] max-w-md mb-8">
          There is currently no payment history to display. Once you make a payment, all your
          transaction details and invoices will appear here.
        </p>

        {/* Optional: A helpful button to guide the user */}
        <button
          className="bg-[rgb(var(--color-surface-interactive))] text-white font-bold py-3 px-6 rounded-lg 
                     hover:bg-[rgb(var(--color-surface-3))] transition-all duration-300 ease-in-out 
                     transform hover:scale-105 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface-1))] 
                     focus:ring-[rgb(var(--color-primary-blue))]"
        >
          Manage Payment Methods
        </button>
      </div>
    </div>
  )
}

export default BillingHistory

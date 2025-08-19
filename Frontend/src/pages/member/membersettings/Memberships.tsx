import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { FaSearch } from 'react-icons/fa'

const Memberships = () => {
  // GSAP animation for a smooth entrance
  useEffect(() => {
    gsap.fromTo(
      '.membership-card',
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
      <div className="membership-card flex flex-col items-center justify-center text-center bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-10 sm:p-16">
        {/* Engaging Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-surface-2))] mb-6">
          <FaSearch className="text-[rgb(var(--color-primary-cyan))]" size={36} />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-white mb-3">Find Creators You'll Love</h2>

        {/* Informative Text */}
        <p className="text-md text-[rgb(var(--color-text-secondary))] max-w-sm mb-8">
          You aren't supporting anyone right now. Start exploring to find creators and communities
          that inspire you.
        </p>

        {/* Call-to-Action Button */}
        <button
          className="bg-[rgb(var(--color-primary-cyan))] text-white font-bold py-3 px-8 rounded-lg 
                     hover:bg-[rgb(var(--color-accent-pink))] transition-all duration-300 ease-in-out 
                     transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface-1))] 
                     focus:ring-[rgb(var(--color-accent-pink))]"
        >
          Explore Creators
        </button>
      </div>
    </div>
  )
}

export default Memberships

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  FaUser,
  FaShieldAlt,
  FaEnvelope,
  FaUsers,
  FaFileInvoiceDollar,
  FaCamera,
} from 'react-icons/fa'

// Menu item component for reusability
const SettingsMenuItem = ({ icon, label, isActive }) => (
  <a
    href="#"
    className={`
      flex items-center space-x-4 p-3 rounded-lg transition-all duration-300
      ${
        isActive
          ? 'bg-[rgb(var(--color-primary-blue)/0.9)] text-white shadow-lg'
          : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
      }
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </a>
)

const Basics = () => {
  const contentRef = useRef(null)

  // GSAP Animations
  useEffect(() => {
    const sidebar = document.getElementById('settings-sidebar')
    const content = contentRef.current

    // Animate sidebar
    gsap.fromTo(
      sidebar,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
    )

    // Animate content panel
    gsap.fromTo(
      content,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      },
    )

    // Animate form elements with a stagger effect
    gsap.fromTo(
      '.animate-form-element',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.7,
      },
    )
  }, [])

  return (
    <div className="min-h-screen text-[rgb(var(--color-text-primary))] font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Right Content Area */}
          <main ref={contentRef} className="flex-grow">
            <div className="bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-2xl p-6 sm:p-10">
              <h2 className="text-3xl font-bold mb-8 text-[rgb(var(--color-primary-cyan))]">
                Profile Information
              </h2>

              <div className="space-y-8">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6 animate-form-element">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[rgb(var(--color-primary-blue))] flex items-center justify-center text-5xl font-bold text-white shadow-md">
                      T
                    </div>
                    <button className="absolute bottom-0 right-0 bg-[rgb(var(--color-surface-interactive))] rounded-full p-2.5 hover:bg-[rgb(var(--color-surface-3))] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface-1))] focus:ring-[rgb(var(--color-primary-cyan))]">
                      <FaCamera className="text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Update your photo</h3>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      This will be displayed on your profile.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="animate-form-element">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2"
                  >
                    Display name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    defaultValue="tools"
                    className="w-full bg-[rgb(var(--color-surface-2))] border-2 border-transparent focus:border-[rgb(var(--color-primary-cyan))] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-0 transition-all duration-300"
                  />
                </div>

                <div className="animate-form-element">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="tools8591@gmail.com"
                    className="w-full bg-[rgb(var(--color-surface-2))] border-2 border-transparent focus:border-[rgb(var(--color-primary-cyan))] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-0 transition-all duration-300"
                  />
                </div>

                <div className="animate-form-element">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2"
                  >
                    Country of Residence
                  </label>
                  <select
                    id="country"
                    className="w-full bg-[rgb(var(--color-surface-2))] border-2 border-transparent focus:border-[rgb(var(--color-primary-cyan))] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-0 transition-all duration-300 appearance-none bg-no-repeat bg-right-4"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    }}
                  >
                    <option className="bg-[rgb(var(--color-surface-1))]">Pakistan</option>
                    <option className="bg-[rgb(var(--color-surface-1))]">United States</option>
                    <option className="bg-[rgb(var(--color-surface-1))]">Canada</option>
                    <option className="bg-[rgb(var(--color-surface-1))]">United Kingdom</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-12 animate-form-element">
                <button className="bg-[rgb(var(--color-primary-cyan))] text-white font-bold py-3 px-8 rounded-lg hover:bg-[rgb(var(--color-accent-pink))] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface-1))] focus:ring-[rgb(var(--color-accent-pink))]">
                  Save Changes
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Basics

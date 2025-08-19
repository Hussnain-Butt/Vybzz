import React, { useState, useEffect } from 'react'
import { gsap } from 'gsap'

// Reusable custom Toggle Switch for a modern, consistent feel
const ToggleSwitch = ({ enabled, setEnabled }) => (
  <button
    type="button"
    onClick={() => setEnabled(!enabled)}
    className={`
      relative inline-flex items-center h-6 rounded-full w-11 flex-shrink-0
      transition-colors duration-300 ease-in-out
      ${enabled ? 'bg-[rgb(var(--color-primary-blue))]' : 'bg-[rgb(var(--color-surface-3))]'}
    `}
  >
    <span
      className={`
        inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out
        ${enabled ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
)

// Reusable row component for each notification setting
const NotificationRow = ({ label, enabled, setEnabled }) => (
  <div className="notification-item flex items-center justify-between py-3">
    <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">{label}</span>
    <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
  </div>
)

const EmailNotifications = () => {
  // State for all notification toggles, easily manageable
  const [notifications, setNotifications] = useState({
    replies: true,
    productUpdates: true,
    newsletter: true,
    specialOffers: true,
    creatorUpdates: true,
  })

  // Handler to update a specific notification setting
  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // GSAP animation for a staggered, professional entrance
  useEffect(() => {
    gsap.fromTo(
      '.notification-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
    )
    gsap.fromTo(
      '.notification-item',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power3.out',
      },
    )
  }, [])

  const marketingNotifications = [
    {
      key: 'productUpdates',
      label: 'Product updates and community announcements',
    },
    { key: 'newsletter', label: 'Member newsletter' },
    { key: 'specialOffers', label: 'Special offers and promotions' },
    { key: 'creatorUpdates', label: 'General creator updates' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="notification-card bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="divide-y divide-[rgb(var(--color-surface-3))]">
          {/* General Section */}
          <div className="pb-4">
            <h2 className="text-xl font-bold mb-2 text-white">General</h2>
            <NotificationRow
              label="Replies to your comments"
              enabled={notifications.replies}
              setEnabled={() => handleToggle('replies')}
            />
          </div>

          {/* Marketing Section */}
          <div className="pt-6">
            <h2 className="text-xl font-bold mb-2 text-white">Marketing</h2>
            {marketingNotifications.map((item) => (
              <NotificationRow
                key={item.key}
                label={item.label}
                enabled={notifications[item.key]}
                setEnabled={() => handleToggle(item.key)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailNotifications

// src/pages/dashboard/settings/NotificationsPage.tsx
import React, { useState, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
      checked ? 'bg-[rgb(var(--color-primary-blue))]' : 'bg-[rgb(var(--color-surface-3))]'
    }`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
)

const NotificationRow = ({
  label,
  initialChecked = false,
}: {
  label: string
  initialChecked?: boolean
}) => {
  const [checked, setChecked] = useState(initialChecked)
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-white">{label}</span>
      <Toggle checked={checked} onChange={setChecked} />
    </div>
  )
}

const NotificationGroup = ({ title, items }: { title: string; items: string[] }) => (
  <div className="gsap-notif-group">
    <h4 className="text-lg font-bold text-white mt-6 mb-2">{title}</h4>
    <div className="divide-y divide-[rgb(var(--color-surface-3))]">
      {items.map((item) => (
        <NotificationRow key={item} label={item} initialChecked={true} />
      ))}
    </div>
  </div>
)

const NotificationsSettingsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-notif-section',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="container space-y-8">
      <div className="gsap-notif-section">
        <p className="text-[rgb(var(--color-text-secondary))]">
          These are your email notification settings. These settings only apply to you, and not your
          team.
        </p>
        <div className="mt-6 bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))]">
          <h3 className="text-2xl font-bold text-white">Email</h3>
          <NotificationGroup
            title="Posts, comments, and messages"
            items={['Every time you post', 'Comments and replies on posts', 'Direct messages']}
          />
          <NotificationGroup title="Memberships" items={['New paid members']} />
          <NotificationGroup
            title="Shop purchases"
            items={['When someone buys a product from your shop']}
          />
          <NotificationGroup
            title="Reminders to share"
            items={['When a clip of your post is ready to be shared']}
          />
        </div>
      </div>
      <div className="gsap-notif-section">
        <div className="bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))]">
          <h3 className="text-2xl font-bold text-white">Notification Feed</h3>
          <NotificationGroup
            title="Posts, comments, and messages"
            items={['Likes on posts, comments and messages', 'Comments and replies on posts']}
          />
          <NotificationGroup title="Chats" items={['Chat messages and replies']} />
          <NotificationGroup
            title="Memberships"
            items={[
              'New free members',
              'New paid members',
              'Upgraded members',
              'Downgraded members',
              'Cancelled members',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationsSettingsPage

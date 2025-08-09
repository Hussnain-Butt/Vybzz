// src/pages/dashboard/settings/AccountPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const SettingsCard = ({
  title,
  status,
  children,
  buttonText,
  onButtonClick,
}: {
  title: string
  status: string
  children: React.ReactNode
  buttonText?: string
  onButtonClick?: () => void
}) => (
  <div className="gsap-settings-card bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl border border-[rgb(var(--color-surface-2))]">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <p className="text-sm font-semibold uppercase text-[rgb(var(--color-text-muted))]">
          {title}
        </p>
        <h3 className="text-xl font-bold text-white mt-1">{status}</h3>
        <p className="text-[rgb(var(--color-text-secondary))] mt-2 max-w-xl">{children}</p>
      </div>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="mt-4 sm:mt-0 bg-[rgb(var(--color-surface-3))] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[rgb(var(--color-surface-interactive))] transition-colors flex-shrink-0"
        >
          {buttonText}
        </button>
      )}
    </div>
  </div>
)

const AccountPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-settings-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-6">
      <SettingsCard title="Monetization" status="Not enabled" buttonText="Learn more">
        Get paid by offering a paid membership or selling your work as one-time purchases. Fees are
        only applicable once you start earning.
      </SettingsCard>

      <SettingsCard title="Video Storage" status="Not eligible">
        You are not eligible to upload videos directly to Patreon at this time.{' '}
        <a href="#" className="text-[rgb(var(--color-text-link))] font-semibold hover:underline">
          Learn more
        </a>
      </SettingsCard>

      <SettingsCard title="Account Management" status="">
        Once you launch your page, you can pause a billing cycle for your members or unlaunch your
        creator page here
      </SettingsCard>
    </div>
  )
}

export default AccountPage

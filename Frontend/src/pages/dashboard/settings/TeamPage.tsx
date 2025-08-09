// src/pages/dashboard/settings/TeamPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Plus } from 'lucide-react'

const TeamPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="max-w-3xl">
      <div className="bg-[rgb(var(--color-surface-1))] p-8 rounded-2xl border border-[rgb(var(--color-surface-2))]">
        <h3 className="text-2xl font-bold text-white">Your team</h3>
        <p className="text-[rgb(var(--color-text-secondary))] mt-4">
          The <span className="font-bold text-white">team lead</span> has full permission to access
          everything on the account.
        </p>
        <p className="text-[rgb(var(--color-text-secondary))] mt-2">
          Only the team lead can add or remove teammates, see income and payout information, perform
          refunds, and update account settings.{' '}
          <a href="#" className="text-[rgb(var(--color-text-link))] font-semibold hover:underline">
            Learn more
          </a>
        </p>

        <div className="my-8 border-t border-[rgb(var(--color-surface-2))]"></div>

        <div className="flex items-center gap-4">
          <img
            src="https://avatar.vercel.sh/hussnain.png"
            alt="User Avatar"
            className="h-12 w-12 rounded-full border-2 border-[rgb(var(--color-surface-3))]"
          />
          <div>
            <p className="font-bold text-white">You (team lead)</p>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">bhussnain966@gmail.com</p>
          </div>
        </div>

        <button className="mt-8 flex items-center gap-2 text-[rgb(var(--color-text-link))] font-semibold hover:underline">
          <Plus size={20} /> Invite teammate
        </button>
      </div>
    </div>
  )
}

export default TeamPage

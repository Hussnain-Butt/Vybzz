// src/pages/dashboard/settings/AppsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ChevronRight } from 'lucide-react'

const apps = [
  {
    name: 'Discord',
    description: 'Invite your members to connect in a private community.',
    icon: 'https://www.svgrepo.com/show/353655/discord-icon.svg',
  },
  {
    name: 'Vimeo',
    description: 'Post member-only videos directly on Patreon.',
    icon: 'https://www.svgrepo.com/show/354516/vimeo.svg',
  },
]

const AppCard = ({ name, description, icon }: (typeof apps)[0]) => (
  <a
    href="#"
    className="gsap-app-card flex justify-between items-center p-6 bg-[rgb(var(--color-surface-1))] rounded-2xl border border-[rgb(var(--color-surface-2))] hover:border-[rgb(var(--color-primary-blue))] transition-all duration-300 group"
  >
    <div className="flex items-center gap-5">
      <img src={icon} alt={`${name} logo`} className="h-10 w-10 filter invert" />
      <div>
        <h4 className="text-lg font-bold text-white">{name}</h4>
        <p className="text-[rgb(var(--color-text-secondary))]">{description}</p>
      </div>
    </div>
    <ChevronRight
      size={24}
      className="text-[rgb(var(--color-text-muted))] group-hover:text-white transition-colors"
    />
  </a>
)

const AppsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-app-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="max-w-3xl space-y-6">
      {apps.map((app) => (
        <AppCard key={app.name} {...app} />
      ))}
    </div>
  )
}

export default AppsPage

// src/pages/dashboard/settings/PodcastPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Plus, ChevronUp, ChevronRight, CheckCircle2, Rss, Grid3X3, RefreshCw } from 'lucide-react'

const podcastFeatures = [
  {
    title: 'Create podcast episodes directly on Patreon',
    description:
      'You can easily distribute episodes by creating an audio or video post on Patreon.',
    icon: <CheckCircle2 />,
  },
  {
    title: 'Promote your podcast on Spotify',
    description:
      'Showcase locked episodes on Spotify—convert new listeners and deliver a seamless feed for members.',
    icon: <Rss />,
  },
  {
    title: 'Create multiple podcast feeds',
    description:
      'If you offer multiple podcasts, you can allow members to subscribe to an individual podcast by using separate feeds.',
    icon: <Grid3X3 />,
  },
  {
    title: 'Sync a podcast from elsewhere',
    description:
      'If you use another podcast service, you can keep that service and distribute episodes to Patreon members too.',
    icon: <RefreshCw />,
  },
]

const PodcastPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-podcast-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="gsap-podcast-item flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">Podcasting</h3>
          <p className="text-[rgb(var(--color-text-secondary))] mt-1">
            Create podcasts that members can listen to either on Patreon or other podcast apps
            through RSS
          </p>
        </div>
        <button className="bg-slate-200 text-slate-900 font-bold py-2.5 px-5 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
          <Plus /> New podcast
        </button>
      </div>

      <div className="gsap-podcast-item bg-[rgb(var(--color-surface-1))] rounded-2xl border border-[rgb(var(--color-surface-2))]">
        <div className="flex justify-between items-center p-6">
          <h4 className="text-lg font-bold text-white">
            Make the most out of podcasting on Patreon
          </h4>
          <ChevronUp />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgb(var(--color-surface-2))]">
          {podcastFeatures.map((f) => (
            <div key={f.title} className="bg-[rgb(var(--color-surface-1))] p-6">
              <div className="flex items-center gap-3 text-[rgb(var(--color-primary-cyan))]">
                {f.icon} <span className="font-bold text-white">{f.title}</span>
              </div>
              <p className="text-[rgb(var(--color-text-secondary))] text-sm mt-2">
                {f.description}
              </p>
              <a
                href="#"
                className="flex items-center gap-1 text-[rgb(var(--color-text-link))] font-semibold mt-3 text-sm"
              >
                Learn more <ChevronRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="gsap-podcast-item text-center bg-[rgb(var(--color-surface-1))] p-12 rounded-2xl border border-[rgb(var(--color-surface-2))]">
        <Rss size={40} className="mx-auto text-white mb-4" />
        <h3 className="text-2xl font-bold text-white">Set up a podcast</h3>
        <p className="text-[rgb(var(--color-text-secondary))] mt-2 max-w-lg mx-auto">
          Let members listen to audio and video episodes on Patreon or other apps like Apple
          Podcasts and Spotify.
        </p>
        <button className="mt-6 bg-slate-200 text-slate-900 font-bold py-2.5 px-5 rounded-lg hover:bg-white transition-colors flex items-center gap-2 mx-auto">
          <Plus /> New podcast
        </button>
      </div>
    </div>
  )
}

export default PodcastPage

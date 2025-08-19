import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { FaDiscord, FaVimeoV, FaSpotify, FaChevronRight } from 'react-icons/fa'

// Reusable component for each app row for a clean and maintainable code
const AppRow = ({ icon, name, description }) => (
  <a
    href="#"
    className="app-row flex items-center justify-between w-full bg-[rgb(var(--color-surface-1))] 
               p-5 rounded-xl shadow-md hover:bg-[rgb(var(--color-surface-2))] 
               transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
  >
    <div className="flex items-center gap-5">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-bold text-md text-white">{name}</h3>
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">{description}</p>
      </div>
    </div>
    <FaChevronRight className="text-[rgb(var(--color-text-muted))]" />
  </a>
)

const ConnectedApps = () => {
  // Data for connected apps, easily expandable
  const apps = [
    {
      icon: <FaDiscord className="text-indigo-400" />,
      name: 'Discord',
      description: 'Access Discord roles from your creators.',
    },
    {
      icon: <FaVimeoV className="text-cyan-400" />,
      name: 'Vimeo',
      description: 'Post member-only videos directly on Patreon.',
    },
    {
      icon: <FaSpotify className="text-green-500" />,
      name: 'Spotify',
      description: 'Listen to exclusive audio posts from your Patreon creators on Spotify.',
    },
  ]

  // GSAP animation for a professional staggered entrance
  useEffect(() => {
    gsap.fromTo(
      '.app-row, .logged-in-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      },
    )
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-8">Connected apps</h1>

      <div className="space-y-4">
        {/* Render each app row from the apps array */}
        {apps.map((app) => (
          <AppRow key={app.name} icon={app.icon} name={app.name} description={app.description} />
        ))}
      </div>

      {/* "Logged in with..." Section */}
      <div className="logged-in-card mt-12 bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-3 text-white">Logged in with Patreon</h2>
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
          You logged in to these sites and apps with your Patreon account.
        </p>
      </div>
    </div>
  )
}

export default ConnectedApps

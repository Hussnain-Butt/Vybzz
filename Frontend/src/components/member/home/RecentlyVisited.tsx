import React, { useRef } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'

const recentlyVisitedData = [
  {
    name: 'Digital Foundry',
    image:
      'https://yt3.googleusercontent.com/ytc/AIdro_k-a4nqaZ2Jt2g_1cT9L2Gv34G2hN8s44Tj0eZq=s900-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'The Toast',
    image: 'https://i.scdn.co/image/ab6765630000ba8a8a58c89a72614619a008f517',
  },
]

type TileProps = {
  name: string
  image: string
}

const RecentlyTile: React.FC<TileProps> = ({ name, image }) => {
  const barRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    const el = barRef.current
    if (!el) return
    el.animate(
      [
        { transform: 'translateX(-120%) rotate(-12deg)', opacity: 0 },
        { transform: 'translateX(120%) rotate(-12deg)', opacity: 0.35 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' },
    )
  }

  const handleLeave = () => {
    const el = barRef.current
    if (!el) return
    el.animate([{ transform: 'translateX(-120%) rotate(-12deg)', opacity: 0 }], {
      duration: 250,
      fill: 'forwards',
    })
  }

  return (
    <a
      href="#"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative flex items-center gap-4 rounded-2xl
                 bg-white/[.03] ring-1 ring-white/10 backdrop-blur-sm
                 transition-all duration-300 hover:bg-white/[.06] hover:ring-white/20
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 p-3 pr-4
                 overflow-hidden isolate"
    >
      {/* Shine sweep (clipped inside) */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
        <div
          ref={barRef}
          className="absolute inset-y-0 -left-1/3 w-1/2
                     bg-gradient-to-r from-transparent via-white/30 to-transparent
                     opacity-0 will-change-transform"
          style={{ transform: 'translateX(-120%) rotate(-12deg)' }}
        />
      </div>

      {/* Artwork */}
      <div className="relative h-16 w-16 overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%2315151a%22/><text x=%2250%25%22 y=%2252%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2214%22 font-family=%22Inter, Arial%22>No Image</text></svg>'
          }}
        />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-5 text-white truncate">{name}</p>
        <p className="mt-1 text-sm text-neutral-300">Visited recently</p>
      </div>

      {/* Action */}
      <span
        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full
                   bg-white/10 text-white transition-colors group-hover:bg-white/20"
        aria-hidden
      >
        <LuArrowUpRight />
      </span>
    </a>
  )
}

const RecentlyVisited: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="mb-4 text-2xl font-bold text-white">Recently visited</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentlyVisitedData.map((item) => (
          <RecentlyTile key={item.name} name={item.name} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default RecentlyVisited

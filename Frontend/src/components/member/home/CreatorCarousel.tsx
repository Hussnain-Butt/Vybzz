import React, { useRef } from 'react'
import CreatorCard, { Creator } from './CreatorCard'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

interface CreatorCarouselProps {
  title: string
  creators: Creator[]
}

const SCROLL_BY = 320

const CreatorCarousel: React.FC<CreatorCarouselProps> = ({ title, creators }) => {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const delta = dir === 'left' ? -SCROLL_BY : SCROLL_BY
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (!creators || creators.length === 0) return null

  return (
    <section className="relative w-full mt-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            aria-label="Previous"
            onClick={() => scrollBy('left')}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
          >
            <LuChevronLeft />
          </button>
          <button
            aria-label="Next"
            onClick={() => scrollBy('right')}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
          >
            <LuChevronRight />
          </button>
        </div>
      </div>

      {/* Hidden Scrollbar */}
      <div ref={trackRef} className="overflow-x-auto px-4 hide-scrollbar">
        <div className="flex gap-4 pb-2 snap-x snap-mandatory" style={{ minHeight: 280 }}>
          {creators.map((c, idx) => (
            <CreatorCard key={`${c.name}-${idx}`} {...c} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CreatorCarousel

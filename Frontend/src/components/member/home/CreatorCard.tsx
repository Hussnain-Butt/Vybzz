import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { LuArrowUpRight } from 'react-icons/lu'

export interface Creator {
  image: string
  name: string
  description: string
}

const CreatorCard: React.FC<Creator> = ({ image, name, description }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const card = cardRef.current
    const img = imgRef.current
    const shine = shineRef.current
    const glow = glowRef.current
    if (!card || !img || !shine || !glow) return

    // base state
    gsap.set(glow, { opacity: 0 })
    gsap.set(img, { scale: 1 })
    gsap.set(shine, { xPercent: -120, rotate: -12, opacity: 0 })

    const onEnter = () => {
      gsap.to(img, { scale: 1.03, duration: 0.35, ease: 'power2.out' })
      gsap.to(glow, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.to(shine, {
        opacity: 0.6,
        xPercent: 120,
        duration: 0.7,
        ease: 'power2.out',
      })
    }

    const onLeave = () => {
      gsap.to(img, { scale: 1, duration: 0.35, ease: 'power2.out' })
      gsap.to(glow, { opacity: 0, duration: 0.35, ease: 'power2.out' })
      gsap.to(shine, { opacity: 0, xPercent: -120, duration: 0.6, ease: 'power2.in' })
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <article
      ref={cardRef}
      className="group relative w-[300px] shrink-0 snap-start rounded-2xl bg-white/[.03]
                 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300
                 backdrop-blur-sm overflow-hidden"
    >
      {/* subtle outer glow on hover */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-2xl
                   shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-white/5
                   ring-1 ring-white/10"
      />

      {/* cover image */}
      <div className="relative p-4 pb-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10">
          <img
            ref={imgRef}
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {/* shine sweep */}
          <div ref={shineRef} className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-y-0 -left-1/3 w-1/2
                         bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              style={{ filter: 'blur(10px)' }}
            />
          </div>

          {/* top gradient for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </div>

      {/* body */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-white truncate">{name}</h3>
            <p
              className="mt-1 text-sm text-neutral-300"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={description}
            >
              {description}
            </p>
          </div>

          {/* action pill */}
          <button
            aria-label="Open"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full
                       bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <LuArrowUpRight />
          </button>
        </div>
      </div>

      {/* bottom accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-60" />
    </article>
  )
}

export default CreatorCard

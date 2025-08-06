// src/components/SearchOverlay.tsx

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search, X } from 'lucide-react'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClose = () => {
    if (isAnimating) return
    setIsAnimating(true)

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -50,
      scale: 0.95,
      duration: 0.4,
      ease: 'power3.in',
    })

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        onClose()
        setIsAnimating(false)
      },
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)

      gsap.set(overlayRef.current, { display: 'flex' })
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power3.out' },
      )
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 },
      )
      inputRef.current?.focus()
    } else {
      gsap.set(overlayRef.current, { display: 'none' })
    }

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      ref={overlayRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the container
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for creators, podcasts, or videos..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-4 pl-14 pr-6 text-white text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-lg shadow-black/50"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
        </div>
        <button
          onClick={handleClose}
          className="absolute -top-14 right-0 lg:-right-14 text-slate-400 hover:text-white transition-colors duration-300"
          aria-label="Close search"
        >
          <X size={32} />
        </button>
      </div>
    </div>
  )
}

export default SearchOverlay

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const CursorFollower: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    // Set initial positions
    gsap.set(cursor, { xPercent: -50, yPercent: -50 })
    gsap.set(follower, { xPercent: -50, yPercent: -50 })

    const handleMouseMove = (e: MouseEvent) => {
      // Main cursor follows immediately
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out',
      })

      // Follower has a slight delay for a trailing effect
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    // --- The new, professional hover effect ---
    const handleMouseEnter = () => {
      gsap.to(cursor, {
        scale: 0.3,
        duration: 0.3,
        ease: 'power3.out',
      })
      gsap.to(follower, {
        scale: 2.5,
        backgroundColor: 'transparent', // Fade out background to create a ring
        borderColor: 'rgba(0, 220, 255, 0.4)', // Make border brighter
        duration: 0.3,
        ease: 'power3.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      })
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'rgba(0, 220, 255, 0.05)', // Return to glassy look
        borderColor: 'rgba(0, 220, 255, 0.15)', // Return to subtle border
        duration: 0.3,
        ease: 'power3.out',
      })
    }

    // Add event listeners to the document and interactive elements
    document.addEventListener('mousemove', handleMouseMove)

    const interactiveElements = document.querySelectorAll(
      'a, button, [data-interactive], input, textarea',
    )
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Main cursor dot - Changed to vibrant cyan */}
      <div
        ref={cursorRef}
        className="fixed w-3 h-3 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />

      {/* Follower circle - Redesigned with "glassmorphism" effect */}
      <div
        ref={followerRef}
        className="fixed w-12 h-12 bg-cyan-400/5 backdrop-blur-sm border border-cyan-400/20 rounded-full pointer-events-none z-[9998]"
      />
    </>
  )
}

export default CursorFollower

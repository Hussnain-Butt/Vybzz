// src/components/Shared/FeatureCard.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LucideIcon } from 'lucide-react' // Using LucideIcon as a generic type

gsap.registerPlugin(ScrollTrigger)

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Scroll-triggered fade-in animation
    gsap.fromTo(
      card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%', // Start animation a bit later for better visibility
          toggleActions: 'play none none reverse',
        },
      },
    )

    // Interactive hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup listeners
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      // Replaced all hardcoded colors with root variables for a dark theme
      className="bg-[rgb(var(--color-surface-2)/0.6)] backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-[rgb(var(--color-primary-cyan)/0.1)] transition-shadow duration-300 border border-[rgb(var(--color-surface-3))]"
    >
      {/* Icon background using brand gradient */}
      <div className="w-14 h-14 bg-gradient-to-br from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-[rgb(var(--color-text-primary))]" />
      </div>
      <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4">{title}</h3>
      <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">{description}</p>
    </div>
  )
}

export default FeatureCard

// src/components/PodcastersPage/Testimonial.tsx
import React from 'react'

const Testimonial: React.FC = () => {
  return (
    // Replaced hardcoded colors with root variables
    <div className="relative py-24 sm:py-32 lg:py-40 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-primary))]">
      <img
        src="https://picsum.photos/seed/sisters/1920/1080"
        alt="Two women standing together, representing the Straight Up Sisters"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <blockquote className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug">
          <p>
            "It's been a game changer, having a direct line of communication with our true followers
            and supporters."
          </p>
        </blockquote>
        <figcaption className="mt-8 text-2xl font-bold tracking-wider text-[rgb(var(--color-text-link))]">
          Straight Up Sisters
        </figcaption>
      </div>
    </div>
  )
}

export default Testimonial

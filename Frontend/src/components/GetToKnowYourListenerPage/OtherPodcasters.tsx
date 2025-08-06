// src/components/PodcastersPage/OtherPodcasters.tsx
import React from 'react'
import Section from '../Shared/Section'

const OtherPodcasters: React.FC = () => {
  const names = ['2 Black Girls, 1 Rose', 'Straight Up Sisters', 'Chelsea Devantez']
  return (
    <Section id="creators" className="relative text-white text-center bg-slate-900">
      <img
        src="https://picsum.photos/seed/working/1920/1080"
        alt="Two creators collaborating in a modern workspace"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-12">Other podcasters on Patreon</h2>
        <div className="space-y-6">
          {names.map((name, i) => (
            <h3
              key={i}
              className="text-4xl md:text-6xl lg:text-7xl font-bold opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-default"
            >
              {name}
            </h3>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default OtherPodcasters

// src/components/PodcastersPage/OtherPodcasters.tsx
import React from 'react'
import Section from '../Shared/Section'
import { Star } from 'lucide-react' // Using an icon as a separator

const OtherPodcasters: React.FC = () => {
  const podcasters = [
    '2 Black Girls, 1 Rose',
    'Straight Up Sisters',
    'Chelsea Devantez',
    'The Read',
    'Casefile True Crime',
    'Crime Junkie',
    'My Favorite Murder',
    'The Joe Budden Podcast',
  ]
  const marqueePodcasters = [...podcasters, ...podcasters]

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}
      </style>
      {/* Replaced hardcoded background color with a root variable */}
      <Section
        id="creators"
        className="relative text-[rgb(var(--color-text-primary))] text-center bg-[rgb(var(--color-background-dark))] py-24 sm:py-32"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-[rgb(var(--color-primary-cyan)/0.1)] rounded-full filter blur-3xl" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Join a Universe of Creators
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto mb-12">
            You’ll be in good company. Here are just a few of the thousands of podcasters thriving
            on Vybzz Nation.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex w-max animate-marquee">
              {marqueePodcasters.map((name, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  <span className="mx-8 text-3xl md:text-4xl font-semibold text-[rgb(var(--color-text-secondary))]">
                    {name}
                  </span>
                  <Star
                    className="w-6 h-6 text-[rgb(var(--color-text-link)/0.5)]"
                    fill="currentColor"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

export default OtherPodcasters

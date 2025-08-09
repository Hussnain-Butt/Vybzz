// src/components/PodcastersPage/GetPaid.tsx
import React from 'react'
import Section from '../Shared/Section'
import Button from '../Shared/Button'

const GetPaid: React.FC = () => {
  return (
    // Replaced hardcoded background color with a root variable
    <Section id="pricing" className="bg-[rgb(var(--color-background-blue))]">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div
          className="relative h-[550px] w-full max-w-2xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          {/* Replaced all hardcoded colors with root variables */}
          <div className="w-full h-full bg-[rgb(var(--color-surface-1)/0.6)] backdrop-blur-xl rounded-3xl shadow-2xl border border-[rgb(var(--color-surface-3))] flex overflow-hidden transition-transform duration-700 hover:[transform:rotateY(5deg)]">
            {/* Sidebar */}
            <div className="w-1/4 bg-[rgb(var(--color-background-dark)/0.2)] p-4 border-r border-[rgb(var(--color-surface-2))]">
              <div className="space-y-3 text-sm">
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 rounded-lg bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-primary))]"
                >
                  <span>🏠</span> Recent
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]"
                >
                  <span>🔍</span> Find
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]"
                >
                  <span>💬</span> Messages
                </a>
                <div className="pt-4 border-t border-[rgb(var(--color-surface-2))] mt-4">
                  <a
                    href="#"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[rgb(var(--color-accent-pink)/0.2)] text-[rgb(var(--color-text-primary))]"
                  >
                    <img
                      src="https://picsum.photos/seed/amanda/100/100"
                      alt="Creator Amanda Seales"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-bold">Amanda...</span>
                  </a>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="w-3/4 flex-grow flex flex-col">
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: "url('https://picsum.photos/seed/banner/1000/800')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-background-dark)/0.8)] to-transparent"></div>
                <div className="absolute bottom-[-50px] left-8">
                  <img
                    src="https://picsum.photos/seed/amanda/150/150"
                    alt="Creator Amanda Seales"
                    className="w-24 h-24 rounded-full border-4 border-[rgb(var(--color-surface-1))]"
                  />
                </div>
              </div>
              <div className="flex-grow bg-[rgb(var(--color-surface-1))] p-8 pt-20 text-[rgb(var(--color-text-primary))]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-bold">The AMANDAVERSE</h2>
                    <p className="text-[rgb(var(--color-text-secondary)/0.8)]">
                      creating an exclusive space
                    </p>
                  </div>
                  {/* The Button component's 'primary' variant will use the brand colors */}
                  <Button variant="primary">Message</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[rgb(var(--color-text-primary))]">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">More ways to get paid</h2>
          <p className="mt-6 text-lg md:text-xl leading-relaxed">
            Not only can you earn recurring income on Vybzz Nation through paid membership, you can
            also sell bonus episodes, archived seasons, and more to all of your fans in your
            personal online shop.
          </p>
        </div>
      </div>
    </Section>
  )
}

export default GetPaid

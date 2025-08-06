// src/components/PodcastersPage/GetToKnow.tsx
import React from 'react'
import Section from '../Shared/Section'

const GetToKnow: React.FC = () => {
  return (
    <Section id="features" className="bg-[#596FE3]">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="text-white">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Get to know your listeners
          </h2>
          <p className="mt-6 text-lg md:text-xl leading-relaxed">
            Hang out in real-time community group chats, stay close through DMs and comments, or
            even reach out directly over email. Explore fan profiles to get to know the people
            behind all the love.
          </p>
        </div>
        <div className="relative h-[550px] w-full max-w-sm mx-auto">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20 transform -rotate-3 transition-transform duration-500 hover:rotate-0">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="font-bold text-lg text-white">Comments</h3>
              <span className="text-white text-2xl font-thin">&times;</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <img
                  src="https://picsum.photos/seed/mia/100/100"
                  alt="Avatar Mia"
                  className="w-10 h-10 rounded-full"
                />
                <div className="bg-black/40 rounded-2xl p-3 text-white">
                  <p className="font-semibold text-sm">Mia</p>
                  <p className="text-sm">Get ready for some cozy vibes! 🍂</p>
                  <div className="flex items-center gap-3 text-xs mt-2 text-slate-400">❤️ 5</div>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-[#E96424] rounded-2xl p-3 text-white">
                  <p className="font-semibold text-sm">
                    Rachel Makey{' '}
                    <span className="text-xs bg-black/20 px-1.5 py-0.5 rounded-full ml-1">
                      CREATOR
                    </span>
                  </p>
                  <p className="text-sm">Just got the sweetest package from a fan.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="https://picsum.photos/seed/loren/100/100"
                  alt="Avatar Loren"
                  className="w-10 h-10 rounded-full"
                />
                <div className="bg-black/40 rounded-2xl p-3 text-white">
                  <p className="font-semibold text-sm">Loren</p>
                  <p className="text-sm">More seasonal themes, please! 😍</p>
                  <div className="flex items-center gap-3 text-xs mt-2 text-slate-400">❤️ 5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default GetToKnow

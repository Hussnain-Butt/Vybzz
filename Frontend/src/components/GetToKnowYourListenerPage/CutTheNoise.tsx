// src/components/PodcastersPage/CutTheNoise.tsx
import React from 'react'
import { Play } from 'lucide-react'
import Section from '../Shared/Section'

const CutTheNoise: React.FC = () => {
  return (
    <Section id="cut-noise" className="bg-[#596FE3]">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative h-[550px] w-full max-w-sm mx-auto order-last lg:order-first">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-700 w-full h-full flex flex-col">
            <div className="flex items-center justify-between text-white p-2">
              <span className="text-xl font-bold">PATREON</span>
              <div className="flex items-center gap-3">
                <span>🎙️</span>
                <img
                  src="https://picsum.photos/seed/user/100/100"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border-2 border-cyan-400"
                />
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center text-center text-white">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-slate-600">
                <img
                  src="https://picsum.photos/seed/achewood/150/150"
                  alt="Creator Achewood"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">Achewood</h3>
            </div>
            <div className="mt-auto space-y-3">
              <div className="bg-slate-800/80 p-3 rounded-xl flex items-center gap-4">
                <div
                  className="relative w-24 h-16 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: "url('https://picsum.photos/seed/ui/300/200')" }}
                >
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white">Feel the UI in your hands</p>
                  <p className="text-sm text-slate-400">3 Days Ago</p>
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl">
                <p className="font-semibold text-white">New Message</p>
                <p className="text-sm text-slate-400">1 Day Ago - Achewood</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white order-first lg:order-last">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">Cut through the noise</h2>
          <p className="mt-6 text-lg md:text-xl leading-relaxed">
            Connect with your community in a single, intimate space free of gatekeeping algorithms
            and distracting ads, knowing that everything you post will be sent directly to
            listeners' feeds and inboxes, every time.
          </p>
        </div>
      </div>
    </Section>
  )
}

export default CutTheNoise

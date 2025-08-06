// src/components/PodcastersPage/GetPaid.tsx
import React from 'react'
import Section from '../Shared/Section'
import Button from '../Shared/Button'

const GetPaid: React.FC = () => {
  return (
    <Section id="pricing" className="bg-[#596FE3]">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div
          className="relative h-[550px] w-full max-w-2xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          <div className="w-full h-full bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700 flex overflow-hidden transition-transform duration-700 hover:[transform:rotateY(5deg)]">
            {/* Sidebar */}
            <div className="w-1/4 bg-black/20 p-4 border-r border-slate-800">
              <div className="space-y-3 text-sm">
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-700 text-white"
                >
                  <span>🏠</span> Recent
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <span>🔍</span> Find
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <span>💬</span> Messages
                </a>
                <div className="pt-4 border-t border-slate-800 mt-4">
                  <a
                    href="#"
                    className="flex items-center gap-2 p-2 rounded-lg bg-pink-500/20 text-white"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-[-50px] left-8">
                  <img
                    src="https://picsum.photos/seed/amanda/150/150"
                    alt="Creator Amanda Seales"
                    className="w-24 h-24 rounded-full border-4 border-slate-900"
                  />
                </div>
              </div>
              <div className="flex-grow bg-slate-900 p-8 pt-20 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-bold">The AMANDAVERSE</h2>
                    <p className="text-slate-400">creating an exclusive space</p>
                  </div>
                  <Button variant="primary">Message</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">More ways to get paid</h2>
          <p className="mt-6 text-lg md:text-xl leading-relaxed">
            Not only can you earn recurring income on Patreon through paid membership, you can also
            sell bonus episodes, archived seasons, and more to all of your fans in your personal
            online shop.
          </p>
        </div>
      </div>
    </Section>
  )
}

export default GetPaid

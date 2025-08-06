// src/pages/Podcasters/GetToKnowYourListeners.tsx
import React from 'react'

// Import all the section components
import PodcastersHero from '../../components/GetToKnowYourListenerPage/PodcastersHero'
import GetToKnow from '../../components/GetToKnowYourListenerPage/GetToKnow'
import CutTheNoise from '../../components/GetToKnowYourListenerPage/CutTheNoise'
import Testimonial from '../../components/GetToKnowYourListenerPage/Testimonial'
import GetPaid from '../../components/GetToKnowYourListenerPage/GetPaid'
import OtherPodcasters from '../../components/GetToKnowYourListenerPage/OtherPodcasters'

// This is the main component for the /creators/podcasters/listeners route
const GetToKnowYourListeners: React.FC = () => {
  return (
    // Your App.tsx will provide the Header and Footer
    // This main container sets the theme for the entire page
    <div className="bg-slate-900 font-sans">
      <main>
        <PodcastersHero />
        <GetToKnow />
        <CutTheNoise />
        <Testimonial />
        <GetPaid />
        <OtherPodcasters />
      </main>
    </div>
  )
}

export default GetToKnowYourListeners

import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import CreativitySection from '../components/CreativitySection'
import CreativeControlSection from '../components/CreativeControlSection'
import TestimonialQuote from '../components/TestimonialQuote'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CreativitySection />
      <CreativeControlSection />
      <TestimonialQuote />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default Landing

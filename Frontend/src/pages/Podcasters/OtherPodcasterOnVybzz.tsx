// src/pages/OtherPodcasterOnVybzz.jsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaPlay, FaMicrophoneAlt, FaUsers, FaQuoteLeft } from 'react-icons/fa'
import { BiCategory } from 'react-icons/bi'

gsap.registerPlugin(ScrollTrigger)

// --- Mock Data ---
const featuredPodcasters = [
  {
    name: 'Aisha Khan',
    podcast: 'The Midnight Monologue',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&q=80',
    description: 'Exploring stories of life, art, and the human condition after dark.',
  },
  {
    name: 'Rohan Verma',
    podcast: 'Startup Stories',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=80',
    description: "In-depth interviews with the founders of tomorrow's biggest companies.",
  },
  {
    name: 'Priya Singh',
    podcast: 'Tech Simplified',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&q=80',
    description: 'Making complex technology understandable for everyone.',
  },
]

const categories = ['Technology', 'Comedy', 'Business', 'True Crime', 'Health', 'Storytelling']

const testimonials = [
  {
    quote:
      'The variety of podcasters on Vybzz is amazing. I discover a new favorite show every week!',
    author: 'Sameer Gupta',
  },
  {
    quote:
      'High-quality production and authentic conversations. Vybzz Nation is my go-to platform for podcasts.',
    author: 'Neha Sharma',
  },
  {
    quote: "I love the community features. It feels like I'm part of a bigger conversation.",
    author: 'Arjun Reddy',
  },
]

const OtherPodcasterOnVybzz = () => {
  const main = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // HERO
      gsap.from('.hero-title', { duration: 1, y: 50, opacity: 0, ease: 'power3.out', delay: 0.2 })
      gsap.from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.4,
      })
      gsap.from('.hero-button', { duration: 1, y: 50, opacity: 0, ease: 'power3.out', delay: 0.6 })

      // SECTIONS fade-up on enter
      gsap.utils.toArray('.animated-section').forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 100,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true, // ensure it runs and then leaves elements visible
          },
          immediateRender: false,
        })
      })

      // FEATURED PODCASTERS CARDS
      gsap.from('.podcaster-card', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.featured-podcasters-grid',
          start: 'top 95%', // fire a bit earlier
          once: true,
        },
        immediateRender: false, // don't set opacity:0 until trigger fires
      })

      // CATEGORIES
      gsap.from('.category-card', {
        opacity: 0,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.categories-grid',
          start: 'top 95%',
          once: true,
        },
        immediateRender: false,
      })

      // TESTIMONIALS
      gsap.from('.testimonial-card', {
        opacity: 0,
        x: -50,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 95%',
          once: true,
        },
        immediateRender: false,
      })

      // make sure ST measures correctly after images load
      setTimeout(() => ScrollTrigger.refresh(), 100)
    }, main)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={main} className="bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-slate-800 to-slate-950 px-6">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="text-center z-10">
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">
            Discover Voices That Resonate
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Explore a universe of captivating podcasts on Vybzz Nation. From untold stories to
            expert insights, find your next favorite creator right here.
          </p>
          <button className="hero-button bg-blue-500 hover:bg-blue-400 transition-transform hover:scale-105 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg">
            Explore Podcasters
          </button>
        </div>
      </section>

      {/* Section 2: Featured Podcasters */}
      <section className="py-20 px-6 animated-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Podcasters</h2>
          <div className="featured-podcasters-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPodcasters.map((podcaster, index) => (
              <div
                key={index}
                className="podcaster-card group bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={podcaster.image}
                  alt={podcaster.name}
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-100">{podcaster.name}</h3>
                  <p className="text-md text-cyan-300 mb-2">{podcaster.podcast}</p>
                  <p className="text-slate-300">{podcaster.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Browse By Category */}
      <section className="py-20 px-6 bg-slate-900 animated-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Browse By Category</h2>
          <div className="categories-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-card group flex flex-col items-center justify-center p-6 bg-slate-800 rounded-lg cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:-translate-y-2 hover:text-slate-900"
              >
                <BiCategory className="text-4xl mb-2 text-pink-400 transition-colors group-hover:text-white" />
                <span className="font-semibold text-center">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: The Vybzz Nation Difference */}
      <section className="py-24 px-6 animated-section">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            The <span className="text-orange-400">Vybzz Nation</span> Difference
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-16">
            We're more than a platform. We are a community dedicated to amplifying diverse voices
            and fostering high-quality content.
          </p>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-800 p-5 rounded-full mb-4">
                <FaMicrophoneAlt className="text-3xl text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Creator Focused</h3>
              <p className="text-slate-300">
                Tools, resources, and support to help podcasters thrive and reach new audiences.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-800 p-5 rounded-full mb-4">
                <FaPlay className="text-3xl text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
              <p className="text-slate-300">
                Access exclusive shows and high-fidelity audio you won't find anywhere else.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-800 p-5 rounded-full mb-4">
                <FaUsers className="text-3xl text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Engaged Community</h3>
              <p className="text-slate-300">
                Connect with fellow listeners and your favorite creators through interactive
                features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: What Our Listeners Say */}
      <section className="py-20 px-6 bg-slate-900 animated-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Listeners Say</h2>
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card bg-slate-800 p-8 rounded-xl border-l-4 border-orange-400"
              >
                <FaQuoteLeft className="text-3xl text-orange-400 mb-4" />
                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                <p className="font-bold text-right text-slate-100">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="py-24 px-6 animated-section">
        <div className="max-w-4xl mx-auto text-center bg-slate-8 00 p-12 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Have a Story to Tell?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Join a growing community of creators on Vybzz Nation. We provide the platform, you
            provide the passion. Let's make something amazing together.
          </p>
          <button className="bg-pink-500 hover:bg-pink-400 transition-transform hover:scale-105 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg">
            Start Your Podcast on Vybzz
          </button>
        </div>
      </section>
    </div>
  )
}

export default OtherPodcasterOnVybzz

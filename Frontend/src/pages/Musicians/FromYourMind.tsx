import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP ko ScrollTrigger plugin ke saath register karein
gsap.registerPlugin(ScrollTrigger)

// Naye, behtar SVG Icons
const ArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
)

const FromYourMind = () => {
  const mainRef = useRef(null)
  const heroRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Section Parallax & Intro Animation
      gsap.to(heroRef.current, {
        backgroundPosition: `50% 100%`,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true, // Parallax effect ke liye
        },
      })

      gsap.from('.hero-line', {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power4.out',
      })

      // 2. Section Animation
      const sections = gsap.utils.toArray('.animated-section')
      sections.forEach((section) => {
        const elems = section.querySelectorAll('.anim-element')
        gsap.from(elems, {
          opacity: 0,
          y: 80,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2, // Har element ek ke baad ek aayega
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={mainRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))]"
    >
      {/* Section 1: Hero - The Spark */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center text-center p-8 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="overflow-hidden pb-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight hero-line">
              From <span className="text-[rgb(var(--color-primary-cyan))]">Your Mind</span>
            </h1>
          </div>
          <div className="overflow-hidden pb-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight hero-line">
              To <span className="text-[rgb(var(--color-accent-pink))]">Their Ears</span>
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[rgb(var(--color-text-secondary))] mt-4 hero-line">
              We transform your raw inspiration into professionally produced music that connects
              with the world.
            </p>
          </div>
        </div>
        <div className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-[rgb(var(--color-text-muted))] hero-line">
          <span>Scroll Down</span>
          <ArrowDownIcon />
        </div>
      </section>

      {/* Section 2: The Genesis - Crafting the Idea */}
      <section className="py-24 px-8 animated-section bg-[rgb(var(--color-surface-1))]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="anim-element">
            <img
              src="https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=2070&auto=format&fit=crop"
              alt="Crafting a song"
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-primary-blue))] anim-element">
              01. The Genesis
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold my-4 anim-element">
              Where Ideas Take Form
            </h3>
            <p className="text-lg text-[rgb(var(--color-text-secondary))] leading-relaxed anim-element">
              Every great track begins with a single note, a lyrical phrase, or a rhythmic idea. We
              provide the creative environment and expert guidance to help you capture that fleeting
              moment of inspiration and build it into a solid foundation for your next masterpiece.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Forge - In the Studio */}
      <section
        className="py-32 px-8 bg-cover bg-center bg-fixed animated-section"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590602843625-3d5a2334acec?q=80&w=1974&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-[rgb(var(--color-background-dark))] opacity-80"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-accent-pink))] anim-element">
            02. The Forge
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold my-4 anim-element">
            Engineering Your Sound
          </h3>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] leading-relaxed anim-element">
            This is where the magic is recorded. With state-of-the-art equipment and acoustically
            perfect rooms, our studio is your sonic playground. We focus on capturing the highest
            quality audio, preserving the emotion and energy of your performance.
          </p>
        </div>
      </section>

      {/* Section 4: The Polish - Mix & Master */}
      <section className="py-24 px-8 animated-section bg-[rgb(var(--color-surface-1))]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-accent-orange))] anim-element">
              03. The Polish
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold my-4 anim-element">
              Clarity, Punch, and Power
            </h3>
            <p className="text-lg text-[rgb(var(--color-text-secondary))] leading-relaxed anim-element">
              Our world-class engineers will meticulously mix and master your tracks. We balance
              every element, enhance the dynamics, and ensure your music sounds incredible on any
              platform—from tiny earbuds to massive festival sound systems. This is the final polish
              that makes your music shine.
            </p>
          </div>
          <div className="anim-element">
            <img
              src="https://images.unsplash.com/photo-1617886322207-6f504e7472c5?q=80&w=1964&auto=format&fit=crop"
              alt="Mixing console"
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 5: The Reach - To The World */}
      <section className="py-24 px-8 text-center bg-[rgb(var(--color-surface-2))] animated-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-primary-cyan))] anim-element">
            04. The Reach
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold my-4 anim-element">
            Connect With Your Audience
          </h3>
          <p className="text-xl text-[rgb(var(--color-text-secondary))] leading-relaxed mb-12 anim-element">
            The final step is the most rewarding: sharing your art. Your journey from a simple idea
            to a finished track culminates in the moment a listener connects with your music. Your
            mind, their ears—one shared human experience.
          </p>
          <div className="anim-element">
            <button className="bg-[rgb(var(--color-primary-blue))] text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[rgb(var(--color-primary-blue)/0.2)]">
              Start Your Musical Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FromYourMind

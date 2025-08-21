import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiFilm, FiMusic, FiCamera, FiEdit3, FiEye, FiBarChart2, FiLayers } from 'react-icons/fi'

// GSAP ko ScrollTrigger plugin ke saath register karein
gsap.registerPlugin(ScrollTrigger)

const ShowCaseYourWork = () => {
  const mainRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const galleryItems = [
    {
      id: 1,
      category: 'Video',
      title: 'Cyberpunk Dreams',
      image:
        'https://images.unsplash.com/photo-1661715328971-83cd2179df82?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      category: 'Art',
      title: 'Abstract Dimensions',
      image:
        'https://images.unsplash.com/photo-1635832269626-14cad5052371?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      category: 'Music',
      title: 'Midnight Lo-fi',
      image:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 4,
      category: 'Art',
      title: 'Digital Sculpture',
      image:
        'https://images.unsplash.com/photo-1751723349999-bed57534130f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 5,
      category: 'Video',
      title: "Nature's Timelapse",
      image:
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 6,
      category: 'Music',
      title: 'Synthwave Escape',
      image:
        'https://images.unsplash.com/photo-1617994452722-4145e196248b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ]

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Hero Section Animation ---
      gsap.from('.hero-element', {
        duration: 1.2,
        y: 60,
        opacity: 0,
        stagger: 0.2,
        ease: 'power4.out',
      })

      // --- Features Section Animation ---
      const featureCards = gsap.utils.toArray('.feature-card')
      featureCards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          duration: 1,
          scale: 0.95,
          y: 50,
          opacity: 0,
          ease: 'expo.out',
        })
      })

      // --- Gallery Animation ---
      gsap.from('.gallery-item', {
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 80%',
        },
        duration: 0.8,
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, mainRef)

    // Re-run animations on category change
    // This is a simplified way; for complex transitions, a library like Flip would be ideal
    gsap.fromTo(
      '.gallery-item-filtered',
      { opacity: 0, scale: 0.8 },
      { duration: 0.5, opacity: 1, scale: 1, stagger: 0.05, ease: 'power3.out' },
    )

    return () => ctx.revert()
  }, [activeCategory])

  const features = [
    {
      icon: <FiLayers className="h-10 w-10 text-[rgb(var(--color-primary-cyan))]" />,
      title: 'High-Fidelity Media',
      description:
        'Upload your work in stunning quality. We support 4K video, lossless audio, and high-resolution images.',
    },
    {
      icon: <FiEye className="h-10 w-10 text-[rgb(var(--color-accent-pink))]" />,
      title: 'Interactive Galleries',
      description:
        'Engage your audience with carousels, lookbooks, and dynamic displays that bring your portfolio to life.',
    },
    {
      icon: <FiBarChart2 className="h-10 w-10 text-[rgb(var(--color-accent-orange))]" />,
      title: 'Deep Analytics',
      description:
        'Understand your audience better. Track views, engagement, and see what resonates with your fans.',
    },
  ]

  return (
    <div
      ref={mainRef}
      className="bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] overflow-hidden"
    >
      {/* --- Hero Section --- */}
      <section className="relative min-h-[80vh] flex items-center justify-center p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-surface-1))] to-[rgb(var(--color-background-dark))] opacity-60"></div>
        <div className="absolute inset-0 grain-bg opacity-5"></div>

        <div className="z-10 relative">
          <h1 className="text-5xl md:text-7xl font-extrabold hero-element">
            Your Work, Your Stage
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl text-[rgb(var(--color-text-secondary))] hero-element">
            Vybzz Nation is the ultimate canvas for creators. Present your talent in the highest
            fidelity and captivate your audience like never before.
          </p>
        </div>
      </section>

      {/* --- Gallery Showcase Section --- */}
      <section className="py-20 md:py-28 px-6">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-12">
            {['All', 'Video', 'Art', 'Music'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[rgb(var(--color-primary-blue))] text-white'
                    : 'bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="gallery-item-filtered group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[rgb(var(--color-text-secondary))] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Beyond Portfolio Section --- */}
      <section className="py-20 md:py-28 px-6 bg-[rgb(var(--color-surface-1))]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">More Than a Portfolio</h2>
            <p className="mt-4 text-lg text-[rgb(var(--color-text-muted))] max-w-xl mx-auto">
              Powerful tools to enhance how you present and track your work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-[rgb(var(--color-background-dark))] p-10 rounded-2xl border border-[rgb(var(--color-surface-2))] text-center flex flex-col items-center"
              >
                <div className="flex justify-center items-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[rgb(var(--color-text-secondary))]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-extrabold">
            Your Masterpiece Awaits
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-accent-pink))]">
              {' '}
              Its Stage
            </span>
          </h2>
          <p className="mt-6 text-xl text-[rgb(var(--color-text-secondary))]">
            Don't let your best work go unnoticed. Give it the spotlight it deserves on Vybzz
            Nation.
          </p>
          <button className="mt-12 px-10 py-4 bg-white text-[rgb(var(--color-background-dark))] font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 text-lg">
            Upload Your First Piece
          </button>
        </div>
      </section>
    </div>
  )
}

export default ShowCaseYourWork

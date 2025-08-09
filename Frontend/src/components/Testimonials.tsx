// src/components/PodcastersPage/Testimonials.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Data for the testimonials
const testimonialsData = [
  {
    name: 'Sarah Chen',
    role: 'Digital Artist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    content:
      'Vybzz Nation has completely transformed my creative career. I now have a steady income that allows me to focus on what I love most.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Podcast Creator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    content:
      'The analytics and insights help me understand my audience better. My subscriber count has grown 300% since joining.',
    rating: 5,
  },
  {
    name: 'Emily Thompson',
    role: 'Writer & Blogger',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    content:
      "Being able to offer different membership tiers has helped me build a diverse community of supporters. It's been amazing!",
    rating: 5,
  },
  {
    name: 'David Lee',
    role: 'Musician',
    avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=200&h=200&fit=crop',
    content:
      'The direct connection with my fans is priceless. Their support fuels my passion and creativity every single day.',
    rating: 5,
  },
]

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Animate title and paragraph
    const title = section.querySelector('.section-title')
    const paragraph = section.querySelector('.section-paragraph')
    if (title && paragraph) {
      gsap.fromTo(
        [title, paragraph],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        },
      )
    }

    // Infinite marquee animation
    const marquee = marqueeRef.current
    if (marquee) {
      const testimonials = Array.from(marquee.children)
      const timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })

      gsap.set(marquee, { xPercent: 0 })

      // Calculate the total width of the original set of testimonials
      const singleSetWidth = testimonials.slice(0, testimonials.length / 2).reduce(
        (acc, el) => acc + (el as HTMLElement).offsetWidth + 24, // 24 is for space-x-6
        0,
      )

      timeline.to(marquee, {
        x: -singleSetWidth, // Animate by the width of one set
        duration: testimonialsData.length * 5, // Adjust duration to control speed
      })

      // Pause animation on hover
      marquee.addEventListener('mouseenter', () => timeline.pause())
      marquee.addEventListener('mouseleave', () => timeline.play())
    }
  }, [])

  // Duplicate testimonials for a seamless loop
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData]

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[rgb(var(--color-background-dark))] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="section-title text-5xl sm:text-6xl font-extrabold text-[rgb(var(--color-text-primary))] mb-4 tracking-tight">
            Creators love our platform
          </h2>
          <p className="section-paragraph text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators who have built successful businesses with our platform.
          </p>
        </div>
      </div>

      {/* Infinite Scrolling Testimonials */}
      <div className="relative w-full overflow-hidden group">
        <div ref={marqueeRef} className="flex space-x-6">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card flex-shrink-0 w-[400px] bg-[rgb(var(--color-surface-2)/0.4)] backdrop-blur-lg rounded-2xl p-8 border border-[rgb(var(--color-surface-3)/0.5)] shadow-2xl shadow-[rgb(var(--color-background-dark)/0.5)] transition-all duration-300 group-hover:[animation-play-state:paused] hover:!bg-[rgb(var(--color-surface-2)/0.6)] hover:border-[rgb(var(--color-text-link)/0.5)]"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-[rgb(var(--color-text-link))] fill-[rgb(var(--color-text-link))]"
                  />
                ))}
              </div>

              <p className="text-[rgb(var(--color-text-secondary))] mb-6 leading-relaxed h-24">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-[rgb(var(--color-surface-3))]"
                />
                <div>
                  <h4 className="font-bold text-[rgb(var(--color-text-primary))] text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-[rgb(var(--color-text-secondary)/0.8)] text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

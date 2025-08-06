import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Assuming you have a reusable Button component like this.
// If not, you can replace this with standard <button> elements.
const Button: React.FC<any> = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const professionalFont = "'Inter', sans-serif"

const CTA: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Background parallax/zoom effect
    gsap.fromTo(
      bgImageRef.current,
      { scale: 1.1 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      },
    )

    // Animate content on scroll
    const contentElements = gsap.utils.toArray<HTMLElement>('.cta-element', contentRef.current)
    gsap.fromTo(
      contentElements,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      },
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden"
      style={{ fontFamily: professionalFont }}
    >
      {/* Background with parallax effect */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80)',
        }} // A cool, abstract background
      />
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,80,120,0.3),_transparent_70%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div
          ref={contentRef}
          className="bg-slate-800/40 backdrop-blur-xl p-8 sm:p-12 rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/50"
        >
          <h2 className="cta-element text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to start your creative journey?
          </h2>

          <p className="cta-element text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who are already earning a living doing what they love. Start
            building your community today.
          </p>

          <div className="cta-element flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform-gpu flex items-center justify-center gap-2">
              Get started for free
              <ArrowRight size={20} />
            </Button>

            <Button className="w-full sm:w-auto border-2 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500">
              Learn more
            </Button>
          </div>

          <p className="cta-element text-slate-400 text-sm mt-8">
            No setup fees • Cancel anytime • 5% platform fee
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA

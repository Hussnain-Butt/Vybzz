import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Lock, BarChart3, CreditCard, LucideProps } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const professionalFont = "'Inter', sans-serif"

interface Feature {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  title: string
  description: string
}

const featuresData: Feature[] = [
  {
    icon: Users,
    title: 'Membership Tiers',
    description:
      'Create multiple subscription tiers with different perks and pricing to cater to all your fans, from casual followers to your biggest supporters.',
  },
  {
    icon: Lock,
    title: 'Exclusive Content',
    description:
      'Share premium content, early access, and behind-the-scenes material. Your work is protected and only available to your paying members.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track your growth, understand your audience demographics, and optimize your content strategy with detailed, easy-to-understand insights.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description:
      'Get paid reliably and on time with our secure, global payment processing. We handle the complexities so you can focus on creating.',
  },
]

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyColumnRef = useRef<HTMLDivElement>(null)
  const contentColumnRef = useRef<HTMLDivElement>(null)

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

    // Sticky scrolling feature highlight
    const featureSelectors = gsap.utils.toArray<HTMLElement>('.feature-selector')
    const featurePanels = gsap.utils.toArray<HTMLElement>('.feature-panel')

    featurePanels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => featureSelectors[i].classList.add('active'),
        onLeave: () => featureSelectors[i].classList.remove('active'),
        onEnterBack: () => featureSelectors[i].classList.add('active'),
        onLeaveBack: () => featureSelectors[i].classList.remove('active'),
      })

      // Animate each panel as it comes into view
      gsap.fromTo(
        panel,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
          },
        },
      )
    })
  }, [])

  return (
    <>
      {/* Style for the active feature selector */}
      <style>{`
        .feature-selector.active {
          background-color: rgba(0, 255, 255, 0.05);
          border-color: rgba(0, 255, 255, 0.3);
        }
        .feature-selector.active h3, .feature-selector.active .feature-icon {
          color: #22d3ee; /* cyan-400 */
        }
      `}</style>

      <section
        ref={sectionRef}
        id="features"
        className="py-24 sm:py-32 bg-slate-950"
        style={{ fontFamily: professionalFont }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="section-title text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="section-paragraph text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Build a sustainable creative business with tools designed for creators, by creators.
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Left Sticky Column (Feature List) */}
            <div ref={stickyColumnRef} className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <ul className="space-y-4">
                  {featuresData.map((feature, index) => (
                    <li
                      key={index}
                      data-feature-index={index}
                      className="feature-selector p-6 bg-slate-900/50 rounded-xl border border-transparent transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <feature.icon className="feature-icon w-8 h-8 text-slate-400 transition-colors duration-300" />
                        <h3 className="text-xl font-bold text-white transition-colors duration-300">
                          {feature.title}
                        </h3>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Scrolling Column (Feature Panels) */}
            <div ref={contentColumnRef} className="lg:col-span-8 mt-16 lg:mt-0">
              <div className="space-y-20">
                {featuresData.map((feature, index) => (
                  <div
                    key={index}
                    className="feature-panel min-h-[400px] flex flex-col justify-center p-8 bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/50"
                  >
                    <div className="w-20 h-20 mb-8 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-400/30">
                      <feature.icon className="w-10 h-10 text-cyan-300" />
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-lg text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Features

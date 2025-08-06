import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Twitter, Facebook, Instagram, Youtube, Linkedin, Globe, DollarSign } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const professionalFont = "'Inter', sans-serif"

// Data extracted from your provided image
const footerData = {
  creators: ['Podcasters', 'Video creators', 'Musicians', 'Artists', 'Game devs'],
  features: [
    'Create on your terms',
    'Where real community thrives',
    'Grow your community',
    'Support for your business',
    'Earning made easy',
    'Start a membership',
    'Set up a shop',
  ],
  pricing: ['Starting a Vybzz Nation is free'],
  resources: ['Creator Hub', 'Newsroom', 'Help Center & FAQ', 'Partners & Integrations', 'Mobile'],
  company: [
    'About',
    'Press',
    'Careers',
    'Terms of Use & policies',
    'Privacy policy',
    'Cookie policy',
    'Accessibility',
    'Impressum',
    'Brand assets & guidelines',
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = footerRef.current
    if (!section) return

    // Animate the footer content into view
    const columns = gsap.utils.toArray<HTMLElement>('.footer-column')
    const links = gsap.utils.toArray<HTMLElement>('.footer-link')
    const bottomElements = gsap.utils.toArray<HTMLElement>('.footer-bottom-element')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      columns,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
    )
      .fromTo(
        links,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, duration: 0.6, ease: 'power2.out' },
        '-=0.5',
      )
      .fromTo(
        bottomElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
        '-=0.3',
      )
  }, [])

  return (
    <footer
      ref={footerRef}
      className="bg-slate-950 text-white"
      style={{ fontFamily: professionalFont }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {Object.entries(footerData).map(([key, value]) => (
            <div key={key} className="footer-column">
              <h3 className="font-bold text-white capitalize mb-5">{key}</h3>
              <ul className="space-y-3">
                {value.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="footer-link text-slate-400 hover:text-cyan-300 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Language & Currency Selectors */}
            <div className="footer-bottom-element flex gap-2">
              <button className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700/80 transition-colors">
                <Globe size={16} />
                <span>English (United States)</span>
              </button>
              <button className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700/80 transition-colors">
                <DollarSign size={16} />
                <span>USD</span>
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="footer-bottom-element flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-slate-400 hover:text-cyan-300 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-bottom-element text-slate-500 text-sm mt-8">
            <p>
              600 Townsend Street, Suite 500 | San Francisco, CA 94103, USA | ©{' '}
              {new Date().getFullYear()} Vybzz Nation
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

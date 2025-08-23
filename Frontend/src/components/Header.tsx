// src/components/Header.tsx

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import SearchOverlay from './SearchOverlay'
import Logo from '../assets/Logo.png'
import { Link } from 'react-router-dom'

// --- Button component (no changes) ---
const Button: React.FC<any> = ({ children, className, ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
)

// --- Navigation items (hrefs replaced with '#') ---
const navItems = [
  { label: 'Creators', key: 'creators', dropdown: true },
  { label: 'Features', key: 'features', dropdown: true },
  { label: 'Pricing', key: 'pricing', dropdown: true },
  { label: 'Resources', key: 'resources', dropdown: false, href: '/resources' },
  { label: 'Updates', key: 'updates', dropdown: false, href: '/updates' },
]

// --- UPDATED Dropdown data with all hrefs replaced with '#' ---
const dropdownData = {
  creators: {
    categories: [
      {
        title: 'Podcasters',
        href: '#',
        links: [
          { label: 'Get to know your listeners', href: '/creators/podcasters/listeners' },
          { label: 'Cut through the noise', href: '/creators/podcasters/cutthrough' },
          { label: 'More ways to get paid', href: '/creators/podcasters/moveway' },
          {
            label: 'Other podcasters on Vybzz Nation',
            href: '/creators/podcasters/otherpodcaster',
          },
        ],
      },
      {
        title: 'Video creators',
        href: '#',
        links: [
          {
            label: 'Turn your viewers into your people',
            href: '/creators/videocreator/turnyourviewer',
          },
          { label: 'Reach every fan, every time', href: '/creators/videocreator/reachfan' },
          { label: 'More ways to get paid', href: '/creators/videocreator/moreway' },
          { label: 'Other video creators on Vybzz Nation', href: '/creators/videocreator/other' },
        ],
      },
      {
        title: 'Musicians',
        href: '#',
        links: [
          { label: 'From your mind to their ears', href: '/creators/musicians/fromyourmind' },
          { label: 'Share more than music', href: '/creators/musicians/sharemorethan' },
          { label: 'More ways to get paid', href: '/creators/musicians/moreway' },
          { label: 'Other musicians on Vybzz Nation', href: '/creators/musicians/other' },
        ],
      },
      // {
      //   title: 'Artists',
      //   href: '#',
      //   links: [
      //     { label: 'Earning made easy', href: '#' },
      //     { label: 'Create what inspires you', href: '#' },
      //     { label: 'Build community around your art', href: '#' },
      //     { label: 'Other artists on Vybzz Nation', href: '#' },
      //   ],
      // },
      // {
      //   title: 'Game devs',
      //   href: '#',
      //   links: [
      //     { label: 'A safe way to get paid', href: '#' },
      //     { label: 'Selling made simple', href: '#' },
      //     { label: 'Where real community thrives', href: '#' },
      //     { label: 'Other game devs on Vybzz Nation', href: '#' },
      //   ],
      // },
    ],
    featured: [
      {
        name: 'Issy Draws',
        img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80',
        href: '#',
      },
      {
        name: 'Kamauu',
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80',
        href: '#',
      },
      {
        name: 'Tina Yu',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
        href: '#',
      },
    ],
  },
  features: {
    categories: [
      {
        title: 'Create on your terms',
        href: '#',
        links: [
          {
            label: 'Getting started on Vybzz Nation',
            href: '/features/creatonyourteam/gettingstart',
          },
          { label: 'Make it your own', href: '/features/creatonyourteam/makeityourown' },
          { label: 'Reach every fan, every time', href: '/features/creatonyourteam/reacheveryfan' },
          { label: 'Showcase your work', href: '/features/creatonyourteam/showcase' },
        ],
      },
      {
        title: 'Build real community',
        href: '#',
        links: [
          { label: 'Every post, every time', href: '/features/buildcommunity/everyposteverytime' },
          {
            label: 'More ways to stay close',
            href: '/features/creatonyourteam/morewaytostayclose',
          },
          { label: 'Get to know your fans', href: '/features/buildcommunity/gettoknows' },
        ],
      },
      {
        title: 'Expand your reach',
        href: '#',
        links: [
          { label: 'Bring in new fans', href: '/features/expandyourreach/bringnewfans' },
          { label: 'Unlock growth', href: '/features/expandyourreach/unlockgrowth' },
          { label: 'App integrations', href: '/features/expandyourreach/appintegration' },
        ],
      },
      // {
      //   title: 'Get business support',
      //   href: '#',
      //   links: [
      //     { label: 'Help when you need it', href: '#' },
      //     { label: 'Policies to protect you', href: '#' },
      //     { label: 'Payments powered by Vybzz Nation', href: '#' },
      //   ],
      // },
      // {
      //   title: 'Earning made easy',
      //   href: '#',
      //   links: [
      //     { label: 'Run a membership', href: '#' },
      //     { label: 'Sell digital products', href: '#' },
      //   ],
      // },
    ],
  },
  pricing: {
    categories: [
      {
        title: 'Starting a Vybzz Nation is free',
        href: '#',
        links: [
          { label: 'Powerful core features', href: '/prices/powerfullfeature' },
          { label: 'Earning made easy', href: '/prices/earningmode' },
          { label: 'Paid membership', href: '/prices/paidmembership' },
          { label: 'Commerce', href: '/prices/commerce' },
          { label: 'Payments powered by Vybzz Nation', href: '/prices/paymentpoweredby' },
        ],
      },
    ],
  },
}

// === UPDATED HEADER COMPONENT ===
const Header: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const leaveTimeout = useRef<number | null>(null)

  const openSearch = () => {
    setIsMenuOpen(false)
    setIsSearchOpen(true)
  }

  // GSAP header and nav items animation (no changes)
  useEffect(() => {
    const header = headerRef.current
    const navItems = navContainerRef.current?.children
    if (!header || !navItems) return

    gsap.fromTo(
      header,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    )
    gsap.fromTo(
      navItems,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.5 },
    )

    const handleScroll = () => {
      gsap.to(header, {
        backgroundColor: window.scrollY > 50 ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
        backdropFilter: window.scrollY > 50 ? 'blur(16px)' : 'blur(0px)',
        borderBottom:
          window.scrollY > 50 ? '1px solid rgba(45, 155, 255, 0.1)' : '1px solid transparent',
        duration: 0.45,
        ease: 'power3.out',
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile Menu animation (no changes)
  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        '.mobile-menu-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' },
      )
    } else {
      setOpenMobileDropdown(null)
    }
  }, [isMenuOpen])

  // Dropdown hover logic (no changes)
  const handleNavMouseEnter = (key?: string) => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
    if (key && dropdownData[key as keyof typeof dropdownData]) setActiveDropdown(key)
    else setActiveDropdown(null)
  }

  const handleNavMouseLeave = () => {
    leaveTimeout.current = window.setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleDropdownEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
  }

  // Function to render dropdowns (UPDATED with new data structure)
  const renderDropdown = (key: 'creators' | 'features' | 'pricing') => {
    if (activeDropdown !== key) return null
    let content
    const dropdownRef = (el: HTMLDivElement) => {
      if (el)
        gsap.fromTo(
          el,
          { opacity: 0, y: 15, scale: 0.98, filter: 'blur(5px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' },
        )
    }

    const renderLinks = (
      categories: { title: string; href: string; links: { label: string; href: string }[] }[],
      cols: number = 1,
    ) => (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-x-4 gap-y-8 w-full`}
      >
        {categories.map((cat) => (
          <div key={cat.title} className="min-w-0">
            <Link to={cat.href} className="text-cyan-300 font-bold text-base mb-3 block group">
              {cat.title}
              <span className="opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300">
                →
              </span>
            </Link>
            <div className="flex flex-col space-y-1 w-full">
              {cat.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="group flex items-center text-sm text-slate-300 hover:text-white transition-all duration-300 py-1 rounded-md -ml-2 px-2 hover:bg-blue-500/10"
                >
                  <span className="w-0 h-full bg-cyan-400 mr-2 group-hover:w-1 transition-all duration-300 ease-in-out"></span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    )

    switch (key) {
      case 'creators':
        content = (
          <div className="p-8 pt-7 ml-10">
            {renderLinks(dropdownData.creators.categories as any, 3)}
            <hr className="my-7 border-slate-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-start">
              {dropdownData.creators.featured.map((item) => (
                <div
                  key={item.name}
                  className="group relative rounded-xl p-px bg-slate-900 hover:bg-gradient-to-br from-cyan-400 to-blue-600 transition-all duration-300 transform-gpu hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <Link
                    to={item.href}
                    className="block rounded-[11px] overflow-hidden h-full bg-slate-900"
                  >
                    <div className="relative h-40">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:filter group-hover:brightness-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-white text-lg font-semibold transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
        break
      case 'features':
        content = (
          <div className="p-8 pt-7">{renderLinks(dropdownData.features.categories as any, 4)}</div>
        )
        break
      case 'pricing':
        content = (
          <div className="p-8 pt-7 max-w-md ">
            {renderLinks(dropdownData.pricing.categories as any, 1)}
          </div>
        )
        break
      default:
        content = null
    }
    return (
      <div
        ref={dropdownRef}
        onMouseEnter={handleDropdownEnter}
        onMouseLeave={handleNavMouseLeave}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-full max-w-[98vw] lg:w-[1200px] bg-slate-950/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-slate-800 z-50 overflow-hidden"
      >
        {content}
      </div>
    )
  }

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #1e293b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #06b6d4; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #22d3ee; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #06b6d4 #1e293b; }
        .dropdown-scrollbar::-webkit-scrollbar { width: 5px; }
        .dropdown-scrollbar::-webkit-scrollbar-track { background-color: transparent; }
        .dropdown-scrollbar::-webkit-scrollbar-thumb { background-color: #06b6d4; border-radius: 5px; }
        .dropdown-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #22d3ee; }
        .dropdown-scrollbar { scrollbar-width: thin; scrollbar-color: #06b6d4 transparent; }
      `}</style>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-5">
          <div className="relative flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="" className="w-12" />
                <span className="ml-3 text-2xl font-bold text-white tracking-tight">
                  Vybzz Nation
                </span>
              </Link>
            </div>
            <nav className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                ref={navContainerRef}
                className="flex items-center relative bg-slate-900/50 backdrop-blur-sm rounded-full p-1 shadow-lg shadow-black/20"
              >
                {navItems.map((item) => (
                  <div
                    key={item.key}
                    onMouseEnter={() => handleNavMouseEnter(item.dropdown ? item.key : undefined)}
                    onMouseLeave={handleNavMouseLeave}
                    className="relative px-4 py-2 cursor-pointer transition-all duration-200 rounded-full group"
                  >
                    <Link
                      to={item.href || '#'}
                      className={`transition-colors duration-300 text-slate-200 group-hover:text-white font-medium`}
                    >
                      {item.label}
                    </Link>
                    <div className="absolute left-4 right-4 bottom-1 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    {item.dropdown &&
                      renderDropdown(item.key as 'creators' | 'features' | 'pricing')}
                  </div>
                ))}
              </div>
            </nav>
            <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
              <Button
                onClick={openSearch}
                className="flex items-center p-2.5 text-slate-200 hover:text-white hover:bg-blue-500/10 font-medium rounded-full transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Link
                to="/login"
                className="text-slate-200 font-medium px-4 py-2 hover:text-white hover:bg-blue-500/10 rounded-full transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
            <button
              className="lg:hidden p-2 text-slate-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="custom-scrollbar lg:hidden border-t border-slate-800 bg-black/90 backdrop-blur-md overflow-y-auto max-h-[calc(100vh-5rem)]">
            <div className="px-2 pt-4 pb-6 space-y-1">
              {navItems.map((item) => (
                <div key={item.key} className="mobile-menu-item rounded-lg overflow-hidden">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenMobileDropdown((prev) => (prev === item.key ? null : item.key))
                        }
                        className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold transition-all duration-200 text-white hover:bg-blue-500/10 ${
                          openMobileDropdown === item.key ? 'bg-blue-500/10' : ''
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-300 ${
                            openMobileDropdown === item.key ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openMobileDropdown === item.key ? 'max-h-screen' : 'max-h-0'
                        }`}
                      >
                        <div className="dropdown-scrollbar overflow-y-auto max-h-[50vh] pt-2 pb-3 pl-5 pr-3 space-y-1 bg-slate-900/50">
                          {(
                            dropdownData[item.key as keyof typeof dropdownData] as any
                          ).categories.map((cat: any) => (
                            <div key={cat.title} className="py-1">
                              <Link
                                to={cat.href}
                                className="block px-2 text-sm font-semibold text-cyan-400 mb-1"
                              >
                                {cat.title}
                              </Link>
                              {cat.links.map((link: any) => (
                                <Link
                                  key={link.label}
                                  to={link.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block rounded-md px-2 py-2 text-slate-300 hover:bg-blue-500/10 hover:text-white"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href || '#'}
                      className={`block px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:bg-blue-500/10`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-800 mt-2 mx-2">
                <Button
                  onClick={openSearch}
                  className="mobile-menu-item w-full flex items-center justify-center gap-2 text-slate-200 font-medium px-4 py-3 hover:bg-blue-500/10 rounded-full"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Button>
                {/* === FIX START: Changed to Link component with correct path === */}
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mobile-menu-item w-full text-center text-slate-200 font-medium px-4 py-3 hover:bg-blue-500/10 rounded-full"
                >
                  Log in
                </Link>
                {/* === FIX START: Changed <a> to Link component === */}
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mobile-menu-item w-full text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold px-5 py-3 rounded-full"
                >
                  Get Started
                </Link>
                {/* === FIX END === */}
              </div>
            </div>
          </div>
        )}
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Header

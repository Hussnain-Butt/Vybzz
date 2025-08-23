import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { FaChevronDown } from 'react-icons/fa'

const MemberSettings = () => {
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640) // sm breakpoint

  const location = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const activeLinkRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { name: 'Basics', path: 'basics' },
    { name: 'Account', path: 'account' },
    { name: 'Email notifications', path: 'notifications' },
    { name: 'Memberships', path: 'memberships' },
    { name: 'Billing history', path: 'billing' },
  ]

  const moreTabs = [
    { name: 'Payment methods', path: 'payment-methods' },
    { name: 'Connected apps', path: 'connected-apps' },
    { name: 'Blocked users', path: 'blocked-users' },
  ]

  const allTabs = [...tabs, ...moreTabs]
  const isMoreTabActive = moreTabs.some((tab) => location.pathname.includes(tab.path))
  const activeTab = allTabs.find((tab) => location.pathname.includes(tab.path))

  // Screen size ko detect karne ke liye effect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Dropdown ke bahar click karne par use band karein
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
      if (
        isMoreMenuOpen &&
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen, isMoreMenuOpen])

  // GSAP Animation for active tab indicator (sirf desktop par)
  useEffect(() => {
    const activeElement = activeLinkRef.current
    const line = activeLineRef.current

    if (activeElement && line && !isMobile) {
      gsap.to(line, {
        width: activeElement.offsetWidth,
        x: activeElement.offsetLeft,
        duration: 0.4,
        ease: 'power3.inOut',
        opacity: 1,
      })
    } else if (line) {
      gsap.to(line, { opacity: 0, duration: 0.2 })
    }
  }, [location.pathname, isMobile])

  // GSAP Animation for page content
  useEffect(() => {
    const content = contentRef.current
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      )
    }
  }, [location.pathname])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
    setMoreMenuOpen(false)
  }

  return (
    <div className="bg-[rgb(var(--color-background-dark))] text-white min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* === Navigation Tabs === */}
        <nav className="relative border-b border-[rgb(var(--color-surface-2))]">
          {/* --- Desktop Navigation --- */}
          <div className="hidden sm:flex items-center space-x-4">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                ref={(el) => {
                  if (location.pathname.includes(tab.path)) {
                    activeLinkRef.current = el
                  }
                }}
                className={({ isActive }) =>
                  `py-4 px-4 text-sm font-bold transition-colors duration-300 whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-[rgb(var(--color-text-muted))] hover:text-white'
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
            {/* Desktop "More" Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                ref={(el) => {
                  if (isMoreTabActive) activeLinkRef.current = el
                }}
                onClick={() => setMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-bold transition-colors duration-300 ${
                  isMoreTabActive
                    ? 'text-white'
                    : 'text-[rgb(var(--color-text-muted))] hover:text-white'
                }`}
              >
                More
                <FaChevronDown
                  className={`transition-transform duration-200 text-xs ${
                    isMoreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isMoreMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[rgb(var(--color-surface-1))] rounded-lg shadow-2xl z-20 animate-fadeIn border border-[rgb(var(--color-surface-2))]">
                  <ul className="py-2">
                    {moreTabs.map((tab) => (
                      <li key={tab.name}>
                        <NavLink
                          to={tab.path}
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `block w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                              isActive
                                ? 'bg-[rgb(var(--color-primary-cyan))] text-white font-semibold'
                                : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                            }`
                          }
                        >
                          {tab.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* --- Mobile Navigation --- */}
          <div className="relative sm:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="flex justify-between items-center w-full py-4 text-left text-sm font-bold text-white"
            >
              <span>{activeTab?.name || 'Settings Menu'}</span>
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[rgb(var(--color-surface-1))] rounded-lg shadow-2xl z-20 animate-fadeIn border border-[rgb(var(--color-surface-2))]">
                <ul className="py-2">
                  {allTabs.map((tab) => (
                    <li key={tab.name}>
                      <NavLink
                        to={tab.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `block w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                            isActive
                              ? 'bg-[rgb(var(--color-primary-cyan))] text-white font-semibold'
                              : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                          }`
                        }
                      >
                        {tab.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Animated Active Line (Sirf Desktop par dikhega) */}
          <div
            ref={activeLineRef}
            className="absolute bottom-0 h-0.5 bg-white transition-opacity"
            style={{ opacity: 0 }}
          />
        </nav>

        {/* Content Outlet with animation */}
        <main ref={contentRef} className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MemberSettings

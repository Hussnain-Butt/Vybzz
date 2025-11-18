import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useUser } from '@clerk/clerk-react'
import {
  LuLayoutDashboard,
  LuLibrary,
  LuUsers,
  LuWallet,
  LuMegaphone,
  LuMessageSquare,
  LuBell,
  LuSettings,
  LuPlus,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuX,
} from 'react-icons/lu'
import { FaChartBar } from 'react-icons/fa'
import { FiMoreHorizontal } from 'react-icons/fi'
import ProfileMenu from './ProfileMenu'
import Logo from '../../assets/Logo.png'
import { getOwnCreatorProfile } from '../../api/apiClient' // API function import

type Item = {
  name: string
  path: string
  Icon: React.ComponentType<{ className?: string }>
}

const sidebarNavItems: Item[] = [
  { name: 'Dashboard', path: '/dashboard', Icon: LuLayoutDashboard },
  { name: 'Library', path: '/dashboard/library', Icon: LuLibrary },
  { name: 'Audience', path: '/dashboard/audience', Icon: LuUsers },
  { name: 'Insights', path: '/dashboard/insights', Icon: FaChartBar },
  { name: 'Payouts', path: '/dashboard/payouts', Icon: LuWallet },
  { name: 'Promotions', path: '/dashboard/promotions', Icon: LuMegaphone },
  { name: 'Community', path: '/dashboard/community', Icon: LuMessageSquare },
  { name: 'Notifications', path: '/dashboard/notifications', Icon: LuBell },
  { name: 'Settings', path: '/dashboard/settings', Icon: LuSettings },
]

interface SidebarProps {
  isCollapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  isMobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setCollapsed,
  isMobileOpen,
  setMobileOpen,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const sidebarRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const liRefs = useRef<(HTMLLIElement | null)[]>([])
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { user } = useUser()
  const [creatorImageUrl, setCreatorImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileForSidebar = async () => {
      try {
        const userData = await getOwnCreatorProfile()
        if (userData && userData.creatorProfile && userData.creatorProfile.profileImageUrl) {
          setCreatorImageUrl(userData.creatorProfile.profileImageUrl)
        }
      } catch (error) {
        console.error('Failed to fetch creator profile for sidebar:', error)
      }
    }
    fetchProfileForSidebar()
  }, [])

  const clerkImageUrl =
    user?.externalAccounts.find((acc) => acc.provider === 'oauth_google')?.imageUrl ||
    user?.profileImageUrl

  const displayImageUrl = creatorImageUrl || clerkImageUrl

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    const names = name.split(' ')
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  useEffect(() => {
    if (isCollapsed) setMenuOpen(false)
  }, [isCollapsed])

  useLayoutEffect(() => {
    const activeLi = liRefs.current.find((li) =>
      li?.querySelector('a')?.classList.contains('sb-active'),
    )
    if (activeLi && indicatorRef.current && !isCollapsed) {
      gsap.to(indicatorRef.current, {
        y: activeLi.offsetTop,
        height: activeLi.offsetHeight,
        duration: 0.3,
        ease: 'power3.out',
        opacity: 1,
      })
    } else if (indicatorRef.current) {
      gsap.to(indicatorRef.current, { opacity: 0, duration: 0.3 })
    }
  }, [location.pathname, isCollapsed, isMobileOpen])

  const handleLinkClick = () => {
    setMobileOpen(false)
  }

  return (
    <aside
      ref={sidebarRef}
      className={`
        flex h-screen flex-col bg-[rgb(var(--color-surface-1))] border-r border-[rgb(var(--color-surface-2))]
        transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0 z-40 w-64 transform 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center transition-all duration-300 ${
          isCollapsed ? 'justify-center px-2 pt-3 pb-2' : 'justify-between px-3 py-3'
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={Logo}
              alt="Logo"
              className="h-8 w-auto select-none pointer-events-none"
              draggable={false}
            />
            <h1 className="text-white font-semibold truncate">Vybzz Nation</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className={`${
            isCollapsed ? 'hidden' : 'hidden md:grid'
          } place-items-center w-12 h-12 rounded-2xl hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <LuPanelLeftClose size={20} />
        </button>
        {isCollapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden md:grid place-items-center w-12 h-12 rounded-2xl hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]"
            aria-label="Expand sidebar"
          >
            <LuPanelLeftOpen size={20} />
          </button>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 grid md:hidden h-10 w-10 place-items-center rounded-full hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]"
          aria-label="Close sidebar"
        >
          <LuX size={24} />
        </button>
      </div>

      {/* Scroll area - YAHAN BADLAV KIYA GAYA HAI: custom-scrollbar ko hide-scrollbar se replace kiya gaya hai */}
      <nav className="relative flex-1 overflow-y-auto hide-scrollbar min-h-0 overscroll-contain">
        {!isCollapsed && (
          <div
            ref={indicatorRef}
            className="absolute left-2 w-1 rounded-full bg-[rgb(var(--color-primary-blue))]/80 transition-opacity duration-300"
          />
        )}
        {/* YAHAN BADLAV KIYA GAYA HAI: Collapsed state mein padding ko consistent banaya gaya hai */}
        <ul className={`pt-2 pb-3 space-y-1 ${isCollapsed ? 'px-2' : 'px-3'} flex flex-col`}>
          {sidebarNavItems.map((item, index) => (
            <li
              key={item.name}
              ref={(el) => (liRefs.current[index] = el)}
              // YAHAN BADLAV KIYA GAYA HAI: li ko center karne ke liye extra classes hatayi gayi hain kyonki NavLink ab ise handle kar raha hai
            >
              <NavLink
                to={item.path}
                end
                onClick={handleLinkClick}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) => {
                  const base =
                    'flex items-center rounded-xl transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20'
                  // YAHAN BADLAV KIYA GAYA HAI: Collapsed state ke liye width aur centering ko direct NavLink par apply kiya gaya hai
                  const layout = isCollapsed
                    ? 'justify-center mx-auto w-12 h-12 rounded-2xl'
                    : 'justify-start gap-3 px-3 py-2.5'
                  const state = isActive
                    ? 'sb-active bg-[rgb(var(--color-surface-2))] text-white'
                    : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                  return `${base} ${layout} ${state}`
                }}
              >
                <item.Icon
                  className={`text-xl shrink-0 transition-transform duration-200 ${
                    isCollapsed ? 'group-hover:scale-110' : ''
                  }`}
                />
                <span
                  className={`text-[15px] font-medium tracking-wide transition-all duration-200 whitespace-nowrap ${
                    isCollapsed ? 'opacity-0 w-0 sr-only' : 'opacity-100'
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {/* YAHAN BADLAV KIYA GAYA HAI: Footer mein padding ko consistent banaya gaya hai */}
      <div className={`px-3 pb-4 pt-2 space-y-3 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <button
          title={isCollapsed ? 'Create' : undefined}
          className={`${
            isCollapsed
              ? 'mx-auto grid place-items-center w-12 h-12 rounded-2xl'
              : 'w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3'
          } font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-white text-black hover:bg-gray-200`}
        >
          <LuPlus className={`${isCollapsed ? 'text-xl' : 'text-base'} shrink-0`} />
          <span className={`${isCollapsed ? 'sr-only' : 'opacity-100'}`}>Create</span>
        </button>

        {/* Profile card */}
        <div
          className={`relative transition-colors duration-300 ${
            isCollapsed
              ? 'w-12 h-12 mx-auto'
              : 'flex items-center gap-3 rounded-2xl p-2 bg-[rgb(var(--color-surface-2))]'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-accent-orange))] grid place-items-center text-white font-bold shrink-0 overflow-hidden mx-auto">
            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt={user?.fullName || 'User profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(user?.fullName)}</span>
            )}
          </div>

          <div
            className={`min-w-0 flex-1 transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0 w-0 sr-only' : 'opacity-100'
            }`}
          >
            <div className="text-sm font-semibold text-white truncate">
              {user?.fullName || 'Creator'}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-muted))]">Creator</div>
          </div>

          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((s) => !s)}
            className={`p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-secondary))] hover:text-white transition-all duration-200 ${
              isCollapsed ? 'opacity-0 w-0 sr-only' : 'opacity-100 ml-auto'
            }`}
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <FiMoreHorizontal />
          </button>

          <ProfileMenu
            isOpen={isMenuOpen}
            onClose={() => setMenuOpen(false)}
            buttonRef={menuButtonRef}
          />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

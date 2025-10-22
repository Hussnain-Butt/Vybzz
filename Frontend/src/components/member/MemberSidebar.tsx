import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useUser, useClerk } from '@clerk/clerk-react'
import {
  LuSearch,
  LuBell,
  LuSettings,
  LuX,
  LuPanelLeftClose, // Collapse Icon
  LuPanelLeftOpen, // Expand Icon
} from 'react-icons/lu'
import { IoIosHome } from 'react-icons/io'
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2'
import { FaCircleNotch } from 'react-icons/fa'
import { CiCoffeeCup } from 'react-icons/ci'
import { FiMoreHorizontal } from 'react-icons/fi'
import Logo from '../../assets/Logo.png'
import ProfileMenu from '../dashboard/ProfileMenu'

type Item = {
  name: string
  path: string
  Icon: React.ComponentType<{ className?: string }>
}

const memberSidebarNavItems: Item[] = [
  { name: 'Home', path: '/member/home', Icon: IoIosHome },
  { name: 'Explore', path: '/member/explore', Icon: LuSearch },
  { name: 'Community', path: '/member/community', Icon: HiOutlineChatBubbleOvalLeftEllipsis },
  { name: 'Notifications', path: '/member/notifications', Icon: LuBell },
  { name: 'Settings', path: '/member/settings', Icon: LuSettings },
]

const recentlyVisitedItems = [
  { name: 'Digital Foundry', Icon: FaCircleNotch },
  { name: 'The Toast', Icon: CiCoffeeCup },
]

interface SidebarProps {
  isCollapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const MemberSidebar: React.FC<SidebarProps> = ({ isCollapsed, setCollapsed }) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isCreatorCardVisible, setCreatorCardVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const location = useLocation()
  const sidebarRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const liRefs = useRef<(HTMLLIElement | null)[]>([])
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const googleAccount = user?.externalAccounts.find((acc) => acc.provider === 'oauth_google')
  const displayImageUrl = googleAccount?.imageUrl || user?.profileImageUrl

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isCollapsed) setMenuOpen(false)
  }, [isCollapsed])

  useLayoutEffect(() => {
    const activeLiIndex = memberSidebarNavItems.findIndex((item) =>
      location.pathname.startsWith(item.path),
    )
    const activeLi = liRefs.current[activeLiIndex]

    if (activeLi && indicatorRef.current && !isCollapsed && !isMobile) {
      gsap.to(indicatorRef.current, {
        y: activeLi.offsetTop,
        height: activeLi.offsetHeight,
        duration: 0.4,
        ease: 'power3.inOut',
        opacity: 1,
      })
    } else if (indicatorRef.current) {
      gsap.to(indicatorRef.current, { opacity: 0, duration: 0.2 })
    }
  }, [location.pathname, isCollapsed, isMobile])

  const handleLinkClick = () => {
    if (isMobile) {
      setCollapsed(true)
    }
  }

  const closeSidebarOnBackdropClick = () => {
    setCollapsed(true)
  }

  const isSidebarVisible = isMobile ? !isCollapsed : true
  const isCurrentlyExpanded = isMobile ? true : !isCollapsed

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    const names = name.split(' ')
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <>
      {isMobile && isSidebarVisible && (
        <div
          onClick={closeSidebarOnBackdropClick}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`h-screen bg-[rgb(var(--color-surface-1))] text-[rgb(var(--color-text-primary))] border-r border-[rgb(var(--color-surface-2))] flex flex-col
          fixed md:relative inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isMobile ? 'transform' : ''}
          ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}
          ${isCollapsed && !isMobile ? 'w-[72px]' : 'w-64'}
        `}
      >
        <div
          className={`flex items-center transition-all duration-300 ${
            !isCurrentlyExpanded ? 'justify-center h-[76px]' : 'justify-between px-4 h-[76px]'
          }`}
        >
          {isCurrentlyExpanded && (
            <img src={Logo} alt="Logo" className="h-8 w-auto" draggable={false} />
          )}
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-[rgb(var(--color-surface-2))] hidden md:inline-flex"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <LuPanelLeftOpen size={20} /> : <LuPanelLeftClose size={20} />}
          </button>
        </div>

        <nav
          className="relative flex-1 overflow-y-auto custom-scrollbar min-h-0 overscroll-contain"
          style={{ scrollbarGutter: 'stable both-edges' } as any}
        >
          <div
            ref={indicatorRef}
            className="absolute left-[3px] w-[4px] rounded-full bg-[rgb(var(--color-primary-blue))] transition-opacity duration-300"
            style={{ opacity: !isCurrentlyExpanded ? 0 : 1 }}
          />
          <ul
            className={`pt-2 pb-3 space-y-1 ${
              !isCurrentlyExpanded ? 'px-2' : 'px-4'
            } flex flex-col`}
          >
            {memberSidebarNavItems.map((item, index) => (
              <li
                key={item.name}
                ref={(el) => (liRefs.current[index] = el)}
                className={`${!isCurrentlyExpanded ? 'flex justify-center' : ''}`}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/member/home'}
                  onClick={handleLinkClick}
                  title={!isCurrentlyExpanded ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center w-full rounded-lg transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-blue))] ${
                      !isCurrentlyExpanded
                        ? 'justify-center h-12 w-12 rounded-xl'
                        : 'justify-start gap-3.5 px-3 py-2.5'
                    } ${
                      isActive
                        ? 'sb-active bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-primary))]'
                        : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-[rgb(var(--color-text-primary))]'
                    }`
                  }
                >
                  <item.Icon className="text-2xl shrink-0" />
                  <span
                    className={`text-[15px] font-medium tracking-wide transition-opacity duration-200 whitespace-nowrap ${
                      !isCurrentlyExpanded ? 'opacity-0 w-0' : 'opacity-100'
                    }`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>

          {isCurrentlyExpanded && (
            <div className="px-4 pt-6 animate-fadeIn">
              <h3 className="text-xs font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wider px-3 mb-2">
                Recently Visited
              </h3>
              <ul className="space-y-1">
                {recentlyVisitedItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-[rgb(var(--color-text-primary))] transition-colors duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[rgb(var(--color-surface-2))] rounded-lg grid place-items-center shrink-0">
                        <item.Icon className="text-lg text-[rgb(var(--color-text-muted))]" />
                      </div>
                      <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        <div className="px-4 pb-4 pt-2 space-y-4 mt-auto">
          {isCurrentlyExpanded && isCreatorCardVisible && (
            <div className="bg-[rgb(var(--color-primary-blue))/10] border border-[rgb(var(--color-primary-blue))/20] p-4 rounded-xl text-left animate-fadeIn relative">
              <button
                onClick={() => setCreatorCardVisible(false)}
                className="absolute top-2.5 right-2.5 text-[rgb(var(--color-text-muted))] hover:text-white"
              >
                <LuX size={18} />
              </button>
              <h3 className="font-bold text-white text-[15px]">Become a creator</h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1 mb-3.5">
                You're almost there! Complete your page and take it live.
              </p>
              {/* === CHANGE IS HERE === */}
              <Link
                to="/auth-redirect?role=creator"
                onClick={handleLinkClick}
                className="w-full block text-center text-sm font-semibold bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Become a Creator
              </Link>
            </div>
          )}

          <div
            className={`relative flex items-center ${
              !isCurrentlyExpanded ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-primary-blue))] grid place-items-center text-white font-bold text-lg shrink-0 overflow-hidden">
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
                !isCurrentlyExpanded ? 'opacity-0 w-0' : 'opacity-100'
              }`}
            >
              <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate">
                {user?.fullName || 'User'}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-muted))]">Member</div>
            </div>
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen((s) => !s)}
              className={`p-1.5 rounded-md hover:bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-secondary))] hover:text-white transition-all duration-200 ${
                !isCurrentlyExpanded ? 'opacity-0 w-0 scale-0' : 'opacity-100 scale-100'
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
    </>
  )
}

export default MemberSidebar

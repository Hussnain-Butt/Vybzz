// src/components/dashboard/Sidebar.tsx
import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
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
} from 'react-icons/lu'
import { FaChartBar } from 'react-icons/fa'
import { FiMoreHorizontal } from 'react-icons/fi'
import ProfileMenu from './ProfileMenu'
import Logo from '../../assets/Logo.png'

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
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setCollapsed }) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const sidebarRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const liRefs = useRef<(HTMLLIElement | null)[]>([])
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // close menu when collapsing
  useEffect(() => {
    if (isCollapsed) setMenuOpen(false)
  }, [isCollapsed])

  // Animate active link indicator (visible only when expanded)
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
  }, [location.pathname, isCollapsed])

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setCollapsed(true)
  }

  return (
    <aside
      ref={sidebarRef}
      className={`h-screen bg-[rgb(var(--color-surface-1))] border-r border-[rgb(var(--color-surface-2))] flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header — logo shows only when expanded */}
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

        {/* Collapse button (when expanded) */}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className={`${
            isCollapsed ? 'hidden' : 'hidden md:grid'
          } place-items-center w-12 h-12 rounded-2xl hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <LuPanelLeftClose size={20} />
        </button>

        {/* Expand button (when collapsed) — centered square like other items */}
        {isCollapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden md:grid place-items-center w-12 h-12 rounded-2xl hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))]"
            aria-label="Expand sidebar"
          >
            <LuPanelLeftOpen size={20} />
          </button>
        )}
      </div>

      {/* Scroll area — stable gutter prevents layout jump on scrollbar appearance */}
      <nav
        className="relative flex-1 overflow-hidden custom-scrollbar min-h-0 overscroll-contain"
        style={{ scrollbarGutter: 'stable both-edges' as any }}
      >
        <div
          ref={indicatorRef}
          className="absolute left-2 w-1 rounded-full bg-[rgb(var(--color-primary-blue))]/80 transition-opacity duration-300"
        />
        <ul
          className={`pt-2 pb-3 space-y-1 ${
            isCollapsed ? 'px-0 items-center' : 'px-3'
          } flex flex-col`}
        >
          {sidebarNavItems.map((item, index) => (
            <li
              key={item.name}
              ref={(el) => (liRefs.current[index] = el)}
              className={`${isCollapsed ? 'w-full flex justify-center' : ''}`}
            >
              <NavLink
                to={item.path}
                end
                onClick={handleLinkClick}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) => {
                  const base =
                    'flex items-center rounded-xl transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20'
                  const expanded = 'justify-start gap-3 px-3 py-2.5'
                  const collapsed = 'justify-center w-12 h-12 p-0 rounded-2xl'
                  const state = isActive
                    ? 'sb-active bg-[rgb(var(--color-surface-2))] text-white'
                    : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                  return `${base} ${isCollapsed ? collapsed : expanded} ${state}`
                }}
              >
                <item.Icon
                  className={`text-xl shrink-0 transition-transform duration-200 ${
                    isCollapsed ? 'group-hover:scale-110' : ''
                  }`}
                />
                <span
                  className={`text-[15px] font-medium tracking-wide transition-all duration-200 whitespace-nowrap ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
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
      <div className="px-3 pb-4 pt-2 space-y-3">
        {/* Create button — circular when collapsed, full-width when expanded */}
        <button
          className={`${
            isCollapsed
              ? 'mx-auto grid place-items-center w-12 h-12 rounded-2xl'
              : 'w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3'
          } font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-white text-black hover:bg-gray-200`}
        >
          <LuPlus className={`${isCollapsed ? 'text-xl' : 'text-base'} shrink-0`} />
          <span className={`${isCollapsed ? 'sr-only' : 'opacity-100'}`}>Create</span>
        </button>

        {/* Profile card — relative so the absolute menu can anchor correctly */}
        <div
          className={`relative transition-colors ${
            isCollapsed
              ? 'w-12 h-12 mx-auto grid place-items-center rounded-2xl '
              : 'flex items-center gap-3 rounded-2xl p-2.5 bg-[rgb(var(--color-surface-2))] border border-[rgb(var(--color-surface-3))]'
          }`}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-accent-orange))] grid place-items-center text-white font-bold shrink-0">
            M
          </div>

          {/* Details hidden when collapsed */}
          <div
            className={`min-w-0 flex-1 transition-all duration-200 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            <div className="text-sm font-semibold text-white truncate">Muhammad H...</div>
            <div className="text-xs text-[rgb(var(--color-text-muted))]">Creator</div>
          </div>

          {/* Menu button */}
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((s) => !s)}
            className={`p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-secondary))] hover:text-white transition-all duration-200 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100 ml-auto'
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

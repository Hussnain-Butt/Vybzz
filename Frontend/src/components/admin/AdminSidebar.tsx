import React, { useLayoutEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  LuLayoutDashboard,
  LuUsers,
  LuSettings,
  LuLogOut,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from 'react-icons/lu'
import { FaChartBar } from 'react-icons/fa'
import { fakeAuth } from '../../pages/admin/AdminLoginPage'

type AdminNavItem = {
  name: string
  path: string
  Icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: AdminNavItem[] = [
  { name: 'Dashboard', path: '/admin-dashboard/dashboard', Icon: LuLayoutDashboard },
  { name: 'Users', path: '/admin-dashboard/users', Icon: LuUsers },
  { name: 'Analytics', path: '/admin-dashboard/analytics', Icon: FaChartBar },
  { name: 'Settings', path: '/admin-dashboard/settings', Icon: LuSettings },
]

interface AdminSidebarProps {
  isCollapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, setCollapsed }) => {
  const navigate = useNavigate()
  const sidebarRef = useRef<HTMLElement>(null)

  // NOTE: Humne yahan se `useLocation` aur `liRefs` ko hata diya hai kyunke
  // hum animation ko URL change par trigger nahi karna chahte.
  // Animation sirf component ke mount hone par chalegi.

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the list items
      gsap.from('.admin-nav-item', {
        // Hum yahan direct class selector use kar rahe hain
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.2, // Thoda delay add kiya taake content load ke baad animation ho
        ease: 'power3.out',
      })
    }, sidebarRef) // Scope animations to the sidebar element

    return () => ctx.revert() // Cleanup GSAP animations on component unmount
  }, []) // Dependency array ko khaali rakha hai taake yeh sirf mount par chale

  const handleLogout = () => {
    fakeAuth.signout(() => navigate('/admin'))
  }

  return (
    <aside
      ref={sidebarRef}
      className={`admin-sidebar isolate relative h-screen bg-[rgb(var(--color-surface-1))] border-r border-[rgb(var(--color-surface-2))] flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center transition-all duration-300 h-20 shrink-0 ${
          isCollapsed ? 'justify-center' : 'justify-between px-4'
        }`}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white truncate relative z-10">Admin Panel</h1>
        )}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="grid place-items-center w-12 h-12 rounded-xl hover:bg-[rgb(var(--color-surface-2))] text-slate-200 hover:text-white relative z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <LuPanelLeftOpen size={20} /> : <LuPanelLeftClose size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-2 pb-4 overflow-y-auto overflow-x-hidden">
        <ul className={`space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {adminNavItems.map((item) => (
            // NOTE: Humne yahan `li` element ko 'admin-nav-item' class di hai
            <li key={item.name} className="relative admin-nav-item">
              <NavLink
                to={item.path}
                end
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) => `
                  relative flex items-center rounded-xl transition-all duration-200 group 
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                  ${isCollapsed ? 'justify-center w-16 h-16' : 'justify-start gap-4 p-4'}
                  ${
                    isActive
                      ? 'active-link bg-[rgb(var(--color-surface-2))] text-white'
                      : 'text-slate-200 hover:bg-[rgb(var(--color-surface-2))] hover:text-white'
                  }`}
              >
                <item.Icon className="text-2xl shrink-0 relative z-10" />
                <span
                  className={`text-base font-medium whitespace-nowrap transition-all duration-200 relative z-10 ${
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

      {/* Footer (Logout Button) */}
      <div className={`p-4 shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`
            relative z-10 flex items-center rounded-xl w-full transition-colors duration-200 
            text-slate-200 
            ${isCollapsed ? 'justify-center w-16 h-16 ml-8' : 'justify-start gap-4 p-4'}
          `}
        >
          <LuLogOut className="text-2xl shrink-0" />
          <Link to="/">
            <span
              className={`font-medium whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Logout
            </span>
          </Link>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar

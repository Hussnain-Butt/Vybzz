import React, { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import MemberSidebar from '../member/MemberSidebar'
import { LuPanelLeftOpen } from 'react-icons/lu'
import Logo from '../../assets/Logo.png'

const MemberLayout = () => {
  // Check initial screen size for sidebar state
  // Desktop par by default expanded (false), mobile par collapsed (true)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768)

  // Screen resize par sidebar state ko manage karein
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true) // Mobile par by default hide karein
      }
    }

    window.addEventListener('resize', handleResize)
    // Cleanup function
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    // Main flex container for desktop layout
    <div className="relative flex h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-text-primary))]">
      {/* Sidebar state aur function ko pass karein */}
      <MemberSidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      {/* 
        YAHAN SE MARGIN HATA DIYA GAYA HAI. 
        Flexbox layout ko automatically handle karega.
      */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* === Mobile Header === */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-[76px] px-4 bg-[rgb(var(--color-surface-1))] border-b border-[rgb(var(--color-surface-2))] md:hidden">
          {/* Mobile par Logo dikhayein */}
          <Link to="/member/home">
            <img src={Logo} alt="Logo" className="h-7 w-auto" />
          </Link>

          {/* Mobile par Sidebar kholne ke liye button */}
          <button
            onClick={() => setSidebarCollapsed(false)} // Mobile par `false` matlab "visible"
            className="p-2 rounded-lg hover:bg-[rgb(var(--color-surface-2))]"
            aria-label="Open sidebar"
          >
            <LuPanelLeftOpen size={20} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1">
          {/* Outlet aapke pages ko yahan render karega */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MemberLayout

import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../dashboard/Sidebar'
import DashboardHeader from './DashboardHeader'

const DashboardLayout = () => {
  // Desktop ke liye state
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile sidebar ke liye nayi state
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#111827] text-white">
      {/* Sidebar ko mobile aur desktop ke liye props dein */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Mobile par sidebar khula ho to background overlay dikhayein */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header ko yahan render karein */}
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Outlet aapke dashboard ke pages ko yahan render karega */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

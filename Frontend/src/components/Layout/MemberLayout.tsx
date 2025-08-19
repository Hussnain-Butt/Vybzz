// src/components/Layout/MemberLayout .tsx
import React, { useState } from 'react' // ✅ Step 1: useState ko import karein
import { Outlet } from 'react-router-dom'
import MemberSidebar from '../member/MemberSidebar'

const MemberLayout = () => {
  // ✅ Step 2: Sidebar ke liye state banayein
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    // Main flex container
    <div className="flex h-screen bg-[#111827] text-white">
      {/* ✅ Step 3: State aur function ko Sidebar component mein pass karein */}
      <MemberSidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="">
          {/* Outlet aapke dashboard ke pages (DashboardHome, Library, etc.) ko yahan render karega */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MemberLayout

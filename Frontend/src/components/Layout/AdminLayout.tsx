import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { gsap } from 'gsap'
import AdminSidebar from '../admin/AdminSidebar'

const AdminLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      '.admin-content-area',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' },
    )
  }, [])

  return (
    <div className="flex h-screen bg-[rgb(var(--color-background-dark))] ">
      <AdminSidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="admin-content-area p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

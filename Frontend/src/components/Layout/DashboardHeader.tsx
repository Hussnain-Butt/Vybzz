import React from 'react'
import { LuMenu } from 'react-icons/lu'
import Logo from '../../assets/Logo.png' // <-- Apna logo ka path check kar lein

interface DashboardHeaderProps {
  onMenuClick: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  return (
    // Ye header sirf mobile/tablet par dikhega (md se neeche)
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[rgb(var(--color-surface-2))] bg-[#111827]/80 px-4 backdrop-blur-md md:hidden">
      {/* Mobile Logo */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="h-8 w-auto" />
        <h1 className="text-white font-semibold text-lg">Vybzz</h1>
      </div>

      {/* Hamburger Menu Button (Sidebar kholne ke liye) */}
      <button
        onClick={onMenuClick}
        className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-[rgb(var(--color-surface-2))]"
        aria-label="Open sidebar"
      >
        <LuMenu size={24} />
      </button>
    </header>
  )
}

export default DashboardHeader

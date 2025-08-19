import React from 'react'
import { LuSearch } from 'react-icons/lu'

const Header: React.FC = () => {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="relative mx-auto max-w-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <LuSearch className="h-5 w-5 text-[rgb(var(--color-text-muted))]" />
        </div>
        <input
          type="search"
          placeholder="Search creators, podcasts, and more..."
          className="block w-full rounded-full border-2 border-[rgb(var(--color-surface-2))] bg-[rgb(var(--color-surface-2))] py-3.5 pl-12 pr-4 text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] transition-colors focus:border-[rgb(var(--color-primary-blue))] focus:outline-none focus:ring-0 sm:text-sm"
        />
      </div>
    </header>
  )
}

export default Header

import React from 'react'

const categories = [
  'All',
  'Video game talk',
  'Pop culture',
  'Podcasts & shows',
  'Entertainment',
  'Comedy',
  'Role playing games',
  'True crime',
  'Art tutorials',
]

const CategoryFilters: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 -mb-2 hide-scrollbar">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium
                        transition-all duration-300 border
                        ${
                          index === 0
                            ? 'bg-[rgb(var(--color-primary-blue))] text-white border-transparent shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                            : 'bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-surface-3))] hover:bg-[rgb(var(--color-surface-3))] hover:text-white hover:border-[rgb(var(--color-surface-3))]'
                        }
                        focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-blue))]/50`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilters

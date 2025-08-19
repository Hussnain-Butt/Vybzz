import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { FaUserSlash } from 'react-icons/fa'

const BlockedUsers = () => {
  // GSAP animation for a professional entrance
  useEffect(() => {
    gsap.fromTo(
      '.blocked-users-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      },
    )
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-8">Blocked users</h1>

      {/* Main Content Card */}
      <div className="blocked-users-card bg-[rgb(var(--color-surface-1))] rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-surface-3))] pb-4 mb-4">
          <h3 className="text-sm font-bold text-[rgb(var(--color-text-secondary))] w-1/2">
            User Name
          </h3>
          <h3 className="text-sm font-bold text-[rgb(var(--color-text-secondary))] w-1/2">
            Block Date
          </h3>
        </div>

        {/* Empty State Message */}
        <div className="text-center py-10">
          <FaUserSlash className="mx-auto text-[rgb(var(--color-text-muted))]" size={40} />
          <p className="mt-4 text-md font-semibold text-[rgb(var(--color-text-secondary))]">
            You haven't blocked any users.
          </p>
        </div>

        {/* 
          NOTE FOR DEVELOPER: 
          When there are blocked users, you can map over your data here.
          
          Example of a blocked user row:
          
          <div className="flex items-center justify-between py-3">
            <p className="text-sm text-white w-1/2">Example User</p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] w-1/2">
              August 10, 2024
            </p>
          </div>
        */}
      </div>
    </div>
  )
}

export default BlockedUsers

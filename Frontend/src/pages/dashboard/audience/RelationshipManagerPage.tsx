// src/pages/dashboard/audience/RelationshipManagerPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Users, ArrowUpDown } from 'lucide-react'

const TABLE_HEADERS = [
  'Name',
  'Email',
  'Current Tier',
  'Pledge',
  'Lifetime',
  'Status',
  'Join Date',
  'Last Charge Date',
  'Subscription Source',
]

const RelationshipManagerPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="bg-[rgb(var(--color-surface-1))] rounded-xl border border-[rgb(var(--color-surface-2))]"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-[rgb(var(--color-surface-2))]">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="bg-transparent rounded border-2 border-[rgb(var(--color-surface-3))]"
                />
              </th>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="p-4 text-xs font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    {header}
                    <ArrowUpDown size={14} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={TABLE_HEADERS.length + 1}>
                <div className="text-center py-24 px-6">
                  <div className="inline-flex items-center justify-center p-4 bg-[rgb(var(--color-surface-2))] rounded-full mb-5">
                    <Users size={32} className="text-[rgb(var(--color-text-secondary))]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">You don't have any members yet</h3>
                  <p className="text-[rgb(var(--color-text-muted))] max-w-md mx-auto">
                    Once people start joining, you'll be able to see details about your free and
                    paid members here.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RelationshipManagerPage

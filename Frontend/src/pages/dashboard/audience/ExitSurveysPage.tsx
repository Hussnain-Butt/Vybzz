// src/pages/dashboard/audience/ExitSurveysPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Download, MessageSquareText } from 'lucide-react'

const TABLE_HEADERS = ['Date', 'Deleted Pledge Amount', 'Reasons', 'Feedback']

const ExitSurveysPage = () => {
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
    <div ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <button className="bg-slate-200 text-slate-900 font-bold py-2 px-5 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
          <Download size={16} />
          Download surveys as .csv
        </button>
        <a href="#" className="text-sm text-[rgb(var(--color-text-link))] hover:underline">
          Learn more
        </a>
      </div>

      <div className="bg-[rgb(var(--color-surface-1))] rounded-xl border border-[rgb(var(--color-surface-2))]">
        <table className="w-full text-left">
          <thead>
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="p-4 text-xs font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={TABLE_HEADERS.length}>
                <div className="text-center py-24 px-6">
                  <div className="inline-flex items-center justify-center p-4 bg-[rgb(var(--color-surface-2))] rounded-full mb-5">
                    <MessageSquareText
                      size={32}
                      className="text-[rgb(var(--color-text-secondary))]"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Survey Responses</h3>
                  <p className="text-[rgb(var(--color-text-muted))]">
                    When members leave, their survey responses will appear here.
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

export default ExitSurveysPage

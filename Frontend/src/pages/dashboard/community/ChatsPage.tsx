// src/pages/dashboard/community/ChatsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ChatsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="flex items-center justify-center mt-16">
      <div
        ref={containerRef}
        className="max-w-md w-full text-center bg-[rgb(var(--color-surface-1))] p-10 rounded-2xl border border-[rgb(var(--color-surface-2))]"
      >
        {/* Custom Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-600 mb-6">
          <span className="text-3xl font-bold text-white">M</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Introducing community chats</h3>
        <p className="text-[rgb(var(--color-text-secondary))] mb-4">
          This is a space for you and your fans to hang out. Choose which tiers get access and make
          it yours.
        </p>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          When you have access to chats, you can create them here.
        </p>
      </div>
    </div>
  )
}

export default ChatsPage

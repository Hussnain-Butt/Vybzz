// src/pages/dashboard/library/PostsPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FileText, PlusCircle } from 'lucide-react'

const PostsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="mt-16">
      <div className="text-center flex flex-col items-center justify-center p-12 bg-[rgb(var(--color-surface-1))] rounded-2xl border border-dashed border-[rgb(var(--color-surface-3))]">
        <div className="p-4 bg-[rgb(var(--color-surface-2))] rounded-full mb-6">
          <FileText size={40} className="text-[rgb(var(--color-primary-cyan))]" />
        </div>
        <h2 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))]">
          No Posts Yet
        </h2>
        <p className="mt-2 max-w-md text-[rgb(var(--color-text-muted))]">
          It looks like you haven't created any posts. Get started by creating your first
          masterpiece.
        </p>
        <button className="mt-8 flex items-center gap-2 px-6 py-3 bg-[rgb(var(--color-primary-blue))] text-white font-semibold rounded-lg hover:bg-[rgb(var(--color-primary-cyan))] transition-all duration-300 ease-in-out transform hover:scale-105">
          <PlusCircle size={20} />
          Create New Post
        </button>
      </div>
    </main>
  )
}

export default PostsPage

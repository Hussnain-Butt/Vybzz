// File: src/pages/dashboard/library/PostsPage.tsx (COMPLETE AND FINAL UPDATED VERSION)

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { FileText, PlusCircle } from 'lucide-react'
import { getMyPosts } from '../../../api/apiClient'
import PostCard from '../../../components/creator/PostCard'

// Define MediaAsset type
type MediaAsset = {
  url: string
  type: string
}

// CHANGE: Update the Post type definition to include mediaAssets
type Post = {
  id: string
  title: string
  content: string
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED'
  createdAt: string
  mediaAssets: MediaAsset[] // This is the required change
}

// A simple skeleton loader component for better UX during loading
const SkeletonCard = () => (
  <div className="bg-[rgb(var(--color-surface-1))] rounded-2xl p-5 border border-[rgb(var(--color-surface-2))] animate-pulse">
    <div className="h-40 w-full bg-[rgb(var(--color-surface-2))] rounded-lg mb-4"></div>
    <div className="h-6 w-3/4 bg-[rgb(var(--color-surface-2))] rounded mb-2"></div>
    <div className="h-4 w-full bg-[rgb(var(--color-surface-2))] rounded mb-1"></div>
    <div className="h-4 w-5/6 bg-[rgb(var(--color-surface-2))] rounded mb-4"></div>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[rgb(var(--color-surface-3))]">
      <div className="h-5 w-16 bg-[rgb(var(--color-surface-2))] rounded-full"></div>
      <div className="h-4 w-24 bg-[rgb(var(--color-surface-2))] rounded"></div>
    </div>
  </div>
)

// The empty state component when no posts are found
const NoPostsEmptyState = () => (
  <div className="text-center flex flex-col items-center justify-center p-12 bg-[rgb(var(--color-surface-1))] rounded-2xl border border-dashed border-[rgb(var(--color-surface-3))]">
    <div className="p-4 bg-[rgb(var(--color-surface-2))] rounded-full mb-6">
      <FileText size={40} className="text-[rgb(var(--color-primary-cyan))]" />
    </div>
    <h2 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))]">No Posts Yet</h2>
    <p className="mt-2 max-w-md text-[rgb(var(--color-text-muted))]">
      It looks like you haven't created any posts. Get started by creating your first masterpiece.
    </p>
    <Link
      to="/dashboard/library/posts/new"
      className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[rgb(var(--color-primary-blue))] text-white font-semibold rounded-lg hover:bg-[rgb(var(--color-primary-cyan))] transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <PlusCircle size={20} />
      <span>Create New Post</span>
    </Link>
  </div>
)

const PostsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const fetchedPosts = await getMyPosts()
        setPosts(fetchedPosts)
      } catch (err) {
        setError('Failed to load your posts. Please try again later.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [isLoading])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center p-12 bg-red-900/20 text-red-300 rounded-2xl">
          <h2 className="text-2xl font-semibold">An Error Occurred</h2>
          <p className="mt-2">{error}</p>
        </div>
      )
    }

    if (posts.length === 0) {
      return <NoPostsEmptyState />
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    )
  }

  return (
    <main ref={containerRef} className="mt-8">
      {renderContent()}
    </main>
  )
}

export default PostsPage

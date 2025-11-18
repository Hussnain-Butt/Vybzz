import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

import { getPostById } from '../../../api/apiClient'

type Creator = {
  name: string
  avatarUrl: string
}

type PostTag = {
  tag: {
    name: string
  }
}

type Post = {
  id: string
  title: string
  content: string
  creator: Creator // Backend se ab yeh object aayega
  createdAt: string
  tags: PostTag[]
}

const ViewPostSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="h-8 w-40 bg-slate-700 rounded mb-12"></div>
    <div className="h-12 w-3/4 bg-slate-700 rounded mb-6"></div>
    <div className="flex items-center gap-4 mb-8">
      <div className="h-12 w-12 bg-slate-700 rounded-full"></div>
      <div className="flex-grow">
        <div className="h-5 w-1/4 bg-slate-700 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
      </div>
    </div>
    <div className="space-y-4 mt-8">
      <div className="h-6 bg-slate-700 rounded"></div>
      <div className="h-6 bg-slate-700 rounded w-5/6"></div>
      <div className="h-6 bg-slate-700 rounded"></div>
      <div className="h-6 bg-slate-700 rounded w-4/6"></div>
    </div>
  </div>
)

const ViewPostPage = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        toast.error('Post ID is missing.')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const fetchedPost = await getPostById(postId)
        setPost(fetchedPost)
      } catch (err: any) {
        console.error('Failed to fetch post:', err)
        toast.error(err.response?.data?.error || 'Could not load the post.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  useLayoutEffect(() => {
    if (!isLoading && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.gsap-reveal',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [isLoading])

  const getReadingTime = (content: string) => {
    if (!content) return '1 min read'
    const text = content.replace(/<[^>]+>/g, '')
    const wordsPerMinute = 200
    const wordCount = text.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  if (isLoading) {
    return <ViewPostSkeleton />
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-4xl font-bold text-red-400 mb-4">Post Not Found</h1>
        <p className="text-lg text-[rgb(var(--color-text-muted))] mb-8">
          Sorry, we couldn't find the post you were looking for.
        </p>
        <button
          onClick={() => navigate('/dashboard/library/posts')}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Library
        </button>
      </div>
    )
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div
        ref={containerRef}
        className="bg-[rgb(var(--color-background-dark))] min-h-screen text-[rgb(var(--color-text-primary))]"
      >
        <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-10 gsap-reveal">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary-cyan))] transition-colors duration-300 group"
            >
              <ArrowLeft
                size={18}
                className="transform group-hover:-translate-x-1 transition-transform"
              />
              Back to Library
            </button>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter mb-6 gsap-reveal">
            {post.title}
          </h1>

          {/* FIX: Optional chaining (?.) ka istemal kiya gaya hai */}
          <div className="flex items-center gap-4 mb-8 gsap-reveal">
            <img
              src={post.creator?.avatarUrl || `https://i.pravatar.cc/150?u=${post.id}`} // Fallback avatar
              alt={post.creator?.name || 'Creator'}
              className="w-12 h-12 rounded-full border-2 border-[rgb(var(--color-surface-3))]"
            />
            <div>
              <p className="font-semibold text-lg">{post.creator?.name || 'Unknown Creator'}</p>
              <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-muted))] mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-[rgb(var(--color-surface-3))]">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {getReadingTime(post.content)}
                </span>
              </div>
            </div>
          </div>

          <div
            className="prose dark:prose-invert prose-lg max-w-none prose-p:text-[rgb(var(--color-text-secondary))] prose-headings:text-[rgb(var(--color-text-primary))] prose-strong:text-[rgb(var(--color-text-primary))] prose-a:text-[rgb(var(--color-text-link))] prose-blockquote:border-l-[rgb(var(--color-primary-blue))] prose-code:bg-[rgb(var(--color-surface-2))] prose-code:p-1 prose-code:rounded-md prose-code:text-sm prose-pre:bg-[rgb(var(--color-surface-1))] prose-pre:border prose-pre:border-[rgb(var(--color-surface-2))] gsap-reveal"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-[rgb(var(--color-surface-2))] gsap-reveal">
              <h3 className="text-sm font-semibold uppercase text-[rgb(var(--color-text-muted))] mb-4 flex items-center gap-2">
                <Tag size={16} /> Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((postTag) => (
                  <span
                    key={postTag.tag.name}
                    className="bg-[rgb(var(--color-surface-2))] text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {postTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default ViewPostPage

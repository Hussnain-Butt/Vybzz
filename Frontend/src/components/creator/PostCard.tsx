import React, { useMemo, useState } from 'react'
// CHANGE 1: Import the Link component from react-router-dom
import { Link } from 'react-router-dom'
import { MoreHorizontal, Edit, Trash2, Eye, Play } from 'lucide-react'

type MediaAsset = {
  url: string
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'ATTACHMENT' | 'LINK' | 'POLL' | 'LIVESTREAM'
}

type Post = {
  id: string
  title: string
  content: string
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED'
  createdAt: string
  mediaAssets: MediaAsset[]
}

const stripHtmlAndTruncate = (html: string, length: number = 100): string => {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, '')
  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + '...'
}

const PostCard = ({ post }: { post: Post }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const thumbnailUrl = useMemo(() => {
    return post.mediaAssets?.find((asset) => asset.type === 'IMAGE')?.url
  }, [post.mediaAssets])

  const hasLivestream = useMemo(() => {
    return post.mediaAssets?.some((asset) => asset.type === 'LIVESTREAM')
  }, [post.mediaAssets])

  const statusBadge = useMemo(() => {
    switch (post.status) {
      case 'PUBLISHED':
        return (
          <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900/50 rounded-full">
            Published
          </span>
        )
      case 'DRAFT':
        return (
          <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900/50 rounded-full">
            Draft
          </span>
        )
      case 'SCHEDULED':
        return (
          <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900/50 rounded-full">
            Scheduled
          </span>
        )
      default:
        return null
    }
  }, [post.status])

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const formattedDate = formatTimestamp(post.createdAt)

  return (
    <article className="bg-[rgb(var(--color-surface-1))] rounded-2xl border border-[rgb(var(--color-surface-2))] overflow-hidden flex flex-col transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:shadow-2xl hover:shadow-cyan-500/10 group">
      {/* Making the image a link to the post view page */}
      <Link to={`/dashboard/library/posts/${post.id}`} className="relative">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={post.title}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-40 w-full bg-[rgb(var(--color-surface-2))]"></div>
        )}
        {hasLivestream && (
          <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Play size={12} className="text-white fill-white" />
            <span className="text-white text-xs font-bold">STREAM</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          {/* Making the title a link */}
          <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] leading-tight">
            <Link to={`/dashboard/library/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
              className="p-1.5 rounded-full text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[rgb(var(--color-surface-2))] rounded-lg shadow-xl z-10 py-1">
                {/* CHANGE 2: Replace <a> tag with <Link> component */}
                <Link
                  to={`/dashboard/library/posts/${post.id}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-3))]"
                >
                  <Eye size={16} /> View Post
                </Link>
                <a
                  href="#" // This link should also be updated to go to an edit page later
                  className="flex items-center gap-3 px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-3))]"
                >
                  <Edit size={16} /> Edit
                </a>
                <a
                  href="#" // This should trigger a delete confirmation modal
                  className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-[rgb(var(--color-surface-3))]"
                >
                  <Trash2 size={16} /> Delete
                </a>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-[rgb(var(--color-text-muted))] flex-grow mb-4">
          {stripHtmlAndTruncate(post.content)}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-[rgb(var(--color-surface-3))]">
          {statusBadge}
          <time className="text-xs text-[rgb(var(--color-text-muted))]">{formattedDate}</time>
        </div>
      </div>
    </article>
  )
}

export default PostCard

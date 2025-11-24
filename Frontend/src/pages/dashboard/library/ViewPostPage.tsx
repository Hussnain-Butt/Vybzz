import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Play,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Send,
  ThumbsUp,
  MoreHorizontal,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import MuxPlayer from '@mux/mux-player-react'

import { getPostById, getCurrentUser } from '../../../api/apiClient'

// --- Types ---

type MediaAsset = {
  id: string
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'ATTACHMENT' | 'LINK' | 'POLL' | 'LIVESTREAM'
  url: string
  muxPlaybackId?: string | null
  muxAssetId?: string | null
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
  creatorId: string
  publishedAt: string
  createdAt: string
  tags: PostTag[]
  mediaAssets: MediaAsset[]
}

type User = {
  id: string
  name: string
  imageUrl: string
  creatorProfile?: {
    profileImageUrl?: string
  }
}

type CommentType = {
  id: string
  user: {
    name: string
    avatar: string
  }
  text: string
  timestamp: string
  likes: number
}

// --- Mock Data for Comments ---
const MOCK_COMMENTS: CommentType[] = [
  {
    id: '1',
    user: {
      name: 'Alex Rivera',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    text: 'This stream was absolutely mind-blowing! The part about the new engine updates really caught my attention. Can’t wait for the next one.',
    timestamp: '2 hours ago',
    likes: 24,
  },
  {
    id: '2',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    text: 'Great quality video. Could you cover the optimization techniques in more detail next time?',
    timestamp: '5 hours ago',
    likes: 12,
  },
  {
    id: '3',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://i.pravatar.cc/150?u=mike',
    },
    text: 'Finally someone explained this clearly! Thanks for the insights.',
    timestamp: '1 day ago',
    likes: 8,
  },
]

// --- Skeleton Component ---
const ViewPostSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="h-8 w-40 bg-slate-700 rounded mb-12"></div>
    <div className="h-64 w-full bg-slate-700 rounded-2xl mb-8"></div>
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
    </div>
  </div>
)

const ViewPostPage = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [post, setPost] = useState<Post | null>(null)
  const [creator, setCreator] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Local state for static interactions
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(1240) // Static start count
  const [commentText, setCommentText] = useState('')

  // Derive livestream asset from post
  const livestreamAsset = post?.mediaAssets?.find((asset) => asset.type === 'LIVESTREAM')
  const thumbnailAsset = post?.mediaAssets?.find((asset) => asset.type === 'IMAGE')
  const hasLivestream = !!livestreamAsset

  useEffect(() => {
    const fetchPostAndCreator = async () => {
      if (!postId) {
        toast.error('Post ID is missing.')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const fetchedPost = await getPostById(postId)
        setPost(fetchedPost)

        // Fetch creator info (currently logged in user)
        const currentUser = await getCurrentUser()
        setCreator(currentUser)
      } catch (err: any) {
        console.error('Failed to fetch post:', err)
        toast.error(err.response?.data?.error || 'Could not load the post.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostAndCreator()
  }, [postId])

  // Simple logging for debugging
  useEffect(() => {
    if (livestreamAsset) {
      console.log('=== MUX PLAYER DEBUG ===')
      console.log('Playback ID:', livestreamAsset.muxPlaybackId)
      console.log('Asset ID:', livestreamAsset.muxAssetId)
      console.log('========================')
    }
  }, [livestreamAsset])

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

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleLikeToggle = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    if (!isLiked) toast.success('You liked this post!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const creatorAvatar =
    creator?.creatorProfile?.profileImageUrl ||
    creator?.imageUrl ||
    `https://i.pravatar.cc/150?u=${post?.creatorId}`
  const creatorName = creator?.name || 'Loading...'

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
        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <div className="mb-6 gsap-reveal">
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

          {/* Live Stream Video Player */}
          {hasLivestream && livestreamAsset?.muxPlaybackId && (
            <div className="mb-6 gsap-reveal">
              <style>{`
                mux-player {
                  --media-object-fit: cover !important;
                  --media-object-position: center !important;
                }
                mux-player::part(poster) {
                  object-fit: cover !important;
                  object-position: center !important;
                }
              `}</style>
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-[rgb(var(--color-surface-2))]">
                <MuxPlayer
                  playbackId={livestreamAsset.muxPlaybackId}
                  poster={thumbnailAsset?.url}
                  streamType="on-demand"
                  controls
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    maxHeight: '70vh',
                  }}
                  metadata={{
                    video_title: post?.title || 'Stream Recording',
                    video_id: livestreamAsset.muxAssetId || livestreamAsset.id,
                  }}
                  onLoadedMetadata={() => {
                    console.log('[Mux Player] Video loaded successfully')
                  }}
                  onError={(error) => {
                    console.error('[Mux Player] Error:', error)
                    toast.error('Failed to load video. Please try again.')
                  }}
                />
                <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-none z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-semibold">Stream Recording</span>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-4 gsap-reveal">
            {post.title}
          </h1>

          {/* Engagement & Stats Bar (Views, Likes, Share) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-[rgb(var(--color-surface-2))] py-4 mb-8 gap-4 gsap-reveal">
            <div className="flex items-center gap-6 text-[rgb(var(--color-text-secondary))] text-sm sm:text-base">
              <div className="flex items-center gap-2" title="Total Views">
                <Eye size={20} className="text-[rgb(var(--color-text-muted))]" />
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  12.5k
                </span>{' '}
                Views
              </div>
              <div className="flex items-center gap-2" title="Published Date">
                <Calendar size={18} className="text-[rgb(var(--color-text-muted))]" />
                <span>{formatTimestamp(post.publishedAt || post.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))]'
                }`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                {likeCount.toLocaleString()}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))] transition-all duration-300 font-medium"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-4 mb-8 gsap-reveal">
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[rgb(var(--color-primary-cyan))] shadow-lg object-cover"
            />
            <div>
              <p className="font-bold text-lg text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary-cyan))] cursor-pointer transition-colors">
                {creatorName}
              </p>
              <p className="text-sm text-[rgb(var(--color-text-muted))]">15.2k Subscribers</p>
            </div>
            <div className="ml-auto">
              <button className="hidden sm:block bg-[rgb(var(--color-text-primary))] text-[rgb(var(--color-background-dark))] px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>

          {/* Content Description */}
          {post.content && (
            <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-6 border border-[rgb(var(--color-surface-2))] mb-8 gsap-reveal">
              <div
                className="prose dark:prose-invert prose-lg max-w-none prose-p:text-[rgb(var(--color-text-secondary))] prose-headings:text-[rgb(var(--color-text-primary))] prose-strong:text-[rgb(var(--color-text-primary))] prose-a:text-[rgb(var(--color-primary-cyan))] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[rgb(var(--color-primary-blue))] prose-blockquote:bg-[rgb(var(--color-surface-2))] prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Reading Time & Meta inside content box */}
              {!hasLivestream && (
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[rgb(var(--color-surface-2))] text-sm text-[rgb(var(--color-text-muted))]">
                  <Clock size={14} />
                  {getReadingTime(post.content)}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 gsap-reveal">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((postTag) => (
                  <span
                    key={postTag.tag.name}
                    className="flex items-center gap-1 bg-[rgb(var(--color-surface-2))] hover:bg-[rgb(var(--color-primary-cyan))]/20 border border-[rgb(var(--color-surface-3))] hover:border-[rgb(var(--color-primary-cyan))] text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer text-[rgb(var(--color-text-secondary))]"
                  >
                    <Tag size={12} />#{postTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- COMMENTS SECTION ---------------- */}
          <div className="gsap-reveal pt-8 border-t border-[rgb(var(--color-surface-2))]">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-bold">Comments</h3>
              <span className="text-[rgb(var(--color-text-muted))] font-medium">
                {MOCK_COMMENTS.length}
              </span>
            </div>

            {/* Comment Input */}
            <div className="flex gap-4 mb-10">
              <img
                src={creatorAvatar}
                alt="My Avatar"
                className="w-10 h-10 rounded-full object-cover hidden sm:block"
              />
              <div className="flex-grow">
                <div className="relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-[rgb(var(--color-surface-1))] text-[rgb(var(--color-text-primary))] border-b-2 border-[rgb(var(--color-surface-3))] focus:border-[rgb(var(--color-text-primary))] outline-none p-3 min-h-[50px] transition-colors resize-y rounded-t-lg"
                    rows={1}
                  />
                  <div
                    className={`flex justify-end mt-2 transition-all duration-300 ${
                      commentText
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-2 pointer-events-none absolute right-0'
                    }`}
                  >
                    <button
                      onClick={() => setCommentText('')}
                      className="px-4 py-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 text-sm font-bold bg-[rgb(var(--color-primary-cyan))] text-black rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                      onClick={() => {
                        toast.success('Comment posted! (Static Demo)')
                        setCommentText('')
                      }}
                    >
                      <Send size={14} />
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {MOCK_COMMENTS.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-[rgb(var(--color-text-muted))]">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-[rgb(var(--color-text-secondary))] text-sm leading-relaxed mb-2">
                      {comment.text}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-primary))] transition-colors">
                        <ThumbsUp size={14} />
                        {comment.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-primary))] transition-colors">
                        Reply
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-[rgb(var(--color-surface-2))] rounded-full">
                        <MoreHorizontal size={16} className="text-[rgb(var(--color-text-muted))]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button (Static) */}
            <div className="mt-8 text-center">
              <button className="text-sm font-semibold text-[rgb(var(--color-primary-cyan))] hover:text-[rgb(var(--color-primary-cyan))]/80 transition-colors">
                Show more comments
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default ViewPostPage

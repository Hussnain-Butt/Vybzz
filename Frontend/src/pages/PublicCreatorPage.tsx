// src/pages/PublicCreatorPage.tsx
import React, { useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { gsap } from 'gsap'
import {
  LuHeart,
  LuRss,
  LuLock,
  LuFileText,
  LuStar,
  LuUser,
  LuCalendar,
  LuChevronRight,
} from 'react-icons/lu'
import { FaCheckCircle } from 'react-icons/fa'

/* ---------------------------
   Data Interfaces
   --------------------------- */
interface MembershipTier {
  id: string
  title: string
  price: number
  description: string
  perks: string[] | undefined
}

interface Post {
  id: string
  title: string
  excerpt: string
  isPublic: boolean
  imageUrl?: string | null
}

interface PublicCreatorData {
  name: string
  pageName: string
  imageUrl: string | null
  bannerUrl: string | null
  joinedDate: string
  bio: string | null
  tiers: MembershipTier[] | undefined
  posts: Post[] | undefined
}

/* ---------------------------
   API Fetch
   --------------------------- */
const fetchCreatorByUrl = async (pageUrl: string): Promise<PublicCreatorData> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/page/${pageUrl}`)
  if (res.status === 404) throw new Error('Creator not found')
  if (!res.ok) throw new Error('Failed to fetch creator')
  return res.json()
}

/* ---------------------------
   Small UI components
   --------------------------- */
const IconBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="icon-badge">{children}</div>
)

const EmptyState: React.FC<{ icon: React.ElementType; title: string; message: string }> = ({
  icon: Icon,
  title,
  message,
}) => (
  <div className="rounded-2xl card-empty p-8 text-center border-2 border-dashed border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))]">
    <div className="mx-auto w-14 h-14 grid place-items-center rounded-full bg-[rgb(var(--color-surface-3))] mb-4">
      <Icon className="h-7 w-7 text-[rgb(var(--color-text-muted))]" />
    </div>
    <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">{title}</h3>
    <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] max-w-xs mx-auto">{message}</p>
  </div>
)

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <article
    className="group rounded-2xl overflow-hidden card-surface transition-all duration-300 hover:shadow-2xl hover:border-[rgb(var(--color-primary-cyan))] hover:-translate-y-1"
    role="article"
  >
    <div className="h-48 w-full bg-[rgb(var(--color-surface-2))] overflow-hidden">
      {post.imageUrl ? (
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={post.imageUrl}
          alt={post.title}
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-[rgb(var(--color-text-muted))]">
          <LuFileText className="w-10 h-10" />
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col h-full">
      <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] line-clamp-2 leading-snug">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] line-clamp-3 flex-grow">
        {post.excerpt}
      </p>
      <div className="mt-4 pt-4 border-t border-[rgb(var(--color-surface-3))] flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))]">
          {post.isPublic ? (
            <span className="inline-flex items-center gap-1.5">Public</span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <LuLock className="w-4 h-4" /> For Members
            </span>
          )}
        </div>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--color-primary-cyan))] hover:text-white transition-colors">
          Read More{' '}
          <LuChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </article>
)

const TierCard: React.FC<{ tier: MembershipTier }> = ({ tier }) => (
  <div className="rounded-2xl border-2 border-[rgb(var(--color-surface-3))] bg-gradient-to-br from-[rgb(var(--color-surface-2))] to-[rgb(var(--color-surface-1))] p-6 flex flex-col transition-all duration-300 hover:border-[rgb(var(--color-primary-cyan))] hover:shadow-2xl">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">{tier.title}</h4>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">{tier.description}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-3xl font-extrabold text-[rgb(var(--color-text-primary))]">
          ${tier.price}
        </div>
        <div className="text-xs text-[rgb(var(--color-text-muted))]">/ month</div>
      </div>
    </div>

    <ul className="mt-6 space-y-3 text-sm text-[rgb(var(--color-text-secondary))] flex-grow">
      {(tier.perks ?? []).map((perk, i) => (
        <li key={i} className="flex items-center gap-3">
          <FaCheckCircle className="w-5 h-5 text-[rgb(var(--color-primary-cyan))]" />
          <span>{perk}</span>
        </li>
      ))}
    </ul>

    <div className="mt-6 pt-6 border-t border-[rgb(var(--color-surface-3))]">
      <button className="w-full rounded-lg px-4 py-3 text-base font-bold bg-[rgb(var(--color-primary-cyan))] text-black hover:opacity-90 transition-all duration-300 hover:scale-105">
        Join Tier
      </button>
    </div>
  </div>
)

/* ---------------------------
   Page Component
   --------------------------- */
const PublicCreatorPage: React.FC = () => {
  const { pageUrl } = useParams<{ pageUrl: string }>()
  const pageRef = useRef<HTMLDivElement | null>(null)

  const {
    data: creator,
    isLoading,
    isError,
  } = useQuery<PublicCreatorData, Error>(
    ['publicCreator', pageUrl],
    () => fetchCreatorByUrl(pageUrl!),
    { enabled: !!pageUrl, retry: false },
  )

  useLayoutEffect(() => {
    if (!isLoading && creator && pageRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.reveal-anim', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
        })
      }, pageRef)
      return () => ctx.revert()
    }
  }, [isLoading, creator])

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[rgb(var(--color-background-dark))]">
        <div className="text-center text-[rgb(var(--color-text-muted))]">
          <div className="mb-4 w-16 h-16 rounded-full animate-pulse bg-[rgb(var(--color-surface-2))] mx-auto" />
          <p className="font-semibold text-lg">Loading Creator...</p>
        </div>
      </div>
    )
  }

  if (isError || !creator) {
    return (
      <div className="min-h-screen grid place-items-center px-4 bg-[rgb(var(--color-background-dark))]">
        <div className="max-w-md w-full text-center rounded-2xl p-8 card-surface">
          <LuUser className="mx-auto w-16 h-16 text-[rgb(var(--color-text-muted))]" />
          <h2 className="mt-6 text-2xl font-bold text-[rgb(var(--color-text-primary))]">
            Creator Not Found
          </h2>
          <p className="mt-2 text-base text-[rgb(var(--color-text-secondary))]">
            We couldn't find this creator. They might have changed their URL or removed their page.
          </p>
        </div>
      </div>
    )
  }

  const posts = creator.posts ?? []
  const tiers = creator.tiers ?? []

  return (
    <div ref={pageRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 mt-10">
      {/* HERO */}
      <header className="reveal-anim" aria-labelledby="creator-heading">
        <div className="relative rounded-3xl overflow-hidden card-surface shadow-2xl">
          <div className="w-full h-52 sm:h-72">
            {creator.bannerUrl ? (
              <img
                src={creator.bannerUrl}
                alt={`${creator.name} banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[rgb(var(--color-surface-2))] to-[rgb(var(--color-surface-3))]" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-10 lg:px-0">
          <div className="relative -mt-16 sm:-mt-20 text-center">
            {creator.imageUrl ? (
              <img
                className="creator-avatar rounded-full object-cover border-8 border-[rgb(var(--color-background-dark))] shadow-2xl mx-auto"
                src={creator.imageUrl}
                alt={creator.name}
              />
            ) : (
              <div className="creator-avatar rounded-full grid place-items-center text-5xl font-bold bg-gradient-to-br from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-accent-pink))] border-8 border-[rgb(var(--color-background-dark))] shadow-2xl mx-auto">
                {creator.name.charAt(0).toUpperCase()}
              </div>
            )}

            <h1
              id="creator-heading"
              className="mt-6 text-4xl sm:text-5xl font-extrabold text-[rgb(var(--color-text-primary))]"
            >
              {creator.name}
            </h1>

            <p className="mt-3 text-base text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
              {creator.bio ||
                'A passionate creator sharing exclusive content with their community.'}
            </p>

            <div className="mt-4 text-sm text-[rgb(var(--color-text-muted))] flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <span className="inline-flex items-center gap-2">
                <LuUser /> @{creator.pageName || pageUrl}
              </span>
              <span className="inline-flex items-center gap-2">
                <LuCalendar /> Joined {creator.joinedDate}
              </span>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="btn-secondary">
                <LuHeart className="w-5 h-5" /> Follow
              </button>
              <button className="btn-primary">
                <LuRss className="w-5 h-5" /> Become a Member
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12" role="main">
        {/* Posts */}
        <section
          className="lg:col-span-2 space-y-8 reveal-anim"
          aria-labelledby="recent-posts-heading"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2
              id="recent-posts-heading"
              className="text-3xl font-bold text-[rgb(var(--color-text-primary))]"
            >
              Recent Posts
            </h2>
            <div className="text-sm text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-surface-2))] px-3 py-1 rounded-full">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'} Available
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={LuFileText}
              title="No Posts Yet"
              message="This creator hasn't published any posts. Follow them to get notified when they do!"
            />
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-8 reveal-anim" aria-labelledby="sidebar-heading">
          <div>
            <h3
              id="sidebar-heading"
              className="text-3xl font-bold text-[rgb(var(--color-text-primary))]"
            >
              Membership
            </h3>
            <p className="mt-2 text-base text-[rgb(var(--color-text-muted))]">
              Support {creator.name} and unlock exclusive benefits by becoming a member.
            </p>
          </div>

          {tiers.length > 0 ? (
            <div className="space-y-6">
              {tiers.map((t) => (
                <TierCard key={t.id} tier={t} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={LuStar}
              title="No Tiers Available"
              message="This creator hasn't set up any membership tiers yet. Check back later!"
            />
          )}
        </aside>
      </main>
    </div>
  )
}

export default PublicCreatorPage

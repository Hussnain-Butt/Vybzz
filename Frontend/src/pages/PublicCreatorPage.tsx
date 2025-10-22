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
  <div className="rounded-2xl card-empty p-8 text-center">
    <div className="mx-auto w-12 h-12 grid place-items-center rounded-lg bg-[rgb(var(--color-surface-2))] mb-4">
      <Icon className="h-6 w-6 text-[rgb(var(--color-text-muted))]" />
    </div>
    <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">{title}</h3>
    <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">{message}</p>
  </div>
)

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <article
    className="group rounded-2xl overflow-hidden border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))] hover:shadow-lg transition"
    role="article"
  >
    <div className="h-40 sm:h-48 w-full bg-[rgb(var(--color-surface-2))] overflow-hidden">
      {post.imageUrl ? (
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          src={post.imageUrl}
          alt={post.title}
          style={{ maxWidth: '100%' }}
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-[rgb(var(--color-text-muted))]">
          <LuFileText className="w-10 h-10" />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] line-clamp-2">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] line-clamp-3">
        {post.excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
          {post.isPublic ? (
            <span>Public</span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <LuLock /> Members
            </span>
          )}
        </div>
        <button className="flex items-center gap-2 rounded-md px-3 py-1.5 bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-primary))] text-sm hover:opacity-90 transition">
          Read <LuChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </article>
)

const TierCard: React.FC<{ tier: MembershipTier }> = ({ tier }) => (
  <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-gradient-to-br from-[rgb(var(--color-surface-1))] to-[rgb(var(--color-surface-2))] p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {tier.title}
        </h4>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">{tier.description}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          ${tier.price}
        </div>
        <div className="text-xs text-[rgb(var(--color-text-muted))]">/ month</div>
      </div>
    </div>

    <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--color-text-muted))]">
      {(tier.perks ?? []).slice(0, 3).map((p, i) => (
        <li key={i} className="inline-flex items-center gap-2">
          <span className="text-[rgb(var(--color-text-link))]">•</span> {p}
        </li>
      ))}
    </ul>

    <div className="mt-4 flex items-center gap-3">
      <button className="flex-1 rounded-md px-4 py-2 text-sm font-semibold bg-[rgb(var(--color-primary-cyan))] text-black hover:opacity-95 transition">
        Join {tier.title}
      </button>
      <button className="rounded-md px-3 py-2 text-sm border border-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-primary))]">
        Preview
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
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
        })
      }, pageRef)
      return () => ctx.revert()
    }
  }, [isLoading, creator])

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center text-[rgb(var(--color-text-muted))]">
          <div className="mb-4 w-12 h-12 rounded-full animate-pulse bg-[rgb(var(--color-surface-2))] mx-auto" />
          <p>Loading creator...</p>
        </div>
      </div>
    )
  }

  if (isError || !creator) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md w-full text-center rounded-2xl p-8 border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))]">
          <LuUser className="mx-auto w-12 h-12 text-[rgb(var(--color-text-muted))]" />
          <h2 className="mt-4 text-xl font-bold text-[rgb(var(--color-text-primary))]">
            Creator Not Found
          </h2>
          <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
            We couldn't find this creator. They might have changed their URL or removed their page.
          </p>
        </div>
      </div>
    )
  }

  // safe fallbacks
  const posts = creator.posts ?? []
  const tiers = creator.tiers ?? []

  return (
    // page-level container is constrained to avoid full-bleed explosions
    <div
      ref={pageRef}
      className="max-w-7xl mx-auto px-4 py-10 sm:py-14"
      style={{ paddingTop: 'calc(var(--site-header-height,72px) + 12px)' }}
    >
      {/* HERO */}
      <header className="reveal-anim relative" aria-labelledby="creator-heading" role="banner">
        <div className="relative rounded-3xl overflow-hidden border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] card-surface">
          {/* Banner box: fixed height, full width of constrained container */}
          <div className="w-full h-44 sm:h-64 relative">
            {creator.bannerUrl ? (
              <img
                src={creator.bannerUrl}
                alt={`${creator.name} banner`}
                className="w-full h-full object-cover"
                style={{ maxWidth: '100%', display: 'block' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[rgb(var(--color-surface-2))] to-[rgb(var(--color-surface-3))]" />
            )}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Avatar & Info */}
        <div className="relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row items-center gap-4 sm:items-end">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative -mt-6 sm:-mt-12">
              {/* Avatar container — constrained sizes, responsive */}
              {creator.imageUrl ? (
                <img
                  className="creator-avatar rounded-2xl object-cover border-4 border-[rgb(var(--color-background-dark))] shadow-2xl"
                  src={creator.imageUrl}
                  alt={creator.name}
                />
              ) : (
                <div className="creator-avatar rounded-2xl grid place-items-center text-3xl font-bold bg-gradient-to-br from-[rgb(var(--color-primary-blue))] to-[rgb(var(--color-accent-pink))] border-4 border-[rgb(var(--color-background-dark))] shadow-2xl">
                  {creator.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1
                    id="creator-heading"
                    className="text-2xl sm:text-3xl font-extrabold text-[rgb(var(--color-text-primary))] truncate"
                  >
                    {creator.name}
                  </h1>
                  <div className="mt-1 text-sm text-[rgb(var(--color-text-muted))] flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-2">
                      <LuCalendar className="w-4 h-4 text-[rgb(var(--color-text-muted))]" /> Joined{' '}
                      {creator.joinedDate}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-2">
                      <LuUser className="w-4 h-4 text-[rgb(var(--color-text-muted))]" /> @
                      {creator.pageName || pageUrl}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 whitespace-nowrap">
                  <button className="rounded-lg px-4 py-2 border border-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-2))] transition inline-flex items-center gap-2">
                    <LuHeart /> Follow
                  </button>
                  <button className="rounded-lg px-4 py-2 bg-[rgb(var(--color-primary-cyan))] text-black inline-flex items-center gap-2 hover:opacity-95 transition">
                    <LuRss /> Become a member
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-[rgb(var(--color-text-secondary))] max-w-xl truncate">
                {creator.bio
                  ? creator.bio
                  : 'Creator hasn’t added a bio — follow to get notified when they post.'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8" role="main">
        {/* Posts */}
        <section
          className="lg:col-span-2 space-y-6 reveal-anim"
          aria-labelledby="recent-posts-heading"
        >
          <div className="flex items-center justify-between">
            <h2
              id="recent-posts-heading"
              className="text-2xl font-bold text-[rgb(var(--color-text-primary))]"
            >
              Recent Posts
            </h2>
            <div className="text-sm text-[rgb(var(--color-text-muted))]">
              Showing {posts.length} posts
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={LuFileText}
              title="No Posts Yet"
              message="This creator hasn't published posts. Follow them to get updates."
            />
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6 reveal-anim" aria-labelledby="sidebar-heading">
          <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))] p-5">
            <div className="flex items-center gap-3">
              <IconBadge>
                <LuUser />
              </IconBadge>
              <div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">About</div>
                <div className="mt-1 text-[rgb(var(--color-text-primary))] font-semibold">
                  {creator.name}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
              {creator.bio ? (
                creator.bio
              ) : (
                <span className="text-[rgb(var(--color-text-muted))]">
                  This creator hasn't added a bio yet.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                  Become a member
                </h3>
                <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
                  Support the creator and unlock exclusive benefits.
                </p>
              </div>
              <div className="text-[rgb(var(--color-text-muted))]">{tiers.length} tiers</div>
            </div>

            <div className="mt-4 space-y-3">
              {tiers.length > 0 ? (
                tiers.map((t) => <TierCard key={t.id} tier={t} />)
              ) : (
                <EmptyState
                  icon={LuStar}
                  title="No Memberships"
                  message="This creator hasn't set up membership tiers yet."
                />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))] p-5 text-sm text-[rgb(var(--color-text-muted))]">
            <div className="flex items-center gap-3">
              <IconBadge>
                <LuStar />
              </IconBadge>
              <div>
                <div className="font-semibold text-[rgb(var(--color-text-primary))]">Why join?</div>
                <div className="mt-1">
                  Members get early access, exclusive posts, and more — depending on the tier.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default PublicCreatorPage

// === 1: UPDATED IMPORTS ===
import React, { useLayoutEffect, useRef, useState, useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { gsap } from 'gsap'
import {
  LuSparkles,
  LuUsers,
  LuDollarSign,
  LuTrendingUp,
  LuShare2,
  LuEye,
  LuPlus,
  LuLink,
} from 'react-icons/lu'
import { FaPlayCircle, FaCheckCircle, FaRocket } from 'react-icons/fa'

// Import our centralized API function and the Onboarding Modal
import { getCurrentUser } from '../../api/apiClient.js'
import { OnboardingModal } from '../../components/creator/OnboardingModal'

/* ========= Types ========= */
type TabKey = 'Home' | 'Collections' | 'Membership' | 'About'

export interface Collection {
  id: string
  title: string
  cover?: string | null
  price: number
  posts: number
  members: number
  updatedAt: string
}

// API data types that match your backend schema
interface CreatorProfile {
  id: string
  pageName: string
  pageUrl: string
  status: 'DRAFT' | 'ACTIVE'
  profileImageUrl?: string | null
  bannerUrl?: string | null
  bio?: string | null
  onboardingStep: number
  youtubeUrl?: string
  instagramUrl?: string
  // ... other social links
}

interface UserData {
  id: string
  clerkId: string
  email: string
  name: string | null
  imageUrl: string | null
  creatorProfile: CreatorProfile | null
}

/* ========= Demo Data (Unchanged) ========= */
const demoCollections: Collection[] = [
  {
    id: 'c1',
    title: 'Behind-the-scenes',
    cover: null,
    price: 5,
    posts: 24,
    members: 86,
    updatedAt: '2d ago',
  },
  {
    id: 'c2',
    title: 'Weekly vlogs',
    cover: null,
    price: 8,
    posts: 12,
    members: 54,
    updatedAt: '5d ago',
  },
  {
    id: 'c3',
    title: 'Premium tutorials',
    cover: null,
    price: 12,
    posts: 9,
    members: 31,
    updatedAt: '1d ago',
  },
  {
    id: 'c4',
    title: 'Wallpapers pack',
    cover: null,
    price: 3,
    posts: 35,
    members: 140,
    updatedAt: '12h ago',
  },
]

/* ========= Small UI Bits (Unchanged) ========= */
const StatCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  prefix?: string
  suffix?: string
}> = ({ icon: Icon, label, value, prefix = '', suffix = '' }) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const numRef = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current!, { y: 12, opacity: 0, duration: 0.4, ease: 'power2.out' })
      if (numRef.current) {
        const obj = { n: 0 }
        gsap.to(obj, {
          n: value,
          duration: 1.1,
          ease: 'power3.out',
          onUpdate: () => {
            if (!numRef.current) return
            const v = Math.round(obj.n).toLocaleString()
            numRef.current.textContent = `${prefix}${v}${suffix}`
          },
        })
      }
    }, cardRef)
    return () => ctx.revert()
  }, [value, prefix, suffix])

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-4 flex items-center gap-4 shadow-sm stat-card"
    >
      <div className="w-11 h-11 rounded-xl grid place-items-center bg-[rgb(var(--color-surface-3))] shrink-0">
        <Icon className="text-[rgb(var(--color-text-primary))] text-xl" />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-[rgb(var(--color-text-muted))]">{label}</div>
        <div className="text-2xl font-semibold text-[rgb(var(--color-text-primary))]">
          <span ref={numRef}>0</span>
        </div>
      </div>
    </div>
  )
}

const ChecklistItem: React.FC<{ done?: boolean; children: React.ReactNode }> = ({
  done,
  children,
}) => (
  <div className="flex items-start gap-3">
    <div
      className={`mt-0.5 rounded-full p-1 ${
        done ? 'bg-[rgb(var(--color-primary-blue))]/20' : 'bg-[rgb(var(--color-surface-3))]'
      }`}
    >
      <FaCheckCircle
        className={
          done ? 'text-[rgb(var(--color-primary-blue))]' : 'text-[rgb(var(--color-text-muted))]'
        }
      />
    </div>
    <div
      className={`text-sm ${
        done ? 'text-[rgb(var(--color-text-primary))]' : 'text-[rgb(var(--color-text-secondary))]'
      }`}
    >
      {children}
    </div>
  </div>
)

/* ========= Collections Panel (Unchanged) ========= */
const CollectionsPanel: React.FC<{ items: Collection[] }> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
        <div className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          Your collections
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[rgb(var(--color-surface-1))] bg-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-text-primary))]/90 transition shadow w-full sm:w-auto">
          <LuPlus /> New collection
        </button>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))] overflow-hidden"
          >
            <div className="h-28 w-full bg-[rgb(var(--color-surface-3))]" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md grid place-items-center bg-[rgb(var(--color-surface-3))] text-sm font-semibold shrink-0">
                  {c.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="font-medium text-[rgb(var(--color-text-primary))] truncate">
                    {c.title}
                  </div>
                  <div className="text-xs text-[rgb(var(--color-text-muted))]">
                    ${c.price}/mo • {c.posts} posts • {c.members} members • updated {c.updatedAt}
                  </div>
                </div>
                <button
                  onClick={() => toggle(c.id)}
                  className="ml-auto rounded-lg border border-[rgb(var(--color-surface-3))] px-2 py-1 text-xs text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-2))] transition shrink-0"
                >
                  {expandedId === c.id ? 'Hide' : 'View'}
                </button>
              </div>
              {expandedId === c.id && (
                <div className="mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-[rgb(var(--color-surface-3))] p-3 hover:bg-[rgb(var(--color-surface-2))] transition"
                    >
                      <div className="w-10 h-10 rounded-md bg-[rgb(var(--color-surface-3))] grid place-items-center shrink-0">
                        <FaPlayCircle />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-[rgb(var(--color-text-primary))] truncate">
                          {c.title} — Post #{i}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-text-muted))]">
                          Draft • 2 min
                        </div>
                      </div>
                      <button className="ml-auto rounded-lg px-2 py-1 text-xs border border-[rgb(var(--color-surface-3))] hover:bg-[rgb(var(--color-surface-2))]">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========= Main Screen ========= */
const DashboardHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('Home')
  const [isSetupModalOpen, setSetupModalOpen] = useState(false)

  const statusBarRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const checklistRef = useRef<HTMLDivElement | null>(null)
  const tabsRef = useRef<HTMLDivElement | null>(null)

  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserData, Error>('currentUser', getCurrentUser, { refetchOnWindowFocus: false })

  const checklistItems = useMemo(() => {
    const profile = user?.creatorProfile
    if (!profile) return []

    return [
      { label: 'Set your page name', done: !!profile.pageName },
      { label: 'Add a profile photo', done: !!profile.profileImageUrl },
      { label: 'Describe your page', done: !!profile.bio && profile.bio.length > 10 },
      { label: 'Publish your page', done: profile.status === 'ACTIVE' },
      { label: 'Promote your page', done: false },
    ]
  }, [user])

  const completedCount = checklistItems.filter((item) => item.done).length

  // Entrance animations (Unchanged)
  useLayoutEffect(() => {
    if (isLoading || isError) return
    const ctx = gsap.context(() => {
      if (statusBarRef.current) {
        gsap.from(statusBarRef.current, { y: -12, opacity: 0, duration: 0.4, ease: 'power2.out' })
      }
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          y: 14,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.05,
        })
      }
      const cards = gsap.utils.toArray<HTMLElement>('.stat-card')
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 10,
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.06,
          delay: 0.15,
        })
      }
      if (checklistRef.current) {
        gsap.from(checklistRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.2,
        })
      }
    })
    return () => ctx.revert()
  }, [isLoading, isError])

  // Animated tab indicator (Unchanged)
  useLayoutEffect(() => {
    if (!tabsRef.current) return
    const underline = tabsRef.current.querySelector<HTMLDivElement>('.tab-indicator')
    const activeBtn = tabsRef.current.querySelector<HTMLButtonElement>(
      `button[data-tab="${activeTab}"]`,
    )
    if (!underline || !activeBtn) return
    const x = activeBtn.offsetLeft
    const w = activeBtn.offsetWidth
    if (!underline.style.transform) {
      gsap.set(underline, { x, width: w, autoAlpha: 1 })
    } else {
      gsap.to(underline, { x, width: w, duration: 0.25, ease: 'power2.out' })
    }
  }, [activeTab])

  // Loading and Error States
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-[rgb(var(--color-text-secondary))]">
          Loading your dashboard...
        </div>
      </div>
    )
  }

  if (isError || !user || !user.creatorProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-[rgb(var(--color-surface-1))]">
        <div className="text-center p-8 rounded-2xl bg-[rgb(var(--color-surface-2))]">
          <div className="text-lg font-semibold text-red-500">Oops! Something went wrong.</div>
          <p className="text-[rgb(var(--color-text-muted))] mt-2">
            We couldn't load your dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  const { creatorProfile } = user

  return (
    <div className="space-y-6">
      {/* STATUS BAR (Now Conditional) */}
      {creatorProfile.status === 'DRAFT' && (
        <div
          ref={statusBarRef}
          className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="text-sm text-center sm:text-left text-[rgb(var(--color-text-secondary))]">
            <span className="text-[rgb(var(--color-text-primary))] font-medium">
              Your page is not yet published
            </span>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row items-stretch gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-surface-3))] hover:bg-[rgb(var(--color-surface-3))]/90 transition"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.18 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.18 })}
            >
              <LuEye /> Preview page
            </button>
            <button
              onClick={() => setSetupModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[rgb(var(--color-surface-1))] bg-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-text-primary))]/90 transition shadow"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.18 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.18 })}
            >
              <FaRocket /> Publish page
            </button>
          </div>
        </div>
      )}

      {/* HERO (Now Dynamic) */}
      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))]"
      >
        <div
          className="h-40 w-full bg-cover bg-center"
          style={{
            backgroundImage: creatorProfile.bannerUrl
              ? `url(${creatorProfile.bannerUrl})`
              : 'radial-gradient(1200px 300px at 20% -10%, rgba(233,100,36,0.5), transparent 60%), radial-gradient(1200px 300px at 80% -10%, rgba(236,72,153,0.45), transparent 60%)',
          }}
        />
        <div className="px-4 sm:px-6 pb-5 pt-4 bg-[rgb(var(--color-surface-1))] flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-x-6 gap-y-4">
          <div className="-mt-16 md:-mt-20">
            <img
              src={
                creatorProfile.profileImageUrl ||
                user.imageUrl ||
                `https://ui-avatars.com/api/?name=${user.name || '?'}&background=random`
              }
              alt={user.name || 'User Avatar'}
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border-4 border-[rgb(var(--color-surface-1))]"
            />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-semibold text-[rgb(var(--color-text-primary))]">
              {creatorProfile.pageName || user.name || 'Unnamed Creator'}
            </div>
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))] break-all">
              <LuLink className="shrink-0" />
              {`vybzz.com/${creatorProfile.pageUrl}`}
            </div>
          </div>
          <div className="hidden md:block flex-1" />
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch md:items-center gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 border border-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-2))] transition"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            >
              <LuEye /> Preview
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[rgb(var(--color-surface-1))] bg-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-text-primary))]/90 transition shadow"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            >
              <LuShare2 /> Share
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 bg-[rgb(var(--color-primary-blue))] text-white hover:bg-[rgb(var(--color-accent-pink))] transition shadow"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            >
              <LuPlus /> Create
            </button>
          </div>
        </div>
        <div ref={tabsRef} className="px-4 sm:px-6 pb-4 pt-2 overflow-x-auto">
          <div className="relative inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-surface-2))] p-1 border border-[rgb(var(--color-surface-3))]">
            <div
              className="tab-indicator absolute inset-y-1 rounded-full bg-[rgb(var(--color-surface-3))] opacity-0 pointer-events-none"
              style={{ willChange: 'transform, width' }}
            />
            {(['Home', 'Collections', 'Membership', 'About'] as const).map((t) => (
              <button
                key={t}
                data-tab={t}
                onClick={() => setActiveTab(t)}
                className={`relative z-10 rounded-full px-4 py-2 text-sm leading-none transition whitespace-nowrap ${
                  activeTab === t
                    ? 'text-[rgb(var(--color-text-primary))]'
                    : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === 'Home' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" ref={gridRef}>
          <div className="xl:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={LuUsers} label="Active patrons" value={150} />
              <StatCard
                icon={LuDollarSign}
                label="Estimated monthly income"
                value={1200}
                prefix="$"
              />
              <StatCard icon={LuTrendingUp} label="30-day growth" value={18} suffix="%" />
              <StatCard icon={FaPlayCircle} label="Last post views" value={842} />
            </div>
            <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4 text-center lg:text-left">
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-[rgb(var(--color-primary-blue))]/15 shrink-0 mx-auto lg:mx-0">
                <LuSparkles className="text-[rgb(var(--color-primary-blue))]" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[rgb(var(--color-text-primary))]">
                  Grow your creative business
                </div>
                <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                  Add a welcome post and set up your first membership tier to start earning
                  recurring income.
                </div>
              </div>
              <div className="hidden lg:block flex-1" />
              <button
                className="rounded-xl px-3.5 py-2.5 text-[rgb(var(--color-surface-1))] bg-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-text-primary))]/90 transition shadow w-full lg:w-auto"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
              >
                Get started
              </button>
            </div>
          </div>
          <div
            ref={checklistRef}
            className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                Welcome checklist
              </div>
              <div className="text-xs font-medium text-slate-300 bg-slate-700 px-2 py-1 rounded-full">
                {completedCount} of {checklistItems.length} complete
              </div>
            </div>
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <ChecklistItem key={index} done={item.done}>
                  {item.label}
                </ChecklistItem>
              ))}
            </div>
            <button
              onClick={() => setSetupModalOpen(true)}
              className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 border border-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-2))] transition"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            >
              <FaPlayCircle /> Continue setup
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Collections' && <CollectionsPanel items={demoCollections} />}
      {activeTab === 'Membership' && (
        <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-6 text-[rgb(var(--color-text-secondary))]">
          Membership builder coming soon — tiers, perks, trials, and more.
        </div>
      )}
      {activeTab === 'About' && (
        <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-6 text-[rgb(var(--color-text-secondary))]">
          Add details about yourself, your work, and why people should join.
        </div>
      )}

      {/* RENDER THE MODAL */}
      <OnboardingModal
        open={isSetupModalOpen}
        onOpenChange={setSetupModalOpen}
        userProfile={creatorProfile}
        onFinished={() => {
          setSetupModalOpen(false)
          queryClient.invalidateQueries('currentUser')
        }}
      />
    </div>
  )
}

export default DashboardHome

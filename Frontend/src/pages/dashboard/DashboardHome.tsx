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
  LuCamera,
  LuChevronUp,
  LuChevronDown,
  LuCheck,
  LuX,
  LuRadio,
} from 'react-icons/lu'
import { FaPlayCircle, FaRocket } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { IoBarChart } from 'react-icons/io5'

// Presumed imports for API and components
// =================================================================
// === V.V.IMPORTANT: Naye functions aur components import kiye gaye hain ===
// =================================================================
import { getCurrentUser, uploadImages, createLiveStream } from '../../api/apiClient.js'
import { OnboardingModal } from '../../components/creator/OnboardingModal'
import { BannerCropModal } from '../../components/creator/BannerCropModal'
import { ProfileCropModal } from '../../components/creator/ProfileCropModal'
import { GoLiveModal } from '../../components/creator/GoLiveModal' // <-- NAYA MODAL IMPORT

/* ========= Types (Unchanged) ========= */
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
    if (!cardRef.current || !numRef.current) return
    const ctx = gsap.context(() => {
      const startValue = { val: 0 }
      gsap.to(startValue, {
        val: value,
        duration: 1.2,
        ease: 'power3.out',
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = `${prefix}${Math.round(
              startValue.val,
            ).toLocaleString()}${suffix}`
          }
        },
      })
    }, cardRef)
    return () => ctx.revert()
  }, [value, prefix, suffix])

  return (
    <div
      ref={cardRef}
      className="flex items-center gap-4 rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-4 shadow-sm"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgb(var(--color-surface-3))]">
        <Icon className="text-xl text-[rgb(var(--color-text-primary))]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-[rgb(var(--color-text-muted))]">{label}</p>
        <p className="text-2xl font-semibold text-[rgb(var(--color-text-primary))]">
          <span ref={numRef}>0</span>
        </p>
      </div>
    </div>
  )
}
const ChecklistItem: React.FC<{ done?: boolean; children: React.ReactNode }> = ({
  done,
  children,
}) => (
  <div className="flex items-center gap-4">
    <div
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
        done ? 'bg-sky-500' : 'border-2 border-[rgb(var(--color-surface-3))]'
      }`}
    >
      {done && <LuCheck className="h-3.5 w-3.5 text-white" />}
    </div>
    <div
      className={`text-sm ${
        done
          ? 'text-[rgb(var(--color-text-primary))] font-medium'
          : 'text-[rgb(var(--color-text-secondary))]'
      }`}
    >
      {children}
    </div>
  </div>
)
const CollectionsPanel: React.FC<{ items: Collection[] }> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
          Your collections
        </h2>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-text-primary))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--color-surface-1))] shadow transition hover:bg-[rgb(var(--color-text-primary))]/90 sm:w-auto">
          <LuPlus /> New collection
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="overflow-hidden rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))]"
          >
            <div className="h-28 w-full bg-[rgb(var(--color-surface-3))]" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[rgb(var(--color-surface-3))] text-sm font-semibold">
                  {c.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="truncate font-medium text-[rgb(var(--color-text-primary))]">
                    {c.title}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    ${c.price}/mo • {c.posts} posts • {c.members} members • updated {c.updatedAt}
                  </p>
                </div>
                <button
                  onClick={() => toggle(c.id)}
                  className="ml-auto shrink-0 rounded-lg border border-[rgb(var(--color-surface-3))] px-2 py-1 text-xs text-[rgb(var(--color-text-secondary))] transition hover:bg-[rgb(var(--color-surface-2))]"
                >
                  {expandedId === c.id ? 'Hide' : 'View'}
                </button>
              </div>
              {expandedId === c.id && (
                <div className="mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-[rgb(var(--color-surface-3))] p-3 transition hover:bg-[rgb(var(--color-surface-2))]"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[rgb(var(--color-surface-3))]">
                        <FaPlayCircle />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[rgb(var(--color-text-primary))]">
                          {c.title} — Post #{i}
                        </p>
                        <p className="text-xs text-[rgb(var(--color-text-muted))]">Draft • 2 min</p>
                      </div>
                      <button className="ml-auto rounded-lg border border-[rgb(var(--color-surface-3))] px-2 py-1 text-xs hover:bg-[rgb(var(--color-surface-2))]">
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

/* ========= Dashboard Components (Unchanged) ========= */
const DailyViewsChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartData = useMemo(
    () => [
      { day: 'M', value: 320 },
      { day: 'T', value: 510 },
      { day: 'W', value: 650 },
      { day: 'T', value: 480 },
      { day: 'F', value: 700 },
      { day: 'S', value: 820 },
      { day: 'S', value: 780 },
    ],
    [],
  )
  const maxValue = useMemo(() => Math.max(...chartData.map((d) => d.value)), [chartData])

  useLayoutEffect(() => {
    if (!chartRef.current) return
    const bars = chartRef.current.querySelectorAll('.chart-bar')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, delay: 0.3 },
      )
    }, chartRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-4 sm:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
            Daily views (7d)
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Your page views over the last week
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgb(var(--color-surface-3))] px-3 py-2 text-sm transition hover:bg-[rgb(var(--color-surface-3))]">
          <IoBarChart /> View Analytics
        </button>
      </div>
      <div
        ref={chartRef}
        className="flex h-48 items-end justify-between gap-2 sm:gap-3"
        aria-label="Daily views chart"
      >
        {chartData.map((data, index) => (
          <div key={index} className="group flex flex-1 flex-col items-center">
            <div className="relative flex h-full w-full items-end">
              <div
                className="chart-bar w-full rounded-t-lg bg-gradient-to-t from-sky-500/50 to-sky-500 transition-all duration-300 ease-out hover:scale-y-105 hover:brightness-125"
                style={{ height: `${(data.value / maxValue) * 100}%` }}
              />
              <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-[rgb(var(--color-surface-3))] px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {data.value}
              </div>
            </div>
            <span className="mt-2 text-xs text-[rgb(var(--color-text-muted))]">{data.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
const DashboardInfoCards = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div className="flex flex-col rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5">
      <h3 className="text-lg font-semibold">Recent uploads</h3>
      <div className="my-4 flex-grow space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span>Making a hit in 60 minutes (replay)</span>
          <span className="shrink-0 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
            READY
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span>Studio Sessions: Beat Battle 🔥</span>
          <span className="shrink-0 rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
            LIVE
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span>Mix Template (Download)</span>
          <span className="shrink-0 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
            READY
          </span>
        </div>
      </div>
      <button className="w-full rounded-xl border border-[rgb(var(--color-surface-3))] py-2.5 text-sm font-semibold transition hover:bg-[rgb(var(--color-surface-3))]">
        Manage
      </button>
    </div>
    <div className="flex flex-col rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5">
      <h3 className="text-lg font-semibold">Upcoming live</h3>
      <div className="my-4 flex-grow">
        <p className="font-bold">Sunday Beat Cook-off</p>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">2025-10-07 19:00 • SUB</p>
      </div>
      <button className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
        Open Live Studio
      </button>
    </div>
    <div className="flex flex-col rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5">
      <h3 className="text-lg font-semibold">Payouts</h3>
      <div className="my-4 flex-grow space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Sep 1-30</span>
          <span className="font-semibold text-green-400">$1120.33 • paid</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Aug 1-31</span>
          <span className="font-semibold text-green-400">$987.44 • paid</span>
        </div>
      </div>
      <button className="w-full rounded-xl border border-[rgb(var(--color-surface-3))] py-2.5 text-sm font-semibold transition hover:bg-[rgb(var(--color-surface-3))]">
        View details
      </button>
    </div>
  </div>
)

/* ========= Main Screen (State and Layout updated for closable checklist) ========= */
const DashboardHome: React.FC = () => {
  // Existing State
  const [activeTab, setActiveTab] = useState<TabKey>('Home')
  const [isSetupModalOpen, setSetupModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isChecklistMinimized, setIsChecklistMinimized] = useState(false)
  const [isChecklistHidden, setIsChecklistHidden] = useState(false)
  const [bannerCropModalOpen, setBannerCropModalOpen] = useState(false)
  const [imageToCropForBanner, setImageToCropForBanner] = useState<string | null>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [profileCropModalOpen, setProfileCropModalOpen] = useState(false)
  const [imageToCropForProfile, setImageToCropForProfile] = useState<string | null>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  // ===========================================
  // === NAYI STATE LIVE STREAMING KE LIYE ===
  // ===========================================
  const [isCreatingStream, setIsCreatingStream] = useState(false)
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false)
  const [streamDetails, setStreamDetails] = useState<{ streamKey: string | null }>({
    streamKey: null,
  })

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserData, Error>('currentUser', getCurrentUser, { refetchOnWindowFocus: false })

  const statsData = useMemo(
    () => [
      { icon: LuEye, label: 'Views (7d)', value: 4850 },
      { icon: LuTrendingUp, label: 'Subscribers (7d)', value: 18 },
      { icon: FaPlayCircle, label: 'Watch Time (min, 7d)', value: 12500 },
      { icon: LuDollarSign, label: 'Revenue (7d)', value: 842, prefix: '$' },
    ],
    [],
  )

  const readFileAsDataURL = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader()
    reader.onload = () => callback(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (img: string) => void,
  ) => {
    if (e.target.files?.[0]) {
      readFileAsDataURL(e.target.files[0], callback)
    }
    e.target.value = ''
  }

  const handleUploadCroppedImage = async (blob: Blob, type: 'banner' | 'profile') => {
    setIsUploading(true)
    const toastId = toast.loading(`Uploading ${type}...`)
    const formData = new FormData()
    formData.append(type === 'banner' ? 'bannerImage' : 'profileImage', blob, `${type}.jpg`)
    try {
      await uploadImages(formData)
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated!`, { id: toastId })
      await queryClient.invalidateQueries('currentUser')
    } catch (error) {
      toast.error('Upload failed. Please try again.', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  // =======================================================
  // === GO LIVE FUNCTION AB MUKAMMAL LOGIC KE SATH HAI ===
  // =======================================================
  const handleGoLive = async () => {
    if (!user) return // Agar user data load nahi hua to kuch na karein

    setIsCreatingStream(true)
    const goLiveToast = toast.loading('Preparing your live stream...')

    try {
      const streamTitle = `${user.name || 'My'}'s Live Stream`
      const response = await createLiveStream({ title: streamTitle })

      if (response && response.streamKey) {
        setStreamDetails({ streamKey: response.streamKey })
        setIsGoLiveModalOpen(true) // Modal ko open karein
        toast.success('Your stream is ready!', { id: goLiveToast })
      } else {
        throw new Error('Stream key not found in API response.')
      }
    } catch (error) {
      console.error('Failed to create live stream:', error)
      toast.error('Could not start live stream. Please try again.', { id: goLiveToast })
    } finally {
      setIsCreatingStream(false)
    }
  }

  // =======================================================
  // === UX IMPROVEMENT: LIVE MODAL BAND HONE PAR REFRESH ===
  // =======================================================
  const handleCloseGoLiveModal = () => {
    setIsGoLiveModalOpen(false)

    // User ko batayein ke refresh ho raha hai
    const toastId = toast.loading('Refreshing your posts...')

    // Kuch waqt (e.g., 2 seconds) ke baad posts ki query ko invalidate karein
    setTimeout(() => {
      // NOTE: 'myPosts' aapki woh query key honi chahiye jo aap posts fetch karne ke liye istemal karte hain.
      // Agar aapne posts ko isi component mein fetch kiya hai ya kisi child component mein,
      // yeh un sab ko refresh kar dega jahan yeh key istemal ho rahi hai.
      queryClient
        .invalidateQueries('myPosts')
        .then(() => {
          toast.success('Posts updated!', { id: toastId })
        })
        .catch(() => {
          toast.error('Could not refresh posts.', { id: toastId })
        })
    }, 2000) // 2 second ka delay
  }

  const checklistItems = useMemo(() => {
    const profile = user?.creatorProfile
    if (!profile) return []
    return [
      { label: 'Set your page name', done: !!profile.pageName },
      { label: 'Add a profile photo', done: !!profile.profileImageUrl },
      { label: 'Add a banner image', done: !!profile.bannerUrl },
      { label: 'Describe your page', done: !!profile.bio && profile.bio.length > 10 },
      { label: 'Publish your page', done: profile.status === 'ACTIVE' },
    ]
  }, [user])

  const completedCount = useMemo(
    () => checklistItems.filter((item) => item.done).length,
    [checklistItems],
  )

  useLayoutEffect(() => {
    if (isLoading || isError) return
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [isLoading, isError])

  useLayoutEffect(() => {
    if (!tabsRef.current) return
    const u = tabsRef.current.querySelector<HTMLDivElement>('.tab-indicator')
    const a = tabsRef.current.querySelector<HTMLButtonElement>(`button[data-tab="${activeTab}"]`)
    if (!u || !a) return
    gsap.to(u, { x: a.offsetLeft, width: a.offsetWidth, duration: 0.25, ease: 'power2.out' })
  }, [activeTab])

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-[rgb(var(--color-text-secondary))]">Loading...</div>
      </div>
    )
  if (isError || !user || !user.creatorProfile)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="p-8 text-center">
          <div className="text-lg text-red-500">Error loading dashboard.</div>
        </div>
      </div>
    )

  const { creatorProfile } = user

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgb(var(--color-surface-3))',
            color: 'rgb(var(--color-text-primary))',
          },
        }}
      />

      {creatorProfile.status === 'DRAFT' && (
        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex-grow text-center text-sm sm:text-left">
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              Your page is not yet published.
            </span>{' '}
            Complete the checklist to go live.
          </div>
          <div className="flex w-full shrink-0 gap-2 sm:w-auto">
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[rgb(var(--color-surface-3))] px-3 py-2 text-sm font-semibold transition hover:bg-[rgb(var(--color-surface-3))]">
              <LuEye /> Preview
            </button>
            <button
              onClick={() => setSetupModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              <FaRocket /> Publish
            </button>
          </div>
        </div>
      )}

      <div
        ref={heroRef}
        className="overflow-hidden rounded-3xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-1))]"
      >
        <div className="group relative">
          <div
            className="h-36 w-full bg-cover bg-center bg-[rgb(var(--color-surface-3))] sm:h-48 md:h-56"
            style={{ backgroundImage: `url(${creatorProfile.bannerUrl || ''})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white/30 disabled:opacity-50"
            >
              <LuCamera size={16} />
              <span>{isUploading ? 'Uploading...' : 'Change Banner'}</span>
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={bannerInputRef}
          onChange={(e) =>
            handleFileChange(e, (img) => {
              setImageToCropForBanner(img)
              setBannerCropModalOpen(true)
            })
          }
          className="hidden"
          accept="image/*"
        />
        <input
          type="file"
          ref={profileInputRef}
          onChange={(e) =>
            handleFileChange(e, (img) => {
              setImageToCropForProfile(img)
              setProfileCropModalOpen(true)
            })
          }
          className="hidden"
          accept="image/*"
        />
        <div className="flex flex-col items-center p-4 sm:p-6 md:flex-row md:items-end md:gap-4">
          <div className="group relative -mt-14 shrink-0 md:-mt-20">
            <img
              src={
                creatorProfile.profileImageUrl ||
                user.imageUrl ||
                `https://ui-avatars.com/api/?name=${user.name || '?'}`
              }
              alt="Avatar"
              className="h-24 w-24 rounded-2xl border-4 border-[rgb(var(--color-surface-1))] object-cover shadow-lg md:h-28 md:w-28"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => profileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-white/30 disabled:opacity-50"
              >
                <LuCamera size={14} />
                <span>Change</span>
              </button>
            </div>
          </div>
          <div className="mt-2 min-w-0 flex-grow text-center md:mt-0 md:text-left">
            <h1 className="truncate text-2xl font-bold">{creatorProfile.pageName || user.name}</h1>
            <div className="group mt-1 flex cursor-pointer items-center justify-center gap-2 text-sm text-sky-400 md:justify-start">
              <LuLink className="shrink-0" />
              <span className="truncate group-hover:underline">{`vybzz.com/${creatorProfile.pageUrl}`}</span>
            </div>
          </div>

          <div className="mt-4 flex w-full shrink-0 flex-wrap justify-center gap-2 md:mt-0 md:w-auto md:flex-nowrap">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--color-surface-3))] transition hover:bg-[rgb(var(--color-surface-3))] sm:w-auto sm:px-3 sm:gap-2">
              <LuEye className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Preview</span>
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--color-surface-3))] transition hover:bg-[rgb(var(--color-surface-3))] sm:w-auto sm:px-3 sm:gap-2">
              <LuShare2 className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Share</span>
            </button>
            {/* ========= GO LIVE BUTTON AB LOADING STATE HANDLE KAREGA ========= */}
            <button
              onClick={handleGoLive}
              disabled={isCreatingStream}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-600 sm:w-auto sm:px-3 sm:gap-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LuRadio className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">
                {isCreatingStream ? 'Preparing...' : 'Go Live'}
              </span>
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-600 sm:w-auto sm:px-3 sm:gap-2 font-semibold">
              <LuPlus className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Create</span>
            </button>
          </div>
        </div>

        <div
          ref={tabsRef}
          className="border-t border-[rgb(var(--color-surface-3))] px-4 pt-2 pb-2 sm:px-6"
        >
          <div className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-[rgb(var(--color-surface-2))] p-1">
            <div
              className="tab-indicator pointer-events-none absolute inset-y-1 rounded-full bg-[rgb(var(--color-surface-3))]"
              style={{ willChange: 'transform, width' }}
            />
            {(['Home', 'Collections', 'Membership', 'About'] as const).map((t) => (
              <button
                key={t}
                data-tab={t}
                onClick={() => setActiveTab(t)}
                className={`relative z-10 rounded-full px-3 py-1.5 text-sm transition-colors duration-200 sm:px-4 ${
                  activeTab === t
                    ? 'font-semibold text-[rgb(var(--color-text-primary))]'
                    : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'Home' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div
            className={`flex flex-col gap-6 transition-all duration-300 ${
              isChecklistHidden ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'
            }`}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
            <DailyViewsChart />
            <DashboardInfoCards />
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5 sm:flex-row sm:items-center">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-500/15">
                <LuSparkles className="text-sky-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Grow your business</p>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  Add posts and set up membership tiers.
                </p>
              </div>
              <button className="w-full shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 sm:w-auto">
                Get started
              </button>
            </div>
          </div>

          {!isChecklistHidden && (
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="relative pt-1">
                    <span className="absolute -top-1 -left-1.5 h-3 w-3 rounded-full bg-teal-400"></span>
                    <h3 className="text-lg font-bold leading-tight">
                      Welcome
                      <br />
                      checklist
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <div className="grid h-9 w-9 place-content-center rounded-full bg-[rgb(var(--color-surface-3))] text-center text-xs font-bold leading-tight">
                      {completedCount} of {checklistItems.length}
                    </div>
                    <button
                      onClick={() => setIsChecklistMinimized(!isChecklistMinimized)}
                      className="rounded-full p-2 transition-colors hover:bg-[rgb(var(--color-surface-3))]"
                    >
                      {isChecklistMinimized ? <LuChevronDown /> : <LuChevronUp />}
                    </button>
                    <button
                      onClick={() => setIsChecklistHidden(true)}
                      className="rounded-full p-2 transition-colors hover:bg-[rgb(var(--color-surface-3))]"
                    >
                      <LuX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isChecklistMinimized ? '0px' : '500px',
                    marginTop: isChecklistMinimized ? '0' : '1.5rem',
                    opacity: isChecklistMinimized ? 0 : 1,
                  }}
                >
                  <div className="space-y-4">
                    {checklistItems.map((item, i) => (
                      <ChecklistItem key={i} done={item.done}>
                        {item.label}
                      </ChecklistItem>
                    ))}
                  </div>
                  <button
                    onClick={() => setSetupModalOpen(true)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-transparent bg-[rgb(var(--color-surface-3))] py-2.5 text-sm font-semibold transition hover:bg-[rgb(var(--color-surface-3))]/80"
                  >
                    <FaPlayCircle /> Continue setup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'Collections' && <CollectionsPanel items={demoCollections} />}
      {activeTab === 'Membership' && (
        <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-6">
          Membership page coming soon.
        </div>
      )}
      {activeTab === 'About' && (
        <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-6">
          About page editor coming soon.
        </div>
      )}

      {/* --- Modals --- */}
      <OnboardingModal
        open={isSetupModalOpen}
        onOpenChange={setSetupModalOpen}
        userProfile={creatorProfile}
        onFinished={() => {
          setSetupModalOpen(false)
          queryClient.invalidateQueries('currentUser')
        }}
      />
      <BannerCropModal
        imageSrc={imageToCropForBanner}
        open={bannerCropModalOpen}
        onOpenChange={setBannerCropModalOpen}
        onCropComplete={(blob) => handleUploadCroppedImage(blob, 'banner')}
      />
      <ProfileCropModal
        imageSrc={imageToCropForProfile}
        open={profileCropModalOpen}
        onOpenChange={setProfileCropModalOpen}
        onCropComplete={(blob) => handleUploadCroppedImage(blob, 'profile')}
      />

      {/* ========================================================== */}
      {/* === NAYA GO LIVE MODAL YAHAN RENDER KIYA JAYEGA (UPDATED) === */}
      {/* ========================================================== */}
      {isGoLiveModalOpen && streamDetails.streamKey && (
        <GoLiveModal streamKey={streamDetails.streamKey} onClose={handleCloseGoLiveModal} />
      )}
    </div>
  )
}

export default DashboardHome

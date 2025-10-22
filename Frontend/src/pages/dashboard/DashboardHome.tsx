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
  LuCamera,
} from 'react-icons/lu'
import { FaPlayCircle, FaCheckCircle, FaRocket } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'

// Import our centralized API functions and components
import { getCurrentUser, uploadImages } from '../../api/apiClient.js'
import { OnboardingModal } from '../../components/creator/OnboardingModal'
import { BannerCropModal } from '../../components/creator/BannerCropModal'
import { ProfileCropModal } from '../../components/creator/ProfileCropModal'

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
        done ? 'bg-sky-500/20' : 'bg-[rgb(var(--color-surface-3))]'
      }`}
    >
      <FaCheckCircle className={done ? 'text-sky-500' : 'text-[rgb(var(--color-text-muted))]'} />
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
  const [isUploading, setIsUploading] = useState(false)

  const [bannerCropModalOpen, setBannerCropModalOpen] = useState(false)
  const [imageToCropForBanner, setImageToCropForBanner] = useState<string | null>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [profileCropModalOpen, setProfileCropModalOpen] = useState(false)
  const [imageToCropForProfile, setImageToCropForProfile] = useState<string | null>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)

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
  } = useQuery<UserData, Error>('currentUser', getCurrentUser, {
    refetchOnWindowFocus: false,
  })

  const readFileAsDataURL = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader()
    reader.onload = () => callback(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      readFileAsDataURL(e.target.files[0], (img) => {
        setImageToCropForBanner(img)
        setBannerCropModalOpen(true)
      })
    }
    e.target.value = ''
  }
  const handleUploadCroppedBanner = async (croppedBlob: Blob) => {
    setIsUploading(true)
    const toastId = toast.loading('Uploading banner...')
    const formData = new FormData()
    formData.append('bannerImage', croppedBlob, 'banner.jpg')
    try {
      await uploadImages(formData)
      toast.success('Banner updated!', { id: toastId })
      await queryClient.invalidateQueries('currentUser')
    } catch (error) {
      toast.error('Upload failed. Please try again.', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }
  const triggerBannerUpload = () => bannerInputRef.current?.click()

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      readFileAsDataURL(e.target.files[0], (img) => {
        setImageToCropForProfile(img)
        setProfileCropModalOpen(true)
      })
    }
    e.target.value = ''
  }
  const handleUploadCroppedProfileImage = async (croppedBlob: Blob) => {
    setIsUploading(true)
    const toastId = toast.loading('Uploading photo...')
    const formData = new FormData()
    formData.append('profileImage', croppedBlob, 'profile.jpg')
    try {
      await uploadImages(formData)
      toast.success('Profile photo updated!', { id: toastId })
      await queryClient.invalidateQueries('currentUser')
    } catch (error) {
      toast.error('Upload failed. Please try again.', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }
  const triggerProfileUpload = () => profileInputRef.current?.click()

  // === CHECKLIST LOGIC UPDATED ===
  const checklistItems = useMemo(() => {
    const profile = user?.creatorProfile
    if (!profile) return []

    return [
      { label: 'Set your page name', done: !!profile.pageName },
      { label: 'Add a profile photo', done: !!profile.profileImageUrl },
      { label: 'Add a banner image', done: !!profile.bannerUrl }, // New step added
      { label: 'Describe your page', done: !!profile.bio && profile.bio.length > 10 },
      { label: 'Publish your page', done: profile.status === 'ACTIVE' },
      { label: 'Promote your page', done: false }, // This can be updated with real logic later
    ]
  }, [user])

  const completedCount = checklistItems.filter((item) => item.done).length

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
  useLayoutEffect(() => {
    if (!tabsRef.current) return
    const u = tabsRef.current.querySelector<HTMLDivElement>('.tab-indicator')
    const a = tabsRef.current.querySelector<HTMLButtonElement>(`button[data-tab="${activeTab}"]`)
    if (!u || !a) return
    if (!u.style.transform) {
      gsap.set(u, { x: a.offsetLeft, width: a.offsetWidth, autoAlpha: 1 })
    } else {
      gsap.to(u, { x: a.offsetLeft, width: a.offsetWidth, duration: 0.25, ease: 'power2.out' })
    }
  }, [activeTab])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-[rgb(var(--color-text-secondary))]">Loading...</div>
      </div>
    )
  }
  if (isError || !user || !user.creatorProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8">
          <div className="text-lg text-red-500">Error loading dashboard.</div>
        </div>
      </div>
    )
  }

  const { creatorProfile } = user

  return (
    <div className="space-y-6">
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
        <div
          ref={statusBarRef}
          className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="text-sm text-center sm:text-left text-[rgb(var(--color-text-secondary))]">
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              Your page is not yet published
            </span>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto flex gap-2">
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 bg-[rgb(var(--color-surface-3))]">
              <LuEye /> Preview
            </button>
            <button
              onClick={() => setSetupModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 bg-white text-black"
            >
              <FaRocket /> Publish
            </button>
          </div>
        </div>
      )}

      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))]"
      >
        <div className="relative group">
          <div
            className="h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${creatorProfile.bannerUrl || ''})` }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={triggerBannerUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg backdrop-blur-sm hover:bg-white/30 transition disabled:opacity-50"
            >
              <LuCamera size={16} />
              <span>{isUploading ? 'Uploading...' : 'Change Banner'}</span>
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={bannerInputRef}
          onChange={handleBannerFileChange}
          className="hidden"
          accept="image/*"
        />
        <input
          type="file"
          ref={profileInputRef}
          onChange={handleProfileFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="px-4 sm:px-6 pb-5 pt-4 bg-[rgb(var(--color-surface-1))] flex flex-col md:flex-row items-start gap-x-6 gap-y-4">
          <div className="relative -mt-16 md:-mt-20 group">
            <img
              src={
                creatorProfile.profileImageUrl ||
                user.imageUrl ||
                `https://ui-avatars.com/api/?name=${user.name || '?'}`
              }
              alt="Avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border-4 border-[rgb(var(--color-surface-1))]"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <button
                onClick={triggerProfileUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg backdrop-blur-sm hover:bg-white/30 transition disabled:opacity-50"
              >
                <LuCamera size={14} />
                <span>Change</span>
              </button>
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-2xl font-semibold">{creatorProfile.pageName || user.name}</div>
            <div className="flex items-center gap-2 text-sm text-sky-400">
              <LuLink className="shrink-0" />
              {`vybzz.com/${creatorProfile.pageUrl}`}
            </div>
          </div>
          <div className="hidden md:block flex-1" />
          <div className="w-full md:w-auto flex gap-2">
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl p-2.5 border border-[rgb(var(--color-surface-3))]">
              <LuEye />
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl p-2.5 bg-white text-black">
              <LuShare2 />
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl p-2.5 bg-sky-500 text-white">
              <LuPlus />
            </button>
          </div>
        </div>
        <div ref={tabsRef} className="px-4 sm:px-6 pb-4 pt-2 overflow-x-auto">
          <div className="relative inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-surface-2))] p-1 border-[rgb(var(--color-surface-3))]">
            <div
              className="tab-indicator absolute inset-y-1 rounded-full bg-[rgb(var(--color-surface-3))] opacity-0 pointer-events-none"
              style={{ willChange: 'transform, width' }}
            />
            {(['Home', 'Collections', 'Membership', 'About'] as const).map((t) => (
              <button
                key={t}
                data-tab={t}
                onClick={() => setActiveTab(t)}
                className={`relative z-10 rounded-full px-4 py-2 text-sm transition ${
                  activeTab === t ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'Home' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" ref={gridRef}>
          <div className="xl:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={LuUsers} label="Active patrons" value={150} />
              <StatCard icon={LuDollarSign} label="Monthly income" value={1200} prefix="$" />
              <StatCard icon={LuTrendingUp} label="30-day growth" value={18} suffix="%" />
              <StatCard icon={FaPlayCircle} label="Last post views" value={842} />
            </div>
            <div className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-sky-500/15 shrink-0">
                <LuSparkles className="text-sky-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Grow your business</div>
                <div className="text-sm text-slate-400">Add posts and set up membership tiers.</div>
              </div>
              <button className="rounded-xl px-3.5 py-2.5 bg-white text-black">Get started</button>
            </div>
          </div>
          <div
            ref={checklistRef}
            className="rounded-2xl border border-[rgb(var(--color-surface-3))] bg-[rgb(var(--color-surface-2))] p-5"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-lg font-semibold">Welcome checklist</div>
              <div className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                {completedCount} of {checklistItems.length}
              </div>
            </div>
            <div className="space-y-4">
              {checklistItems.map((item, i) => (
                <ChecklistItem key={i} done={item.done}>
                  {item.label}
                </ChecklistItem>
              ))}
            </div>
            <button
              onClick={() => setSetupModalOpen(true)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl p-2.5 border border-[rgb(var(--color-surface-3))]"
            >
              <FaPlayCircle /> Continue setup
            </button>
          </div>
        </div>
      )}
      {activeTab === 'Collections' && <CollectionsPanel items={demoCollections} />}
      {activeTab === 'Membership' && <div className="p-6">Membership page coming soon.</div>}
      {activeTab === 'About' && <div className="p-6">About page editor coming soon.</div>}

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
        onCropComplete={handleUploadCroppedBanner}
      />
      <ProfileCropModal
        imageSrc={imageToCropForProfile}
        open={profileCropModalOpen}
        onOpenChange={setProfileCropModalOpen}
        onCropComplete={handleUploadCroppedProfileImage}
      />
    </div>
  )
}

export default DashboardHome

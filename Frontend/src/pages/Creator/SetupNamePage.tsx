import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { gsap } from 'gsap'

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

const SetupNamePage: React.FC = () => {
  const [creatorName, setCreatorName] = useState('')
  const [isAdultOnly, setIsAdultOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle')

  const navigate = useNavigate()
  const { getToken } = useAuth()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const formColRef = useRef<HTMLDivElement | null>(null)
  const rightColRef = useRef<HTMLDivElement | null>(null)
  const cardLeftRef = useRef<HTMLDivElement | null>(null)
  const cardRightRef = useRef<HTMLDivElement | null>(null)
  const shapesRef = useRef<HTMLDivElement | null>(null)

  const slugPreview = creatorName || 'your-page'

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
    setCreatorName(sanitizedValue)
  }

  useEffect(() => {
    const trimmedName = creatorName.trim()
    if (trimmedName.length === 0) {
      setAvailabilityStatus('idle')
      return
    }
    if (trimmedName.length < 3) {
      setAvailabilityStatus('invalid')
      return
    }
    setAvailabilityStatus('checking')
    const handler = setTimeout(() => {
      checkAvailability(trimmedName)
    }, 500)
    return () => {
      clearTimeout(handler)
    }
  }, [creatorName, getToken])

  const checkAvailability = async (slug: string) => {
    try {
      const token = await getToken()
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/creator/check-availability`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pageUrl: slug }),
      })

      if (!response.ok) {
        // Handle 404, 500, etc. errors gracefully
        setAvailabilityStatus('taken')
        return
      }

      const data = await response.json()

      if (data.available) {
        setAvailabilityStatus('available')
      } else {
        setAvailabilityStatus('taken')
      }
    } catch (err) {
      console.error('Availability check failed:', err)
      setAvailabilityStatus('taken') // Assume taken on error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (availabilityStatus !== 'available') {
      setError('Please choose an available name.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/creator/setup-name`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pageName: creatorName, adultOnly: isAdultOnly }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create page.')
      }
      navigate('/creator/connect-socials')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }
  console.log(import.meta.env.VITE_API_BASE_URL)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(containerRef.current, { opacity: 0, duration: 0.35 })
      tl.from(
        formColRef.current?.querySelectorAll("[data-animate='form']"),
        { y: 16, opacity: 0, stagger: 0.08, duration: 0.45 },
        '-=0.1',
      )
      tl.from(rightColRef.current, { opacity: 0, x: 24, duration: 0.5 }, '-=0.2')
      if (cardLeftRef.current) {
        gsap.to(cardLeftRef.current, {
          y: 10,
          rotate: -3,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
      if (cardRightRef.current) {
        gsap.to(cardRightRef.current, {
          y: -10,
          rotate: 3,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
      if (shapesRef.current) {
        gsap.to(shapesRef.current.querySelectorAll('[data-blob]'), {
          xPercent: gsap.utils.wrap([-6, 6, -4, 8]),
          yPercent: gsap.utils.wrap([5, -7, 6, -5]),
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.5,
        })
      }
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const node = rightColRef.current
    if (!node) return
    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width - 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to([cardLeftRef.current, cardRightRef.current], {
        x: relX * 12,
        y: relY * 12,
        rotateY: relX * 8,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
    node.addEventListener('mousemove', onMove)
    return () => node.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen bg-[rgb(var(--color-background-dark))] text-white"
    >
      <div className="w-full lg:w-1-2 flex items-center justify-center p-6 sm:p-10">
        <div ref={formColRef} className="w-full max-w-md" aria-live="polite">
          <h1
            data-animate="form"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
          >
            Let’s name your page
          </h1>
          <p data-animate="form" className="text-[rgb(var(--color-text-muted))] mb-8">
            Go with your real name or something creative. You can change this later.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div data-animate="form" className="space-y-2">
              <label htmlFor="creatorName" className="sr-only">
                Creator name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-white/40 pointer-events-none">@</span>
                <input
                  id="creatorName"
                  type="text"
                  value={creatorName}
                  onChange={handleNameChange}
                  placeholder="yourname"
                  maxLength={40}
                  className="w-full bg-[#1b1f2a]/80 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-transparent transition-shadow"
                  disabled={isLoading}
                  aria-invalid={availabilityStatus === 'taken' || availabilityStatus === 'invalid'}
                  aria-describedby="name-help"
                />
                {availabilityStatus === 'available' && (
                  <div className="absolute right-4 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-white/60 h-4">
                <span id="name-help">
                  URL preview: <span className="text-cyan-300">vybzz.app/@{slugPreview}</span>
                </span>
                <span>{creatorName.trim().length}/40</span>
              </div>
            </div>
            <div data-animate="form" className="pt-2">
              <label className="flex items-start gap-3 text-sm text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-[#1b1f2a] focus:ring-cyan-400/60"
                  checked={isAdultOnly}
                  onChange={(e) => setIsAdultOnly(e.target.checked)}
                  disabled={isLoading}
                />
                <span>My page isn’t suitable for people under 18</span>
              </label>
            </div>
            {error && (
              <p id="name-error" className="text-red-400 text-sm" role="alert" data-animate="form">
                {error}
              </p>
            )}
            <button
              data-animate="form"
              type="submit"
              disabled={isLoading || availabilityStatus !== 'available'}
              className="w-full h-12 rounded-xl font-semibold bg-white text-black hover:bg-white/90 disabled:bg-white/40 disabled:text-black/60 transition-colors shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
            >
              {isLoading ? 'Continuing…' : 'Continue'}
            </button>
            <div data-animate="form" className="text-center pt-6">
              <button
                type="button"
                onClick={() => navigate('/member/home')}
                className="text-white/60 hover:text-white transition-colors"
              >
                Not a creator? Join as a fan
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        ref={rightColRef}
        className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_70%_40%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(80%_50%_at_30%_60%,rgba(99,102,241,0.18),transparent_60%)]" />
        <div ref={shapesRef} className="absolute inset-0">
          <div
            data-blob
            className="absolute -top-12 left-10 size-40 rounded-full bg-cyan-400/10 blur-2xl"
          />
          <div
            data-blob
            className="absolute top-24 -right-12 size-48 rounded-full bg-indigo-400/10 blur-2xl"
          />
          <div
            data-blob
            className="absolute bottom-10 right-28 size-32 rounded-full bg-pink-400/10 blur-2xl"
          />
        </div>
        <div
          ref={cardLeftRef}
          className="relative w-64 h-80 bg-white rounded-2xl shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-300 will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1593697909777-138e8c90ac91?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Jade Novah"
            className="w-full h-2/3 object-cover rounded-t-2xl"
            draggable={false}
          />
          <div className="p-4 text-center text-slate-900">
            <h3 className="font-bold">Jade Novah</h3>
            <p className="text-slate-500 text-sm">Music • Behind the scenes</p>
          </div>
        </div>
        <div
          ref={cardRightRef}
          className="relative w-64 h-80 bg-white rounded-2xl shadow-2xl rotate-6 ml-[-4rem] mt-16 hover:rotate-0 transition-transform duration-300 will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1593697909683-bccb1b9e68a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171"
            alt="The Royals of Malibu"
            className="w-full h-2/3 object-cover rounded-t-2xl"
            draggable={false}
          />
          <div className="p-4 text-center text-slate-900">
            <h3 className="font-bold">The Royals of Malibu</h3>
            <p className="text-slate-500 text-sm">Fiction • Bonus chapters</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupNamePage

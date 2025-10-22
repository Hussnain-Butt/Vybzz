import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { FaYoutube, FaInstagram, FaTwitter, FaFacebook, FaTwitch, FaTiktok } from 'react-icons/fa'
import { gsap } from 'gsap'
import Logo from '../../assets/Logo.png'

/**
 * Quick CSS note (add in index.css if you still see double scrollbars):
 * html{overflow-y:auto;overflow-x:hidden;height:100%}
 * body{overflow:visible;height:100%;margin:0}
 * #root{min-height:100dvh}
 */

interface SocialPlatform {
  key: 'youtube' | 'instagram' | 'twitter' | 'facebook' | 'twitch' | 'tiktok'
  name: string
  Icon: React.ComponentType<{ className?: string }>
  baseUrl: string
  placeholder: string
  accentBg: string
}

const socialPlatforms: SocialPlatform[] = [
  {
    key: 'youtube',
    name: 'YouTube',
    Icon: FaYoutube,
    baseUrl: 'https://www.youtube.com/',
    placeholder: 'channel/UCxxxx or @yourhandle',
    accentBg: 'rgb(239 68 68 / .10)',
  },
  {
    key: 'instagram',
    name: 'Instagram',
    Icon: FaInstagram,
    baseUrl: 'https://www.instagram.com/',
    placeholder: 'your_username',
    accentBg: 'rgb(236 72 153 / .10)',
  },
  {
    key: 'twitter',
    name: 'Twitter / X',
    Icon: FaTwitter,
    baseUrl: 'https://twitter.com/',
    placeholder: 'your_handle',
    accentBg: 'rgb(56 189 248 / .10)',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    Icon: FaFacebook,
    baseUrl: 'https://www.facebook.com/',
    placeholder: 'your.page.name',
    accentBg: 'rgb(59 130 246 / .10)',
  },
  {
    key: 'twitch',
    name: 'Twitch',
    Icon: FaTwitch,
    baseUrl: 'https://www.twitch.tv/',
    placeholder: 'your_channel',
    accentBg: 'rgb(168 85 247 / .10)',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    Icon: FaTiktok,
    baseUrl: 'https://www.tiktok.com/@',
    placeholder: 'your_handle',
    accentBg: 'rgb(250 204 21 / .10)',
  },
]

const composeUrl = (platform: SocialPlatform, value: string) => {
  const v = value.trim()
  if (!v) return ''
  try {
    return new URL(v).toString()
  } catch {}
  return platform.baseUrl + v.replace(/^@/, '')
}

const isValidInput = (value: string) => {
  const v = value.trim()
  if (!v) return false
  return !/\s/.test(v)
}

const ConnectSocialsPage: React.FC = () => {
  const navigate = useNavigate()
  const { getToken } = useAuth()

  const [isSaving, setIsSaving] = useState(false)
  const [expandedKey, setExpandedKey] = useState<SocialPlatform['key'] | null>(null)
  const [socialLinks, setSocialLinks] = useState<Record<SocialPlatform['key'], string | null>>({
    youtube: null,
    instagram: null,
    twitter: null,
    facebook: null,
    twitch: null,
    tiktok: null,
  })
  const [tempInputs, setTempInputs] = useState<Record<SocialPlatform['key'], string>>({
    youtube: '',
    instagram: '',
    twitter: '',
    facebook: '',
    twitch: '',
    tiktok: '',
  })
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
      const items = gsap.utils.toArray<HTMLElement>('.social-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 10, filter: 'blur(1px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'power3.out',
          stagger: 0.05,
          delay: 0.05,
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const toggleExpand = (key: SocialPlatform['key']) =>
    setExpandedKey((prev) => (prev === key ? null : key))

  const handleSaveOne = (p: SocialPlatform) => {
    const value = tempInputs[p.key]
    if (!isValidInput(value)) {
      setToast({ type: 'error', msg: 'Invalid handle or URL.' })
      return
    }
    setSocialLinks((prev) => ({ ...prev, [p.key]: composeUrl(p, value) }))
    setExpandedKey(null)
    setToast({ type: 'success', msg: p.name + ' connected.' })
  }

  const handleDisconnect = (p: SocialPlatform) => {
    setSocialLinks((prev) => ({ ...prev, [p.key]: null }))
    setToast({ type: 'success', msg: p.name + ' disconnected.' })
  }

  const handleContinue = async () => {
    setIsSaving(true)
    try {
      const token = await getToken()
      const linksToSave = Object.fromEntries(
        Object.entries(socialLinks).filter(([, v]) => v),
      ) as Record<string, string>
      const api = (import.meta as any).env.VITE_API_BASE_URL + '/users/creator/socials'

      const res = await fetch(api, {
        method: 'PUT', // PUT use karna update ke liye behtar hai
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(linksToSave),
      })

      if (!res.ok) throw new Error('Failed to save social links.')

      setToast({ type: 'success', msg: 'Social links saved.' })

      // ✅ SUCCESS! Ab gatekeeper page par jao, woh khud dashboard bhej dega.
      // Yeh logic bilkul perfect hai.
      setTimeout(() => navigate('/auth-redirect?role=creator'), 420)
    } catch (e) {
      console.error(e)
      setToast({ type: 'error', msg: 'Could not save. Try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const gridClass = (open: boolean) =>
    open
      ? 'grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out'
      : 'grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out'

  return (
    <div
      ref={rootRef}
      className="relative mx-auto min-h-dvh w-full overflow-x-hidden bg-[rgb(var(--color-background-dark))] px-4 py-10 text-white sm:px-6"
    >
      {/* Visual glows constrained inside viewport */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(closest-side, rgba(56,189,248,.14), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-28 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(closest-side, rgba(59,130,246,.12), transparent 70%)',
          }}
        />
      </div>

      <img
        src={Logo}
        alt="Vybzz Logo"
        className="absolute left-4 top-4 h-7 opacity-80 md:left-8 md:top-6"
      />

      <div ref={headerRef} className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Help your fans find you faster
        </h1>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] sm:text-base">
          Connect your socials so your page appears in search and fans can discover you on Vybzz.
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[rgb(var(--color-surface-1))] px-3 py-4 shadow-[0_8px_30px_rgba(0,0,0,.25)] sm:px-5 md:max-w-lg">
        <div className="space-y-2">
          {socialPlatforms.map((p) => {
            const connected = !!socialLinks[p.key]
            const isOpen = expandedKey === p.key
            return (
              <div
                key={p.key}
                className="social-item rounded-xl border border-white/10 bg-white/[.02]"
              >
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <p.Icon className="text-xl text-white/80 sm:text-2xl" />
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-[15px] font-semibold text-white/90">
                        {p.name}
                      </div>
                      {connected ? (
                        <a
                          href={socialLinks[p.key] ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-xs text-[rgb(var(--color-text-link))] hover:underline"
                        >
                          {socialLinks[p.key]}
                        </a>
                      ) : (
                        <div className="text-xs text-white/50">Not connected</div>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {connected ? (
                      <button
                        onClick={() => handleDisconnect(p)}
                        className="h-9 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/15 sm:text-sm"
                      >
                        ✓ Connected
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleExpand(p.key)}
                        className="h-9 rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-semibold text-white/85 hover:bg-white/10 sm:text-sm"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>

                <div className={gridClass(isOpen)} style={{ background: p.accentBg }}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col items-stretch gap-3 border-t border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:p-4">
                      <div className="flex-1">
                        <label className="mb-1 block text-[11px] text-white/70 sm:text-xs">
                          Enter handle or full URL
                        </label>
                        <div className="flex items-stretch gap-2">
                          <div className="hidden items-center rounded-lg border border-white/10 bg-white/5 px-2 text-[11px] text-white/70 sm:flex sm:text-xs">
                            {p.baseUrl.replace('https://', '')}
                          </div>
                          <input
                            value={tempInputs[p.key]}
                            onChange={(e) =>
                              setTempInputs((prev) => ({ ...prev, [p.key]: e.target.value }))
                            }
                            placeholder={p.placeholder}
                            className="w-full rounded-lg border border-white/15 bg-[rgb(var(--color-surface-2))] px-3 py-2 text-sm outline-none ring-white/10 transition-shadow focus:ring-2"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-col">
                        <button
                          onClick={() => handleSaveOne(p)}
                          className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-gray-200 sm:text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setExpandedKey(null)}
                          className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            id="save-btn"
            onClick={handleContinue}
            disabled={isSaving}
            className="h-11 w-full max-w-sm rounded-xl bg-gray-200 font-semibold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {isSaving ? 'Saving…' : 'Continue'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-white/60 hover:text-white"
          >
            Skip for now
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={
            (toast.type === 'success'
              ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200 '
              : 'border-rose-400/30 bg-rose-500/15 text-rose-200 ') +
            'fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border px-4 py-2 text-sm shadow-lg'
          }
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}

export default ConnectSocialsPage

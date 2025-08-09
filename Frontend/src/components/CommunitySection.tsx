// src/components/PodcastersPage/CommunitySection.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../Shared/Button' // Assuming Button component exists in Shared folder

gsap.registerPlugin(ScrollTrigger)

const CommunitySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const chat = chatRef.current
    const content = contentRef.current

    if (!section || !title || !chat || !content) return

    // Title animation with wavy effect
    const titleText = 'Creators. Fans. Nothing in between.'
    title.innerHTML = titleText
      .split('')
      .map((char) => (char === ' ' ? ' ' : `<span class="inline-block wavy-char">${char}</span>`))
      .join('')

    const wavyChars = title.querySelectorAll('.wavy-char')

    gsap.fromTo(
      wavyChars,
      { y: 100, opacity: 0, rotationX: -90 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.2,
        stagger: 0.02,
        ease: 'elastic.out(1, 0.8)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      },
    )

    // Chat interface and content animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.fromTo(
      chat,
      { x: 100, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
    ).fromTo(
      content.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
      '-=0.5',
    )

    // Chat messages stagger animation
    const chatMessages = chat.querySelectorAll('.chat-message')
    gsap.fromTo(
      chatMessages,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: chat,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  }, [])

  return (
    // Replaced gradient with a theme-consistent color
    <section ref={sectionRef} className="py-20 bg-[rgb(var(--color-background-blue))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Title */}
          <div className="text-[rgb(var(--color-text-primary))]">
            <h2
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8"
            >
              {/* Text will be populated by JavaScript */}
            </h2>

            <div ref={contentRef} className="space-y-6">
              <p className="text-xl text-[rgb(var(--color-text-primary)/0.8)] leading-relaxed">
                Vybzz Nation gives you a direct line of access to your fan community, with no ads or
                gatekeepers in the way.
              </p>

              <p className="text-lg text-[rgb(var(--color-text-primary)/0.9)] leading-relaxed">
                Through real-time group chats, comments, DMs, and even directly over email, you can
                connect more deeply and directly with your community here than anywhere else.
              </p>

              <Button
                variant="tertiary"
                className="text-lg px-8 py-4" // Using tertiary variant for the white button
              >
                Build real community
              </Button>
            </div>
          </div>

          {/* Right Chat Interface - Converted to Dark Theme */}
          <div ref={chatRef} className="relative">
            <div className="bg-[rgb(var(--color-background-light))] rounded-3xl shadow-2xl overflow-hidden max-w-md ml-auto border border-[rgb(var(--color-surface-3))]">
              {/* Chat Header */}
              <div className="bg-[rgb(var(--color-surface-2))] px-6 py-4 border-b border-[rgb(var(--color-surface-3))]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-primary))]">
                      ←
                    </button>
                    <div>
                      <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                        Chelsea Devantez's chat
                      </h3>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Chelsea Devantez • View Details
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://picsum.photos/seed/chelsea/100/100"
                      alt="Chelsea"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 h-80 overflow-y-auto">
                <div className="chat-message flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/maya/100/100"
                      alt="Maya"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[rgb(var(--color-text-primary))]">
                        Maya Joseph
                      </span>
                      <span className="text-xs text-[rgb(var(--color-text-muted))]">3m</span>
                    </div>
                    <div className="text-sm">🎉✨</div>
                  </div>
                </div>

                <div className="chat-message">
                  {/* Message bubble using theme color */}
                  <div className="bg-[rgb(var(--color-primary-blue))] text-white rounded-2xl px-4 py-2 inline-block max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img
                          src="https://picsum.photos/seed/chelsea/100/100"
                          alt="Chelsea"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium">Chelsea Devantez CREATOR</span>
                      <span className="text-xs opacity-75">3m</span>
                    </div>
                    <p className="text-sm">so glad everyone is here 😊</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs">❤️ 💯</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex -space-x-1">
                      {/* Reply indicators using theme colors */}
                      <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-primary-cyan))]"></div>
                      <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-accent-pink))]"></div>
                      <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-accent-orange))]"></div>
                    </div>
                    <span className="text-xs text-[rgb(var(--color-text-muted))]">
                      6 replies • 2 New
                    </span>
                  </div>
                </div>

                <div className="chat-message flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/kai/100/100"
                      alt="Kai"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[rgb(var(--color-text-primary))]">
                        Kai Nady
                      </span>
                      <span className="text-xs text-[rgb(var(--color-text-muted))]">2m</span>
                    </div>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      ok, who's seen a movie thats better than the book?
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                        <div className="w-4 h-4 rounded-full bg-red-400"></div>
                      </div>
                      <span className="text-xs text-[rgb(var(--color-text-muted))]">
                        2 replies • 1 New
                      </span>
                    </div>
                  </div>
                </div>

                <div className="chat-message flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/susie/100/100"
                      alt="Susie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[rgb(var(--color-text-primary))]">
                        Susie Kennedy
                      </span>
                      <span className="text-xs text-[rgb(var(--color-text-muted))]">3m</span>
                    </div>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-2">
                      after your last review i HAD to read this!
                    </p>
                    <div className="bg-[rgb(var(--color-surface-2))] rounded-xl p-3">
                      <img
                        src="https://picsum.photos/seed/book/200/150"
                        alt="Book"
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection

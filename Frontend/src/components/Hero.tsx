// src/components/Hero.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Play, Star, ArrowRight } from 'lucide-react'

// Swiper.js imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCreative, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-creative'
import 'swiper/css/effect-fade'

// --- Reusable Button component ---
const Button: React.FC<any> = ({ children, className, ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
)

// --- Static Data ---
const backgroundImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=compress&cs=tinysrgb&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=compress&cs=tinysrgb&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=compress&cs=tinysrgb&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=compress&cs=tinysrgb&w=1920&h=1080&q=80',
]

const creatorCardsData = [
  {
    name: 'Jacob Collier',
    image:
      'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bio: 'is a multi-instrumentalist, composer, and producer making music',
    earnings: '$8,912',
  },
  {
    name: 'Loish',
    image:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bio: 'is a digital artist & character designer creating magical illustrations',
    earnings: '$21,530',
  },
  {
    name: 'Marques Brownlee',
    image:
      'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bio: 'is a tech reviewer and YouTuber creating high-quality videos',
    earnings: '$55,200',
  },
]

// --- Fully Responsive Hero Component ---
const Hero: React.FC = () => {
  const heroContentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const creatorCardSliderRef = useRef<HTMLDivElement>(null)
  const swiperContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.7',
      )
      .fromTo(
        buttonsRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15 },
        '-=0.6',
      )
      .fromTo(statsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo(
        creatorCardSliderRef.current,
        { x: 80, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 1 },
        '-=1',
      )

    // Mouse parallax effect
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!heroContentRef.current) return
        const { clientX, clientY } = e
        const { offsetWidth, offsetHeight } = heroContentRef.current
        const xPercent = clientX / offsetWidth - 0.5
        const yPercent = clientY / offsetHeight - 0.5
        gsap.to(creatorCardSliderRef.current, {
          x: -xPercent * 50,
          y: -yPercent * 50,
          rotationY: -xPercent * 8,
          rotationX: yPercent * 8,
          duration: 1,
          ease: 'power2.out',
        })
        gsap.to(swiperContainerRef.current, {
          x: xPercent * 20,
          y: yPercent * 20,
          duration: 1.2,
          ease: 'power2.out',
        })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[rgb(var(--color-background-dark))] py-20 sm:py-0">
      <style>{`
        /* Swiper transition styles remain unchanged */
        .swiper-vertical-transition .swiper-slide-next { transform: translateY(100%) !important; }
        .swiper-vertical-transition .swiper-slide-prev { transform: translateY(-100%) !important; }
        .swiper-creative .swiper-slide { transition-property: transform, opacity; }
      `}</style>

      {/* Background Slider */}
      <div ref={swiperContainerRef} className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectCreative]}
          loop={true}
          speed={1000}
          effect={'creative'}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          creativeEffect={{
            prev: { shadow: true, translate: ['-100%', 0, -500] },
            next: { shadow: true, translate: ['100%', 0, -500] },
          }}
          className="w-full h-full"
        >
          {backgroundImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-background-dark))] via-[rgb(var(--color-background-dark)/0.8)] to-[rgb(var(--color-background-dark)/0.4)] z-10"></div>
      </div>
      {/* Background Glows using Theme Colors */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[rgb(var(--color-primary-blue)/0.2)] rounded-full mix-blend-lighten filter blur-3xl opacity-70 z-20"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[rgb(var(--color-primary-cyan)/0.2)] rounded-full mix-blend-lighten filter blur-3xl opacity-70 z-20"></div>

      {/* Responsive Content Layer */}
      <div
        ref={heroContentRef}
        className="relative z-30 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[rgb(var(--color-text-primary))] leading-tight mb-6"
            >
              Sing Your Song.
            </h1>
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              From music to podcasts, share your sound with the world and get paid for your passion.
            </p>
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Button className="group w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] text-white px-7 py-3 text-lg font-semibold rounded-full shadow-lg shadow-[rgb(var(--color-primary-blue)/0.3)] hover:shadow-xl hover:shadow-[rgb(var(--color-primary-cyan)/0.4)] transition-all duration-300 transform hover:scale-105">
                Start creating{' '}
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="group w-full sm:w-auto flex items-center justify-center border border-[rgb(var(--color-surface-3))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-surface-3)/0.8)] hover:bg-[rgb(var(--color-text-primary)/0.05)] backdrop-blur-sm px-7 py-3 text-lg font-semibold rounded-full transition-all duration-300">
                <Play className="mr-2 w-5 h-5 fill-[rgb(var(--color-text-secondary))] group-hover:fill-[rgb(var(--color-text-primary))] transition-colors" />{' '}
                Watch demo
              </Button>
            </div>
            <div
              ref={statsRef}
              className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[rgb(var(--color-text-secondary)/0.9)]"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />{' '}
                <span className="text-xs sm:text-sm font-medium">4.9/5 rating</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[rgb(var(--color-text-primary))]">200K+</span>{' '}
                <span className="ml-1.5">creators</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[rgb(var(--color-text-primary))]">$2B+</span>{' '}
                <span className="ml-1.5">paid out</span>
              </div>
            </div>
          </div>

          {/* Right Side: Card Slider */}
          <div
            ref={creatorCardSliderRef}
            className="relative flex justify-center lg:justify-end w-full max-w-md mx-auto lg:mx-0"
          >
            <Swiper
              modules={[Autoplay, EffectFade]}
              loop={true}
              speed={800}
              effect={'fade'}
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full"
            >
              {creatorCardsData.map((card, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-[rgb(var(--color-surface-1)/0.4)] backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-[rgb(var(--color-background-dark)/0.4)] border border-[rgb(var(--color-surface-3))] w-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[rgb(var(--color-surface-3))] flex-shrink-0">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-[rgb(var(--color-text-primary))] font-semibold text-lg">
                          {card.name}
                        </h3>
                        <p className="text-[rgb(var(--color-text-secondary)/0.9)] text-sm">
                          {card.bio}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="bg-[rgb(var(--color-surface-2)/0.6)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[rgb(var(--color-text-secondary))] font-medium">
                            Monthly earnings
                          </span>
                          <span className="text-green-400 font-bold">{card.earnings}</span>
                        </div>
                        <div className="w-full bg-[rgb(var(--color-surface-3))] rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] h-2 w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 bg-gradient-to-r from-[rgb(var(--color-primary-cyan))] to-[rgb(var(--color-primary-blue))] hover:from-[rgb(var(--color-primary-cyan)/0.8)] hover:to-[rgb(var(--color-primary-blue)/0.8)] text-white text-center py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer">
                          Become a patron
                        </div>
                        <div className="w-12 flex-shrink-0 h-12 bg-[rgb(var(--color-surface-2)/0.6)] rounded-xl flex items-center justify-center text-[rgb(var(--color-text-secondary)/0.9)] hover:text-white hover:bg-[rgb(var(--color-surface-3)/0.8)] transition-colors cursor-pointer">
                          <Star className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

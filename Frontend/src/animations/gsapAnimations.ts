// GSAP Animation utilities and configurations
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation presets
export const fadeInUp = {
  from: { y: 50, opacity: 0 },
  to: { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
};

export const fadeInLeft = {
  from: { x: -50, opacity: 0 },
  to: { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
};

export const fadeInRight = {
  from: { x: 50, opacity: 0 },
  to: { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
};

export const scaleIn = {
  from: { scale: 0.8, opacity: 0 },
  to: { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
};

// Scroll-triggered animation helper
export const createScrollAnimation = (
  element: gsap.TweenTarget,
  animationType: keyof typeof animations,
  options: {
    trigger?: string | Element;
    start?: string;
    end?: string;
    delay?: number;
  } = {}
) => {
  const animation = animations[animationType];
  const { trigger, start = "top 80%", end = "bottom 20%", delay = 0 } = options;

  return gsap.fromTo(element, animation.from, {
    ...animation.to,
    delay,
    scrollTrigger: {
      trigger: trigger || element,
      start,
      end,
      toggleActions: "play none none reverse"
    }
  });
};

const animations = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn
};

export default animations;
import Lenis from 'lenis';

let lenis: Lenis | null = null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Starts Lenis smooth scrolling once. Returns a cleanup function. */
export function initSmoothScroll(): () => void {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  let frame = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

/** Smoothly scroll to a selector, element or pixel offset, accounting for the fixed navbar. */
export function scrollToTarget(target: string | HTMLElement | number, offset = -72) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : offset });
    return;
  }

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior });
}

/** Pause/resume page scrolling (used while a modal or the loader is open). */
export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

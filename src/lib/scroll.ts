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

let lockCount = 0;

/**
 * Pause/resume page scrolling (loader, menu, modal). Locks are counted, so one
 * owner releasing its lock can't unfreeze the page while another still holds one.
 */
export function setScrollLocked(locked: boolean) {
  lockCount = Math.max(0, lockCount + (locked ? 1 : -1));
  const frozen = lockCount > 0;
  if (lenis) {
    if (frozen) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = frozen ? 'hidden' : '';
}

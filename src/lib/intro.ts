const KEY = 'ps-intro-seen';

function seenThisSession() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The intro plays once per browser session. */
export const showIntro = !seenThisSession() && !reducedMotion;

/** Seconds until the intro is out of the way; hero and chrome animations start from here. */
export const INTRO_DELAY = showIntro ? 1.55 : 0.1;

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Storage unavailable (private mode); the intro simply plays again.
  }
}

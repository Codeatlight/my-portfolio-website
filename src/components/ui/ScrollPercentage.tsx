import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { sections } from '@/data/sections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { INTRO_DELAY } from '@/lib/intro';
import { scrollToTarget } from '@/lib/scroll';

const SECTION_IDS = sections.map((s) => s.id);

/** Scroll progress mapped onto one night: 18:00 at the top of the page, 06:30 at the bottom. */
function skyClock(p: number) {
  const minutes = Math.round(18 * 60 + p * 12.5 * 60) % (24 * 60);
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

function skyPhase(p: number) {
  if (p < 0.2) return 'Sunset';
  if (p < 0.32) return 'Blue hour';
  if (p < 0.68) return 'Night';
  if (p < 0.8) return 'First light';
  return 'Sunrise';
}

const isDaylight = (p: number) => p < 0.26 || p > 0.74;

export default function ScrollPercentage() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });
  const fillHeight = useTransform(smooth, [0, 1], ['0%', '100%']);

  const [state, setState] = useState({ pct: 0, clock: skyClock(0), phase: skyPhase(0), day: true });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = { pct: Math.round(p * 100), clock: skyClock(p), phase: skyPhase(p), day: isDaylight(p) };
    setState((prev) =>
      prev.pct === next.pct && prev.clock === next.clock && prev.phase === next.phase && prev.day === next.day ? prev : next,
    );
  });

  const active = useActiveSection(SECTION_IDS);
  const markers = useSectionMarkers();

  return (
    <>
      {/* Desktop dial */}
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: INTRO_DELAY + 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="panel fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 rounded-full px-2 py-4 md:flex"
        aria-label="Page progress"
      >
        <span className="font-mono text-[11px] font-semibold tabular-nums text-accent" aria-live="off">
          {state.pct}%
        </span>

        <div className="relative h-[clamp(180px,34vh,300px)] w-[3px] rounded-full bg-white/10">
          <motion.div
            className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-accent to-accent-2"
            style={{ height: fillHeight }}
          />

          {/* Section markers */}
          {markers.map((m) => {
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => scrollToTarget(m.id === 'home' ? 0 : `#${m.id}`)}
                className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 cursor-pointer"
                style={{ top: `${m.pos * 100}%` }}
                aria-label={`Go to ${m.label}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive ? 'h-2 w-2 bg-white shadow-[0_0_10px_var(--accent)]' : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white'
                  }`}
                />
                <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/90 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {m.label}
                </span>
              </button>
            );
          })}

          {/* Celestial head */}
          <motion.div className="absolute left-1/2 z-10" style={{ top: fillHeight }}>
            <div className="flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-ink shadow-[0_0_18px_var(--accent)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={state.day ? 'sun' : 'moon'}
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {state.day ? <Sun size={13} strokeWidth={2.5} /> : <Moon size={12} strokeWidth={2.5} />}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tabular-nums text-white/80">{state.clock}</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 [writing-mode:vertical-rl] rotate-180">
            {state.phase}
          </span>
        </div>
      </motion.aside>

      {/* Mobile ring */}
      <MobileRing progress={smooth} pct={state.pct} day={state.day} />
    </>
  );
}

function MobileRing({ progress, pct, day }: { progress: ReturnType<typeof useSpring>; pct: number; day: boolean }) {
  return (
    <AnimatePresence>
      {pct > 3 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          onClick={() => scrollToTarget(0)}
          className="panel fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full md:hidden"
          aria-label={`${pct}% scrolled. Back to top`}
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <span className="flex flex-col items-center leading-none text-accent">
            {day ? <Sun size={14} /> : <Moon size={13} />}
            <span className="mt-0.5 font-mono text-[9px] font-semibold tabular-nums text-white/85">{pct}%</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Where each section starts, as a fraction of the scrollable height. Re-measured as lazy sections load. */
function useSectionMarkers() {
  type Marker = { id: string; label: string; pos: number };
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const next = sections.flatMap((s): Marker[] => {
        if (s.id === 'home') return [{ ...s, pos: 0 }];
        const el = document.getElementById(s.id);
        if (!el) return [];
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        return [{ ...s, pos: Math.min(1, Math.max(0, top / max)) }];
      });
      setMarkers(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return markers;
}

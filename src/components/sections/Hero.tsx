import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import MagneticButton from '@/components/ui/MagneticButton';
import { INTRO_DELAY } from '@/lib/intro';
import { scrollToTarget } from '@/lib/scroll';

const ROLES = ['AI Engineer', 'Full Stack Developer', 'Open Source Enthusiast'];
const EASE = [0.16, 1, 0.3, 1] as const;

function RisingWord({ word, delay, className = '', whole = false }: { word: string; delay: number; className?: string; whole?: boolean }) {
  // `whole` keeps the word in one span so gradient text (background-clip) still works
  const parts = whole ? [word] : word.split('');
  return (
    <span className="inline-flex overflow-hidden pb-[0.08em]" aria-hidden="true">
      {parts.map((part, i) => (
        <motion.span
          key={i}
          className={`inline-block ${className}`}
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ delay: delay + i * 0.035, duration: 0.9, ease: EASE }}
        >
          {part}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);

  // Content drifts up and dissolves as the sun goes down
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex((prev) => (prev + 1) % ROLES.length), 2800);
    return () => clearInterval(interval);
  }, []);

  const d = INTRO_DELAY;

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden px-6 sm:px-10">
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-6xl pt-28 pb-32">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d, duration: 0.6 }}
          className="panel mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium tracking-wide text-white/85 sm:text-sm">Available for Opportunities</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: d + 0.1, duration: 0.6 }}
          className="eyebrow mb-4 text-white/70"
        >
          Hello, I'm
        </motion.p>

        <h1 className="text-glow font-heading font-bold leading-[0.92] tracking-[-0.04em] text-white text-[clamp(3.2rem,min(10vw,13vh),8.5rem)]">
          <span className="sr-only">Parth Shandilya</span>
          <RisingWord word="Parth" delay={d + 0.15} />
          <br />
          <RisingWord
            word="Shandilya"
            delay={d + 0.3}
            whole
            className="font-serif font-normal italic tracking-[-0.02em] text-sky-gradient pr-[0.08em]"
          />
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d + 0.8, duration: 0.6 }}
          className="mt-4 flex h-10 items-center gap-4 sm:h-12"
        >
          <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent sm:w-16" />
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: EASE }}
              className="font-heading text-xl font-medium text-white/90 sm:text-3xl"
            >
              {ROLES[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d + 0.95, duration: 0.8, ease: EASE }}
          className="text-glow mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          Building intelligent, production-grade software with modern AI and full-stack technologies. Recent CS
          graduate from Bennett University specializing in AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d + 1.1, duration: 0.8, ease: EASE }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <button type="button" onClick={() => scrollToTarget('#projects')} className="btn-primary group cursor-pointer">
            View my work
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <MagneticButton href="https://github.com/Codeatlight" className="btn-ghost" ariaLabel="GitHub">
            <GithubIcon width={18} height={18} />
            <span className="hidden sm:inline">GitHub</span>
          </MagneticButton>
          <MagneticButton href="https://linkedin.com/in/parth-shandilya" className="btn-ghost" ariaLabel="LinkedIn">
            <LinkedinIcon width={18} height={18} />
            <span className="hidden sm:inline">LinkedIn</span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToTarget('#about')}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white cursor-pointer"
        aria-label="Scroll to About"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
          <span className="h-2 w-[3px] rounded-full bg-white/80 animate-[scroll-cue_1.8s_ease-in-out_infinite]" />
        </span>
        <span className="eyebrow !text-[10px] flex items-center gap-1">
          Scroll <ArrowDown size={10} />
        </span>
      </motion.button>
    </section>
  );
}

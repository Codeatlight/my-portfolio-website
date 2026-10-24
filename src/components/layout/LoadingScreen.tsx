import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { INTRO_DELAY, markIntroSeen, showIntro } from '@/lib/intro';
import { setScrollLocked } from '@/lib/scroll';

const EASE = [0.16, 1, 0.3, 1] as const;

/** A sun sinking through the horizon while the name rises — the page's sunset in miniature. */
export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(showIntro);

  useEffect(() => {
    if (!showIntro) return;
    setScrollLocked(true);
    const timer = setTimeout(() => setIsLoading(false), INTRO_DELAY * 1000 - 250);
    return () => {
      clearTimeout(timer);
      setScrollLocked(false);
    };
  }, []);

  useEffect(() => {
    if (isLoading || !showIntro) return;
    setScrollLocked(false);
    markIntroSeen();
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[linear-gradient(180deg,#21173f_0%,#9c3a6a_60%,#ff8a3d_100%)]"
          aria-hidden="true"
        >
          <div className="relative flex flex-col items-center">
            {/* Sun clipped by the horizon */}
            <div className="relative h-24 w-48 overflow-hidden">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: 64 }}
                transition={{ duration: 1.3, ease: [0.45, 0, 0.55, 1] }}
                className="absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,#fff7dc_0%,#ffd18a_35%,#ff7a3c_100%)] shadow-[0_0_60px_20px_rgba(255,140,70,0.5)]"
              />
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="h-px w-72 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            />

            <div className="mt-6 overflow-hidden">
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
                className="font-heading text-2xl font-semibold tracking-tight text-white"
              >
                Parth Shandilya
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="eyebrow mt-2 text-white/60"
            >
              Golden hour, loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

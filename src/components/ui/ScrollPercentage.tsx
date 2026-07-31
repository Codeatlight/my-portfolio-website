import { useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionTemplate } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

export default function ScrollPercentage() {
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  const percentage = useTransform(smoothProgress, [0, 1], [0, 100]);
  const height = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // 0-30% (dusk): amber (#F59E0B) to rose (#E8567F)
  // 30-70% (night): silver (#94A3B8) to blue (#6B8CFF)  
  // 70-100% (dawn): gold (#F4A460) to coral (#FF9A76)
  const color1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['#F59E0B', '#94A3B8', '#94A3B8', '#F4A460']
  );
  
  const color2 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['#E8567F', '#6B8CFF', '#6B8CFF', '#FF9A76']
  );

  const bgGradient = useMotionTemplate`linear-gradient(to top, ${color1}, ${color2})`;
  const glowShadow = useMotionTemplate`0 0 15px ${color1}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4 bg-white/[0.03] backdrop-blur-xl p-3 rounded-full border border-white/10"
      style={{ boxShadow: glowShadow }}
    >
      <div className="relative w-2 h-[200px] bg-white/[0.08] rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="absolute bottom-0 w-full rounded-full"
          style={{
            height,
            background: bgGradient,
          }}
        />
      </div>
      
      <PercentageValue percentage={percentage} color={color2} />
    </motion.div>
  );
}

function PercentageValue({ percentage, color }: { percentage: MotionValue<number>, color: MotionValue<string> }) {
  const [display, setDisplay] = useState(0);
  
  useMotionValueEvent(percentage, 'change', (latest: number) => {
    setDisplay(Math.round(latest));
  });

  return (
    <motion.span 
      className="text-[10px] font-mono font-bold tabular-nums"
      style={{ color }}
    >
      {display}%
    </motion.span>
  );
}

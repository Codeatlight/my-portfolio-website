import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import MouseGlow from '@/components/effects/MouseGlow';
import FloatingOrbs from '@/components/effects/FloatingOrbs';
import GridBackground from '@/components/effects/GridBackground';
import ParallaxStars from '@/components/ui/ParallaxStars';
import MagneticButton from '@/components/ui/MagneticButton';
import AnimatedText from '@/components/ui/AnimatedText';

const ROLES = ['AI Engineer', 'Full Stack Developer', 'Open Source Enthusiast'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#09090b] px-6 sm:px-12">
      <GridBackground />
      <ParallaxStars count={50} speed="slow" />
      <FloatingOrbs />
      <MouseGlow />

      <div className="z-10 w-full max-w-5xl flex flex-col items-start md:items-center md:text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-white/80 tracking-wide font-inter">
            Available for Opportunities
          </span>
        </motion.div>

        <div className="text-left md:text-center space-y-4 mb-6">
          <div className="text-lg md:text-xl text-white/60 font-jetbrains-mono font-medium">
            <AnimatedText text="Hello, I'm" delay={0.2} wordByWord />
          </div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-space-grotesk tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-[length:200%_auto] animate-shimmer">
              Parth Shandilya
            </span>
          </motion.h1>

          <div className="h-10 sm:h-12 flex items-center md:justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={roleIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-3xl text-white/80 font-inter font-medium flex items-center gap-2"
              >
                {ROLES[roleIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-2xl text-base sm:text-lg text-white/60 font-inter leading-relaxed mb-10 text-left md:text-center">
          <AnimatedText 
            text="Building intelligent, production-grade software with modern AI and full-stack technologies. Recent CS graduate from Bennett University specializing in AI."
            delay={0.6}
            wordByWord
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-wrap items-center justify-start md:justify-center gap-4"
        >
          <MagneticButton href="https://github.com/Codeatlight" className="flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] text-white/80 hover:text-white hover:bg-white/[0.08] transition-all font-medium">
            <GithubIcon width={18} height={18} />
            GitHub
          </MagneticButton>

          <MagneticButton href="https://linkedin.com/in/parth-shandilya" className="flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] text-white/80 hover:text-white hover:bg-white/[0.08] transition-all font-medium">
            <LinkedinIcon width={18} height={18} />
            LinkedIn
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40"
      >
        <span className="text-xs uppercase tracking-widest font-jetbrains-mono mb-2">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}

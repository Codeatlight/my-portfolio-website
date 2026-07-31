'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { timelineEntries } from '@/data/experience';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeader 
          title="Education & Journey" 
          subtitle="My academic and professional trajectory in tech." 
        />

        <div className="mt-16 relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.05] transform md:-translate-x-1/2">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-violet-500 to-cyan-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12 md:space-y-24">
            {timelineEntries.map((entry, index) => {
              const isEven = index % 2 === 0;
              return (
                <TimelineNode 
                  key={entry.id} 
                  entry={entry} 
                  isEven={isEven} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ entry, isEven }: { entry: any, isEven: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = entry.icon;

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Connector & Node */}
      <div className={`absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full z-10 flex items-center justify-center ${
        entry.isCurrent 
          ? 'bg-zinc-900 border-2 border-violet-500'
          : 'bg-emerald-500/80 border-2 border-emerald-400/60'
      }`}>
        {entry.isCurrent && isInView && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 2, 2.5], opacity: [1, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-violet-500"
          />
        )}
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}
      >
        <div className="p-8 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-white/[0.05] text-cyan-400">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white font-display">{entry.title}</h3>
              <p className="text-violet-400 font-medium">{entry.organization}</p>
            </div>
          </div>
          
          <div className="mb-4 inline-block px-3 py-1 rounded-full bg-white/[0.05] text-xs font-mono text-zinc-300 border border-white/[0.05]">
            {entry.period}
          </div>
          
          <p className="text-zinc-400 leading-relaxed mb-6">
            {entry.description}
          </p>
          
          {entry.highlights && (
            <div className="flex flex-wrap gap-2">
              {entry.highlights.map((highlight: string, i: number) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.02] text-zinc-300 border border-white/[0.05]"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

'use client'

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`flex flex-col items-center justify-center text-center ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '40px' } : { width: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mb-4"
      />
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-5xl font-bold font-space-grotesk text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/50 text-sm md:text-base max-w-2xl font-inter"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

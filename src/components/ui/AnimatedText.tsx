'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  wordByWord?: boolean;
}

export default function AnimatedText({ text, className = '', delay = 0, wordByWord = false }: AnimatedTextProps) {
  const items = wordByWord ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {items.map((item, index) => (
        <motion.span variants={child} key={index} className="inline-block">
          {item === ' ' ? '\u00A0' : item}
          {wordByWord && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.div>
  );
}

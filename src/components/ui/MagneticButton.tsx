import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { scrollToTarget } from '@/lib/scroll';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  ariaLabel?: string;
  strength?: number;
}

/** A link that leans toward the cursor. Uses motion values so hovering never re-renders. */
export default function MagneticButton({ children, className = '', href, ariaLabel, strength = 0.25 }: MagneticButtonProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 15, mass: 0.2 });
  const y = useSpring(my, { stiffness: 220, damping: 15, mass: 0.2 });

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const isExternal = href.startsWith('http');

  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={className}
      {...(isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {
            onClick: (e: React.MouseEvent) => {
              if (href.startsWith('#')) {
                e.preventDefault();
                scrollToTarget(href);
              }
            },
          })}
    >
      {children}
    </motion.a>
  );
}

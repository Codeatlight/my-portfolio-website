import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({ children, className = '', onClick: _onClick, href }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const middleX = clientX - (rect.left + rect.width / 2);
    const middleY = clientY - (rect.top + rect.height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const inner = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <a href={href} onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
          const el = document.querySelector(href);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }}>
        {inner}
      </a>
    );
  }

  return <>{inner}</>;
}

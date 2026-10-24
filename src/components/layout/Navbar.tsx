import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navSections, sections } from '@/data/sections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { INTRO_DELAY } from '@/lib/intro';
import { scrollToTarget, setScrollLocked } from '@/lib/scroll';

const SECTION_IDS = sections.map((s) => s.id);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  const go = (id: string) => {
    setIsMobileMenuOpen(false);
    // Let the menu release the scroll lock before scrolling
    requestAnimationFrame(() => scrollToTarget(`#${id}`));
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: INTRO_DELAY + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          aria-label="Main navigation"
          className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 transition-all duration-500 ${
            isScrolled ? 'panel' : 'border border-transparent'
          }`}
        >
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex items-center gap-2 cursor-pointer"
            aria-label="Back to top"
          >
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-2">
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-ink/80" />
              <span className="relative font-heading text-[11px] font-bold text-ink">PS</span>
            </span>
            <span className="hidden font-heading text-sm font-semibold tracking-tight text-white/90 sm:block">
              Parth Shandilya
            </span>
          </button>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navSections.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 cursor-pointer ${
                      isActive ? 'text-white' : 'text-white/60 hover:text-white'
                    }`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go('contact')} className="btn-primary !px-4 !py-2 text-[13px] cursor-pointer">
              Let's talk
              <ArrowUpRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:text-white lg:hidden cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-2xl lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <nav aria-label="Mobile navigation" className="flex h-full flex-col justify-center px-8">
              <ul className="space-y-1">
                {navSections.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          go(link.id);
                        }}
                        className="group flex w-full items-baseline gap-4 py-2 text-left cursor-pointer"
                      >
                        <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                        <span
                          className={`font-heading text-4xl font-semibold tracking-tight transition-colors ${
                            isActive ? 'text-sky-gradient' : 'text-white/80 group-hover:text-white'
                          }`}
                        >
                          {link.label}
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  /** Position in the page, shown as "01", "02"… */
  index: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function SectionHeader({ index, eyebrow, title, subtitle, className = '' }: SectionHeaderProps) {
  // The last word of the title gets the serif/gradient treatment
  const words = title.split(' ');
  const last = words.pop();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`flex flex-col items-center text-center ${className}`}
    >
      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: EASE }}
        className="eyebrow mb-5 flex items-center gap-3 text-white/60"
      >
        <span className="text-accent">{String(index).padStart(2, '0')}</span>
        <motion.span
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="h-px w-10 origin-left bg-gradient-to-r from-accent to-accent-2"
        />
        <span>{eyebrow}</span>
      </motion.div>

      <div className="overflow-hidden pb-2">
        <motion.h2
          variants={{ hidden: { y: '100%' }, show: { y: 0 } }}
          transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
          className="text-glow font-heading text-4xl font-bold tracking-[-0.03em] text-white md:text-6xl"
        >
          {words.length > 0 && <>{words.join(' ')} </>}
          <span className="font-serif font-normal italic tracking-[-0.01em] text-sky-gradient pr-1">{last}</span>
        </motion.h2>
      </div>

      {subtitle && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="text-glow mt-4 max-w-2xl text-sm text-white/65 md:text-base"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

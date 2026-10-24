import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { timelineEntries, type TimelineEntry } from '@/data/experience';
import SectionHeader from '@/components/ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);

  // The line draws itself as the timeline passes the middle of the screen
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 60%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index={4}
          eyebrow="Journey"
          title="Education & Journey"
          subtitle="My academic and professional trajectory in tech."
        />

        <div ref={timelineRef} className="relative mt-20">
          {/* Rail */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent-2 to-accent shadow-[0_0_12px_var(--accent)]"
              style={{ scaleY: progress }}
            />
          </div>

          <ol className="space-y-14 md:space-y-24">
            {timelineEntries.map((entry, index) => (
              <TimelineNode key={entry.id} entry={entry} contentLeft={index % 2 === 0} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ entry, contentLeft }: { entry: TimelineEntry; contentLeft: boolean }) {
  const Icon = entry.icon;

  return (
    <li className={`relative flex flex-col md:flex-row md:items-center ${contentLeft ? 'md:flex-row-reverse' : ''}`}>
      {/* Node */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="absolute left-5 top-8 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2"
      >
        {entry.isCurrent && <span className="absolute h-full w-full animate-ping rounded-full bg-accent/60" />}
        <span
          className={`relative h-4 w-4 rounded-full border-2 ${
            entry.isCurrent ? 'border-accent bg-ink shadow-[0_0_14px_var(--accent)]' : 'border-white/60 bg-accent-2'
          }`}
        />
      </motion.div>

      {/* Period, opposite the card on desktop */}
      <div className={`hidden md:flex md:w-1/2 ${contentLeft ? 'md:pl-14' : 'md:justify-end md:pr-14'}`}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="text-glow font-heading text-3xl font-semibold tracking-tight text-white/30 lg:text-4xl"
        >
          {entry.period}
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: contentLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`w-full pl-12 md:w-1/2 ${contentLeft ? 'md:pl-0 md:pr-14' : 'md:pl-14'}`}
      >
        <div className="panel panel-hover rounded-3xl p-7 sm:p-8">
          <div className="mb-4 flex items-start gap-4">
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-accent/20 to-accent-2/20 p-3 text-accent">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-semibold leading-snug text-white sm:text-xl">{entry.title}</h3>
              <p className="mt-0.5 font-medium text-accent">{entry.organization}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="chip font-mono md:hidden">{entry.period}</span>
            <span className="chip">
              <MapPin size={12} /> {entry.location}
            </span>
            {entry.isCurrent && <span className="chip !border-accent/30 !text-accent">Latest</span>}
          </div>

          <p className="mb-5 leading-relaxed text-white/70">{entry.description}</p>

          {entry.highlights.length > 0 && (
            <ul className="space-y-2">
              {entry.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-2" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </li>
  );
}

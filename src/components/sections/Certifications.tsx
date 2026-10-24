import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Award } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { certifications, certificationCategories } from '@/data/certifications';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Certifications() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all' ? certifications : certifications.filter((cert) => cert.category === activeFilter);
  const paper = filtered.find((c) => c.isResearchPaper);
  const rest = filtered.filter((c) => !c.isResearchPaper);

  return (
    <section id="certifications" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index={5}
          eyebrow="Credentials"
          title="Certifications & Publications"
          subtitle="Continuous learning across AI, systems, and software engineering."
        />

        <div className="mt-12 flex justify-center">
          <div role="tablist" aria-label="Filter certifications" className="panel flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
            {certificationCategories.map((cat) => {
              const isActive = activeFilter === cat.id;
              const count = cat.id === 'all' ? certifications.length : certifications.filter((c) => c.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-ink' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="cert-tab"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-2"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.6 }}
                    />
                  )}
                  <span className="relative whitespace-nowrap">{cat.label}</span>
                  <span className={`relative font-mono text-[10px] ${isActive ? 'text-ink/70' : 'text-white/40'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Research paper spotlight */}
        <AnimatePresence>
          {paper && (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="panel ring-glow mt-12 overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent-2/15" />
              <div className="relative flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${paper.gradient} shadow-[0_10px_30px_-10px_var(--accent-2)]`}>
                  <paper.icon className="h-8 w-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="eyebrow mb-2 flex items-center gap-2 text-accent">
                    <Award size={13} /> Research Paper
                  </div>
                  <h3 className="font-heading text-xl font-semibold leading-snug text-white sm:text-2xl">{paper.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{paper.issuer}</p>
                </div>
                {paper.verifyUrl && paper.verifyUrl !== '#' && (
                  <a href={paper.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 self-start text-sm sm:self-center">
                    Read paper <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.ul layout className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {rest.map((cert, index) => {
              const Icon = cert.icon;
              const hasLink = cert.verifyUrl && cert.verifyUrl !== '#';
              return (
                <motion.li
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.03, ease: EASE }}
                  className="panel panel-hover group rounded-2xl p-5 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cert.gradient}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold leading-snug text-white">{cert.title}</h3>
                      <p className="mt-1 text-xs text-white/55">{cert.issuer}</p>
                    </div>
                    {hasLink && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-accent hover:to-accent-2 hover:text-ink group-hover:text-white"
                        aria-label={`Verify ${cert.title}`}
                        title="Verify"
                      >
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

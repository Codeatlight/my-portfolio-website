import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { certifications, certificationCategories } from '@/data/certifications';

export default function Certifications() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? certifications
    : certifications.filter((cert) => cert.category === activeFilter);

  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeader
          title="Certifications & Publications"
          subtitle="Continuous learning across AI, systems, and software engineering."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {certificationCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Certification cards grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, index) => {
              const Icon = cert.icon;
              const isHighlight = cert.isResearchPaper;

              return (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`group relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-1 ${
                    isHighlight
                      ? 'bg-gradient-to-br from-amber-500/[0.06] to-rose-500/[0.06] border-amber-500/20 hover:border-amber-500/40 col-span-1 sm:col-span-2 lg:col-span-3'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`flex ${isHighlight ? 'flex-col sm:flex-row sm:items-center' : 'flex-col'} gap-4`}>
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center flex-shrink-0 ${
                      isHighlight ? 'w-14 h-14' : ''
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {isHighlight && (
                        <div className="flex items-center gap-2 mb-2">
                          <Award size={14} className="text-amber-400" />
                          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Research Paper</span>
                        </div>
                      )}
                      <h3 className={`font-semibold text-white leading-tight ${isHighlight ? 'text-lg' : 'text-sm'}`}>
                        {cert.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Verify link */}
                    {cert.verifyUrl && cert.verifyUrl !== '#' && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg border border-white/[0.06] transition-all flex-shrink-0"
                      >
                        <ExternalLink size={12} />
                        Verify
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { ArrowUpRight, Award, Code2, GraduationCap, FileText } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useCountUp } from '@/hooks/useCountUp';
import { certifications } from '@/data/certifications';
import { projects } from '@/data/projects';
import { timelineEntries } from '@/data/experience';
import { PAPER_THUMB } from '@/data/site';
import { navigateToProject, projectPath } from '@/lib/projectRoute';

const EASE = [0.16, 1, 0.3, 1] as const;

// Every figure below is derived from the data files, so the page can't contradict itself
const paper = certifications.find((c) => c.isResearchPaper);
const courseCerts = certifications.filter((c) => !c.isResearchPaper);
const shipped = projects.filter((p) => p.status === 'completed');
const building = projects.filter((p) => p.status === 'in-development');
const degree = timelineEntries.find((e) => e.isCurrent) ?? timelineEntries[timelineEntries.length - 1];
const cgpa = Number(degree?.highlights.map((h) => /CGPA:\s*([\d.]+)/.exec(h)?.[1]).find(Boolean) ?? 0);

/** Most frequent issuers first, e.g. "DeepLearning.AI, Coursera, Infosys Springboard" */
const topIssuers = (() => {
  const counts = new Map<string, number>();
  for (const c of courseCerts) {
    for (const issuer of c.issuer.split(',').map((s) => s.trim())) {
      counts.set(issuer, (counts.get(issuer) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name);
})();

function Tile({ index, className = '', children }: { index: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
      className={`panel panel-hover group relative flex flex-col overflow-hidden rounded-3xl p-7 sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Figure({ value, decimals = 0, className = '' }: { value: number; decimals?: number; className?: string }) {
  const scale = 10 ** decimals;
  const { ref, count } = useCountUp({ end: Math.round(value * scale), duration: 1600 });
  return (
    <div ref={ref} className={`font-heading font-bold tabular-nums tracking-tight text-white ${className}`}>
      {(count / scale).toFixed(decimals)}
    </div>
  );
}

function TileLabel({ icon: Icon, children }: { icon: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return (
    <div className="eyebrow mb-5 flex items-center gap-2 text-accent">
      <Icon size={14} />
      {children}
    </div>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index={6}
          eyebrow="Highlights"
          title="Milestones & Achievements"
          subtitle="Quantifying my journey and academic excellence."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {/* Research — the headline achievement */}
          {paper && (
            <Tile index={0} className="ring-glow md:col-span-2 lg:row-span-2">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-accent/25 to-accent-2/25 blur-3xl" />
              <div className="flex items-start gap-5">
                <div className="min-w-0 flex-1">
                  <TileLabel icon={FileText}>Published research</TileLabel>
                  <p className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <span className="text-sky-gradient">{paper.issuer}</span>
                  </p>
                </div>
                <img
                  src={PAPER_THUMB}
                  alt="Engraving of the human heart, 1686"
                  width={900}
                  height={1431}
                  loading="lazy"
                  className="relative h-36 w-28 shrink-0 rounded-xl object-cover object-top sm:h-44 sm:w-32"
                />
              </div>
              <h3 className="mt-4 font-serif text-2xl italic leading-snug text-white/90 sm:text-3xl">“{paper.title}”</h3>
              <div className="mt-auto pt-8">
                {paper.verifyUrl && paper.verifyUrl !== '#' && (
                  <a href={paper.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                    Read the paper <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </Tile>
          )}

          {/* Academics */}
          {cgpa > 0 && (
            <Tile index={1}>
              <TileLabel icon={GraduationCap}>CGPA</TileLabel>
              <Figure value={cgpa} decimals={2} className="text-5xl" />
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {degree.title}, {degree.organization}
              </p>
            </Tile>
          )}

          {/* Learning */}
          <Tile index={2}>
            <TileLabel icon={Award}>Certifications</TileLabel>
            <Figure value={courseCerts.length} className="text-5xl" />
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Across AI/ML, CS fundamentals and software engineering, from {topIssuers.join(', ')}.
            </p>
          </Tile>

          {/* Shipping */}
          <Tile index={3} className="md:col-span-2">
            <TileLabel icon={Code2}>Shipped projects</TileLabel>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              <Figure value={shipped.length} className="text-5xl" />
              {building.length > 0 && (
                <span className="pb-1.5 text-sm text-white/55">+ {building.length} in progress</span>
              )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shipped.map((p) => (
                <li key={p.id}>
                  <a
                    href={projectPath(p.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToProject(p.id);
                    }}
                    className="chip transition-colors hover:border-accent/40 hover:text-white">
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </Tile>
        </div>
      </div>
    </section>
  );
}

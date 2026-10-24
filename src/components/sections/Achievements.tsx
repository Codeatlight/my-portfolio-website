import { motion } from 'framer-motion';
import { Trophy, Code2, Award, GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useCountUp } from '@/hooks/useCountUp';

const achievements = [
  { id: 'projects', label: 'Projects Completed', target: 4, suffix: '+', icon: Code2 },
  { id: 'certifications', label: 'Certifications Earned', target: 17, suffix: '', icon: Award },
  { id: 'cgpa', label: 'CGPA', target: 865, suffix: '', icon: GraduationCap, isDecimal: true },
  { id: 'research', label: 'Research Paper Published', target: 1, suffix: '', icon: Trophy },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index={6}
          eyebrow="By the numbers"
          title="Milestones & Achievements"
          subtitle="Quantifying my journey and academic excellence."
        />

        <div className="panel mt-16 grid grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-4">
          {achievements.map((item, index) => (
            <AchievementCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface AchievementItem {
  id: string;
  label: string;
  target: number;
  suffix: string;
  icon: React.ComponentType<{ className?: string }>;
  isDecimal?: boolean;
}

function AchievementCard({ item, index }: { item: AchievementItem; index: number }) {
  const Icon = item.icon;
  const { ref, count } = useCountUp({ end: item.target, duration: 2000 });
  const displayNum = item.isDecimal ? (count / 100).toFixed(2) : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      className={`group relative overflow-hidden p-7 sm:p-9 transition-colors duration-500 hover:bg-white/[0.04]
        ${index % 2 === 0 ? 'border-r border-white/10' : ''} ${index < 2 ? 'border-b border-white/10 lg:border-b-0' : ''}
        ${index === 1 ? 'lg:border-r' : ''}`}
    >
      <Icon className="absolute -right-4 -top-4 h-28 w-28 rotate-12 text-accent opacity-[0.07] transition-all duration-700 group-hover:rotate-0 group-hover:opacity-[0.14]" />

      <div className="relative">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-accent/25 to-accent-2/25">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className="font-heading text-5xl font-bold tabular-nums tracking-tight text-white sm:text-6xl">
          {displayNum}
          <span className="text-sky-gradient">{item.suffix}</span>
        </div>
        <p className="mt-2 text-sm font-medium text-white/60">{item.label}</p>
      </div>

      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-accent to-accent-2 transition-all duration-700 ease-out group-hover:w-full" />
    </motion.div>
  );
}

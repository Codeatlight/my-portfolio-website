import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Code2, Award, GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useCountUp } from '@/hooks/useCountUp';

const achievements = [
  { id: 'projects', label: 'Projects Completed', target: 4, suffix: '+', icon: Code2 },
  { id: 'certifications', label: 'Certifications Earned', target: 17, suffix: '', icon: Award },
  { id: 'cgpa', label: 'CGPA', target: 865, suffix: '', icon: GraduationCap, isDecimal: true },
  { id: 'research', label: 'Research Paper Published', target: 1, suffix: '', icon: Trophy },
];

export default function Achievements() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section id="achievements" className="py-24 relative overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeader
          title="Milestones & Achievements"
          subtitle="Quantifying my journey and academic excellence."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, index) => (
            <AchievementCard
              key={item.id}
              item={item}
              index={index}
              isInView={isInView}
            />
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

function AchievementCard({ item, index, isInView }: { item: AchievementItem; index: number; isInView: boolean }) {
  const Icon = item.icon;
  const { ref, count } = useCountUp({
    end: isInView ? item.target : 0,
    duration: 2000,
  });

  const displayNum = item.isDecimal ? (count / 100).toFixed(2) : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="relative group overflow-hidden p-8 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
    >
      {/* Background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-violet-400 transform rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center border border-white/[0.1]">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 font-heading">
            {displayNum}{item.suffix}
          </span>
        </div>

        <p className="text-sm text-zinc-400 font-medium">
          {item.label}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 w-0 group-hover:w-full transition-all duration-500 ease-out" />
    </motion.div>
  );
}

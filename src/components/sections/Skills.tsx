import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { skillCategories, type Skill } from '@/data/skills';
import SectionHeader from '@/components/ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const Icon = skill.icon;
  const spotlight = useMotionTemplate`radial-gradient(140px circle at ${mouseX}px ${mouseY}px, ${skill.color}38, transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: EASE }}
      style={{ perspective: 800 }}
      className="group relative"
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="panel panel-hover relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl p-6 text-center"
      >
        <motion.div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />
        <div
          className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] transition-transform duration-500 group-hover:scale-110"
          style={{ color: skill.color || '#fff', boxShadow: `0 0 24px -8px ${skill.color}` }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <span className="relative font-mono text-sm font-medium text-white/85 transition-colors group-hover:text-white">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0]?.id || '');
  const selectedCategory = skillCategories.find((c) => c.id === activeCategory);

  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index={2}
          eyebrow="Toolkit"
          title="Technical Arsenal"
          subtitle="A comprehensive toolkit of languages, frameworks, and tools I use to build robust solutions."
        />

        <div className="mt-12 flex justify-center">
          <div role="tablist" aria-label="Skill categories" className="panel flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
            {skillCategories.map((category) => {
              const isActive = activeCategory === category.id;
              const CatIcon = category.icon;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-ink' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skills-tab"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-2"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.6 }}
                    />
                  )}
                  <CatIcon size={15} className="relative" />
                  <span className="relative whitespace-nowrap">{category.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-12 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              role="tabpanel"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
            >
              {selectedCategory?.skills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

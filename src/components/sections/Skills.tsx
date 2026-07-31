import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { skillCategories, type Skill } from '@/data/skills';
import SectionHeader from '@/components/ui/SectionHeader';

const ParticleBurst = ({ categoryId }: { categoryId: string }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`${categoryId}-${i}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 500,
            y: (Math.random() - 0.5) * 500,
            opacity: 0,
            scale: Math.random() * 2 + 0.5,
          }}
          transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
          className="absolute w-1.5 h-1.5 rounded-full bg-violet-400/50"
        />
      ))}
    </div>
  );
};

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [20, -20]);
  const rotateY = useTransform(x, [0, 1], [-20, 20]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = skill.icon;
  const trailBackground = useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, ${skill.color}40, transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05 }}
      style={{ perspective: 1000 }}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative h-full w-full p-6 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] transition-colors duration-300 group-hover:bg-white/[0.06] overflow-hidden group-hover:border-white/[0.1] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
      >
        <motion.div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: trailBackground }}
        />
        
        <div className="relative z-10 flex flex-col items-center gap-4 text-center pointer-events-none">
          <div 
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.05] transition-colors duration-300"
            style={{ color: skill.color || '#fff' }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="font-medium text-zinc-200 group-hover:text-white transition-colors font-mono text-sm">
            {skill.name}
          </span>
        </div>
      </motion.div>
      
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 transform group-hover:-translate-y-2">
        <div className="bg-zinc-800 text-zinc-300 text-xs py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl border border-white/10 font-medium">
          Proficient in {skill.name}
        </div>
        <div className="w-2 h-2 bg-zinc-800 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>
    </motion.div>
  );
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0]?.id || '');
  const selectedCategory = skillCategories.find(c => c.id === activeCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeader 
          title="Technical Arsenal" 
          subtitle="A comprehensive toolkit of languages, frameworks, and tools I use to build robust solutions." 
        />

        <div className="mt-12 flex flex-wrap justify-center gap-4 mb-12 relative z-20">
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'text-white' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              {category.title}
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/[0.06] rounded-full border border-white/[0.1]"
                  initial={false}
                  transition={{ type: 'spring' as const, bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative min-h-[400px]">
          <ParticleBurst categoryId={activeCategory} />
          <motion.div layout>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10"
              >
                {selectedCategory?.skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { BookOpen, Code, Terminal, Database, Cpu } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const interests = [
  { name: 'AI/ML', icon: Cpu },
  { name: 'Open Source', icon: Code },
  { name: 'System Design', icon: Database },
  { name: 'Full Stack', icon: Terminal },
  { name: 'Research', icon: BookOpen },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  // Magnetic effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.15);
    mouseY.set(y * 0.15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const tagline = "Passionate developer blurring the lines between design and engineering.";

  return (
    <section id="about" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeader title="About Me" />
        <div className="flex justify-center -mt-2 mb-16">
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-inter text-center mx-auto min-h-[1.5rem]">
            {tagline.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.05, delay: 0.5 + i * 0.02 }}
              >
                {char}
              </motion.span>
            ))}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <p className="text-lg text-zinc-400 leading-relaxed">
              I am a recent <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">B.Tech Computer Science</span> graduate from <span className="text-zinc-200">Bennett University</span> (Class of 2026), specializing in <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Artificial Intelligence</span>. I thrive on building scalable, user-centric applications and solving complex problems with intelligent algorithms.
            </p>
            
            <p className="text-lg text-zinc-400 leading-relaxed">
              My journey has led me to work on impactful projects spanning full-stack development, machine learning, and systems architecture. I'm also deeply engaged in academic research, having published a research paper, while actively contributing to innovative side projects and open-source communities.
            </p>

            <div className="pt-6">
              <h3 className="text-xl font-medium text-white mb-4 font-display">Interests & Focus</h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <motion.div 
                    key={interest.name}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(139,92,246,0.3)' }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer group"
                  >
                    <interest.icon className="w-4 h-4 text-violet-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{interest.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            style={{ x: magneticX, y: magneticY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative p-8 -m-8"
          >
            {/* Visual Element */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Orbit Animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute -inset-8 z-0 rounded-full border border-dashed border-violet-500/20"
              >
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)] -translate-x-1/2 translate-y-1/2" />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 rounded-2xl blur-3xl" />
              <div className="relative z-10 h-full w-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.1] rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Profile Photo */}
                <img 
                  src="/profile.jpg"
                  alt="Parth Shandilya"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Subtle gradient overlay at bottom for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

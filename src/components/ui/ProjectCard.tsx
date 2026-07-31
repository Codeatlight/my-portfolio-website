import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { ExternalLink, ArrowRight, Clock } from 'lucide-react';
import { GithubIcon } from '@/components/ui/SocialIcons';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const visibleTech = project.techStack.slice(0, 5);
  const remainingTech = project.techStack.length - 5;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [5, -5]);
  const rotateY = useTransform(x, [0, 1], [-5, 5]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ perspective: 1200 }}
      className="group"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onOpen(project)}
        className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/30 transition-all duration-300 cursor-pointer shadow-xl"
      >
        {/* Apple-like Mouse Shine Effect */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.1), transparent 40%)`
          }}
        />

        {/* Sweeping Shimmer */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-0 -left-[100%] h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] transition-all duration-1000 ease-out" />
        </div>

        {/* Gradient banner */}
        <div className={`h-44 w-full bg-gradient-to-br ${project.gradient} p-6 flex flex-col justify-end relative overflow-hidden`}>
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors duration-300 z-0" />
          
          {project.status === 'in-development' && (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20 z-10 backdrop-blur-sm shadow-sm">
              <Clock size={12} />
              In Development
            </span>
          )}
          <h3 className="text-xl font-bold font-heading text-white relative z-10">{project.title}</h3>
          <p className="text-sm text-white/60 relative z-10 mt-1">{project.subtitle}</p>
        </div>

        <div className="flex flex-col flex-grow p-6 gap-4 relative z-10 bg-zinc-950/50 backdrop-blur-sm">
          <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {visibleTech.map((tech: string) => (
              <span key={tech} className="px-2 py-1 text-xs font-medium text-zinc-300 bg-white/[0.04] rounded-md border border-white/[0.08]">
                {tech}
              </span>
            ))}
            {remainingTech > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-zinc-500 bg-white/[0.04] rounded-md border border-white/[0.08]">
                +{remainingTech} more
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 mt-2 border-t border-white/[0.06]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors relative z-20"
                onClick={(e) => e.stopPropagation()}
                aria-label="GitHub Repository"
              >
                <GithubIcon width={18} height={18} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors relative z-20"
                onClick={(e) => e.stopPropagation()}
                aria-label="Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(project); }}
              className="ml-auto flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group/btn cursor-pointer relative z-20"
            >
              Details
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

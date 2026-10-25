import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Clock } from 'lucide-react';
import { GithubIcon } from '@/components/ui/SocialIcons';
import { categoryLabels, type Project } from '@/data/projects';
import { projectPath } from '@/lib/projectRoute';

interface ProjectCardProps {
  project: Project;
  index: number;
  wide?: boolean;
  onOpen: (project: Project) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectCard({ project, index, wide = false, onOpen }: ProjectCardProps) {
  const maxTech = wide ? 7 : 4;
  const visibleTech = project.techStack.slice(0, maxTech);
  const remainingTech = project.techStack.length - maxTech;

  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const shine = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.09), transparent 45%)`;

  const handleMouseMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const initials = project.title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE }}
      onPointerMove={handleMouseMove}
      onClick={() => onOpen(project)}
      className="panel ring-glow group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1.5"
    >
      <motion.div className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: shine }} />

      {/* Visual */}
      <div className={`relative w-full overflow-hidden bg-gradient-to-br ${project.gradient} ${wide ? 'h-56 sm:h-72' : 'h-48'}`}>
        {project.image ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-[1.2s] ease-out group-hover:scale-[1.06] group-hover:opacity-95"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[7rem] italic leading-none text-white/10 transition-transform duration-700 group-hover:scale-110">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,10,24,0.95)] via-[rgba(12,10,24,0.25)] to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="chip !bg-black/55">{categoryLabels[project.category]}</span>
          {project.status === 'in-development' && (
            <span className="chip !border-accent/30 !bg-black/55 !text-accent">
              <Clock size={12} /> In Development
            </span>
          )}
        </div>

        <span className="absolute bottom-3 right-5 font-mono text-xs text-white/40">{String(index + 1).padStart(2, '0')}</span>
      </div>

      {/* Body */}
      <div className="relative z-10 -mt-10 flex flex-grow flex-col gap-4 p-6 sm:p-7">
        <div>
          <h3 className={`font-heading font-bold tracking-tight text-white ${wide ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
            <a
              href={projectPath(project.id)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen(project);
              }}
              className="relative z-40 hover:text-sky-gradient"
            >
              {project.title}
            </a>
          </h3>
          <p className="mt-1 text-sm text-accent/90">{project.subtitle}</p>
        </div>

        <p className={`text-sm leading-relaxed text-white/65 ${wide ? 'line-clamp-3 max-w-2xl' : 'line-clamp-3'}`}>
          {project.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5">
          {visibleTech.map((tech) => (
            <li key={tech} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/70">
              {tech}
            </li>
          ))}
          {remainingTech > 0 && (
            <li className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/45">
              +{remainingTech}
            </li>
          )}
        </ul>

        <div className="flex items-center gap-1 border-t border-white/10 pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-40 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${project.title} source on GitHub`}
            >
              <GithubIcon width={18} height={18} />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-40 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink size={18} />
            </a>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project);
            }}
            className="relative z-40 ml-auto flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white cursor-pointer"
            aria-label={`Open ${project.title} case study`}
          >
            Case study
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-2 group-hover:text-ink">
              <ArrowUpRight size={15} />
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

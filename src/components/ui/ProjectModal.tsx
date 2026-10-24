import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Check, Zap, Trophy, Rocket, Layers, Clock } from 'lucide-react';
import { GithubIcon } from '@/components/ui/SocialIcons';
import { categoryLabels, type Project } from '@/data/projects';
import { setScrollLocked } from '@/lib/scroll';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    setScrollLocked(true);
    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-ink/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0e0c1c] border border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
          >
            {/* Header / Banner */}
            <div 
              className={`relative w-full ${project.image ? 'h-48 sm:h-64 md:h-80' : 'h-32 sm:h-48'} flex-shrink-0 bg-cover bg-center`}
              style={project.image ? { backgroundImage: `url(${project.image})` } : {}}
            >
              {!project.image && (
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient || 'from-amber-500/30 to-rose-500/30'}`} />
              )}
              {/* Gradient overlay to blend with the modal body */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c1c] via-[#0e0c1c]/40 to-transparent" />
              <div className="absolute inset-0 bg-black/20" />
              <button
                ref={closeRef}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-full backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar" data-lenis-prevent>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-8 max-w-3xl mx-auto"
              >
                {/* Title Section */}
                <motion.div variants={fadeUp} className="flex flex-col gap-4 -mt-16 sm:-mt-20 relative z-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                      {categoryLabels[project.category]}
                    </span>
                    {project.status === 'in-development' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-accent bg-black/40 backdrop-blur-md rounded-full border border-accent/30 shadow-lg">
                        <Clock size={14} />
                        In Development
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight text-white drop-shadow-md">
                    {project.title}
                  </h2>
                  <p className="text-xl text-zinc-300 font-medium">
                    {project.subtitle}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost !py-2 !px-4 text-sm"
                      >
                        <GithubIcon width={16} height={16} />
                        View Source
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary !py-2 !px-4 text-sm"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Overview */}
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Layers size={20} className="text-accent" />
                    Overview
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                </motion.div>

                {/* Technologies */}
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-white">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1.5 text-sm font-medium text-zinc-300 bg-white/5 rounded-lg border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <motion.div variants={fadeUp} className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Check size={20} className="text-emerald-400" />
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-zinc-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 mt-1.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Challenges */}
                  {project.challenges && project.challenges.length > 0 && (
                    <motion.div variants={fadeUp} className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Zap size={20} className="text-amber-400" />
                        Challenges & Solutions
                      </h3>
                      <ul className="space-y-2">
                        {project.challenges.map((challenge, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-zinc-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 mt-1.5 flex-shrink-0" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Results */}
                  {project.results && project.results.length > 0 && (
                    <motion.div variants={fadeUp} className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-400" />
                        Outcomes
                      </h3>
                      <ul className="space-y-2">
                        {project.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-zinc-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 mt-1.5 flex-shrink-0" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Future Improvements */}
                  {project.futureImprovements && project.futureImprovements.length > 0 && (
                    <motion.div variants={fadeUp} className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Rocket size={20} className="text-cyan-400" />
                        Future Improvements
                      </h3>
                      <ul className="space-y-2">
                        {project.futureImprovements.map((improvement, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-zinc-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 mt-1.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

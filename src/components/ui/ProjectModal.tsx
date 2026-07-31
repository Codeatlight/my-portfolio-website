"use client";

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Check, Zap, Trophy, Rocket, Layers, Clock } from 'lucide-react';
import { GithubIcon } from '@/components/ui/SocialIcons';
import type { Project } from '@/data/projects';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header / Banner */}
            <div 
              className={`relative w-full ${project.image ? 'h-48 sm:h-64 md:h-80' : 'h-32 sm:h-48'} flex-shrink-0 bg-cover bg-center`}
              style={project.image ? { backgroundImage: `url(${project.image})` } : {}}
            >
              {!project.image && (
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient || 'from-violet-600/30 to-cyan-600/30'}`} />
              )}
              {/* Gradient overlay to blend with the modal body */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 bg-black/20" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-full backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
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
                      {project.category}
                    </span>
                    {project.status === 'in-development' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-cyan-300 bg-cyan-900/40 backdrop-blur-md rounded-full border border-cyan-400/30 shadow-lg">
                        <Clock size={14} />
                        In Development
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white drop-shadow-md">
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors text-sm font-medium"
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-violet-900/20"
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
                    <Layers size={20} className="text-violet-400" />
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

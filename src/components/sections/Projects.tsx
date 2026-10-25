import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { projects, categoryLabels } from '@/data/projects';
import type { Project } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ProjectModal from '@/components/ui/ProjectModal';
import { navigateToProject, projectIdFromPath, projectPath } from '@/lib/projectRoute';
import { scrollToTarget } from '@/lib/scroll';
import { SITE_TITLE } from '@/data/site';

const shipped = projects.filter((p) => p.status === 'completed');
const building = projects.filter((p) => p.status === 'in-development');

/*
 * Bento rhythm on a 6-column grid: wide/narrow, then narrow/wide.
 * Class strings are spelled out so Tailwind can see them.
 */
const LAYOUT = [
  { cls: 'md:col-span-2 lg:col-span-4', wide: true },
  { cls: 'lg:col-span-2', wide: false },
  { cls: 'lg:col-span-2', wide: false },
  { cls: 'md:col-span-2 lg:col-span-4', wide: true },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const findProject = (id: string | null) => projects.find((p) => p.id === id) ?? null;

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // True when the page was opened straight on a /projects/<id>/ link
  const openedFromLink = useRef(false);

  const show = useCallback((project: Project | null) => {
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
      document.title = `${project.title} — Parth Shandilya`;
    } else {
      setIsModalOpen(false);
      document.title = SITE_TITLE;
      setTimeout(() => setSelectedProject(null), 300);
    }
  }, []);

  // The URL is the source of truth: deep links, back/forward and in-page links all land here
  useEffect(() => {
    const initial = findProject(projectIdFromPath());
    if (initial) {
      openedFromLink.current = true;
      show(initial);
    }
    const onPop = () => show(findProject(projectIdFromPath()));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [show]);

  const handleOpen = (project: Project) => navigateToProject(project.id);

  const handleClose = useCallback(() => {
    if (openedFromLink.current) {
      // Nothing to go "back" to: swap the URL for the home page and land on the projects grid
      openedFromLink.current = false;
      window.history.replaceState(null, '', '/');
      show(null);
      requestAnimationFrame(() => scrollToTarget('#projects'));
    } else {
      window.history.back();
    }
  }, [show]);

  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index={3}
          eyebrow="Selected work"
          title="Featured Projects"
          subtitle="Click any project for the full case study: architecture, challenges and outcomes."
        />

        <div className="mt-16 grid grid-flow-dense grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {shipped.map((project, index) => {
            const slot = LAYOUT[index % LAYOUT.length];
            return (
              <div key={project.id} className={slot.cls}>
                <ProjectCard project={project} index={index} wide={slot.wide} onOpen={handleOpen} />
              </div>
            );
          })}
        </div>

        {building.length > 0 && (
          <div className="mt-16">
            <div className="eyebrow mb-6 flex items-center gap-3 text-white/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Currently building
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {building.map((project, i) => (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                >
                  <a
                    href={projectPath(project.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpen(project);
                    }}
                    className="panel panel-hover group flex h-full items-start gap-4 rounded-2xl p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent">
                      <Clock size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-base font-semibold text-white">{project.title}</span>
                        <span className="chip !py-0.5 !text-[10px]">{categoryLabels[project.category]}</span>
                      </span>
                      <span className="mt-1 block text-sm text-white/60">{project.subtitle}</span>
                      <span className="mt-3 block font-mono text-[11px] text-white/45">
                        {project.techStack.slice(0, 4).join(' · ')}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-white/40 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent"
                    />
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleClose} />
    </section>
  );
}

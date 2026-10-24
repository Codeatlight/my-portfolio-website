import { useCallback, useState } from 'react';
import { projects } from '@/data/projects';
import type { Project } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ProjectModal from '@/components/ui/ProjectModal';

/*
 * Bento rhythm on a 6-column grid: wide/narrow, narrow/wide, half/half.
 * Class strings are spelled out so Tailwind can see them.
 */
const LAYOUT = [
  { cls: 'md:col-span-2 lg:col-span-4', wide: true },
  { cls: 'lg:col-span-2', wide: false },
  { cls: 'lg:col-span-2', wide: false },
  { cls: 'md:col-span-2 lg:col-span-4', wide: true },
  { cls: 'lg:col-span-3', wide: false },
  { cls: 'lg:col-span-3', wide: false },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

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
          {projects.map((project, index) => {
            const slot = LAYOUT[index % LAYOUT.length];
            return (
              <div key={project.id} className={slot.cls}>
                <ProjectCard project={project} index={index} wide={slot.wide} onOpen={handleOpenModal} />
              </div>
            );
          })}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
}

/** Page sections in scroll order. Shared by the navbar and the sky dial. */
export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Journey' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Milestones' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const navSections = sections.filter((s) => s.id !== 'home');

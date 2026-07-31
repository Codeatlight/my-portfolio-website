import { GraduationCap, School } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
  type: 'education' | 'work';
  gradient: string;
  isCurrent?: boolean;
}

export const timelineEntries: TimelineEntry[] = [
  {
    id: 'stxaviers',
    title: 'Senior Secondary (XII), Computer Science',
    organization: "St Xavier's School",
    location: 'Shahbad Daultapur, New Delhi',
    period: '2008 – May 2021',
    description: 'Strong academic foundation with a focus on Computer Science and Mathematics.',
    highlights: [
      'Scored 91% in XII Board Examinations',
      'Computer Science stream',
      'Strong foundation in programming and algorithms',
    ],
    icon: School,
    type: 'education',
    gradient: 'from-cyan-500 to-emerald-500',
    isCurrent: false,
  },
  {
    id: 'bennett',
    title: 'B.Tech in CSE, AI Specialization',
    organization: 'Bennett University',
    location: 'Greater Noida, Uttar Pradesh',
    period: 'Sept 2022 – 2026',
    description: 'Recent graduate with a strong foundation in Computer Science and AI. Built multiple production-grade AI projects and published research.',
    highlights: [
      'CGPA: 8.65',
      'AI Specialization track',
      'Published research paper at ICCCNT 2025',
      'Built several production-grade AI & Full Stack projects',
      'Proficient in Python, Java, ML/AI, and Full Stack Development',
    ],
    icon: GraduationCap,
    type: 'education',
    gradient: 'from-violet-500 to-cyan-500',
    isCurrent: true,
  },
];

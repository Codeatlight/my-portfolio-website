import { 
  Brain, Code2, Database, Cloud, Server, 
  FileCode2, Cpu, Globe, GitBranch, Terminal, Box,
  Layers, Palette, BarChart3, Search, Shield, Workflow,
  type LucideIcon
} from 'lucide-react';

export interface Skill {
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    icon: Code2,
    color: '#8b5cf6',
    skills: [
      { name: 'Python', icon: FileCode2, color: '#3776ab' },
      { name: 'Java (OOP)', icon: FileCode2, color: '#f89820' },
      { name: 'C++', icon: FileCode2, color: '#00599c' },
      { name: 'JavaScript', icon: FileCode2, color: '#f7df1e' },
      { name: 'TypeScript', icon: FileCode2, color: '#3178c6' },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & ML',
    icon: Brain,
    color: '#06b6d4',
    skills: [
      { name: 'PyTorch', icon: Cpu, color: '#ee4c2c' },
      { name: 'TensorFlow', icon: Cpu, color: '#ff6f00' },
      { name: 'Hugging Face', icon: Brain, color: '#ffd21e' },
      { name: 'LLMs', icon: Brain, color: '#8b5cf6' },
      { name: 'NLP', icon: Search, color: '#06b6d4' },
      { name: 'KNN', icon: BarChart3, color: '#10b981' },
      { name: 'OCR', icon: Search, color: '#a855f7' },
      { name: 'Model Benchmarking', icon: BarChart3, color: '#f59e0b' },
    ],
  },
  {
    id: 'libraries',
    title: 'Libraries',
    icon: Layers,
    color: '#a855f7',
    skills: [
      { name: 'pandas', icon: BarChart3, color: '#150458' },
      { name: 'NumPy', icon: BarChart3, color: '#013243' },
      { name: 'Matplotlib', icon: Palette, color: '#11557c' },
      { name: 'Scikit-learn', icon: Brain, color: '#f7931e' },
      { name: 'BeautifulSoup', icon: Globe, color: '#43b02a' },
      { name: 'PIL', icon: Palette, color: '#3776ab' },
      { name: 'pdfminer', icon: FileCode2, color: '#d63384' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: Server,
    color: '#10b981',
    skills: [
      { name: 'Flask', icon: Server, color: '#000000' },
      { name: 'REST APIs', icon: Globe, color: '#10b981' },
      { name: 'JDBC', icon: Database, color: '#f89820' },
      { name: 'SQLite', icon: Database, color: '#003b57' },
      { name: 'Streamlit', icon: Globe, color: '#ff4b4b' },
    ],
  },
  {
    id: 'tools-db',
    title: 'Tools & DB',
    icon: Database,
    color: '#3b82f6',
    skills: [
      { name: 'MySQL', icon: Database, color: '#4479a1' },
      { name: 'Git', icon: GitBranch, color: '#f05032' },
      { name: 'JIRA', icon: Workflow, color: '#0052cc' },
      { name: 'UML', icon: Workflow, color: '#8b5cf6' },
    ],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    icon: Cloud,
    color: '#f59e0b',
    skills: [
      { name: 'Azure VM', icon: Cloud, color: '#0078d4' },
      { name: 'Docker', icon: Box, color: '#2496ed' },
      { name: 'Heroku', icon: Cloud, color: '#430098' },
      { name: 'Render', icon: Cloud, color: '#46e3b7' },
      { name: 'Linux', icon: Terminal, color: '#fcc624' },
      { name: 'CI/CD', icon: Shield, color: '#10b981' },
    ],
  },
];

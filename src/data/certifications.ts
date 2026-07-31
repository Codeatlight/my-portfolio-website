import { Award, BookOpen, Shield, Code2, Brain, Network, Palette, BarChart3, Cpu, type LucideIcon } from 'lucide-react';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: 'ai-ml' | 'cs-fundamentals' | 'software-engineering';
  verifyUrl: string;
  icon: LucideIcon;
  gradient: string;
  isResearchPaper?: boolean;
}

export const certifications: Certification[] = [
  // Highlight certifications from resume
  {
    id: 'research-paper',
    title: 'Comparative Analysis of Deep Neural Networks for Cardiovascular Risk Prediction',
    issuer: 'ICCCNT 2025',
    category: 'ai-ml',
    verifyUrl: 'https://drive.google.com/file/d/1UNGJSWnPYDCrSBSKzoVdDAu-LFW5WQl1/view?usp=sharing',
    icon: Award,
    gradient: 'from-amber-500 to-rose-500',
    isResearchPaper: true,
  },
  {
    id: 'gen-ai-llm',
    title: 'Generative AI with Large Language Models',
    issuer: 'DeepLearning.AI, AWS',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/O4MOAPRL80XP',
    icon: Brain,
    gradient: 'from-violet-500 to-cyan-500',
  },
  {
    id: 'os-security',
    title: 'Intro to OS & Security',
    issuer: 'Microsoft',
    category: 'cs-fundamentals',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/J5EAC878CV68',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'algo-toolbox',
    title: 'Algorithmic Toolbox',
    issuer: 'UC San Diego',
    category: 'cs-fundamentals',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/8XXA2ZUKNB6T',
    icon: Code2,
    gradient: 'from-emerald-500 to-teal-500',
  },
  // Coursera certifications
  {
    id: 'unsupervised-ml',
    title: 'Unsupervised Machine Learning',
    issuer: 'Coursera',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/ACDQN7TNGXZW',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'probability',
    title: 'An Intuitive Introduction to Probability',
    issuer: 'Coursera',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/M5MPC92422LR',
    icon: BarChart3,
    gradient: 'from-blue-500 to-violet-500',
  },
  {
    id: 'eda-ml',
    title: 'Exploratory Data Analysis for Machine Learning',
    issuer: 'Coursera',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/C9AJNX7F97CK',
    icon: BarChart3,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'supervised-ml',
    title: 'Supervised Machine Learning: Classification',
    issuer: 'Coursera',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/SZ3A8EWKN476',
    icon: Cpu,
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    id: 'networking',
    title: 'The Bits and Bytes of Computer Networking',
    issuer: 'Coursera',
    category: 'cs-fundamentals',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/LS77EPDHB5CJ',
    icon: Network,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 'deep-nn',
    title: 'Improving Deep Neural Networks',
    issuer: 'Coursera',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/BM9QXGEBL7MW',
    icon: Brain,
    gradient: 'from-rose-500 to-violet-500',
  },
  {
    id: 'network-comm',
    title: 'Fundamentals of Network Communication',
    issuer: 'Coursera',
    category: 'cs-fundamentals',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/776G4LFZBY78',
    icon: Network,
    gradient: 'from-teal-500 to-green-500',
  },
  {
    id: 'ux-design',
    title: 'Introduction to User Experience Design',
    issuer: 'Coursera',
    category: 'software-engineering',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/CHY4DXC8DS6C',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'nlp',
    title: 'NLP with Classification and Vector Spaces',
    issuer: 'Coursera',
    category: 'ai-ml',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/FCPBIZIBNTHI',
    icon: BookOpen,
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'simulation',
    title: 'Simulation and Modeling of Natural Processes',
    issuer: 'Coursera',
    category: 'cs-fundamentals',
    verifyUrl: 'http://coursera.org/account/accomplishments/verify/USMTFXALCQH3',
    icon: Cpu,
    gradient: 'from-lime-500 to-emerald-500',
  },
  // Infosys Springboard
  {
    id: 'agile-scrum',
    title: 'Agile Scrum Training',
    issuer: 'Infosys Springboard',
    category: 'software-engineering',
    verifyUrl: 'https://drive.google.com/file/d/1tsKGwoEeRBumqgVUXWxmLCcO9KcJ7XUD/view?usp=sharing',
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'software-eng',
    title: 'Software Engineering',
    issuer: 'Infosys Springboard',
    category: 'software-engineering',
    verifyUrl: 'https://drive.google.com/file/d/1z5gomGkxT4I22Sccv3_wUTIlfCUOngHy/view?usp=sharing',
    icon: Code2,
    gradient: 'from-slate-500 to-zinc-500',
  },
  {
    id: 'project-mgmt',
    title: 'Software Project Management Training',
    issuer: 'Infosys Springboard',
    category: 'software-engineering',
    verifyUrl: 'https://drive.google.com/file/d/1muS8ehTdJR_ELyGA8a4_6cgjVoeXs-nw/view?usp=sharing',
    icon: BookOpen,
    gradient: 'from-zinc-500 to-gray-500',
  },
];

export const certificationCategories = [
  { id: 'all', label: 'All' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'cs-fundamentals', label: 'CS Fundamentals' },
  { id: 'software-engineering', label: 'Software Engineering' },
];

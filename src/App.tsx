import { lazy, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import ScrollPercentage from '@/components/ui/ScrollPercentage';
import Hero from '@/components/sections/Hero';
import SkyBackground from '@/components/effects/SkyBackground';

// Lazy load sections for performance
const About = lazy(() => import('@/components/sections/About'));
const Skills = lazy(() => import('@/components/sections/Skills'));
const Projects = lazy(() => import('@/components/sections/Projects'));
const Experience = lazy(() => import('@/components/sections/Experience'));
const Certifications = lazy(() => import('@/components/sections/Certifications'));
const Achievements = lazy(() => import('@/components/sections/Achievements'));
const Contact = lazy(() => import('@/components/sections/Contact'));

function SectionFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <LoadingScreen />
      <SkyBackground />
      <Navbar />
      <ScrollPercentage />
      
      <main>
        <Hero />
        
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <Certifications />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <Achievements />
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>
      
      <Footer />
    </>
  );
}

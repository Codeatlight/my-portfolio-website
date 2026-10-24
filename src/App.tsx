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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LoadingScreen />
      <SkyBackground />
      <Navbar />
      <ScrollPercentage />

      <main id="main" className="relative z-10 overflow-x-clip">
        <Hero />

        {/* One boundary keeps section order stable while chunks stream in */}
        <Suspense fallback={<SectionFallback />}>
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Certifications />
          <Achievements />
          <Contact />
        </Suspense>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}

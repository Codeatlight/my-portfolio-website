import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BookOpen, Code, Terminal, Database, Cpu, MapPin } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const interests = [
  { name: 'AI/ML', icon: Cpu },
  { name: 'Open Source', icon: Code },
  { name: 'System Design', icon: Database },
  { name: 'Full Stack', icon: Terminal },
  { name: 'Research', icon: BookOpen },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const tagline = 'Passionate developer blurring the lines between design and engineering.';

export default function About() {
  // Gentle 3D tilt on the portrait
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader index={1} eyebrow="Who I am" title="About Me" />

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.018, delayChildren: 0.4 }}
          className="mx-auto mt-4 min-h-[1.5rem] max-w-2xl text-center text-sm text-white/70 md:text-base"
          aria-label={tagline}
        >
          {tagline.split('').map((char, i) => (
            <motion.span key={i} aria-hidden="true" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
              {char}
            </motion.span>
          ))}
        </motion.p>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
            className="order-1 lg:order-2 lg:col-span-5"
            style={{ perspective: 1000 }}
          >
            <motion.div
              onPointerMove={handleMove}
              onPointerLeave={handleLeave}
              style={{ rotateX, rotateY }}
              className="relative mx-auto aspect-[4/5] max-w-sm"
            >
              {/* Sun-coloured aura */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-accent/40 via-transparent to-accent-2/40 blur-3xl" />

              {/* Orbit ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                className="absolute -inset-5 rounded-[2.5rem] border border-dashed border-white/15"
              >
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]" />
              </motion.div>

              <div className="panel group relative h-full w-full overflow-hidden rounded-[2rem] p-2">
                <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                  <img
                    src="/profile.jpg"
                    alt="Parth Shandilya"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                    <span className="chip !bg-black/55">
                      <MapPin size={12} className="text-accent" /> New Delhi, India
                    </span>
                    <span className="chip !bg-black/55">B.Tech '26</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="panel order-2 rounded-3xl p-7 sm:p-10 lg:order-1 lg:col-span-7"
          >
            <p className="text-lg leading-relaxed text-white/75">
              I am a recent <span className="font-semibold text-sky-gradient">B.Tech Computer Science</span> graduate
              from <span className="text-white">Bennett University</span> (Class of 2026), specializing in{' '}
              <span className="font-semibold text-sky-gradient">Artificial Intelligence</span>. I thrive on building
              scalable, user-centric applications and solving complex problems with intelligent algorithms.
            </p>

            <p className="mt-5 text-lg leading-relaxed text-white/75">
              My journey has led me to work on impactful projects spanning full-stack development, machine learning,
              and systems architecture. I'm also deeply engaged in academic research, having published a research
              paper, while actively contributing to innovative side projects and open-source communities.
            </p>

            <div className="mt-8 border-t border-white/10 pt-7">
              <h3 className="eyebrow mb-4 text-white/55">Interests & Focus</h3>
              <ul className="flex flex-wrap gap-2.5">
                {interests.map((interest, i) => (
                  <motion.li
                    key={interest.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: EASE }}
                    whileHover={{ y: -3 }}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition-colors hover:border-accent/40 hover:bg-white/[0.08]"
                  >
                    <interest.icon className="h-4 w-4 text-accent transition-colors group-hover:text-accent-2" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">{interest.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

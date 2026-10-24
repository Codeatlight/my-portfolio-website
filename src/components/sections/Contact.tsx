import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import SectionHeader from '@/components/ui/SectionHeader';
import MagneticButton from '@/components/ui/MagneticButton';

const EMAIL = 'parthshandilya1947@gmail.com';
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader index={7} eyebrow="Contact" title="Get In Touch" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="panel mt-14 overflow-hidden rounded-[2rem] p-8 text-center sm:p-14"
        >
          <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-accent/30 to-accent-2/30 blur-3xl" />

          <h3 className="relative font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Let's build something <span className="font-serif font-normal italic text-sky-gradient pr-1">amazing</span> together.
          </h3>

          <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            I'm currently looking for new opportunities. Whether you have a question, a project proposal, or just want to
            say hi, I'll try my best to get back to you!
          </p>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href={`mailto:${EMAIL}`} className="btn-primary text-base" strength={0.2}>
              <Mail size={18} /> Say hello <ArrowUpRight size={16} />
            </MagneticButton>
            <button type="button" onClick={copyEmail} className="btn-ghost text-sm cursor-pointer" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'done' : 'copy'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : EMAIL}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <div className="relative mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <span className="flex items-center gap-2 text-sm text-white/60">
              <MapPin size={16} className="text-accent" /> New Delhi, India
            </span>
            <div className="flex gap-3">
              <MagneticButton
                href="https://github.com/Codeatlight"
                ariaLabel="GitHub"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:border-accent/50 hover:text-white"
              >
                <GithubIcon width={20} height={20} />
              </MagneticButton>
              <MagneticButton
                href="https://linkedin.com/in/parth-shandilya"
                ariaLabel="LinkedIn"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:border-accent/50 hover:text-white"
              >
                <LinkedinIcon width={20} height={20} />
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

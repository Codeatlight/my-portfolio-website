import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/Codeatlight', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/parth-shandilya', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:parthshandilya1947@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]" role="contentinfo">
      {/* Gradient divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-2"
          >
            <span className="font-heading text-xl font-bold gradient-text">
              Parth Shandilya
            </span>
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </motion.div>

          {/* Built with */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-1.5 text-sm text-zinc-500"
          >
            Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart size={14} className="text-rose-500 fill-rose-500" />
            </motion.span>{' '}
            using React, TypeScript & Framer Motion
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass glass-hover text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                aria-label={social.label}
              >
                <social.icon width={18} height={18} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

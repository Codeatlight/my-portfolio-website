import { Mail, Heart, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { scrollToTarget } from '@/lib/scroll';
import { LINKEDIN_URL } from '@/data/site';

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/Codeatlight', label: 'GitHub' },
  { icon: LinkedinIcon, href: LINKEDIN_URL, label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:parthshandilya1947@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 pb-10" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6">
        <div className="panel flex flex-col items-center justify-between gap-6 rounded-3xl px-6 py-6 sm:flex-row sm:px-8">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-heading text-lg font-bold text-white">
              Parth <span className="font-serif font-normal italic text-sky-gradient">Shandilya</span>
            </span>
            <p className="text-xs text-white/50">© {new Date().getFullYear()} All rights reserved.</p>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-white/50">
            Built with <Heart size={12} className="fill-accent-2 text-accent-2" /> using React, TypeScript & Framer Motion
          </p>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-white"
                aria-label={social.label}
              >
                <social.icon width={17} height={17} />
              </a>
            ))}
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-ink transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

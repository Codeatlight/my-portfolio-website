import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full transform -translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
        <SectionHeader title="Get In Touch" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex flex-col items-center"
        >
          <h3 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-6">
            Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">amazing</span> together.
          </h3>
          
          <p className="text-lg text-zinc-400 mb-12 leading-relaxed max-w-2xl">
            I'm currently looking for new opportunities. Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-12 w-full justify-center">
            <a href="mailto:parthshandilya1947@gmail.com" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/50 backdrop-blur-xl">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-amber-500/50 transition-colors">
                <Mail size={24} className="text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-zinc-500 font-medium">Email</p>
                <p className="font-medium">parthshandilya1947@gmail.com</p>
              </div>
            </a>
            
            <div className="flex items-center gap-4 text-zinc-300 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <MapPin size={24} className="text-rose-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-zinc-500 font-medium">Location</p>
                <p className="font-medium">New Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-8 border-t border-white/10 w-full justify-center">
            <motion.a 
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 10 }}
              href="https://github.com/Codeatlight" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-colors"
            >
              <GithubIcon width={24} height={24} />
              <span className="sr-only">GitHub</span>
            </motion.a>
            <motion.a 
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 10 }}
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-blue-400 transition-colors"
            >
              <LinkedinIcon width={24} height={24} />
              <span className="sr-only">LinkedIn</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

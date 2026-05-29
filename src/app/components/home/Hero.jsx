import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { MediaRenderer } from '../ui/MediaRenderer';

export function Hero({ data }) {
  if (data && data.is_visible === 0) return null;

  const title = data?.title || "Jewelry That Tells Your Story";
  const subtitle = data?.subtitle || "Jewelry That Tells Your Story";
  const media = data?.media_url || '';
  const link = data?.link_url || "/category/new-arrivals";

  return (
    <section className="relative h-[70vh] md:h-screen min-h-[560px] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 1.04 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <MediaRenderer 
            src={media} 
            alt="AMEYA New York" 
            className="w-full h-full object-cover" 
            style={{ objectPosition: data?.focal_point || 'right 60% top 0%' }}
          />
        </motion.div>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center px-4 text-white">
        <div className="flex-1" />

        {/* Bottom Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xs md:text-sm lg:text-base font-light text-white mb-10 tracking-[0.3em] leading-relaxed uppercase"
          >
            {title}
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.9 }} 
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to={link} className="inline-flex items-center gap-3 bg-white text-[var(--foreground)] px-8 py-3.5 uppercase tracking-widest text-xs font-medium hover:bg-[var(--secondary)] hover:text-white transition-all duration-300 group">
              Explore Collection
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-3 border border-white/60 text-white px-8 py-3.5 uppercase tracking-widest text-xs font-medium hover:border-white hover:bg-white/10 transition-all duration-300">
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

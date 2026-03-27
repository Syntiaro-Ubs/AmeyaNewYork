import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import apexSparkImg from '../../../assets/collection/Apex Spark/All Photos/AMP110011_D.JPG';
import eleveImg from '../../../assets/collection/ELEVE/2/RGM.JPG';
export function BrandStory() {
  return <section className="py-24 md:py-32 bg-[var(--background)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-4">
            The Pinnacle of Design
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">
            Our Signature Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Apex Spark Card */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="group relative p-8 md:p-12 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
            {/* Inner Border Frame */}
            <div className="absolute inset-2 md:inset-4 border border-[var(--primary)]/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div className="w-full aspect-[4/5] overflow-hidden mb-8 relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img src={apexSparkImg} alt="Apex Spark Collection" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
              </div>
              
              <h3 className="text-3xl font-serif text-[var(--foreground)] mb-4 group-hover:text-[var(--primary)] transition-colors">
                Apex Spark
              </h3>
              <p className="text-[var(--muted-foreground)] mb-8 font-light leading-relaxed max-w-sm">
                Where avant-garde artistry meets unparalleled brilliance. A celebration of bold creativity and the spark that ignites it.
              </p>
              
              <Link to="/collection/apex-spark" className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors border-b border-[var(--foreground)]/30 hover:border-[var(--primary)] pb-1">
                Discover Apex
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Eleve Card */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="group relative p-8 md:p-12 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
            {/* Inner Border Frame */}
            <div className="absolute inset-2 md:inset-4 border border-[var(--primary)]/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div className="w-full aspect-[4/5] overflow-hidden mb-8 relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img src={eleveImg} alt="Eleve Collection" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
              </div>
              
              <h3 className="text-3xl font-serif text-[var(--foreground)] mb-4 group-hover:text-[var(--primary)] transition-colors">
                Eleve
              </h3>
              <p className="text-[var(--muted-foreground)] mb-8 font-light leading-relaxed max-w-sm">
                Elevated essentials for the modern sophisticate. Architectural lines and timeless gold create a new standard of luxury.
              </p>
              
              <Link to="/collection/eleve" className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors border-b border-[var(--foreground)]/30 hover:border-[var(--primary)] pb-1">
                Explore Eleve
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
}

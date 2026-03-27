import { Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { instagramFeed } from '../../data';
export function InstagramFeed() {
  return <section className="py-24 bg-[var(--background)]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }} className="flex flex-col items-center justify-center mb-12">
          <Instagram size={24} className="text-[var(--primary)] mb-4" />
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-2">
            @AmeyaNewYork
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm tracking-widest uppercase">
            Follow us for daily inspiration
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramFeed.map((post, index) => <motion.a key={post.id} href="#" target="_blank" rel="noreferrer" initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} className="relative group aspect-square overflow-hidden block">
              <img src={post.image} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="text-white w-8 h-8" />
              </div>
            </motion.a>)}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" target="_blank" rel="noreferrer" className="inline-block px-8 py-3 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 rounded-sm uppercase tracking-widest text-xs font-medium">
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>;
}

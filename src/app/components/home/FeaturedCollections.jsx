import { Link } from 'react-router';
import { motion } from 'motion/react';
import { collections } from '../../data';
import { ArrowRight } from 'lucide-react';
export function FeaturedCollections() {
  return <section className="bg-[var(--background)] pb-24">
      <div className="container mx-auto px-4 md:px-8 space-y-24">
        {collections.filter(c => c.slug !== 'eclat-initial' && c.slug !== 'love-and-engagement' && c.slug !== 'apex-spark').map((collection, index) => <motion.div key={collection.id} initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true,
        amount: 0.3
      }} className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              {/* Image */}
              <div className="w-full md:w-1/2 overflow-hidden h-[500px] md:h-[600px] rounded-sm relative group">
                <Link to={`/collection/${collection.slug}`}>
                  <motion.div className="w-full h-full relative" whileHover={{
              scale: 1.05
            }} transition={{
              duration: 1.2,
              ease: "easeOut"
            }}>
                    <img src={collection.image} alt={collection.name} className="w-full h-full object-cover absolute inset-0" />
                    {collection.hoverImage && <img src={collection.hoverImage} alt={collection.name} className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
                  </motion.div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </Link>
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left">
                <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-black mb-4">
                  Exclusive Collection
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--primary)] mb-6 leading-tight">
                  {collection.name}
                </h2>
                <p className="text-[var(--muted-foreground)] text-lg md:text-xl leading-relaxed mb-8 md:mb-12 font-light max-w-lg">
                  {collection.description}
                </p>
                <Link to={`/collection/${collection.slug}`} className="group flex items-center gap-3 text-sm tracking-widest uppercase text-[var(--foreground)] hover:text-[var(--primary)] transition-colors border-b border-[var(--foreground)]/20 pb-1">
                  Discover the Collection
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>)}
      </div>
    </section>;
}

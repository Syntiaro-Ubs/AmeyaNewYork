import { Link } from 'react-router';
import { motion } from 'motion/react';
import { collections } from '../../data';
export function ProductSpotlight() {
  // Filter for the spotlight collections: Love and Engagement & Eclat Initial
  const spotlightCollections = collections.filter(c => c.slug === 'love-engagement' || c.slug === 'eclat-initial');
  return <section className="bg-[var(--secondary)]/5 py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">
              Premier Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
              The SpotLight
            </h2>
            <p className="text-[var(--muted-foreground)] font-light text-lg">
              Featuring our most coveted pieces from <span className="text-[var(--primary)] font-medium">Love & Engagement</span> and <span className="text-[var(--primary)] font-medium">Eclat Initial</span>.
            </p>
          </div>
          
          <Link to="/collections" className="hidden md:block text-sm tracking-widest uppercase text-[var(--foreground)] hover:text-[var(--primary)] border-b border-[var(--foreground)] pb-1 transition-colors">
            View All Collections
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh] min-h-[600px]">
          {spotlightCollections.map((collection, index) => <motion.div key={collection.id} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8,
          delay: index * 0.2
        }} className="group relative w-full h-full overflow-hidden rounded-sm">
              <Link to={`/collections/${collection.slug}`} className="block w-full h-full">
                <div className="absolute inset-0">
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                
                <div className="absolute bottom-12 left-8 md:left-12 z-10">
                  <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">
                    {collection.name.replace(' and ', ' & ')}
                  </h3>
                  <button className="px-8 py-3 border border-[var(--primary)] text-white uppercase tracking-[0.2em] text-sm font-medium hover:bg-[var(--primary)] hover:text-white transition-all duration-300 backdrop-blur-sm">
                    Discover
                  </button>
                </div>
              </Link>
            </motion.div>)}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link to="/collections" className="text-sm tracking-widest uppercase text-[var(--foreground)] hover:text-[var(--primary)] border-b border-[var(--foreground)] pb-1 transition-colors">
            View All Collections
          </Link>
        </div>
      </div>
    </section>;
}

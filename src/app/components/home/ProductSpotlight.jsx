import { Link } from 'react-router';
import { motion } from 'motion/react';
import { collections } from '../../data';
import { MediaRenderer } from '../ui/MediaRenderer';
import { safeJsonParse } from '../../utils/json';

export function ProductSpotlight({ data }) {
  if (data && data.is_visible === 0) return null;

  const sectionTitle = data?.title || "The SpotLight";
  const sectionSubtitle = data?.subtitle || "Premier Collections";
  const spotlightItems = safeJsonParse(data?.content_json, ['love-engagement', 'eclat-initial']);
  
  const spotlightCollections = spotlightItems.map(item => {
    const slug = typeof item === 'string' ? item : item.slug;
    const baseCol = collections.find(c => c.slug === slug);
    if (!baseCol) return null;
    return {
      ...baseCol,
      image: (typeof item !== 'string' && item.image) ? item.image : baseCol.image
    };
  }).filter(Boolean);

  const collectionNames = spotlightCollections.map(c => c.name.replace(' and ', ' & '));
  const descriptionText = collectionNames.length > 0 
    ? `Featuring our most coveted pieces from ${collectionNames.length > 2 
        ? collectionNames.slice(0, -1).join(', ') + ' and ' + collectionNames.slice(-1) 
        : collectionNames.join(' and ')}.`
    : "Featuring our most coveted pieces from our signature collections.";

  return (
    <section className="bg-[var(--secondary)]/5 py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="text-center md:text-left max-w-2xl">
            <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">
              {sectionSubtitle}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
              {sectionTitle}
            </h2>
            <p className="text-[var(--muted-foreground)] font-light text-lg">
              {descriptionText}
            </p>
          </div>
          
          <Link to="/collections" className="hidden md:block text-sm tracking-widest uppercase text-[var(--foreground)] hover:text-[var(--primary)] border-b border-[var(--foreground)] pb-1 transition-colors">
            View All Collections
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh] min-h-[600px]">
          {spotlightCollections.map((collection, index) => (
            <motion.div 
              key={`${collection.id}-${index}`} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: index * 0.2 }} 
              className="group relative w-full h-full overflow-hidden rounded-sm"
            >
              <Link to={`/collection/${collection.slug}`} className="block w-full h-full">
                <div className="absolute inset-0">
                  <MediaRenderer 
                    src={collection.image} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
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
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link to="/collections" className="text-sm tracking-widest uppercase text-[var(--foreground)] hover:text-[var(--primary)] border-b border-[var(--foreground)] pb-1 transition-colors">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

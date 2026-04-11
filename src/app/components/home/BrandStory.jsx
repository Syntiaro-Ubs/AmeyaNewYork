import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useSiteData } from '../../context/SiteDataContext';
import { formatSlugLabel } from '../../utils/taxonomy';
import { MediaRenderer } from '../ui/MediaRenderer';
import { safeJsonParse } from '../../utils/json';

export function BrandStory({ data }) {
  const {
    collections
  } = useSiteData();

  if (data && data.is_visible === 0) return null;

  const sectionTitle = data?.title || "Our Signature Collections";
  const sectionSubtitle = data?.subtitle || "The Pinnacle of Design";
  const defaultCollections = ['apex-spark', 'eleve'];
  const signatureItems = safeJsonParse(data?.content_json, defaultCollections);
  
  const signatureCollections = signatureItems.map(item => {
    const slug = typeof item === 'string' ? item : item.slug;
    const baseCol = collections.find(c => c.slug === slug);
    const collectionData = baseCol || {
      id: `collection-${slug}`,
      slug,
      name: formatSlugLabel(slug),
      description: '',
      image: ''
    };
    return {
      ...collectionData,
      image: typeof item !== 'string' && item.image ? item.image : collectionData.image,
      description:
        typeof item !== 'string' && item.description ? item.description : collectionData.description
    };
  }).filter(Boolean);

  return (
    <section className="py-24 md:py-32 bg-[var(--background)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {signatureCollections.map((collection, index) => (
            <motion.div 
              key={collection.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: index * 0.2 }} 
              viewport={{ once: true }} 
              className="group relative p-8 md:p-12 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
            >
              {/* Inner Border Frame */}
              <div className="absolute inset-2 md:inset-4 border border-[var(--primary)]/10 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="w-full aspect-[4/5] overflow-hidden mb-8 relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <MediaRenderer 
                    src={collection.image} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
                
                <h3 className="text-3xl font-serif text-[var(--foreground)] mb-4 group-hover:text-[var(--primary)] transition-colors">
                  {collection.name}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-8 font-light leading-relaxed max-w-sm">
                  {collection.description}
                </p>
                
                <Link to={`/collection/${collection.slug}`} className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors border-b border-[var(--foreground)]/30 hover:border-[var(--primary)] pb-1">
                  Explore {collection.name}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

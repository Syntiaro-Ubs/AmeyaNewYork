import { Link } from 'react-router';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { collections } from '../../data';
import { MediaRenderer } from '../ui/MediaRenderer';
import { safeJsonParse } from '../../utils/json';
import { useRef, useState, useEffect } from 'react';

export function CollectionCards({ data }) {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  if (data && data.is_visible === 0) return null;

  const sectionTitle = data?.title || "Collections";
  const sectionSubtitle = data?.subtitle || "Explore our curated collections, each telling a unique story";
  const defaultCollections = ['apex-spark', 'eleve', 'eclat-initial', 'love-engagement'];
  const rawFeaturedItems = safeJsonParse(data?.content_json, defaultCollections);

  // Normalize the items and merge with static collection data
  const featuredCollections = rawFeaturedItems.map(item => {
    const slug = typeof item === 'string' ? item : item.slug;
    const baseCollection = collections.find(c => c.slug === slug);

    if (!baseCollection) return null;

    return {
      ...baseCollection,
      image: (typeof item !== 'string' && item.image) ? item.image : baseCollection.image
    };
  }).filter(Boolean);

  const isCarousel = featuredCollections.length > 1;

  const scroll = direction => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[index];
      if (child) {
        const left = child.offsetLeft - (container.clientWidth - child.clientWidth) / 2;
        container.scrollTo({
          left: left,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const progress = scrollLeft / (scrollWidth - clientWidth);
        setScrollProgress(progress || 0);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [featuredCollections.length]);

  return (
    <section className="bg-[var(--background)] py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* Cards Display */}
        <div className="relative group/section">
          {/* Arrow Controls */}
          {isCarousel && (
            <>
              <button 
                onClick={() => scroll("left")} 
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-neutral-900 opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-neutral-100" 
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <button 
                onClick={() => scroll("right")} 
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-neutral-900 opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-neutral-100" 
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`
              ${isCarousel
                ? 'flex overflow-x-auto pb-12 gap-6 scrollbar-hide snap-x snap-mandatory'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}
            `}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={`${collection.id}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className={isCarousel ? 'min-w-[85vw] sm:min-w-[45vw] lg:min-w-[22vw] snap-center' : ''}
              >
                <Link to={`/collection/${collection.slug}`} className="group block relative overflow-hidden rounded-sm h-[450px] md:h-[520px]">
                  {/* Image */}
                  <div className="absolute inset-0">
                    <MediaRenderer
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-700 group-hover:from-black/90" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 0.7, x: 0 }}
                      className="text-[10px] tracking-[0.3em] uppercase text-white mb-3"
                    >
                      {collection.tagline || 'Exclusive Collection'}
                    </motion.span>
                    <h3 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight group-hover:text-[var(--primary)] transition-colors duration-500">
                      {collection.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-white/90 group-hover:text-white transition-all transform group-hover:translate-x-2">
                      <span className="border-b border-white/30 pb-0.5">Explore Discovery</span>
                      <ArrowRight size={14} className="transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators */}
          {isCarousel && (
            <div className="flex justify-center mt-6">
              <div className="relative py-4 group/bar cursor-pointer">
                <div className="h-[2px] w-48 bg-neutral-100 relative overflow-hidden rounded-full transition-all group-hover/bar:h-[3px]">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-neutral-900 rounded-full"
                    style={{ 
                      width: `${Math.max(20, 100 / featuredCollections.length)}%`,
                      left: `${scrollProgress * (100 - Math.max(20, 100 / featuredCollections.length))}%`
                    }}
                  />
                </div>
                {/* Clickable Overlay Segments */}
                <div className="absolute inset-0 flex">
                  {featuredCollections.map((_, idx) => (
                    <div 
                      key={idx} 
                      className="flex-1 h-full z-10" 
                      onClick={() => scrollToIndex(idx)}
                      role="button"
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteData } from "../../context/SiteDataContext";
import { formatSlugLabel } from "../../utils/taxonomy";
import { MediaRenderer } from "../ui/MediaRenderer";
import { safeJsonParse } from "../../utils/json";

export function CategoryGrid({ data }) {
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const {
    categories: siteCategories
  } = useSiteData();

  if (data && data.is_visible === 0) return null;

  const sectionTitle = data?.title || "Shop by Category";
  const sectionSubtitle = data?.subtitle || "All Jewelry";

  // Default categories if nothing is selected yet
  const defaultSlugs = ['rings', 'earrings', 'necklaces', 'bracelets'];
  const rawFeaturedItems = safeJsonParse(data?.content_json, defaultSlugs);

  // Normalize items and merge with backend data
  const featuredCategories = rawFeaturedItems.map(item => {
    const slug = typeof item === 'string' ? item : item.slug;
    const baseCategory = siteCategories.find(c => c.slug === slug);
    
    const dynamicCategory = baseCategory ? { ...baseCategory } : {
      id: `dynamic-${slug}`,
      slug: slug,
      name: formatSlugLabel(slug),
      image: ''
    };

    return {
      ...dynamicCategory,
      image: (typeof item !== 'string' && item.image) ? item.image : dynamicCategory.image
    };
  }).filter(Boolean);

  const isCarousel = featuredCategories.length > 1;

  const scroll = direction => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
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
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const progress = scrollLeft / (scrollWidth - clientWidth);
        setScrollProgress(progress || 0);
      }
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [featuredCategories.length]);

  return (
    <section className="py-20 md:py-32 bg-[var(--background)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative group/category">
          {/* Navigation Buttons */}
          {isCarousel && (
            <>
              <button 
                onClick={() => scroll("left")} 
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-neutral-900 opacity-0 group-hover/category:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-neutral-100" 
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <button 
                onClick={() => scroll("right")} 
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-neutral-900 opacity-0 group-hover/category:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-neutral-100" 
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
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
            {featuredCategories.map((category, index) => (
              <motion.div
                key={`${category.id}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`shrink-0 snap-center group relative h-[450px] lg:h-[500px] overflow-hidden rounded-sm transition-all duration-500 
                  w-[85vw] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)]`}
              >
                <Link to={`/category/${category.slug}`} className="block h-full w-full relative">
                  {/* Image Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                  <MediaRenderer
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />

                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-white text-center px-4">
                    <h3 className="font-serif text-3xl mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {category.name}
                    </h3>
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 border-b border-white pb-1">
                      Explore Collection <ArrowRight size={14} />
                    </span>
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
                      width: `${Math.max(20, 100 / featuredCategories.length)}%`,
                      left: `${scrollProgress * (100 - Math.max(20, 100 / featuredCategories.length))}%`
                    }}
                  />
                </div>
                {/* Clickable Overlay Segments */}
                <div className="absolute inset-0 flex">
                  {featuredCategories.map((_, idx) => (
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

import { useRef } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "../../data";
export function CategoryGrid() {
  const scrollContainerRef = useRef(null);
  
  const scroll = direction => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Calculate scroll amount based on item width + gap
      // We can approximate or just scroll by container width / visible items
      const containerWidth = container.clientWidth;
      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768;
      const visibleItems = isDesktop ? 4 : isTablet ? 3 : 1;
      const scrollAmount = containerWidth / visibleItems;
      const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }
  };
  return <section className="py-20 md:py-32 bg-[var(--background)]">
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
      }} className="text-center mb-16">
          <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-4">
            All Jewelry
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">
            Shop by Category
          </h2>
        </motion.div>

        <div className="relative group">
          {/* Navigation Buttons - Aesthetic Icons */}
          <button onClick={() => scroll("left")} className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-[var(--border)]" aria-label="Scroll left">
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button onClick={() => scroll("right")} className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-[var(--border)]" aria-label="Scroll right">
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Scroll Container */}
          <div ref={scrollContainerRef} className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category, index) => <motion.div key={category.id} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="shrink-0 snap-center group relative h-[400px] lg:h-[450px] overflow-hidden rounded-sm shadow-sm hover:shadow-lg transition-all duration-500 w-full md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]">
                <Link to={`/category/${category.slug}`} className="block h-full w-full relative">
                  {/* Gradient overlay for text readability only at the bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                  
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                  
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-white text-center px-4">
                    <h3 className="font-serif text-2xl mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-md">
                      {category.name}
                    </h3>
                    <span className="text-xs tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 border-b border-white/0 group-hover:border-white pb-1">
                      Shop Now <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>)}
          </div>
        </div>
      </div>
    </section>;
}

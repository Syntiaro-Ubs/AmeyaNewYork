import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { getImageUrl } from '../../utils/image';

export function NewArrivalHero({ data }) {
  if (data && data.is_visible === 0) return null;

  const title = data?.title || "Experience Luxury Like Never Before";
  const subtitle = data?.subtitle || "Discover our latest collection crafted with precision and elegance.";
  const media = data?.media_url || '';
  const link = data?.link_url || "/category/new-arrival";

  return (
    <section className="relative w-full h-[70vh] md:h-screen min-h-[560px] flex items-center justify-center overflow-hidden bg-black">
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        {media && (
          media.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
              }}
              loading="lazy"
            >
              <source src={getImageUrl(media)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={getImageUrl(media)} 
              alt="New Arrival" 
              className="w-full h-full object-cover"
            />
          )
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-8 text-white">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Small Label - Fade in first */}
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: 'easeOut',
            }}
            className="text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-white/70 font-sans mb-6 md:mb-8"
          >
            New Collection
          </motion.p>

          {/* Main Heading - Fade in second */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: 'easeOut',
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-4 md:mb-6 text-white"
          >
            {title}
          </motion.h1>

          {/* Subheading - Fade in third */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: 'easeOut',
            }}
            className="text-base md:text-lg text-white/80 font-sans font-light max-w-2xl mb-8 md:mb-12 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button - Fade in last */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.7,
              ease: 'easeOut',
            }}
          >
            <Link
              to={link}
              className="group inline-flex items-center gap-3 px-8 md:px-10 py-3 md:py-4 bg-white text-black font-sans font-semibold text-sm md:text-base uppercase tracking-[0.1em] hover:bg-white/90 transition-all duration-300 ease-out hover:gap-4"
            >
              Explore Now
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Fade in from bottom */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 1,
          ease: 'easeOut',
        }}
        className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.1em] text-white/60 font-sans">
            Scroll to explore
          </span>
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-6 h-10 border border-white/40 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

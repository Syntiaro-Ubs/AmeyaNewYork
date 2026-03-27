import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import apexSparkImg from '../../../assets/collection/Apex Spark/All Photos/AMP110011_D.JPG';
import eleveImg from '../../../assets/collection/ELEVE/2/RBM.JPG';
import eclatInitialImg from '../../../assets/collection/ECLAT INITIAL/AM-P000444-A-ELE_3.JPG';
import loveEngagementImg from '../../../assets/collection/Love and Engagement/ring red/DR1M.JPG';
const allCollections = [{
  id: 'apex-spark',
  name: 'Apex Spark',
  slug: 'apex-spark',
  tagline: 'Bold & Avant-Garde',
  image: apexSparkImg
}, {
  id: 'eleve',
  name: 'Elevé',
  slug: 'eleve',
  tagline: 'Elevated Essentials',
  image: eleveImg
}, {
  id: 'eclat-initial',
  name: 'Éclat Initial',
  slug: 'eclat-initial',
  tagline: 'Personal & Precious',
  image: eclatInitialImg
}, {
  id: 'love-engagement',
  name: 'Love & Engagement',
  slug: 'love-engagement',
  tagline: 'Forever Begins Here',
  image: loveEngagementImg
}];
export function CollectionCards() {
  return <section className="bg-[var(--background)] py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }} viewport={{
        once: true
      }} className="text-center mb-14 md:mb-20">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-[var(--primary)] mb-4 block">
          AMEYA
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">
            Collections
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg md:text-xl font-light mt-4 max-w-xl mx-auto">
            Explore our curated collections, each telling a unique story
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {allCollections.map((collection, index) => <motion.div key={collection.id} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: index * 0.1
        }} viewport={{
          once: true,
          amount: 0.2
        }}>
              <Link to={`/collection/${collection.slug}`} className="group block relative overflow-hidden rounded-sm h-[420px] md:h-[480px]">
                {/* Image */}
                <div className="absolute inset-0">
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 mb-2">
                    {collection.tagline}
                  </span>
                  <h3 className="text-2xl md:text-[1.7rem] font-serif text-white mb-4 leading-snug">
                    {collection.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/80 group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>)}
        </div>
      </div>
    </section>;
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { MediaRenderer } from '../components/ui/MediaRenderer';

export function Journal() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dynamicBanner, setDynamicBanner] = useState(null);
  const [dynamicArticles, setDynamicArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, articlesRes] = await Promise.all([
          fetch('http://localhost:5000/api/banners/journal'),
          fetch('http://localhost:5000/api/journal')
        ]);
        
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          setDynamicBanner(bannerData);
        }
        
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          if (articlesData && articlesData.length > 0) {
            const formatted = articlesData.map(a => ({
              id: a.id,
              title: a.title,
              excerpt: a.excerpt,
              image: a.image_url ? `http://localhost:5000${a.image_url}` : '',
              category: a.category,
              date: new Date(a.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              readTime: a.read_time || '5 min read',
              is_featured: a.is_featured
            }));
            setDynamicArticles(formatted);
          }
        }
      } catch (error) {
        console.error('Failed to fetch journal data', error);
      }
    };
    
    fetchData();
  }, []);

  const hardcodedArticles = [
    {
      id: 1,
      title: 'The Art of Layering: Mastering the Multi-Necklace Look',
      excerpt: 'Discover the secrets to creating a perfectly layered necklace ensemble that reflects your personal style and elevates any outfit.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      category: 'Style Guide',
      date: 'January 15, 2025',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Inside Our Atelier: A Day in the Life of a Master Goldsmith',
      excerpt: 'Step into our New York workshop and witness the meticulous craftsmanship that goes into creating each AMEYA piece.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      category: 'Behind the Scenes',
      date: 'January 10, 2025',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'The Journey of a Diamond: From Mine to Masterpiece',
      excerpt: 'Follow the remarkable journey of ethically sourced diamonds as they transform into the stunning pieces you treasure.',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
      category: 'Craftsmanship',
      date: 'January 5, 2025',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Spring 2025 Jewelry Trends: What to Wear This Season',
      excerpt: 'Explore the latest jewelry trends for spring, from bold statement pieces to delicate everyday essentials.',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
      category: 'Trends',
      date: 'December 28, 2024',
      readTime: '4 min read'
    },
    {
      id: 5,
      title: 'AMEYA at New York Fashion Week: Highlights and Inspirations',
      excerpt: 'Relive the magic of our latest Fashion Week showcase and discover the inspirations behind our newest collection.',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      category: 'Events',
      date: 'December 20, 2024',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'Caring for Your Fine Jewelry: Expert Tips and Tricks',
      excerpt: 'Learn how to properly care for and maintain your precious jewelry to ensure it remains beautiful for generations.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      category: 'Style Guide',
      date: 'December 15, 2024',
      readTime: '6 min read'
    },
    {
      id: 7,
      title: 'The Renaissance of Vintage-Inspired Jewelry',
      excerpt: 'Discover how classic design elements are being reimagined for the modern jewelry lover.',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      category: 'Trends',
      date: 'December 10, 2024',
      readTime: '5 min read'
    },
    {
      id: 8,
      title: 'Handcrafted Excellence: The Tools of Our Trade',
      excerpt: 'An intimate look at the specialized tools and techniques our artisans use to create jewelry perfection.',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
      category: 'Craftsmanship',
      date: 'December 5, 2024',
      readTime: '7 min read'
    }
  ];

  const articles = dynamicArticles.length > 0 ? dynamicArticles : hardcodedArticles;
  const categories = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticle = articles.find(a => a.is_featured) || articles[0];
  const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#f8f7f5] overflow-hidden flex items-center justify-center">
        {dynamicBanner && (
          <>
            <div className="absolute inset-0 z-0">
              <MediaRenderer 
                src={dynamicBanner.media_url} 
                alt="AMEYA Journal"
                className="w-full h-full object-cover"
                style={{ objectPosition: dynamicBanner.focal_point || 'center' }}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 z-10" />
          </>
        )}
        <div className="relative z-20 max-w-6xl mx-auto text-center px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className={`text-[10px] uppercase tracking-[0.4em] mb-4 ${dynamicBanner ? 'text-white/90' : 'text-[var(--primary)]'}`}>
              Stories & Inspiration
            </p>
            <h1 className={`font-serif text-5xl md:text-7xl mb-6 leading-tight ${dynamicBanner ? 'text-white' : 'text-[var(--foreground)]'}`}>
              The AMEYA Journal
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${dynamicBanner ? 'text-white/90' : 'text-[var(--muted-foreground)]'}`}>
              Explore the world of fine jewelry through our curated stories, style guides, and behind-the-scenes insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
              Featured Story
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm group">
              <img 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[var(--primary)]">
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} strokeWidth={1.5} />
                  {featuredArticle.date}
                </div>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-8">
                {featuredArticle.excerpt}
              </p>
              <Link 
                to={`/journal/${featuredArticle.id}`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--foreground)] text-white text-[11px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity"
              >
                Read Article
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-6 md:px-12 bg-[#f8f7f5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[var(--foreground)] text-white'
                    : 'bg-white text-[var(--muted-foreground)] hover:bg-[#edecea]'
                }`}
              >
                {category === 'all' ? 'All Stories' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/journal/${article.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--primary)]">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} strokeWidth={1.5} />
                      {article.date}
                    </div>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-2xl text-[var(--foreground)] mb-3 leading-tight group-hover:text-[var(--primary)] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-[var(--muted-foreground)] leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    Read More
                    <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <Tag size={48} className="mx-auto mb-4 text-[var(--muted-foreground)]" strokeWidth={1} />
              <p className="text-[var(--muted-foreground)] text-lg">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#f8f7f5] py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
              Stay Inspired
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-10 leading-relaxed">
              Subscribe to our newsletter and receive the latest stories, style tips, and exclusive insights delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[var(--foreground)] text-white text-[11px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

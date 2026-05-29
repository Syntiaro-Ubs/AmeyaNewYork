import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { MediaRenderer } from '../components/ui/MediaRenderer';

export function JournalArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/journal/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-4xl text-neutral-900 mb-4">Article Not Found</h1>
        <p className="text-neutral-500 mb-8">The story you're looking for doesn't exist or has been removed.</p>
        <Link to="/journal" className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
          <ArrowLeft size={16} /> Back to Journal
        </Link>
      </div>
    );
  }

  // Format date correctly
  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header / Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex justify-center">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--primary)] border border-[var(--primary)] px-4 py-1.5 rounded-full">
              {article.category}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl text-neutral-900 mb-8 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} strokeWidth={1.5} />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} strokeWidth={1.5} />
              {article.read_time || '5 min read'}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Image */}
      {article.image_url && (
        <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-[21/9] w-full overflow-hidden rounded-sm bg-neutral-100"
          >
            <MediaRenderer 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>
      )}

      {/* Content */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg prose-neutral max-w-none"
        >
          {article.excerpt && (
            <p className="text-xl md:text-2xl font-serif text-neutral-600 leading-relaxed mb-10 italic">
              {article.excerpt}
            </p>
          )}
          
          {/* Render content maintaining whitespace and line breaks */}
          <div className="space-y-6 text-neutral-800 leading-loose">
            {article.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-neutral-100">
          <Link to="/journal" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={14} /> Back to all stories
          </Link>
        </div>
      </section>
    </div>
  );
}

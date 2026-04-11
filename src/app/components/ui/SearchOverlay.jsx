import { useState, useMemo, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { useSiteData } from '../../context/SiteDataContext';
import { getImageUrl } from '../../utils/image';

export function SearchOverlay({
  isOpen,
  onClose
}) {
  const [query, setQuery] = useState('');
  const [liveProducts, setLiveProducts] = useState([]);
  const {
    categories
  } = useSiteData();

  useEffect(() => {
    if (isOpen) {
      const fetchAllProducts = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products');
          const data = await response.json();
          setLiveProducts(data);
        } catch (err) {
          console.error('Error fetching search products:', err);
          setLiveProducts([]);
        }
      };
      fetchAllProducts();
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    const searchLow = query.toLowerCase();
    return liveProducts.filter(p => p.name.toLowerCase().includes(searchLow) || p.category.toLowerCase().includes(searchLow) || (p.product_id && p.product_id.toLowerCase().includes(searchLow)));
  }, [query, liveProducts]);
  const filteredCategories = useMemo(() => {
    if (!query) return categories;
    return categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);
  const hasResults = filteredProducts.length > 0 || filteredCategories.length > 0;
  if (!isOpen) return null;
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20" onClick={onClose}>
        <motion.div initial={{
        y: -50,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} exit={{
        y: -50,
        opacity: 0
      }} transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }} className="w-full max-w-3xl bg-[var(--background)] rounded-lg shadow-2xl overflow-hidden mx-4 relative" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-[var(--border)] flex items-center gap-4">
            <Search className="text-[var(--muted-foreground)] w-6 h-6" />
            <input type="text" placeholder="Search for jewelry, collections, or categories..." className="flex-1 text-xl bg-transparent border-none outline-none placeholder:text-[var(--muted-foreground)] font-serif" value={query} onChange={e => setQuery(e.target.value)} autoFocus />
            <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {!query ? <div>
                <h3 className="text-sm uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-6">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map(cat => <Link key={cat.id} to={`/category/${cat.slug}`} onClick={onClose} className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--muted)]">
                        {cat.image ? <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-sm font-medium text-[var(--muted-foreground)]">
                            {cat.name?.charAt(0) || '?'}
                          </div>}
                      </div>
                      <span className="font-medium font-serif">{cat.name}</span>
                    </Link>)}
                </div>
              </div> : <div className="space-y-8">
                {/* Categories Matches */}
                {filteredCategories.length > 0 && <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {filteredCategories.map(cat => <Link key={cat.id} to={`/category/${cat.slug}`} onClick={onClose} className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-sm">
                          {cat.name}
                        </Link>)}
                    </div>
                  </div>}

                {/* Products Matches */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-4">Products</h3>
                  {filteredProducts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts.map(product => <Link key={product.id} to={`/product/${product.product_id || product.id}`} onClick={onClose} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--muted)]/50 transition-colors group">
                          <div className="w-16 h-16 bg-[var(--muted)] rounded-md overflow-hidden flex-shrink-0">
                            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-lg text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{product.name}</h4>
                            <p className="text-sm text-[var(--muted-foreground)]">${product.price.toLocaleString()}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                        </Link>)}
                    </div> : <p className="text-[var(--muted-foreground)] italic">No products found matching "{query}"</p>}
                </div>
              </div>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}

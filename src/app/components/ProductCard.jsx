import { useMemo } from 'react';
import { getImageUrl } from '../utils/image';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/QuickViewContext';
export function ProductCard({
  product,
  index = 0
}) {
  const {
    toggleWishlist,
    isInWishlist
  } = useWishlist();
  const {
    openQuickView
  } = useQuickView();
  const idValue = product.product_id || product.id;
  const wishlisted = isInWishlist(idValue);

  const images = useMemo(() => {
    if (!product) return [];
    const list = product.image ? [getImageUrl(product.image)] : [];
    if (product.gallery) {
      const gallery = Array.isArray(product.gallery) ? product.gallery : (typeof product.gallery === 'string' ? JSON.parse(product.gallery) : []);
      const galleryList = gallery.map(img => getImageUrl(img));
      return [...list, ...galleryList];
    }
    return list;
  }, [product]);

  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-40px'
  }} transition={{
    duration: 0.5,
    delay: Math.min(index * 0.1, 0.3)
  }} className="group relative bg-[var(--card)] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ── Image area — click opens Quick View ── */}
      <div className="relative aspect-[3/4.5] overflow-hidden cursor-pointer" onClick={() => openQuickView(product)}>
        {/* Default image - jewelry close-up */}
        <img src={images[0]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Hover image - model wearing jewelry */}
        {images[1] && <img src={images[1]} alt={`${product.name} worn`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

        {/* Wishlist heart — always accessible, stops propagation */}
        <button onClick={e => {
        e.stopPropagation();
        toggleWishlist(idValue);
      }} className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 ${wishlisted ? 'opacity-100 text-[var(--primary)]' : 'opacity-0 group-hover:opacity-100 text-[var(--foreground)] hover:text-[var(--primary)]'}`} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Heart size={16} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* "Quick View" label — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="w-full bg-white/95 backdrop-blur-sm text-[var(--foreground)] py-3 text-[10px] uppercase tracking-[0.22em] flex items-center justify-center border-t border-[var(--border)]">
            Quick View
          </div>
        </div>
      </div>

      {/* ── Text below — name navigates to full PDP ── */}
      <div className="p-4 text-center">
        <h3 className="font-serif text-lg text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors truncate">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-[var(--muted-foreground)] mb-2 uppercase tracking-wide text-xs">
          {product.category}
        </p>
        <span className="text-[var(--foreground)] font-medium">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </motion.div>;
}

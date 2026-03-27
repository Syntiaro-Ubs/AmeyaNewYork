import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { products, collections } from '../data';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── Editorial / lifestyle images for the gallery ── */
const FALLBACK_IMAGE = products[0]?.image || collections[0]?.image;
const GALLERY_MODEL = products[1]?.image || FALLBACK_IMAGE;
const GALLERY_CLOSEUP = products[2]?.image || FALLBACK_IMAGE;
const GALLERY_LIFESTYLE = collections[0]?.image || FALLBACK_IMAGE;

/* ── Material swatch palette ── */
const ALL_SWATCHES = [{
  label: '18k Yellow Gold',
  short: 'Yellow',
  color: '#D4AF37',
  border: false
}, {
  label: '18k White Gold',
  short: 'White',
  color: '#E8E4E0',
  border: true
}, {
  label: '18k Rose Gold',
  short: 'Rose',
  color: '#C89B94',
  border: false
}, {
  label: 'Platinum',
  short: 'Plat.',
  color: '#DCDCDC',
  border: true
}, {
  label: 'Sterling Silver',
  short: 'Silver',
  color: '#C0C0C0',
  border: true
}];

/* ── Helpers ── */
function detectActiveMaterials(material) {
  if (!material) return [];
  const m = material.toLowerCase();
  const found = [];
  if (m.includes('18k') && m.includes('yellow')) found.push('18k Yellow Gold');
  if (m.includes('18k') && m.includes('white')) found.push('18k White Gold');
  if (m.includes('18k') && m.includes('rose')) found.push('18k Rose Gold');
  if (m.includes('platinum')) found.push('Platinum');
  if (m.includes('sterling silver')) found.push('Sterling Silver');
  if (found.length === 0 && m.includes('18k')) found.push('18k Yellow Gold');
  return found;
}
function detectStones(material) {
  if (!material) return [];
  const m = material.toLowerCase();
  const stones = [];
  if (m.includes('diamond')) stones.push('diamond');
  if (m.includes('ruby') || m.includes('rubies')) stones.push('ruby');
  if (m.includes('sapphire')) stones.push('sapphire');
  if (m.includes('emerald')) stones.push('emerald');
  if (m.includes('pearl')) stones.push('pearl');
  return stones;
}

/* ── Small card for horizontal scroll rows ── */
function QuickCard({
  product,
  onCardClick
}) {
  return <button onClick={() => onCardClick(product)} className="flex-shrink-0 w-[148px] text-left group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f4f2] mb-2.5">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
      </div>
      <p className="font-serif text-[var(--foreground)] text-sm leading-snug mb-0.5 truncate group-hover:text-[var(--primary)] transition-colors">
        {product.name}
      </p>
      <p className="text-[var(--muted-foreground)] text-xs">
        ${product.price.toLocaleString()}
      </p>
    </button>;
}

/* ── Section label ── */
function SectionLabel({
  eyebrow,
  title
}) {
  return <div className="px-7 mb-5">
      <p className="text-[9px] uppercase tracking-[0.32em] text-[var(--primary)] mb-1.5">{eyebrow}</p>
      <h3 className="font-serif text-[1.35rem] text-[var(--foreground)] leading-snug">{title}</h3>
    </div>;
}

/* ══════════════════════════════════════════
   INNER PANEL CONTENT
   Rendered once we know which product to show
══════════════════════════════════════════ */
function QuickViewContent({
  product,
  closeQuickView,
  openQuickView
}) {
  const {
    addToCart
  } = useCart();
  const {
    toggleWishlist,
    isInWishlist
  } = useWishlist();
  const scrollRef = useRef(null);
  const wishlisted = isInWishlist(product.id);
  const collection = product.collection ? collections.find(c => c.slug === product.collection) : null;
  const activeMaterials = detectActiveMaterials(product.material);
  const stones = detectStones(product.material);

  /* Gallery images — use extra product gallery entries if available, else editorial */
  const galleryImages = [product.gallery[1] || GALLERY_MODEL, product.gallery[2] || GALLERY_CLOSEUP, product.gallery[3] || GALLERY_LIFESTYLE];

  /* You May Also Like — same category, any collection */
  const youMayAlsoLike = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 12);

  /* Discover More — same stone keyword(s), any category; fallback: same collection */
  const discoverMore = products.filter(p => {
    if (p.id === product.id || !p.material) return false;
    const mat = p.material.toLowerCase();
    if (stones.length > 0) return stones.some(s => mat.includes(s));
    return p.collection === product.collection;
  }).slice(0, 12);

  /* Scroll to top when product changes */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [product.id]);
  const stoneLabel = stones.length > 0 ? stones.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ') : collection?.name || 'This Collection';
  return <>
      {/* ── Backdrop ── */}
      <motion.div key="qv-backdrop" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.25
    }} className="fixed inset-0 bg-black/45 z-[90]" style={{
      backdropFilter: 'blur(2px)'
    }} onClick={closeQuickView} />

      {/* ── Slide-in panel ── */}
      <motion.div key="qv-panel" initial={{
      x: '100%'
    }} animate={{
      x: 0
    }} exit={{
      x: '100%'
    }} transition={{
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1]
    }} className="fixed right-0 top-0 bottom-0 w-full sm:w-[780px] max-w-full bg-white z-[100] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-[18px] border-b border-[var(--border)] flex-shrink-0 bg-white">
          <span className="text-[9px] uppercase tracking-[0.36em] text-[var(--muted-foreground)]">
            AMEYA New York
          </span>
          <button onClick={closeQuickView} className="w-8 h-8 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" aria-label="Close quick view">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#E0E0E0 transparent'
      }}>

          {/* ══════════════════════════════════
              SECTION 1 — Product Hero
           ══════════════════════════════════ */}
          <div className="flex gap-5 p-7 pb-6">

            {/* Thumbnail — click opens product page */}
            <Link to={`/product/${product.id}`} onClick={closeQuickView} className="flex-shrink-0 w-[150px] aspect-[3/4] overflow-hidden bg-[#f5f4f2] block">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" />
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col">
              {collection && <Link to={`/category/${product.collection}`} onClick={closeQuickView} className="text-[9px] uppercase tracking-[0.28em] text-[var(--primary)] mb-2 hover:opacity-70 transition-opacity inline-block">
                  {collection.name}
                </Link>}
              <h2 className="font-serif text-[1.2rem] text-[var(--foreground)] leading-snug mb-1">
                {product.name}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] mb-3">
                {product.category}
              </p>
              <p className="text-[var(--foreground)] text-lg mb-3">
                ${product.price.toLocaleString()}
              </p>
              {product.material && <p className="text-[11px] text-[var(--muted-foreground)] font-light leading-relaxed mb-5 line-clamp-3">
                  {product.material}
                </p>}

              {/* Action buttons */}
              <div className="flex flex-col gap-2 mt-auto">
                <button onClick={() => addToCart(product.id, 1)} className="w-full py-[11px] bg-[var(--foreground)] text-white text-[10px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                  <ShoppingBag size={12} strokeWidth={1.5} /> Add to Bag
                </button>
                <button onClick={() => toggleWishlist(product.id)} className={`w-full py-[11px] border text-[10px] uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 ${wishlisted ? 'border-[var(--foreground)] text-[var(--foreground)] bg-[#f5f4f2]' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'}`}>
                  <Heart size={12} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>
                <Link to={`/product/${product.id}`} onClick={closeQuickView} className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors pt-1">
                  View Full Details <ArrowRight size={10} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              SECTION 2 — Also Available In (material swatches)
           ══════════════════════════════════ */}
          <div className="px-7 pb-7 border-b border-[var(--border)]">
            <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--muted-foreground)] mb-4">
              Also Available In
            </p>
            <div className="flex flex-wrap gap-5">
              {ALL_SWATCHES.map(swatch => {
              const isActive = activeMaterials.includes(swatch.label);
              return <div key={swatch.label} className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full transition-all duration-200 cursor-pointer ${isActive ? 'ring-2 ring-offset-2 ring-[var(--foreground)] scale-110' : 'opacity-45 hover:opacity-70 hover:scale-105'}`} style={{
                  backgroundColor: swatch.color,
                  border: swatch.border ? '1.5px solid #bbb' : 'none'
                }} title={swatch.label} />
                    <span className={`text-[9px] uppercase tracking-[0.1em] whitespace-nowrap ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                      {swatch.short}
                    </span>
                  </div>;
            })}
            </div>
            <p className="mt-4 text-[10px] text-[var(--muted-foreground)] font-light italic leading-relaxed">
              Contact your advisor to commission this piece in your preferred material.
            </p>
          </div>

          {/* ══════════════════════════════════
              SECTION 3 — Editorial Gallery (3 images)
           ══════════════════════════════════ */}
          <div className="border-b border-[var(--border)]">
            <div className="px-7 pt-7 pb-5">
              <p className="text-[9px] uppercase tracking-[0.32em] text-[var(--muted-foreground)] mb-1.5">
                Editorial
              </p>
              <h3 className="font-serif text-[1.35rem] text-[var(--foreground)]">
                The Piece, Seen Closely
              </h3>
            </div>

            {/* Image 1 — model wearing (landscape 16:9) */}
            <div className="w-full overflow-hidden bg-[#f5f4f2]" style={{
            aspectRatio: '16/9'
          }}>
              <img src={galleryImages[0]} alt={`${product.name} — worn on model`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="px-7 py-3 border-b border-[var(--border)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                01 — Worn on model
              </p>
            </div>

            {/* Image 2 — close-up (square 1:1) */}
            <div className="w-full overflow-hidden bg-[#f5f4f2]" style={{
            aspectRatio: '1/1'
          }}>
              <img src={galleryImages[1]} alt={`${product.name} — close-up detail`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="px-7 py-3 border-b border-[var(--border)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                02 — Handcrafted detail
              </p>
            </div>

            {/* Image 3 — lifestyle (portrait 4:5) */}
            <div className="w-full overflow-hidden bg-[#f5f4f2]" style={{
            aspectRatio: '4/5'
          }}>
              <img src={galleryImages[2]} alt={`${product.name} — lifestyle`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="px-7 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                03 — Lifestyle editorial
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════
              SECTION 4 — You May Also Like (same category, h-scroll)
           ══════════════════════════════════ */}
          {youMayAlsoLike.length > 0 && <div className="py-7 border-b border-[var(--border)]">
              <SectionLabel eyebrow={`More ${product.category}`} title="You May Also Like" />
              <div className="flex gap-3.5 overflow-x-auto px-7 pb-1" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
                {youMayAlsoLike.map(p => <QuickCard key={p.id} product={p} onCardClick={openQuickView} />)}
              </div>
            </div>}

          {/* ══════════════════════════════════
              SECTION 6 — Discover More (same stone / material, h-scroll)
           ══════════════════════════════════ */}
          {discoverMore.length > 0 && <div className="py-7">
              <SectionLabel eyebrow={`Featuring ${stoneLabel}`} title="Discover More From This Collection" />
              <div className="flex gap-3.5 overflow-x-auto px-7 pb-1" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
                {discoverMore.map(p => <QuickCard key={p.id} product={p} onCardClick={openQuickView} />)}
              </div>

              {/* Footer links */}
              {product.collection && <div className="px-7 mt-7 pt-7 border-t border-[var(--border)] flex items-center justify-between">
                  <Link to={`/category/${product.collection}`} onClick={closeQuickView} className="text-[10px] uppercase tracking-[0.24em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-px hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors">
                    View Full Collection
                  </Link>
                  <Link to={`/product/${product.id}`} onClick={closeQuickView} className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                    Full Details <ArrowRight size={10} strokeWidth={1.5} />
                  </Link>
                </div>}
            </div>}

          {/* bottom padding */}
          <div className="h-10" />
        </div>
      </motion.div>
    </>;
}

/* ══════════════════════════════════════════
   ROOT EXPORT
   Place once inside Layout — renders the sidebar
   globally across all pages.
══════════════════════════════════════════ */
export function ProductQuickViewSidebar() {
  const {
    quickViewProduct,
    closeQuickView,
    openQuickView
  } = useQuickView();

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = quickViewProduct ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [quickViewProduct]);
  return <AnimatePresence>
      {quickViewProduct && <QuickViewContent key={quickViewProduct.id} product={quickViewProduct} closeQuickView={closeQuickView} openQuickView={openQuickView} />}
    </AnimatePresence>;
}

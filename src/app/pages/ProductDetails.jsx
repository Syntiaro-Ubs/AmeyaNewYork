import { useState, useEffect, useMemo } from 'react';
import { getImageUrl } from '../utils/image';
import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ShoppingBag, Heart, MapPin, MessageSquare, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteData } from '../context/SiteDataContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/QuickViewContext';
import '../components/ProductCard';
/* ── Derive material label tokens from a material string ── */
function parseMaterialVariants(material) {
  if (!material) return [];
  const raw = material.split(',').map(s => s.trim());
  const labels = [];
  raw.forEach(part => {
    const l = part.toLowerCase();
    if (l.includes('18k') && l.includes('white')) labels.push('18k White Gold');else if (l.includes('18k') && l.includes('yellow')) labels.push('18k Yellow Gold');else if (l.includes('18k') && l.includes('rose')) labels.push('18k Rose Gold');else if (l.includes('18k gold') || l === '18k gold') labels.push('18k Gold');else if (l.includes('platinum')) labels.push('Platinum');else if (l.includes('sterling silver')) labels.push('Sterling Silver');
  });
  return [...new Set(labels)];
}

/* ── Accordion row ── */
function Accordion({
  title,
  children
}) {
  const [open, setOpen] = useState(false);
  return <div className="border-b border-[var(--border)]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
        {title}
        <ChevronDown size={13} strokeWidth={1.5} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.25,
        ease: 'easeInOut'
      }} className="overflow-hidden">
            <div className="pb-6 text-[var(--muted-foreground)] text-sm leading-relaxed font-light">
              {children}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}

/* ══════════════════════════════════════════
   PRODUCT DETAILS PAGE
══════════════════════════════════════════ */
export function ProductDetails() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const {
    addToCart
  } = useCart();
  const {
    toggleWishlist,
    isInWishlist
  } = useWishlist();
  const {
    collections
  } = useSiteData();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        
        // Parse gallery if it's a string
        if (data.gallery && typeof data.gallery === 'string') {
          data.gallery = JSON.parse(data.gallery);
        }
        
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id]);

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

  const materialVariants = parseMaterialVariants(product?.material);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!product) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5">
        <h2 className="text-3xl font-serif">Product Not Found</h2>
        <Link to="/" className="text-[11px] uppercase tracking-[0.2em] border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors">
          Return to Home
        </Link>
      </div>;
  }
  const collectionInfo = product.collection ? collections.find(c => c.slug === product.collection) : null;
  const handleAddToBag = () => {
    addToCart(product.id, 1);
  };
  const wishlisted = isInWishlist(product.id);

  /* Thumbnail labels: if multiple gallery images, use "View N" unless we have material variants */
  const thumbLabels = materialVariants.length > 0 ? materialVariants : images.map((_, i) => `View ${i + 1}`);
  return <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════
          MAIN SPLIT LAYOUT
          Left: info panel (scrollable)
          Right: large sticky image
       ══════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* ────────────────────────────────────
            LEFT PANEL — product info
         ──────────────────────────────────── */}
        <div className="lg:w-[42%] xl:w-[38%] flex-shrink-0 flex flex-col order-2 lg:order-1">

          {/* Sticky inner scroll container */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <div className="px-8 md:px-12 lg:px-14 xl:px-16 pt-28 lg:pt-32 pb-16">

              {/* Back button */}
              <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-10">
                <ChevronLeft size={14} strokeWidth={1.5} />
                Back
              </button>

              {/* Collection label */}
              {collectionInfo && <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.4
            }} className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted-foreground)] mb-3">
                  <Link to={`/category/${product.collection}`} className="hover:text-[var(--primary)] transition-colors">
                    {collectionInfo.name}
                  </Link>
                </motion.p>}

              {/* Product name */}
              <motion.h1 initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.05
            }} className="font-serif text-[1.85rem] md:text-[2.1rem] leading-snug text-[var(--foreground)] mb-3">
                {product.name}
              </motion.h1>

              {/* Material subtitle */}
              {product.material && <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.4,
              delay: 0.1
            }} className="text-[var(--muted-foreground)] text-sm font-light leading-relaxed mb-5">
                  {product.material}
                </motion.p>}

              {/* Price */}
              <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.4,
              delay: 0.12
            }} className="text-[var(--foreground)] mb-8">
                ${product.price.toLocaleString()}
              </motion.p>

              {/* ── Variant / Gallery Thumbnails ── */}
              {images.length > 1 && <div className="mb-8">
                  <div className="flex gap-3 flex-wrap">
                    {images.map((img, i) => <button key={i} onClick={() => {
                  setActiveImageIndex(i);
                  setSelectedVariant(i);
                }} className="group flex flex-col items-center gap-2">
                        {/* Thumb image */}
                        <div className={`w-[90px] h-[90px] border transition-all duration-200 overflow-hidden bg-[#f6f5f3] ${activeImageIndex === i ? 'border-[var(--foreground)]' : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'}`}>
                          <img src={img} alt={thumbLabels[i] || `View ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                        {/* Label below thumb */}
                        <span className={`text-[10px] tracking-wide transition-colors pb-px ${activeImageIndex === i ? 'text-[var(--foreground)] border-b border-[var(--foreground)]' : 'text-[var(--muted-foreground)] border-b border-transparent group-hover:text-[var(--foreground)]'}`}>
                          {thumbLabels[i] || `View ${i + 1}`}
                        </span>
                      </button>)}
                  </div>
                </div>}

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col gap-3 mb-6">
                {/* Add to Cart */}
                <button onClick={handleAddToBag} className="w-full py-3 px-8 text-[11px] uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center gap-3 bg-[var(--foreground)] text-white hover:opacity-80">
                  <ShoppingBag size={13} strokeWidth={1.5} /> Add to Bag
                </button>

                {/* Wishlist */}
                <button onClick={() => toggleWishlist(product.id)} className={`w-full py-3 px-8 text-[11px] uppercase tracking-[0.22em] border transition-all duration-300 flex items-center justify-center gap-3 ${wishlisted ? 'border-[var(--foreground)] text-[var(--foreground)] bg-[#f5f4f2]' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] bg-[#faf9f7]'}`}>
                  <Heart size={13} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>

                {/* Contact Advisor */}
                <button className="w-full py-3 px-8 text-[11px] uppercase tracking-[0.22em] border border-[var(--border)] bg-[#f5f1eb] text-[var(--foreground)] hover:bg-[#ede9e1] transition-colors flex items-center justify-center gap-3">
                  <MessageSquare size={13} strokeWidth={1.5} /> Contact Your Advisor
                </button>
              </div>

              {/* Find in Store */}
              <div className="mb-10">
                <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors border-b border-transparent hover:border-[var(--muted-foreground)] pb-0.5">
                  <MapPin size={13} strokeWidth={1.5} />
                  Find in Store
                </button>
              </div>

              {/* ── Thin divider ── */}
              <div className="h-px bg-[var(--border)] w-full mb-2" />

              {/* ── Accordion Details ── */}
              <Accordion title="Product Details">
                <p className="mb-3 break-words whitespace-pre-line">{product.description}</p>
                <ul className="space-y-1.5 list-none">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] mt-2 flex-shrink-0" />
                    Handcrafted in New York City
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] mt-2 flex-shrink-0" />
                    Ethically sourced materials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] mt-2 flex-shrink-0" />
                    Includes certificate of authenticity
                  </li>
                </ul>
              </Accordion>

              <Accordion title="Material & Care">
                <p className="mb-3">
                  {product.material ? `Crafted in ${product.material}. ` : 'Crafted using the finest materials. '}
                  Each piece is finished by hand to ensure exceptional quality and attention to detail.
                </p>
                <p>
                  To preserve its brilliance, avoid exposure to perfume, chlorine, and harsh
                  chemicals. Clean gently with a soft polishing cloth. For professional deep 
                  cleaning, we recommend visiting any AMEYA boutique.
                </p>
              </Accordion>

              <Accordion title="Shipping & Returns">
                <p className="mb-3">
                  Complimentary concierge shipping on all US orders. International shipping 
                  is available for our global clients. Orders ship within 1–2 business days 
                  in our signature AMEYA New York packaging.
                </p>
                <p>
                  We offer complimentary returns and exchanges within 30 days of delivery. 
                  Items must be in original, unworn condition.
                </p>
              </Accordion>

              <Accordion title="Size Guide">
                <p className="mb-3">
                  Complimentary sizing service is available at any AMEYA boutique to ensure 
                  the perfect fit for your new piece.
                </p>
                <p>
                  For remote assistance, our advisors are available to guide you through our 
                  proprietary sizing process — please contact us via phone or email for 
                  a personalized consultation.
                </p>
              </Accordion>

            </div>
          </div>
        </div>

        {/* ────────────────────────────────────
            RIGHT PANEL — large sticky image
         ──────────────────────────────────── */}
        <div className="lg:flex-1 order-1 lg:order-2 bg-[#f8f7f5] lg:sticky lg:top-0 lg:h-screen flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={activeImageIndex} initial={{
            opacity: 0,
            scale: 1.02
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.55,
            ease: [0.25, 0.1, 0.25, 1]
          }} className="w-full h-full flex items-center justify-center p-8 md:p-14" style={{
            minHeight: '60vw',
            maxHeight: '100vh'
          }}>
              <img src={images[activeImageIndex]} alt={product.name} className="max-w-full max-h-full object-contain" style={{
              maxHeight: 'min(80vh, 700px)'
            }} />
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators (mobile / optional) */}
          {images.length > 1 && <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 lg:hidden">
              {images.map((_, i) => <button key={i} onClick={() => setActiveImageIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === activeImageIndex ? 'bg-[var(--foreground)] w-4' : 'bg-[var(--foreground)]/30'}`} />)}
            </div>}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RECOMMENDATION SECTIONS (below fold)
       ══════════════════════════════════════ */}
      <div className="bg-[var(--background)]">
        <RecommendationSections product={product} />
      </div>
    </div>;
}

/* ── Recommendation Sections ── */
function RecommendationSections({
  product
}) {
  const {
    toggleWishlist,
    isInWishlist
  } = useWishlist();
  const {
    collections
  } = useSiteData();
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setLiveProducts(data);
      } catch (err) {
        console.error('Error fetching recos:', err);
      }
    };
    fetchAllProducts();
  }, []);

  const collection = product.collection ? collections.find(c => c.slug === product.collection) : null;
  const collectionName = collection?.name ?? 'this collection';

  /*
   * "You May Also Like"
   * Priority 1 — same collection, DIFFERENT category
   *   e.g. viewing an Elevé Ring → shows Elevé Bracelets, Earrings, Pendants
   * Priority 2 — same collection, any other item (fallback for single-category collections)
   */
  const youMayAlsoLike = useMemo(() => {
    if (liveProducts.length === 0) return [];
    const crossCategory = liveProducts.filter(p => p.id !== product.id && p.collection === product.collection && p.category !== product.category);
    if (crossCategory.length > 0) return crossCategory.slice(0, 4);
    // fallback: same collection, different item (single-category collections)
    return liveProducts.filter(p => p.id !== product.id && p.collection === product.collection).slice(0, 4);
  }, [product, liveProducts]);

  /*
   * "Discover More From This Collection"
   * All remaining collection items not yet shown above
   */
  const shownIds = useMemo(() => new Set([product.id, ...youMayAlsoLike.map(p => p.id)]), [product.id, youMayAlsoLike]);
  const discoverMore = useMemo(() => liveProducts.filter(p => p.collection === product.collection && !shownIds.has(p.id)).slice(0, 8), [product, shownIds, liveProducts]);
  if (!youMayAlsoLike.length && !discoverMore.length) return null;
  return <div>

      {/* ════════════════════════════════════════
          SECTION 1 — YOU MAY ALSO LIKE
          Same collection · cross-category matches
       ════════════════════════════════════════ */}
      {youMayAlsoLike.length > 0 && <section className="bg-[#f8f7f5] py-20 md:py-24">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.38em] text-[var(--primary)] mb-3">
                  {collectionName} · Complete the Look
                </p>
                <h2 className="font-serif text-3xl md:text-[2.4rem] text-[var(--foreground)] leading-tight">
                  You May Also Like
                </h2>
                <div className="mt-4 w-12 h-px bg-[var(--primary)]" />
              </div>
              <p className="text-[var(--muted-foreground)] text-sm font-light max-w-xs leading-relaxed md:text-right">
                Discover companion pieces from the {collectionName} collection
                that pair beautifully with your selection.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {youMayAlsoLike.map((p, i) => <RecoCard key={p.id} product={p} index={i} variant="light" toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />)}
            </div>

            {/* CTA */}
            {product.collection && <div className="mt-14 flex justify-center">
                <Link to={`/category/${product.collection}`} className="text-[10px] uppercase tracking-[0.28em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors duration-200">
                  View All {collectionName} Pieces
                </Link>
              </div>}
          </div>
        </section>}

      {/* ════════════════════════════════════════
          SECTION 2 — DISCOVER MORE
          Remaining collection items
       ════════════════════════════════════════ */}
      {discoverMore.length > 0 && <section className="bg-white py-20 md:py-24">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

            {/* Header — centred editorial style */}
            <div className="text-center mb-14">
              <p className="text-[9px] uppercase tracking-[0.38em] text-[var(--muted-foreground)] mb-4">
                The {collectionName} Collection
              </p>
              <h2 className="font-serif text-3xl md:text-[2.4rem] text-[var(--foreground)] mb-5 leading-tight">
                Discover More From {collectionName}
              </h2>
              <div className="w-12 h-px bg-[var(--primary)] mx-auto mb-5" />
              <p className="text-[var(--muted-foreground)] text-sm font-light max-w-sm mx-auto leading-relaxed">
                Every piece in the {collectionName} collection tells a singular
                story of artisanship and enduring beauty.
              </p>
            </div>

            {/* Grid — up to 8 items, 4-col on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {discoverMore.map((p, i) => <RecoCard key={p.id} product={p} index={i} variant="white" toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />)}
            </div>

            {/* CTA — solid button */}
            {product.collection && <div className="mt-16 flex justify-center">
                <Link to={`/category/${product.collection}`} className="inline-flex items-center gap-3 px-12 py-[15px] border border-[var(--foreground)] text-[10px] uppercase tracking-[0.28em] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white transition-all duration-300">
                  Explore the Full {collectionName} Collection
                </Link>
              </div>}
          </div>
        </section>}
    </div>;
}

/* ── Luxury recommendation card (matches Category page style) ── */
function RecoCard({
  product,
  index,
  variant,
  toggleWishlist,
  isInWishlist
}) {
  const {
    openQuickView
  } = useQuickView();
  const wishlisted = isInWishlist(product.id);
  const imgBg = variant === 'light' ? '#edecea' : '#f5f4f2';
  return <motion.div initial={{
    opacity: 0,
    y: 22
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-40px'
  }} transition={{
    duration: 0.52,
    delay: Math.min(index * 0.08, 0.3),
    ease: [0.25, 0.1, 0.25, 1]
  }} className="group">
      {/* ── Image wrapper — click opens Quick View ── */}
      <div className="relative overflow-hidden aspect-[3/4] cursor-pointer" style={{
      background: imgBg
    }} onClick={() => openQuickView(product)}>
        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />

        {/* Category pill — top left */}
        <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-[var(--foreground)] text-[9px] uppercase tracking-[0.18em] px-2.5 py-[5px] pointer-events-none">
          {product.category}
        </span>

        {/* Wishlist button — top right (stops propagation) */}
        <button onClick={e => {
        e.stopPropagation();
        toggleWishlist(product.id);
      }} className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 ${wishlisted ? 'opacity-100 text-[var(--primary)]' : 'opacity-0 group-hover:opacity-100 text-[var(--foreground)] hover:text-[var(--primary)]'}`} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Heart size={16} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View strip — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="w-full bg-white/95 backdrop-blur-sm text-[var(--foreground)] py-3 text-[10px] uppercase tracking-[0.22em] flex items-center justify-center border-t border-[var(--border)]">
            Quick View
          </div>
        </div>
      </div>

      {/* ── Text ── */}
      <div className="pt-4 text-center px-1">
        <Link to={`/product/${product.id}`} className="block font-serif text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-200 leading-snug mb-1.5">
          {product.name}
        </Link>
        {product.material && <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] mb-2 truncate">
            {product.material.split(',')[0].trim()}
          </p>}
        <p className="text-[var(--foreground)] text-sm">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </motion.div>;
}

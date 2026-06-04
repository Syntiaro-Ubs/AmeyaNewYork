import { useState, useEffect, useMemo } from 'react';
import { getImageUrl } from '../utils/image';
import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ShoppingBag, Heart, MapPin, MessageSquare, ChevronDown, X } from 'lucide-react';
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

const ringSizingData = [
  { size: '3', diameter: '14.1', circumference: '44.2', uk: 'F', kr: '4', eu: '44' },
  { size: '3.5', diameter: '14.5', circumference: '45.5', uk: 'G', kr: '5', eu: '45.5' },
  { size: '4', diameter: '14.9', circumference: '46.8', uk: 'H 1/2', kr: '6', eu: '46.5' },
  { size: '4.5', diameter: '15.3', circumference: '48.0', uk: 'I 1/2', kr: '7', eu: '48' },
  { size: '5', diameter: '15.7', circumference: '49.3', uk: 'J 1/2', kr: '9', eu: '49' },
  { size: '5.5', diameter: '16.1', circumference: '50.6', uk: 'L', kr: '10', eu: '50.5' },
  { size: '6', diameter: '16.5', circumference: '51.9', uk: 'M', kr: '11', eu: '51.5' },
  { size: '6.5', diameter: '16.9', circumference: '53.1', uk: 'N', kr: '13', eu: '53' },
  { size: '7', diameter: '17.3', circumference: '54.4', uk: 'O', kr: '14', eu: '54' },
  { size: '7.5', diameter: '17.7', circumference: '55.7', uk: 'P', kr: '15', eu: '55.5' },
  { size: '8', diameter: '18.1', circumference: '57.0', uk: 'Q', kr: '16', eu: '56.5' },
  { size: '8.5', diameter: '18.5', circumference: '58.3', uk: 'R 1/2', kr: '17', eu: '58' },
  { size: '9', diameter: '18.9', circumference: '59.5', uk: 'S 1/2', kr: '18', eu: '59' },
  { size: '9.5', diameter: '19.4', circumference: '60.8', uk: 'T 1/2', kr: '19', eu: '60.5' },
  { size: '10', diameter: '19.8', circumference: '62.1', uk: 'U 1/2', kr: '21', eu: '61.5' },
  { size: '10.5', diameter: '20.2', circumference: '63.4', uk: 'W', kr: '22', eu: '63' },
  { size: '11', diameter: '20.6', circumference: '64.6', uk: 'X', kr: '23', eu: '64' },
  { size: '11.5', diameter: '21.0', circumference: '65.9', uk: 'Y', kr: '24', eu: '65.5' },
  { size: '12', diameter: '21.4', circumference: '67.2', uk: 'Z', kr: '25', eu: '66.5' }
];

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

  const [selectedSize, setSelectedSize] = useState('Medium');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideTab, setSizeGuideTab] = useState('select'); // 'select' or 'fit'
  const [ringCountry, setRingCountry] = useState('US'); // 'US', 'UK', 'KR', 'EU'

  const sizeStock = useMemo(() => {
    if (!product || !product.size_stock) return {};
    try {
      return typeof product.size_stock === 'string'
        ? JSON.parse(product.size_stock)
        : product.size_stock;
    } catch (e) {
      console.error('Error parsing size_stock:', e);
      return {};
    }
  }, [product]);

  const isSizeOutOfStock = (sz) => {
    if (!product || !product.size_stock) return false;
    return sizeStock[sz] !== undefined && Number(sizeStock[sz]) <= 0;
  };

  const availableSizes = useMemo(() => {
    if (!product) return [];
    const cat = product.category?.toLowerCase();
    if (cat !== 'bracelets' && cat !== 'rings') return [];
    if (!product.sizes) {
      return cat === 'rings'
        ? ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']
        : ['Small', 'Medium', 'Large'];
    }
    return product.sizes.split(',').map(s => s.trim()).filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (availableSizes.length > 0) {
      const cat = product?.category?.toLowerCase();
      const firstInStock = availableSizes.find(sz => !isSizeOutOfStock(sz));
      
      if (firstInStock) {
        setSelectedSize(firstInStock);
      } else {
        if (cat === 'rings') {
          setSelectedSize(availableSizes.includes('6') ? '6' : availableSizes[0]);
        } else {
          setSelectedSize(availableSizes.includes('Medium') ? 'Medium' : availableSizes[0]);
        }
      }
    }
  }, [availableSizes, product, sizeStock]);

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

              {/* ── Size & Size Guide (Bracelets & Rings Only) ── */}
              {(product.category?.toLowerCase() === 'bracelets' || product.category?.toLowerCase() === 'rings') && availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 text-xs tracking-wide">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] font-medium">
                      Size: <span className="font-light text-[var(--muted-foreground)] capitalize">{selectedSize}</span>
                    </span>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-px hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all font-medium"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {availableSizes.map((sz) => {
                      const outOfStock = isSizeOutOfStock(sz);
                      return (
                        <button
                          key={sz}
                          disabled={outOfStock}
                          onClick={() => !outOfStock && setSelectedSize(sz)}
                          className={`py-2.5 px-3 border text-[10px] uppercase tracking-[0.12em] transition-all min-w-[44px] text-center relative ${
                            outOfStock
                              ? 'border-neutral-200 text-neutral-300 opacity-40 line-through cursor-not-allowed bg-neutral-50'
                              : selectedSize === sz
                                ? 'border-[var(--foreground)] text-[var(--foreground)] bg-[#f5f4f2] font-semibold'
                                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] bg-[#faf9f7]'
                          }`}
                        >
                          {sz}
                          {outOfStock && (
                            <span className="absolute -top-1.5 -right-1 bg-neutral-900 text-white text-[7px] px-1 py-0.2 scale-75 font-normal tracking-normal rounded-sm">
                              Sold Out
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col gap-3 mb-6">
                {/* Main action buttons - side by side */}
                <div className="flex gap-3">
                  {/* Buy Now - Goes directly to checkout */}
                  <button 
                    disabled={isSizeOutOfStock(selectedSize)}
                    onClick={() => {
                      addToCart(product.id, 1, (product.category?.toLowerCase() === 'bracelets' || product.category?.toLowerCase() === 'rings') ? selectedSize : undefined);
                      navigate('/checkout');
                    }} 
                    className={`flex-1 py-3 px-4 text-[11px] uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSizeOutOfStock(selectedSize)
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
                        : 'bg-[var(--foreground)] text-white hover:opacity-80'
                    }`}
                  >
                    {!isSizeOutOfStock(selectedSize) && <ShoppingBag size={13} strokeWidth={1.5} />}
                    {isSizeOutOfStock(selectedSize) ? 'Out of Stock' : 'Buy Now'}
                  </button>

                  {/* Add to Bag - Goes to cart page */}
                  <button 
                    disabled={isSizeOutOfStock(selectedSize)}
                    onClick={() => {
                      addToCart(product.id, 1, (product.category?.toLowerCase() === 'bracelets' || product.category?.toLowerCase() === 'rings') ? selectedSize : undefined);
                      navigate('/cart');
                    }} 
                    className={`flex-1 py-3 px-4 text-[11px] uppercase tracking-[0.22em] border transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSizeOutOfStock(selectedSize)
                        ? 'border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed opacity-60'
                        : 'border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white'
                    }`}
                  >
                    {!isSizeOutOfStock(selectedSize) && <ShoppingBag size={13} strokeWidth={1.5} />}
                    {isSizeOutOfStock(selectedSize) ? 'Sold Out' : 'Add to Bag'}
                  </button>

                  {/* Wishlist */}
                  <button onClick={() => toggleWishlist(product.id)} className={`flex-1 py-3 px-4 text-[11px] uppercase tracking-[0.22em] border transition-all duration-300 flex items-center justify-center gap-2 ${wishlisted ? 'border-[var(--foreground)] text-[var(--foreground)] bg-[#f5f4f2]' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] bg-[#faf9f7]'}`}>
                    <Heart size={13} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
                    <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>

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

      {/* ── Size Guide Slide-Over Panel ── */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-xs"
              onClick={() => setIsSizeGuideOpen(false)}
            />
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] max-w-full bg-white z-[110] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                  AMEYA NEW YORK · SIZE GUIDE
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-[var(--border)] text-center text-xs tracking-wider uppercase font-medium">
                <button
                  type="button"
                  onClick={() => setSizeGuideTab('select')}
                  className={`flex-1 py-4 border-b-2 transition-all ${
                    sizeGuideTab === 'select'
                      ? 'border-[var(--foreground)] text-[var(--foreground)] font-semibold'
                      : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Select Your Size
                </button>
                <button
                  type="button"
                  onClick={() => setSizeGuideTab('fit')}
                  className={`flex-1 py-4 border-b-2 transition-all ${
                    sizeGuideTab === 'fit'
                      ? 'border-[var(--foreground)] text-[var(--foreground)] font-semibold'
                      : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Find Your Perfect Fit
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {sizeGuideTab === 'select' ? (
                  <div className="space-y-6">
                    {product.category?.toLowerCase() === 'rings' ? (
                      <>
                        <div className="flex justify-between items-center gap-4">
                          <h3 className="font-serif text-[1.4rem] text-[var(--foreground)]">Ring Sizing</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">Region:</span>
                            <select 
                              value={ringCountry} 
                              onChange={(e) => setRingCountry(e.target.value)}
                              className="bg-transparent border-b border-[var(--border)] font-medium text-[var(--foreground)] focus:outline-none uppercase text-[10px] tracking-wider py-0.5 cursor-pointer"
                            >
                              <option value="US">UNITED STATES</option>
                              <option value="UK">UNITED KINGDOM</option>
                              <option value="KR">SOUTH KOREA</option>
                              <option value="EU">GERMANY/FRANCE/ITALY</option>
                            </select>
                          </div>
                        </div>

                        {/* Measurement Table for Rings */}
                        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                          <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead className="sticky top-0 bg-white z-10">
                                <tr className="bg-neutral-50 border-b border-[var(--border)] text-[9px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                                  <th className="p-3">US Size</th>
                                  <th className="p-3">
                                    {ringCountry === 'US' && 'US Size'}
                                    {ringCountry === 'UK' && 'UK Size'}
                                    {ringCountry === 'KR' && 'KR Size'}
                                    {ringCountry === 'EU' && 'Europe Size'}
                                  </th>
                                  <th className="p-3">Diameter</th>
                                  <th className="p-3">Circumference</th>
                                  <th className="p-3 text-right pr-4">Select</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                                {ringSizingData.map((item) => {
                                  const isAvailable = availableSizes.includes(item.size) && !isSizeOutOfStock(item.size);
                                  const isSelected = selectedSize === item.size;
                                  const localSize = ringCountry === 'UK' ? item.uk : (ringCountry === 'KR' ? item.kr : (ringCountry === 'EU' ? item.eu : item.size));
                                  return (
                                    <tr 
                                      key={item.size} 
                                      className={`transition-colors ${isSelected ? 'bg-neutral-50 font-semibold' : ''} ${isAvailable ? 'hover:bg-neutral-50/50 cursor-pointer' : 'opacity-50'}`}
                                      onClick={() => {
                                        if (isAvailable) setSelectedSize(item.size);
                                      }}
                                    >
                                      <td className="p-3 font-medium">Size {item.size}</td>
                                      <td className="p-3 text-[var(--muted-foreground)]">{localSize}</td>
                                      <td className="p-3 text-[var(--muted-foreground)]">{item.diameter} mm</td>
                                      <td className="p-3 text-[var(--muted-foreground)]">{item.circumference} mm</td>
                                      <td className="p-3 text-right pr-4">
                                        {isAvailable ? (
                                          <div className="inline-flex items-center justify-center">
                                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                              isSelected ? 'border-[var(--foreground)] bg-[var(--foreground)]' : 'border-neutral-300'
                                            }`}>
                                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-[9px] text-[var(--muted-foreground)] underline cursor-not-allowed decoration-dotted">Notify me</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-serif text-[1.4rem] text-[var(--foreground)]">Bracelet Sizing</h3>
                        
                        {/* Measurement Table for Bracelets */}
                        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-neutral-50 border-b border-[var(--border)] text-[9px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                                <th className="p-3">AMEYA Size</th>
                                <th className="p-3">Wrist (Inches)</th>
                                <th className="p-3">Wrist (Centimeters)</th>
                                <th className="p-3 text-right pr-4">Selected</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                              {[
                                { name: 'Small', inches: '5.26 - 5.75 in.', cm: '13.4 - 14.6 cm' },
                                { name: 'Medium', inches: '5.76 - 6.25 in.', cm: '14.6 - 15.9 cm' },
                                { name: 'Large', inches: '6.26 - 6.75 in.', cm: '15.9 - 17.1 cm' }
                              ].map((item) => {
                                const outOfStock = isSizeOutOfStock(item.name);
                                const isSelected = selectedSize === item.name;
                                return (
                                  <tr 
                                    key={item.name} 
                                    className={`transition-colors ${outOfStock ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-50/50 cursor-pointer'} ${isSelected && !outOfStock ? 'bg-neutral-50 font-medium' : ''}`}
                                    onClick={() => !outOfStock && setSelectedSize(item.name)}
                                  >
                                    <td className="p-3.5 capitalize font-medium">
                                      {item.name}
                                      {outOfStock && <span className="ml-2 text-[9px] text-neutral-400 normal-case italic">(sold out)</span>}
                                    </td>
                                    <td className="p-3.5 text-[var(--muted-foreground)]">{item.inches}</td>
                                    <td className="p-3.5 text-[var(--muted-foreground)]">{item.cm}</td>
                                    <td className="p-3.5 text-right pr-4">
                                      {outOfStock ? (
                                        <span className="text-[9px] text-[var(--muted-foreground)] underline cursor-not-allowed decoration-dotted">Notify me</span>
                                      ) : (
                                        <div className="inline-flex items-center justify-center">
                                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                            isSelected ? 'border-[var(--foreground)] bg-[var(--foreground)]' : 'border-neutral-300'
                                          }`}>
                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {product.size_guide && (
                      <div className="bg-neutral-50 p-4 rounded-xl border border-[var(--border)] text-xs leading-relaxed text-[var(--muted-foreground)]">
                        <p className="font-medium text-[var(--foreground)] uppercase tracking-wider text-[9px] mb-1.5">Note From Atelier</p>
                        <p className="whitespace-pre-line break-words">{product.size_guide}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {product.category?.toLowerCase() === 'rings' ? (
                      <>
                        <h3 className="font-serif text-[1.4rem] text-[var(--foreground)]">Find Your Ring Size</h3>
                        
                        {/* Ring Measurement SVG Illustration */}
                        <div className="w-full aspect-[4/3] bg-neutral-50 border border-[var(--border)] rounded-2xl flex items-center justify-center p-6">
                          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-400 opacity-80">
                            {/* Finger Outline */}
                            <path d="M75 140 C 75 80, 85 45, 110 45 C 135 45, 145 80, 145 140" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            {/* Measuring Paper Strip wrapped around finger */}
                            <path d="M80 85 C 95 80, 125 80, 140 85 L 143 93 C 125 88, 95 88, 77 93 Z" fill="var(--primary)" fillOpacity="0.15" stroke="var(--primary)" strokeWidth="1.2" />
                            {/* Tape Measure ticks on the strip */}
                            <path d="M90 84 L 90 88 M100 83 L 100 87 M110 83 L 110 87 M120 83 L 120 87 M130 84 L 130 88" stroke="var(--primary)" strokeWidth="0.8" />
                            {/* Measurement line / arrow */}
                            <path d="M60 88 L 72 88 M148 88 L 160 88" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                            <text x="110" y="115" fill="var(--primary)" textAnchor="middle" className="text-[10px] font-sans font-bold tracking-wider">MEASURE FINGER</text>
                          </svg>
                        </div>

                        <p>
                          Size your rings to fit comfortably on your finger; it should be snug enough so that it will not fall off, but loose enough to slide over your knuckle.
                        </p>

                        <ol className="space-y-4 list-decimal pl-4 text-xs">
                          <li>
                            <strong>Use a strip of paper or a piece of non-stretchable string.</strong>
                          </li>
                          <li>
                            <strong>Wrap it snugly around the base of the finger you wish to measure.</strong> Mark the point on the paper or string where the ends meet. If your knuckle is significantly larger than the base of your finger, measure both and choose a size in between.
                          </li>
                          <li>
                            <strong>Measure the paper or string length in millimeters</strong> using a ruler. Compare your measurement to the Circumference (MM) column in our sizing chart to find your perfect size.
                          </li>
                        </ol>
                      </>
                    ) : (
                      <>
                        <h3 className="font-serif text-[1.4rem] text-[var(--foreground)]">Find Your Bracelet Size</h3>
                        
                        {/* Bracelet Measurement SVG Illustration */}
                        <div className="w-full aspect-[4/3] bg-neutral-50 border border-[var(--border)] rounded-2xl flex items-center justify-center p-6">
                          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-400 opacity-80">
                            <path d="M20 120 C 50 110, 80 100, 110 80 C 130 65, 150 45, 170 45 C 185 45, 195 55, 195 65 C 195 72, 185 85, 160 90 C 140 95, 110 110, 80 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            <path d="M170 45 C 160 25, 140 10, 120 12 C 105 13, 95 25, 98 38 C 100 48, 115 55, 130 52 C 145 49, 160 35, 170 45" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                            <path d="M125 70 C 115 65, 105 75, 115 85 C 125 95, 135 85, 125 70 Z" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="3 2" fill="none" />
                            <text x="110" y="105" fill="var(--primary)" className="text-[10px] font-sans font-bold tracking-wider">MEASURE WRIST</text>
                          </svg>
                        </div>

                        <p>
                          Size your cuffs and bangles to fit snugly, and your link and chain bracelets to fit slightly loosely to allow for movement.
                        </p>

                        <ol className="space-y-4 list-decimal pl-4 text-xs">
                          <li>
                            <strong>Use a flexible measuring tape or length of string.</strong>
                          </li>
                          <li>
                            <strong>Wrap it around the thickest part of the wrist (usually at the wrist joint).</strong> If using string, mark the point on the string where the ends meet with a pen. If you are creating a bracelet stack, measure the point on your arm where you'll wear each bracelet.
                          </li>
                          <li>
                            <strong>Lay the string on a flat surface and use a ruler to measure the length</strong> (in inches or centimeters) up to the mark. Compare your measurement to the size chart to determine your bracelet size. If you are between sizes, opt for the larger size.
                          </li>
                        </ol>
                      </>
                    )}

                    <div className="pt-4 border-t border-[var(--border)] space-y-3">
                      <p className="font-serif text-[1.1rem] text-[var(--foreground)]">AMEYA At Your Service</p>
                      <p>
                        There is no question too small or request too large for AMEYA client advisors. From choosing a gift to providing sizing assistance, we're always at your service.
                      </p>
                      <div className="flex gap-3 pt-2">
                        <Link to="/contact" onClick={() => setIsSizeGuideOpen(false)} className="flex-1 py-3 border border-[var(--foreground)] text-center text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white transition-all">
                          Book Sizing Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

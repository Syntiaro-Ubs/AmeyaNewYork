import { useState, useEffect, useMemo } from 'react';
import { getImageUrl } from '../utils/image';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ChevronDown, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import { useSiteData } from '../context/SiteDataContext';

const POSITIONS = ['center', 'right', 'left'];
const HERO_MEDIA_DISABLED_SLUGS = new Set(['rings', 'earrings', 'necklaces', 'bracelets']);
const getCategoryImage = (categories, slug, fallbackImage = '') =>
  categories.find(category => category.slug === slug)?.image || fallbackImage;

const getCollectionImage = (collections, slug, fallbackImage = '') =>
  collections.find(collection => collection.slug === slug)?.image || fallbackImage;

const getCollectionHoverImage = (collections, slug, fallbackImage = '') =>
  collections.find(collection => collection.slug === slug)?.hoverImage ||
  getCollectionImage(collections, slug, fallbackImage);

const EDITORIAL_API_URL = 'http://localhost:5000/api/editorial';
const BANNERS_API_URL = 'http://localhost:5000/api/banners';


/* ── Per-slug hero banner images ── */
const getBannerConfig = (slug, categories, collections, fallbackImage) => ({
  rings: {
    image: getCategoryImage(categories, 'rings', fallbackImage),
    focalPoint: 'center 40%'
  },
  earrings: {
    image: getCategoryImage(categories, 'earrings', fallbackImage),
    focalPoint: 'center 30%'
  },
  necklaces: {
    image: getCategoryImage(categories, 'necklaces', fallbackImage),
    focalPoint: 'center 25%'
  },
  bracelets: {
    image: getCategoryImage(categories, 'bracelets', fallbackImage),
    focalPoint: 'center 35%'
  },
  sets: {
    image: getCategoryImage(categories, 'sets', fallbackImage),
    focalPoint: 'center'
  },
  'new-arrivals': {
    image: getCollectionImage(collections, 'eleve', fallbackImage),
    focalPoint: 'center'
  },
  bestsellers: {
    image: getCollectionImage(collections, 'eleve', fallbackImage),
    focalPoint: 'center 30%'
  },
  'love-engagement': {
    image: getCollectionImage(collections, 'love-engagement', fallbackImage),
    focalPoint: 'center'
  }
}[slug]);

/* ══════════════════════════════════════════
   PRODUCT CARD
   Image click → opens Quick View sidebar
   Name link → navigates to PDP
   No "Add to Bag" strip (moved into sidebar)
══════════════════════════════════════════ */
function ProductCard({
  product,
  index,
  toggleWishlist,
  isInWishlist
}) {
  const {
    collections
  } = useSiteData();
  const {
    openQuickView
  } = useQuickView();
  const idValue = product.product_id || product.id;
  const wishlisted = isInWishlist(idValue);
  
  const images = useMemo(() => {
    const list = product.image ? [getImageUrl(product.image)] : [];
    if (product.gallery) {
      const gallery = typeof product.gallery === 'string' ? JSON.parse(product.gallery) : product.gallery;
      if (Array.isArray(gallery)) {
        gallery.forEach(img => list.push(getImageUrl(img)));
      }
    }
    return list;
  }, [product]);

  const collectionInfo = product.collection ? collections.find(c => c.slug === product.collection) : null;
  return <motion.div initial={{
    opacity: 0,
    y: 14
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: Math.min(index * 0.05, 0.4),
    ease: [0.25, 0.1, 0.25, 1]
  }} className="group">
      {/* Image area — click opens Quick View */}
      <div className="relative overflow-hidden bg-[#f5f4f2] aspect-[3/4] cursor-pointer" onClick={() => openQuickView(product)}>
        <img src={images[0]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Hover image - model wearing jewelry */}
        {images[1] && <img src={images[1]} alt={`${product.name} worn`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

        {/* Wishlist heart — stops propagation so it doesn't open quick view */}
        <button onClick={e => {
        e.stopPropagation();
        toggleWishlist(idValue);
      }} className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 ${wishlisted ? 'opacity-100 text-[var(--primary)]' : 'opacity-0 group-hover:opacity-100 text-[var(--foreground)] hover:text-[var(--primary)]'}`} aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}>
          <Heart size={18} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* "Quick View" strip — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="w-full bg-white/95 backdrop-blur-sm text-[var(--foreground)] py-3 text-[10px] uppercase tracking-[0.22em] flex items-center justify-center gap-2 border-t border-[var(--border)]">
            Quick View
          </div>
        </div>
      </div>

      {/* Text below */}
      <div className="pt-4 text-center px-1">
        {collectionInfo && <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-foreground)] mb-1.5">
            {collectionInfo.name}
          </p>}
        <Link to={`/product/${idValue}`} className="block font-serif text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-200 leading-snug mb-2">
          {product.name}
        </Link>
        <p className="text-[var(--muted-foreground)] text-sm">${product.price.toLocaleString()}</p>
      </div>
    </motion.div>;
}

/* ══════════════════════════════════════════
   EDITORIAL CARD (slots into grid as 1 column)
   Matches Tiffany reference: lifestyle photo +
   "SHOP THE LOOK" badge at bottom-left
══════════════════════════════════════════ */
function EditorialCard({
  image,
  collectionLabel,
  href,
  animIndex
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 14
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.55,
    delay: Math.min(animIndex * 0.05, 0.4),
    ease: [0.25, 0.1, 0.25, 1]
  }} className="relative overflow-hidden aspect-[3/4] group cursor-pointer">
      <Link to={href} className="absolute inset-0 z-0" aria-label="Shop the Look" />
      {/* Lifestyle image */}
      <img src={image} alt="Shop the Look" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      {/* Subtle dark gradient at bottom for button legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {/* Collection label top-left */}
      <div className="absolute top-5 left-5 z-10">
        <p className="text-white text-[9px] uppercase tracking-[0.28em] opacity-80">{collectionLabel}</p>
      </div>
      {/* SHOP THE LOOK badge — bottom-left, exactly like Tiffany reference */}
      <div className="absolute bottom-5 left-5 z-10">
        <Link to={href} className="inline-flex items-center gap-2 bg-white text-[var(--foreground)] text-[10px] uppercase tracking-[0.22em] px-4 py-2.5 hover:bg-[var(--primary)] hover:text-white transition-all duration-200 shadow-sm" onClick={e => e.stopPropagation()}>
          Shop the Look <ArrowRight size={11} strokeWidth={1.8} />
        </Link>
      </div>
    </motion.div>;
}

/* ══════════════════════════════════════════
   SHOP THE LOOK ROW
   3 columns: editorial image + 2 products
   Position controls which col the editorial sits in
══════════════════════════════════════════ */
function ShopTheLookRow({
  product1,
  product2,
  editorialImage,
  editorialHref,
  collectionLabel,
  position,
  baseIndex,
  addToCart,
  toggleWishlist,
  isInWishlist
}) {
  const editorial = <EditorialCard image={editorialImage} collectionLabel={collectionLabel} href={editorialHref} animIndex={baseIndex} />;
  const p1 = product1 ? <ProductCard product={product1} index={baseIndex + 1} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} /> : <div className="aspect-[3/4]" />;
  const p2 = product2 ? <ProductCard product={product2} index={baseIndex + 2} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} /> : <div className="aspect-[3/4]" />;
  const cols = position === 'left' ? [editorial, p1, p2] : position === 'center' ? [p1, editorial, p2] : [p1, p2, editorial];
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
      {cols.map((el, i) => <div key={i}>{el}</div>)}
    </div>;
}

/* ── Accordion Filter Section ── */
function FilterSection({
  title,
  isOpen,
  onToggle,
  children
}) {
  return <div className="border-b border-[var(--border)]">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-5 text-[12px] uppercase tracking-[0.16em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
        {title}
        <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && <motion.div initial={{
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
            <div className="pb-5 flex flex-col gap-1">{children}</div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}
function FilterOption({
  label,
  isSelected,
  onClick,
  count
}) {
  return <button onClick={onClick} className={`group/opt flex items-center justify-between py-1.5 text-[13px] tracking-wide transition-colors text-left ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
      <div className="flex items-center gap-3">
        <span className={`w-[15px] h-[15px] border flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border)] group-hover/opt:border-[var(--foreground)]'}`}>
          {isSelected && <motion.svg initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4.2 7.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>}
        </span>
        {label}
      </div>
      {count !== undefined && <span className="text-[11px] text-[var(--muted-foreground)]">({count})</span>}
    </button>;
}

/* ══════════════════════════════════════════
   MAIN CATEGORY PAGE
══════════════════════════════════════════ */
export function Category() {
  const {
    slug
  } = useParams();
  const {
    categories,
    collections,
    loading: siteDataLoading
  } = useSiteData();
  /* ── Call context hooks here (top-level) so they are always inside CartProvider/WishlistProvider ── */
  const {
    addToCart
  } = useCart();
  const {
    toggleWishlist,
    isInWishlist
  } = useWishlist();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [openSections, setOpenSections] = useState({
    material: true,
    collection: true,
    category: true
  });
  const [editorialCards, setEditorialCards] = useState([]);
  const [dynamicBanner, setDynamicBanner] = useState(null);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSection = key => setOpenSections(prev => ({
    ...prev,
    [key]: !prev[key]
  }));

  useEffect(() => {
    setSelectedCategories([]);
    setSelectedCollections([]);
    setSelectedMaterials([]);
    setSortBy('recommended');
    setShowFilterSidebar(false);
    setBannerLoaded(false);
    
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEditorial(),
        fetchDynamicBanner(),
        fetchProducts()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, [slug]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setLiveProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setLiveProducts([]);
    }
  };

  const fetchDynamicBanner = async () => {
    try {
      const response = await fetch(`${BANNERS_API_URL}/${slug}`);
      const data = await response.json();
      setDynamicBanner(data);
    } catch (error) {
      console.error('Failed to fetch banner', error);
    }
  };

  const fetchEditorial = async () => {
    try {
      const response = await fetch(`${EDITORIAL_API_URL}/${slug}`);
      const data = await response.json();
      setEditorialCards(data);
    } catch (error) {
      console.error('Failed to fetch editorial cards', error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showFilterSidebar ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFilterSidebar]);

  /* ── Determine page content ── */
  let title = '';
  let description = '';
  let collectionHref = '/';
  let baseProducts = [];
  let pageCollectionImage = null;
  let pageCollectionHoverImage = null;
  let pageCollectionLabel = 'AMEYA New York';
  if (slug === 'new-arrivals') {
    title = 'Experience Luxury Like Never Before';
    description = 'Discover our latest creations, fresh from the atelier. Each piece crafted with precision and passion.';
    baseProducts = liveProducts;
  } else if (slug === 'bestsellers') {
    title = 'Bestsellers';
    description = 'Our most coveted pieces, loved by you.';
    baseProducts = liveProducts.filter(p => p.featured);
  } else {
    const category = categories.find(c => c.slug === slug);
    if (category) {
      title = category.name;
      description = `Explore our exquisite collection of ${category.name.toLowerCase()}.`;
      baseProducts = liveProducts.filter(p => p.category?.toLowerCase() === category.slug.toLowerCase() || p.category?.toLowerCase() === category.name.toLowerCase());
      pageCollectionImage = category.image;
      pageCollectionHoverImage = category.image;
      pageCollectionLabel = category.name;
      collectionHref = `/category/${category.slug}`;
    } else {
      const collection = collections.find(c => c.slug === slug);
      if (collection) {
        title = collection.name;
        description = collection.description;
        baseProducts = liveProducts.filter(p => p.collection?.toLowerCase() === collection.slug.toLowerCase());
        pageCollectionImage = collection.image;
        pageCollectionHoverImage = collection.hoverImage || collection.image;
        pageCollectionLabel = collection.name;
        collectionHref = `/collection/${slug}`;
      } else {
        title = 'Collection Not Found';
        description = 'The collection you are looking for does not exist.';
      }
    }
  }

  /* ── Resolve hero banner image ── */
  const FALLBACK_IMAGE = collections[0]?.image || categories[0]?.image || '';
  const BANNER_IMAGES = getBannerConfig(slug, categories, collections, FALLBACK_IMAGE);
  const bannerCfg = BANNER_IMAGES;
  // For collection slugs, prefer the Unsplash banner if configured,
  // else fall back to the imported collection image from data.js
  const heroBannerImage = bannerCfg?.image ?? pageCollectionImage ?? null;
  const heroBannerFocal = bannerCfg?.focalPoint ?? 'center 40%';

  /* ── Material extraction ── */
  const dynamicMaterials = useMemo(() => {
    const materialMap = new Map();
    baseProducts.forEach(product => {
      if (!product.material) return;
      const parts = product.material.split(',').map(m => m.trim().toLowerCase());
      parts.forEach(part => {
        let normalized = part;
        if (part.includes('18k') && part.includes('white')) normalized = '18k White Gold';else if (part.includes('18k') && part.includes('yellow')) normalized = '18k Yellow Gold';else if (part.includes('18k') && part.includes('rose')) normalized = '18k Rose Gold';else if (part.includes('18k gold') || part === '18k gold') normalized = '18k Gold';else if (part.includes('platinum')) normalized = 'Platinum';else if (part.includes('sterling silver')) normalized = 'Sterling Silver';else if (part.includes('diamond')) normalized = 'Diamonds';else if (part.includes('emerald')) normalized = 'Emeralds';else if (part.includes('sapphire')) normalized = 'Sapphires';else if (part.includes('ruby') || part.includes('rubies')) normalized = 'Rubies';else if (part.includes('pearl')) normalized = 'Pearls';else normalized = part.charAt(0).toUpperCase() + part.slice(1);
        materialMap.set(normalized, (materialMap.get(normalized) || 0) + 1);
      });
    });
    return Array.from(materialMap.entries()).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({
      label,
      value: label,
      count
    }));
  }, [baseProducts]);

  /* ── Filter + Sort ── */
  const sortOptions = [{
    label: 'Recommended',
    value: 'recommended'
  }, {
    label: 'Price: Low to High',
    value: 'price-asc'
  }, {
    label: 'Price: High to Low',
    value: 'price-desc'
  }, {
    label: 'Newest',
    value: 'newest'
  }];

  /* ── Filter + Sort ── */
  const filteredProducts = baseProducts.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.some(cat => product.category?.toLowerCase() === cat.toLowerCase())) return false;
    if (selectedCollections.length > 0 && !selectedCollections.some(col => product.collection?.toLowerCase() === col.toLowerCase())) return false;
    if (selectedMaterials.length > 0 && !selectedMaterials.some(mat => (product.material || '').toLowerCase().includes(mat.toLowerCase()))) return false;
    return true;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return 0;
    }
  });
  const hasActiveFilters = !!(selectedCategories.length || selectedCollections.length || selectedMaterials.length);
  const activeCount = selectedCategories.length + selectedCollections.length + selectedMaterials.length;
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedCollections([]);
    setSelectedMaterials([]);
  };

  /* ── Category/Collection counts ── */
  const categoryCounts = useMemo(() => {
    const map = new Map();
    baseProducts.forEach(p => map.set(p.category, (map.get(p.category) || 0) + 1));
    return map;
  }, [baseProducts]);
  const collectionCounts = useMemo(() => {
    const map = new Map();
    baseProducts.forEach(p => {
      if (p.collection) map.set(p.collection, (map.get(p.collection) || 0) + 1);
    });
    return map;
  }, [baseProducts]);

  /*
   * ── Build rendering segments ──
   *
   * Pattern per cycle (8 products consumed):
   *   Segment A: 8 products → normal 4-col grid (2 rows)
   *   Segment B: 3 items in a 3-col row where 1 col = editorial card,
   *              2 cols = next 2 products from sortedProducts
   *
   * Editorial position cycles: center → right → left
   */
  const segments = useMemo(() => {
    const result = [];
    let cursor = 0;
    let editorialCount = 0;
    while (cursor < sortedProducts.length) {
      // Normal block: up to 6 products (2 rows of 3)
      const normalChunk = sortedProducts.slice(cursor, cursor + 6);
      const startIndex = cursor;
      cursor += normalChunk.length;
      if (normalChunk.length > 0) {
        result.push({
          type: 'normal',
          items: normalChunk,
          startIndex
        });
      }

      // Shop-the-look row: takes next 2 products
      if (cursor < sortedProducts.length && editorialCards.length > 0) {
        const p1 = sortedProducts[cursor];
        const p2 = sortedProducts[cursor + 1];
        const shopStart = cursor;
        cursor += p1 ? 1 : 0;
        cursor += p2 ? 1 : 0;

        // Choose editorial image from dynamic cards
        const card = editorialCards[editorialCount % editorialCards.length];
        const editorialImg = card ? `http://localhost:5000${card.image_url}` : pageCollectionHoverImage;
        
        result.push({
          type: 'shoprow',
          p1,
          p2,
          position: POSITIONS[editorialCount % POSITIONS.length],
          editorialImg,
          startIndex: shopStart,
          addToCart,
          toggleWishlist,
          isInWishlist
        });
        editorialCount++;
      } else if (cursor < sortedProducts.length && editorialCards.length === 0) {
        // Carry on with normal rows if no editorial cards exist
        const extraNormal = sortedProducts.slice(cursor, cursor + 3);
        const extraStart = cursor;
        cursor += extraNormal.length;
        if (extraNormal.length > 0) {
          result.push({
            type: 'normal',
            items: extraNormal,
            startIndex: extraStart
          });
        }
      }
    }
    return result;
  }, [sortedProducts, pageCollectionImage, pageCollectionHoverImage, editorialCards, addToCart, toggleWishlist, isInWishlist]);

  /* ── Sidebar content ── */
  const sidebarContent = <>
      <FilterSection title="Material" isOpen={!!openSections.material} onToggle={() => toggleSection('material')}>
        <FilterOption label="All" isSelected={selectedMaterials.length === 0} onClick={() => setSelectedMaterials([])} />
        {dynamicMaterials.map(mat => <FilterOption key={mat.value} label={mat.label} isSelected={selectedMaterials.includes(mat.value)} onClick={() => setSelectedMaterials(prev => prev.includes(mat.value) ? prev.filter(m => m !== mat.value) : [...prev, mat.value])} count={mat.count} />)}
      </FilterSection>
      <FilterSection title="Collection" isOpen={!!openSections.collection} onToggle={() => toggleSection('collection')}>
        <FilterOption label="All" isSelected={selectedCollections.length === 0} onClick={() => setSelectedCollections([])} />
        {collections.map(col => <FilterOption key={col.id} label={col.name} isSelected={selectedCollections.includes(col.slug)} onClick={() => setSelectedCollections(prev => prev.includes(col.slug) ? prev.filter(c => c !== col.slug) : [...prev, col.slug])} count={collectionCounts.get(col.slug)} />)}
      </FilterSection>
      <FilterSection title="Category" isOpen={!!openSections.category} onToggle={() => toggleSection('category')}>
        <FilterOption label="All" isSelected={selectedCategories.length === 0} onClick={() => setSelectedCategories([])} />
        {categories.map(cat => <FilterOption key={cat.id} label={cat.name} isSelected={selectedCategories.includes(cat.name)} onClick={() => setSelectedCategories(prev => prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name])} count={categoryCounts.get(cat.name)} />)}
      </FilterSection>
      {hasActiveFilters && <button onClick={clearAllFilters} className="mt-6 text-[12px] text-[var(--muted-foreground)] hover:text-[var(--primary)] tracking-[0.12em] uppercase underline underline-offset-4 transition-colors self-start">
          Clear all filters
        </button>}
    </>;
  return <div className="min-h-screen bg-[var(--background)]">

      {/* ══════════════════════════════════════
          HERO BANNER - FIXED VIDEO BACKGROUND
       ══════════════════════════════════════ */}
      <div className="relative">
        {/* Fixed Background */}
        <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0 bg-neutral-900">
          {dynamicBanner ? (
            dynamicBanner.media_type === 'video' ? (
              <>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: dynamicBanner.focal_point || 'center' }}
                  onLoadedData={() => setBannerLoaded(true)}
                  src={getImageUrl(dynamicBanner.media_url)}
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-700" style={{ opacity: bannerLoaded ? 1 : 0 }} />
              </>
            ) : (
              <img
                src={getImageUrl(dynamicBanner.media_url)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${bannerLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ objectPosition: dynamicBanner.focal_point || 'center' }}
                onLoad={() => setBannerLoaded(true)}
                alt="Banner"
              />
            )
          ) : (
            /* No banner uploaded - show elegant dark gradient */
            <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e0e] via-[#1c1c1c] to-[#0e0e0e]" />
          )}
        </div>

        {/* Spacer for hero height */}
        <div className="h-screen relative z-10">
          {/* Breadcrumb — top-left */}
          <div className="absolute top-0 left-0 right-0 pt-24 px-6 md:px-10 lg:px-16 z-20">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="opacity-40">/</span>
              <span className="text-white">{title}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FILTER TOOLBAR + PRODUCTS
       ══════════════════════════════════════ */}
      <div className="relative z-30 bg-[var(--background)] rounded-t-3xl shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-12 pb-20">

        {baseProducts.length > 0 && <>
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between py-4 border-y border-[var(--border)] mb-12">
              {/* Sort dropdown */}
              <div className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                  <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSortDropdown && <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowSortDropdown(false)} />
                      <motion.div initial={{
                  opacity: 0,
                  y: 4
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: 4
                }} transition={{
                  duration: 0.12
                }} className="absolute left-0 top-full mt-2 bg-white border border-[var(--border)] shadow-md z-30 min-w-[200px]">
                        {sortOptions.map(opt => <button key={opt.value} onClick={() => {
                    setSortBy(opt.value);
                    setShowSortDropdown(false);
                  }} className={`block w-full text-left px-5 py-3 text-[12px] tracking-wide transition-colors ${sortBy === opt.value ? 'text-[var(--primary)]' : 'text-[var(--foreground)] hover:text-[var(--primary)]'}`}>
                            {opt.label}
                          </button>)}
                      </motion.div>
                    </>}
                </AnimatePresence>
              </div>

              <span className="text-[11px] text-[var(--muted-foreground)] tracking-[0.14em] uppercase hidden sm:block">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'Item' : 'Items'}
              </span>

              <button onClick={() => setShowFilterSidebar(true)} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                <SlidersHorizontal size={14} strokeWidth={1.5} />
                Filter
                {activeCount > 0 && <span className="w-4 h-4 flex items-center justify-center bg-[var(--primary)] text-white text-[9px] rounded-full">
                    {activeCount}
                  </span>}
              </button>
            </div>

            {/* ── Active filter chips ── */}
            {hasActiveFilters && <div className="flex flex-wrap items-center gap-2 mb-10">
                {selectedMaterials.map(mat => <button key={mat} onClick={() => setSelectedMaterials(prev => prev.filter(m => m !== mat))} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                    {mat} <X size={9} />
                  </button>)}
                {selectedCollections.map(col => <button key={col} onClick={() => setSelectedCollections(prev => prev.filter(c => c !== col))} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                    {collections.find(c => c.slug === col)?.name || col} <X size={9} />
                  </button>)}
                {selectedCategories.map(cat => <button key={cat} onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                    {cat} <X size={9} />
                  </button>)}
                <button onClick={clearAllFilters} className="text-[10px] text-[var(--muted-foreground)] hover:text-[var(--primary)] tracking-wide underline underline-offset-4 transition-colors ml-2">
                  Clear all
                </button>
              </div>}
          </>}

        {/* ══════════════════════════════════════
            PRODUCT + EDITORIAL SEGMENTS
         ══════════════════════════════════════ */}
        {sortedProducts.length > 0 ? <div id="products-section" className="space-y-14">
            {segments.map((seg, si) => {
          if (seg.type === 'normal') {
            return <div key={`normal-${si}`} className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                    {seg.items.map((product, i) => <ProductCard key={product.id} product={product} index={seg.startIndex + i} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />)}
                  </div>;
          }

          /* shop-the-look row */
          return <ShopTheLookRow key={`shop-${si}`} product1={seg.p1} product2={seg.p2} editorialImage={seg.editorialImg} editorialHref={collectionHref} collectionLabel={pageCollectionLabel} position={seg.position} baseIndex={seg.startIndex} addToCart={addToCart} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />;
        })}
          </div> : baseProducts.length > 0 ? (/* No results after filtering */
      <div className="text-center py-24 flex flex-col items-center gap-6">
            <p className="text-[var(--muted-foreground)]">No products match your filters.</p>
            <button onClick={clearAllFilters} className="px-8 py-3 border border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white transition-all text-[11px] uppercase tracking-[0.18em]">
              Clear Filters
            </button>
          </div>) : (/* Empty page */
      <div className="text-center py-24 flex flex-col items-center gap-6">
            <p className="text-[var(--muted-foreground)]">No products found in this collection.</p>
            <Link to="/" className="px-8 py-3 border border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white transition-all text-[11px] uppercase tracking-[0.18em]">
              Return to Home
            </Link>
          </div>)}
      </div>

      {/* ── Filter Sidebar ── */}
      <AnimatePresence>
        {showFilterSidebar && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.25
        }} className="fixed inset-0 bg-black/25 z-50" onClick={() => setShowFilterSidebar(false)} />
            <motion.div initial={{
          x: '100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '100%'
        }} transition={{
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1]
        }} className="fixed right-0 top-0 bottom-0 w-[320px] max-w-[90vw] bg-[var(--background)] z-50 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground)]">Filter</span>
                <button onClick={() => setShowFilterSidebar(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  <X size={17} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-2">{sidebarContent}</div>
              <div className="px-8 py-5 border-t border-[var(--border)]">
                <button onClick={() => setShowFilterSidebar(false)} className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] text-[11px] uppercase tracking-[0.22em] hover:opacity-80 transition-opacity">
                  View {sortedProducts.length} {sortedProducts.length === 1 ? 'Item' : 'Items'}
                </button>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
      </div>
    </div>
}

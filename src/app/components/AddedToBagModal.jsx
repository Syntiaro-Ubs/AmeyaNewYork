import { useEffect, useMemo, useState } from 'react';
import { getImageUrl } from '../utils/image';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
export function AddedToBagModal() {
  const {
    isAddedModalOpen,
    lastAddedProductId,
    closeAddedModal,
    cartCount
  } = useCart();
  const navigate = useNavigate();
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    if (isAddedModalOpen) {
      const fetchAllProducts = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products');
          const data = await response.json();
          setLiveProducts(data);
        } catch (err) {
          console.error('Error fetching modal products:', err);
          setLiveProducts([]);
        }
      };
      fetchAllProducts();
    }
  }, [isAddedModalOpen]);

  const product = useMemo(() => {
    return liveProducts.find(p => String(p.id) === String(lastAddedProductId) || String(p.product_id) === String(lastAddedProductId)) ?? null;
  }, [lastAddedProductId, liveProducts]);

  const suggestions = useMemo(() => {
    if (!product) return [];
    return liveProducts.filter(p => (String(p.id) !== String(product.id)) && (p.collection === product.collection || p.category === product.category)).slice(0, 4);
  }, [product, liveProducts]);

  useEffect(() => {
    document.body.style.overflow = isAddedModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddedModalOpen]);
  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') closeAddedModal();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [closeAddedModal]);
  const handleViewBag = () => {
    closeAddedModal();
    navigate('/cart');
  };
  const handleCheckout = () => {
    closeAddedModal();
    navigate('/cart');
  };
  return <AnimatePresence>
      {isAddedModalOpen && product && <>
          <motion.div key="atb-backdrop" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.25
      }} className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" onClick={closeAddedModal} />

          <motion.div key="atb-panel" initial={{
        opacity: 0,
        y: 32
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 20
      }} transition={{
        duration: 0.38,
        ease: [0.25, 0.1, 0.25, 1]
      }} className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden pointer-events-auto" style={{
          maxHeight: '92vh'
        }} onClick={e => e.stopPropagation()}>
              <button onClick={closeAddedModal} className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[#f5f3ef] transition-colors" aria-label="Close">
                <X size={18} strokeWidth={1.5} />
              </button>

              <div className="overflow-y-auto" style={{
            maxHeight: '92vh'
          }}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] min-h-0">

                  {/* Left — selection */}
                  <div className="flex flex-col bg-[#faf9f7] px-8 py-10 md:px-10 md:py-14 border-r border-[#ede9e3]">
                    <div className="flex items-center gap-2.5 mb-8">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                        <Check size={11} strokeWidth={2.5} className="text-white" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--foreground)]">
                        Added to Your Bag
                      </span>
                    </div>

                    <div className="h-px bg-[#e8e4de] mb-8" />

                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted-foreground)] mb-6">
                      Your Selection
                    </p>

                    <div className="flex gap-5 mb-8">
                      <div className="w-[100px] h-[120px] flex-shrink-0 bg-white overflow-hidden border border-[#e8e4de]">
                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <h3 className="font-serif text-[var(--foreground)] leading-snug text-base mb-1.5">
                            {product.name}
                          </h3>
                          {product.material && <p className="text-[11px] text-[var(--muted-foreground)] font-light leading-relaxed mb-2">
                              {product.material.split(',')[0].trim()}
                            </p>}
                        </div>
                        <p className="text-[var(--foreground)] text-sm">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--muted-foreground)] mb-6">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag
                    </p>

                    <div className="space-y-3 mt-auto">
                      <button onClick={handleCheckout} className="w-full py-4 bg-[var(--foreground)] text-white text-[11px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                        <ShoppingBag size={13} strokeWidth={1.5} />
                        Proceed to Checkout
                      </button>
                      <button onClick={handleViewBag} className="w-full py-4 border border-[var(--foreground)] text-[var(--foreground)] text-[11px] uppercase tracking-[0.24em] hover:bg-[#f5f4f2] transition-colors flex items-center justify-center gap-2">
                        View Shopping Bag
                        <ArrowRight size={12} strokeWidth={1.5} />
                      </button>
                      <button onClick={closeAddedModal} className="w-full py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                        Continue Shopping
                      </button>
                    </div>
                  </div>

                  {/* Right — suggestions */}
                  <div className="flex flex-col px-8 py-10 md:px-10 md:py-14">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted-foreground)] mb-1">
                      You May Also Like
                    </p>
                    <h2 className="font-serif text-xl text-[var(--foreground)] mb-8">
                      Complete Your Look
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      {suggestions.map(item => <SuggestionCard key={item.id} product={item} onClose={closeAddedModal} getImageUrl={getImageUrl} />)}
                    </div>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="border-t border-[#ede9e3] bg-[#faf9f7] px-8 py-4 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Complimentary shipping & returns · Signature gift packaging
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}
function SuggestionCard({
  product,
  onClose,
  getImageUrl
}) {
  const {
    addToCart
  } = useCart();
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3,
    delay: 0.1
  }} className="group flex flex-col">
      <Link to={`/product/${product.product_id || product.id}`} onClick={onClose} className="block relative aspect-[4/5] bg-[#f5f4f0] overflow-hidden mb-3">
        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product.product_id || product.id, 1);
        }} className="w-full py-2.5 bg-[var(--foreground)] text-white text-[10px] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
            Add to Bag
          </button>
        </div>
      </Link>

      <Link to={`/product/${product.product_id || product.id}`} onClick={onClose} className="font-serif text-[var(--foreground)] text-sm leading-snug hover:text-[var(--primary)] transition-colors mb-1">
        {product.name}
      </Link>

      {product.material && <p className="text-[10px] text-[var(--muted-foreground)] font-light mb-1.5 leading-relaxed">
          {product.material.split(',')[0].trim()}
        </p>}

      <p className="text-[var(--foreground)] text-sm">
        ${product.price.toLocaleString()}
      </p>
    </motion.div>;
}

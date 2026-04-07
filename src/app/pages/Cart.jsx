import { useState, useEffect, useMemo } from 'react';
import { getImageUrl } from '../utils/image';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import 'sonner';
import { products } from '../data';
import { useCart } from '../context/CartContext';
export function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart
  } = useCart();
  const [isUpdating, setIsUpdating] = useState(null);
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setLiveProducts(data);
      } catch (err) {
        console.error('Error fetching cart products:', err);
        setLiveProducts(products); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Derive full product details for cart items
  const cartProducts = useMemo(() => {
    return cartItems.map(item => {
      const product = liveProducts.find(p => String(p.id) === String(item.productId) || String(p.product_id) === String(item.productId));
      return {
        ...item,
        product
      };
    }).filter(item => item.product !== undefined);
  }, [cartItems, liveProducts]);

  const subtotal = cartProducts.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
  const shipping = 0; // Free shipping for luxury items usually
  const tax = subtotal * 0.08875; // NYC Sales Tax approx
  const total = subtotal + tax + shipping;
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(id);

    // Simulate API delay slightly for UX
    setTimeout(() => {
      updateQuantity(id, newQuantity);
      setIsUpdating(null);
    }, 200);
  };
  const handleRemoveItem = id => {
    removeFromCart(id);
  };
  if (cartItems.length === 0) {
    return <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] mb-4">Your Shopping Bag is Empty</h1>
          <p className="text-[var(--muted-foreground)] mb-8 font-light max-w-md mx-auto">
            Explore our collections and find the perfect piece to add to your treasury.
          </p>
          <Link to="/category/new-arrivals" className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-medium rounded-sm">
            Start Shopping
          </Link>
        </motion.div>
      </div>;
  }
  return <div className="bg-[var(--background)] min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h1 initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="font-serif text-3xl md:text-4xl text-[var(--foreground)] mb-10 text-center md:text-left">
          Shopping Bag <span className="text-[var(--muted-foreground)] text-lg font-sans font-light">({cartItems.length} items)</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          {/* Cart Items Column */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <AnimatePresence>
                {cartProducts.map(item => <motion.div key={item.id} layout initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0
              }} transition={{
                duration: 0.4
              }} className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-[var(--card)] p-6 border border-[var(--border)] rounded-sm relative">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 md:h-40 bg-[var(--secondary)] flex-shrink-0 overflow-hidden rounded-sm">
                      <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-xl text-[var(--foreground)] pr-8">
                            <Link to={`/product/${item.product.product_id || item.product.id}`} className="hover:text-[var(--primary)] transition-colors">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="font-medium text-[var(--foreground)] whitespace-nowrap">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-1">{item.product.category}</p>
                        {item.size && <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Size: {item.size}</p>}
                      </div>

                      <div className="flex justify-between items-end mt-4 sm:mt-0">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-[var(--card)] rounded-sm overflow-hidden">
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating === item.id} className="p-2 hover:bg-[var(--primary)] hover:text-white active:bg-[var(--primary)] active:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit" style={{
                        WebkitTapHighlightColor: 'transparent'
                      }}>
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium border-x border-[var(--card)]">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={isUpdating === item.id} className="p-2 hover:bg-[var(--primary)] hover:text-white active:bg-[var(--primary)] active:text-white transition-colors" style={{
                        WebkitTapHighlightColor: 'transparent'
                      }}>
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button onClick={() => handleRemoveItem(item.id)} className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors text-sm flex items-center gap-1 group">
                          <Trash2 size={16} className="group-hover:stroke-red-500" />
                          <span className="hidden sm:inline text-xs uppercase tracking-wide">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center text-sm text-[var(--muted-foreground)]">
               <div className="flex items-center gap-2 mb-4 md:mb-0">
                 <ShieldCheck className="text-[var(--primary)]" size={18} />
                 <span>Secure Shopping Guarantee</span>
               </div>
               <Link to="/category/new-arrivals" className="text-[var(--primary)] hover:underline flex items-center gap-1 font-medium">
                 Continue Shopping <ArrowRight size={14} />
               </Link>
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[var(--card)] p-6 md:p-8 border border-[var(--border)] rounded-sm sticky top-32">
              <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Shipping</span>
                  <span className="text-[var(--primary)] font-medium">Free</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Estimated Tax</span>
                  <span>${tax.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-serif text-xl text-[var(--foreground)]">Total</span>
                  <span className="font-serif text-2xl text-[var(--foreground)] font-medium">${total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              </div>

              <button className="w-full bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white py-3 px-8 transition-all duration-300 uppercase tracking-widest text-xs font-medium flex items-center justify-center space-x-2 shadow-sm hover:shadow-md mb-4" onClick={() => navigate('/checkout')}>
                <Lock size={14} />
                <span>Secure Checkout</span>
              </button>
              
              <div className="text-center">
                <p className="text-xs text-[var(--muted-foreground)] mt-4">
                  Complimentary shipping & returns on all orders.
                </p>
                <div className="flex justify-center gap-2 mt-4 opacity-50 grayscale">
                   {/* Payment icons placeholder */}
                   <div className="h-6 w-10 bg-gray-200 rounded"></div>
                   <div className="h-6 w-10 bg-gray-200 rounded"></div>
                   <div className="h-6 w-10 bg-gray-200 rounded"></div>
                   <div className="h-6 w-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}

import { useState, useEffect, useMemo, useRef } from 'react';
import { getImageUrl } from '../utils/image';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight, Lock, ShieldCheck, Check, Package, CreditCard, Truck, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { resolveProductByIdentifier } from '../utils/product';
import { toast } from 'sonner';

// ─── Types ─────────────────────────────────────────────────────────────────

const STEPS = [{
  key: 'contact',
  label: 'Shipping'
}, {
  key: 'payment',
  label: 'Payment'
}, {
  key: 'confirmation',
  label: 'Confirmation'
}];
const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
function formatCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function maskCard(n) {
  const raw = n.replace(/\s/g, '');
  return `•••• •••• •••• ${raw.slice(-4)}`;
}
export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    clearCart
  } = useCart();
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setLiveProducts(data);
      } catch (err) {
        console.error('Error fetching checkout products:', err);
        setLiveProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const cartProducts = useMemo(() => {
    return cartItems.map(item => ({
      ...item,
      product: resolveProductByIdentifier(liveProducts, item.productId)
    })).filter(i => i.product);
  }, [cartItems, liveProducts]);

  const subtotal = cartProducts.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.08875;
  const total = subtotal + tax;
  const [step, setStep] = useState('contact');
  const [orderNum] = useState(() => `AMY-${Date.now().toString().slice(-7)}`);
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apt: '',
    city: '',
    state: 'NY',
    zip: '',
    country: 'United States'
  });
  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: 'NY',
    billingZip: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedShipping, setSelectedShipping] = useState('standard');

  // ── Validation ──────────────────────────────────────────────────────────
  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = 'Required';
    if (!shipping.lastName.trim()) e.lastName = 'Required';
    if (!shipping.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!shipping.phone.replace(/\D/g, '').match(/^\d{10}$/)) e.phone = '10-digit number required';
    if (!shipping.address.trim()) e.address = 'Required';
    if (!shipping.city.trim()) e.city = 'Required';
    if (!shipping.zip.match(/^\d{5}(-\d{4})?$/)) e.zip = 'Valid ZIP required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validatePayment = () => {
    const e = {};
    if (!payment.cardName.trim()) e.cardName = 'Required';
    if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Valid 16-digit card required';
    if (!payment.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) e.expiry = 'MM/YY format required';
    if (!payment.cvv.match(/^\d{3,4}$/)) e.cvv = '3–4 digits required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const { addOrder } = useOrders();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  const addOrderRef = useRef(addOrder);
  const clearCartRef = useRef(clearCart);

  useEffect(() => {
    addOrderRef.current = addOrder;
  }, [addOrder]);

  useEffect(() => {
    clearCartRef.current = clearCart;
  }, [clearCart]);

  // Redirect to cart if empty (and not verifying)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const txnId = query.get('txnId');
    if (txnId || isVerifying) return;

    if (cartItems.length === 0 && step !== 'confirmation') {
      navigate('/cart');
    }
  }, [cartItems, isVerifying, step]);

  // Monitor redirects back from PhonePe PG UAT
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const txnId = query.get('txnId');

    if (txnId) {
      setIsVerifying(true);
      setVerificationError(null);

      async function verifyPayment() {
        try {
          const res = await fetch('http://localhost:5000/api/payment/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId: txnId })
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Payment status check failed.');
          }

          const data = await res.json();
          if (data.paymentStatus === 'PAYMENT_SUCCESS') {
            const cachedString = sessionStorage.getItem('ameya_checkout_cache');
            if (cachedString) {
              const cachedData = JSON.parse(cachedString);
              if (cachedData.transactionId === txnId) {
                // Place order ONLY upon successful verification
                addOrderRef.current({
                  items: cachedData.items,
                  total: cachedData.total,
                  shippingAddress: cachedData.shippingAddress,
                  paymentMethod: 'PhonePe Standard Gateway',
                  transactionId: txnId,
                  userId: cachedData.userId
                });

                // Decrement stock in database
                try {
                  await fetch('http://localhost:5000/api/products/decrement-stock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cachedData.items })
                  });
                } catch (stockErr) {
                  console.error('Failed to decrement stock:', stockErr);
                }

                clearCartRef.current?.();
                sessionStorage.removeItem('ameya_checkout_cache');
                setStep('confirmation');
                toast.success('Payment completed successfully!');
              } else {
                throw new Error('Transaction ID context mismatch.');
              }
            } else {
              throw new Error('Checkout cached details not found.');
            }
          } else {
            throw new Error(`Transaction state: ${data.paymentStatus}. Payment was incomplete.`);
          }
        } catch (err) {
          console.error('PhonePe verification error:', err);
          setVerificationError(err.message || 'Verification failed. Please retry payment.');
          setStep('payment');
          toast.error(err.message || 'Payment verification failed.');
        } finally {
          setIsVerifying(false);
          // Clean parameters from address bar
          navigate('/checkout', { replace: true });
        }
      }

      verifyPayment();
    }
  }, []);

  const handlePhonePePayment = async () => {
    const txnId = `TXN-${Date.now()}`;
    const checkoutData = {
      items: cartProducts.map(cp => ({
        productId: cp.productId,
        name: cp.product.name,
        price: cp.product.price,
        image: cp.product.image,
        quantity: cp.quantity,
        size: cp.size
      })),
      total: total,
      shippingAddress: shipping,
      transactionId: txnId,
      userId: user?.id || 'guest'
    };

    sessionStorage.setItem('ameya_checkout_cache', JSON.stringify(checkoutData));

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          transactionId: txnId,
          userId: shipping.email
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Initiation request failed.');
      }

      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('Redirect URL not received.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Could not redirect to PhonePe. Please try again.');
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'contact') {
      if (!validateShipping()) return;
      setStep('payment');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (step === 'payment') {
      handlePhonePePayment();
    }
  };

  const shippingOptions = {
    standard: {
      label: 'Standard Shipping',
      sub: '5–7 business days',
      price: 'Free'
    },
    express: {
      label: 'Express Shipping',
      sub: '2–3 business days',
      price: '$15'
    },
    overnight: {
      label: 'Overnight Delivery',
      sub: 'Next business day',
      price: '$35'
    }
  };

  // ── Shared Input Class ──────────────────────────────────────────────────
  const inputCls = field => `w-full border ${errors[field] ? 'border-red-400' : 'border-[var(--border)]'} bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors`;

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
        <h2 className="font-serif text-2xl text-[var(--foreground)] mb-2">Verifying Payment</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Please wait while we verify your transaction status with PhonePe...</p>
      </div>
    );
  }

  // ── Progress Bar ────────────────────────────────────────────────────────
  const stepIndex = STEPS.findIndex(s => s.key === step);
  return <div className="min-h-screen bg-[var(--background)] pt-20">
      {/* Top bar */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-widest text-[var(--foreground)]">AMEYA</Link>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <Lock size={12} className="text-[var(--primary)]" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      {step !== 'confirmation' && <div className="bg-white border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center gap-0 max-w-xs mx-auto md:mx-0">
              {STEPS.map((s, i) => <div key={s.key} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${i < stepIndex ? 'bg-[var(--primary)] text-white' : i === stepIndex ? 'border-2 border-[var(--primary)] text-[var(--primary)]' : 'border border-[var(--border)] text-[var(--muted-foreground)]'}`}>
                      {i < stepIndex ? <Check size={12} /> : <span>{i + 1}</span>}
                    </div>
                    <span className={`text-xs uppercase tracking-widest ${i === stepIndex ? 'text-[var(--primary)]' : i < stepIndex ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <ChevronRight size={14} className="mx-2 text-[var(--border)]" />}
                </div>)}
            </div>
          </div>
        </div>}

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <AnimatePresence mode="wait">

          {/* ───────────────── STEP 1: SHIPPING ─────────────────── */}
          {step === 'contact' && <motion.div key="contact" initial={{
          opacity: 0,
          x: 40
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -40
        }} transition={{
          duration: 0.35
        }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-8">
                {/* Contact */}
                <section>
                  <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">First Name</label>
                      <input className={inputCls('firstName')} value={shipping.firstName} onChange={e => setShipping(s => ({
                    ...s,
                    firstName: e.target.value
                  }))} placeholder="Jane" />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Last Name</label>
                      <input className={inputCls('lastName')} value={shipping.lastName} onChange={e => setShipping(s => ({
                    ...s,
                    lastName: e.target.value
                  }))} placeholder="Doe" />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Email Address</label>
                      <input className={inputCls('email')} type="email" value={shipping.email} onChange={e => setShipping(s => ({
                    ...s,
                    email: e.target.value
                  }))} placeholder="jane@example.com" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Phone Number</label>
                      <input className={inputCls('phone')} type="tel" value={shipping.phone} onChange={e => setShipping(s => ({
                    ...s,
                    phone: e.target.value
                  }))} placeholder="(212) 555-0100" />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </section>

                {/* Shipping Address */}
                <section>
                  <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Street Address</label>
                      <input className={inputCls('address')} value={shipping.address} onChange={e => setShipping(s => ({
                    ...s,
                    address: e.target.value
                  }))} placeholder="727 Fifth Avenue" />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Apt / Suite <span className="normal-case text-[var(--muted-foreground)]">(optional)</span></label>
                      <input className={inputCls('apt')} value={shipping.apt} onChange={e => setShipping(s => ({
                    ...s,
                    apt: e.target.value
                  }))} placeholder="Suite 12B" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">City</label>
                      <input className={inputCls('city')} value={shipping.city} onChange={e => setShipping(s => ({
                    ...s,
                    city: e.target.value
                  }))} placeholder="New York" />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">State</label>
                      <select className={inputCls('state')} value={shipping.state} onChange={e => setShipping(s => ({
                    ...s,
                    state: e.target.value
                  }))}>
                        {US_STATES.map(st => <option key={st}>{st}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">ZIP Code</label>
                      <input className={inputCls('zip')} value={shipping.zip} onChange={e => setShipping(s => ({
                    ...s,
                    zip: e.target.value
                  }))} placeholder="10022" maxLength={10} />
                      {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Country</label>
                      <select className={inputCls('country')} value={shipping.country} onChange={e => setShipping(s => ({
                    ...s,
                    country: e.target.value
                  }))}>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>France</option>
                        <option>Japan</option>
                        <option>UAE</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Shipping Method */}
                <section>
                  <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">Shipping Method</h2>
                  <div className="space-y-3">
                    {Object.keys(shippingOptions).map(key => {
                  const opt = shippingOptions[key];
                  const active = selectedShipping === key;
                  return <button key={key} onClick={() => setSelectedShipping(key)} className={`w-full flex items-center justify-between px-5 py-4 border transition-all duration-200 text-left ${active ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] bg-white hover:border-[var(--primary)]/50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-[var(--primary)]' : 'border-[var(--border)]'}`}>
                              {active && <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--foreground)]">{opt.label}</p>
                              <p className="text-xs text-[var(--muted-foreground)]">{opt.sub}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${opt.price === 'Free' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{opt.price}</span>
                        </button>;
                })}
                  </div>
                </section>

                <button onClick={handleNext} className="w-full bg-[var(--primary)] text-white py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 active:opacity-80 transition-opacity">
                  <span>Continue to Payment</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Order Summary */}
              <OrderSummary cartProducts={cartProducts} subtotal={subtotal} tax={tax} total={total} />
            </motion.div>}

          {/* ───────────────── STEP 2: PAYMENT ─────────────────── */}
          {step === 'payment' && <motion.div key="payment" initial={{
          opacity: 0,
          x: 40
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -40
        }} transition={{
          duration: 0.35
        }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-8">
                {/* Shipping recap */}
                <div className="border border-[var(--border)] bg-white px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck size={16} className="text-[var(--primary)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">Ship to</p>
                      <p className="text-sm font-medium text-[var(--foreground)]">{shipping.address}, {shipping.city}</p>
                    </div>
                  </div>
                  <button onClick={() => setStep('contact')} className="text-xs text-[var(--primary)] uppercase tracking-widest hover:underline">Change</button>
                </div>

                {verificationError && (
                  <div className="bg-red-50 border border-red-100 text-red-800 text-xs px-4 py-3 rounded-sm flex items-center gap-3">
                    <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                <section className="bg-white p-6 border border-[var(--border)] rounded-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                    <h2 className="font-serif text-xl text-[var(--foreground)]">Payment Method</h2>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">UPI / Cards / NetBanking</span>
                  </div>
                  
                  <div className="flex items-start gap-4 py-5 px-6 border border-purple-200 bg-purple-50/20 rounded-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard size={24} className="text-purple-700" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-[var(--foreground)]">PhonePe Secure Checkout</p>
                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                        Secure connection to the PhonePe checkout gateway. You will be redirected to the secure sandbox payment portal where you can pay using simulated cards, UPI QR, or NetBanking.
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-[var(--muted-foreground)] italic flex items-center gap-1.5">
                    <Lock size={12} className="text-[var(--primary)]" />
                    <span>PhonePe encryption ensures your credentials are 100% secure.</span>
                  </div>
                </section>

                {/* Billing */}
                <section>
                  <h2 className="font-serif text-xl text-[var(--foreground)] mb-4">Billing Address</h2>
                  <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                    <div onClick={() => setPayment(p => ({
                  ...p,
                  sameAsShipping: !p.sameAsShipping
                }))} className={`w-5 h-5 border flex items-center justify-center transition-colors ${payment.sameAsShipping ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)] bg-white'}`}>
                      {payment.sameAsShipping && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-[var(--foreground)]">Same as shipping address</span>
                  </label>
                  {!payment.sameAsShipping && <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Street Address</label>
                        <input className={inputCls('billingAddress')} value={payment.billingAddress} onChange={e => setPayment(p => ({
                    ...p,
                    billingAddress: e.target.value
                  }))} placeholder="727 Fifth Avenue" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">City</label>
                        <input className={inputCls('billingCity')} value={payment.billingCity} onChange={e => setPayment(p => ({
                    ...p,
                    billingCity: e.target.value
                  }))} placeholder="New York" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">State</label>
                        <select className={inputCls('billingState')} value={payment.billingState} onChange={e => setPayment(p => ({
                    ...p,
                    billingState: e.target.value
                  }))}>
                          {US_STATES.map(st => <option key={st}>{st}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">ZIP Code</label>
                        <input className={inputCls('billingZip')} value={payment.billingZip} onChange={e => setPayment(p => ({
                    ...p,
                    billingZip: e.target.value
                  }))} placeholder="10022" maxLength={10} />
                      </div>
                    </div>}
                </section>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
                  {['256-bit SSL Encryption', 'PCI-DSS Compliant', 'Fraud Protection'].map(b => <span key={b} className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[var(--primary)]" /> {b}
                    </span>)}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep('contact')} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button onClick={handleNext} className="flex-1 bg-[var(--primary)] text-white py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 active:opacity-80 transition-opacity">
                    <Lock size={13} />
                    <span>Place Order · ${total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                  </button>
                </div>
              </div>

              <OrderSummary cartProducts={cartProducts} subtotal={subtotal} tax={tax} total={total} />
            </motion.div>}

          {/* ───────────────── STEP 3: CONFIRMATION ─────────────────── */}
          {step === 'confirmation' && <motion.div key="confirmation" initial={{
          opacity: 0,
          scale: 0.96
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5
        }} className="max-w-2xl mx-auto text-center">
              {/* Animated check */}
              <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200
          }} className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Check size={36} className="text-white" strokeWidth={2.5} />
              </motion.div>

              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.35
          }}>
                <p className="text-xs uppercase tracking-widest text-[var(--primary)] mb-2">Order Confirmed</p>
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-4">Thank You,<br />{shipping.firstName}.</h1>
                <p className="text-[var(--muted-foreground)] mb-2">
                  Your order <span className="font-medium text-[var(--foreground)]">{orderNum}</span> has been received.
                </p>
                <p className="text-[var(--muted-foreground)] text-sm mb-10">
                  A confirmation has been sent to <span className="text-[var(--foreground)]">{shipping.email}</span>
                </p>

                {/* Timeline */}
                <div className="bg-white border border-[var(--border)] p-6 mb-8 text-left">
                  <h3 className="font-serif text-lg text-[var(--foreground)] mb-5">What Happens Next</h3>
                  <div className="space-y-4">
                    {[{
                  icon: ShieldCheck,
                  label: 'Order Confirmed',
                  sub: 'We\'ve received your order and are preparing it.'
                }, {
                  icon: Package,
                  label: 'Packaging',
                  sub: 'Your piece is being giftwrapped in our signature box.'
                }, {
                  icon: Truck,
                  label: 'Shipped',
                  sub: `Estimated delivery via ${shippingOptions[selectedShipping].label}: ${shippingOptions[selectedShipping].sub}.`
                }].map((item, i) => <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>
                          <item.icon size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{item.sub}</p>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Gifting note */}
                <div className="relative overflow-hidden bg-[var(--secondary)] border border-[var(--border)] p-6 mb-10">
                  <img src="https://images.unsplash.com/photo-1583937443351-f2f669fbe2cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcGFja2FnaW5nJTIwZ2lmdCUyMGJveCUyMGVtZXJhbGR8ZW58MXx8fHwxNzcyODYxNTE3fDA&ixlib=rb-4.1.0&q=80&w=400" alt="AMEYA gift packaging" className="absolute inset-0 w-full h-full object-cover opacity-10" />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-widest text-[var(--primary)] mb-1">Complimentary Gift Service</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Every AMEYA order arrives in our signature emerald gift box with satin ribbon and a handwritten note card.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/orders" className="px-8 py-3 border border-[var(--primary)] text-[var(--primary)] text-xs uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all duration-300">
                    View Orders
                  </Link>
                  <Link to="/" className="px-8 py-3 bg-[var(--primary)] text-white text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}

// ─── Order Summary Sidebar ──────────────────────────────────────────────────
function OrderSummary({
  cartProducts = [],
  subtotal = 0,
  tax = 0,
  total = 0
}) {
  const [open, setOpen] = useState(true);
  return <div className="lg:col-span-5">
      <div className="bg-white border border-[var(--border)] sticky top-24">
        <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-6 py-4 border-b border-[var(--border)] lg:cursor-default">
          <h3 className="font-serif text-xl text-[var(--foreground)]">Order Summary</h3>
          <span className="text-xs text-[var(--primary)] lg:hidden">{open ? 'Hide' : 'Show'}</span>
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
          duration: 0.3
        }} className="overflow-hidden">
              {/* Items */}
              <div className="divide-y divide-[var(--border)] max-h-72 overflow-y-auto">
                {cartProducts.map(item => <div key={item.id} className="flex gap-3 px-6 py-4">
                    <div className="relative flex-shrink-0">
                      <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-16 h-16 object-cover bg-[var(--secondary)]" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif text-[var(--foreground)] truncate">{item.product.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{item.product.category}</p>
                    </div>
                    <p className="text-sm font-medium text-[var(--foreground)] whitespace-nowrap">${(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>)}
              </div>

              {/* Promo */}
              <div className="px-6 py-4 border-t border-[var(--border)]">
                <div className="flex gap-2">
                  <input className="flex-1 border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors" placeholder="Gift card or promo code" />
                  <button className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] text-xs uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="px-6 pb-6 space-y-3 text-sm border-t border-[var(--border)] pt-4">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Shipping</span>
                  <span className="text-[var(--primary)]">Free</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Estimated Tax</span>
                  <span>${tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                  <span className="font-serif text-lg text-[var(--foreground)]">Total</span>
                  <span className="font-serif text-lg text-[var(--foreground)]">${total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</span>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}

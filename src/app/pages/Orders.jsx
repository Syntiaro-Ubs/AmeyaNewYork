import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Package, CheckCircle, Clock, Search, XCircle, ChevronRight, X, Truck, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getLiveTracking } from '../services/trackingService';

// ... (skipping to Orders function)

export function Orders() {
  const {
    user
  } = useAuth();
  const { getOrders, cancelOrder, deleteOrder } = useOrders();
  const userOrders = getOrders();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const navigate = useNavigate();

  const handleTrackPackage = (order) => {
    setSelectedTrackingOrder(order);
  };

  const handleBuyAgain = (itemName) => {
    toast.success(`Started new order for ${itemName}`);
    navigate('/');
  };

  const handleArchiveOrder = (orderId) => {
    deleteOrder(orderId);
    toast.success('Order archived successfully.');
  };

  const handleCancelOrder = (orderId) => {
    cancelOrder(orderId);
    toast.success('Order has been cancelled.');
  };
  if (!user) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-serif mb-2">Login to view your orders</h2>
          <p className="text-gray-500 mb-8">Track your packages and view your order history.</p>
          <Link to="/login" className="bg-[var(--primary)] text-white px-8 py-3 uppercase tracking-wider text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors inline-block">
            Login Now
          </Link>
        </div>
      </div>;
  }
  const filteredOrders = userOrders.filter(order => {
    // Filter by tab
    if (activeTab === 'delivered' && order.status !== 'Delivered') return false;
    if (activeTab === 'processing' && order.status !== 'Processing') return false;
    if (activeTab === 'cancelled' && order.status !== 'Cancelled') return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return order.id.toLowerCase().includes(query) || order.items.some(item => item.name.toLowerCase().includes(query));
    }
    return true;
  });
  return <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 md:mb-0">
             <span className="text-gray-900 font-medium">My Orders</span>
           </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
             <div className="flex overflow-x-auto scrollbar-hide">
               {['all', 'processing', 'delivered', 'cancelled'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-800'}`}>
                   {tab === 'all' ? 'All Orders' : tab}
                   {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />}
                 </button>)}
             </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-b border-gray-200">
             <div className="relative max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               <input type="text" placeholder="Search your orders here..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" />
             </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? filteredOrders.map(order => <motion.div key={order.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-600">
                  <div className="flex gap-8">
                     <div>
                       <p className="text-xs uppercase font-bold text-gray-400 mb-1">Order Placed</p>
                       <p>{order.date}</p>
                     </div>
                     <div>
                       <p className="text-xs uppercase font-bold text-gray-400 mb-1">Total</p>
                       <p>${order.total.toLocaleString()}</p>
                     </div>
                     <div>
                       <p className="text-xs uppercase font-bold text-gray-400 mb-1">Ship To</p>
                       <div className="group relative cursor-pointer hover:text-[var(--primary)]">
                         {user.name}
                         <div className="absolute left-0 top-full mt-2 w-48 bg-white p-3 shadow-lg rounded border border-gray-100 hidden group-hover:block z-10">
                           <p className="font-semibold text-gray-900 mb-1">{user.name}</p>
                           <p className="text-xs text-gray-500">123 Luxury Avenue, Apartment 4B, New York, NY</p>
                         </div>
                       </div>
                     </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Order # {order.id}</p>
                    {order.trackingNumber && (
                      <p className="text-[11px] text-gray-500 mb-1">
                        Tracking #: <span className="font-mono text-gray-700 font-semibold">{order.trackingNumber}</span>
                      </p>
                    )}
                    <div className="flex gap-3 text-xs md:justify-end">
                      <button 
                        onClick={() => toast.info('Invoice download started...')} 
                        className="text-blue-600 hover:underline"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className={`text-lg font-bold flex items-center gap-2 mb-1 ${order.status === 'Delivered' ? 'text-green-700' : order.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                         {order.status === 'Delivered' && <CheckCircle size={20} />}
                         {order.status === 'Cancelled' && <XCircle size={20} />}
                         {order.status === 'Processing' && <Clock size={20} />}
                         {order.status === 'Delivered' ? `Delivered ${order.deliveryDate}` : order.status === 'Cancelled' ? order.deliveryDate : `Arriving ${order.deliveryDate}`}
                      </h3>
                      {order.status === 'Delivered' && <p className="text-sm text-gray-500">Package was left near the front door or porch.</p>}
                    </div>
                    {order.status !== 'Cancelled' && <div className="flex flex-col sm:flex-row gap-2">
                         <button 
                           onClick={() => handleTrackPackage(order)}
                           className="bg-[var(--primary)] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors"
                         >
                           Track Package
                         </button>
                         {order.status === 'Processing' && (
                           <button 
                             onClick={() => handleCancelOrder(order.id)}
                             className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm font-medium hover:bg-red-50 transition-colors"
                           >
                             Cancel Order
                           </button>
                         )}
                       </div>}
                  </div>

                  <div className="space-y-6">
                    {order.items.map((item, idx) => <div key={idx} className="flex gap-6 items-start">
                        <div className="w-24 h-24 bg-gray-100 flex-shrink-0 border border-gray-200 p-2">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                          <h4 
                            onClick={() => navigate('/')}
                            className="font-medium text-gray-900 hover:text-[var(--primary)] cursor-pointer"
                          >
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">Sold by: AMEYA New York</p>
                          <p className="text-sm font-bold">${item.price.toLocaleString()}</p>
                          
                          <div className="flex gap-2 mt-3">
                             <button 
                               onClick={() => handleBuyAgain(item.name)}
                               className="bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] text-black text-xs px-4 py-1.5 rounded-sm shadow-sm transition-colors"
                             >
                               Buy it again
                             </button>
                             <button 
                               onClick={() => navigate('/')}
                               className="border border-gray-300 bg-white hover:bg-gray-50 text-black text-xs px-4 py-1.5 rounded-sm shadow-sm transition-colors"
                             >
                               View your item
                             </button>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                   <button 
                     onClick={() => handleArchiveOrder(order.id)}
                     className="text-sm text-gray-400 font-medium hover:text-red-500 transition-colors"
                   >
                     Archive Order
                   </button>
                </div>
              </motion.div>) : <div className="text-center py-20 bg-white border border-gray-200 rounded-sm">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't placed any orders matching your criteria.</p>
              <Link to="/category/new-arrivals" className="bg-[var(--primary)] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors">
                Start Shopping
              </Link>
            </div>}
        </div>
      </div>

      <AnimatePresence>
        {selectedTrackingOrder && (
          <TrackingModal 
            order={selectedTrackingOrder} 
            onClose={() => setSelectedTrackingOrder(null)} 
          />
        )}
      </AnimatePresence>
    </div>;
}

function TrackingModal({ order, onClose }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateOrderStatus } = useOrders();

  // Use the order's tracking number if assigned; otherwise, default to standard FedEx sandbox dummy for testing
  const trackingNumber = order.trackingNumber || '123456789012';
  const isMockFallback = !order.trackingNumber;

  useEffect(() => {
    let isMounted = true;
    
    async function loadTracking() {
      try {
        setLoading(true);
        const data = await getLiveTracking(trackingNumber);
        if (isMounted) {
          setTrackingData(data);
          setError(null);

          // Dynamically sync order status from FedEx live tracker
          if (data && data.status && data.status !== order.status) {
            const formattedDate = data.estimatedDelivery 
              ? new Date(data.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : order.deliveryDate;
            updateOrderStatus(order.id, data.status, formattedDate);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve live shipment status.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTracking();
    
    return () => { isMounted = false; };
  }, [trackingNumber, order.status]);

  const getStepStatus = (stepLabel) => {
    if (!trackingData) return 'pending';
    if (trackingData.status === 'Cancelled' && stepLabel !== 'Ordered') return 'cancelled';
    
    const statusOrder = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStatusIndex = statusOrder.indexOf(
      trackingData.status === 'Cancelled' ? 'Processing' : trackingData.status
    );
    const stepIndex = statusOrder.indexOf(stepLabel);

    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'current';
    return 'pending';
  };

  const steps = [
    { label: 'Ordered', status: 'completed', date: order.date },
    { label: 'Processing', status: getStepStatus('Processing'), date: order.date },
    { 
      label: 'Shipped', 
      status: getStepStatus('Shipped'), 
      date: trackingData?.scans?.find(s => ['PU', 'DP', 'AR', 'IT'].includes(s.status) || s.description?.toLowerCase().includes('picked up') || s.description?.toLowerCase().includes('departed'))?.timestamp 
            ? new Date(trackingData.scans.find(s => ['PU', 'DP', 'AR', 'IT'].includes(s.status) || s.description?.toLowerCase().includes('picked up') || s.description?.toLowerCase().includes('departed')).timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Pending'
    },
    { 
      label: 'Out for Delivery', 
      status: getStepStatus('Out for Delivery'), 
      date: trackingData?.scans?.find(s => ['OD', 'HL'].includes(s.status) || s.description?.toLowerCase().includes('out for delivery') || s.description?.toLowerCase().includes('ready for recipient pickup'))?.timestamp
            ? new Date(trackingData.scans.find(s => ['OD', 'HL'].includes(s.status) || s.description?.toLowerCase().includes('out for delivery') || s.description?.toLowerCase().includes('ready for recipient pickup')).timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Pending'
    },
    { 
      label: 'Delivered', 
      status: getStepStatus('Delivered'), 
      date: trackingData?.status === 'Delivered' && trackingData.estimatedDelivery 
            ? new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : (trackingData?.estimatedDelivery ? new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending')
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-serif text-xl text-[var(--foreground)]">Track Package</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Order #{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex-1 overflow-y-auto min-h-[300px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
              <p className="text-sm text-gray-500">Contacting FedEx sandbox...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h4 className="font-bold text-gray-900 mb-1">Could Not Retrieve Live Status</h4>
              <p className="text-sm text-gray-500 max-w-xs">{error}</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-[var(--primary)] text-white text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {isMockFallback && (
                <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs px-4 py-2.5 rounded-sm mb-6 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>No tracking number assigned. Running sandbox mock flow (`123456789012`).</span>
                </div>
              )}

              {/* Status highlight */}
              <div className="bg-gray-50 p-4 rounded-sm mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Truck size={24} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-[0.1em] mb-0.5">
                    {trackingData.status === 'Delivered' ? 'Delivery Date' : 'Estimated Delivery'}
                  </p>
                  <p className="text-lg font-medium text-[var(--foreground)]">
                    {trackingData.estimatedDelivery 
                      ? new Date(trackingData.estimatedDelivery).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                      : 'TBD'}
                  </p>
                  <p className="text-xs text-gray-500 italic mt-0.5">{trackingData.description}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0 relative mb-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 min-h-[80px] last:min-h-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center z-10 
                        ${step.status === 'completed' ? 'bg-green-500' : 
                          step.status === 'current' ? 'bg-blue-500 ring-4 ring-blue-100' : 
                          step.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-200'}`}
                      >
                        {(step.status === 'completed' || step.status === 'cancelled') && <CheckCircle size={10} className="text-white" />}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`w-0.5 flex-1 ${step.status === 'completed' ? 'bg-green-200' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className="pb-8 last:pb-0">
                      <h4 className={`text-sm font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-900'}`}>{step.label}</h4>
                      <p className="text-xs text-gray-500 mt-1">{step.status === 'cancelled' ? 'Order Cancelled' : step.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Travel History Scans */}
              {trackingData.scans && trackingData.scans.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Travel History</h4>
                  <div className="max-h-[150px] overflow-y-auto space-y-3 pr-2 text-xs">
                    {trackingData.scans.map((scan, i) => (
                      <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
                        <div className="pr-4">
                          <p className="font-semibold text-gray-800">{scan.description}</p>
                          <p className="text-gray-400">{scan.location}</p>
                        </div>
                        <div className="text-right text-gray-400 whitespace-nowrap">
                          {new Date(scan.timestamp).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Carrier Info */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Carrier</p>
                  <p className="font-medium">FedEx Express</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Tracking Number</p>
                  <a 
                    href={`https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    {trackingNumber}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-2 bg-[var(--primary)] text-white text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


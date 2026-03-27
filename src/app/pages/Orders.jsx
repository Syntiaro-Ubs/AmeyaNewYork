import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Package, CheckCircle, Clock, Search, XCircle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import 'sonner'; // Mock order data
const mockOrders = [{
  id: 'ORD-2024-8732',
  date: 'February 20, 2024',
  total: 2450,
  status: 'Delivered',
  deliveryDate: 'Feb 25, 2024',
  items: [{
    name: 'Eclat Diamond Ring',
    price: 2450,
    image: 'figma:asset/35d1baf7ba6d20bacbe50e5a6531614aa30fa221.png',
    quantity: 1
  }]
}, {
  id: 'ORD-2024-9102',
  date: 'February 24, 2024',
  total: 3200,
  status: 'Processing',
  deliveryDate: 'Expected Feb 28, 2024',
  items: [{
    name: 'Apex Spark Bracelet',
    price: 3200,
    image: 'figma:asset/35d1baf7ba6d20bacbe50e5a6531614aa30fa221.png',
    quantity: 1
  }]
}, {
  id: 'ORD-2023-5521',
  date: 'December 15, 2023',
  total: 1850,
  status: 'Cancelled',
  deliveryDate: 'Cancelled on Dec 16, 2023',
  items: [{
    name: 'Eleve Gold Necklace',
    price: 1200,
    image: 'figma:asset/35d1baf7ba6d20bacbe50e5a6531614aa30fa221.png',
    quantity: 1
  }, {
    name: 'Eleve Gold Earrings',
    price: 650,
    image: 'figma:asset/35d1baf7ba6d20bacbe50e5a6531614aa30fa221.png',
    quantity: 1
  }]
}];
export function Orders() {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
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
  const filteredOrders = mockOrders.filter(order => {
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
             <Link to="/account" className="hover:text-[var(--primary)]">My Account</Link>
             <ChevronRight size={14} />
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
                    <div className="flex gap-3 text-xs md:justify-end">
                      <button className="text-blue-600 hover:underline">View Invoice</button>
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
                    {order.status !== 'Cancelled' && <div className="flex flex-col gap-2">
                         <button className="bg-[var(--primary)] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors">
                           Track Package
                         </button>
                       </div>}
                  </div>

                  <div className="space-y-6">
                    {order.items.map((item, idx) => <div key={idx} className="flex gap-6 items-start">
                        <div className="w-24 h-24 bg-gray-100 flex-shrink-0 border border-gray-200 p-2">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 hover:text-[var(--primary)] cursor-pointer">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">Sold by: AMEYA New York</p>
                          <p className="text-sm font-bold">${item.price.toLocaleString()}</p>
                          
                          <div className="flex gap-2 mt-3">
                             <button className="bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] text-black text-xs px-4 py-1.5 rounded-sm shadow-sm transition-colors">
                               Buy it again
                             </button>
                             <button className="border border-gray-300 bg-white hover:bg-gray-50 text-black text-xs px-4 py-1.5 rounded-sm shadow-sm transition-colors">
                               View your item
                             </button>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                   <button className="text-sm text-[var(--primary)] font-medium hover:underline">Archive Order</button>
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
    </div>;
}

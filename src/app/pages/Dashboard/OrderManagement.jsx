import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { toast } from 'sonner';

export const OrderManagement = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Auto-sync active orders with FedEx tracking status on mount
  useEffect(() => {
    let isMounted = true;

    async function syncTrackingStatuses() {
      // Find orders with a tracking number that aren't Delivered or Cancelled
      const activeOrders = orders.filter(
        order => order.trackingNumber && order.status !== 'Delivered' && order.status !== 'Cancelled'
      );

      if (activeOrders.length === 0) return;

      for (const order of activeOrders) {
        try {
          const response = await fetch(`http://localhost:5000/api/tracking/${order.trackingNumber}`);
          if (!response.ok) continue;

          const result = await response.json();
          const freshData = result.data;

          if (isMounted && freshData && freshData.status && freshData.status !== order.status) {
            const formattedDate = freshData.estimatedDelivery 
              ? new Date(freshData.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : order.deliveryDate;
            
            updateOrderStatus(order.id, freshData.status, formattedDate);
          }
        } catch (err) {
          console.error(`Auto-sync failed for order ${order.id}:`, err);
        }
      }
    }

    syncTrackingStatuses();
  }, []); // Run once on mount


  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.userId && String(order.userId).toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    let deliveryDate = '';
    if (newStatus === 'Shipped') deliveryDate = 'Arriving in 3-5 business days';
    if (newStatus === 'Delivered') deliveryDate = `Delivered on ${new Date().toLocaleDateString()}`;
    if (newStatus === 'Out for Delivery') deliveryDate = 'Arriving Today';
    
    updateOrderStatus(orderId, newStatus, deliveryDate);
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Shipped': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-neutral-500 bg-neutral-50 border-neutral-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Processing</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{orders.filter(o => o.status === 'Processing').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Shipped</p>
          <p className="text-2xl font-semibold text-amber-500 mt-1">{orders.filter(o => o.status === 'Shipped').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Delivered</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{orders.filter(o => o.status === 'Delivered').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Order ID or User..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
          {['all', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === status 
                ? 'bg-neutral-900 text-white shadow-sm' 
                : 'bg-neutral-50 text-neutral-500 border border-neutral-200 hover:border-neutral-900'
              }`}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">FedEx Tracking</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-neutral-400">No orders found.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-100">
                        <Package size={18} className="text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{order.id}</p>
                        <p className="text-xs text-neutral-500">{order.items.length} items</p>
                        {order.trackingNumber && (
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Track: {order.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-neutral-900 font-medium capitalize">{String(order.userId || '').replace('_', ' ')}</p>
                    <p className="text-xs text-neutral-500">{order.shippingAddress.email || 'Email not provided'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium border rounded-full px-3 py-1 focus:outline-none cursor-pointer transition-all ${getStatusColor(order.status)}`}
                    >
                      <option value="Processing" className="text-neutral-700 bg-white">Processing</option>
                      <option value="Shipped" className="text-neutral-700 bg-white">Shipped</option>
                      <option value="Out for Delivery" className="text-neutral-700 bg-white">Out for Delivery</option>
                      <option value="Delivered" className="text-neutral-700 bg-white">Delivered</option>
                      <option value="Cancelled" className="text-neutral-700 bg-white">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-neutral-600">
                    {order.trackingNumber || '—'}
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

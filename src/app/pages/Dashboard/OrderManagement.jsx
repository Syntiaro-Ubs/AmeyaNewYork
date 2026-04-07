import React, { useState } from 'react';
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.userId && order.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
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
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-neutral-900 font-medium capitalize">{order.userId.replace('_', ' ')}</p>
                    <p className="text-xs text-neutral-500">{order.shippingAddress.email || 'Email not provided'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs bg-white border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    >
                      <option value="Processing">Set Processing</option>
                      <option value="Shipped">Set Shipped</option>
                      <option value="Out for Delivery">Set Out for Delivery</option>
                      <option value="Delivered">Set Delivered</option>
                      <option value="Cancelled">Set Cancelled</option>
                    </select>
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

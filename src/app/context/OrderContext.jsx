import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext(undefined);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ameya_orders');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ameya_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `AMY-${Date.now().toString().slice(-7)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      userId: user?.id || 'guest',
      status: 'Processing',
      deliveryDate: 'Apr 12, 2026' // Mock delivery date
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Cancelled', deliveryDate: `Cancelled on ${new Date().toLocaleDateString()}` } : order
    ));
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const updateOrderStatus = (orderId, newStatus, newDeliveryDate) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        status: newStatus, 
        deliveryDate: newDeliveryDate || order.deliveryDate 
      } : order
    ));
  };

  const getOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrders, cancelOrder, deleteOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

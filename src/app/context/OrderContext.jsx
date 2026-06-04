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

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'ameya_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `AMY-${Date.now().toString().slice(-7)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      userId: orderData.userId || user?.id || 'guest',
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

  const updateOrderStatus = (orderId, newStatus, newDeliveryDate, trackingNumber) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        status: newStatus, 
        deliveryDate: newDeliveryDate || order.deliveryDate,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber
      } : order
    ));
  };


  const getOrders = () => {
    if (!user) return [];
    return orders.filter(order => String(order.userId) === String(user.id));
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

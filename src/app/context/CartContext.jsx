import { createContext, useContext, useState, useEffect } from 'react';
/* ── Safe default so createContext never returns undefined during HMR ── */
const defaultContext = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  lastAddedProductId: null,
  isAddedModalOpen: false,
  closeAddedModal: () => {}
};
const CartContext = createContext(defaultContext);
export function CartProvider({
  children
}) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ameya_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [lastAddedProductId, setLastAddedProductId] = useState(null);
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem('ameya_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  const addToCart = (productId, quantity, size) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === productId && item.size === size);
      if (existingItem) {
        return prev.map(item => item.id === existingItem.id ? {
          ...item,
          quantity: item.quantity + quantity
        } : item);
      }
      return [...prev, {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId,
        quantity,
        size
      }];
    });
    setLastAddedProductId(productId);
    setIsAddedModalOpen(true);
  };
  const removeFromCart = id => setCartItems(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? {
      ...item,
      quantity
    } : item));
  };
  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const closeAddedModal = () => setIsAddedModalOpen(false);
  return <CartContext.Provider value={{
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    lastAddedProductId,
    isAddedModalOpen,
    closeAddedModal
  }}>
      {children}
    </CartContext.Provider>;
}
export function useCart() {
  return useContext(CartContext);
}

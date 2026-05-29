import { createContext, useContext, useEffect, useState } from 'react';
import { getProductIdentifiers, getProductKey } from '../utils/product';

/* Safe default so createContext never returns undefined during HMR */
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

export function CartProvider({ children }) {
  const persistCart = items => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ameya_cart', JSON.stringify(items));
    }
  };

  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ameya_cart');

      return saved ? JSON.parse(saved).map(item => ({
        ...item,
        productId: item.productId !== undefined && item.productId !== null ? String(item.productId) : item.productId
      })) : [];
    }

    return [];
  });
  const [lastAddedProductId, setLastAddedProductId] = useState(null);
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);

  useEffect(() => {
    persistCart(cartItems);
  }, [cartItems]);

  const commitCartUpdate = updater => {
    setCartItems(prev => {
      const nextItems = typeof updater === 'function' ? updater(prev) : updater;
      persistCart(nextItems);
      return nextItems;
    });
  };

  const addToCart = (productIdentifier, quantity = 1, size) => {
    const normalizedProductId = getProductKey(productIdentifier);
    const matchingIdentifiers = getProductIdentifiers(productIdentifier);

    if (!normalizedProductId) return;

    commitCartUpdate(prev => {
      const existingItem = prev.find(item => matchingIdentifiers.includes(String(item.productId)) && item.size === size);

      if (existingItem) {
        return prev.map(item => item.id === existingItem.id ? {
          ...item,
          quantity: item.quantity + quantity
        } : item);
      }

      return [...prev, {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        productId: normalizedProductId,
        quantity,
        size
      }];
    });

    setLastAddedProductId(normalizedProductId);
    setIsAddedModalOpen(true);
  };

  const removeFromCart = id => {
    commitCartUpdate(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    commitCartUpdate(prev => prev.map(item => item.id === id ? {
      ...item,
      quantity
    } : item));
  };

  const clearCart = () => {
    commitCartUpdate([]);
  };

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

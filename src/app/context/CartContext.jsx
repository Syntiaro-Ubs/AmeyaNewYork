import { createContext, useContext, useEffect, useState } from 'react';
import { getProductIdentifiers, getProductKey } from '../utils/product';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

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
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedProductId, setLastAddedProductId] = useState(null);
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);

  const getIdentifier = () => {
    if (user && user.email) return user.email;
    if (typeof window !== 'undefined') {
      let guestId = localStorage.getItem('ameya_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ameya_guest_id', guestId);
      }
      return guestId;
    }
    return 'guest_fallback';
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const identifier = getIdentifier();
      const response = await fetch(`${API_URL}/cart/${encodeURIComponent(identifier)}`);
      if (response.ok) {
        const data = await response.json();
        // The backend returns: { id, productId, quantity, size }
        // Ensure the frontend uses the same shape it expects.
        // Frontend expects: { id: string/number, productId: string, quantity: number, size: string }
        // The previous local storage id was a random string, here we use DB's `id`.
        setCartItems(data.map(item => ({
          id: item.id,
          productId: String(item.productId),
          quantity: item.quantity,
          size: item.size || undefined
        })));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // When user logs in, merge guest cart if it exists
  const handleUserLoginMerge = async () => {
    if (user && user.email) {
      const guestId = localStorage.getItem('ameya_guest_id');
      if (guestId) {
        try {
          // Fetch guest cart
          const guestRes = await fetch(`${API_URL}/cart/${encodeURIComponent(guestId)}`);
          if (guestRes.ok) {
            const guestItems = await guestRes.json();
            if (guestItems.length > 0) {
              // Add all guest items to user cart
              for (const item of guestItems) {
                await fetch(`${API_URL}/cart/${encodeURIComponent(user.email)}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size
                  })
                });
              }
              // Clear guest cart
              await fetch(`${API_URL}/cart/${encodeURIComponent(guestId)}`, { method: 'DELETE' });
              localStorage.removeItem('ameya_guest_id');
            }
          }
        } catch (error) {
          console.error('Error merging guest cart:', error);
        }
      }
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      await handleUserLoginMerge();
      await fetchCart();
    };
    initializeCart();
  }, [user]);

  const addToCart = async (productIdentifier, quantity = 1, size) => {
    const normalizedProductId = getProductKey(productIdentifier);
    if (!normalizedProductId) return;

    try {
      const identifier = getIdentifier();
      const response = await fetch(`${API_URL}/cart/${encodeURIComponent(identifier)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: normalizedProductId,
          quantity,
          size: size || ''
        })
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart from server
        setLastAddedProductId(normalizedProductId);
        setIsAddedModalOpen(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id) => {
    // We need productId and size to delete from the API, since our frontend currently passes the `id` (which is now the DB id).
    // Let's find the item first:
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    try {
      const identifier = getIdentifier();
      const response = await fetch(
        `${API_URL}/cart/${encodeURIComponent(identifier)}/${encodeURIComponent(item.productId)}?size=${encodeURIComponent(item.size || '')}`, 
        { method: 'DELETE' }
      );

      if (response.ok) {
        setCartItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    try {
      const identifier = getIdentifier();
      const response = await fetch(`${API_URL}/cart/${encodeURIComponent(identifier)}/${encodeURIComponent(item.productId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity,
          size: item.size || ''
        })
      });

      if (response.ok) {
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const identifier = getIdentifier();
      const response = await fetch(`${API_URL}/cart/${encodeURIComponent(identifier)}`, { method: 'DELETE' });
      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const closeAddedModal = () => setIsAddedModalOpen(false);

  return (
    <CartContext.Provider value={{
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
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

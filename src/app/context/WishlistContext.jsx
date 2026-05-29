import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getProductIdentifiers, getProductKey } from '../utils/product';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const { user } = useAuth();

  const getWishlistKey = () => {
    return user && user.email ? `ameya_wishlist_${user.email}` : 'ameya_wishlist_guest';
  };

  const persistWishlist = items => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getWishlistKey(), JSON.stringify(items));
    }
  };

  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ameya_wishlist_guest');
      return saved ? [...new Set(JSON.parse(saved).map(item => String(item)))] : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getWishlistKey());
      if (saved) {
        setWishlistItems([...new Set(JSON.parse(saved).map(item => String(item)))]);
      } else {
        setWishlistItems([]);
      }
    }
  }, [user]);

  const commitWishlistUpdate = updater => {
    setWishlistItems(prev => {
      const nextItems = typeof updater === 'function' ? updater(prev) : updater;
      persistWishlist(nextItems);
      return nextItems;
    });
  };

  const toggleWishlist = productIdentifier => {
    const normalizedProductId = getProductKey(productIdentifier);
    const matchingIdentifiers = getProductIdentifiers(productIdentifier);

    if (!normalizedProductId) return;

    commitWishlistUpdate(prev => {
      const alreadySaved = prev.some(id => matchingIdentifiers.includes(String(id)));

      if (alreadySaved) {
        toast.success('Removed from wishlist');
        return prev.filter(id => !matchingIdentifiers.includes(String(id)));
      }

      toast.success('Added to wishlist');
      return [...prev.filter(id => !matchingIdentifiers.includes(String(id))), normalizedProductId];
    });
  };

  const isInWishlist = productIdentifier => {
    const matchingIdentifiers = getProductIdentifiers(productIdentifier);
    return wishlistItems.some(id => matchingIdentifiers.includes(String(id)));
  };

  const clearWishlist = () => {
    commitWishlistUpdate([]);
  };

  const wishlistCount = wishlistItems.length;

  return <WishlistContext.Provider value={{
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount
  }}>
      {children}
    </WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
}

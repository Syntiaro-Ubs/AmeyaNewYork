import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
const WishlistContext = createContext(undefined);
export function WishlistProvider({
  children
}) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ameya_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem('ameya_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  const toggleWishlist = productId => {
    setWishlistItems(prev => {
      if (prev.includes(productId)) {
        toast.success('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Added to wishlist');
        return [...prev, productId];
      }
    });
  };
  const isInWishlist = productId => wishlistItems.includes(productId);
  const clearWishlist = () => {
    setWishlistItems([]);
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

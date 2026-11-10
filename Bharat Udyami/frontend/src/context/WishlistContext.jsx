import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('bharatudyami_wishlist');
      return saved ? JSON.parse(saved) : [1, 2, 3];
    } catch {
      return [1, 2, 3];
    }
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('bharatudyami_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetchWishlist();
      if (res.success && res.wishlist) {
        setWishlistItems(res.wishlist);
        setWishlistIds(res.wishlist.map(i => i.id));
      }
    } catch (err) {
      console.warn("Could not sync wishlist with server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    if (!product || !product.id) return;
    const isSaved = wishlistIds.includes(product.id);

    if (isSaved) {
      setWishlistIds(prev => prev.filter(id => id !== product.id));
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      if (isAuthenticated) {
        try {
          await apiRemoveFromWishlist(product.id);
        } catch (e) {
          console.warn(e);
        }
      }
    } else {
      setWishlistIds(prev => [...prev, product.id]);
      setWishlistItems(prev => [product, ...prev]);
      if (isAuthenticated) {
        try {
          await apiAddToWishlist(product.id);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
        loading,
        loadWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

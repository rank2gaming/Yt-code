import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useAuth, db } from './AuthContext';
import { ref, onValue, set, get } from 'firebase/database';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'ybt-store-wishlist';

const getLocalWishlist = (): string[] => {
    try {
        const items = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error('Error reading wishlist from localStorage', error);
        return [];
    }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>(getLocalWishlist);

  useEffect(() => {
    if (currentUser) {
      const wishlistDbRef = ref(db, `wishlists/${currentUser.uid}`);
      
      // One-time merge of local and DB wishlist on login
      get(wishlistDbRef).then(snapshot => {
        const dbWishlist: string[] = snapshot.val() || [];
        const localWishlist = getLocalWishlist();
        const mergedWishlist = Array.from(new Set([...dbWishlist, ...localWishlist]));
        
        set(wishlistDbRef, mergedWishlist);
        window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
      });
      
      // Listen for real-time updates from DB
      const unsubscribe = onValue(wishlistDbRef, (snapshot) => {
          const updatedWishlist = snapshot.val() || [];
          setWishlist(updatedWishlist);
      });
      
      return () => unsubscribe();
      
    } else {
      // For logged-out user, read from local storage
      setWishlist(getLocalWishlist());
    }
  }, [currentUser]);

  // For logged-out users, sync state to local storage whenever it changes
  useEffect(() => {
    if (!currentUser) {
      try {
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error('Error writing wishlist to localStorage', error);
      }
    }
  }, [wishlist, currentUser]);

  const addToWishlist = useCallback((productId: string) => {
    const updatedWishlist = Array.from(new Set([...wishlist, productId]));
    if (currentUser) {
      const wishlistDbRef = ref(db, `wishlists/${currentUser.uid}`);
      set(wishlistDbRef, updatedWishlist);
    } else {
      setWishlist(updatedWishlist);
    }
  }, [wishlist, currentUser]);

  const removeFromWishlist = useCallback((productId: string) => {
    const updatedWishlist = wishlist.filter(id => id !== productId);
    if (currentUser) {
      const wishlistDbRef = ref(db, `wishlists/${currentUser.uid}`);
      set(wishlistDbRef, updatedWishlist);
    } else {
      setWishlist(updatedWishlist);
    }
  }, [wishlist, currentUser]);
  
  const isProductInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isProductInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
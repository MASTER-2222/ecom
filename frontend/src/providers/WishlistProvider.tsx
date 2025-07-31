import React from 'react';
import WishlistContext, { useWishlistState } from '@/hooks/useWishlist';

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const wishlistState = useWishlistState();

  return (
    <WishlistContext.Provider value={wishlistState}>
      {children}
    </WishlistContext.Provider>
  );
};
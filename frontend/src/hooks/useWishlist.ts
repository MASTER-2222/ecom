import { useState, useEffect, createContext, useContext } from 'react';
import { Wishlist, WishlistItem, Product } from '@/types';
import { wishlistAPI } from '@/backend/api';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

interface WishlistContextType {
  wishlist: Wishlist | null;
  wishlistProducts: Product[];
  loading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getWishlistItemCount: () => number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const useWishlistState = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlist(null);
      setWishlistProducts([]);
    }
  }, [isAuthenticated]);

  const refreshWishlist = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await wishlistAPI.getWishlistWithProducts();
      setWishlist(data.wishlist);
      setWishlistProducts(data.products);
    } catch (error: any) {
      // Don't show error toast for 404 (empty wishlist)
      if (error.response?.status !== 404) {
        console.error('Failed to fetch wishlist:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    try {
      setLoading(true);
      const updatedWishlist = await wishlistAPI.addToWishlist(product.id);
      setWishlist(updatedWishlist);
      
      // Add product to local products array
      if (!wishlistProducts.find(p => p.id === product.id)) {
        setWishlistProducts(prev => [...prev, product]);
      }
      
      toast.success(`${product.title} added to wishlist`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to wishlist';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const updatedWishlist = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(updatedWishlist);
      
      // Remove product from local products array
      setWishlistProducts(prev => prev.filter(p => p.id !== productId));
      
      const product = wishlistProducts.find(p => p.id === productId);
      toast.success(`${product?.title || 'Item'} removed from wishlist`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item from wishlist';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product: Product): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Please sign in to manage your wishlist');
      return;
    }

    try {
      setLoading(true);
      const result = await wishlistAPI.toggleWishlist(product.id);
      setWishlist(result.wishlist);
      
      if (result.added) {
        // Add product to local products array
        if (!wishlistProducts.find(p => p.id === product.id)) {
          setWishlistProducts(prev => [...prev, product]);
        }
        toast.success(`${product.title} added to wishlist`);
      } else {
        // Remove product from local products array
        setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
        toast.success(`${product.title} removed from wishlist`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const clearedWishlist = await wishlistAPI.clearWishlist();
      setWishlist(clearedWishlist);
      setWishlistProducts([]);
      toast.success('Wishlist cleared');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist?.items.some(item => item.productId === productId) || false;
  };

  const getWishlistItemCount = (): number => {
    return wishlist?.items.length || 0;
  };

  return {
    wishlist,
    wishlistProducts,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItemCount,
    refreshWishlist,
  };
};

export default WishlistContext;
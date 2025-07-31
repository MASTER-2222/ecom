import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

interface RecentlyViewedProduct {
  id: string;
  name: string;
  title: string;
  price: number;
  originalPrice?: number;
  brand: string;
  thumbnail?: string;
  images: string[];
  rating: number;
  averageRating?: number;
  slug?: string;
  viewedAt: number;
}

const STORAGE_KEY = 'ritkart_recently_viewed';
const MAX_RECENTLY_VIEWED = 12;

export const useRecentlyViewed = () => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<RecentlyViewedProduct[]>([]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Sort by viewedAt descending and ensure we don't have too many
            const sorted = parsed
              .sort((a, b) => b.viewedAt - a.viewedAt)
              .slice(0, MAX_RECENTLY_VIEWED);
            setRecentlyViewedProducts(sorted);
          }
        }
      } catch (error) {
        console.error('Failed to load recently viewed products:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadRecentlyViewed();
  }, []);

  // Save to localStorage whenever recently viewed products change
  useEffect(() => {
    if (recentlyViewedProducts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewedProducts));
    }
  }, [recentlyViewedProducts]);

  // Add a product to recently viewed
  const addToRecentlyViewed = useCallback((product: Product) => {
    const recentProduct: RecentlyViewedProduct = {
      id: product.id,
      name: product.name,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      brand: product.brand,
      thumbnail: product.thumbnail,
      images: product.images,
      rating: product.rating || product.averageRating || 0,
      averageRating: product.averageRating,
      slug: product.slug,
      viewedAt: Date.now(),
    };

    setRecentlyViewedProducts(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(p => p.id !== product.id);
      
      // Add to beginning and limit to MAX_RECENTLY_VIEWED
      const updated = [recentProduct, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      
      return updated;
    });
  }, []);

  // Remove a product from recently viewed
  const removeFromRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  // Clear all recently viewed products
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewedProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get recently viewed products (excluding a specific product ID, useful for product detail pages)
  const getRecentlyViewed = useCallback((excludeId?: string, limit?: number) => {
    let products = recentlyViewedProducts;
    
    if (excludeId) {
      products = products.filter(p => p.id !== excludeId);
    }
    
    if (limit) {
      products = products.slice(0, limit);
    }
    
    return products;
  }, [recentlyViewedProducts]);

  // Check if a product is in recently viewed
  const isRecentlyViewed = useCallback((productId: string) => {
    return recentlyViewedProducts.some(p => p.id === productId);
  }, [recentlyViewedProducts]);

  return {
    recentlyViewedProducts,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
    isRecentlyViewed,
    recentlyViewedCount: recentlyViewedProducts.length,
    maxRecentlyViewed: MAX_RECENTLY_VIEWED,
  };
};
import { useState, useEffect, useContext, createContext } from 'react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ComparisonContextType {
  comparedProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  canAddMore: boolean;
  comparisonCount: number;
  maxComparisonItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export const useComparisonLogic = () => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const maxComparisonItems = 4; // Maximum number of products to compare

  // Load comparison data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ritkart_comparison');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setComparedProducts(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Failed to parse comparison data:', error);
        localStorage.removeItem('ritkart_comparison');
      }
    }
  }, []);

  // Save to localStorage whenever comparison changes
  useEffect(() => {
    localStorage.setItem('ritkart_comparison', JSON.stringify(comparedProducts));
  }, [comparedProducts]);

  const addToComparison = (product: Product) => {
    if (comparedProducts.length >= maxComparisonItems) {
      toast.error(`You can only compare up to ${maxComparisonItems} products at once`);
      return;
    }

    if (isInComparison(product.id)) {
      toast.info('Product is already in comparison');
      return;
    }

    setComparedProducts(prev => [...prev, product]);
    toast.success(`${product.name || product.title} added to comparison`);
  };

  const removeFromComparison = (productId: string) => {
    const product = comparedProducts.find(p => p.id === productId);
    setComparedProducts(prev => prev.filter(p => p.id !== productId));
    
    if (product) {
      toast.success(`${product.name || product.title} removed from comparison`);
    }
  };

  const clearComparison = () => {
    setComparedProducts([]);
    toast.success('Comparison cleared');
  };

  const isInComparison = (productId: string): boolean => {
    return comparedProducts.some(p => p.id === productId);
  };

  const canAddMore = comparedProducts.length < maxComparisonItems;
  const comparisonCount = comparedProducts.length;

  return {
    comparedProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
    comparisonCount,
    maxComparisonItems,
  };
};

export { ComparisonContext };
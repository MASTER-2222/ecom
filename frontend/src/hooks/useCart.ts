import { useState, useEffect, createContext, useContext } from 'react';
import { Cart, CartItem, Product } from '@/types';
import { cartAPI } from '@/backend/api';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (product: Product, quantity?: number, options?: Record<string, string>) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: string) => boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useCartState = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCart(null);
    }
  }, [isAuthenticated]);

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const cartData = await cartAPI.getCart();
      setCart(cartData);
    } catch (error: any) {
      // Don't show error toast for 404 (empty cart)
      if (error.response?.status !== 404) {
        console.error('Failed to fetch cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    product: Product, 
    quantity: number = 1, 
    options?: Record<string, string>
  ): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const updatedCart = await cartAPI.addToCart(product.id, quantity, options);
      setCart(updatedCart);
      toast.success(`${product.title} added to cart`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      
      const updatedCart = await cartAPI.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      toast.success('Cart updated');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart item';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const updatedCart = await cartAPI.removeFromCart(itemId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = (): number => {
    return cart?.totalItems || 0;
  };

  const getCartTotal = (): number => {
    return cart?.total || 0;
  };

  const isInCart = (productId: string): boolean => {
    return cart?.items.some(item => item.product.id === productId) || false;
  };

  return {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    refreshCart,
  };
};

export default CartContext;
'use client';

import { supabase } from './supabase';

// Order Management
export const createOrder = async (orderData: {
  totalAmount: number;
  shippingAddress: any;
  items: Array<{
    productId: string;
    productName: string;
    productImage?: string;
    price: number;
    quantity: number;
  }>;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const orderNumber = 'ORD' + Date.now().toString();
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_amount: orderData.totalAmount,
        status: 'confirmed',
        payment_status: 'paid',
        shipping_address: orderData.shippingAddress
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Wishlist Management
export const addToWishlist = async (product: {
  id: string;
  name: string;
  image?: string;
  price: number;
  category: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist')
      .upsert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        price: product.price,
        category: product.category
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const getUserWishlist = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Save for Later Management
export const saveForLater = async (product: {
  id: string;
  name: string;
  image?: string;
  price: number;
  category: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_items')
      .upsert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        price: product.price,
        category: product.category
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving for later:', error);
    throw error;
  }
};

export const getSavedItems = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching saved items:', error);
    throw error;
  }
};

export const removeSavedItem = async (productId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing saved item:', error);
    throw error;
  }
};

// Product Reviews Management
export const addProductReview = async (productId: string, rating: number, comment: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('product_reviews')
      .upsert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
        verified_purchase: false
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getProductReviews = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// User Preferences Management
export const updateUserPreferences = async (preferences: {
  preferredCategories: string[];
  priceRangeMin: number;
  priceRangeMax: number;
  favoriteBrands: string[];
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        preferred_categories: preferences.preferredCategories,
        price_range_min: preferences.priceRangeMin,
        price_range_max: preferences.priceRangeMax,
        favorite_brands: preferences.favoriteBrands
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

export const getUserPreferences = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};
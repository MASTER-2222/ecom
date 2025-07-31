// Enhanced API client with caching and performance monitoring
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import {
  User, Product, Category, Cart, Order, Review, Wishlist,
  ApiResponse, PaginatedResponse, LoginRequest, RegisterRequest,
  AuthResponse, SearchParams, Address
} from '../types';
import {
  apiCache, productCache, userCache, categoryCache,
  cachedFetch, cachedProductFetch, cachedCategoryFetch,
  invalidateProductCache, invalidateUserCache, invalidateCategoryCache
} from '../utils/apiCache';
import { performanceMonitor, measureApiCall } from '../utils/performance';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create enhanced axios instance
const enhancedApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with performance tracking
enhancedApiClient.interceptors.request.use(
  (config) => {
    // Add performance tracking
    config.metadata = { startTime: performance.now() };
    
    // Add auth token
    const token = localStorage.getItem('ritkart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with caching and performance tracking
enhancedApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Track API performance
    const endTime = performance.now();
    const startTime = response.config.metadata?.startTime || endTime;
    const duration = endTime - startTime;
    
    performanceMonitor.recordMetric(
      `API: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      duration,
      {
        status: response.status,
        size: JSON.stringify(response.data).length,
        cached: false,
      }
    );
    
    return response;
  },
  (error: AxiosError) => {
    // Track failed API calls
    const endTime = performance.now();
    const startTime = error.config?.metadata?.startTime || endTime;
    const duration = endTime - startTime;
    
    performanceMonitor.recordMetric(
      `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      duration,
      {
        status: error.response?.status || 0,
        error: error.message,
      }
    );
    
    if (error.response?.status === 401) {
      // Clear all caches on unauthorized
      localStorage.removeItem('ritkart_token');
      localStorage.removeItem('ritkart_user');
      invalidateUserCache();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API utility functions
const createCachedApiCall = <T>(
  apiCall: (...args: any[]) => Promise<T>,
  cacheKey: string,
  cache = apiCache,
  ttl?: number
) => {
  return measureApiCall(cacheKey, async (...args: any[]): Promise<T> => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    
    // Try cache first for GET-like operations
    const cached = cache.get<T>(key);
    if (cached) {
      performanceMonitor.recordMetric(
        `Cache Hit: ${cacheKey}`,
        0,
        { cached: true }
      );
      return cached;
    }
    
    // Execute API call
    const result = await apiCall(...args);
    
    // Cache the result
    cache.set(key, result, undefined, ttl);
    
    return result;
  });
};

// Enhanced Auth API with caching
export const enhancedAuthAPI = {
  login: measureApiCall('Auth Login', async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await enhancedApiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    // Invalidate user cache on login
    invalidateUserCache();
    return response.data.data;
  }),

  register: measureApiCall('Auth Register', async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await enhancedApiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data;
  }),

  logout: measureApiCall('Auth Logout', async (): Promise<void> => {
    await enhancedApiClient.post('/auth/logout');
    localStorage.removeItem('ritkart_token');
    localStorage.removeItem('ritkart_user');
    // Clear all caches on logout
    invalidateUserCache();
    invalidateProductCache();
    invalidateCategoryCache();
  }),

  getProfile: createCachedApiCall(
    async (): Promise<User> => {
      const response = await enhancedApiClient.get<ApiResponse<User>>('/auth/profile');
      return response.data.data;
    },
    'User Profile',
    userCache,
    30 * 60 * 1000 // 30 minutes
  ),

  updateProfile: measureApiCall('Update Profile', async (userData: Partial<User>): Promise<User> => {
    const response = await enhancedApiClient.put<ApiResponse<User>>('/auth/profile', userData);
    // Invalidate user cache on update
    invalidateUserCache();
    return response.data.data;
  }),
};

// Enhanced Products API with aggressive caching
export const enhancedProductsAPI = {
  getProducts: createCachedApiCall(
    async (params?: SearchParams): Promise<PaginatedResponse<Product>> => {
      const response = await enhancedApiClient.get<PaginatedResponse<Product>>('/products', { params });
      return response.data;
    },
    'Products List',
    productCache,
    10 * 60 * 1000 // 10 minutes
  ),

  getProduct: createCachedApiCall(
    async (id: string): Promise<Product> => {
      const response = await enhancedApiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    },
    'Product Detail',
    productCache,
    15 * 60 * 1000 // 15 minutes
  ),

  getFeaturedProducts: createCachedApiCall(
    async (): Promise<Product[]> => {
      const response = await enhancedApiClient.get<ApiResponse<Product[]>>('/products/featured');
      return response.data.data;
    },
    'Featured Products',
    productCache,
    20 * 60 * 1000 // 20 minutes
  ),

  getProductsByCategory: createCachedApiCall(
    async (categoryId: string, params?: SearchParams): Promise<PaginatedResponse<Product>> => {
      const response = await enhancedApiClient.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, { params });
      return response.data;
    },
    'Products By Category',
    productCache,
    10 * 60 * 1000
  ),

  searchProducts: createCachedApiCall(
    async (query: string, params?: SearchParams): Promise<PaginatedResponse<Product>> => {
      const response = await enhancedApiClient.get<PaginatedResponse<Product>>('/products/search', {
        params: { q: query, ...params },
      });
      return response.data;
    },
    'Product Search',
    productCache,
    5 * 60 * 1000 // 5 minutes for search results
  ),

  getSearchSuggestions: createCachedApiCall(
    async (query: string, limit: number = 10): Promise<string[]> => {
      const response = await enhancedApiClient.get<string[]>('/products/search/suggestions', {
        params: { q: query, limit },
      });
      return response.data;
    },
    'Search Suggestions',
    apiCache,
    2 * 60 * 1000 // 2 minutes for suggestions
  ),

  getSearchAutocomplete: createCachedApiCall(
    async (query: string, limit: number = 5): Promise<{
      products: string[];
      brands: string[];
      categories: string[];
      tags: string[];
    }> => {
      const response = await enhancedApiClient.get('/products/search/autocomplete', {
        params: { q: query, limit },
      });
      return response.data;
    },
    'Search Autocomplete',
    apiCache,
    1 * 60 * 1000 // 1 minute for autocomplete
  ),

  // Non-cached write operations
  createProduct: measureApiCall('Create Product', async (productData: Partial<Product>): Promise<Product> => {
    const response = await enhancedApiClient.post<ApiResponse<Product>>('/admin/products', productData);
    invalidateProductCache(); // Invalidate cache after creation
    return response.data.data;
  }),

  updateProduct: measureApiCall('Update Product', async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await enhancedApiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, productData);
    invalidateProductCache(id); // Invalidate specific product cache
    return response.data.data;
  }),

  deleteProduct: measureApiCall('Delete Product', async (id: string): Promise<void> => {
    await enhancedApiClient.delete(`/admin/products/${id}`);
    invalidateProductCache(id); // Invalidate specific product cache
  }),
};

// Enhanced Categories API with long-term caching
export const enhancedCategoriesAPI = {
  getCategories: createCachedApiCall(
    async (): Promise<Category[]> => {
      const response = await enhancedApiClient.get<ApiResponse<Category[]>>('/categories');
      return response.data.data;
    },
    'Categories List',
    categoryCache,
    60 * 60 * 1000 // 1 hour
  ),

  getCategory: createCachedApiCall(
    async (id: string): Promise<Category> => {
      const response = await enhancedApiClient.get<ApiResponse<Category>>(`/categories/${id}`);
      return response.data.data;
    },
    'Category Detail',
    categoryCache,
    60 * 60 * 1000 // 1 hour
  ),

  getCategoryBySlug: createCachedApiCall(
    async (slug: string): Promise<Category> => {
      const response = await enhancedApiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
      return response.data.data;
    },
    'Category By Slug',
    categoryCache,
    60 * 60 * 1000 // 1 hour
  ),
};

// Enhanced Cart API (no caching for real-time data)
export const enhancedCartAPI = {
  getCart: measureApiCall('Get Cart', async (): Promise<Cart> => {
    const response = await enhancedApiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  }),

  addToCart: measureApiCall('Add To Cart', async (productId: string, quantity: number, options?: Record<string, string>): Promise<Cart> => {
    const response = await enhancedApiClient.post<ApiResponse<Cart>>('/cart/add', {
      productId,
      quantity,
      options,
    });
    return response.data.data;
  }),

  updateCartItem: measureApiCall('Update Cart Item', async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await enhancedApiClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data.data;
  }),

  removeFromCart: measureApiCall('Remove From Cart', async (itemId: string): Promise<Cart> => {
    const response = await enhancedApiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data.data;
  }),

  clearCart: measureApiCall('Clear Cart', async (): Promise<void> => {
    await enhancedApiClient.delete('/cart/clear');
  }),
};

// Enhanced Orders API
export const enhancedOrdersAPI = {
  createOrder: measureApiCall('Create Order', async (orderData: {
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
  }): Promise<Order> => {
    const response = await enhancedApiClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  }),

  getOrders: createCachedApiCall(
    async (page?: number, limit?: number): Promise<PaginatedResponse<Order>> => {
      const response = await enhancedApiClient.get<PaginatedResponse<Order>>('/orders', {
        params: { page, limit },
      });
      return response.data;
    },
    'User Orders',
    userCache,
    5 * 60 * 1000 // 5 minutes
  ),

  getOrder: createCachedApiCall(
    async (id: string): Promise<Order> => {
      const response = await enhancedApiClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return response.data.data;
    },
    'Order Detail',
    userCache,
    10 * 60 * 1000 // 10 minutes
  ),

  cancelOrder: measureApiCall('Cancel Order', async (id: string): Promise<Order> => {
    const response = await enhancedApiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
    invalidateUserCache(); // Invalidate user cache after cancellation
    return response.data.data;
  }),
};

// Enhanced Wishlist API (minimal caching due to frequent updates)
export const enhancedWishlistAPI = {
  getWishlist: createCachedApiCall(
    async (): Promise<Wishlist> => {
      const response = await enhancedApiClient.get<Wishlist>('/wishlist');
      return response.data;
    },
    'Wishlist',
    userCache,
    2 * 60 * 1000 // 2 minutes
  ),

  addToWishlist: measureApiCall('Add To Wishlist', async (productId: string): Promise<Wishlist> => {
    const response = await enhancedApiClient.post<Wishlist>('/wishlist/items', { productId });
    userCache.invalidatePattern('Wishlist'); // Invalidate wishlist cache
    return response.data;
  }),

  removeFromWishlist: measureApiCall('Remove From Wishlist', async (productId: string): Promise<Wishlist> => {
    const response = await enhancedApiClient.delete<Wishlist>(`/wishlist/items/${productId}`);
    userCache.invalidatePattern('Wishlist'); // Invalidate wishlist cache
    return response.data;
  }),

  toggleWishlist: measureApiCall('Toggle Wishlist', async (productId: string): Promise<{ wishlist: Wishlist; added: boolean; inWishlist: boolean }> => {
    const response = await enhancedApiClient.post<{ wishlist: Wishlist; added: boolean; inWishlist: boolean }>(`/wishlist/items/${productId}/toggle`);
    userCache.invalidatePattern('Wishlist'); // Invalidate wishlist cache
    return response.data;
  }),
};

// Enhanced Reviews API
export const enhancedReviewsAPI = {
  getProductReviews: createCachedApiCall(
    async (productId: string, page?: number, limit?: number): Promise<PaginatedResponse<Review>> => {
      const response = await enhancedApiClient.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
        params: { page, limit },
      });
      return response.data;
    },
    'Product Reviews',
    productCache,
    10 * 60 * 1000 // 10 minutes
  ),

  createReview: measureApiCall('Create Review', async (productId: string, reviewData: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }): Promise<Review> => {
    const response = await enhancedApiClient.post<ApiResponse<Review>>(`/products/${productId}/reviews`, reviewData);
    productCache.invalidatePattern(`/products/${productId}/reviews`); // Invalidate reviews cache
    return response.data.data;
  }),
};

// Performance utilities
export const getApiPerformanceStats = () => {
  return performanceMonitor.getSummary();
};

export const getCacheStats = () => {
  return {
    api: apiCache.getStats(),
    products: productCache.getStats(),
    users: userCache.getStats(),
    categories: categoryCache.getStats(),
  };
};

export const preloadCriticalData = async () => {
  try {
    // Preload critical data in parallel
    await Promise.allSettled([
      enhancedCategoriesAPI.getCategories(),
      enhancedProductsAPI.getFeaturedProducts(),
    ]);
    
    performanceMonitor.recordMetric('Critical Data Preload', performance.now());
  } catch (error) {
    console.warn('Failed to preload critical data:', error);
  }
};

// Export enhanced API client
export default enhancedApiClient;
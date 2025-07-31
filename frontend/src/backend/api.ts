// RitKART Frontend API Configuration and Client
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  User, Product, Category, Cart, Order, Review, Wishlist,
  ApiResponse, PaginatedResponse, LoginRequest, RegisterRequest,
  AuthResponse, SearchParams, Address
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('ritkart_token');
      localStorage.removeItem('ritkart_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('ritkart_token');
    localStorage.removeItem('ritkart_user');
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('ritkart_refresh_token');
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data.token;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data.data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params?: SearchParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/featured');
    return response.data.data;
  },

  getProductsByCategory: async (categoryId: string, params?: SearchParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  searchProducts: async (query: string, params?: SearchParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data.data;
  },
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addToCart: async (productId: string, quantity: number, options?: Record<string, string>): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart/add', {
      productId,
      quantity,
      options,
    });
    return response.data.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/clear');
  },
};

// Orders API
export const ordersAPI = {
  createOrder: async (orderData: {
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
  }): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  getOrders: async (page?: number, limit?: number): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: async (productId: string, page?: number, limit?: number): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  createReview: async (productId: string, reviewData: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(`/products/${productId}/reviews`, reviewData);
    return response.data.data;
  },

  updateReview: async (reviewId: string, reviewData: Partial<Review>): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${reviewId}`, reviewData);
    return response.data.data;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  markReviewHelpful: async (reviewId: string): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(`/reviews/${reviewId}/helpful`);
    return response.data.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: async (): Promise<Wishlist> => {
    const response = await apiClient.get<ApiResponse<Wishlist>>('/wishlist');
    return response.data.data;
  },

  addToWishlist: async (productId: string): Promise<Wishlist> => {
    const response = await apiClient.post<ApiResponse<Wishlist>>('/wishlist/add', { productId });
    return response.data.data;
  },

  removeFromWishlist: async (productId: string): Promise<Wishlist> => {
    const response = await apiClient.delete<ApiResponse<Wishlist>>(`/wishlist/remove/${productId}`);
    return response.data.data;
  },
};

// Admin API
export const adminAPI = {
  // Users
  getUsers: async (page?: number, limit?: number): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  // Products
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/admin/products', productData);
    return response.data.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, productData);
    return response.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },

  // Orders
  getAllOrders: async (page?: number, limit?: number): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/admin/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status });
    return response.data.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post<ApiResponse<{ url: string }>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data.url;
  },
};

// Utility functions
export const setAuthToken = (token: string): void => {
  localStorage.setItem('ritkart_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('ritkart_token');
};

export const setUser = (user: User): void => {
  localStorage.setItem('ritkart_user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('ritkart_user');
  return userStr ? JSON.parse(userStr) : null;
};

export default apiClient; 
// RitKART Frontend2 - Spring Boot API Client
import axios, { AxiosResponse, AxiosError } from 'axios';

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'CUSTOMER' | 'ADMIN';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  categoryId: string;
  brand?: string;
  stockQuantity: number;
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
const JWT_STORAGE_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'ritkart_token';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
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
    console.warn('API Error:', error.message, error.response?.status);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(JWT_STORAGE_KEY);
      // Only redirect if we're not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    
    // Store token in localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem(JWT_STORAGE_KEY, response.data.data.token);
    }
    
    return response.data;
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    // Store token in localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem(JWT_STORAGE_KEY, response.data.data.token);
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(JWT_STORAGE_KEY);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<AuthResponse>('/auth/profile');
    return response.data.data.user;
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(JWT_STORAGE_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(JWT_STORAGE_KEY);
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  getFeaturedProducts: async (page: number = 0, size: number = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/featured', {
      params: { page, size }
    });
    return response.data;
  },

  searchProducts: async (query: string, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  getProductsByCategory: async (categoryId: string, params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, { params });
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
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addToCart: async (productId: string, quantity: number = 1): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart/add', {
      productId,
      quantity,
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

  uploadImageFromUrl: async (url: string): Promise<string> => {
    const response = await apiClient.post<ApiResponse<{ url: string }>>('/upload/image/from-url', {
      url,
    });
    
    return response.data.data.url;
  },
};

export default apiClient;
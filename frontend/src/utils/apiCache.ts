interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default 5 minutes
  maxSize?: number; // Maximum number of entries
  persist?: boolean; // Whether to persist in localStorage
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTTL: number;
  private persist: boolean;
  private storageKey = 'ritkart_api_cache';

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes
    this.persist = options.persist || false;
    
    if (this.persist) {
      this.loadFromStorage();
    }
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLRU(): void {
    if (this.cache.size < this.maxSize) return;
    
    // Remove oldest entry
    const oldestKey = this.cache.keys().next().value;
    this.cache.delete(oldestKey);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          this.cache.set(key, value as CacheEntry<any>);
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (!this.persist) return;
    
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  set<T>(
    url: string, 
    data: T, 
    params?: Record<string, any>,
    customTTL?: number
  ): void {
    this.evictLRU();
    
    const key = this.generateKey(url, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTTL || this.defaultTTL,
    };
    
    this.cache.set(key, entry);
    this.saveToStorage();
  }

  get<T>(url: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(url, params);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    return entry.data as T;
  }

  has(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params);
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }
    
    return true;
  }

  invalidate(url: string, params?: Record<string, any>): void {
    const key = this.generateKey(url, params);
    this.cache.delete(key);
    this.saveToStorage();
  }

  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    if (this.persist) {
      localStorage.removeItem(this.storageKey);
    }
  }

  cleanup(): void {
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      this.saveToStorage();
    }
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: string;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses to calculate
      memoryUsage: `${Math.round(JSON.stringify(Object.fromEntries(this.cache)).length / 1024)}KB`,
    };
  }
}

// Create default cache instances
export const apiCache = new APICache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  persist: true,
});

// Specific cache for different data types with different TTLs
export const productCache = new APICache({
  ttl: 15 * 60 * 1000, // 15 minutes for products
  maxSize: 50,
  persist: true,
});

export const userCache = new APICache({
  ttl: 30 * 60 * 1000, // 30 minutes for user data
  maxSize: 20,
  persist: false, // Don't persist sensitive user data
});

export const categoryCache = new APICache({
  ttl: 60 * 60 * 1000, // 1 hour for categories (they change less frequently)
  maxSize: 30,
  persist: true,
});

// Cache decorator for API functions
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cache: APICache,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }
    
    // Execute function and cache result
    try {
      const result = await fn(...args);
      cache.set(key, result, undefined, ttl);
      return result;
    } catch (error) {
      // Don't cache errors, but still throw them
      throw error;
    }
  }) as T;
}

// Utility to create cache-aware fetch function
export const createCachedFetch = (
  cache: APICache = apiCache,
  defaultTTL?: number
) => {
  return async <T>(
    url: string, 
    options: RequestInit & { params?: Record<string, any>; cacheTTL?: number } = {}
  ): Promise<T> => {
    const { params, cacheTTL, ...fetchOptions } = options;
    const method = fetchOptions.method || 'GET';
    
    // Only cache GET requests
    if (method.toUpperCase() === 'GET') {
      const cached = cache.get<T>(url, params);
      if (cached) {
        return cached;
      }
    }
    
    // Build final URL with params
    const finalUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
    
    const response = await fetch(finalUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: T = await response.json();
    
    // Cache successful GET responses
    if (method.toUpperCase() === 'GET') {
      cache.set(url, data, params, cacheTTL || defaultTTL);
    }
    
    return data;
  };
};

// Pre-configured cached fetch instances
export const cachedFetch = createCachedFetch(apiCache);
export const cachedProductFetch = createCachedFetch(productCache);
export const cachedCategoryFetch = createCachedFetch(categoryCache);

// Cache invalidation helpers
export const invalidateProductCache = (productId?: string) => {
  if (productId) {
    productCache.invalidatePattern(`/products/${productId}`);
  } else {
    productCache.invalidatePattern('/products');
  }
};

export const invalidateUserCache = () => {
  userCache.clear();
};

export const invalidateCategoryCache = () => {
  categoryCache.clear();
};

export const invalidateAllCaches = () => {
  apiCache.clear();
  productCache.clear();
  userCache.clear();
  categoryCache.clear();
};
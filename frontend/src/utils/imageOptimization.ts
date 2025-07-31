interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  lazy?: boolean;
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  optimizationOptions?: ImageOptimizationOptions;
  fallbackSrc?: string;
}

// Utility function to get optimized image URL
export const getOptimizedImageUrl = (
  src: string, 
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If it's a local image or doesn't support optimization, return as is
  if (src.startsWith('/') || src.startsWith('data:') || src.includes('localhost')) {
    return src;
  }
  
  // For external images, we can add optimization parameters if the service supports it
  // This is a basic implementation - in production, you'd integrate with services like Cloudinary
  const url = new URL(src);
  
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  if (quality !== 80) url.searchParams.set('q', quality.toString());
  if (format !== 'webp') url.searchParams.set('f', format);
  
  return url.toString();
};

// Image size presets for common use cases
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 },
  productCard: { width: 280, height: 280 },
  productDetail: { width: 500, height: 500 },
  productGallery: { width: 800, height: 800 },
} as const;

// Generate responsive image srcSet
export const generateResponsiveSrcSet = (
  src: string,
  sizes: { width: number; density?: number }[]
): string => {
  return sizes
    .map(({ width, density = 1 }) => {
      const optimizedSrc = getOptimizedImageUrl(src, { width: width * density });
      return `${optimizedSrc} ${density}x`;
    })
    .join(', ');
};

// Preload critical images
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = getOptimizedImageUrl(src, options);
  });
};

// Preload multiple images
export const preloadImages = async (
  images: Array<{ src: string; options?: ImageOptimizationOptions }>
): Promise<void> => {
  const promises = images.map(({ src, options }) => preloadImage(src, options));
  await Promise.all(promises);
};

// Image compression utility for user uploads
export const compressImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Check if WebP is supported
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

// Image caching utilities
class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50; // Maximum number of cached images
  
  set(url: string, blob: string): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(url, blob);
  }
  
  get(url: string): string | undefined {
    return this.cache.get(url);
  }
  
  has(url: string): boolean {
    return this.cache.has(url);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();

// Progressive image loading utility
export const loadImageProgressive = async (
  lowQualitySrc: string,
  highQualitySrc: string,
  onLowQualityLoad?: () => void,
  onHighQualityLoad?: () => void
): Promise<{ lowQuality: string; highQuality: string }> => {
  // Load low quality first
  const lowQualityPromise = preloadImage(lowQualitySrc);
  
  lowQualityPromise.then(() => {
    onLowQualityLoad?.();
  });
  
  // Then load high quality
  const highQualityPromise = preloadImage(highQualitySrc);
  
  highQualityPromise.then(() => {
    onHighQualityLoad?.();
  });
  
  await Promise.all([lowQualityPromise, highQualityPromise]);
  
  return {
    lowQuality: lowQualitySrc,
    highQuality: highQualitySrc,
  };
};
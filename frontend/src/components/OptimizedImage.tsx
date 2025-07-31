import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  getOptimizedImageUrl, 
  generateResponsiveSrcSet, 
  createLazyLoadObserver,
  imageCache,
  IMAGE_SIZES,
  isWebPSupported
} from '@/utils/imageOptimization';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
  preset?: keyof typeof IMAGE_SIZES;
  fallbackSrc?: string;
  placeholder?: 'blur' | 'skeleton' | 'none';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  lazy = true,
  priority = false,
  sizes,
  preset,
  fallbackSrc,
  placeholder = 'skeleton',
  blurDataURL,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check WebP support
  useEffect(() => {
    isWebPSupported().then(setWebpSupported);
  }, []);

  // Get dimensions from preset
  const dimensions = preset ? IMAGE_SIZES[preset] : { width, height };
  const finalWidth = dimensions.width || width;
  const finalHeight = dimensions.height || height;

  // Generate optimized image URL
  const getImageSrc = useCallback((format?: 'webp' | 'jpg' | 'png') => {
    if (hasError && fallbackSrc) return fallbackSrc;
    
    return getOptimizedImageUrl(src, {
      width: finalWidth,
      height: finalHeight,
      quality,
      format: format || (webpSupported ? 'webp' : undefined),
    });
  }, [src, finalWidth, finalHeight, quality, webpSupported, hasError, fallbackSrc]);

  // Generate responsive srcSet
  const srcSet = React.useMemo(() => {
    if (!finalWidth || hasError) return undefined;
    
    const densities = [1, 1.5, 2];
    return densities
      .map(density => {
        const scaledWidth = Math.round(finalWidth * density);
        const optimizedSrc = getOptimizedImageUrl(src, {
          width: scaledWidth,
          height: finalHeight ? Math.round(finalHeight * density) : undefined,
          quality,
          format: webpSupported ? 'webp' : undefined,
        });
        return `${optimizedSrc} ${density}x`;
      })
      .join(', ');
  }, [src, finalWidth, finalHeight, quality, webpSupported, hasError]);

  // Set up lazy loading observer
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = createLazyLoadObserver(
      (entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      },
      { rootMargin: '50px' }
    );

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority, isInView]);

  // Update current src when conditions change
  useEffect(() => {
    if (isInView && webpSupported !== null) {
      setCurrentSrc(getImageSrc());
    }
  }, [isInView, webpSupported, getImageSrc]);

  // Preload critical images
  useEffect(() => {
    if (priority && currentSrc) {
      const img = new Image();
      img.src = currentSrc;
      if (srcSet) {
        img.srcset = srcSet;
      }
    }
  }, [priority, currentSrc, srcSet]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  // Render placeholder
  const renderPlaceholder = () => {
    if (placeholder === 'none') return null;

    if (placeholder === 'blur' && blurDataURL) {
      return (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        />
      );
    }

    if (placeholder === 'skeleton') {
      return (
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      );
    }

    return null;
  };

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ width: finalWidth, height: finalHeight }}
    >
      {renderPlaceholder()}
      
      {(isInView || priority) && (
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      
      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
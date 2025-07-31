import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, X, Star, ShoppingCart, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import WishlistButton from '@/components/WishlistButton';
import ComparisonButton from '@/components/ComparisonButton';
import { cn } from '@/lib/utils';

interface RecentlyViewedProps {
  title?: string;
  showTitle?: boolean;
  excludeProductId?: string;
  limit?: number;
  variant?: 'horizontal' | 'grid';
  showClearAll?: boolean;
  className?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  title = "Recently Viewed",
  showTitle = true,
  excludeProductId,
  limit = 8,
  variant = 'horizontal',
  showClearAll = true,
  className
}) => {
  const { 
    getRecentlyViewed, 
    removeFromRecentlyViewed, 
    clearRecentlyViewed,
    recentlyViewedCount 
  } = useRecentlyViewed();
  
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const products = getRecentlyViewed(excludeProductId, limit);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }
    
    try {
      // Convert recently viewed product to Product type for cart
      const cartProduct = {
        ...product,
        stock: 100, // Assume in stock for recently viewed
        isActive: true,
      };
      await addToCart(cartProduct, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getDiscountPercentage = (product: any) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <Badge variant="secondary" className="ml-2">
              {recentlyViewedCount}
            </Badge>
          </div>
          
          {showClearAll && products.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      )}

      {variant === 'horizontal' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <Card key={product.id} className="flex-shrink-0 w-64 group">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromRecentlyViewed(product.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                      {product.thumbnail || product.images[0] ? (
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt={product.name || product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Link to={`/product/${product.id}`}>
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <WishlistButton 
                      product={product as any} 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white/90 hover:bg-white" 
                    />
                    <ComparisonButton 
                      product={product as any} 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white/90 hover:bg-white" 
                    />
                  </div>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-sm mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name || product.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

                {renderStars(product.rating)}

                <div className="flex items-center gap-2 mt-2 mb-3">
                  <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through text-sm">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {getDiscountPercentage(product) > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      -{getDiscountPercentage(product)}%
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Viewed {formatTimeAgo(product.viewedAt)}</span>
                </div>

                <Button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={cartLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {cartLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromRecentlyViewed(product.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                      {product.thumbnail || product.images[0] ? (
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt={product.name || product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-sm mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name || product.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

                {renderStars(product.rating)}

                <div className="flex items-center gap-2 mt-2 mb-2">
                  <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through text-sm">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Viewed {formatTimeAgo(product.viewedAt)}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={cartLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <WishlistButton 
                    product={product as any} 
                    size="sm" 
                    variant="outline" 
                  />
                  <ComparisonButton 
                    product={product as any} 
                    size="sm" 
                    variant="outline" 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
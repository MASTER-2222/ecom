import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import WishlistButton from '@/components/WishlistButton';
import ComparisonButton from '@/components/ComparisonButton';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'grid' | 'list';
  showQuickAdd?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showQuickAdd = true,
  className
}) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-orange-400 fill-current'
                : i < rating
                ? 'text-orange-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({product.reviewCount})</span>
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <Card className={cn('amazon-card group', className)}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <Link to={`/product/${product.id}`}>
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {product.thumbnail || product.images[0] ? (
                    <img
                      src={product.thumbnail || product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm">
                    Product
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-medium text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
              </Link>
              
              {renderStars(product.rating)}
              
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.shortDescription || product.description}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="amazon-price text-2xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-gray-500 line-through text-lg">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                Brand: <span className="font-medium">{product.brand}</span>
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex-shrink-0 flex flex-col gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0}
                className="amazon-button"
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
              
              <div className="flex gap-2">
                <WishlistButton product={product} size="sm" variant="outline" className="flex-1" />
                <ComparisonButton product={product} size="sm" variant="outline" className="flex-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('amazon-card group h-full flex flex-col', className)}>
      <CardContent className="p-4 flex flex-col h-full">
        {/* Product Image */}
        <div className="relative mb-4">
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold z-10">
              -{discountPercentage}%
            </Badge>
          )}
          
          {product.stock === 0 && (
            <Badge className="absolute top-2 right-2 bg-gray-500 text-white z-10">
              Out of Stock
            </Badge>
          )}
          
          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <WishlistButton product={product} size="sm" variant="ghost" className="bg-white/90 hover:bg-white shadow-sm" />
          </div>
          
          <Link to={`/product/${product.id}`}>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              {product.thumbnail || product.images[0] ? (
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm">
                Product Image
              </div>
            </div>
          </Link>
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary">
              <Eye className="w-4 h-4" />
            </Button>
            <WishlistButton product={product} size="sm" variant="ghost" className="bg-white/90 hover:bg-white" />
            <ComparisonButton product={product} size="sm" variant="ghost" className="bg-white/90 hover:bg-white" />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-600 mb-2">
            by <span className="font-medium">{product.brand}</span>
          </p>
          
          {renderStars(product.rating)}
          
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="amazon-price text-xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-gray-500 line-through text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-red-600 text-sm mb-2 font-medium">
                Only {product.stock} left in stock
              </p>
            )}
            
            {showQuickAdd && (
              <Button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0}
                className="w-full amazon-button"
                size="sm"
              >
                {cartLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
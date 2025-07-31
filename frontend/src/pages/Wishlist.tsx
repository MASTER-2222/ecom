import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';

const Wishlist: React.FC = () => {
  const { 
    wishlist, 
    wishlistProducts, 
    loading, 
    removeFromWishlist, 
    clearWishlist, 
    getWishlistItemCount,
    refreshWishlist 
  } = useWishlist();
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    refreshWishlist();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
      }
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyWishlist = () => (
    <div className="text-center py-16">
      <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
      <p className="text-gray-600 mb-6">
        Save items you're interested in to your wishlist so you can easily find them later.
      </p>
      <Link to="/products">
        <Button size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );

  if (loading && !wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  const itemCount = getWishlistItemCount();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {itemCount === 0 ? 'No items' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          
          {itemCount > 0 && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClearWishlist}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {itemCount === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id) || product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart(product.id) ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
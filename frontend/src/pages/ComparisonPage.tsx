import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  X, 
  Star, 
  Check, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  Package,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useComparison } from '@/hooks/useComparison';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import WishlistButton from '@/components/WishlistButton';
import { Product } from '@/types';

const ComparisonPage: React.FC = () => {
  const { comparedProducts, removeFromComparison, clearComparison } = useComparison();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getDiscountPercentage = (product: Product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const getProductAttribute = (product: Product, key: string) => {
    if (product.attributes && product.attributes[key]) {
      return product.attributes[key];
    }
    if (product.specifications && product.specifications[key]) {
      return product.specifications[key];
    }
    return null;
  };

  // Get all unique attributes from all products for comparison
  const getAllAttributes = () => {
    const attributes = new Set<string>();
    comparedProducts.forEach(product => {
      if (product.attributes) {
        Object.keys(product.attributes).forEach(key => attributes.add(key));
      }
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => attributes.add(key));
      }
    });
    return Array.from(attributes);
  };

  if (comparedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Scale className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Products to Compare</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing products and add them to comparison to see a detailed side-by-side view.
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Package className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allAttributes = getAllAttributes();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Scale className="w-8 h-8 text-blue-600" />
                Product Comparison
              </h1>
              <p className="text-gray-600 mt-1">
                Comparing {comparedProducts.length} product{comparedProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearComparison}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 w-40 bg-gray-50">
                    <span className="font-semibold text-gray-900">Products</span>
                  </th>
                  {comparedProducts.map((product) => (
                    <th key={product.id} className="text-center p-4 min-w-64">
                      <div className="relative">
                        <button
                          onClick={() => removeFromComparison(product.id)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        {/* Product Image */}
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden mb-4">
                          {product.thumbnail || product.images?.[0] ? (
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
                        
                        {/* Product Title */}
                        <Link 
                          to={`/product/${product.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm mb-2 block"
                        >
                          {product.name || product.title}
                        </Link>
                        
                        {/* Brand */}
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Price */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Price</td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                        {getDiscountPercentage(product) > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            -{getDiscountPercentage(product)}% OFF
                          </Badge>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Rating</td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        {renderStars(product.rating || product.averageRating || 0)}
                        {product.reviewCount && (
                          <span className="text-xs text-gray-500">
                            {product.reviewCount} reviews
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Availability</td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.stock > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">In Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <X className="w-4 h-4" />
                          <span className="text-sm">Out of Stock</span>
                        </div>
                      )}
                      {product.stock > 0 && product.stock <= 10 && (
                        <div className="text-xs text-orange-600 mt-1">
                          Only {product.stock} left
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Description</td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {product.shortDescription || product.description || 'No description available'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Dynamic Attributes */}
                {allAttributes.map((attribute) => (
                  <tr key={attribute} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50 capitalize">
                      {attribute.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </td>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-sm text-gray-600">
                          {getProductAttribute(product, attribute) || (
                            <div className="flex items-center justify-center text-gray-400">
                              <Minus className="w-4 h-4" />
                            </div>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Actions</td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={cartLoading || product.stock === 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          {cartLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : product.stock === 0 ? (
                            'Out of Stock'
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                        
                        <WishlistButton 
                          product={product} 
                          showText 
                          size="sm" 
                          variant="outline"
                          className="w-full"
                        />
                        
                        <Link to={`/product/${product.id}`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            You can compare up to 4 products. Add more products from our catalog to compare.
          </p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
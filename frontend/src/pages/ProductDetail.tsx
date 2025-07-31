import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield, 
  RotateCcw, ChevronLeft, ChevronRight, Check, X, ThumbsUp, ThumbsDown,
  User, Verified, ChevronDown, MapPin, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import { Product, Review } from '@/types';
import { productsAPI, reviewsAPI } from '@/backend/api';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productResponse, reviewsResponse] = await Promise.all([
          productsAPI.getProductById(id),
          reviewsAPI.getProductReviews(id, { page: 0, size: 10 })
        ]);

        if (productResponse.success) {
          setProduct(productResponse.data);
          
          // Track this product in recently viewed
          addToRecentlyViewed(productResponse.data);
          
          // Fetch related products
          if (productResponse.data.category?.id) {
            const relatedResponse = await productsAPI.getAllProducts({
              page: 0,
              size: 4,
              categoryId: productResponse.data.category.id
            });
            if (relatedResponse.success) {
              const filtered = relatedResponse.data.content?.filter(p => p.id !== id) || [];
              setRelatedProducts(filtered.slice(0, 4));
            }
          }
        }

        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data.content || []);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product.id, quantity);
      toast.success(`${quantity} ${product.title}(s) added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      await addItem(product.id, quantity);
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleSubmitReview = async () => {
    if (!product || !isAuthenticated) return;

    setSubmittingReview(true);
    try {
      const response = await reviewsAPI.createReview({
        productId: product.id,
        rating: reviewRating,
        comment: reviewText
      });

      if (response.success) {
        toast.success('Review submitted successfully');
        setShowReviewForm(false);
        setReviewText('');
        setReviewRating(5);
        
        // Refresh reviews
        const reviewsResponse = await reviewsAPI.getProductReviews(product.id, { page: 0, size: 10 });
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data.content || []);
        }
      }
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : product.rating;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category.id}`} className="hover:text-orange-600">
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImageIndex] || product.thumbnail || '/api/placeholder/600/600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white font-bold">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-orange-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image || '/api/placeholder/150/150'}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.shortDescription}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-orange-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-medium ml-2">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  ({reviews.length} reviews)
                </span>
                <Badge variant="outline">Brand: {product.brand}</Badge>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-red-600">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-0 focus:ring-0"
                      min={1}
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-12 amazon-button text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="h-12 px-4"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg"
                >
                  Buy Now
                </Button>
                
                <Button variant="outline" className="w-full h-12">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium">Free Delivery</div>
                  <div className="text-sm text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <RotateCcw className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium">Easy Returns</div>
                  <div className="text-sm text-gray-600">30-day return policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-medium">Warranty</div>
                  <div className="text-sm text-gray-600">2-year protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.description}
                  </p>
                  
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-gray-700">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Brand</span>
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">SKU</span>
                        <span>{product.sku}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Category</span>
                        <span>{product.category.name}</span>
                      </div>
                      {Object.entries(product.specifications || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Summary */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(averageRating)
                                ? 'text-orange-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">{reviews.length} reviews</div>
                    </div>

                    <div className="space-y-2">
                      {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rating}</span>
                          <Star className="w-4 h-4 text-orange-400 fill-current" />
                          <Progress value={percentage} className="flex-1" />
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      ))}
                    </div>

                    {isAuthenticated && (
                      <Button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        Write a Review
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Review Form */}
                {showReviewForm && isAuthenticated && (
                  <Card className="mt-4">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">Write Your Review</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className="transition-colors"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= reviewRating
                                      ? 'text-orange-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Review</label>
                          <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSubmitReview}
                            disabled={submittingReview || !reviewText.trim()}
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowReviewForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <Star className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">Be the first to review this product!</p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.user?.profilePicture} />
                            <AvatarFallback>
                              {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">
                                {review.user?.firstName} {review.user?.lastName}
                              </span>
                              {review.user?.isVerified && (
                                <Verified className="w-4 h-4 text-blue-500" />
                              )}
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-orange-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <button className="flex items-center gap-1 hover:text-gray-900">
                                <ThumbsUp className="w-4 h-4" />
                                Helpful ({review.helpfulCount || 0})
                              </button>
                              <button className="flex items-center gap-1 hover:text-gray-900">
                                <ThumbsDown className="w-4 h-4" />
                                Not helpful
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qa" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Questions & Answers</h3>
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <User className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-600 mb-4">
                    Be the first to ask a question about this product!
                  </p>
                  {isAuthenticated && (
                    <Button>Ask a Question</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
        
        {/* Recently Viewed Products */}
        <RecentlyViewed 
          excludeProductId={product?.id} 
          title="Your Recently Viewed Items"
          limit={6}
          variant="horizontal"
          className="mb-8"
        />
      </div>
    </div>
  );
};

export default ProductDetail;
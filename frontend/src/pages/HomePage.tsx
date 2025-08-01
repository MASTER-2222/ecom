import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import { Product } from '@/types';
import { productsAPI } from '@/backend/api';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero carousel slides
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      title: 'Electronics Sale',
      subtitle: 'Up to 70% off on electronics',
      cta: 'Shop now',
      link: '/electronics'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      title: 'Fashion Week',
      subtitle: 'Trending styles for everyone',
      cta: 'Explore fashion',
      link: '/fashion'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      title: 'Home & Garden',
      subtitle: 'Transform your space',
      cta: 'Shop home',
      link: '/home-garden'
    }
  ];

  // Category cards
  const categories = [
    {
      title: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop&crop=center&auto=format&q=80',
      link: '/electronics',
      items: ['Smartphones', 'Laptops', 'Headphones', 'Tablets']
    },
    {
      title: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop&crop=center&auto=format&q=80',
      link: '/fashion',
      items: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories']
    },
    {
      title: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&crop=center&auto=format&q=80',
      link: '/home-kitchen',
      items: ['Furniture', 'Kitchen', 'Bedding', 'Decor']
    },
    {
      title: 'Books',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center&auto=format&q=80',
      link: '/books',
      items: ['Fiction', 'Non-fiction', 'Educational', 'Children']
    }
  ];

  // Today's deals
  const todaysDeals = [
    {
      id: 1,
      title: 'Wireless Headphones',
      originalPrice: 99.99,
      price: 59.99,
      discount: 40,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center&auto=format&q=80',
      rating: 4.5,
      reviews: 1250
    },
    {
      id: 2,
      title: 'Smart Watch',
      originalPrice: 299.99,
      price: 199.99,
      discount: 33,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center&auto=format&q=80',
      rating: 4.3,
      reviews: 892
    },
    {
      id: 3,
      title: 'Bluetooth Speaker',
      originalPrice: 79.99,
      price: 49.99,
      discount: 38,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center&auto=format&q=80',
      rating: 4.6,
      reviews: 2100
    },
    {
      id: 4,
      title: 'Laptop Stand',
      originalPrice: 49.99,
      price: 29.99,
      discount: 40,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop&crop=center&auto=format&q=80',
      rating: 4.4,
      reviews: 567
    }
  ];

  useEffect(() => {
    // Auto-rotate hero carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // For now, we'll create mock data since backend isn't connected yet
        const mockProducts: Product[] = [
          {
            id: '1',
            title: 'iPhone 15 Pro Max',
            description: 'Latest iPhone with amazing features',
            shortDescription: 'Premium smartphone',
            brand: 'Apple',
            category: { id: '1', name: 'Electronics', slug: 'electronics', productCount: 100, isActive: true },
            price: 1199.99,
            originalPrice: 1299.99,
            discount: 8,
            images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80'],
            thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            rating: 4.7,
            reviewCount: 2543,
            stock: 50,
            sku: 'IPH15PM001',
            specifications: {},
            features: [],
            tags: [],
            isActive: true,
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setFeaturedProducts(mockProducts);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 z-10"></div>
        
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <div className="text-center z-20 px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">{slide.subtitle}</p>
                <Link to={slide.link}>
                  <Button className="amazon-orange text-lg px-8 py-3">
                    {slide.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="container mx-auto px-4 py-8 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="amazon-card hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">{category.title}</h3>
                <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                    {category.title} Image
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-4">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="hover:text-orange-600 cursor-pointer">{item}</li>
                  ))}
                </ul>
                <Link to={category.link} className="text-blue-600 hover:text-orange-600 text-sm font-medium">
                  Shop now
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Today's Deals */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Today's Deals</h2>
          <p className="text-gray-600">Limited time offers on top products</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {todaysDeals.map((deal) => (
            <Card key={deal.id} className="amazon-card group">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold">
                    {deal.discount}% OFF
                  </Badge>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm">
                      Product Image
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {deal.title}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(deal.rating)
                            ? 'text-orange-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({deal.reviews.toLocaleString()})</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="amazon-price text-xl font-bold">${deal.price}</span>
                    <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 amazon-button">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/deals">
            <Button variant="outline" className="border-gray-300 hover:border-orange-500">
              See all deals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Hand-picked products just for you</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Products */}
      <section className="container mx-auto px-4 py-12">
        <RecentlyViewed 
          variant="horizontal" 
          limit={8} 
          showTitle={true} 
          showClearAll={true}
        />
      </section>

      {/* Call to Action */}
      <section className="amazon-header py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join millions of happy customers</h2>
          <p className="text-xl mb-8 text-blue-100">Sign up today and get exclusive deals and early access to sales</p>
          <Link to="/register">
            <Button className="amazon-secondary-button text-lg px-8 py-3">
              Create Your Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
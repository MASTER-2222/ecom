'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserPreferences, getUserOrders } from '@/lib/database';
import { productImages } from '../lib/cloudinary-images';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  category: string;
  brand: string;
}

interface RecommendationEngineProps {
  title: string;
  userId?: string;
}

export default function RecommendationEngine({ title, userId }: RecommendationEngineProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        // Get user preferences and order history
        const [preferences, orders] = await Promise.all([
          getUserPreferences().catch(() => null),
          getUserOrders().catch(() => [])
        ]);

        // Sample product data (in real app, this would come from your product database)
        const allProducts: Product[] = [
          {
            id: '1',
            name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
            price: 124999,
            originalPrice: 149999,
            image: productImages['samsung-s24-ultra'],
            rating: 4.5,
            category: 'Electronics',
            brand: 'Samsung'
          },
          {
            id: '2',
            name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
            price: 29990,
            originalPrice: 34990,
            image: productImages['sony-wh1000xm5'],
            rating: 4.7,
            category: 'Electronics',
            brand: 'Sony'
          },
          {
            id: '3',
            name: 'MacBook Air M2 (13-inch, 8GB RAM, 256GB SSD)',
            price: 114900,
            originalPrice: 119900,
            image: productImages['macbook-air-m2'],
            rating: 4.8,
            category: 'Electronics',
            brand: 'Apple'
          },
          {
            id: '4',
            name: 'Levi\'s Men\'s 511 Slim Fit Jeans - Dark Blue',
            price: 2999,
            originalPrice: 4499,
            image: productImages['levis-jeans-men'],
            rating: 4.4,
            category: 'Fashion',
            brand: 'Levi\'s'
          },
          {
            id: '5',
            name: 'Nike Air Force 1 Low White Sneakers - Unisex',
            price: 7999,
            originalPrice: 8999,
            image: productImages['nike-air-force-1'],
            rating: 4.8,
            category: 'Fashion',
            brand: 'Nike'
          },
          {
            id: '6',
            name: 'IKEA HEMNES Bed Frame with 4 Storage Boxes - White',
            price: 24999,
            originalPrice: 29999,
            image: productImages['ikea-bed'],
            rating: 4.5,
            category: 'Home',
            brand: 'IKEA'
          },
          {
            id: '7',
            name: 'LG 260L Smart Inverter Frost-Free Double Door Refrigerator',
            price: 28999,
            originalPrice: 34999,
            image: productImages['lg-double-door-fridge'],
            rating: 4.4,
            category: 'Appliances',
            brand: 'LG'
          },
          {
            id: '8',
            name: 'The Psychology of Money: Timeless Lessons on Wealth',
            price: 299,
            originalPrice: 399,
            image: productImages['psychology-money-book'],
            rating: 4.6,
            category: 'Books',
            brand: 'Jaico Publishing'
          }
        ];

        let filteredProducts = [...allProducts];

        if (preferences) {
          // Filter by preferred categories
          if (preferences.preferred_categories && preferences.preferred_categories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
              preferences.preferred_categories.includes(product.category)
            );
          }

          // Filter by price range
          if (preferences.price_range_min && preferences.price_range_max) {
            filteredProducts = filteredProducts.filter(product => 
              product.price >= preferences.price_range_min && 
              product.price <= preferences.price_range_max
            );
          }

          // Filter by favorite brands
          if (preferences.favorite_brands && preferences.favorite_brands.length > 0) {
            const brandFiltered = filteredProducts.filter(product => 
              preferences.favorite_brands.includes(product.brand)
            );
            if (brandFiltered.length > 0) {
              filteredProducts = brandFiltered;
            }
          }
        }

        // If user has orders, exclude already purchased items and recommend similar
        if (orders && orders.length > 0) {
          const purchasedProductIds = orders.flatMap(order => 
            order.order_items.map(item => item.product_id)
          );
          
          filteredProducts = filteredProducts.filter(product => 
            !purchasedProductIds.includes(product.id)
          );

          // Add some logic to recommend similar categories
          const purchasedCategories = orders.flatMap(order => 
            order.order_items.map(item => {
              const product = allProducts.find(p => p.id === item.product_id);
              return product?.category;
            })
          ).filter(Boolean);

          if (purchasedCategories.length > 0) {
            const similarProducts = allProducts.filter(product => 
              purchasedCategories.includes(product.category) &&
              !purchasedProductIds.includes(product.id)
            );
            filteredProducts = [...filteredProducts, ...similarProducts];
          }
        }

        // Remove duplicates and limit to 8 products
        const uniqueProducts = filteredProducts.filter((product, index, self) => 
          self.findIndex(p => p.id === product.id) === index
        );

        // Sort by rating and take top 8
        const sortedProducts = uniqueProducts
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);

        // If no personalized recommendations, show popular products
        if (sortedProducts.length === 0) {
          setRecommendedProducts(
            allProducts.sort((a, b) => b.rating - a.rating).slice(0, 8)
          );
        } else {
          setRecommendedProducts(sortedProducts);
        }

      } catch (error) {
        console.error('Error generating recommendations:', error);
        // Fallback to showing popular products
        const popularProducts: Product[] = [
          {
            id: '1',
            name: 'Samsung Galaxy S24 Ultra 5G',
            price: 124999,
            originalPrice: 149999,
            image: productImages['samsung-s24-ultra'],
            rating: 4.5,
            category: 'Electronics',
            brand: 'Samsung'
          },
          {
            id: '2',
            name: 'Sony WH-1000XM5 Headphones',
            price: 29990,
            originalPrice: 34990,
            image: productImages['sony-wh1000xm5'],
            rating: 4.7,
            category: 'Electronics',
            brand: 'Sony'
          }
        ];
        setRecommendedProducts(popularProducts);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [userId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < Math.floor(rating) ? 'fill' : 'line'} text-[#fdd835] text-sm w-4 h-4 flex items-center justify-center`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <Link href="/recommendations" className="text-[#2874f0] hover:underline text-sm cursor-pointer">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md object-top"
                  />
                </div>
                
                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-[#2874f0]">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex mr-2">{renderStars(product.rating)}</div>
                  <span className="text-xs text-gray-500">({product.rating})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                </div>
                <div className="text-green-600 text-sm font-medium mt-1">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
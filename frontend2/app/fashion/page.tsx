'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { productImages } from '../../lib/cloudinary-images';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  category: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Levi\'s Men\'s 511 Slim Fit Jeans - Dark Blue',
    price: 2999,
    originalPrice: 4499,
    image: productImages['levis-jeans'],
    rating: 4.4,
    reviews: 1247,
    brand: 'Levi\'s',
    category: 'Men'
  },
  {
    id: '2',
    name: 'Zara Women\'s Floral Print Midi Dress - Summer Collection',
    price: 3999,
    originalPrice: 5999,
    image: productImages['floral-dress'],
    rating: 4.6,
    reviews: 892,
    brand: 'Zara',
    category: 'Women'
  },
  {
    id: '3',
    name: 'Nike Air Force 1 Low White Sneakers - Unisex',
    price: 7999,
    originalPrice: 8999,
    image: productImages['nike-shoes'],
    rating: 4.8,
    reviews: 2156,
    brand: 'Nike',
    category: 'Footwear'
  },
  {
    id: '4',
    name: 'H&M Men\'s Cotton Crew Neck T-Shirt - Navy Blue',
    price: 799,
    originalPrice: 1299,
    image: productImages['cotton-tshirt'],
    rating: 4.2,
    reviews: 1567,
    brand: 'H&M',
    category: 'Men'
  },
  {
    id: '5',
    name: 'Forever 21 Women\'s Denim Jacket - Light Wash',
    price: 2499,
    originalPrice: 3499,
    image: productImages['denim-jacket'],
    rating: 4.3,
    reviews: 743,
    brand: 'Forever 21',
    category: 'Women'
  },
  {
    id: '6',
    name: 'Adidas Ultraboost 22 Running Shoes - Black/White',
    price: 16999,
    originalPrice: 17999,
    image: productImages['adidas-shoes'],
    rating: 4.7,
    reviews: 1834,
    brand: 'Adidas',
    category: 'Footwear'
  },
  {
    id: '7',
    name: 'Tommy Hilfiger Women\'s Classic Polo Shirt - Red',
    price: 2999,
    originalPrice: 3999,
    image: productImages['samsung-s24'],
    rating: 4.5,
    reviews: 623,
    brand: 'Tommy Hilfiger',
    category: 'Women'
  },
  {
    id: '8',
    name: 'Puma Men\'s Track Pants - Black with Side Stripes',
    price: 1999,
    originalPrice: 2999,
    image: productImages['samsung-s24'],
    rating: 4.4,
    reviews: 956,
    brand: 'Puma',
    category: 'Men'
  }
];

const brands = ['All', 'Levi\'s', 'Zara', 'Nike', 'H&M', 'Forever 21', 'Adidas', 'Tommy Hilfiger', 'Puma'];
const categories = ['All', 'Men', 'Women', 'Footwear'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FashionPage() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const filterProducts = (brand: string, category: string) => {
    let filtered = products;
    
    if (brand !== 'All') {
      filtered = filtered.filter(product => product.brand === brand);
    }
    
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    setFilteredProducts(filtered);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    filterProducts(brand, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(selectedBrand, category);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < Math.floor(rating) ? 'fill' : 'line'} text-[#fdd835] text-sm w-4 h-4 flex items-center justify-center`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            <span>Fashion</span>
          </div>
          <h1 className="text-3xl font-bold">Fashion Store</h1>
          <p className="mt-2 text-pink-100">Discover the latest trends and styles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-pink-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Brand</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => handleBrandChange(brand)}
                        className="w-4 h-4 text-pink-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <label key={size} className="flex items-center justify-center border border-gray-300 rounded-md p-2 cursor-pointer hover:border-pink-500">
                      <input type="checkbox" className="hidden" />
                      <span className="text-sm text-gray-600">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {['Under ₹1,000', '₹1,000 - ₹3,000', '₹3,000 - ₹5,000', 'Above ₹5,000'].map(range => (
                    <label key={range} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-pink-500 cursor-pointer" />
                      <span className="ml-2 text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">Showing {filteredProducts.length} products</p>
              </div>
              <select className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white pr-8">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                    <div className="aspect-square p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md object-top"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-pink-600 font-medium mb-1">{product.brand}</div>
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-green-600 text-xs font-medium mb-3">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                      </div>
                      <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
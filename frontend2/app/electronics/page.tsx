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
}

const products: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
    price: 124999,
    originalPrice: 149999,
    image: productImages['samsung-s24'],
    rating: 4.5,
    reviews: 2847,
    brand: 'Samsung'
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 29990,
    originalPrice: 34990,
    image: productImages['sony-headphones'],
    rating: 4.7,
    reviews: 1523,
    brand: 'Sony'
  },
  {
    id: '3',
    name: 'Apple MacBook Air M2 (13-inch, 8GB RAM, 256GB SSD)',
    price: 114900,
    originalPrice: 119900,
    image: productImages['macbook-air'],
    rating: 4.8,
    reviews: 3621,
    brand: 'Apple'
  },
  {
    id: '4',
    name: 'LG 55" 4K Ultra HD Smart OLED TV (OLED55C3PSA)',
    price: 139999,
    originalPrice: 179999,
    image: productImages['lg-oled-tv'],
    rating: 4.6,
    reviews: 945,
    brand: 'LG'
  },
  {
    id: '5',
    name: 'Canon EOS R6 Mark II Mirrorless Camera with 24-105mm Lens',
    price: 239999,
    originalPrice: 269999,
    image: productImages['canon-camera'],
    rating: 4.9,
    reviews: 567,
    brand: 'Canon'
  },
  {
    id: '6',
    name: 'Dell XPS 13 Plus Laptop (Intel i7, 16GB RAM, 512GB SSD)',
    price: 149999,
    originalPrice: 169999,
    image: productImages['dell-xps'],
    rating: 4.5,
    reviews: 1234,
    brand: 'Dell'
  },
  {
    id: '7',
    name: 'JBL PartyBox 310 Portable Bluetooth Speaker',
    price: 28999,
    originalPrice: 34999,
    image: productImages['ceiling-light'],
    rating: 4.4,
    reviews: 892,
    brand: 'JBL'
  },
  {
    id: '8',
    name: 'iPad Air 5th Gen (10.9-inch, Wi-Fi, 64GB) - Space Gray',
    price: 59900,
    originalPrice: 64900,
    image: productImages['samsung-s24'],
    rating: 4.7,
    reviews: 2156,
    brand: 'Apple'
  }
];

const brands = ['All', 'Samsung', 'Apple', 'Sony', 'LG', 'Canon', 'Dell', 'JBL'];
const priceRanges = [
  'All',
  'Under ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  'Above ₹1,00,000'
];

export default function ElectronicsPage() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const filterProducts = (brand: string, priceRange: string) => {
    let filtered = products;
    
    if (brand !== 'All') {
      filtered = filtered.filter(product => product.brand === brand);
    }
    
    if (priceRange !== 'All') {
      filtered = filtered.filter(product => {
        switch (priceRange) {
          case 'Under ₹25,000':
            return product.price < 25000;
          case '₹25,000 - ₹50,000':
            return product.price >= 25000 && product.price <= 50000;
          case '₹50,000 - ₹1,00,000':
            return product.price >= 50000 && product.price <= 100000;
          case 'Above ₹1,00,000':
            return product.price > 100000;
          default:
            return true;
        }
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    filterProducts(brand, selectedPriceRange);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    filterProducts(selectedBrand, priceRange);
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
      <div className="bg-[#2874f0] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            <span>Electronics</span>
          </div>
          <h1 className="text-3xl font-bold">Electronics Store</h1>
          <p className="mt-2 text-blue-100">Discover the latest gadgets and technology</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
              
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
                        className="w-4 h-4 text-[#2874f0] cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range}
                        onChange={() => handlePriceRangeChange(range)}
                        className="w-4 h-4 text-[#2874f0] cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-[#2874f0] cursor-pointer" />
                      <div className="ml-2 flex items-center">
                        {Array.from({ length: rating }, (_, i) => (
                          <i key={i} className="ri-star-fill text-[#fdd835] text-sm w-4 h-4 flex items-center justify-center"></i>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& up</span>
                      </div>
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
                <option>Newest First</option>
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
                      <button className="w-full bg-[#2874f0] text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
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
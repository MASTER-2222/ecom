
'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    name: 'IKEA HEMNES Bed Frame with 4 Storage Boxes - White Stain',
    price: 24999,
    originalPrice: 29999,
    image: productImages['wooden-bed'],
    rating: 4.5,
    reviews: 1247,
    brand: 'IKEA',
    category: 'Bedroom'
  },
  {
    id: '2',
    name: 'Urban Ladder Aruba 3-Seater Fabric Sofa - Navy Blue',
    price: 34999,
    originalPrice: 44999,
    image: productImages['navy-sofa'],
    rating: 4.6,
    reviews: 892,
    brand: 'Urban Ladder',
    category: 'Living Room'
  },
  {
    id: '3',
    name: 'Godrej Interio Study Table with Drawer - Walnut Finish',
    price: 8999,
    originalPrice: 12999,
    image: productImages['study-desk'],
    rating: 4.4,
    reviews: 567,
    brand: 'Godrej Interio',
    category: 'Office'
  },
  {
    id: '4',
    name: 'Pepperfry Manchester 6-Seater Dining Set - Honey Oak',
    price: 45999,
    originalPrice: 59999,
    image: productImages['dining-set'],
    rating: 4.7,
    reviews: 634,
    brand: 'Pepperfry',
    category: 'Dining Room'
  },
  {
    id: '5',
    name: 'Nilkamal Kitchen Storage Cabinet - White',
    price: 7999,
    originalPrice: 9999,
    image: productImages['kitchen-cabinet'],
    rating: 4.3,
    reviews: 743,
    brand: 'Nilkamal',
    category: 'Kitchen'
  },
  {
    id: '6',
    name: 'Duroflex Balance Orthopedic Memory Foam Mattress - Queen Size',
    price: 18999,
    originalPrice: 24999,
    image: productImages['memory-mattress'],
    rating: 4.8,
    reviews: 1834,
    brand: 'Duroflex',
    category: 'Bedroom'
  },
  {
    id: '7',
    name: 'Hometown Vienna Wardrobe with Mirror - 3 Door',
    price: 28999,
    originalPrice: 34999,
    image: productImages['wooden-bed'],
    rating: 4.5,
    reviews: 423,
    brand: 'Hometown',
    category: 'Bedroom'
  },
  {
    id: '8',
    name: 'Philips LED Ceiling Light - 24W Round with Remote',
    price: 3999,
    originalPrice: 5499,
    image: productImages['ceiling-light'],
    rating: 4.4,
    reviews: 956,
    brand: 'Philips',
    category: 'Lighting'
  }
];

const brands = ['All', 'IKEA', 'Urban Ladder', 'Godrej Interio', 'Pepperfry', 'Nilkamal', 'Duroflex', 'Hometown', 'Philips'];
const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Office', 'Lighting'];
const priceRanges = [
  'All',
  'Under ₹10,000',
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  'Above ₹50,000'
];

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const filterProducts = (brand: string, category: string, priceRange: string) => {
    let filtered = products;
    
    if (brand !== 'All') {
      filtered = filtered.filter(product => product.brand === brand);
    }
    
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (priceRange !== 'All') {
      filtered = filtered.filter(product => {
        switch (priceRange) {
          case 'Under ₹10,000':
            return product.price < 10000;
          case '₹10,000 - ₹25,000':
            return product.price >= 10000 && product.price <= 25000;
          case '₹25,000 - ₹50,000':
            return product.price >= 25000 && product.price <= 50000;
          case 'Above ₹50,000':
            return product.price > 50000;
          default:
            return true;
        }
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    filterProducts(brand, selectedCategory, selectedPriceRange);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(selectedBrand, category, selectedPriceRange);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    filterProducts(selectedBrand, selectedCategory, priceRange);
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
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            <span>Home & Living</span>
          </div>
          <h1 className="text-3xl font-bold">Home & Living</h1>
          <p className="mt-2 text-green-100">Transform your space with beautiful furniture</p>
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
                        className="w-4 h-4 text-green-500 cursor-pointer"
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
                        className="w-4 h-4 text-green-500 cursor-pointer"
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
                        className="w-4 h-4 text-green-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Room Type</h4>
                <div className="space-y-2">
                  {['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office'].map(room => (
                    <label key={room} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-green-500 cursor-pointer" />
                      <span className="ml-2 text-sm text-gray-600">{room}</span>
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
                <option>New Arrivals</option>
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
                      <div className="text-xs text-green-600 font-medium mb-1">{product.brand}</div>
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
                      <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-md hover:from-green-600 hover:to-teal-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
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

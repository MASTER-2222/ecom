'use client';

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
    name: 'LG 260L 3-Star Smart Inverter Frost-Free Double Door Refrigerator',
    price: 28999,
    originalPrice: 34999,
    image: productImages['lg-refrigerator'],
    rating: 4.4,
    reviews: 1247,
    brand: 'LG',
    category: 'Refrigerator'
  },
  {
    id: '2',
    name: 'Samsung 7kg Front Load Washing Machine with EcoBubble Technology',
    price: 32999,
    originalPrice: 39999,
    image: productImages['washing-machine'],
    rating: 4.5,
    reviews: 892,
    brand: 'Samsung',
    category: 'Washing Machine'
  },
  {
    id: '3',
    name: 'Whirlpool 1.5 Ton 3-Star Split Air Conditioner with Copper Condenser',
    price: 35999,
    originalPrice: 42999,
    image: productImages['split-ac'],
    rating: 4.3,
    reviews: 567,
    brand: 'Whirlpool',
    category: 'Air Conditioner'
  },
  {
    id: '4',
    name: 'IFB 25L Convection Microwave Oven with Auto Cook Menus',
    price: 12999,
    originalPrice: 16999,
    image: productImages['microwave-oven'],
    rating: 4.6,
    reviews: 734,
    brand: 'IFB',
    category: 'Microwave'
  },
  {
    id: '5',
    name: 'Bajaj Majesty RX11 1603W Induction Cooktop with Auto Shut Off',
    price: 2799,
    originalPrice: 3799,
    image: productImages['induction-cooktop'],
    rating: 4.2,
    reviews: 1123,
    brand: 'Bajaj',
    category: 'Cooktop'
  },
  {
    id: '6',
    name: 'Voltas 8kg Fully Automatic Top Load Washing Machine',
    price: 18999,
    originalPrice: 24999,
    image: productImages['washing-machine'],
    rating: 4.1,
    reviews: 456,
    brand: 'Voltas',
    category: 'Washing Machine'
  },
  {
    id: '7',
    name: 'Blue Star 1.5 Ton 5-Star Window Air Conditioner',
    price: 28999,
    originalPrice: 34999,
    image: productImages['split-ac'],
    rating: 4.4,
    reviews: 623,
    brand: 'Blue Star',
    category: 'Air Conditioner'
  },
  {
    id: '8',
    name: 'Godrej 190L Direct Cool Single Door Refrigerator',
    price: 14999,
    originalPrice: 18999,
    image: productImages['samsung-s24'],
    rating: 4.3,
    reviews: 856,
    brand: 'Godrej',
    category: 'Refrigerator'
  }
];

const brands = ['All', 'LG', 'Samsung', 'Whirlpool', 'IFB', 'Bajaj', 'Voltas', 'Blue Star', 'Godrej'];
const categories = ['All', 'Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Cooktop'];
const priceRanges = [
  'All',
  'Under ₹15,000',
  '₹15,000 - ₹30,000',
  '₹30,000 - ₹50,000',
  'Above ₹50,000'
];

export default function AppliancesPage() {
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
          case 'Under ₹15,000':
            return product.price < 15000;
          case '₹15,000 - ₹30,000':
            return product.price >= 15000 && product.price <= 30000;
          case '₹30,000 - ₹50,000':
            return product.price >= 30000 && product.price <= 50000;
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
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            <span>Appliances</span>
          </div>
          <h1 className="text-3xl font-bold">Home Appliances</h1>
          <p className="mt-2 text-orange-100">Make your home smarter with quality appliances</p>
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
                        className="w-4 h-4 text-orange-500 cursor-pointer"
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
                        className="w-4 h-4 text-orange-500 cursor-pointer"
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
                        className="w-4 h-4 text-orange-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Energy Rating</h4>
                <div className="space-y-2">
                  {['5 Star', '4 Star', '3 Star', '2 Star'].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-orange-500 cursor-pointer" />
                      <span className="ml-2 text-sm text-gray-600">{rating}</span>
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
                <option>Energy Rating</option>
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
                      <div className="text-xs text-orange-600 font-medium mb-1">{product.brand}</div>
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
                      <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-md hover:from-orange-600 hover:to-red-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
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
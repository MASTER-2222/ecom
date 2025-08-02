
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
}

const products: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
    price: 124999,
    originalPrice: 149999,
    image: 'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20smartphone%20in%20titanium%20black%20color%20with%20sleek%20modern%20design%2C%20product%20photography%20on%20clean%20white%20background%2C%20professional%20lighting%2C%20high-end%20smartphone%20with%20premium%20metallic%20finish%20and%20camera%20module%20visible&width=300&height=300&seq=electronics-1&orientation=squarish',
    rating: 4.5,
    reviews: 2847,
    brand: 'Samsung'
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 29990,
    originalPrice: 34990,
    image: 'https://readdy.ai/api/search-image?query=Sony%20premium%20wireless%20noise%20canceling%20headphones%20in%20black%20color%20with%20modern%20sleek%20design%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20high-quality%20audio%20headphones%20with%20cushioned%20ear%20cups&width=300&height=300&seq=electronics-2&orientation=squarish',
    rating: 4.7,
    reviews: 1523,
    brand: 'Sony'
  },
  {
    id: '3',
    name: 'Apple MacBook Air M2 (13-inch, 8GB RAM, 256GB SSD)',
    price: 114900,
    originalPrice: 119900,
    image: 'https://readdy.ai/api/search-image?query=Apple%20MacBook%20Air%20M2%20laptop%20in%20silver%20color%20with%20ultra-thin%20design%2C%20clean%20minimalist%20product%20photography%20on%20white%20background%2C%20premium%20aluminum%20finish%20laptop%20computer%20with%20Apple%20logo%20visible&width=300&height=300&seq=electronics-3&orientation=squarish',
    rating: 4.8,
    reviews: 3621,
    brand: 'Apple'
  },
  {
    id: '4',
    name: 'LG 55" 4K Ultra HD Smart OLED TV (OLED55C3PSA)',
    price: 139999,
    originalPrice: 179999,
    image: 'https://readdy.ai/api/search-image?query=LG%20OLED%20smart%20TV%20with%20ultra-slim%20design%20displaying%20vibrant%20colors%20on%20screen%2C%20modern%20television%20with%20thin%20bezels%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20premium%20home%20entertainment%20device&width=300&height=300&seq=electronics-4&orientation=squarish',
    rating: 4.6,
    reviews: 945,
    brand: 'LG'
  },
  {
    id: '5',
    name: 'Canon EOS R6 Mark II Mirrorless Camera with 24-105mm Lens',
    price: 239999,
    originalPrice: 269999,
    image: 'https://readdy.ai/api/search-image?query=Canon%20professional%20mirrorless%20camera%20with%20attached%20lens%2C%20black%20body%20with%20modern%20design%2C%20high-end%20photography%20equipment%20on%20clean%20white%20background%2C%20detailed%20camera%20body%20with%20controls%20and%20lens%20visible&width=300&height=300&seq=electronics-5&orientation=squarish',
    rating: 4.9,
    reviews: 567,
    brand: 'Canon'
  },
  {
    id: '6',
    name: 'Dell XPS 13 Plus Laptop (Intel i7, 16GB RAM, 512GB SSD)',
    price: 149999,
    originalPrice: 169999,
    image: 'https://readdy.ai/api/search-image?query=Dell%20XPS%20premium%20laptop%20computer%20in%20silver%20with%20modern%20sleek%20design%2C%20ultra-thin%20profile%2C%20professional%20business%20laptop%20on%20clean%20white%20background%2C%20high-quality%20aluminum%20construction%20with%20clean%20lines&width=300&height=300&seq=electronics-6&orientation=squarish',
    rating: 4.5,
    reviews: 1234,
    brand: 'Dell'
  },
  {
    id: '7',
    name: 'JBL PartyBox 310 Portable Bluetooth Speaker',
    price: 28999,
    originalPrice: 34999,
    image: 'https://readdy.ai/api/search-image?query=JBL%20large%20portable%20bluetooth%20speaker%20with%20LED%20lights%20and%20modern%20design%2C%20black%20color%20party%20speaker%20with%20handles%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20powerful%20audio%20equipment&width=300&height=300&seq=electronics-7&orientation=squarish',
    rating: 4.4,
    reviews: 892,
    brand: 'JBL'
  },
  {
    id: '8',
    name: 'iPad Air 5th Gen (10.9-inch, Wi-Fi, 64GB) - Space Gray',
    price: 59900,
    originalPrice: 64900,
    image: 'https://readdy.ai/api/search-image?query=Apple%20iPad%20Air%20tablet%20in%20space%20gray%20color%20with%20modern%20slim%20design%2C%20clean%20minimalist%20product%20photography%20on%20white%20background%2C%20premium%20tablet%20computer%20with%20Apple%20logo%2C%20sleek%20aluminum%20finish&width=300&height=300&seq=electronics-8&orientation=squarish',
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

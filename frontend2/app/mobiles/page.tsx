
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
  storage: string;
  ram: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max (Natural Titanium, 256GB)',
    price: 159900,
    originalPrice: 164900,
    image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20Max%20in%20natural%20titanium%20color%20with%20premium%20design%20and%20triple%20camera%20system%2C%20latest%20Apple%20smartphone%20with%20titanium%20build%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-1&orientation=squarish',
    rating: 4.8,
    reviews: 2847,
    brand: 'Apple',
    storage: '256GB',
    ram: '8GB'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB)',
    price: 139999,
    originalPrice: 149999,
    image: 'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20smartphone%20in%20titanium%20gray%20color%20with%20S%20Pen%20stylus%20and%20quad%20camera%20setup%2C%20premium%20Android%20flagship%20device%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-2&orientation=squarish',
    rating: 4.7,
    reviews: 1923,
    brand: 'Samsung',
    storage: '512GB',
    ram: '12GB'
  },
  {
    id: '3',
    name: 'OnePlus 12 5G (Flowy Emerald, 256GB)',
    price: 64999,
    originalPrice: 69999,
    image: 'https://readdy.ai/api/search-image?query=OnePlus%2012%20smartphone%20in%20emerald%20green%20color%20with%20sleek%20curved%20design%20and%20triple%20camera%20module%2C%20premium%20flagship%20Android%20phone%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-3&orientation=squarish',
    rating: 4.6,
    reviews: 1456,
    brand: 'OnePlus',
    storage: '256GB',
    ram: '12GB'
  },
  {
    id: '4',
    name: 'Google Pixel 8 Pro (Obsidian, 128GB)',
    price: 84999,
    originalPrice: 89999,
    image: 'https://readdy.ai/api/search-image?query=Google%20Pixel%208%20Pro%20smartphone%20in%20obsidian%20black%20color%20with%20horizontal%20camera%20bar%20and%20clean%20design%2C%20latest%20Pixel%20flagship%20with%20AI%20features%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-4&orientation=squarish',
    rating: 4.5,
    reviews: 987,
    brand: 'Google',
    storage: '128GB',
    ram: '12GB'
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra (Black, 512GB)',
    price: 99999,
    originalPrice: 109999,
    image: 'https://readdy.ai/api/search-image?query=Xiaomi%2014%20Ultra%20smartphone%20in%20black%20color%20with%20large%20circular%20camera%20module%20and%20premium%20build%2C%20high-end%20Android%20flagship%20device%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-5&orientation=squarish',
    rating: 4.4,
    reviews: 734,
    brand: 'Xiaomi',
    storage: '512GB',
    ram: '16GB'
  },
  {
    id: '6',
    name: 'OPPO Find X7 Ultra 5G (Ocean Blue, 256GB)',
    price: 89999,
    originalPrice: 94999,
    image: 'https://readdy.ai/api/search-image?query=OPPO%20Find%20X7%20Ultra%20smartphone%20in%20ocean%20blue%20color%20with%20distinctive%20camera%20design%20and%20premium%20finish%2C%20flagship%20Android%20phone%20with%20elegant%20aesthetics%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-6&orientation=squarish',
    rating: 4.3,
    reviews: 623,
    brand: 'OPPO',
    storage: '256GB',
    ram: '12GB'
  },
  {
    id: '7',
    name: 'Vivo X100 Pro 5G (Asteroid Black, 256GB)',
    price: 79999,
    originalPrice: 84999,
    image: 'https://readdy.ai/api/search-image?query=Vivo%20X100%20Pro%20smartphone%20in%20asteroid%20black%20color%20with%20professional%20camera%20system%20and%20sleek%20design%2C%20premium%20Android%20flagship%20with%20advanced%20photography%20features%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-7&orientation=squarish',
    rating: 4.4,
    reviews: 892,
    brand: 'Vivo',
    storage: '256GB',
    ram: '12GB'
  },
  {
    id: '8',
    name: 'Nothing Phone (2) (White, 128GB)',
    price: 44999,
    originalPrice: 49999,
    image: 'https://readdy.ai/api/search-image?query=Nothing%20Phone%202%20smartphone%20in%20white%20color%20with%20unique%20transparent%20back%20design%20and%20LED%20glyph%20interface%2C%20distinctive%20Android%20phone%20with%20minimalist%20aesthetics%2C%20professional%20product%20photography%20on%20clean%20white%20background&width=300&height=300&seq=mobiles-8&orientation=squarish',
    rating: 4.2,
    reviews: 567,
    brand: 'Nothing',
    storage: '128GB',
    ram: '8GB'
  }
];

const brands = ['All', 'Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'OPPO', 'Vivo', 'Nothing'];
const priceRanges = [
  'All',
  'Under ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  'Above ₹1,00,000'
];
const storageOptions = ['All', '128GB', '256GB', '512GB', '1TB'];
const ramOptions = ['All', '6GB', '8GB', '12GB', '16GB'];

export default function MobilesPage() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedStorage, setSelectedStorage] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const filterProducts = (brand: string, priceRange: string, storage: string) => {
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
    
    if (storage !== 'All') {
      filtered = filtered.filter(product => product.storage === storage);
    }
    
    setFilteredProducts(filtered);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    filterProducts(brand, selectedPriceRange, selectedStorage);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    filterProducts(selectedBrand, priceRange, selectedStorage);
  };

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    filterProducts(selectedBrand, selectedPriceRange, storage);
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            <span>Mobiles</span>
          </div>
          <h1 className="text-3xl font-bold">Mobile Phones</h1>
          <p className="mt-2 text-blue-100">Discover the latest smartphones and technology</p>
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
                        className="w-4 h-4 text-blue-600 cursor-pointer"
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
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Storage</h4>
                <div className="space-y-2">
                  {storageOptions.map(storage => (
                    <label key={storage} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="storage"
                        checked={selectedStorage === storage}
                        onChange={() => handleStorageChange(storage)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{storage}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">RAM</h4>
                <div className="space-y-2">
                  {ramOptions.map(ram => (
                    <label key={ram} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 cursor-pointer" />
                      <span className="ml-2 text-sm text-gray-600">{ram}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Features</h4>
                <div className="space-y-2">
                  {['5G', 'Wireless Charging', 'Fast Charging', 'Water Resistant'].map(feature => (
                    <label key={feature} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 cursor-pointer" />
                      <span className="ml-2 text-sm text-gray-600">{feature}</span>
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
                <option>Latest Launches</option>
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
                      <div className="text-xs text-blue-600 font-medium mb-1">{product.brand}</div>
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.ram}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.storage}</span>
                      </div>
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
                      <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 rounded-md hover:from-blue-700 hover:to-indigo-800 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
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

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
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title.replace(/\s/g, '')}`);
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
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
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 cursor-pointer"
              disabled={scrollPosition === 0}
            >
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div 
          id={`carousel-${title.replace(/\s/g, '')}`}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="min-w-[280px] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
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
                    <span className="text-green-600 text-xs font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                    </span>
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
  );
}
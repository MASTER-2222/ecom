'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserWishlist, removeFromWishlist } from '@/lib/database';

interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  category: string;
  created_at: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlist = await getUserWishlist();
        setWishlistItems(wishlist || []);
      } catch (err) {
        setError('Failed to load wishlist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems(items => items.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Add to cart functionality would be implemented here
    alert(`Added ${item.product_name} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4 w-24 h-24 flex items-center justify-center mx-auto"></i>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-[#2874f0] cursor-pointer">Home</Link>
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
          <span className="text-gray-800">My Wishlist</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save items you love for later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="ri-heart-line text-6xl text-gray-300 mb-6 w-24 h-24 flex items-center justify-center mx-auto"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">Add items to your wishlist and save them for later!</p>
            <Link href="/" className="inline-block bg-[#2874f0] text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Your Wishlist ({wishlistItems.length} items)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="relative mb-4">
                    <Link href={`/product/${item.product_id}`}>
                      <img
                        src={item.product_image || `productImages['samsung-s24']
                        alt={item.product_name}
                        className="w-full h-48 object-cover rounded-md cursor-pointer object-top"
                      />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 cursor-pointer"
                    >
                      <i className="ri-close-line text-gray-600 hover:text-red-500 w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                    <Link href={`/product/${item.product_id}`}>
                      <h3 className="font-medium text-gray-800 hover:text-[#2874f0] cursor-pointer line-clamp-2 text-sm">
                        {item.product_name}
                      </h3>
                    </Link>
                  </div>

                  <div className="mb-4">
                    <p className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-[#2874f0] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Add to Cart
                    </button>
                    <Link href={`/product/${item.product_id}`}>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                        View
                      </button>
                    </Link>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Added on {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Wishlist</h3>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 text-sm">Let others know what you're interested in</p>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-share-line mr-2 w-4 h-4 flex items-center justify-center inline"></i>
                Share Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
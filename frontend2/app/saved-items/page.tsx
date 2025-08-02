'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedItems, removeSavedItem } from '@/lib/database';

interface SavedItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  category: string;
  created_at: string;
}

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const items = await getSavedItems();
        setSavedItems(items || []);
      } catch (err) {
        setError('Failed to load saved items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  const handleRemoveSavedItem = async (productId: string) => {
    try {
      await removeSavedItem(productId);
      setSavedItems(items => items.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing saved item:', error);
    }
  };

  const handleAddToCart = (item: SavedItem) => {
    // Add to cart functionality would be implemented here
    alert(`Added ${item.product_name} to cart!`);
    // Optionally remove from saved items after adding to cart
    handleRemoveSavedItem(item.product_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your saved items...</p>
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
          <span className="text-gray-800">Saved Items</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved for Later</h1>
          <p className="text-gray-600">Items you saved while browsing</p>
        </div>

        {savedItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="ri-bookmark-line text-6xl text-gray-300 mb-6 w-24 h-24 flex items-center justify-center mx-auto"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Saved Items</h2>
            <p className="text-gray-600 mb-8">Items you save for later will appear here</p>
            <Link href="/" className="inline-block bg-[#2874f0] text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Saved Items ({savedItems.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {savedItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <Link href={`/product/${item.product_id}`}>
                      <img
                        src={item.product_image || `productImages['samsung-s24']
                        alt={item.product_name}
                        className="w-24 h-24 object-cover rounded-md cursor-pointer object-top"
                      />
                    </Link>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">{item.category}</div>
                          <Link href={`/product/${item.product_id}`}>
                            <h3 className="font-medium text-gray-800 hover:text-[#2874f0] cursor-pointer mb-2">
                              {item.product_name}
                            </h3>
                          </Link>
                          <div className="text-lg font-bold text-gray-900 mb-3">₹{item.price.toLocaleString()}</div>
                        </div>

                        <button
                          onClick={() => handleRemoveSavedItem(item.product_id)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <i className="ri-close-line text-xl w-6 h-6 flex items-center justify-center"></i>
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-[#2874f0] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Move to Cart
                        </button>
                        <Link href={`/product/${item.product_id}`}>
                          <button className="border border-gray-300 px-6 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                            View Product
                          </button>
                        </Link>
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        Saved on {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h3>
                <p className="text-gray-600 text-sm">Manage all your saved items</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    savedItems.forEach(item => handleAddToCart(item));
                  }}
                  className="px-4 py-2 bg-[#2874f0] text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Move All to Cart
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all saved items?')) {
                      savedItems.forEach(item => handleRemoveSavedItem(item.product_id));
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
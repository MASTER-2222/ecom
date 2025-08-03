'use client';

import { useState, useEffect } from 'react';

interface ProductWithSuggestion {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  currentImages: string[];
  suggestedImagePublicId: string;
  suggestedImageUrl: string;
  hasImages: boolean;
  needsUpdate: boolean;
}

interface ProductImageOverviewProps {
  onSuccess: () => void;
}

interface Statistics {
  totalProducts: number;
  productsWithImages: number;
  productsWithoutImages: number;
  productsNeedingUpdate: number;
}

export default function ProductImageOverview({ onSuccess }: ProductImageOverviewProps) {
  const [products, setProducts] = useState<ProductWithSuggestion[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({
    totalProducts: 0,
    productsWithImages: 0,
    productsWithoutImages: 0,
    productsNeedingUpdate: 0
  });
  const [filter, setFilter] = useState<'all' | 'no-images' | 'needs-update'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    loadProductsWithSuggestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filter, searchTerm]);

  const loadProductsWithSuggestions = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const response = await fetch(`${backendUrl}/admin/product-images/products-with-suggestions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.data || []);
          calculateStatistics(data.data || []);
        } else {
          console.error('Failed to load products:', data.error);
        }
      } else {
        console.error('Failed to load products:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (productList: ProductWithSuggestion[]) => {
    const stats = {
      totalProducts: productList.length,
      productsWithImages: productList.filter(p => p.hasImages).length,
      productsWithoutImages: productList.filter(p => !p.hasImages).length,
      productsNeedingUpdate: productList.filter(p => p.needsUpdate).length
    };
    setStatistics(stats);
  };

  const applyFilters = () => {
    let filtered = products;

    // Apply filter
    switch (filter) {
      case 'no-images':
        filtered = filtered.filter(p => !p.hasImages);
        break;
      case 'needs-update':
        filtered = filtered.filter(p => p.needsUpdate);
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleReplaceAllImages = async () => {
    if (!confirm('This will replace ALL product images with appropriate category-specific images. Continue?')) {
      return;
    }

    setBulkLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const response = await fetch(`${backendUrl}/admin/product-images/replace-all-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`✅ Success! Updated ${data.data.updatedCount} products with appropriate images.`);
          loadProductsWithSuggestions();
          onSuccess();
        } else {
          alert(`❌ Error: ${data.error}`);
        }
      } else {
        alert('❌ Failed to replace images. Please try again.');
      }
    } catch (error) {
      console.error('Error replacing images:', error);
      alert('❌ Network error. Please try again.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleUpdateSingleProduct = async (productId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const response = await fetch(`${backendUrl}/admin/product-images/${productId}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('✅ Product image updated successfully!');
          loadProductsWithSuggestions();
          onSuccess();
        } else {
          alert(`❌ Error: ${data.error}`);
        }
      } else {
        alert('❌ Failed to update product image. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{statistics.totalProducts}</div>
          <div className="text-sm text-blue-800">Total Products</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{statistics.productsWithImages}</div>
          <div className="text-sm text-green-800">With Images</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{statistics.productsWithoutImages}</div>
          <div className="text-sm text-red-800">Without Images</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{statistics.productsNeedingUpdate}</div>
          <div className="text-sm text-yellow-800">Need Updates</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setFilter('no-images')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'no-images'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              No Images
            </button>
            <button
              onClick={() => setFilter('needs-update')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'needs-update'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Needs Update
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleReplaceAllImages}
            disabled={bulkLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {bulkLoading ? '🔄 Processing...' : '🔄 Replace All Images'}
          </button>
          <button
            onClick={loadProductsWithSuggestions}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Products Overview ({filteredProducts.length} of {products.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredProducts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {products.length === 0 ? 'No products found.' : 'No products match the current filter.'}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku} | Category: {product.categoryName}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {!product.hasImages && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            No Images
                          </span>
                        )}
                        {product.needsUpdate && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Needs Update
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Image Comparison */}
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Current</p>
                        {product.currentImages.length > 0 ? (
                          <img
                            src={product.currentImages[0]}
                            alt="Current"
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-gray-400">→</div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Suggested</p>
                        <img
                          src={product.suggestedImageUrl}
                          alt="Suggested"
                          className="w-16 h-16 object-cover rounded border"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleUpdateSingleProduct(product.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

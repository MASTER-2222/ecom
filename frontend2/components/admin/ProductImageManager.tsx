'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrls: string[];
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
  score?: number;
  reason?: string;
}

interface ProductImageManagerProps {
  onSuccess: () => void;
}

export default function ProductImageManager({ onSuccess }: ProductImageManagerProps) {
  const [productsWithoutImages, setProductsWithoutImages] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [suggestedImages, setSuggestedImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

  useEffect(() => {
    loadProductsWithoutImages();
    loadStatistics();
  }, []);

  const loadProductsWithoutImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/admin/product-images/products-without-images`);
      const data = await response.json();
      
      if (data.success) {
        setProductsWithoutImages(data.data || []);
      }
    } catch (error) {
      console.error('Error loading products without images:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${backendUrl}/admin/product-images/statistics`);
      const data = await response.json();
      
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleAutoAssignAll = async () => {
    const confirmed = confirm('This will automatically assign appropriate images to ALL products based on their categories. Continue?');
    if (!confirmed) return;

    setAssigning(true);
    try {
      const response = await fetch(`${backendUrl}/admin/product-images/auto-assign-all`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Auto-assignment completed!\nUpdated: ${data.updatedProducts}/${data.totalProducts} products`);
        loadProductsWithoutImages();
        loadStatistics();
        onSuccess();
      } else {
        alert(`Auto-assignment failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error in auto-assignment:', error);
      alert('Auto-assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/admin/product-images/suggest-images/${product.id}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestedImages(data.data || []);
      }
    } catch (error) {
      console.error('Error loading suggested images:', error);
      setSuggestedImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignImage = async (image: CloudinaryImage, setAsPrimary: boolean = true) => {
    if (!selectedProduct) return;

    setAssigning(true);
    try {
      const response = await fetch(`${backendUrl}/admin/product-images/assign-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          cloudinaryPublicId: image.public_id,
          setAsPrimary: setAsPrimary
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Image assigned successfully to ${selectedProduct.name}!`);
        loadProductsWithoutImages();
        loadStatistics();
        setSelectedProduct(null);
        setSuggestedImages([]);
        onSuccess();
      } else {
        alert(`Failed to assign image: ${data.error}`);
      }
    } catch (error) {
      console.error('Error assigning image:', error);
      alert('Failed to assign image');
    } finally {
      setAssigning(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assignment Rate</p>
                <p className="text-2xl font-semibold text-green-600">
                  {statistics.assignmentPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">With Images</p>
                <p className="text-2xl font-semibold text-blue-600">{statistics.productsWithImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Without Images</p>
                <p className="text-2xl font-semibold text-red-600">{statistics.productsWithoutImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalProducts}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Assignment Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">🚀 Bulk Image Assignment</h3>
          <button
            onClick={handleAutoAssignAll}
            disabled={assigning}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {assigning ? '🔄 Processing...' : '⚡ Auto-Assign All Products'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          This will automatically assign appropriate Cloudinary images to all products based on their categories and names.
        </p>
      </div>

      {/* Products Without Images */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              📋 Products Without Images ({productsWithoutImages.length})
            </h3>
            <button
              onClick={loadProductsWithoutImages}
              disabled={loading}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              {loading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : productsWithoutImages.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-6xl">🎉</span>
              <h4 className="mt-4 text-lg font-medium text-gray-900">All Products Have Images!</h4>
              <p className="mt-2 text-gray-500">Every product in your catalog has been assigned appropriate images.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsWithoutImages.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {product.categoryName}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>{formatPrice(product.price)}</span>
                    <span>Stock: {product.stockQuantity}</span>
                  </div>
                  
                  <button className="mt-3 w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                    📸 Assign Images
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  📸 Assign Images to: {selectedProduct.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSuggestedImages([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading suggested images...</p>
                </div>
              ) : suggestedImages.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-6xl">🔍</span>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">No Suggestions Found</h4>
                  <p className="mt-2 text-gray-500">
                    No suitable images found for this product in the {selectedProduct.categoryName} category.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      🎯 Suggested Images (Ranked by Relevance)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Click on an image to assign it to this product. Images are ranked based on name similarity.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedImages.map((image, index) => (
                      <div
                        key={image.public_id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={image.secure_url}
                            alt={image.public_id}
                            className="w-full h-48 object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                              🏆 Best Match
                            </div>
                          )}
                          {image.score && image.score > 0 && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                              Score: {image.score}
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h5 className="font-medium text-gray-900 text-sm mb-2 truncate">
                            {image.public_id.split('/').pop()}
                          </h5>
                          
                          <div className="space-y-1 text-xs text-gray-500 mb-3">
                            <p>📐 {image.width} × {image.height}</p>
                            <p>💾 {formatFileSize(image.bytes)}</p>
                            <p>🏷️ {image.format.toUpperCase()}</p>
                            {image.reason && (
                              <p className="text-blue-600">✨ {image.reason}</p>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAssignImage(image, true)}
                              disabled={assigning}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                              {assigning ? '🔄' : '⭐'} Set as Primary
                            </button>
                            <a
                              href={image.secure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                            >
                              👁️ View
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
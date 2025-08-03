'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  price: number;
  imageUrls: string[];
  isActive: boolean;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

interface ProductImageEditorProps {
  onSuccess: () => void;
}

export default function ProductImageEditor({ onSuccess }: ProductImageEditorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableImages, setAvailableImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

  useEffect(() => {
    searchProducts();
  }, [searchTerm]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `${backendUrl}/products/search?q=${encodeURIComponent(searchTerm)}&size=50`
        : `${backendUrl}/products?size=50`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        // Transform the products to include category names
        const productsWithCategories = await Promise.all(
          data.content.map(async (product: any) => {
            try {
              const categoryResponse = await fetch(`${backendUrl}/categories/${product.categoryId}`);
              const categoryData = await categoryResponse.json();
              return {
                ...product,
                categoryName: categoryData.name || 'Unknown Category'
              };
            } catch {
              return {
                ...product,
                categoryName: 'Unknown Category'
              };
            }
          })
        );
        setProducts(productsWithCategories);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    
    // Load available images for the product's category
    if (product.categoryName) {
      try {
        const response = await fetch(`${backendUrl}/admin/product-images/available-images/${encodeURIComponent(product.categoryName)}`);
        const data = await response.json();
        
        if (data.success) {
          setAvailableImages(data.data || []);
        }
      } catch (error) {
        console.error('Error loading available images:', error);
        setAvailableImages([]);
      }
    }
  };

  const handleUpdateProductImages = async (imageUrls: string[]) => {
    if (!selectedProduct) return;

    setUpdating(true);
    try {
      const response = await fetch(`${backendUrl}/admin/product-images/${selectedProduct.id}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrls }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Product images updated successfully!');
        
        // Update the product in the list
        setProducts(products.map(p => 
          p.id === selectedProduct.id 
            ? { ...p, imageUrls } 
            : p
        ));
        
        // Update selected product
        setSelectedProduct({ ...selectedProduct, imageUrls });
        
        onSuccess();
      } else {
        alert(`Failed to update images: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating product images:', error);
      alert('Failed to update images');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddImage = (imageUrl: string) => {
    if (!selectedProduct) return;
    
    const updatedImages = [...selectedProduct.imageUrls];
    if (!updatedImages.includes(imageUrl)) {
      updatedImages.push(imageUrl);
      handleUpdateProductImages(updatedImages);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (!selectedProduct) return;
    
    const updatedImages = selectedProduct.imageUrls.filter(url => url !== imageUrl);
    handleUpdateProductImages(updatedImages);
  };

  const handleReorderImages = (dragIndex: number, hoverIndex: number) => {
    if (!selectedProduct) return;
    
    const updatedImages = [...selectedProduct.imageUrls];
    const draggedImage = updatedImages[dragIndex];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    
    handleUpdateProductImages(updatedImages);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {products.length} products found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">📦 Products</h3>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-6xl">📦</span>
                <h4 className="mt-4 text-lg font-medium text-gray-900">No Products Found</h4>
                <p className="mt-2 text-gray-500">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>SKU: {product.sku}</p>
                          <p>Category: {product.categoryName}</p>
                          <p>Price: {formatPrice(product.price)}</p>
                          <p>Images: {product.imageUrls.length}</p>
                        </div>
                      </div>
                      
                      {product.imageUrls.length > 0 && (
                        <div className="ml-4">
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Editor */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              🖼️ Image Editor
              {selectedProduct && ` - ${selectedProduct.name}`}
            </h3>
          </div>
          
          <div className="p-6">
            {!selectedProduct ? (
              <div className="text-center py-12">
                <span className="text-6xl">👈</span>
                <h4 className="mt-4 text-lg font-medium text-gray-900">Select a Product</h4>
                <p className="mt-2 text-gray-500">Choose a product from the list to manage its images.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Product Images */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Current Images ({selectedProduct.imageUrls.length})
                  </h4>
                  
                  {selectedProduct.imageUrls.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <span className="text-4xl">📷</span>
                      <p className="mt-2 text-gray-500">No images assigned</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProduct.imageUrls.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                              Primary
                            </div>
                          )}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRemoveImage(imageUrl)}
                              disabled={updating}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Images */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Available Images - {selectedProduct.categoryName} ({availableImages.length})
                  </h4>
                  
                  {availableImages.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-4xl">🔍</span>
                      <p className="mt-2 text-gray-500">No images available for this category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {availableImages.map((image) => (
                        <div key={image.public_id} className="relative group">
                          <img
                            src={image.secure_url}
                            alt={image.public_id}
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleAddImage(image.secure_url)}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleAddImage(image.secure_url)}
                                disabled={updating || selectedProduct.imageUrls.includes(image.secure_url)}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-gray-400"
                              >
                                {selectedProduct.imageUrls.includes(image.secure_url) ? '✓ Added' : '+ Add'}
                              </button>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
                            {image.width} × {image.height}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {updating && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Updating images...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
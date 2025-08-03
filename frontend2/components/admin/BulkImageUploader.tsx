'use client';

import { useState } from 'react';

interface BulkUploadImage {
  name: string;
  url: string;
  folder: string;
  tags: string[];
  category: string;
}

interface BulkImageUploaderProps {
  onUploadComplete: () => void;
  onUploadError: (error: string) => void;
}

export default function BulkImageUploader({ onUploadComplete, onUploadError }: BulkImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('electronics');

  // Pre-defined product images for bulk upload
  const bulkImages: { [key: string]: BulkUploadImage[] } = {
    electronics: [
      {
        name: 'samsung-galaxy-s24-ultra',
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        folder: 'ritkart/electronics',
        tags: ['smartphone', 'samsung', 'android', 'electronics'],
        category: 'Electronics'
      },
      {
        name: 'iphone-15-pro-max',
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        folder: 'ritkart/electronics',
        tags: ['smartphone', 'iphone', 'apple', 'electronics'],
        category: 'Electronics'
      },
      {
        name: 'sony-wh1000xm5',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1484&q=80',
        folder: 'ritkart/electronics',
        tags: ['headphones', 'sony', 'audio', 'electronics'],
        category: 'Electronics'
      },
      {
        name: 'macbook-air-m2',
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1487&q=80',
        folder: 'ritkart/electronics',
        tags: ['laptop', 'macbook', 'apple', 'electronics'],
        category: 'Electronics'
      },
      {
        name: 'dell-xps-13',
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
        folder: 'ritkart/electronics',
        tags: ['laptop', 'dell', 'windows', 'electronics'],
        category: 'Electronics'
      }
    ],
    fashion: [
      {
        name: 'levis-jeans-men',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1626&q=80',
        folder: 'ritkart/fashion',
        tags: ['jeans', 'levis', 'men', 'fashion'],
        category: 'Fashion'
      },
      {
        name: 'womens-floral-dress',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1583&q=80',
        folder: 'ritkart/fashion',
        tags: ['dress', 'floral', 'women', 'fashion'],
        category: 'Fashion'
      },
      {
        name: 'nike-air-max',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1612&q=80',
        folder: 'ritkart/fashion',
        tags: ['sneakers', 'nike', 'shoes', 'fashion'],
        category: 'Fashion'
      },
      {
        name: 'leather-handbag',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1587&q=80',
        folder: 'ritkart/fashion',
        tags: ['handbag', 'leather', 'women', 'fashion'],
        category: 'Fashion'
      }
    ],
    home: [
      {
        name: 'sofa-set-3-seater',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1558&q=80',
        folder: 'ritkart/home',
        tags: ['sofa', 'furniture', 'living-room', 'home'],
        category: 'Home & Furniture'
      },
      {
        name: 'dining-table-6-seater',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        folder: 'ritkart/home',
        tags: ['dining-table', 'furniture', 'dining-room', 'home'],
        category: 'Home & Furniture'
      },
      {
        name: 'ceramic-dinner-set',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        folder: 'ritkart/home',
        tags: ['dinnerware', 'ceramic', 'kitchen', 'home'],
        category: 'Home & Furniture'
      }
    ],
    mobiles: [
      {
        name: 'oneplus-12',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
        folder: 'ritkart/mobiles',
        tags: ['smartphone', 'oneplus', 'android', 'mobiles'],
        category: 'Mobiles'
      },
      {
        name: 'google-pixel-8',
        url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80',
        folder: 'ritkart/mobiles',
        tags: ['smartphone', 'google', 'pixel', 'mobiles'],
        category: 'Mobiles'
      },
      {
        name: 'xiaomi-14-ultra',
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1629&q=80',
        folder: 'ritkart/mobiles',
        tags: ['smartphone', 'xiaomi', 'android', 'mobiles'],
        category: 'Mobiles'
      }
    ]
  };

  const uploadImageFromUrl = async (imageData: BulkUploadImage): Promise<any> => {
    try {
      // Download the image from URL
      const response = await fetch(imageData.url);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', blob, `${imageData.name}.jpg`);
      formData.append('folder', imageData.folder);
      formData.append('publicId', imageData.name);
      formData.append('tags', imageData.tags.join(','));

      // Upload to backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const uploadResponse = await fetch(`${backendUrl}/admin/images/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      
      if (result.success) {
        return {
          success: true,
          name: imageData.name,
          url: result.data.secure_url,
          message: 'Uploaded successfully'
        };
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      return {
        success: false,
        name: imageData.name,
        error: error.message
      };
    }
  };

  const startBulkUpload = async () => {
    const imagesToUpload = bulkImages[selectedCategory];
    if (!imagesToUpload || imagesToUpload.length === 0) {
      onUploadError('No images selected for upload');
      return;
    }

    setIsUploading(true);
    setUploadResults([]);
    setUploadProgress({});

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < imagesToUpload.length; i++) {
      const imageData = imagesToUpload[i];
      
      // Update progress
      setUploadProgress(prev => ({
        ...prev,
        [imageData.name]: 50 // Set to 50% while uploading
      }));

      try {
        const result = await uploadImageFromUrl(imageData);
        
        if (result.success) {
          successCount++;
          setUploadProgress(prev => ({
            ...prev,
            [imageData.name]: 100
          }));
        } else {
          failureCount++;
          setUploadProgress(prev => ({
            ...prev,
            [imageData.name]: 0
          }));
        }

        results.push(result);
        setUploadResults([...results]);

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        failureCount++;
        setUploadProgress(prev => ({
          ...prev,
          [imageData.name]: 0
        }));

        results.push({
          success: false,
          name: imageData.name,
          error: error.message
        });
        setUploadResults([...results]);
      }
    }

    setIsUploading(false);
    
    if (successCount > 0) {
      onUploadComplete();
    }

    if (failureCount > 0) {
      onUploadError(`${failureCount} uploads failed out of ${imagesToUpload.length}`);
    }
  };

  const categories = Object.keys(bulkImages);
  const selectedImages = bulkImages[selectedCategory] || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">Bulk Image Uploader</h2>
        <p className="text-blue-100">Upload high-quality product images to your Cloudinary account with proper organization</p>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === category
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {category === 'electronics' && '📱'}
                  {category === 'fashion' && '👕'}
                  {category === 'home' && '🏠'}
                  {category === 'mobiles' && '📞'}
                </div>
                <div className="font-medium capitalize">{category}</div>
                <div className="text-sm text-gray-500">{bulkImages[category].length} images</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Images Preview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Images to Upload ({selectedImages.length})
          </h3>
          <button
            onClick={startBulkUpload}
            disabled={isUploading || selectedImages.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <i className="ri-loader-line animate-spin mr-2"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="ri-upload-cloud-line mr-2"></i>
                Start Upload
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedImages.map((image, index) => {
            const progress = uploadProgress[image.name] || 0;
            const result = uploadResults.find(r => r.name === image.name);
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Progress overlay */}
                  {isUploading && progress > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                          {progress === 100 ? (
                            <i className="ri-check-line text-green-400 text-xl"></i>
                          ) : (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                        <div className="text-sm">{progress}%</div>
                      </div>
                    </div>
                  )}

                  {/* Result indicator */}
                  {result && !isUploading && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      result.success ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <i className={`text-white text-sm ${
                        result.success ? 'ri-check-line' : 'ri-close-line'
                      }`}></i>
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate" title={image.name}>
                    {image.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{image.folder}</p>
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{image.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {result && !result.success && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      {result.error}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {uploadResults.filter(r => r.success).length}
              </div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {uploadResults.filter(r => !r.success).length}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {uploadResults.length}
              </div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="max-h-60 overflow-y-auto">
            {uploadResults.map((result, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border-l-4 mb-2 rounded ${
                result.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <i className={`mr-3 ${
                    result.success 
                      ? 'ri-check-circle-line text-green-500' 
                      : 'ri-error-warning-line text-red-500'
                  }`}></i>
                  <div>
                    <div className="font-medium text-sm">{result.name}</div>
                    {result.success ? (
                      <div className="text-xs text-green-600">Uploaded successfully</div>
                    ) : (
                      <div className="text-xs text-red-600">{result.error}</div>
                    )}
                  </div>
                </div>
                {result.success && result.url && (
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <i className="ri-external-link-line"></i>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
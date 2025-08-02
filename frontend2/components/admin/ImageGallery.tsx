'use client';

import { useState } from 'react';

interface AdminImage {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  tags: string[];
  folder: string;
}

interface ImageGalleryProps {
  images: AdminImage[];
  loading: boolean;
  onImageSelect: (image: AdminImage) => void;
  onImageDeleted: () => void;
  onImageUpdated: () => void;
}

export default function ImageGallery({ 
  images, 
  loading, 
  onImageSelect, 
  onImageDeleted,
  onImageUpdated 
}: ImageGalleryProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [deletingImages, setDeletingImages] = useState<string[]>([]);

  const handleImageSelect = (publicId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(publicId)) {
        return prev.filter(id => id !== publicId);
      } else {
        return [...prev, publicId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.public_id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) {
      alert('No images selected');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`);
    if (!confirmed) return;

    setDeletingImages(selectedImages);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      
      if (selectedImages.length === 1) {
        // Single delete
        const publicId = selectedImages[0].replace(/\//g, '_');
        const response = await fetch(`${backendUrl}/admin/images/${publicId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          onImageDeleted();
          setSelectedImages([]);
        } else {
          alert(`Failed to delete image: ${data.error}`);
        }
      } else {
        // Bulk delete
        const response = await fetch(`${backendUrl}/admin/images/bulk`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicIds: selectedImages
          }),
        });

        const data = await response.json();
        if (data.success) {
          onImageDeleted();
          setSelectedImages([]);
          alert(`Successfully deleted ${data.data.deleted_count} images`);
        } else {
          alert(`Failed to delete images: ${data.error}`);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete images');
    } finally {
      setDeletingImages([]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">📷</span>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Images Found</h3>
        <p className="mt-2 text-gray-500">
          Upload some images or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
          </button>
          
          {selectedImages.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedImages.length} selected
            </span>
          )}
        </div>

        {selectedImages.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={deletingImages.length > 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {deletingImages.length > 0 ? 'Deleting...' : `Delete Selected (${selectedImages.length})`}
          </button>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.public_id}
            className={`bg-white rounded-lg shadow border-2 transition-all ${
              selectedImages.includes(image.public_id)
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              deletingImages.includes(image.public_id) ? 'opacity-50' : ''
            }`}
          >
            {/* Image Selection Checkbox */}
            <div className="relative">
              <img
                src={image.secure_url}
                alt={image.public_id}
                className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
                onClick={() => onImageSelect(image)}
                loading="lazy"
              />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.public_id)}
                  onChange={() => handleImageSelect(image.public_id)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              {deletingImages.includes(image.public_id) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Image Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm truncate" title={image.public_id}>
                {image.public_id.split('/').pop()}
              </h3>
              
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <p>📁 {image.folder?.replace('ritkart/', '') || 'No folder'}</p>
                <p>📐 {image.width} × {image.height}</p>
                <p>💾 {formatFileSize(image.bytes)}</p>
                <p>📅 {formatDate(image.created_at)}</p>
                <p>🏷️ {image.format.toUpperCase()}</p>
              </div>

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {image.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{image.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => onImageSelect(image)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                
                <a
                  href={image.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More (if pagination is implemented) */}
      {images.length >= 50 && (
        <div className="text-center py-8">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Load More Images
          </button>
        </div>
      )}
    </div>
  );
}
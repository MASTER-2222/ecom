'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '../../components/admin/ImageUploader';
import BulkImageUploader from '../../components/admin/BulkImageUploader';
import ImageGallery from '../../components/admin/ImageGallery';
import ImageEditor from '../../components/admin/ImageEditor';
import StorageAnalytics from '../../components/admin/StorageAnalytics';
import ProductImageManager from '../../components/admin/ProductImageManager';
import ProductImageEditor from '../../components/admin/ProductImageEditor';

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

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('product-manager');
  const [images, setImages] = useState<AdminImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<AdminImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const folders = [
    'ritkart/electronics',
    'ritkart/mobiles',
    'ritkart/fashion',
    'ritkart/home',
    'ritkart/appliances',
    'ritkart/books',
    'ritkart/categories'
  ];

  // Load images on component mount and when refresh is triggered
  useEffect(() => {
    if (activeTab === 'gallery' || activeTab === 'editor') {
      loadImages();
    }
  }, [activeTab, selectedFolder, refreshTrigger]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const params = new URLSearchParams();
      
      if (selectedFolder) {
        params.append('folder', selectedFolder);
      }
      params.append('pageSize', '50');

      const response = await fetch(`${backendUrl}/admin/images/list?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setImages(data.data.images || []);
        } else {
          console.error('Failed to load images:', data.error);
        }
      } else {
        console.error('Failed to load images:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredImages = images.filter(image => {
    if (!searchTerm) return true;
    return image.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  const tabs = [
    { id: 'product-manager', label: 'Product Images', icon: '🏷️' },
    { id: 'product-editor', label: 'Image Editor', icon: '✏️' },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: '⚡' },
    { id: 'upload', label: 'Upload Images', icon: '📤' },
    { id: 'gallery', label: 'Image Gallery', icon: '🖼️' },
    { id: 'editor', label: 'Image Editor', icon: '🔧' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">RitKART Admin Panel</h1>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Image Management
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? '🔄' : '🔄'} Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'bulk-upload' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Upload Product Images</h2>
              <BulkImageUploader 
                onUploadComplete={refreshImages}
                onUploadError={(error) => console.error('Bulk upload error:', error)}
              />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Images</h2>
              <ImageUploader onUploadSuccess={refreshImages} folders={folders} />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Image Gallery</h2>
                <div className="mt-4 sm:mt-0 flex space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                  
                  {/* Folder Filter */}
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Folders</option>
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder.replace('ritkart/', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageGallery 
                images={filteredImages}
                loading={loading}
                onImageSelect={setSelectedImage}
                onImageDeleted={refreshImages}
                onImageUpdated={refreshImages}
              />
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Image Editor</h2>
              {selectedImage ? (
                <ImageEditor 
                  image={selectedImage}
                  onImageUpdated={refreshImages}
                  onClose={() => setSelectedImage(null)}
                />
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl">🖼️</span>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Image Selected</h3>
                  <p className="mt-2 text-gray-500">
                    Select an image from the gallery to edit its properties and metadata.
                  </p>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Gallery
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Storage Analytics</h2>
              <StorageAnalytics />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Images</p>
                <p className="text-2xl font-semibold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📂</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Folders</p>
                <p className="text-2xl font-semibold text-gray-900">{folders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Size</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(images.reduce((sum, img) => sum + (img.bytes || 0), 0) / 1024 / 1024).toFixed(1)}MB
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tagged Images</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {images.filter(img => img.tags && img.tags.length > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
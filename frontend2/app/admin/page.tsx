'use client';

import { useState, useEffect } from 'react';
import AdminAuth, { isAdminAuthenticated, logoutAdmin, getAdminEmail } from '../../components/admin/AdminAuth';
import Dashboard from '../../components/admin/Dashboard';
import UserManagement from '../../components/admin/UserManagement';
import ProductManagement from '../../components/admin/ProductManagement';
import CategoryManagement from '../../components/admin/CategoryManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import ImageUploader from '../../components/admin/ImageUploader';
import BulkImageUploader from '../../components/admin/BulkImageUploader';
import ImageGallery from '../../components/admin/ImageGallery';
import ImageEditor from '../../components/admin/ImageEditor';
import StorageAnalytics from '../../components/admin/StorageAnalytics';
import ProductImageManager from '../../components/admin/ProductImageManager';
import ProductImageEditor from '../../components/admin/ProductImageEditor';
import ProductImageOverview from '../../components/admin/ProductImageOverview';
import CloudinaryCleanup from '../../components/admin/CloudinaryCleanup';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [images, setImages] = useState<AdminImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<AdminImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

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

  const handleLogin = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminAuth onLogin={handleLogin} />;
  }

  const filteredImages = images.filter(image => {
    if (!searchTerm) return true;
    return image.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'image-overview', label: 'Image Overview', icon: '📊' },
    { id: 'product-manager', label: 'Product Images', icon: '🖼️' },
    { id: 'cleanup', label: 'Image Cleanup', icon: '🧹' },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
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
                Complete Management System
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {getAdminEmail() || 'Admin'}
              </span>
              <button
                onClick={refreshImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? '🔄' : '🔄'} Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                🚪 Logout
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
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <Dashboard onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <UserManagement onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-6">
              <ProductManagement onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-6">
              <CategoryManagement onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-6">
              <OrderManagement onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'image-overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">🎯 Complete Product Image Overview</h2>
              <ProductImageOverview onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'product-manager' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Image Management</h2>
              <ProductImageManager onSuccess={refreshImages} />
            </div>
          )}

          {activeTab === 'cleanup' && (
            <div className="p-6">
              <CloudinaryCleanup />
            </div>
          )}

          {activeTab === 'bulk-upload' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Upload Product Images</h2>
              <BulkImageUploader
                onUploadComplete={refreshImages}
                onUploadError={(error) => console.error('Bulk upload error:', error)}
              />
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
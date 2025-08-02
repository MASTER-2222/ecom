'use client';

import { useState, useEffect } from 'react';

interface StorageData {
  plan: string;
  last_updated: string;
  objects: {
    used: number;
    limit: number;
  };
  bandwidth: {
    used: number;
    limit: number;
  };
  storage: {
    used: number;
    limit: number;
  };
  requests: number;
  resources: number;
  derived_resources: number;
}

export default function StorageAnalytics() {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStorageAnalytics();
  }, []);

  const loadStorageAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const response = await fetch(`${backendUrl}/admin/images/analytics/storage`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStorageData(data.data);
        } else {
          setError(data.error || 'Failed to load analytics');
        }
      } else {
        setError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const calculatePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">⚠️</span>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Analytics</h3>
        <p className="mt-2 text-gray-500">{error}</p>
        <button
          onClick={loadStorageAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!storageData) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">📊</span>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Analytics Data</h3>
        <p className="mt-2 text-gray-500">Unable to load storage analytics.</p>
      </div>
    );
  }

  const storagePercentage = calculatePercentage(storageData.storage.used, storageData.storage.limit);
  const bandwidthPercentage = calculatePercentage(storageData.bandwidth.used, storageData.bandwidth.limit);
  const objectsPercentage = calculatePercentage(storageData.objects.used, storageData.objects.limit);

  return (
    <div className="space-y-6">
      {/* Plan Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Cloudinary Plan: {storageData.plan || 'Unknown'}
            </h3>
            <p className="text-blue-700">
              Last updated: {new Date(storageData.last_updated).toLocaleDateString()}
            </p>
          </div>
          <div className="text-2xl">☁️</div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Storage Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Storage Usage</h4>
            <span className="text-2xl">💾</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used:</span>
              <span className="font-medium">{formatBytes(storageData.storage.used)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Limit:</span>
              <span className="font-medium">{formatBytes(storageData.storage.limit)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getUsageColor(storagePercentage)}`}
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm font-medium text-gray-700">
              {storagePercentage}% used
            </div>
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Bandwidth Usage</h4>
            <span className="text-2xl">📈</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used:</span>
              <span className="font-medium">{formatBytes(storageData.bandwidth.used)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Limit:</span>
              <span className="font-medium">{formatBytes(storageData.bandwidth.limit)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getUsageColor(bandwidthPercentage)}`}
                style={{ width: `${Math.min(bandwidthPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm font-medium text-gray-700">
              {bandwidthPercentage}% used
            </div>
          </div>
        </div>

        {/* Objects Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Objects</h4>
            <span className="text-2xl">📁</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used:</span>
              <span className="font-medium">{formatNumber(storageData.objects.used)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Limit:</span>
              <span className="font-medium">{formatNumber(storageData.objects.limit)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getUsageColor(objectsPercentage)}`}
                style={{ width: `${Math.min(objectsPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm font-medium text-gray-700">
              {objectsPercentage}% used
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 mb-4">Resource Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Resources:</span>
              <span className="font-medium">{formatNumber(storageData.resources)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Derived Resources:</span>
              <span className="font-medium">{formatNumber(storageData.derived_resources)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Requests:</span>
              <span className="font-medium">{formatNumber(storageData.requests)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 mb-4">Usage Recommendations</h4>
          <div className="space-y-2 text-sm">
            {storagePercentage > 80 && (
              <div className="flex items-start space-x-2 text-red-600">
                <span>⚠️</span>
                <span>Storage usage is high. Consider cleaning up unused images.</span>
              </div>
            )}
            {bandwidthPercentage > 80 && (
              <div className="flex items-start space-x-2 text-yellow-600">
                <span>⚠️</span>
                <span>Bandwidth usage is high. Optimize image delivery.</span>
              </div>
            )}
            {storagePercentage < 50 && bandwidthPercentage < 50 && (
              <div className="flex items-start space-x-2 text-green-600">
                <span>✅</span>
                <span>Usage levels are healthy.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadStorageAnalytics}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}
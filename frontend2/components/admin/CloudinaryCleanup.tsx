'use client';

import React, { useState } from 'react';

interface DuplicateImage {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
}

interface CleanupStats {
  totalImages: number;
  duplicateImages: number;
  uniqueImages: number;
  storageSaved: string;
}

export default function CloudinaryCleanup() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateImage[]>([]);
  const [stats, setStats] = useState<CleanupStats | null>(null);
  const [cleanupResults, setCleanupResults] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  const analyzeDuplicates = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/images/analyze-duplicates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDuplicates(data.duplicates || []);
        setStats(data.stats || null);
      } else {
        alert('Failed to analyze duplicates');
      }
    } catch (error) {
      console.error('Error analyzing duplicates:', error);
      alert('Error analyzing duplicates');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeDuplicates = async (dryRun = true) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/images/remove-duplicates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          dryRun,
          duplicateIds: duplicates.map(d => d.public_id)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCleanupResults(data);
        
        if (!dryRun) {
          // Refresh analysis after actual cleanup
          await analyzeDuplicates();
        }
        
        alert(`${dryRun ? 'Dry run completed' : 'Cleanup completed'}: ${data.message}`);
      } else {
        alert('Failed to remove duplicates');
      }
    } catch (error) {
      console.error('Error removing duplicates:', error);
      alert('Error removing duplicates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <span className="text-3xl mr-4">🧹</span>
          <div>
            <h2 className="text-2xl font-bold">Cloudinary Duplicate Cleanup</h2>
            <p className="text-red-100 mt-1">
              Remove duplicate placeholder images to optimize storage and improve performance
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Duplicate Analysis</h3>
          <button
            onClick={analyzeDuplicates}
            disabled={analyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {analyzing ? '🔍 Analyzing...' : '🔍 Analyze Duplicates'}
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <p className="text-sm text-blue-600">Total Images</p>
                  <p className="text-xl font-semibold text-blue-900">{stats.totalImages}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔄</span>
                <div>
                  <p className="text-sm text-red-600">Duplicates Found</p>
                  <p className="text-xl font-semibold text-red-900">{stats.duplicateImages}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✨</span>
                <div>
                  <p className="text-sm text-green-600">Unique Images</p>
                  <p className="text-xl font-semibold text-green-900">{stats.uniqueImages}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💾</span>
                <div>
                  <p className="text-sm text-purple-600">Storage to Save</p>
                  <p className="text-xl font-semibold text-purple-900">{stats.storageSaved}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {duplicates.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <h4 className="font-medium text-yellow-800">
                Found {duplicates.length} duplicate images
              </h4>
            </div>
            <p className="text-sm text-yellow-700 mb-4">
              These images have identical file sizes (72,754 bytes), dimensions (800x800), and format (JPG), 
              indicating they are placeholder duplicates that should be removed.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => removeDuplicates(true)}
                disabled={loading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {loading ? '🔄 Processing...' : '🔍 Dry Run (Preview)'}
              </button>
              
              <button
                onClick={() => removeDuplicates(false)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? '🔄 Processing...' : '🗑️ Remove Duplicates'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Images List */}
      {duplicates.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Duplicate Images to Remove</h3>
            <p className="text-sm text-gray-500 mt-1">
              All these images have identical properties and appear to be placeholder duplicates
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {duplicates.slice(0, 12).map((image, index) => (
                <div key={image.public_id} className="border border-gray-200 rounded-lg p-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={image.secure_url}
                      alt={image.public_id}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    <p className="font-medium truncate">{image.public_id}</p>
                    <p>{image.width}×{image.height} • {(image.bytes / 1024).toFixed(1)}KB</p>
                  </div>
                </div>
              ))}
            </div>
            
            {duplicates.length > 12 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  ... and {duplicates.length - 12} more duplicate images
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cleanup Results */}
      {cleanupResults && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cleanup Results</h3>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-green-600 mr-2">✅</span>
              <h4 className="font-medium text-green-800">{cleanupResults.message}</h4>
            </div>
            
            <div className="text-sm text-green-700 space-y-1">
              <p>Successfully processed: {cleanupResults.successCount || 0} images</p>
              <p>Failed: {cleanupResults.failureCount || 0} images</p>
              {cleanupResults.storageSaved && (
                <p>Storage saved: {cleanupResults.storageSaved}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Cleanup Instructions</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>1. Analyze:</strong> Click "Analyze Duplicates" to scan your Cloudinary storage</p>
          <p><strong>2. Preview:</strong> Use "Dry Run" to see what would be deleted without making changes</p>
          <p><strong>3. Cleanup:</strong> Click "Remove Duplicates" to permanently delete duplicate images</p>
          <p><strong>4. Upload:</strong> Replace with unique, high-quality product images</p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">
          <p className="text-xs text-blue-700">
            <strong>⚠️ Safety Note:</strong> Always run a dry run first to preview changes. 
            Deleted images cannot be recovered from Cloudinary.
          </p>
        </div>
      </div>
    </div>
  );
}

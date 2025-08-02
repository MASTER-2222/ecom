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

interface ImageEditorProps {
  image: AdminImage;
  onImageUpdated: () => void;
  onClose: () => void;
}

export default function ImageEditor({ image, onImageUpdated, onClose }: ImageEditorProps) {
  const [tags, setTags] = useState(image.tags?.join(', ') || '');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateTags = async () => {
    setUpdating(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const publicId = image.public_id.replace(/\//g, '_');
      
      const response = await fetch(`${backendUrl}/admin/images/${publicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onImageUpdated();
        alert('Tags updated successfully!');
      } else {
        alert(`Failed to update tags: ${data.error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update tags');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteImage = async () => {
    const confirmed = confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const publicId = image.public_id.replace(/\//g, '_');
      
      const response = await fetch(`${backendUrl}/admin/images/${publicId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        onImageUpdated();
        onClose();
        alert('Image deleted successfully!');
      } else {
        alert(`Failed to delete image: ${data.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    } finally {
      setDeleting(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const transformationExamples = [
    {
      label: 'Thumbnail (300x300)',
      url: image.secure_url.replace('/upload/', '/upload/w_300,h_300,c_thumb,g_auto/')
    },
    {
      label: 'Large (800x800)',
      url: image.secure_url.replace('/upload/', '/upload/w_800,h_800,c_limit/')
    },
    {
      label: 'WebP Format',
      url: image.secure_url.replace('/upload/', '/upload/f_webp,q_auto/')
    },
    {
      label: 'Grayscale',
      url: image.secure_url.replace('/upload/', '/upload/e_grayscale/')
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Edit Image</h3>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ✕ Close
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.secure_url}
              alt={image.public_id}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Transformation Examples */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Transformation Examples</h4>
            <div className="grid grid-cols-2 gap-2">
              {transformationExamples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded p-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">{example.label}</p>
                  <img
                    src={example.url}
                    alt={example.label}
                    className="w-full h-20 object-cover rounded"
                    loading="lazy"
                  />
                  <button
                    onClick={() => copyToClipboard(example.url)}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Details and Editor */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Image Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Public ID:</span>
                <div className="flex items-center">
                  <span className="font-mono text-right">{image.public_id}</span>
                  <button
                    onClick={() => copyToClipboard(image.public_id)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Folder:</span>
                <span>{image.folder || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span>{image.width} × {image.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="uppercase">{image.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span>{formatFileSize(image.bytes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{formatDate(image.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URL:</span>
                <div className="flex items-center">
                  <a
                    href={image.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    🔗 View
                  </a>
                  <button
                    onClick={() => copyToClipboard(image.secure_url)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Editor */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
            <div className="space-y-3">
              <textarea
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas (e.g., product, electronics, featured)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleUpdateTags}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {updating ? 'Updating...' : 'Update Tags'}
              </button>
            </div>
          </div>

          {/* URL Generator */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">URL Generator</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transformation Parameters
                </label>
                <input
                  type="text"
                  placeholder="w_300,h_300,c_thumb,g_auto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const transformedUrl = image.secure_url.replace('/upload/', `/upload/${e.target.value}/`);
                    const previewImg = document.getElementById('transformation-preview') as HTMLImageElement;
                    if (previewImg && e.target.value) {
                      previewImg.src = transformedUrl;
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter Cloudinary transformation parameters
                </p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <img
                  id="transformation-preview"
                  src={image.secure_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-3">⚠️ Danger Zone</h4>
            <p className="text-sm text-red-700 mb-3">
              This action cannot be undone. The image will be permanently deleted from Cloudinary.
            </p>
            <button
              onClick={handleDeleteImage}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
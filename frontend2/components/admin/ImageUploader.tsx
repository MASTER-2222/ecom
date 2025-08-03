'use client';

import { useState } from 'react';

interface ImageUploaderProps {
  onUploadSuccess: () => void;
  folders: string[];
}

interface UploadResult {
  success: boolean;
  filename?: string;
  public_id?: string;
  secure_url?: string;
  error?: string;
}

export default function ImageUploader({ onUploadSuccess, folders }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [selectedFolder, setSelectedFolder] = useState(folders[0]);
  const [tags, setTags] = useState('');
  const [publicId, setPublicId] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 10) {
      alert('Maximum 10 files can be uploaded at once');
      return;
    }
    setSelectedFiles(files);
    setUploadResults([]);
  };

  const handleSingleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadResults([]);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const results: UploadResult[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', selectedFolder);
        
        if (tags.trim()) {
          formData.append('tags', tags);
        }
        
        if (publicId.trim() && selectedFiles.length === 1) {
          formData.append('publicId', publicId);
        }

        try {
          const response = await fetch(`${backendUrl}/admin/images/upload`, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          
          if (data.success) {
            results.push({
              success: true,
              filename: file.name,
              public_id: data.data.public_id,
              secure_url: data.data.secure_url,
            });
          } else {
            results.push({
              success: false,
              filename: file.name,
              error: data.error,
            });
          }
        } catch (error) {
          results.push({
            success: false,
            filename: file.name,
            error: error instanceof Error ? error.message : 'Upload failed',
          });
        }
      }

      setUploadResults(results);
      
      if (results.some(r => r.success)) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadResults([]);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      const formData = new FormData();
      
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file);
      });
      
      formData.append('folder', selectedFolder);
      
      if (tags.trim()) {
        formData.append('tags', tags);
      }

      const response = await fetch(`${backendUrl}/admin/images/upload-multiple`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadResults(data.data.results || []);
        onUploadSuccess();
      } else {
        setUploadResults([{ success: false, error: data.error }]);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResults([{ 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }]);
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles(null);
    setUploadResults([]);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <span className="text-4xl mb-4 block">📤</span>
          <label
            htmlFor="file-input"
            className="mt-2 block text-sm font-medium text-gray-900 cursor-pointer"
          >
            Select Images to Upload
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each. Maximum 10 files.
          </p>
        </div>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder
          </label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder.replace('ritkart/', '')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="product, electronics, featured"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public ID (single file only)
          </label>
          <input
            type="text"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            placeholder="custom-image-name"
            disabled={!!(selectedFiles && selectedFiles.length > 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Selected Files Display */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded px-3 py-2">
                <div>
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <span className="text-xs text-gray-500">{file.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSingleUpload}
          disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Individual'}
        </button>

        <button
          onClick={handleMultipleUpload}
          disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Batch'}
        </button>

        <button
          onClick={clearSelection}
          disabled={uploading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-blue-700">Uploading images...</span>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Upload Results</h4>
          <div className="space-y-2">
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded ${
                  result.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    {result.success ? '✅' : '❌'}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${
                      result.success ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {result.filename}
                    </p>
                    {result.success && result.public_id && (
                      <p className="text-xs text-green-700">
                        ID: {result.public_id}
                      </p>
                    )}
                    {!result.success && result.error && (
                      <p className="text-xs text-red-700">
                        Error: {result.error}
                      </p>
                    )}
                  </div>
                </div>
                {result.success && result.secure_url && (
                  <a
                    href={result.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
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
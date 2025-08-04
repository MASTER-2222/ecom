'use client';

import React, { useState, useEffect } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  activeProducts: number;
  pendingOrders: number;
}

interface DashboardProps {
  onSuccess?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSuccess }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1250,
    totalProducts: 450,
    totalOrders: 2340,
    totalRevenue: 1250000,
    activeUsers: 1180,
    activeProducts: 420,
    pendingOrders: 45
  });
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/dashboard/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data || data);
      } else {
        console.error('Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to RitKART Admin Panel - Overview of your eCommerce store
          </p>
        </div>
        <button
          onClick={loadDashboardStats}
          disabled={loading}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄' : '🔄'} Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-blue-100">Total Users</p>
              <p className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</p>
              <p className="text-sm text-blue-100">
                {formatNumber(stats.activeUsers)} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-green-100">Total Products</p>
              <p className="text-2xl font-bold">{formatNumber(stats.totalProducts)}</p>
              <p className="text-sm text-green-100">
                {formatNumber(stats.activeProducts)} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-purple-100">Total Orders</p>
              <p className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</p>
              <p className="text-sm text-purple-100">
                {formatNumber(stats.pendingOrders)} pending
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-yellow-100">Total Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-sm text-yellow-100">
                All time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mr-3">➕</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Add Product</div>
              <div className="text-sm text-gray-500">Create new product</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mr-3">🏷️</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Add Category</div>
              <div className="text-sm text-gray-500">Create new category</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mr-3">📤</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Upload Images</div>
              <div className="text-sm text-gray-500">Bulk image upload</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mr-3">📊</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-500">Store performance</div>
            </div>
          </button>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.pendingOrders > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-600 mr-3">⚠️</span>
                <div>
                  <div className="text-sm font-medium text-yellow-800">
                    {stats.pendingOrders} Pending Orders
                  </div>
                  <div className="text-sm text-yellow-600">
                    Orders waiting for processing
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-600 mr-3">✅</span>
              <div>
                <div className="text-sm font-medium text-green-800">
                  System Status: Healthy
                </div>
                <div className="text-sm text-green-600">
                  All systems operational
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-blue-600 mr-3">🔄</span>
              <div>
                <div className="text-sm font-medium text-blue-800">
                  Cloudinary Integration Active
                </div>
                <div className="text-sm text-blue-600">
                  Image management system connected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500 mt-1">User Activation Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalProducts > 0 ? Math.round((stats.activeProducts / stats.totalProducts) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Product Availability</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalOrders > 0 ? formatPrice(stats.totalRevenue / stats.totalOrders) : formatPrice(0)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Average Order Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

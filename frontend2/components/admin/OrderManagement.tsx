'use client';

import React, { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderManagementProps {
  onSuccess?: () => void;
}

export default function OrderManagement({ onSuccess }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'SHIPPED', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'REFUNDED', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/orders`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || data);
      } else {
        console.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadOrders();
        onSuccess?.();
        alert('Order status updated successfully');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const statusOption = paymentStatusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage customer orders and fulfillment
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders by number, customer email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄' : '🔄'} Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📋</span>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⏳</span>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-semibold">{orders.filter(o => o.status === 'PENDING').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🚚</span>
            <div>
              <p className="text-sm text-gray-500">Shipped</p>
              <p className="text-xl font-semibold">{orders.filter(o => o.status === 'SHIPPED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-xl font-semibold">{orders.filter(o => o.status === 'DELIVERED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💰</span>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold">
                {formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl animate-spin">🔄</span>
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{order.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Number:</span>
                        <span>#{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method:</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Date:</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name:</span>
                        <span>{selectedOrder.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span>{selectedOrder.userEmail}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Shipping Address:</span>
                        <p className="mt-1 text-gray-900">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">📦</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(item.quantity * item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserOrders } from '@/lib/database';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders || []);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { name: 'Order Confirmed', status: 'confirmed' },
      { name: 'Processing', status: 'processing' },
      { name: 'Shipped', status: 'shipped' },
      { name: 'Out for Delivery', status: 'out_for_delivery' },
      { name: 'Delivered', status: 'delivered' }
    ];

    const statusOrder = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4 w-24 h-24 flex items-center justify-center mx-auto"></i>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-[#2874f0] cursor-pointer">Home</Link>
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
          <span className="text-gray-800">My Orders</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your orders and view purchase history</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-6 w-24 h-24 flex items-center justify-center mx-auto"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link href="/" className="inline-block bg-[#2874f0] text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      {getTrackingSteps(order.status).map((step, index) => (
                        <div key={index} className="flex flex-col items-center relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500 text-white' : 
                            step.active ? 'bg-[#2874f0] text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <i className="ri-check-line text-sm w-4 h-4 flex items-center justify-center"></i>
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                          <p className="text-xs text-center mt-2 text-gray-600 max-w-20">{step.name}</p>
                          {index < getTrackingSteps(order.status).length - 1 && (
                            <div className={`absolute top-4 left-8 w-full h-0.5 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`} style={{width: '100px'}}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Order Items ({order.order_items.length})</h4>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <Link href={`/product/${item.product_id}`}>
                          <img
                            src={item.product_image || `https://readdy.ai/api/search-image?query=product%20placeholder&width=80&height=80&seq=order-${item.id}&orientation=squarish`}
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-md cursor-pointer object-top"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${item.product_id}`}>
                            <h5 className="font-medium text-gray-900 hover:text-[#2874f0] cursor-pointer">
                              {item.product_name}
                            </h5>
                          </Link>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3 mb-4 sm:mb-0">
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                        Track Order
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                        Download Invoice
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <Link href={`/orders/${order.id}`} className="text-[#2874f0] hover:underline text-sm cursor-pointer">
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="text-[#2874f0] hover:underline text-sm cursor-pointer">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
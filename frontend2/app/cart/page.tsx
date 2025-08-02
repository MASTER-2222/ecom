
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveForLater } from '@/lib/database';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  brand: string;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
      price: 124999,
      originalPrice: 149999,
      image: 'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20smartphone%20in%20titanium%20black%20color%20with%20sleek%20modern%20design%2C%20product%20photography%20on%20clean%20white%20background%2C%20professional%20lighting%2C%20high-end%20smartphone%20with%20premium%20metallic%20finish%20and%20camera%20module%20visible&width=200&height=200&seq=cart-s24&orientation=squarish',
      quantity: 1,
      brand: 'Samsung',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      price: 29990,
      originalPrice: 34990,
      image: 'https://readdy.ai/api/search-image?query=Sony%20premium%20wireless%20headphones%20noise%20cancelling%20black%20sleek%20design%20professional%20audio%20equipment%20clean%20white%20background%20high%20quality&width=200&height=200&seq=cart-sony&orientation=squarish',
      quantity: 1,
      brand: 'Sony',
      category: 'Electronics'
    },
    {
      id: '4',
      name: 'Levi\'s Men\'s 511 Slim Fit Jeans - Dark Blue',
      price: 2999,
      originalPrice: 4499,
      image: 'https://readdy.ai/api/search-image?query=Levis%20mens%20slim%20fit%20dark%20blue%20jeans%20with%20modern%20cut%20and%20premium%20denim%20fabric%2C%20professional%20fashion%20product%20photography%20on%20clean%20white%20background%2C%20stylish%20casual%20wear%20with%20brand%20details%20visible&width=200&height=200&seq=cart-levis&orientation=squarish',
      quantity: 1,
      brand: 'Levi\'s',
      category: 'Fashion'
    },
    {
      id: '8',
      name: 'LG 260L 3-Star Smart Inverter Frost-Free Double Door Refrigerator',
      price: 28999,
      originalPrice: 34999,
      image: 'https://readdy.ai/api/search-image?query=Modern%20stainless%20steel%20double%20door%20refrigerator%20with%20sleek%20design%20and%20digital%20display%2C%20energy%20efficient%20home%20appliance%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20premium%20kitchen%20appliance&width=200&height=200&seq=cart-lg-fridge&orientation=squarish',
      quantity: 1,
      brand: 'LG',
      category: 'Appliances'
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleSaveForLater = async (item: CartItem) => {
    try {
      await saveForLater({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        category: item.category
      });

      // Remove from cart after saving for later
      setCartItems(items => items.filter(cartItem => cartItem.id !== item.id));

      alert(`${item.name} has been saved for later!`);
    } catch (error) {
      console.error('Error saving for later:', error);
      alert('Failed to save item for later. Please try again.');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    alert('Redirecting to secure checkout...');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-6 w-24 h-24 flex items-center justify-center mx-auto"></i>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart to get started!</p>
            <Link href="/" className="inline-block bg-[#2874f0] text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-[#2874f0] cursor-pointer">Home</Link>
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
          <span className="text-gray-800">Shopping Cart</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Shopping Cart ({cartItems.length} items)</h1>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <Link href={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md cursor-pointer object-top"
                        />
                      </Link>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">{item.brand} • {item.category}</div>
                            <Link href={`/product/${item.id}`}>
                              <h3 className="font-medium text-gray-800 hover:text-[#2874f0] cursor-pointer mb-2">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                              <span className="text-green-600 text-sm font-medium">
                                {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <i className="ri-close-line text-xl w-6 h-6 flex items-center justify-center"></i>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <i className="ri-subtract-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">₹{item.price.toLocaleString()} each</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-4 text-sm">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="text-[#2874f0] hover:underline cursor-pointer"
                          >
                            <i className="ri-bookmark-line mr-1 w-4 h-4 flex items-center justify-center inline"></i>
                            Save for Later
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 cursor-pointer">
                            <i className="ri-share-line mr-1 w-4 h-4 flex items-center justify-center inline"></i>
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <Link href="/" className="text-[#2874f0] hover:underline text-sm cursor-pointer">
                  <i className="ri-arrow-left-line mr-1 w-4 h-4 flex items-center justify-center inline"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">You Save</span>
                  <span className="font-medium text-green-600">₹{savings.toLocaleString()}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    <i className="ri-check-line mr-1 w-4 h-4 flex items-center justify-center inline"></i>
                    You got free shipping!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    Add ₹{(50000 - subtotal).toLocaleString()} more for free shipping
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Inclusive of all taxes</div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#2874f0] text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors mb-4 whitespace-nowrap cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">Secure Checkout</div>
                <div className="flex justify-center space-x-2">
                  <i className="ri-secure-payment-line text-gray-400 w-5 h-5 flex items-center justify-center"></i>
                  <i className="ri-shield-check-line text-gray-400 w-5 h-5 flex items-center justify-center"></i>
                  <i className="ri-truck-line text-gray-400 w-5 h-5 flex items-center justify-center"></i>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Why Shop with RitKart?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="ri-truck-line text-green-500 mr-2 w-4 h-4 flex items-center justify-center"></i>
                    <span>Free delivery on orders over ₹50,000</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-arrow-left-right-line text-green-500 mr-2 w-4 h-4 flex items-center justify-center"></i>
                    <span>7-day easy returns</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-secure-payment-line text-green-500 mr-2 w-4 h-4 flex items-center justify-center"></i>
                    <span>100% secure payments</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-customer-service-line text-green-500 mr-2 w-4 h-4 flex items-center justify-center"></i>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[{
                id: '1',
                name: 'Samsung Galaxy S24',
                price: '₹1,24,999',
                category: 'Electronics'
              },
              {
                id: '5',
                name: 'Nike Air Force 1',
                price: '₹7,999',
                category: 'Fashion'
              },
              {
                id: '6',
                name: 'IKEA HEMNES Bed',
                price: '₹24,999',
                category: 'Home'
              },
              {
                id: '9',
                name: 'Samsung Washing Machine',
                price: '₹32,999',
                category: 'Appliances'
              },
              {
                id: '10',
                name: 'Psychology of Money',
                price: '₹299',
                category: 'Books'
              },
              {
                id: '3',
                name: 'MacBook Air M2',
                price: '₹1,14,900',
                category: 'Electronics'
              }].map((item) => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src={`https://readdy.ai/api/search-image?query=premium%20${item.category.toLowerCase()}%20product%20modern%20device%20clean%20white%20background%20professional%20product%20photography&width=150&height=150&seq=recent-${item.id}&orientation=squarish`}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded mb-2 object-top"
                    />
                    <div className="text-xs text-gray-600 line-clamp-2">{item.name}</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{item.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

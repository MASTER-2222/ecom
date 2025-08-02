'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import LoginModal from './LoginModal';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const [cartCount, setCartCount] = useState(4);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const categories = [
    { name: 'Electronics', href: '/electronics' },
    { name: 'Fashion', href: '/fashion' },
    { name: 'Home', href: '/home' },
    { name: 'Appliances', href: '/appliances' },
    { name: 'Mobiles', href: '/mobiles' },
    { name: 'Books', href: '/books' }
  ];

  return (
    <>
      <header className="bg-[#2874f0] text-white sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-['Pacifico'] text-white">RitKart</span>
            </Link>
            
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2 text-black rounded-sm text-sm focus:outline-none"
                />
                <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 flex items-center justify-center"></i>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {loading ? (
                <div className="w-20 h-8 bg-blue-600 rounded animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-white w-4 h-4 flex items-center justify-center"></i>
                      </div>
                    )}
                    <div className="relative group">
                      <span className="text-sm font-medium cursor-pointer">
                        Hi, {getUserDisplayName()}
                      </span>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-2">
                          <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <i className="ri-shopping-bag-line mr-2 w-4 h-4 flex items-center justify-center inline"></i>
                            My Orders
                          </Link>
                          <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <i className="ri-heart-line mr-2 w-4 h-4 flex items-center justify-center inline"></i>
                            My Wishlist
                          </Link>
                          <Link href="/saved-items" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <i className="ri-bookmark-line mr-2 w-4 h-4 flex items-center justify-center inline"></i>
                            Saved Items
                          </Link>
                          <div className="border-t border-gray-200"></div>
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <i className="ri-logout-circle-line mr-2 w-4 h-4 flex items-center justify-center inline"></i>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sm font-medium hover:bg-blue-600 px-4 py-2 rounded whitespace-nowrap cursor-pointer"
                >
                  Login / Sign Up
                </button>
              )}
              
              <Link href="/cart" className="relative cursor-pointer">
                <div className="flex items-center space-x-1">
                  <i className="ri-shopping-cart-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-sm">Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#fdd835] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <nav className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-[#2874f0] py-3 text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
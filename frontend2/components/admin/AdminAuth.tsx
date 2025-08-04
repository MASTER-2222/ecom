'use client';

import { useState } from 'react';

interface AdminAuthProps {
  onLogin: (isAuthenticated: boolean) => void;
}

export default function AdminAuth({ onLogin }: AdminAuthProps) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default admin credentials as specified
  const DEFAULT_ADMIN_EMAIL = 'admin@ritkart.com';
  const DEFAULT_ADMIN_PASSWORD = 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check against default credentials first
      if (credentials.email === DEFAULT_ADMIN_EMAIL && credentials.password === DEFAULT_ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem('ritkart_admin_session', 'authenticated');
        localStorage.setItem('ritkart_admin_email', credentials.email);
        onLogin(true);
        return;
      }

      // Try backend authentication
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user?.role === 'ADMIN') {
          // Store admin session
          localStorage.setItem('ritkart_admin_session', 'authenticated');
          localStorage.setItem('ritkart_admin_email', credentials.email);
          localStorage.setItem('ritkart_admin_token', data.token);
          onLogin(true);
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            RitKART Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">❌</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">🔄</span>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Default Admin Credentials</span>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium">For testing purposes:</p>
                <p className="mt-1">Email: <code className="bg-blue-100 px-1 rounded">admin@ritkart.com</code></p>
                <p>Password: <code className="bg-blue-100 px-1 rounded">admin123</code></p>
              </div>
            </div>
          </div>
        </form>

        <div className="text-center">
          <div className="text-sm text-gray-500">
            <p>🔒 Secure Admin Access</p>
            <p className="mt-1">RitKART eCommerce Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function to check if user is authenticated
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ritkart_admin_session') === 'authenticated';
};

// Utility function to logout admin
export const logoutAdmin = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ritkart_admin_session');
  localStorage.removeItem('ritkart_admin_email');
  localStorage.removeItem('ritkart_admin_token');
};

// Utility function to get admin email
export const getAdminEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ritkart_admin_email');
};

// Utility function to get admin token
export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ritkart_admin_token');
};

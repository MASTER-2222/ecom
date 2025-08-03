
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (!formData.firstName || !formData.lastName) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        success = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber || undefined,
        });
      }

      if (success) {
        onClose();
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
        });
      } else {
        setError(isLogin ? 'Invalid email or password' : 'Registration failed');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.response?.data?.message || error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Login to RitKART' : 'Join RitKART'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
                    placeholder="John"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
                    placeholder="Doe"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
                placeholder="+1 (555) 123-4567"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={8}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2874f0] text-white py-2 px-4 rounded-md hover:bg-blue-600 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Processing...
              </span>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </form>

        {isLogin && (
          <div className="mt-4 text-center">
            <a href="#" className="text-[#2874f0] hover:underline text-sm">
              Forgot your password?
            </a>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNumber: '',
              });
            }}
            disabled={loading}
            className="text-[#2874f0] hover:underline text-sm cursor-pointer disabled:opacity-50"
          >
            {isLogin 
              ? "New to RitKART? Create your account" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>

        {!isLogin && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to RitKART&apos;s{' '}
              <a href="#" className="text-[#2874f0] hover:underline">Terms of Use</a>
              {' '}and{' '}
              <a href="#" className="text-[#2874f0] hover:underline">Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

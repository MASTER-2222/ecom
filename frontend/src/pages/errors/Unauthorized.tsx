import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, LogIn, Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

interface UnauthorizedProps {
  requiredRole?: string;
  message?: string;
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ 
  requiredRole = 'user', 
  message 
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const defaultMessage = isAuthenticated 
    ? `You don't have permission to access this page. ${requiredRole === 'admin' ? 'Admin access required.' : 'Additional permissions needed.'}`
    : 'You need to be logged in to access this page.';

  const displayMessage = message || defaultMessage;

  const getAccessLevel = () => {
    if (!isAuthenticated) return 'Guest';
    if (user?.role === 'admin') return 'Administrator';
    if (user?.role === 'customer') return 'Customer';
    return 'User';
  };

  const getRequiredAccess = () => {
    switch (requiredRole) {
      case 'admin': return 'Administrator';
      case 'customer': return 'Customer Account';
      default: return 'User Account';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        {/* Lock Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="p-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full shadow-2xl">
              <Shield className="w-24 h-24 text-white" />
            </div>
            
            {/* Lock overlay */}
            <div className="absolute -bottom-2 -right-2 p-4 bg-red-600 rounded-full shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-300">
            401
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Access Denied
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {displayMessage}
          </p>
        </div>

        {/* Access Level Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Current Access */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Your Access Level
              </h3>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isAuthenticated ? 'Logged In' : 'Not Logged In'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Access Level:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {getAccessLevel()}
                  </span>
                </div>
                
                {isAuthenticated && user && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account:</span>
                    <span className="text-sm text-gray-800">
                      {user.email || user.firstName || 'User Account'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Required Access */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                Required Access
              </h3>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Required Level:</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {getRequiredAccess()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Page Type:</span>
                  <span className="text-sm text-gray-800">
                    {requiredRole === 'admin' ? 'Admin Only' : 'User Access'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Action Needed:</span>
                  <span className="text-sm text-gray-800">
                    {isAuthenticated ? 'Contact Admin' : 'Please Login'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Button>
              </Link>
              
              <Link to="/register">
                <Button 
                  variant="outline"
                  className="border-2 border-green-300 hover:border-green-400 text-green-600 hover:text-green-700 px-6 py-3 text-lg"
                >
                  <User className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg"
              >
                <User className="w-5 h-5 mr-2" />
                My Account
              </Button>
              
              <Link to="/contact">
                <Button 
                  variant="outline"
                  className="border-2 border-amber-300 hover:border-amber-400 text-amber-600 hover:text-amber-700 px-6 py-3 text-lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Request Access
                </Button>
              </Link>
            </>
          )}
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          
          <Link to="/">
            <Button 
              variant="outline"
              className="border-2 border-blue-300 hover:border-blue-400 text-blue-600 hover:text-blue-700 px-6 py-3 text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Help Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Need Help Getting Access?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  For Customers
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Create a free customer account</li>
                  <li>• Access your orders and wishlist</li>
                  <li>• Enjoy personalized recommendations</li>
                  <li>• Get exclusive deals and offers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  For Admin Access
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Contact your system administrator</li>
                  <li>• Provide business justification</li>
                  <li>• Complete security verification</li>
                  <li>• Follow company access policies</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Questions about access permissions?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/support">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="outline" size="sm">
                    View FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-gray-500">
          <p className="text-sm">
            Access Attempt Logged • Time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
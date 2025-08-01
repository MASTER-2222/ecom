import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ServerErrorProps {
  error?: Error;
  resetError?: () => void;
}

const ServerError: React.FC<ServerErrorProps> = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    if (resetError) {
      resetError();
    }
    // Try to navigate to the same page to retry
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="p-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-2xl">
              <AlertTriangle className="w-24 h-24 text-white" />
            </div>
            
            {/* Floating error indicators */}
            <div className="absolute -top-2 -right-2 p-3 bg-yellow-400 rounded-full shadow-lg animate-bounce">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="absolute -bottom-2 -left-2 p-3 bg-orange-400 rounded-full shadow-lg animate-pulse">
              <span className="text-2xl">🔧</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-300">
            500
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Server Error
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Oops! Something went wrong on our end. Our engineers have been notified and are working to fix this issue. 
            Please try again in a few moments.
          </p>

          {/* Error Details for Development */}
          {error && import.meta.env.MODE === 'development' && (
            <Card className="mt-6 text-left bg-red-50 border-red-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-red-800 mb-2">Error Details (Development Only):</h3>
                <pre className="text-sm text-red-700 overflow-auto">
                  {error.message}
                  {error.stack && (
                    <>
                      <br /><br />
                      {error.stack}
                    </>
                  )}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={handleRetry}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg shadow-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
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

        {/* Status Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* What Happened */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-6 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                What Happened?
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Our server encountered an unexpected error</li>
                <li>• The issue has been automatically reported</li>
                <li>• Our team is working to resolve it quickly</li>
                <li>• Your data and account are safe</li>
              </ul>
            </CardContent>
          </Card>

          {/* What You Can Do */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-6 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                What You Can Do
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Wait a moment and try again</li>
                <li>• Check your internet connection</li>
                <li>• Contact support if issue persists</li>
                <li>• Try accessing a different page</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Need Immediate Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If this problem persists, our support team is here to help you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              
              <a href="tel:+1-800-RITKART" className="inline-block">
                <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="mt-8 text-gray-500">
          <p className="text-sm">
            Error ID: {Date.now().toString(36).toUpperCase()} • 
            Time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
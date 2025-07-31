import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw, Wifi, WifiOff, Signal, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NetworkError: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Simulate checking connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (navigator.onLine) {
      window.location.reload();
    } else {
      setIsRetrying(false);
    }
  };

  const troubleshootingSteps = [
    {
      title: "Check Your Internet Connection",
      description: "Ensure your device is connected to WiFi or mobile data",
      icon: <Wifi className="w-5 h-5" />
    },
    {
      title: "Restart Your Router",
      description: "Unplug your router for 30 seconds, then plug it back in",
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      title: "Check Other Websites",
      description: "See if other websites are loading to isolate the issue",
      icon: <Signal className="w-5 h-5" />
    },
    {
      title: "Try Mobile Data",
      description: "Switch from WiFi to mobile data or vice versa",
      icon: <WifiOff className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Network Status Indicator */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className={`p-12 rounded-full shadow-2xl transition-colors duration-500 ${
              isOnline 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}>
              {isOnline ? (
                <Wifi className="w-24 h-24 text-white" />
              ) : (
                <WifiOff className="w-24 h-24 text-white" />
              )}
            </div>
            
            {/* Connection status badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge 
                variant={isOnline ? "default" : "destructive"}
                className={`px-4 py-2 text-sm font-medium ${
                  isOnline 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            {isOnline ? 'Connection Issues' : 'No Internet Connection'}
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {isOnline 
              ? 'We\'re having trouble connecting to our servers. This might be a temporary issue on our end or with your connection.'
              : 'It looks like you\'re not connected to the internet. Please check your connection and try again.'
            }
          </p>

          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Retry attempts: {retryCount}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </>
            )}
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
              className="border-2 border-green-300 hover:border-green-400 text-green-600 hover:text-green-700 px-6 py-3 text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Connection Status Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Current Status */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Signal className="w-5 h-5 text-blue-500" />
                Connection Status
              </h3>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Browser Status:</span>
                  <Badge variant={isOnline ? "default" : "destructive"}>
                    {isOnline ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Connection Type:</span>
                  <span className="text-sm text-gray-500">
                    {(navigator as any).connection?.effectiveType || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Checked:</span>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="w-full justify-start"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.google.com', '_blank')}
                  className="w-full justify-start"
                >
                  <Signal className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                
                <Link to="/offline" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <WifiOff className="w-4 h-4 mr-2" />
                    Browse Offline
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting Steps */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Troubleshooting Steps
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {troubleshootingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                    {step.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-gray-500">
          <p className="text-sm">
            Still having issues? Contact our{' '}
            <Link to="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              technical support
            </Link>
            {' '}team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
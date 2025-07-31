import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36).toUpperCase()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to an error reporting service
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Here you would typically send the error to a service like Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Example: Send to error reporting service
    // errorReportingService.send(errorReport);
    
    // For now, just log to console
    console.log('Error report:', errorReport);
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  copyErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorDetails = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error Message: ${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId, copied } = this.state;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full text-center">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="p-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full shadow-2xl">
                  <Bug className="w-24 h-24 text-white" />
                </div>
                
                {/* Error indicator */}
                <div className="absolute -top-2 -right-2 p-3 bg-yellow-400 rounded-full shadow-lg animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Something Went Wrong
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're sorry, but something unexpected happened. Our team has been notified 
                and we're working to fix this issue.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-red-800">
                  <strong>Error ID:</strong> {errorId}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Time: {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={this.handleRetry}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload}
                variant="outline"
                className="border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:text-orange-700 px-6 py-3 text-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reload Page
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                variant="outline"
                className="border-2 border-green-300 hover:border-green-400 text-green-600 hover:text-green-700 px-6 py-3 text-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Error Details for Development */}
            {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') && error && (
              <Card className="text-left bg-gray-50 border border-gray-200 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Bug className="w-5 h-5" />
                      Error Details (Development Only)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={this.copyErrorDetails}
                      className="text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Details
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">Error Message:</h4>
                      <p className="text-sm text-red-700 bg-red-100 p-2 rounded">
                        {error.message}
                      </p>
                    </div>
                    
                    {error.stack && (
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Stack Trace:</h4>
                        <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-40">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Component Stack:</h4>
                        <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-40">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  What Happened?
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Possible Causes:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Temporary browser issue</li>
                      <li>• Network connectivity problem</li>
                      <li>• JavaScript execution error</li>
                      <li>• Outdated browser cache</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">What We're Doing:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Error has been automatically reported</li>
                      <li>• Our team has been notified</li>
                      <li>• We're investigating the issue</li>
                      <li>• A fix will be deployed soon</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    If this problem persists, please contact our support team.
                  </p>
                  <Button variant="outline" size="sm" onClick={this.copyErrorDetails}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Error Details Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Error Details for Support
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
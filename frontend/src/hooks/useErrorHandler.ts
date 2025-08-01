import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface ErrorHandlerOptions {
  showToast?: boolean;
  redirectOnError?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const navigate = useNavigate();
  const { showToast = true, redirectOnError = true } = options;

  const handleError = useCallback((error: any, context?: string) => {
    console.error(`Error in ${context || 'application'}:`, error);

    // Network/Connection errors
    if (error.code === 'NETWORK_ERROR' || error.name === 'NetworkError' || !navigator.onLine) {
      if (redirectOnError) {
        navigate('/error/network');
      }
      return {
        type: 'network',
        message: 'Network connection error. Please check your internet connection.',
        shouldRedirect: redirectOnError
      };
    }

    // HTTP Status errors
    if (error.response?.status) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          if (redirectOnError) {
            navigate('/error/unauthorized');
          }
          return {
            type: 'unauthorized',
            message: 'You are not authorized to access this resource.',
            shouldRedirect: redirectOnError
          };
          
        case 403:
          if (redirectOnError) {
            navigate('/error/unauthorized', { 
              state: { 
                message: 'Access forbidden. You don\'t have permission to access this resource.',
                requiredRole: error.response.data?.requiredRole 
              }
            });
          }
          return {
            type: 'forbidden',
            message: 'Access forbidden.',
            shouldRedirect: redirectOnError
          };
          
        case 404:
          if (redirectOnError) {
            navigate('/error/404');
          }
          return {
            type: 'not_found',
            message: 'The requested resource was not found.',
            shouldRedirect: redirectOnError
          };
          
        case 500:
        case 502:
        case 503:
        case 504:
          if (redirectOnError) {
            navigate('/error/500', { 
              state: { 
                error: error.response.data?.message || 'Internal server error',
                status: status
              }
            });
          }
          return {
            type: 'server_error',
            message: 'Server error. Please try again later.',
            shouldRedirect: redirectOnError
          };
          
        default:
          return {
            type: 'http_error',
            message: error.response.data?.message || `HTTP ${status} error`,
            shouldRedirect: false
          };
      }
    }

    // JavaScript/Runtime errors
    if (error instanceof Error) {
      return {
        type: 'runtime_error',
        message: error.message,
        shouldRedirect: false
      };
    }

    // Generic/Unknown errors
    return {
      type: 'unknown_error',
      message: 'An unexpected error occurred.',
      shouldRedirect: false
    };
  }, [navigate, redirectOnError]);

  const handleAsyncError = useCallback(async (
    asyncOperation: () => Promise<any>,
    context?: string
  ) => {
    try {
      return await asyncOperation();
    } catch (error) {
      const errorInfo = handleError(error, context);
      
      // Re-throw the error if we're not handling it with a redirect
      if (!errorInfo.shouldRedirect) {
        throw error;
      }
      
      return null;
    }
  }, [handleError]);

  const createErrorBoundaryHandler = useCallback((error: Error, errorInfo: any) => {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // In production, you would report this to an error service
    if (import.meta.env.MODE === 'production') {
      // Report to error tracking service (Sentry, LogRocket, etc.)
      // errorReportingService.captureException(error, { extra: errorInfo });
    }

    return {
      type: 'boundary_error',
      message: 'A component error occurred',
      error: error,
      errorInfo: errorInfo
    };
  }, []);

  const retryOperation = useCallback(async (
    operation: () => Promise<any>,
    maxRetries: number = 3,
    delay: number = 1000
  ) => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
          throw error;
        }
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  }, []);

  return {
    handleError,
    handleAsyncError,
    createErrorBoundaryHandler,
    retryOperation
  };
};

// Utility function to check if error is recoverable
export const isRecoverableError = (error: any): boolean => {
  // Network errors are often recoverable
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return true;
  }
  
  // Server errors might be temporary
  if (error.response?.status >= 500) {
    return true;
  }
  
  // Timeout errors are recoverable
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }
  
  return false;
};

// Error reporting utility for production
export const reportError = (error: any, context?: string, additionalInfo?: any) => {
  const errorReport = {
    message: error.message || 'Unknown error',
    stack: error.stack,
    context: context || 'unknown',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    additionalInfo
  };

  // In development, log to console
  if (import.meta.env.MODE === 'development') {
    console.error('Error Report:', errorReport);
  }

  // In production, send to error reporting service
  if (import.meta.env.MODE === 'production') {
    // Example implementations:
    // Sentry.captureException(error, { extra: errorReport });
    // LogRocket.captureException(error);
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) });
  }
};

export default useErrorHandler;
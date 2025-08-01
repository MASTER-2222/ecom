// Error handling configuration for the application

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to access this resource.',
  [ERROR_CODES.FORBIDDEN]: 'Access forbidden. You don\'t have permission to access this resource.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred.'
} as const;

export const ERROR_ROUTES = {
  NOT_FOUND: '/error/404',
  SERVER_ERROR: '/error/500',
  NETWORK_ERROR: '/error/network',
  UNAUTHORIZED: '/error/unauthorized'
} as const;

// HTTP status code to error type mapping
export const HTTP_STATUS_TO_ERROR_TYPE: Record<number, keyof typeof ERROR_CODES> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  408: 'TIMEOUT_ERROR',
  500: 'SERVER_ERROR',
  502: 'SERVER_ERROR',
  503: 'SERVER_ERROR',
  504: 'SERVER_ERROR'
};

// Configuration for different error handling strategies
export const ERROR_HANDLING_CONFIG = {
  // Should errors automatically redirect to error pages?
  autoRedirect: {
    networkErrors: true,
    serverErrors: true,
    notFound: true,
    unauthorized: true,
    clientErrors: false // 4xx errors except 401, 403, 404
  },
  
  // Should errors be automatically reported?
  autoReport: {
    production: true,
    development: false,
    errorBoundary: true,
    networkErrors: false, // Often too noisy
    serverErrors: true,
    unexpectedErrors: true
  },
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelay: 1000, // ms
    maxDelay: 10000, // ms
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrorCodes: ['NETWORK_ERROR', 'TIMEOUT_ERROR']
  },
  
  // Toast notification configuration
  toast: {
    showOnError: true,
    duration: 5000,
    position: 'top-right' as const,
    hideOnRouteChange: true
  }
};

// Helper functions for error classification
export const isNetworkError = (error: any): boolean => {
  return (
    !navigator.onLine ||
    error.code === 'NETWORK_ERROR' ||
    error.name === 'NetworkError' ||
    error.message?.includes('fetch') ||
    error.message?.includes('network')
  );
};

export const isServerError = (error: any): boolean => {
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

export const isClientError = (error: any): boolean => {
  const status = error.response?.status;
  return status >= 400 && status < 500;
};

export const isRetryableError = (error: any): boolean => {
  const status = error.response?.status;
  
  // Network errors are retryable
  if (isNetworkError(error)) return true;
  
  // Specific HTTP status codes that are retryable
  if (status && ERROR_HANDLING_CONFIG.retry.retryableStatusCodes.includes(status)) {
    return true;
  }
  
  // Timeout errors are retryable
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }
  
  return false;
};

export const shouldAutoRedirect = (error: any): boolean => {
  const config = ERROR_HANDLING_CONFIG.autoRedirect;
  
  if (isNetworkError(error)) return config.networkErrors;
  if (isServerError(error)) return config.serverErrors;
  
  const status = error.response?.status;
  if (status === 404) return config.notFound;
  if (status === 401 || status === 403) return config.unauthorized;
  if (isClientError(error)) return config.clientErrors;
  
  return false;
};

export const getErrorRoute = (error: any): string | null => {
  if (isNetworkError(error)) return ERROR_ROUTES.NETWORK_ERROR;
  if (isServerError(error)) return ERROR_ROUTES.SERVER_ERROR;
  
  const status = error.response?.status;
  if (status === 404) return ERROR_ROUTES.NOT_FOUND;
  if (status === 401 || status === 403) return ERROR_ROUTES.UNAUTHORIZED;
  
  return null;
};

export const getErrorMessage = (error: any): string => {
  // Custom error message from server
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Map HTTP status to error message
  const status = error.response?.status;
  if (status && HTTP_STATUS_TO_ERROR_TYPE[status]) {
    const errorType = HTTP_STATUS_TO_ERROR_TYPE[status];
    return ERROR_MESSAGES[errorType];
  }
  
  // Network errors
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  // Server errors
  if (isServerError(error)) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  // JavaScript error message
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Error reporting configuration
export const ERROR_REPORTING_CONFIG = {
  // Services to report errors to
  services: {
    sentry: {
      enabled: import.meta.env.MODE === 'production',
      dsn: import.meta.env.VITE_SENTRY_DSN
    },
    logRocket: {
      enabled: import.meta.env.MODE === 'production',
      appId: import.meta.env.VITE_LOGROCKET_APP_ID
    },
    custom: {
      enabled: true,
      endpoint: '/api/errors'
    }
  },
  
  // What information to include in error reports
  includeInReport: {
    userAgent: true,
    url: true,
    timestamp: true,
    userId: true,
    sessionId: true,
    buildVersion: true,
    environment: true,
    breadcrumbs: true,
    consoleOutput: import.meta.env.MODE === 'development'
  },
  
  // Sampling configuration
  sampling: {
    errorRate: 1.0, // Report 100% of errors
    sessionReplayRate: 0.1 // Capture 10% of sessions for replay
  }
};

export default {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_ROUTES,
  ERROR_HANDLING_CONFIG,
  ERROR_REPORTING_CONFIG,
  isNetworkError,
  isServerError,
  isClientError,
  isRetryableError,
  shouldAutoRedirect,
  getErrorRoute,
  getErrorMessage
};
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PageLoadMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domContentLoaded: number;
  loadComplete: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isEnabled = import.meta.env.MODE === 'development' || import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';

  constructor() {
    if (!this.isEnabled) return;
    
    this.initializeObservers();
    this.measurePageLoad();
  }

  private initializeObservers(): void {
    // Observe LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          
          this.recordMetric('LCP', lastEntry.startTime, {
            element: lastEntry.element?.tagName,
            url: lastEntry.url,
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observe FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime, {
              eventType: entry.name,
            });
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Observe CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.recordMetric('CLS', clsValue);
            }
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // Observe resource loading
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.recordMetric(`Resource: ${entry.name}`, entry.duration, {
              type: (entry as any).initiatorType,
              size: (entry as any).transferSize,
            });
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private measurePageLoad(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart);
          this.recordMetric('DOM Content Loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
          this.recordMetric('Load Complete', navigation.loadEventEnd - navigation.loadEventStart);
          this.recordMetric('Total Page Load', navigation.loadEventEnd - navigation.navigationStart);
        }

        // Measure FCP (First Contentful Paint)
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          this.recordMetric('FCP', fcpEntry.startTime);
        }
      }, 0);
    });
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Log in development
    if (import.meta.env.MODE === 'development') {
      console.log(`Performance Metric: ${name} = ${value.toFixed(2)}ms`, metadata);
    }

    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  // Measure function execution time
  measureFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    metadata?: Record<string, any>
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const end = performance.now();
          this.recordMetric(name, end - start, metadata);
        });
      } else {
        const end = performance.now();
        this.recordMetric(name, end - start, metadata);
        return result;
      }
    }) as T;
  }

  // Measure async function execution time
  measureAsync<T extends (...args: any[]) => Promise<any>>(
    name: string,
    fn: T,
    metadata?: Record<string, any>
  ): T {
    return (async (...args: Parameters<T>) => {
      const start = performance.now();
      try {
        const result = await fn(...args);
        const end = performance.now();
        this.recordMetric(name, end - start, { ...metadata, status: 'success' });
        return result;
      } catch (error) {
        const end = performance.now();
        this.recordMetric(name, end - start, { ...metadata, status: 'error', error: String(error) });
        throw error;
      }
    }) as T;
  }

  // Get performance summary
  getSummary(): {
    totalMetrics: number;
    averageMetrics: Record<string, number>;
    slowestOperations: PerformanceMetric[];
    recommendations: string[];
  } {
    const averageMetrics: Record<string, number> = {};
    const groupedMetrics: Record<string, number[]> = {};

    this.metrics.forEach(metric => {
      if (!groupedMetrics[metric.name]) {
        groupedMetrics[metric.name] = [];
      }
      groupedMetrics[metric.name].push(metric.value);
    });

    Object.entries(groupedMetrics).forEach(([name, values]) => {
      averageMetrics[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    const slowestOperations = [...this.metrics]
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const recommendations: string[] = [];

    // Generate recommendations based on metrics
    if (averageMetrics['LCP'] > 2500) {
      recommendations.push('Largest Contentful Paint is slow. Consider optimizing images and critical resources.');
    }
    if (averageMetrics['FID'] > 100) {
      recommendations.push('First Input Delay is high. Consider reducing JavaScript execution time.');
    }
    if (averageMetrics['CLS'] > 0.1) {
      recommendations.push('Cumulative Layout Shift is high. Ensure images and ads have fixed dimensions.');
    }
    if (averageMetrics['TTFB'] > 600) {
      recommendations.push('Time to First Byte is slow. Consider optimizing server response time.');
    }

    return {
      totalMetrics: this.metrics.length,
      averageMetrics,
      slowestOperations,
      recommendations,
    };
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Get current page performance
  getCurrentPageMetrics(): PageLoadMetrics | null {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    const lcpMetric = this.metrics.find(m => m.name === 'LCP');
    const fidMetric = this.metrics.find(m => m.name === 'FID');
    const clsMetric = this.metrics.find(m => m.name === 'CLS');

    return {
      fcp: fcpEntry?.startTime || 0,
      lcp: lcpMetric?.value || 0,
      fid: fidMetric?.value || 0,
      cls: clsMetric?.value || 0,
      ttfb: navigation.responseStart - navigation.requestStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    };
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Utility functions for measuring specific operations
export const measureRender = (componentName: string) => {
  if (import.meta.env.MODE !== 'development') return { start: () => {}, end: () => {} };
  
  let startTime: number;
  
  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      const endTime = performance.now();
      performanceMonitor.recordMetric(`Render: ${componentName}`, endTime - startTime);
    },
  };
};

export const measureApiCall = <T extends (...args: any[]) => Promise<any>>(
  apiName: string,
  fn: T
): T => {
  return performanceMonitor.measureAsync(apiName, fn) as T;
};

export const measureComponentLoad = (componentName: string) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    performanceMonitor.recordMetric(`Component Load: ${componentName}`, end - start);
  };
};

// Performance hooks for React components
export const usePerformanceTracker = (componentName: string) => {
  const [renderTime, setRenderTime] = React.useState<number>(0);
  
  React.useEffect(() => {
    const endMeasure = measureComponentLoad(componentName);
    
    return () => {
      endMeasure();
    };
  }, [componentName]);

  const measureRenderTime = React.useCallback(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const time = end - start;
      setRenderTime(time);
      performanceMonitor.recordMetric(`Render Time: ${componentName}`, time);
    };
  }, [componentName]);

  return { renderTime, measureRenderTime };
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const resources = [...scripts, ...styles].map(element => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return fetch(src!, { method: 'HEAD' })
      .then(response => ({
        url: src,
        size: parseInt(response.headers.get('content-length') || '0'),
        type: element.tagName.toLowerCase(),
      }))
      .catch(() => ({ url: src, size: 0, type: element.tagName.toLowerCase() }));
  });
  
  Promise.all(resources).then(results => {
    const totalSize = results.reduce((sum, resource) => sum + resource.size, 0);
    console.log('Bundle Analysis:', {
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      resources: results.sort((a, b) => b.size - a.size),
    });
  });
};

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React import for hooks
import React from 'react';
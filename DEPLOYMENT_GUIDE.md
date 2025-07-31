# 🚀 RitKART Production Deployment & Performance Monitoring Guide

## 📋 Pre-Deployment Checklist

### 1. Code Review & Merge
```bash
# First, merge the pull request
git checkout main
git pull origin main
git branch -d scout/advanced-features-and-performance-optimization
```

### 2. Environment Configuration
Create production environment files:

**Frontend (.env.production)**
```env
VITE_API_BASE_URL=https://api.ritkart.com
VITE_APP_ENV=production
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_GTM_ID=your_google_tag_manager_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

**Backend (application-prod.properties)**
```properties
server.port=8080
spring.profiles.active=prod
spring.data.mongodb.uri=mongodb://your-prod-mongodb-uri
logging.level.root=WARN
logging.level.com.ritkart=INFO
management.endpoints.web.exposure.include=health,metrics,prometheus
```

## 🔧 Production Build Optimization

### 1. Frontend Build Script
```bash
#!/bin/bash
echo "🏗️ Building RitKART Frontend for Production..."

# Install dependencies
npm ci --production=false

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production with analysis
npm run build:prod

# Generate bundle analysis
npm run build:analyze

echo "✅ Frontend build complete!"
```

### 2. Backend Build Script
```bash
#!/bin/bash
echo "🏗️ Building RitKART Backend for Production..."

# Clean and build
mvn clean package -Pprod -DskipTests=false

# Run tests
mvn test

# Build Docker image
docker build -t ritkart-backend:latest .

echo "✅ Backend build complete!"
```

## 🐳 Docker Configuration

### Frontend Dockerfile
```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false

COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Add performance monitoring script
COPY performance-monitoring.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app

# Add monitoring agent
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar

COPY target/ritkart-backend-*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-javaagent:/app/opentelemetry-javaagent.jar", "-jar", "/app/app.jar"]
```

## 📊 Performance Monitoring Setup

### 1. Real User Monitoring (RUM)
Create `src/utils/productionMonitoring.ts`:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface PerformanceData {
  metric: string;
  value: number;
  delta: number;
  id: string;
  url: string;
  timestamp: number;
}

class ProductionMonitoring {
  private endpoint: string;
  
  constructor() {
    this.endpoint = '/api/analytics/performance';
    this.initWebVitals();
  }

  private initWebVitals() {
    // Track Core Web Vitals
    getCLS(this.sendMetric.bind(this));
    getFID(this.sendMetric.bind(this));
    getFCP(this.sendMetric.bind(this));
    getLCP(this.sendMetric.bind(this));
    getTTFB(this.sendMetric.bind(this));
  }

  private sendMetric(metric: any) {
    const data: PerformanceData = {
      metric: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      url: window.location.href,
      timestamp: Date.now()
    };

    // Send to analytics endpoint
    navigator.sendBeacon(this.endpoint, JSON.stringify(data));
  }

  // Track custom business metrics
  trackPageLoad(pageName: string, loadTime: number) {
    this.sendCustomMetric('page_load', loadTime, { page: pageName });
  }

  trackAPICall(endpoint: string, duration: number, status: number) {
    this.sendCustomMetric('api_call', duration, { endpoint, status });
  }

  trackUserAction(action: string, value?: number) {
    this.sendCustomMetric('user_action', value || 1, { action });
  }

  private sendCustomMetric(name: string, value: number, labels: Record<string, any>) {
    const data = {
      metric: name,
      value,
      labels,
      timestamp: Date.now(),
      url: window.location.href
    };

    fetch('/api/analytics/custom-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  }
}

export const productionMonitoring = new ProductionMonitoring();
```

### 2. Error Tracking Setup
Create `src/utils/errorTracking.ts`:
```typescript
interface ErrorData {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

class ErrorTracking {
  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    });
  }

  trackError(errorData: ErrorData) {
    fetch('/api/analytics/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(console.error);
  }

  trackCustomError(message: string, context?: Record<string, any>) {
    this.trackError({
      message,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ...context
    });
  }
}

export const errorTracking = new ErrorTracking();
```

## 🔍 Monitoring Dashboard Setup

### 1. Grafana Dashboard Configuration
```json
{
  "dashboard": {
    "title": "RitKART Performance Dashboard",
    "panels": [
      {
        "title": "Core Web Vitals",
        "type": "stat",
        "targets": [
          {
            "expr": "avg(web_vitals_lcp)",
            "legendFormat": "LCP"
          },
          {
            "expr": "avg(web_vitals_fid)",
            "legendFormat": "FID"
          },
          {
            "expr": "avg(web_vitals_cls)",
            "legendFormat": "CLS"
          }
        ]
      },
      {
        "title": "Page Load Times",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, page_load_duration_seconds_bucket)",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, page_load_duration_seconds_bucket)",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "API Response Times",
        "type": "graph",
        "targets": [
          {
            "expr": "avg(api_request_duration_seconds) by (endpoint)",
            "legendFormat": "{{endpoint}}"
          }
        ]
      },
      {
        "title": "Error Rates",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(error_total[5m])",
            "legendFormat": "Error Rate"
          }
        ]
      }
    ]
  }
}
```

### 2. Health Check Endpoints
Create backend health check controller:
```java
@RestController
@RequestMapping("/actuator")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now());
        health.put("version", getClass().getPackage().getImplementationVersion());
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> metrics() {
        Map<String, Object> metrics = new HashMap<>();
        // Add custom metrics
        metrics.put("active_users", getActiveUsers());
        metrics.put("memory_usage", getMemoryUsage());
        metrics.put("database_connections", getDatabaseConnections());
        return ResponseEntity.ok(metrics);
    }
}
```

## 🚀 Deployment Scripts

### 1. Zero-Downtime Deployment Script
```bash
#!/bin/bash
set -e

echo "🚀 Starting RitKART Production Deployment..."

# Configuration
APP_NAME="ritkart"
NEW_VERSION=$(git rev-parse --short HEAD)
HEALTH_CHECK_URL="https://api.ritkart.com/actuator/health"

# Build and tag new images
echo "📦 Building new images..."
docker build -t $APP_NAME-frontend:$NEW_VERSION ./frontend
docker build -t $APP_NAME-backend:$NEW_VERSION ./backend

# Deploy with health checks
echo "🔄 Deploying backend..."
docker service update \
  --image $APP_NAME-backend:$NEW_VERSION \
  --update-parallelism 1 \
  --update-delay 30s \
  --health-cmd "curl -f $HEALTH_CHECK_URL || exit 1" \
  ritkart-backend

# Wait for backend health check
echo "⏳ Waiting for backend health check..."
for i in {1..30}; do
  if curl -f $HEALTH_CHECK_URL; then
    echo "✅ Backend is healthy"
    break
  fi
  sleep 10
done

echo "🔄 Deploying frontend..."
docker service update \
  --image $APP_NAME-frontend:$NEW_VERSION \
  --update-parallelism 2 \
  --update-delay 10s \
  ritkart-frontend

echo "🎉 Deployment complete!"

# Run smoke tests
echo "🧪 Running smoke tests..."
./scripts/smoke-tests.sh

echo "📊 Deployment metrics:"
echo "Version: $NEW_VERSION"
echo "Deployed at: $(date)"
```

### 2. Performance Monitoring Integration
Update `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { productionMonitoring } from './utils/productionMonitoring';
import { errorTracking } from './utils/errorTracking';

// Initialize monitoring in production
if (import.meta.env.PROD) {
  // Track initial page load
  const startTime = performance.now();
  
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    productionMonitoring.trackPageLoad('initial', loadTime);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 📈 Monitoring Alerts

### 1. Performance Alerts Configuration
```yaml
# alerts.yml
groups:
  - name: ritkart_performance
    rules:
      - alert: HighPageLoadTime
        expr: histogram_quantile(0.95, page_load_duration_seconds_bucket) > 3
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High page load time detected"
          description: "95th percentile page load time is {{ $value }}s"

      - alert: HighErrorRate
        expr: rate(error_total[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/second"

      - alert: HighAPILatency
        expr: histogram_quantile(0.95, api_request_duration_seconds_bucket) > 2
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "High API latency detected"
          description: "95th percentile API latency is {{ $value }}s"
```

## 🔧 Post-Deployment Optimization

### 1. CDN Configuration
```javascript
// Cloudflare Workers or similar CDN configuration
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  
  // Check cache first
  let response = await cache.match(cacheKey);
  
  if (!response) {
    response = await fetch(request);
    
    // Cache static assets for 1 year
    if (request.url.includes('/assets/')) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000');
      event.waitUntil(cache.put(cacheKey, newResponse.clone()));
      return newResponse;
    }
  }
  
  return response;
}
```

### 2. Database Optimization Queries
```sql
-- MongoDB Indexes for Performance
db.products.createIndex({ "title": "text", "description": "text" });
db.products.createIndex({ "category.id": 1, "isActive": 1 });
db.products.createIndex({ "isFeatured": 1, "isActive": 1 });
db.orders.createIndex({ "userId": 1, "createdAt": -1 });
db.wishlist.createIndex({ "userId": 1 });
```

This comprehensive deployment and monitoring setup will ensure your RitKART application runs optimally in production with full visibility into performance metrics and user experience!
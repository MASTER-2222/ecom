# RitKART Deployment Guide - Complete Solutions

This guide provides complete deployment solutions for the RitKART full-stack e-commerce application across multiple platforms.

## 🔧 Recent Fixes Applied

### Frontend Build Issues Fixed:
1. **React 19 + Recharts Compatibility**: Upgraded to recharts v3.1.0 with overrides
2. **Rollup Dependencies**: Added .npmrc with legacy-peer-deps configuration  
3. **Vite Asset Processing**: Simplified configuration to prevent build-html errors
4. **Platform-specific Configurations**: Added deployment configs for all major platforms

### Files Modified:
- `frontend/.npmrc` - NPM configuration for dependency resolution
- `frontend/vite.config.ts` - Optimized build configuration
- `frontend/package.json` - Updated dependencies and build scripts
- `vercel.json` - Vercel deployment configuration
- `netlify.toml` - Netlify deployment configuration  
- `render.yaml` - Render deployment configuration
- `frontend/.env.production` - Production environment variables

## 🚀 Deployment Instructions

### 1. Vercel Deployment

#### Frontend:
```bash
# Repository root contains vercel.json
# Deploy frontend from repository root
vercel --prod
```

**Vercel Configuration:**
- Build Command: `cd frontend && npm install --legacy-peer-deps && npm run build`
- Output Directory: `frontend/dist`
- Root Directory: `frontend`
- Environment Variables:
  - `VITE_API_BASE_URL`: Your backend URL
  - `VITE_API_TIMEOUT`: 10000

#### Backend:
- Use Vercel's serverless functions or deploy separately on Railway/Render

### 2. Netlify Deployment

#### Frontend:
```bash
# Repository contains netlify.toml
# Connect GitHub repository to Netlify
# Auto-deploys with configuration from netlify.toml
```

**Netlify Settings:**
- Base Directory: `frontend`
- Build Command: `npm install --legacy-peer-deps && npm run build`
- Publish Directory: `frontend/dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: Your backend URL
  - `VITE_API_TIMEOUT`: 10000

### 3. Render Deployment

#### Frontend + Backend (using render.yaml):
```bash
# Repository contains render.yaml for full-stack deployment
# Connect GitHub repository to Render
# Both services deploy automatically
```

#### Manual Frontend Deployment:
```bash
# Create new Static Site on Render
# Build Command: cd frontend && npm install --legacy-peer-deps && npm run build
# Publish Directory: frontend/dist
```

#### Manual Backend Deployment:
```bash
# Create new Web Service on Render
# Build Command: cd backend && mvn clean package -DskipTests
# Start Command: cd backend && java -jar target/ritkart-backend-1.0.0.jar
```

### 4. Railway Deployment

#### Backend:
```bash
# Repository contains nixpacks.toml for backend
railway login
railway link
railway up
```

#### Frontend:
```bash
# Deploy frontend to Vercel/Netlify and connect to Railway backend
```

## 🔧 Environment Variables Setup

### Frontend (.env.production):
```bash
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_API_TIMEOUT=10000
VITE_APP_NAME=RitKART
VITE_ENVIRONMENT=production
```

### Backend (application-prod.properties):
```bash
# MongoDB
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/ritkart

# Server
server.port=8080

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=https://your-frontend-url.com
```

## 🛢️ MongoDB Atlas Setup

1. **Create Cluster:**
   ```bash
   # Sign up at https://mongodb.com/atlas
   # Create new cluster (free tier available)
   # Get connection string
   ```

2. **Configure Database:**
   ```bash
   # Database Name: ritkart
   # Collections: users, products, orders, carts, categories
   # Create database user with read/write permissions
   ```

3. **Network Access:**
   ```bash
   # Add IP addresses: 0.0.0.0/0 (allow from anywhere for cloud deployment)
   # Or specific deployment platform IPs
   ```

## 📝 Deployment Scripts

### Quick Deploy Frontend:
```bash
# Netlify
npm run build:prod
ntl deploy --prod --dir=frontend/dist

# Vercel  
vercel --prod

# Render
# Push to GitHub - auto-deploys with render.yaml
```

### Quick Deploy Backend:
```bash
# Railway
railway up

# Render
# Push to GitHub - auto-deploys with render.yaml

# Manual JAR deployment
cd backend
mvn clean package -DskipTests
java -jar target/ritkart-backend-1.0.0.jar
```

## 🔍 Troubleshooting

### Common Issues & Solutions:

1. **Build Fails with React 19 Error:**
   ```bash
   # Solution: Use legacy peer deps
   npm install --legacy-peer-deps
   ```

2. **Rollup Module Not Found:**
   ```bash
   # Solution: Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **Vite Asset Processing Error:**
   ```bash
   # Solution: Use simplified vite.config.ts (already applied)
   # Avoid complex renderBuiltUrl configurations
   ```

4. **CORS Errors:**
   ```bash
   # Solution: Update backend CORS configuration
   # Set proper frontend URL in application-prod.properties
   ```

5. **MongoDB Connection Issues:**
   ```bash
   # Solution: Check connection string and network access
   # Ensure IP whitelist includes 0.0.0.0/0 for cloud deployment
   ```

## 🎯 Platform-Specific Tips

### Vercel:
- Best for frontend hosting
- Automatic deployments from GitHub
- Excellent performance and CDN
- Free tier available

### Netlify:
- Great for static sites
- Built-in form handling
- Branch deployments
- Free tier with good limits

### Render:
- Full-stack deployment support
- Docker support
- Database hosting available
- Free tier with limitations

### Railway:
- Excellent for backend services
- Simple deployment process
- Built-in database options
- Usage-based pricing

## 🚀 Next Steps

1. **Choose Platform:** Select based on your needs and budget
2. **Set Environment Variables:** Configure all required variables
3. **Deploy:** Follow platform-specific instructions above
4. **Test:** Verify frontend-backend communication
5. **Monitor:** Set up logging and monitoring
6. **Scale:** Upgrade plans as needed

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check deployment logs for specific error messages
4. Ensure MongoDB Atlas is properly configured

---

**Note:** All deployment configurations have been tested and optimized for production use. The .npmrc and vite.config.ts fixes resolve the common build issues encountered during deployment.
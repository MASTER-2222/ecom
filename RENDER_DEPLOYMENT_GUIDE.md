# RitKART Deployment Guide for Render.com

## 📋 Overview
This guide will help you deploy your RitKART e-commerce application to Render.com using Docker containers for the backend and static site hosting for the frontend.

## 🏗️ Architecture
- **Backend**: Java Spring Boot 3.2.1 with MongoDB (Docker Container)
- **Frontend**: Next.js 15 with React 19 (Static Site)
- **Database**: MongoDB Atlas (External)
- **File Storage**: Cloudinary

---

## 🚀 Step 1: Prepare Your Repository

### 1.1 Ensure Required Files Exist
Make sure your repository has these files:
- ✅ `/backend/Dockerfile` (Created)
- ✅ `/backend/.env.example` (Created)  
- ✅ `/frontend2/.env.example` (Created)
- ✅ `/backend/pom.xml` (Exists)
- ✅ `/frontend2/package.json` (Exists)

### 1.2 Push Changes to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

---

## 🔧 Step 2: Deploy Backend (Java Spring Boot)

### 2.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/MASTER-2222/ecom`

### 2.2 Configure Backend Service
**Basic Settings:**
- **Name**: `ritkart-backend`
- **Environment**: `Docker`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`

**Build & Deploy Settings:**
- **Dockerfile Path**: `Dockerfile` (it will auto-detect)
- **Build Command**: Leave empty (Docker handles this)
- **Start Command**: Leave empty (Docker handles this)

### 2.3 Configure Environment Variables
Click **"Environment"** tab and add these variables:

```env
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
MONGODB_URI=mongodb+srv://ritkart-admin:RakAJVBURLCJ0uHy@ritkart-cluster.yopyqig.mongodb.net/ritkart?retryWrites=true&w=majority&appName=ritkart-cluster
MONGODB_DATABASE=ritkart
JWT_SECRET=RitKART_2024_9kL8mN2pQ7rS3tV6wX9zA1bC4dE7fH0jK3mP5qR8sU1vY4zB6cF9gJ2lN5oQ7rT0wX3zA6bE9hK2mP5sV8yB1dG4jL7oR0tU3xA6cF9iM2pS5vY8bE1gK4nQ7tW0zA3fI6lO9rU2xB5eH8kN1qT4wA7dG0jM3pS6vY9cF2iL5oR8uX1bE4hK7nQ0tW3zA6gJ9mP2sV5yC8fI1lO4rU7xB0eH3kN6qT9wA2dG5jM8pS1vY4cF7iL0oR3uX6bE9hK2nQ5tW8zA1gJ4mP7sV0yC3fI6lO9rU2xB5eH8kN1qT4wA7dG0jM3pS6vY9cF2iL5oR8uX1bE4hK7nQ0tW3zA6gJ9mP2sV5yC8fI1lO4rU7xB0e
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=https://ritkart-frontend.onrender.com
CLOUDINARY_CLOUD_NAME=dv0lg87ib
CLOUDINARY_API_KEY=195345735854272
CLOUDINARY_API_SECRET=jigNQt700eFYsi7TSNB9ZJQJfGI
CLOUDINARY_URL=cloudinary://195345735854272:jigNQt700eFYsi7TSNB9ZJQJfGI@dv0lg87ib
DEFAULT_ADMIN_EMAIL=admin@ritkart.com
DEFAULT_ADMIN_PASSWORD=admin123
MAX_FILE_SIZE=10MB
LOG_LEVEL=INFO
```

### 2.4 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://ritkart-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend (Next.js)

### 3.1 Create Static Site
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect the same GitHub repository

### 3.2 Configure Frontend Service
**Basic Settings:**
- **Name**: `ritkart-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend2`

**Build & Deploy Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `out` (or `dist` based on your Next.js config)

### 3.3 Configure Environment Variables
Add these environment variables:

```env
NEXT_PUBLIC_API_URL=https://ritkart-backend.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://ritkart-backend.onrender.com
NEXT_PUBLIC_APP_NAME=RitKART
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dv0lg87ib
NEXT_PUBLIC_CLOUDINARY_API_KEY=195345735854272
```

### 3.4 Update Next.js Configuration
Make sure your `frontend2/next.config.ts` is configured for static export:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 3.5 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment (3-5 minutes)
3. Note your frontend URL: `https://ritkart-frontend.onrender.com`

---

## 🔄 Step 4: Update CORS Configuration

### 4.1 Update Backend CORS
1. Go to your backend service on Render
2. Go to **Environment** tab
3. Update `CORS_ALLOWED_ORIGINS` to your frontend URL:
   ```
   CORS_ALLOWED_ORIGINS=https://ritkart-frontend.onrender.com
   ```
4. Click **"Save Changes"** (this will trigger a redeploy)

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend API
Visit these URLs to test your backend:
- Health Check: `https://ritkart-backend.onrender.com/api/health`
- API Docs: `https://ritkart-backend.onrender.com/api/swagger-ui.html`
- Test Endpoint: `https://ritkart-backend.onrender.com/api/test`

### 5.2 Test Frontend
1. Visit: `https://ritkart-frontend.onrender.com`
2. Check if pages load correctly
3. Test API calls from frontend to backend
4. Verify image uploads to Cloudinary

### 5.3 Test Complete Flow
1. **Registration**: Create a new user account
2. **Login**: Test authentication
3. **Products**: Browse products, search, filter
4. **Cart**: Add/remove items from cart
5. **Orders**: Place a test order
6. **Admin**: Login as admin and test admin features

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Backend Issues
**Issue**: Service won't start
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string

**Issue**: CORS errors
- Ensure `CORS_ALLOWED_ORIGINS` matches your frontend URL exactly
- Include protocol (https://) in the URL

#### Frontend Issues
**Issue**: API calls failing
- Verify `NEXT_PUBLIC_API_URL` points to correct backend URL
- Check if backend is running and accessible

**Issue**: Build failing
- Check build logs for missing dependencies
- Verify `package.json` has all required packages

#### Database Issues
**Issue**: MongoDB connection errors
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes 0.0.0.0/0 for Render

---

## 📊 Step 6: Post-Deployment Setup

### 6.1 Custom Domains (Optional)
1. Go to your service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `api.ritkart.com` for backend)
3. Update DNS records as instructed
4. Update environment variables with new domains

### 6.2 SSL Certificates
- Render automatically provides SSL certificates
- Your sites will be available over HTTPS

### 6.3 Monitoring
- Set up uptime monitoring in Render dashboard
- Configure email alerts for service failures

---

## 🔧 Environment Variables Quick Reference

### Backend Environment Variables
```env
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
MONGODB_URI=<your-mongodb-connection-string>
MONGODB_DATABASE=ritkart
JWT_SECRET=<your-jwt-secret>
CORS_ALLOWED_ORIGINS=<your-frontend-url>
CLOUDINARY_CLOUD_NAME=dv0lg87ib
CLOUDINARY_API_KEY=195345735854272
CLOUDINARY_API_SECRET=jigNQt700eFYsi7TSNB9ZJQJfGI
DEFAULT_ADMIN_EMAIL=admin@ritkart.com
DEFAULT_ADMIN_PASSWORD=admin123
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=<your-backend-url>/api
NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dv0lg87ib
```

---

## 🎉 Conclusion

Your RitKART application should now be successfully deployed on Render.com! 

**Your Live URLs:**
- 🖥️ Frontend: `https://ritkart-frontend.onrender.com`
- 🔧 Backend API: `https://ritkart-backend.onrender.com/api`
- 📚 API Docs: `https://ritkart-backend.onrender.com/api/swagger-ui.html`

**Next Steps:**
1. Test all functionality thoroughly
2. Set up monitoring and alerts
3. Configure custom domains if needed
4. Set up CI/CD for automatic deployments
5. Optimize performance and add caching

**Support:**
- Check Render documentation for advanced configurations
- Monitor service logs for any issues
- Set up automated backups for your database

---

## 📝 Notes
- Free tier on Render may have some limitations (spins down after inactivity)
- Consider upgrading to paid plans for production use
- Keep your environment variables secure and never commit them to your repository
- Regularly update your dependencies for security patches

Happy Deploying! 🚀
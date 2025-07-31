# 🚀 RitKART Complete Deployment Guide

## 📋 Table of Contents
1. [MongoDB Atlas Setup (Required for All Scenarios)](#mongodb-atlas-setup)
2. [Scenario A: Backend + Frontend on Render](#scenario-a-render-render)
3. [Scenario B: Backend + Frontend on Railway](#scenario-b-railway-railway)
4. [Scenario C: Backend on Render + Frontend on Railway](#scenario-c-render-railway)
5. [Environment Variables Configuration](#environment-variables)
6. [Testing Your Deployment](#testing-deployment)
7. [Troubleshooting Guide](#troubleshooting)

---

## 🗄️ MongoDB Atlas Setup (Required for All Scenarios)

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Sign up with your email or Google account
4. Verify your email address

### Step 2: Create a New Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 Sandbox"** (FREE tier)
3. Select **Cloud Provider**: AWS
4. Select **Region**: Choose closest to your location
5. **Cluster Name**: `ritkart-cluster`
6. Click **"Create Deployment"**

### Step 3: Create Database User
1. In the **"Security Quickstart"**:
   - **Username**: `ritkart-admin`
   - **Password**: Click **"Autogenerate Secure Password"** and **SAVE THIS PASSWORD**
   - Click **"Create User"**

### Step 4: Configure Network Access
1. In **"Where would you like to connect from?"**:
   - Choose **"My Local Environment"**
   - Click **"Add My Current IP Address"**
   - **IMPORTANT**: Also add **"0.0.0.0/0"** to allow connections from anywhere
   - Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Select **"Java"** and version **"4.3 or later"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://ritkart-admin:<password>@ritkart-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you saved earlier
6. **SAVE THIS CONNECTION STRING** - you'll need it for deployment

---

## 🎯 Scenario A: Backend + Frontend on Render

### Backend Deployment on Render

#### Step 1: Prepare Backend for Render
1. Go to your GitHub repository: `https://github.com/MASTER-2222/ecom`
2. Make sure your `backend` folder contains all necessary files

#### Step 2: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

#### Step 3: Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `MASTER-2222/ecom`
3. Configure the service:
   - **Name**: `ritkart-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` or `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/ritkart-backend-1.0.0.jar`
   - **Instance Type**: `Free`

#### Step 4: Configure Backend Environment Variables
In the **Environment Variables** section, add:

```env
MONGODB_URI=mongodb+srv://ritkart-admin:YOUR_PASSWORD@ritkart-cluster.xxxxx.mongodb.net/ritkart?retryWrites=true&w=majority
MONGODB_DATABASE=ritkart
JWT_SECRET=RitKART-Production-Secret-Key-2024-Ultra-Secure-256-Bit-HMAC-SHA
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=https://ritkart-frontend.onrender.com
SPRING_PROFILES_ACTIVE=prod
DEFAULT_ADMIN_EMAIL=admin@ritkart.com
DEFAULT_ADMIN_PASSWORD=admin123
```

5. Click **"Create Web Service"**
6. Wait for deployment (10-15 minutes)
7. **SAVE YOUR BACKEND URL**: `https://ritkart-backend.onrender.com`

### Frontend Deployment on Render

#### Step 1: Deploy Frontend Service
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `MASTER-2222/ecom`
3. Configure the site:
   - **Name**: `ritkart-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

#### Step 2: Configure Frontend Environment Variables
Add these environment variables:

```env
VITE_API_BASE_URL=https://ritkart-backend.onrender.com/api
VITE_API_TIMEOUT=10000
```

#### Step 3: Complete Deployment
1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. **YOUR FRONTEND URL**: `https://ritkart-frontend.onrender.com`

### Step 4: Update Backend CORS Settings
1. Go back to your backend service on Render
2. Update the environment variable:
   ```env
   CORS_ALLOWED_ORIGINS=https://ritkart-frontend.onrender.com
   ```
3. Click **"Save Changes"** and wait for redeployment

---

## 🚂 Scenario B: Backend + Frontend on Railway

### Backend Deployment on Railway

#### Step 1: Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub account
3. Authorize Railway to access your repositories

#### Step 2: Deploy Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `MASTER-2222/ecom`
4. Railway will auto-detect it's a monorepo

#### Step 3: Configure Backend Service
1. Select the **backend** folder
2. Railway should auto-detect it's a Java Spring Boot app
3. Configure the service:
   - **Name**: `ritkart-backend`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/ritkart-backend-1.0.0.jar`

#### Step 4: Configure Backend Environment Variables
In **Variables** tab, add:

```env
MONGODB_URI=mongodb+srv://ritkart-admin:YOUR_PASSWORD@ritkart-cluster.xxxxx.mongodb.net/ritkart?retryWrites=true&w=majority
MONGODB_DATABASE=ritkart
JWT_SECRET=RitKART-Production-Secret-Key-2024-Ultra-Secure-256-Bit-HMAC-SHA
PORT=8080
CORS_ALLOWED_ORIGINS=https://ritkart-frontend.railway.app
SPRING_PROFILES_ACTIVE=prod
DEFAULT_ADMIN_EMAIL=admin@ritkart.com
DEFAULT_ADMIN_PASSWORD=admin123
```

5. Click **"Deploy"**
6. **SAVE YOUR BACKEND URL**: `https://ritkart-backend.railway.app`

### Frontend Deployment on Railway

#### Step 1: Create New Service for Frontend
1. In the same project, click **"+ New"**
2. Select **"GitHub Repo"** → Choose your repo again
3. Select the **frontend** folder

#### Step 2: Configure Frontend Service
1. **Name**: `ritkart-frontend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm run preview`

#### Step 3: Configure Frontend Environment Variables
Add these variables:

```env
VITE_API_BASE_URL=https://ritkart-backend.railway.app/api
VITE_API_TIMEOUT=10000
```

#### Step 4: Complete Deployment
1. Click **"Deploy"**
2. **YOUR FRONTEND URL**: `https://ritkart-frontend.railway.app`

### Step 5: Update Backend CORS
Update backend environment variable:
```env
CORS_ALLOWED_ORIGINS=https://ritkart-frontend.railway.app
```

---

## 🔀 Scenario C: Backend on Render + Frontend on Railway

### Backend on Render (Follow Scenario A Backend Steps)
1. Deploy backend on Render following steps from Scenario A
2. **Backend URL**: `https://ritkart-backend.onrender.com`
3. Set CORS to allow Railway frontend:
   ```env
   CORS_ALLOWED_ORIGINS=https://ritkart-frontend.railway.app
   ```

### Frontend on Railway (Follow Scenario B Frontend Steps)
1. Deploy frontend on Railway following frontend steps from Scenario B
2. **Frontend URL**: `https://ritkart-frontend.railway.app`
3. Set API URL to point to Render backend:
   ```env
   VITE_API_BASE_URL=https://ritkart-backend.onrender.com/api
   ```

---

## 🔧 Environment Variables Configuration

### Default Environment Variables (Since you don't have API keys)

#### Backend Environment Variables:
```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DATABASE=ritkart

# Security
JWT_SECRET=RitKART-Production-Secret-Key-2024-Ultra-Secure-256-Bit-HMAC-SHA

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# CORS (Update based on your frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend-url

# Admin Account
DEFAULT_ADMIN_EMAIL=admin@ritkart.com
DEFAULT_ADMIN_PASSWORD=admin123

# Optional (can be left empty for now)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend Environment Variables:
```env
VITE_API_BASE_URL=https://your-backend-url/api
VITE_API_TIMEOUT=10000
```

---

## 🧪 Testing Your Deployment

### Step 1: Test Backend API
1. Open your backend URL: `https://your-backend-url`
2. Go to: `https://your-backend-url/api/swagger-ui.html`
3. You should see the Swagger API documentation

### Step 2: Test Frontend
1. Open your frontend URL: `https://your-frontend-url`
2. You should see the RitKART homepage
3. Try creating an account
4. Try logging in with admin credentials:
   - Email: `admin@ritkart.com`
   - Password: `admin123`

### Step 3: Test Database Connection
1. Create a user account on your frontend
2. Check MongoDB Atlas dashboard to see if user was created
3. Go to **"Collections"** → **"ritkart"** database

---

## 🔧 Troubleshooting Guide

### Common Issues:

#### 1. Backend Won't Start
- **Check**: MongoDB connection string is correct
- **Check**: All required environment variables are set
- **Check**: Build logs for any missing dependencies

#### 2. Frontend Can't Connect to Backend
- **Check**: VITE_API_BASE_URL is correctly set
- **Check**: Backend CORS settings include frontend URL
- **Check**: Backend is running and accessible

#### 3. Database Connection Failed
- **Check**: MongoDB Atlas IP whitelist includes 0.0.0.0/0
- **Check**: Database user credentials are correct
- **Check**: Connection string format is correct

#### 4. CORS Errors
- **Solution**: Update backend CORS_ALLOWED_ORIGINS to include your frontend URL
- **Example**: `CORS_ALLOWED_ORIGINS=https://your-frontend-url.com`

#### 5. 404 Errors on Frontend Routes
- **Solution**: Add redirects configuration
- **For Render**: Create `_redirects` file in frontend/public:
  ```
  /*    /index.html   200
  ```
- **For Railway**: This should be handled automatically

---

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render: Services sleep after 15 minutes of inactivity
   - Railway: 500 hours/month, then $5/month
   - MongoDB Atlas: 512MB storage limit

2. **Cold Start**: First request after inactivity may take 30-60 seconds

3. **Logs**: Check deployment logs on both platforms for debugging

4. **Updates**: Any changes to your GitHub repo will trigger auto-deployments

5. **Custom Domain**: Can be added later in platform settings (may require paid plan)

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible  
- [ ] Database connection working
- [ ] Admin login working
- [ ] User registration working
- [ ] Product listing showing
- [ ] Cart functionality working

Your RitKART application should now be fully deployed and accessible worldwide! 🌍

---

**Need Help?** 
- Check platform-specific documentation
- Review deployment logs
- Test each component individually
- Ensure all environment variables are correctly set
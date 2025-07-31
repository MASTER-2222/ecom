# 🚀 Quick Deployment Commands & URLs

## MongoDB Atlas Setup
1. URL: https://www.mongodb.com/cloud/atlas
2. Create M0 (Free) cluster named: ritkart-cluster
3. Create user: ritkart-admin
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string: mongodb+srv://ritkart-admin:PASSWORD@ritkart-cluster.xxxxx.mongodb.net/ritkart

## Scenario A: Render + Render

### Backend on Render:
1. URL: https://render.com
2. New Web Service
3. Connect GitHub repo: MASTER-2222/ecom
4. Root Directory: backend
5. Build: `./mvnw clean package -DskipTests`
6. Start: `java -jar target/ritkart-backend-1.0.0.jar`
7. Environment Variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=RitKART-Production-Secret-Key-2024-Ultra-Secure-256-Bit-HMAC-SHA
   SERVER_PORT=8080
   CORS_ALLOWED_ORIGINS=https://ritkart-frontend.onrender.com
   SPRING_PROFILES_ACTIVE=prod
   ```

### Frontend on Render:
1. New Static Site
2. Connect same GitHub repo
3. Root Directory: frontend
4. Build: `npm install && npm run build`
5. Publish: dist
6. Environment Variables:
   ```
   VITE_API_BASE_URL=https://ritkart-backend.onrender.com/api
   ```

## Scenario B: Railway + Railway

### Backend on Railway:
1. URL: https://railway.app
2. New Project → Deploy from GitHub
3. Select backend folder
4. Environment Variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=RitKART-Production-Secret-Key-2024-Ultra-Secure-256-Bit-HMAC-SHA
   PORT=8080
   CORS_ALLOWED_ORIGINS=https://ritkart-frontend.railway.app
   ```

### Frontend on Railway:
1. Same project → + New → GitHub Repo
2. Select frontend folder
3. Environment Variables:
   ```
   VITE_API_BASE_URL=https://ritkart-backend.railway.app/api
   ```

## Scenario C: Render Backend + Railway Frontend

### Backend: Follow Scenario A Backend
### Frontend: Follow Scenario B Frontend

Cross-platform environment variables:
- Backend CORS: https://ritkart-frontend.railway.app
- Frontend API URL: https://ritkart-backend.onrender.com/api

## Default Admin Access
- URL: /admin
- Email: admin@ritkart.com
- Password: admin123

## Testing URLs
- Backend Health: https://your-backend-url/api/actuator/health
- Backend API Docs: https://your-backend-url/api/swagger-ui.html
- Frontend: https://your-frontend-url

## Important Files to Add
1. Create `frontend/public/_redirects` with content: `/*    /index.html   200`
2. Ensure CORS settings match your frontend URL
3. MongoDB Atlas IP whitelist includes 0.0.0.0/0

## Free Tier Limits
- Render: Services sleep after 15 min inactivity
- Railway: 500 hours/month
- MongoDB Atlas: 512MB storage

## Cold Start
First request after sleep: 30-60 seconds response time
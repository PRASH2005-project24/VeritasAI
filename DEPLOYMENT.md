# 🚀 VeritasAI Deployment Guide

This guide explains how to deploy VeritasAI to production for public access.

## 🌐 Live Deployment

- **Frontend**: [https://prash2005-project24.github.io/VeritasAI/](https://prash2005-project24.github.io/VeritasAI/)
- **Backend**: [https://project-u5k3s-p9zaoezd3-binarybits-projects.vercel.app](https://project-u5k3s-p9zaoezd3-binarybits-projects.vercel.app)

## 📋 Deployment Architecture

```
Frontend (GitHub Pages) → Backend (Render.com) → Mock Database
        ↓                      ↓
    Static Site             REST API Server
  (React + Vite)           (Express + Node.js)
```

## 🔧 Frontend Deployment (GitHub Pages)

### Automatic Deployment
The frontend is automatically deployed via GitHub Actions when you push to the `main` branch.

### Manual Deployment Steps
1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **Configure Build**:
   - The `.github/workflows/deploy.yml` handles automatic deployment
   - Builds are triggered on every push to `main`

3. **View Deployment**:
   - Visit: https://prash2005-project24.github.io/VeritasAI/
   - Check deployment status in "Actions" tab

## 🔧 Backend Deployment (Render.com)

### Deploy to Render
1. **Create Render Account**: Visit [render.com](https://render.com) and sign up

2. **Connect Repository**: 
   - Click "New Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

3. **Configure Service**:
   ```
   Name: veritasai-backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**:
   ```
   PORT=10000
   NODE_ENV=production
   CORS_ORIGIN=https://prash2005-project24.github.io
   ```

5. **Deploy**: Click "Create Web Service"

### Alternative: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod
```

## 🌍 Environment Configuration

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Production
- Frontend: `https://prash2005-project24.github.io/VeritasAI/`
- Backend: `https://veritasai-backend.onrender.com`

## 🔒 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (development)
- `https://prash2005-project24.github.io` (production)
- Custom domains via `CORS_ORIGIN` environment variable

## 📝 Build Configuration

### Frontend Build (Vite)
```javascript
// vite.config.js
export default defineConfig({
  base: '/VeritasAI/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
```

### API Configuration
```javascript
// frontend/src/config/api.js
const API_BASE_URLS = {
  development: 'http://localhost:3001',
  production: 'https://veritasai-backend.onrender.com'
}
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check backend CORS configuration
   - Verify frontend domain is whitelisted

2. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **API Connection Issues**:
   - Confirm backend is deployed and running
   - Check API URLs in frontend configuration

4. **GitHub Pages 404**:
   - Ensure `base: '/VeritasAI/'` in Vite config
   - Check repository name matches base path

### Health Checks

- **Backend Health**: `https://veritasai-backend.onrender.com/health`
- **Frontend Build**: Check GitHub Actions status
- **CORS Test**: Open browser dev tools on frontend

## 🔄 Continuous Deployment

### GitHub Actions Workflow
- **Trigger**: Push to `main` branch
- **Build**: Install dependencies, build frontend
- **Deploy**: Upload to GitHub Pages
- **Status**: Check "Actions" tab for deployment status

### Backend Updates
- **Auto-deploy**: Push to connected GitHub repository
- **Manual**: Use Render dashboard to redeploy

## 📊 Monitoring

### Frontend
- **GitHub Pages Status**: Repository settings → Pages
- **Build Logs**: Actions tab → Latest workflow run

### Backend  
- **Render Dashboard**: Service logs and metrics
- **Health Endpoint**: `/health` for uptime monitoring

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Whitelist only trusted domains
3. **File Uploads**: Validate file types and sizes
4. **Rate Limiting**: Consider implementing for production

## 📈 Performance Optimization

1. **Frontend**:
   - Code splitting via manual chunks
   - Asset optimization in Vite build
   - CDN delivery via GitHub Pages

2. **Backend**:
   - Gzip compression enabled
   - File upload size limits
   - OCR processing timeout limits

---

🎉 **Your VeritasAI application is now live and accessible to the world!**
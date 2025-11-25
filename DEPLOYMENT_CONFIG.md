# Deployment Configuration Guide

## Your URLs
- **Frontend (Vercel)**: https://git-git-main-justine-neemas-projects.vercel.app
- **Backend (Render)**: https://git-4-8zex.onrender.com

## Configuration Changes Made

### 1. Frontend Configuration ✅
- **File**: `frontend/src/api/axios.js`
- **Backend API URL**: `https://git-4-8zex.onrender.com/api`
- **Environment**: Set to use `VITE_API_BASE` environment variable

### 2. Frontend Environment Variables ✅
- **File**: `frontend/.env.production`
- **Variable**: `VITE_API_BASE=https://git-4-8zex.onrender.com/api`

### 3. Backend CORS Configuration ✅
- **File**: `backend/cropdetector/settings.py`
- **CORS_ALLOWED_ORIGINS**: Includes your Vercel URL
- **CSRF_TRUSTED_ORIGINS**: Includes your Vercel URL
- **ALLOWED_HOSTS**: Includes both your Render and Vercel URLs

## Steps to Deploy

### Step 1: Deploy Backend to Render
```bash
cd /home/neema/git/backend
git add .
git commit -m "Update CORS and CSRF settings for production deployment"
git push
```
Render will automatically redeploy when it detects changes.

### Step 2: Deploy Frontend to Vercel
```bash
cd /home/neema/git/frontend
git add .
git commit -m "Update API configuration for production"
git push
```

### Step 3: Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `VITE_API_BASE`
   - **Value**: `https://git-4-8zex.onrender.com/api`
   - **Environments**: Select "Production"
4. Click "Save"
5. Redeploy your project

### Step 4: Verify Connection
1. Open your frontend: https://git-git-main-justine-neemas-projects.vercel.app
2. Open browser console (F12)
3. Look for these logs:
   - ✅ `🔧 API Base URL: https://git-4-8zex.onrender.com/api`
   - ✅ `📤 Making POST request to: ...`
   - ✅ `✅ Response received: 200`

## Troubleshooting

### If you see CORS errors:
- Check backend is deployed with new settings
- Verify Vercel environment variables are set
- Check browser console for exact error message

### If requests timeout:
- Render free tier may take time to wake up
- Wait 30 seconds and try again
- Consider upgrading Render to a paid plan

### If authentication fails:
- Ensure JWT tokens are being sent correctly
- Check localStorage for 'auth_token'
- Verify token is not expired

## Quick Test
Visit: `https://git-git-main-justine-neemas-projects.vercel.app/login`
Then check console and try logging in to verify the connection works.

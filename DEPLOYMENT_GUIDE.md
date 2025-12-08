# 🚀 Deployment Guide - LifeMon Health App

## Overview
Deploy aplikasi LifeMon ke platform gratis:
- **Frontend**: Vercel (gratis, unlimited)
- **Backend**: Render.com (gratis dengan PostgreSQL)

---

## 📋 Prerequisites

Pastikan sudah memiliki:
1. **GitHub Account** (untuk auto-deploy)
2. **Vercel Account** (https://vercel.com)
3. **Render.com Account** (https://render.com)

---

## 🔧 Step 1: Persiapan Kode (Local)

### 1.1 Backend Setup

```bash
cd backend

# Install dependencies (jika belum)
npm install

# Buat .env file dari .env.example
cp .env.example .env

# Edit .env dengan credentials:
# DATABASE_URL=postgresql://user:password@host:5432/dbname
# JWT_SECRET=your_secret_key
# ADMIN_EMAIL=your_email@example.com
```

### 1.2 Frontend Setup

```bash
cd frontend

# Install dependencies (jika belum)
npm install

# Buat .env.production dari template
cp .env.production .env.production

# JANGAN edit .env.production sekarang, Vercel akan handle otomatis
```

### 1.3 Push ke GitHub

```bash
# From root directory
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 🌐 Step 2: Deploy Backend ke Render.com

### 2.1 Create PostgreSQL Database

1. Login ke https://render.com
2. Click "New +" → "PostgreSQL"
3. Fill details:
   - **Name**: lifemon-db
   - **Database**: lifemon
   - **User**: postgres
   - **Region**: Singapore (atau terdekat)
4. Click "Create Database"
5. **COPY DATABASE_URL** (akan digunakan di backend service)

### 2.2 Create Backend Service

1. Click "New +" → "Web Service"
2. **Connect Repository**: Pilih GitHub repo Anda
3. **Settings**:
   - **Name**: lifemon-api (akan jadi lifemon-api.onrender.com)
   - **Root Directory**: backend
   - **Runtime**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**:
   ```
   DATABASE_URL=[paste dari database]
   JWT_SECRET=your_secret_key_12345
   ADMIN_EMAIL=your_email@example.com
   NODE_ENV=production
   ```
5. Click "Create Web Service"
6. **COPY SERVICE URL** - akan jadi https://lifemon-api.onrender.com

### 2.3 Wait for Deployment

- Render akan auto-deploy dari GitHub
- Tunggu sampai "Live" (5-10 menit)
- Buka https://lifemon-api.onrender.com/api/users/health untuk test

---

## 🎨 Step 3: Deploy Frontend ke Vercel

### 3.1 Connect Vercel ke GitHub

1. Login ke https://vercel.com
2. Click "New Project"
3. Select GitHub repo Anda
4. **Import Project Settings**:
   - **Project Name**: lifemon
   - **Framework Preset**: Vite
   - **Root Directory**: ./frontend
5. **Environment Variables**:
   ```
   VITE_API_URL=https://lifemon-api.onrender.com/api
   ```
6. Click "Deploy"
7. **COPY VERCEL URL** - akan jadi https://lifemon-xxxxx.vercel.app

### 3.2 Add Custom Domain (Optional)

1. Go to Vercel Project Settings
2. Click "Domains"
3. Tambahkan domain custom jika punya

---

## 🔗 Step 4: Update CORS di Backend

Setelah dapat Vercel URL, update backend CORS:

### File: backend/server.js

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://lifemon-xxxxx.vercel.app', // Ganti dengan Vercel URL Anda
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
```

Kemudian push ke GitHub:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render akan auto-redeploy.

---

## 🗄️ Step 5: Setup Database Schema

### 5.1 Connect ke PostgreSQL (Render)

Gunakan PgAdmin atau DBeaver:

```
Host: [dari DATABASE_URL]
Port: 5432
Database: lifemon
User: postgres
Password: [dari DATABASE_URL]
```

### 5.2 Run SQL Scripts

Jalankan semua file SQL dari `backend/schema/` untuk create tables.

Atau jalankan endpoint health check:
```
GET https://lifemon-api.onrender.com/api/health
```

---

## 🧪 Step 6: Testing

### Test Frontend
```
https://lifemon-xxxxx.vercel.app
```

### Test Backend
```
curl https://lifemon-api.onrender.com/api/health
```

### Test Login
1. Register account
2. Login
3. Verify token di localStorage
4. Add food log
5. Check dashboard

---

## 🔐 Environment Variables Summary

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
ADMIN_EMAIL=your_email@example.com
NODE_ENV=production
PORT=5000 (Render auto-set)
```

### Frontend (.env.production)
```
VITE_API_URL=https://lifemon-api.onrender.com/api
```

---

## 🐛 Troubleshooting

### Frontend: API 404
- Check VITE_API_URL is correct
- Verify backend is live (https://lifemon-api.onrender.com)
- Check browser console for CORS errors

### Backend: Database Connection Error
- Verify DATABASE_URL is correct
- Check PostgreSQL is running on Render
- Ensure schema is created

### Uploads Not Working
- Backend default creates `/uploads/avatars/` folder
- Render has ephemeral storage, uploads will be lost on restart
- Solution: Use cloud storage (AWS S3, Firebase, etc.)

---

## 📦 Production Checklist

- ✅ Environment variables set
- ✅ Database created and schema applied
- ✅ CORS configured
- ✅ JWT_SECRET is secure
- ✅ Admin email set
- ✅ Frontend .env.production updated
- ✅ HTTPS only (auto on Vercel & Render)
- ✅ Rate limiting configured (optional)
- ✅ Error logging setup (optional)

---

## 🚀 Auto-Deploy Setup

Both Vercel and Render auto-deploy on git push:

```bash
git push origin main
# Frontend auto-deploys in 1-2 minutes
# Backend auto-deploys in 2-5 minutes
```

---

## 📞 Support URLs

After deployment you'll have:
- Frontend: https://lifemon-xxxxx.vercel.app
- Backend API: https://lifemon-api.onrender.com/api
- Database: PostgreSQL on Render

**Happy Deploying! 🎉**

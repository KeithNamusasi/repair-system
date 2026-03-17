# Deployment Guide - Electronics Repair Shop POS

## Prerequisites
- GitHub account
- Render account (free tier)

---

## Deploy Backend to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Migrate to PostgreSQL"
   git push origin main
   ```

2. **Create Backend Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `Node`

3. **Add Environment Variables**
   In Render dashboard for your backend, add:
   - `DATABASE_URL` = `postgresql://neondb_owner:npg_cSHpjW43DRnQ@ep-polished-recipe-addamhb2-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET` = `electronics-repair-secret-key-2024`
   - `PORT` = `5000`

4. Click **Deploy**

---

## Deploy Frontend to Render

1. **Build the frontend locally first**
   ```bash
   cd client
   npm run build
   ```

2. **Create Frontend Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Static Site"**
   - Connect your GitHub repository
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish directory**: `dist`

3. **Add Environment Variables**
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.onrender.com/api`)

4. Click **Deploy**

---

## After Frontend Deployment

Once your frontend is deployed, update the backend CORS to allow your frontend URL:

1. Go to your backend service on Render
2. Update the `CORS_ORIGIN` environment variable with your frontend URL
3. Or redeploy the backend

---

## Quick Fix - Allow All Origins (Not Recommended for Production)

If you want to quickly test, you can allow all origins in `server/server.js`:

```javascript
app.use(cors({
  origin: '*',
  credentials: true,
}));
```

**Note**: This is not secure for production. After testing, restrict to your actual frontend URL.

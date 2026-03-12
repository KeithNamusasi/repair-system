# Deployment Guide for Electronics Repair Shop POS System

## Hosting on Render

### Your Backend URL
✅ Backend is deployed at: `https://repair-ib3o.onrender.com`

---

## Deploy Frontend on Render

### Step 1: Update Frontend
The frontend has been updated to use your backend URL: `https://repair-ib3o.onrender.com/api`

### Step 2: Deploy Frontend on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. **IMPORTANT - Set Root Directory:**
   - Find **"Root Directory"** field
   - Set it to: `client`
5. Configure:
   - **Name**: `repair-shop-pos` (or any name you want)
   - **Build Command**: `npm install && npm run build`
   - **Publish directory**: `dist`

6. Add Environment Variable:
   - `VITE_API_URL` = `https://repair-ib3o.onrender.com/api`

7. Click **"Create Static Site"**

8. Wait for deployment to complete (~2 minutes)

---

## Your Live URLs

| Component | URL |
|-----------|-----|
| **Backend API** | https://repair-ib3o.onrender.com |
| **Frontend** | (Your Render static site URL after deployment) |

---

## Testing

After deploying the frontend:
1. Open your frontend URL
2. Register a new account
3. Test adding products, sales, purchases, repairs, and savings

---

## Troubleshooting

### Frontend can't connect to backend?
Make sure `VITE_API_URL` is set to `https://repair-ib3o.onrender.com/api`

### CORS errors?
The backend is configured to allow all origins. If you still get CORS errors, check that the URL is correct.

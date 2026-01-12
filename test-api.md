# API Testing Guide

## Find Your Backend URL
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Open project: `rrnagarfinal-backend`
3. Copy the URL (shown at top of project page)

Replace `YOUR_BACKEND_URL` with your actual Vercel URL in the commands below.

## Test Commands

### 1. Root Endpoint (API Info)
```bash
curl https://YOUR_BACKEND_URL.vercel.app/
```

### 2. Health Check
```bash
curl https://YOUR_BACKEND_URL.vercel.app/api/health
```

### 3. Get Categories
```bash
curl https://YOUR_BACKEND_URL.vercel.app/api/categories
```

### 4. Get Products
```bash
curl https://YOUR_BACKEND_URL.vercel.app/api/products
```

### 5. Get Products by Category
```bash
curl "https://YOUR_BACKEND_URL.vercel.app/api/products?categoryId=1"
```

### 6. Search Products
```bash
curl "https://YOUR_BACKEND_URL.vercel.app/api/products?q=rice"
```

## Available API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/categories` - Get all categories
- `GET /api/products` - Get all products
- `GET /api/products?categoryId=1` - Get products by category
- `GET /api/products?q=search` - Search products
- `GET /api/ads` - Get ads
- `GET /api/suppliers` - Get suppliers
- `GET /api/customers` - Customer endpoints
- `GET /api/admin` - Admin endpoints

## Using Browser Developer Tools

1. Open browser (Chrome/Firefox)
2. Press F12 to open Developer Tools
3. Go to "Network" tab
4. Visit your API URL
5. Check the response in the Network tab

## Check for Errors

If you see errors:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Click "Logs" tab
4. Look for error messages

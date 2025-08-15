# Backend Deployment Guide for Vercel

## Overview
This guide explains how to deploy the Market Aggregator backend to Vercel as a serverless API.

## Prerequisites
- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- Backend code ready for deployment

## Deployment Steps

### 1. Prepare for Deployment
The backend has been configured for Vercel with:
- `index.js` as the main entry point
- `vercel.json` configuration
- `.vercelignore` to exclude unnecessary files
- Serverless-compatible code

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Deploy from Backend Directory
```bash
cd backend
vercel
```

### 5. Follow the Prompts
- Link to existing project or create new
- Set project name (e.g., `market-aggregator-backend`)
- Set root directory (should be `./`)
- Override settings if needed

### 6. Set Environment Variables
In Vercel dashboard, set these environment variables:
```
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

### 7. Get Deployment URL
After deployment, Vercel will provide a URL like:
`https://your-project.vercel.app`

## Configuration

### Vercel Configuration (`vercel.json`)
- Uses `@vercel/node` builder
- Routes all requests to `index.js`
- Sets 30-second timeout for functions
- Deploys to US East (iad1) region

### Entry Point (`index.js`)
- Exports the Express app for Vercel
- No server startup code (Vercel handles this)

### Database Configuration
- Gracefully handles missing database connections
- Falls back to mock data when database unavailable
- Includes timeout protection for database queries

## Post-Deployment

### 1. Update Frontend Environment
Update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
BACKEND_URL=https://your-backend-url.vercel.app
```

### 2. Test API Endpoints
Test the deployed backend:
```bash
curl https://your-backend-url.vercel.app/api/health
curl https://your-backend-url.vercel.app/api/categories
```

### 3. Monitor Logs
Check Vercel function logs for any errors or issues.

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Verify `index.js` exists and exports correctly

#### 2. Runtime Errors
- Check function logs in Vercel dashboard
- Verify environment variables are set
- Ensure database connection strings are correct

#### 3. Timeout Issues
- Functions have 30-second timeout
- Database queries include 5-second timeout
- Consider optimizing slow queries

### Performance Tips
- Use connection pooling for database
- Implement caching where possible
- Monitor function execution times

## Database Setup

### Option 1: Vercel Postgres
- Use Vercel's managed Postgres service
- Automatically handles connection pooling
- Integrated with Vercel environment

### Option 2: External Database
- Use services like Supabase, Railway, or PlanetScale
- Ensure database is accessible from Vercel
- Set proper connection strings

## Security Considerations
- Never commit `.env` files
- Use strong JWT secrets
- Enable CORS properly
- Implement rate limiting

## Monitoring
- Use Vercel Analytics
- Monitor function performance
- Set up error alerts
- Track API usage

## Support
For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

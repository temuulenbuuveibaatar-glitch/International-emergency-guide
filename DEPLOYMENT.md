# Deployment Guide

## Vercel Deployment Setup

To deploy this emergency guide application to Vercel via GitHub Actions, you need to configure the following secrets in your GitHub repository:

### Required GitHub Secrets

1. **VERCEL_TOKEN**
   - Go to [Vercel Dashboard](https://vercel.com/account/tokens)
   - Create a new token
   - Add it as a repository secret in GitHub

2. **VERCEL_ORG_ID**
   - Found in your Vercel team settings
   - Add as repository secret

3. **VERCEL_PROJECT_ID**
   - Found in your Vercel project settings
   - Add as repository secret

4. **GOOGLE_API_KEY** (Optional)
   - Required for Google Maps functionality in hospital finder
   - Get from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API
   - Add as repository secret

### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact names above

### Alternative Deployment Options

#### GitHub Pages (No secrets required)
- Automatically deploys from the `gh-pages` branch
- Uses the existing GitHub Pages workflow
- Includes all features except Google Maps (without API key)

#### Manual Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Environment Variables

The application uses these environment variables:
- `VITE_GOOGLE_MAPS_API_KEY` - For Google Maps integration
- `DATABASE_URL` - For database connection (if needed)
- `OPENAI_API_KEY` - For AI features (if needed)

All variables should be prefixed with `VITE_` for frontend access.
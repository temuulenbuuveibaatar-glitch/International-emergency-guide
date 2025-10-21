# GitHub Pages Deployment Guide

This guide explains how to deploy the International Emergency Guide to GitHub Pages.

## Prerequisites

- A GitHub repository for this project
- GitHub Pages enabled in repository settings

## Build for GitHub Pages

### Option 1: Using the Build Script (Recommended)

Run the build script:
```bash
./build-github.sh
```

This will:
1. Build the app with the correct base path (`/international-emergency-guide/`)
2. Copy the 404.html file for SPA routing
3. Output everything to the `dist` folder

### Option 2: Manual Build

If you prefer to build manually:

```bash
# Build with GitHub Pages config
vite build --config vite.config.github.ts

# Copy 404.html for SPA routing
cp public/404.html dist/404.html
```

## Deploy to GitHub Pages

### Method 1: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: |
          vite build --config vite.config.github.ts
          cp public/404.html dist/404.html
        env:
          VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Method 2: Manual Deployment

1. Build the project:
   ```bash
   ./build-github.sh
   ```

2. Push the `dist` folder to the `gh-pages` branch:
   ```bash
   # If you don't have gh-pages branch yet
   git checkout --orphan gh-pages
   git rm -rf .
   
   # Copy dist contents
   cp -r dist/* .
   
   # Commit and push
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages --force
   
   # Go back to main branch
   git checkout main
   ```

3. Configure GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

### Method 3: Deploy from Actions (Simplest)

1. Go to your repository Settings → Pages
2. Source: GitHub Actions
3. Push the `.github/workflows/deploy.yml` file to your repo
4. Every push to main will automatically deploy

## Important Configuration

### Repository Name
The `vite.config.github.ts` is configured with:
```typescript
base: "/international-emergency-guide/"
```

**Make sure this matches your repository name!** If your repo is named differently, update this in `vite.config.github.ts`.

### Environment Variables

Add these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

- `VITE_GOOGLE_MAPS_API_KEY` - Your Google Maps API key (optional, for hospital finder)

## Troubleshooting

### Blank/Black Page
If you see a blank page:
1. Check browser console for errors (F12)
2. Verify the `base` path in `vite.config.github.ts` matches your repo name
3. Make sure 404.html was copied to dist folder
4. Check that assets are loading from the correct path

### 404 Errors on Routes
Make sure:
1. The `404.html` file exists in the dist folder
2. The routing script in `client/index.html` is working
3. The base path in `App.tsx` matches the vite config

### Assets Not Loading
1. Verify `base` path in `vite.config.github.ts`
2. Check that asset paths don't have hardcoded absolute paths
3. Ensure all imports use relative paths or the `@` alias

## Testing Locally

To test the GitHub Pages build locally:

```bash
# Build for GitHub Pages
./build-github.sh

# Serve the dist folder
npx serve dist -s -p 3000
```

Then visit: `http://localhost:3000/international-emergency-guide/`

The `/international-emergency-guide/` path is important for testing!

## Verification

After deployment, visit:
```
https://[your-username].github.io/international-emergency-guide/
```

The app should load and all navigation should work correctly.

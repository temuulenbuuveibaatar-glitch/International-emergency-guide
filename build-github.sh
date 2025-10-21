#!/bin/bash
# Build script for GitHub Pages deployment

echo "Building for GitHub Pages..."

# Build the application using GitHub Pages configuration
vite build --config vite.config.github.ts

# Copy 404.html to dist folder for GitHub Pages SPA routing
cp public/404.html dist/404.html

echo "Build complete! Files are in the 'dist' folder."
echo "Deploy the 'dist' folder to GitHub Pages."

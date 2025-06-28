#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting optimized Vercel build...');

try {
  // Set environment variables
  process.env.NODE_ENV = 'production';
  process.env.VITE_APP_MODE = 'production';
  
  // Run the build with timeout handling
  console.log('Building with Vite...');
  execSync('vite build --config vite.config.ts', { 
    stdio: 'inherit',
    timeout: 300000, // 5 minutes timeout
    cwd: process.cwd()
  });
  
  // Copy essential files
  console.log('Copying static files...');
  const staticFiles = [
    'public/data',
    'public/manifest.json',
    'public/serviceWorker.js',
    'public/icon-192x192.png',
    'public/icon-512x512.png'
  ];
  
  staticFiles.forEach(file => {
    const src = path.join(process.cwd(), file);
    const dest = path.join(process.cwd(), 'dist', path.basename(file));
    
    if (fs.existsSync(src)) {
      if (fs.statSync(src).isDirectory()) {
        execSync(`cp -r "${src}" "${path.dirname(dest)}"`, { stdio: 'inherit' });
      } else {
        execSync(`cp "${src}" "${dest}"`, { stdio: 'inherit' });
      }
      console.log(`Copied ${file}`);
    }
  });
  
  console.log('Vercel build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
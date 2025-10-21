import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build from client/ (where index.html and src/ live) and write dist at repo root
export default defineConfig({
  base: '/International-emergency-guide/',
  root: 'client',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base so assets load correctly on GitHub Pages under /International-emergency-guide/
export default defineConfig({
  base: '/International-emergency-guide/',
  plugins: [react()],
  // keep other config options here if needed
})
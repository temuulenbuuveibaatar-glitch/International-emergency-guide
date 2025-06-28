import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  base: "./",
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.VITE_APP_MODE": '"production"'
  },
  esbuild: {
    target: 'esnext'
  }
});
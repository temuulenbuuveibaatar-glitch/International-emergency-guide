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
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]"
      }
    },
    chunkSizeWarningLimit: 1000
  },
  base: "./",
  define: {
    "process.env.NODE_ENV": '"production"'
  },
  esbuild: {
    target: 'es2015'
  }
});
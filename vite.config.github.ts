import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("client/src"),
      "@shared": resolve("shared"),
      "@assets": resolve("attached_assets"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: "assets",
    copyPublicDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash].[ext]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js"
      }
    }
  },
  base: "/international-emergency-guide/",
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.VITE_APP_MODE": '"github-pages"'
  },
  server: {
    fs: {
      allow: [".."]
    }
  }
});
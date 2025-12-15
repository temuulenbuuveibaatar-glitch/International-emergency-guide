import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Export an async config so we can dynamically load optional Replit plugins
// if the environment requests them. To enable Replit plugins set
// USE_REPLIT_PLUGINS=true in your environment (not required for Vercel/GitHub).
export default defineConfig(async () => {
  const plugins: any[] = [react()];

  if (process.env.USE_REPLIT_PLUGINS === "true") {
    try {
      const themePlugin = (await import("@replit/vite-plugin-shadcn-theme-json")).default;
      const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
      plugins.push(runtimeErrorOverlay(), themePlugin());

      // cartographer is conditionally added when REPL_ID is present
      if (process.env.REPL_ID) {
        const carto = (await import("@replit/vite-plugin-cartographer")).cartographer;
        plugins.push(carto());
      }
    } catch (e) {
      // Don't fail the build if optional replit plugins aren't installed.
      // Log a friendly warning so maintainers can opt-in properly.
      // eslint-disable-next-line no-console
      console.warn("Requested Replit plugins but failed to load them:", e);
    }
  }

  return {
    // allow overriding base path (useful for GitHub Pages / subpath deploys)
    // Default to '/' unless VITE_BASE_PATH is explicitly provided. If you need
    // the repo subpath (for GitHub Pages), set VITE_BASE_PATH='/international-emergency-guide/'
    base: process.env.VITE_BASE_PATH || "/",
    publicDir: path.resolve(__dirname, "public"),
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { registerVercelRoutes } from "./vercel-routes";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the Express app
const app = express();

// Configure Express to handle larger requests (50MB limit for images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve static files from the dist/public directory
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

// Register API routes
registerVercelRoutes(app);

// Handle all other routes by serving the index.html file
app.use("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Export the app for Vercel
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
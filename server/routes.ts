import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupYearlyReportsRoutes } from "./api/yearlyReports";
import { setupAboutUsRoutes } from "./api/aboutUs";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // Ensure uploads directory exists and configure serving static files
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Serve static files from uploads directory
  app.use('/uploads', express.static(uploadDir));
  
  // Register API routes
  setupYearlyReportsRoutes(app);
  setupAboutUsRoutes(app);

  const httpServer = createServer(app);
  
  return httpServer;
}

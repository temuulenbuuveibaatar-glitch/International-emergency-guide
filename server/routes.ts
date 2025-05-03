import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDamage } from "./damage-analysis";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // Damage analysis API endpoint
  app.post("/api/analyze-damage", analyzeDamage);
  
  // X-ray analysis API endpoint
  app.post("/api/analyze-xray", (req, res) => {
    req.body.analysisType = 'xray';
    analyzeDamage(req, res);
  });
  
  // MRI analysis API endpoint
  app.post("/api/analyze-mri", (req, res) => {
    req.body.analysisType = 'mri';
    analyzeDamage(req, res);
  });
  
  // General medical image analysis API endpoint
  app.post("/api/analyze-medical", (req, res) => {
    req.body.analysisType = 'medical';
    analyzeDamage(req, res);
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

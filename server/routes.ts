import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  analyzeMockDamage, 
  analyzeMockXray, 
  analyzeMockMRI, 
  analyzeMockMedical,
  mockMedicalChat
} from "./mock-analysis";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // Damage analysis API endpoint - using FREE mock AI analysis (no API key needed)
  app.post("/api/analyze-damage", analyzeMockDamage);
  
  // X-ray analysis API endpoint - using FREE mock AI analysis (no API key needed)
  app.post("/api/analyze-xray", analyzeMockXray);
  
  // MRI analysis API endpoint - using FREE mock AI analysis (no API key needed)
  app.post("/api/analyze-mri", analyzeMockMRI);
  
  // General medical image analysis API endpoint - using FREE mock AI analysis (no API key needed)
  app.post("/api/analyze-medical", analyzeMockMedical);
  
  // Medical chatbot API endpoint - using FREE mock AI responses (no API key needed)
  app.post("/api/medical-chat", mockMedicalChat);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

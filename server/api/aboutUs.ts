import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { insertAboutUsSchema } from "../../shared/schema";

export function setupAboutUsRoutes(app: Express) {
  // Get all published About Us content (public)
  app.get("/api/about-us", async (req: Request, res: Response) => {
    try {
      const content = await storage.getPublishedAboutUsContent();
      res.json(content);
    } catch (err) {
      console.error("Error fetching About Us content:", err);
      res.status(500).json({ message: "Failed to fetch About Us content" });
    }
  });

  // Get About Us content by ID (public)
  app.get("/api/about-us/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getAboutUsById(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (err) {
      console.error("Error fetching About Us content:", err);
      res.status(500).json({ message: "Failed to fetch About Us content" });
    }
  });

  // Get all About Us content (staff only)
  app.get("/api/staff/about-us", async (req: Request, res: Response) => {
    try {
      const content = await storage.getAboutUsContent();
      res.json(content);
    } catch (err) {
      console.error("Error fetching About Us content:", err);
      res.status(500).json({ message: "Failed to fetch About Us content" });
    }
  });

  // Create new About Us content (staff only)
  app.post("/api/staff/about-us", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertAboutUsSchema.parse(req.body);
      
      // Create content
      const content = await storage.createAboutUs(validatedData);
      
      res.status(201).json(content);
    } catch (err) {
      console.error("Error creating About Us content:", err);
      res.status(400).json({ 
        message: err instanceof Error ? err.message : "Failed to create About Us content" 
      });
    }
  });

  // Update About Us content (staff only)
  app.patch("/api/staff/about-us/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if content exists
      const existingContent = await storage.getAboutUsById(id);
      if (!existingContent) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Validate and update
      const updatedContent = await storage.updateAboutUs(id, req.body);
      
      res.json(updatedContent);
    } catch (err) {
      console.error("Error updating About Us content:", err);
      res.status(400).json({ 
        message: err instanceof Error ? err.message : "Failed to update About Us content" 
      });
    }
  });
}
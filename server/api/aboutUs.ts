import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { insertAboutUsSchema, type User } from "@shared/schema";

export function setupAboutUsRoutes(app: Express) {
  // Get all published About Us content for public viewing
  app.get("/api/about-us", async (req, res, next) => {
    try {
      const content = await storage.getPublishedAboutUsContent();
      res.json(content);
    } catch (err) {
      next(err);
    }
  });

  // Get a specific About Us content by ID
  app.get("/api/about-us/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const content = await storage.getAboutUsById(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Non-staff users can only view published content
      if (!content.isPublished && (!req.isAuthenticated() || !(req.user as User).isStaff)) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(content);
    } catch (err) {
      next(err);
    }
  });

  // Staff routes for managing About Us content
  
  // Get all About Us content (including unpublished) for staff
  app.get("/api/staff/about-us", async (req, res, next) => {
    try {
      const content = await storage.getAboutUsContent();
      res.json(content);
    } catch (err) {
      next(err);
    }
  });

  // Create new About Us content (staff only)
  app.post("/api/staff/about-us", async (req, res, next) => {
    try {
      const user = req.user as User;
      
      // Validate content data
      const parseResult = insertAboutUsSchema.safeParse({
        ...req.body,
        lastUpdatedBy: user.id
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid content data", 
          errors: parseResult.error.format() 
        });
      }
      
      const content = await storage.createAboutUs(parseResult.data);
      res.status(201).json(content);
    } catch (err) {
      next(err);
    }
  });

  // Update existing About Us content (staff only)
  app.put("/api/staff/about-us/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const user = req.user as User;
      
      // Check if content exists
      const existingContent = await storage.getAboutUsById(id);
      if (!existingContent) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Update the content with the user's ID as lastUpdatedBy
      const updatedContent = await storage.updateAboutUs(id, {
        ...req.body,
        lastUpdatedBy: user.id
      });
      
      res.json(updatedContent);
    } catch (err) {
      next(err);
    }
  });

  // Toggle publish status (staff only)
  app.patch("/api/staff/about-us/:id/publish", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const user = req.user as User;
      
      // Check if content exists
      const existingContent = await storage.getAboutUsById(id);
      if (!existingContent) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Toggle the publish status
      const updatedContent = await storage.updateAboutUs(id, {
        isPublished: !existingContent.isPublished,
        lastUpdatedBy: user.id
      });
      
      res.json(updatedContent);
    } catch (err) {
      next(err);
    }
  });
}
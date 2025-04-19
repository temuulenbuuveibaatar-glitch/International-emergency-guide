import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { insertYearlyReportSchema, type User } from "@shared/schema";

export function setupYearlyReportsRoutes(app: Express) {
  // Get all yearly reports
  app.get("/api/yearly-reports", async (req, res, next) => {
    try {
      const reports = await storage.getYearlyReports();
      res.json(reports);
    } catch (err) {
      next(err);
    }
  });

  // Get a specific yearly report by ID
  app.get("/api/yearly-reports/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const report = await storage.getYearlyReportById(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (err) {
      next(err);
    }
  });

  // Create a new yearly report (staff only)
  app.post("/api/staff/yearly-reports", async (req, res, next) => {
    try {
      const user = req.user as User;
      
      // Validate report data
      const parseResult = insertYearlyReportSchema.safeParse({
        ...req.body,
        uploadedBy: user.id
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid report data", 
          errors: parseResult.error.format() 
        });
      }
      
      const report = await storage.createYearlyReport(parseResult.data);
      res.status(201).json(report);
    } catch (err) {
      next(err);
    }
  });
}
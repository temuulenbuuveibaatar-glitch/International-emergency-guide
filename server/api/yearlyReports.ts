import { Express, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "../storage";
import { insertYearlyReportSchema } from "../../shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOC/DOCX are allowed.") as any);
    }
  },
});

export function setupYearlyReportsRoutes(app: Express) {
  // Get all yearly reports (public)
  app.get("/api/yearly-reports", async (req: Request, res: Response) => {
    try {
      const reports = await storage.getYearlyReports();
      res.json(reports);
    } catch (err) {
      console.error("Error fetching yearly reports:", err);
      res.status(500).json({ message: "Failed to fetch yearly reports" });
    }
  });

  // Get a specific yearly report by ID (public)
  app.get("/api/yearly-reports/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getYearlyReportById(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (err) {
      console.error("Error fetching yearly report:", err);
      res.status(500).json({ message: "Failed to fetch yearly report" });
    }
  });

  // File upload endpoint (staff only)
  app.post("/api/staff/upload", upload.single("file"), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: "File uploaded successfully",
      fileUrl,
      filename: req.file.filename,
    });
  });

  // Create a new yearly report (staff only)
  app.post("/api/staff/yearly-reports", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertYearlyReportSchema.parse(req.body);
      
      // Create the report
      const report = await storage.createYearlyReport(validatedData);
      
      res.status(201).json(report);
    } catch (err) {
      console.error("Error creating yearly report:", err);
      res.status(400).json({ 
        message: err instanceof Error ? err.message : "Failed to create yearly report" 
      });
    }
  });
}
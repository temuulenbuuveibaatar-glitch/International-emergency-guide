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
  
  // Set up file uploads for yearly reports
  const uploadDir = path.join(process.cwd(), "uploads");
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Configure storage for uploaded files
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Create a unique filename with original file extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
    fileFilter: function(req, file, cb) {
      // Allow only specific file types (PDF, DOC, DOCX)
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (allowedExtensions.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
      }
    }
  });
  
  // File upload endpoint for yearly reports
  app.post('/api/staff/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the file path that can be used in yearly report creation
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      fileUrl: filePath,
      originalName: req.file.originalname
    });
  });
  
  // Serve static files from uploads directory
  app.use('/uploads', express.static(uploadDir));
  
  // Register API routes
  setupYearlyReportsRoutes(app);
  setupAboutUsRoutes(app);

  const httpServer = createServer(app);
  
  return httpServer;
}

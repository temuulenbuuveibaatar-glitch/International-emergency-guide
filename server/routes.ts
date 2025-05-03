import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDamage } from "./damage-analysis";
import OpenAI from "openai";

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
  
  // Medical chatbot API endpoint
  app.post("/api/medical-chat", async (req, res) => {
    try {
      // Check if OpenAI client is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: 'AI service unavailable',
          message: 'OpenAI API key is missing. Please provide an API key to use this feature.'
        });
      }
      
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'No message provided' });
      }
      
      // Initialize OpenAI client
      const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      // Call OpenAI API
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [
          {
            role: "system",
            content: `You are a medical imaging expert assistant that helps with interpreting and understanding medical images such as X-rays, MRIs, CT scans, and other diagnostic imaging. 
            Provide helpful, accurate, and educational responses about medical imaging techniques, interpretation basics, and general concepts.
            Always make it clear you are not a doctor and cannot provide specific medical diagnoses.
            Be concise but thorough in your responses. Focus on educational content about medical imaging rather than attempting to diagnose.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 1000
      });
      
      return res.json({ 
        response: response.choices[0].message.content,
        model: "gpt-4o"
      });
      
    } catch (error) {
      console.error('Medical chat error:', error);
      return res.status(500).json({ 
        error: 'An error occurred while processing your message',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

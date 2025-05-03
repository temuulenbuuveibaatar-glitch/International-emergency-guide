import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
});

// Function to extract base64 data from dataURL
function extractBase64FromDataURL(dataURL: string): string {
  // Check if it's a data URL
  if (!dataURL.startsWith('data:image')) {
    throw new Error('Not a valid image data URL');
  }
  
  // Extract the base64 part after the comma
  const base64Data = dataURL.split(',')[1];
  if (!base64Data) {
    throw new Error('Could not extract base64 data from URL');
  }
  
  return base64Data;
}

// Main analysis function
export async function analyzeDamage(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL
    let base64Image: string;
    try {
      base64Image = extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Call OpenAI Vision API to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model with vision capabilities
      messages: [
        {
          role: "system",
          content: `You are an emergency damage assessment AI that analyzes images to identify injuries, wounds, or damage to structures. 
            For personal injuries, provide severity assessment, description, and first aid recommendations.
            For structural damage (buildings, vehicles, etc.), estimate damage severity and safety recommendations.
            Format responses as JSON with the following structure:
            {
              "damage_type": "Injury type or damage category",
              "severity": "Minor/Moderate/Severe",
              "description": "Detailed description of what is observed",
              "recommendation": "What actions should be taken next"
            }
            Always be clinical, accurate, but also reassuring. For severe injuries, always recommend seeking immediate medical attention.`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analyze this image and provide a detailed damage assessment. What type of damage is shown, what is the severity, and what actions should be taken?" 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });
    
    // Parse the response to ensure it's valid JSON
    try {
      const result = JSON.parse(response.choices[0].message.content || '{}');
      return res.json(result);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return res.status(500).json({ 
        error: 'Failed to parse analysis results',
        raw_response: response.choices[0].message.content
      });
    }
  } catch (error) {
    console.error('AI Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
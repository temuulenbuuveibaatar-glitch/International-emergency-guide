import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    });
  }
} catch (error) {
  console.warn('Could not initialize OpenAI client:', error);
}

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
    // Check if OpenAI client is available
    if (!openai) {
      return res.status(503).json({ 
        error: 'AI service unavailable',
        message: 'OpenAI API key is missing. Please provide an API key to use this feature.'
      });
    }

    const { image, analysisType = 'damage' } = req.body;
    
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
    
    // Select the appropriate system prompt based on analysis type
    let systemPrompt = '';
    let userPrompt = '';
    
    if (analysisType === 'xray') {
      systemPrompt = `You are an AI medical assistant specializing in X-ray image interpretation. 
        You can identify common findings in X-ray images including fractures, dislocations, pneumonia, pleural effusions, etc.
        Format responses as JSON with the following structure:
        {
          "finding_type": "Primary radiological finding",
          "severity": "Normal/Mild/Moderate/Severe",
          "description": "Detailed description of what is observed in the image",
          "possible_diagnosis": "List of possible diagnoses based on findings",
          "recommendation": "Follow-up recommendations or further tests needed",
          "limitations": "Limitations of this analysis (always mention this is not a replacement for professional radiologist evaluation)"
        }
        Always be clinical, accurate, and mention that this analysis should be confirmed by a qualified radiologist or physician.`;
      userPrompt = "Analyze this X-ray image and provide a detailed interpretation. What findings are visible, what is their significance, and what follow-up might be recommended?";
    } 
    else if (analysisType === 'mri') {
      systemPrompt = `You are an AI medical assistant specializing in MRI image interpretation. 
        You can identify common findings in MRI images including soft tissue injuries, ligament tears, tumors, and various abnormalities.
        Format responses as JSON with the following structure:
        {
          "finding_type": "Primary radiological finding",
          "location": "Anatomical location of the finding",
          "description": "Detailed description of what is observed in the image",
          "possible_diagnosis": "List of possible diagnoses based on findings",
          "recommendation": "Follow-up recommendations or further tests needed",
          "limitations": "Limitations of this analysis (always mention this is not a replacement for professional radiologist evaluation)"
        }
        Always be clinical, accurate, and mention that this analysis should be confirmed by a qualified radiologist or physician.`;
      userPrompt = "Analyze this MRI image and provide a detailed interpretation. What findings are visible, what is their significance, and what follow-up might be recommended?";
    } 
    else if (analysisType === 'medical') {
      systemPrompt = `You are an AI medical assistant specializing in analyzing various medical images. 
        You can identify common findings in different types of medical images including skin conditions, visible symptoms, wounds, and more.
        Format responses as JSON with the following structure:
        {
          "finding_type": "Primary medical finding",
          "severity": "Mild/Moderate/Severe",
          "description": "Detailed description of what is observed in the image",
          "possible_diagnosis": "List of possible diagnoses based on findings",
          "recommendation": "First aid or medical recommendations",
          "limitations": "Limitations of this analysis (always mention this is not a replacement for professional medical evaluation)"
        }
        Always be clinical, accurate, and mention that this analysis should be confirmed by a qualified healthcare professional.`;
      userPrompt = "Analyze this medical image and provide a detailed interpretation. What conditions are visible, what might they indicate, and what actions should be taken?";
    } 
    else { // Default damage assessment
      systemPrompt = `You are an emergency damage assessment AI that analyzes images to identify injuries, wounds, or damage to structures. 
        For personal injuries, provide severity assessment, description, and first aid recommendations.
        For structural damage (buildings, vehicles, etc.), estimate damage severity and safety recommendations.
        Format responses as JSON with the following structure:
        {
          "damage_type": "Injury type or damage category",
          "severity": "Minor/Moderate/Severe",
          "description": "Detailed description of what is observed",
          "recommendation": "What actions should be taken next"
        }
        Always be clinical, accurate, but also reassuring. For severe injuries, always recommend seeking immediate medical attention.`;
      userPrompt = "Analyze this image and provide a detailed damage assessment. What type of damage is shown, what is the severity, and what actions should be taken?";
    }
    
    // Call OpenAI Vision API to analyze the image
    const response = await openai!.chat.completions.create({
      model: "gpt-4o", // Using the latest model with vision capabilities
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: userPrompt 
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
      max_tokens: 1500
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
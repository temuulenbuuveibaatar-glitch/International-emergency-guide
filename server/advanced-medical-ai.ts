import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MedicalAnalysisRequest {
  symptoms: string[];
  patientAge?: number;
  patientSex?: 'male' | 'female' | 'other';
  medicalHistory?: string[];
  currentMedications?: string[];
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  imageData?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface MedicalResponse {
  assessment: {
    primaryDifferentials: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedActions: string[];
    redFlags: string[];
  };
  recommendations: {
    immediateSteps: string[];
    diagnosticTests?: string[];
    medications?: string[];
    followUp: string;
    referrals?: string[];
  };
  education: {
    conditionInfo: string;
    warningSignsToWatch: string[];
    preventiveMeasures?: string[];
  };
  disclaimer: string;
}

export async function advancedMedicalAnalysis(req: Request, res: Response) {
  try {
    const analysisRequest: MedicalAnalysisRequest = req.body;

    // Validate required fields
    if (!analysisRequest.symptoms || analysisRequest.symptoms.length === 0) {
      return res.status(400).json({
        error: "Symptoms are required for medical analysis"
      });
    }

    // Build comprehensive prompt for medical AI
    const medicalPrompt = `
You are an advanced medical AI assistant providing emergency triage and medical guidance. Analyze the following patient presentation:

PATIENT INFORMATION:
- Age: ${analysisRequest.patientAge || 'Not specified'}
- Sex: ${analysisRequest.patientSex || 'Not specified'}
- Primary Symptoms: ${analysisRequest.symptoms.join(', ')}
- Medical History: ${analysisRequest.medicalHistory?.join(', ') || 'None provided'}
- Current Medications: ${analysisRequest.currentMedications?.join(', ') || 'None provided'}

VITAL SIGNS:
${analysisRequest.vitalSigns ? `
- Temperature: ${analysisRequest.vitalSigns.temperature || 'Not recorded'}°F
- Blood Pressure: ${analysisRequest.vitalSigns.bloodPressure || 'Not recorded'}
- Heart Rate: ${analysisRequest.vitalSigns.heartRate || 'Not recorded'} bpm
- Respiratory Rate: ${analysisRequest.vitalSigns.respiratoryRate || 'Not recorded'} /min
- Oxygen Saturation: ${analysisRequest.vitalSigns.oxygenSaturation || 'Not recorded'}%
` : 'No vital signs provided'}

CLINICAL GUIDELINES:
1. Use evidence-based medicine and current clinical guidelines (2025 standards)
2. Consider emergency conditions first (ABC assessment priority)
3. Account for age-specific considerations
4. Factor in medication interactions and contraindications
5. Prioritize life-threatening conditions

PROVIDE ANALYSIS IN JSON FORMAT:
{
  "assessment": {
    "primaryDifferentials": ["Top 3-5 most likely diagnoses based on presentation"],
    "urgencyLevel": "critical/high/medium/low",
    "recommendedActions": ["Immediate actions to take"],
    "redFlags": ["Warning signs indicating emergency care needed"]
  },
  "recommendations": {
    "immediateSteps": ["Step-by-step immediate care instructions"],
    "diagnosticTests": ["Recommended tests if available"],
    "medications": ["Medication recommendations with dosing if applicable"],
    "followUp": "Follow-up care instructions",
    "referrals": ["Specialist referrals if indicated"]
  },
  "education": {
    "conditionInfo": "Patient-friendly explanation of likely condition",
    "warningSignsToWatch": ["Signs that warrant immediate medical attention"],
    "preventiveMeasures": ["Prevention strategies if applicable"]
  },
  "disclaimer": "This AI assessment is for informational purposes only and does not replace professional medical evaluation. Seek immediate medical attention for emergencies."
}

Base your analysis on:
- 2025 clinical practice guidelines
- Evidence-based emergency medicine protocols
- International standards of care
- Age and sex-specific considerations
- Drug interaction databases
- Medical emergency prioritization systems
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an advanced medical AI trained in emergency medicine, internal medicine, and clinical decision-making. Provide comprehensive, evidence-based medical assessments while emphasizing the importance of professional medical care."
        },
        {
          role: "user",
          content: medicalPrompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.3 // Lower temperature for more consistent medical advice
    });

    const medicalAnalysis = JSON.parse(response.choices[0].message.content || '{}');

    // Add additional safety checks and enhancements
    const enhancedResponse: MedicalResponse = {
      ...medicalAnalysis,
      assessment: {
        ...medicalAnalysis.assessment,
        urgencyLevel: determineUrgencyLevel(analysisRequest.symptoms, medicalAnalysis.assessment?.urgencyLevel)
      },
      disclaimer: "⚠️ IMPORTANT: This AI assessment is for informational purposes only and does not replace professional medical evaluation. Always seek immediate medical attention for emergencies or when in doubt about your health."
    };

    // Log the analysis for quality monitoring (without PII)
    console.log(`Medical AI Analysis - Urgency: ${enhancedResponse.assessment.urgencyLevel}, Symptoms: ${analysisRequest.symptoms.length}`);

    res.json(enhancedResponse);

  } catch (error) {
    console.error('Advanced medical analysis error:', error);
    res.status(500).json({
      error: "Unable to complete medical analysis",
      message: "Please consult with a healthcare professional immediately if this is an emergency."
    });
  }
}

// Enhanced image analysis for medical imaging
export async function medicalImageAnalysis(req: Request, res: Response) {
  try {
    const { imageData, analysisType, patientInfo } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const imageAnalysisPrompt = `
Analyze this medical image with the following context:
- Analysis Type: ${analysisType || 'General medical image'}
- Patient Context: ${patientInfo || 'Not provided'}

IMPORTANT GUIDELINES:
1. This is for educational/informational purposes only
2. No definitive diagnoses should be made from images alone
3. Emphasize the need for professional radiological interpretation
4. Focus on observable findings and educational content
5. Highlight when immediate medical attention is needed

Provide analysis in JSON format:
{
  "findings": ["Observable findings in the image"],
  "educationalInfo": "Educational information about what the image shows",
  "limitations": "Limitations of AI image analysis",
  "recommendations": "Recommendations for professional evaluation",
  "urgency": "low/medium/high - based on visible findings",
  "disclaimer": "Professional disclaimer"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant trained to provide educational information about medical images. Always emphasize that professional medical interpretation is required for diagnosis."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: imageAnalysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.2
    });

    const imageAnalysis = JSON.parse(response.choices[0].message.content || '{}');

    res.json({
      ...imageAnalysis,
      timestamp: new Date().toISOString(),
      disclaimer: "⚠️ This AI analysis is for educational purposes only. Professional radiological interpretation is required for accurate diagnosis."
    });

  } catch (error) {
    console.error('Medical image analysis error:', error);
    res.status(500).json({
      error: "Unable to analyze medical image",
      message: "Please consult with a medical professional for proper image interpretation."
    });
  }
}

// Enhanced medical chat with conversation context
export async function enhancedMedicalChat(req: Request, res: Response) {
  try {
    const { message, conversationHistory, patientContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build conversation context
    const messages: any[] = [
      {
        role: "system",
        content: `You are an advanced medical AI assistant providing evidence-based health information and emergency guidance. 

CORE PRINCIPLES:
- Use 2025 medical guidelines and evidence-based practices
- Prioritize patient safety and emergency recognition
- Provide clear, actionable guidance
- Always recommend professional care when appropriate
- Consider patient context and medical history

PATIENT CONTEXT: ${patientContext || 'Not provided'}

IMPORTANT: Always include appropriate medical disclaimers and emphasize when emergency care is needed.`
      }
    ];

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory.slice(-10)); // Limit to last 10 messages
    }

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.4,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = response.choices[0].message.content;

    // Enhance response with safety checks
    const enhancedResponse = enhanceResponseSafety(aiResponse || '');

    res.json({
      response: enhancedResponse,
      timestamp: new Date().toISOString(),
      conversationId: req.body.conversationId || generateConversationId()
    });

  } catch (error) {
    console.error('Enhanced medical chat error:', error);
    res.status(500).json({
      error: "Unable to process medical inquiry",
      response: "I'm experiencing technical difficulties. For medical emergencies, please call emergency services immediately. For non-urgent medical questions, please consult with a healthcare professional."
    });
  }
}

// Utility functions
function determineUrgencyLevel(symptoms: string[], aiUrgency?: string): 'low' | 'medium' | 'high' | 'critical' {
  const criticalSymptoms = [
    'chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding',
    'stroke symptoms', 'cardiac arrest', 'anaphylaxis', 'severe trauma'
  ];
  
  const highUrgencySymptoms = [
    'severe pain', 'high fever', 'dehydration', 'head injury',
    'severe allergic reaction', 'drug overdose'
  ];

  const symptomText = symptoms.join(' ').toLowerCase();
  
  if (criticalSymptoms.some(symptom => symptomText.includes(symptom))) {
    return 'critical';
  }
  
  if (highUrgencySymptoms.some(symptom => symptomText.includes(symptom))) {
    return 'high';
  }
  
  return aiUrgency as any || 'medium';
}

function enhanceResponseSafety(response: string): string {
  // Add safety disclaimers if not present
  if (!response.includes('emergency') && !response.includes('911')) {
    response += '\n\n⚠️ For medical emergencies, call emergency services immediately.';
  }
  
  if (!response.includes('professional') && !response.includes('doctor')) {
    response += '\n\nThis information is for educational purposes only. Please consult with a healthcare professional for proper medical advice.';
  }
  
  return response;
}

function generateConversationId(): string {
  return `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Drug interaction checker
export async function checkDrugInteractions(req: Request, res: Response) {
  try {
    const { medications, patientInfo } = req.body;

    if (!medications || !Array.isArray(medications) || medications.length < 2) {
      return res.status(400).json({ error: "At least two medications are required for interaction checking" });
    }

    const interactionPrompt = `
Analyze potential drug interactions for the following medications:
${medications.map((med: string, index: number) => `${index + 1}. ${med}`).join('\n')}

Patient Information: ${patientInfo || 'Not provided'}

Provide comprehensive interaction analysis in JSON format:
{
  "interactions": [
    {
      "drug1": "Medication name",
      "drug2": "Medication name", 
      "severity": "minor/moderate/major/contraindicated",
      "mechanism": "How the interaction occurs",
      "clinicalEffect": "What happens to the patient",
      "management": "How to manage this interaction"
    }
  ],
  "warnings": ["Important warnings and contraindications"],
  "recommendations": ["Clinical recommendations for safe use"],
  "monitoringParameters": ["What to monitor in this patient"],
  "disclaimer": "Professional disclaimer"
}

Use 2025 drug interaction databases and clinical guidelines.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a clinical pharmacist AI specializing in drug interactions and medication safety. Provide evidence-based drug interaction analysis."
        },
        {
          role: "user",
          content: interactionPrompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.2
    });

    const interactionAnalysis = JSON.parse(response.choices[0].message.content || '{}');

    res.json({
      ...interactionAnalysis,
      timestamp: new Date().toISOString(),
      medicationsAnalyzed: medications.length
    });

  } catch (error) {
    console.error('Drug interaction analysis error:', error);
    res.status(500).json({
      error: "Unable to analyze drug interactions",
      message: "Please consult with a pharmacist or healthcare provider for medication interaction information."
    });
  }
}
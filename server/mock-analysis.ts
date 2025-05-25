import { Request, Response } from "express";

// Function to extract base64 data from dataURL (reused from damage-analysis.ts)
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

// Enhanced AI analysis for comprehensive medical imaging
function generateMockXrayAnalysis() {
  // Define comprehensive body regions with detailed medical findings
  const bodyRegions = [
    // Chest/Thoracic injuries
    {
      region: "chest",
      findings: [
        "Pneumothorax in the right upper lobe",
        "Multiple rib fractures (ribs 4-6 on the left)",
        "Pulmonary contusion in bilateral lower lobes",
        "Hemothorax with fluid level in left pleural space",
        "Tension pneumothorax with mediastinal shift",
        "Flail chest with paradoxical movement"
      ],
      descriptions: [
        "Spontaneous pneumothorax involving approximately 30% of the right hemithorax. No underlying lung pathology visible. Pleural edge clearly demarcated.",
        "Displaced fractures of the 4th, 5th, and 6th ribs on the left with possible underlying pulmonary laceration. No pneumothorax currently visible.",
        "Bilateral patchy consolidations consistent with pulmonary contusion following blunt chest trauma. No pneumothorax or pleural effusion.",
        "Large left hemothorax with approximately 1.5L of blood. Mediastinal structures slightly shifted to the right. Possible splenic injury correlation needed.",
        "Complete collapse of left lung with significant mediastinal shift to the right. Immediate decompression required.",
        "Multiple adjacent rib fractures creating an unstable chest wall segment. Associated pulmonary contusion visible."
      ],
      diagnoses: [
        "Spontaneous pneumothorax requiring chest tube insertion",
        "Multiple rib fractures with high risk for complications",
        "Bilateral pulmonary contusion from blunt trauma",
        "Massive hemothorax requiring urgent intervention",
        "Tension pneumothorax - medical emergency",
        "Flail chest requiring mechanical ventilation support"
      ],
      recommendations: [
        "Immediate chest tube insertion. Monitor respiratory status closely. Consider thoracic surgery consultation.",
        "Pain management protocol. Incentive spirometry. Monitor for pneumonia development. Possible surgical stabilization if severe.",
        "Supportive respiratory care. PEEP ventilation if required. Monitor arterial blood gases. ICU admission recommended.",
        "Emergency chest tube insertion. Large bore tube recommended. Urgent thoracic surgery consultation. Blood transfusion may be needed.",
        "IMMEDIATE needle decompression followed by chest tube. Emergency intubation if respiratory distress. ICU admission required.",
        "Mechanical ventilation with PEEP. Pain control essential. Surgical consultation for rib stabilization. ICU monitoring required."
      ]
    },
    // Head/Neurological injuries
    {
      region: "head",
      findings: [
        "Linear skull fracture in the temporal region",
        "Depressed skull fracture with bone fragments",
        "Basilar skull fracture with CSF leak",
        "Intracranial hemorrhage with mass effect",
        "Epidural hematoma with lens-shaped appearance",
        "Subdural hematoma with midline shift"
      ],
      descriptions: [
        "Non-displaced linear fracture extending from the temporal bone to the parietal region. No underlying brain injury visible on CT.",
        "Comminuted depressed skull fracture with multiple bone fragments displaced inward. Possible dural tear and brain parenchymal injury.",
        "Fracture through the base of skull involving petrous temporal bone. Signs of CSF rhinorrhea and possible VII nerve palsy.",
        "Large intracerebral hemorrhage in the right frontoparietal region with significant mass effect and 15mm midline shift.",
        "Biconvex hyperdense lesion in the right temporal region consistent with acute epidural hematoma. Mass effect on adjacent structures.",
        "Crescentic hyperdense collection along the cerebral convexity with 8mm midline shift and compression of lateral ventricle."
      ],
      diagnoses: [
        "Simple linear skull fracture without complications",
        "Complex depressed skull fracture requiring surgical intervention",
        "Basilar skull fracture with CSF leak and cranial nerve involvement",
        "Massive intracerebral hemorrhage with increased intracranial pressure",
        "Acute epidural hematoma requiring emergency evacuation",
        "Acute subdural hematoma with significant mass effect"
      ],
      recommendations: [
        "Neurological monitoring every hour. No specific intervention required if neurologically stable. Follow-up imaging in 24 hours.",
        "Emergency neurosurgical consultation. Craniotomy and debridement required. ICP monitoring. Antibiotic prophylaxis.",
        "ENT and neurosurgery consultation. Avoid nasal packing. Prophylactic antibiotics. Monitor for meningitis signs.",
        "Emergency neurosurgical intervention. ICP monitoring. Mannitol and hyperventilation. ICU admission with intubation.",
        "IMMEDIATE neurosurgical evacuation. Emergency craniotomy. ICP monitoring. Blood pressure management critical.",
        "Urgent neurosurgical consultation. Possible craniotomy depending on GCS and mass effect. ICP monitoring essential."
      ]
    }
  ];

  // Select random region and finding
  const selectedRegion = bodyRegions[Math.floor(Math.random() * bodyRegions.length)];
  const findingIndex = Math.floor(Math.random() * selectedRegion.findings.length);

  return {
    analysis_type: `${selectedRegion.region.charAt(0).toUpperCase() + selectedRegion.region.slice(1)} X-ray Analysis`,
    primary_finding: selectedRegion.findings[findingIndex],
    detailed_description: selectedRegion.descriptions[findingIndex],
    clinical_diagnosis: selectedRegion.diagnoses[findingIndex],
    treatment_recommendations: selectedRegion.recommendations[findingIndex],
    urgency_level: determineUrgencyLevel(selectedRegion.findings[findingIndex]),
    confidence: (88 + Math.random() * 8).toFixed(1) + "%",
    body_region: selectedRegion.region,
    follow_up_required: true,
    specialist_consultation: getSpecialistRecommendation(selectedRegion.region)
  };
}

function determineUrgencyLevel(finding: string): string {
  const highUrgency = ["tension pneumothorax", "epidural hematoma", "cervical spine dislocation", "bowel perforation", "hemothorax"];
  const mediumUrgency = ["fracture", "dislocation", "laceration", "pneumothorax"];
  
  if (highUrgency.some(urgent => finding.toLowerCase().includes(urgent.toLowerCase()))) {
    return "EMERGENCY - Immediate intervention required";
  } else if (mediumUrgency.some(medium => finding.toLowerCase().includes(medium.toLowerCase()))) {
    return "URGENT - Specialist consultation within hours";
  }
  return "ROUTINE - Follow-up within 24-48 hours";
}

function getSpecialistRecommendation(region: string): string {
  const specialists: { [key: string]: string } = {
    chest: "Thoracic Surgery or Pulmonology",
    head: "Neurosurgery or Emergency Medicine",
    foot: "Orthopedic Surgery or Sports Medicine",
    spine: "Neurosurgery or Orthopedic Spine Surgery",
    abdomen: "General Surgery or Trauma Surgery"
  };
  return specialists[region] || "Emergency Medicine";
}

// Generate mock MRI analysis with comprehensive findings
function generateMockMRIAnalysis() {
  const findings = [
    "No acute intracranial abnormalities detected",
    "Mild chronic small vessel ischemic changes",
    "Normal brain parenchyma and ventricular system",
    "No evidence of acute stroke or hemorrhage",
    "White matter appears normal for age",
    "No mass lesions identified",
    "Cerebrospinal fluid spaces within normal limits"
  ];
  
  const recommendations = [
    "No acute intervention required",
    "Routine follow-up with primary care physician",
    "Consider vascular risk factor modification",
    "Clinical correlation recommended",
    "Follow-up imaging in 6-12 months if clinically indicated"
  ];

  return {
    analysis_type: "MRI Brain Analysis",
    findings: findings.slice(0, Math.floor(Math.random() * 4) + 3),
    recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 2),
    confidence: (82 + Math.random() * 12).toFixed(1) + "%",
    urgency: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
  };
}

// Generate mock medical analysis for general imaging
function generateMockMedicalAnalysis() {
  const findings = [
    "Normal tissue density and structure",
    "No acute abnormalities detected",
    "Mild inflammatory changes noted",
    "Tissue healing progressing well",
    "No signs of infection or malignancy"
  ];
  
  const recommendations = [
    "Continue current treatment plan",
    "Follow-up imaging in 4-6 weeks",
    "Clinical correlation recommended",
    "Monitor symptoms closely"
  ];

  return {
    analysis_type: "Medical Image Analysis",
    findings: findings.slice(0, Math.floor(Math.random() * 3) + 2),
    recommendations: recommendations.slice(0, Math.floor(Math.random() * 2) + 1),
    confidence: (80 + Math.random() * 15).toFixed(1) + "%",
    urgency: Math.random() > 0.6 ? "medium" : "low"
  };
}

// Generate mock damage analysis
function generateMockDamageAnalysis() {
  const damageTypes = [
    "Structural damage to building foundation",
    "Water damage affecting interior walls",
    "Fire damage with smoke residue",
    "Impact damage from collision",
    "Weather-related exterior damage"
  ];
  
  const recommendations = [
    "Professional structural assessment recommended",
    "Immediate repairs required for safety",
    "Insurance documentation suggested",
    "Temporary protective measures needed"
  ];

  return {
    damage_type: damageTypes[Math.floor(Math.random() * damageTypes.length)],
    severity: Math.random() > 0.7 ? "severe" : Math.random() > 0.4 ? "moderate" : "minor",
    description: "Comprehensive damage assessment completed with detailed analysis of affected areas.",
    recommendation: recommendations[Math.floor(Math.random() * recommendations.length)]
  };
}

// API endpoints
export async function analyzeMockXray(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Extract base64 data (we don't actually process it in mock mode)
    const base64Data = extractBase64FromDataURL(image);
    
    // Generate mock analysis
    const analysis = generateMockXrayAnalysis();
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in X-ray analysis:', error);
    res.status(500).json({ error: "Failed to analyze X-ray image" });
  }
}

export async function analyzeMockMRI(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Extract base64 data (we don't actually process it in mock mode)
    const base64Data = extractBase64FromDataURL(image);
    
    // Generate mock analysis
    const analysis = generateMockMRIAnalysis();
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in MRI analysis:', error);
    res.status(500).json({ error: "Failed to analyze MRI image" });
  }
}

export async function analyzeMockMedical(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Extract base64 data (we don't actually process it in mock mode)
    const base64Data = extractBase64FromDataURL(image);
    
    // Generate mock analysis
    const analysis = generateMockMedicalAnalysis();
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in medical analysis:', error);
    res.status(500).json({ error: "Failed to analyze medical image" });
  }
}

export async function analyzeMockDamage(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Extract base64 data (we don't actually process it in mock mode)
    const base64Data = extractBase64FromDataURL(image);
    
    // Generate mock analysis
    const analysis = generateMockDamageAnalysis();
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in damage analysis:', error);
    res.status(500).json({ error: "Failed to analyze damage image" });
  }
}

export async function mockMedicalChat(req: Request, res: Response) {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Generate mock medical chat response
    const responses = [
      "Based on your symptoms, I recommend seeking immediate medical attention if you experience severe pain, difficulty breathing, or loss of consciousness.",
      "Your symptoms could indicate several conditions. Please consult with a healthcare professional for proper diagnosis and treatment.",
      "For emergency situations, please call your local emergency services immediately. This tool is for informational purposes only.",
      "I understand your concern. While I can provide general information, it's important to get a proper medical evaluation from a qualified healthcare provider."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({ 
      response,
      disclaimer: "This is for informational purposes only and should not replace professional medical advice."
    });
  } catch (error) {
    console.error('Error in medical chat:', error);
    res.status(500).json({ error: "Failed to process medical chat request" });
  }
}
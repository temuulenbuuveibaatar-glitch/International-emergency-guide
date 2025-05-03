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

// Generate mock X-ray analysis 
function generateMockXrayAnalysis() {
  const findings = [
    "Normal chest radiograph",
    "Mild cardiomegaly",
    "Bilateral infiltrates",
    "Right lower lobe opacity",
    "Pleural effusion"
  ];
  
  const severity = ["Normal", "Mild", "Moderate", "Severe"];
  
  const descriptions = [
    "The lungs are clear without focal consolidation. No pleural effusion or pneumothorax. Heart size is normal. Mediastinal contours are unremarkable.",
    "There is mild enlargement of the cardiac silhouette. The lungs are otherwise clear without focal consolidation.",
    "Patchy bilateral opacities are present in both lung fields, more prominent in the lower lobes.",
    "Dense opacity in the right lower lobe with air bronchograms, consistent with pneumonia.",
    "Blunting of the right costophrenic angle suggesting small pleural effusion. The left lung is clear."
  ];
  
  const diagnoses = [
    "No acute cardiopulmonary process",
    "Heart failure, hypertensive heart disease",
    "Bilateral pneumonia, pulmonary edema, ARDS",
    "Community-acquired pneumonia, aspiration",
    "Pleural effusion, possibly due to heart failure or infection"
  ];
  
  const recommendations = [
    "No further imaging is necessary at this time.",
    "Clinical correlation recommended. Consider echocardiogram if not recently performed.",
    "Follow-up chest radiograph in 2-3 weeks after treatment. Consider CT chest if symptoms persist.",
    "Antibiotic treatment as clinically indicated. Follow-up radiograph in 2 weeks to document resolution.",
    "Clinical correlation recommended. Consider thoracentesis if effusion increases or patient becomes symptomatic."
  ];
  
  // Randomly select an index
  const index = Math.floor(Math.random() * findings.length);
  
  return {
    finding_type: findings[index],
    severity: severity[Math.min(index, severity.length - 1)],
    description: descriptions[index],
    possible_diagnosis: diagnoses[index],
    recommendation: recommendations[index],
    limitations: "This is a simulated analysis for demonstration purposes only. In a real scenario, proper radiological interpretation by a qualified radiologist is essential."
  };
}

// Generate mock MRI analysis
function generateMockMRIAnalysis() {
  const findings = [
    "Normal brain MRI",
    "Small vessel ischemic changes",
    "Acute infarct",
    "Multiple sclerosis plaques",
    "Mass lesion"
  ];
  
  const locations = [
    "Not applicable",
    "Periventricular white matter",
    "Left middle cerebral artery territory",
    "Periventricular and subcortical white matter",
    "Right parietal lobe"
  ];
  
  const descriptions = [
    "Normal brain parenchyma without evidence of acute infarction, hemorrhage, or mass effect. Ventricles and sulci are normal in size and configuration.",
    "Scattered foci of T2/FLAIR hyperintensity in the periventricular white matter, consistent with chronic small vessel ischemic changes.",
    "Area of restricted diffusion in the left MCA territory, consistent with acute/subacute infarct. No evidence of hemorrhagic transformation.",
    "Multiple ovoid, periventricular and subcortical white matter lesions with high T2/FLAIR signal. Some show enhancement with contrast.",
    "Heterogeneously enhancing mass in the right parietal lobe with surrounding vasogenic edema and mass effect on the adjacent ventricle."
  ];
  
  const diagnoses = [
    "No acute intracranial abnormality",
    "Chronic small vessel ischemic disease, likely related to hypertension or age-related changes",
    "Acute/subacute ischemic stroke in the left MCA territory",
    "Findings consistent with multiple sclerosis. Clinical correlation recommended.",
    "Intracranial mass, likely primary neoplasm. Differential includes high-grade glioma."
  ];
  
  const recommendations = [
    "No further imaging is necessary at this time.",
    "Clinical correlation with vascular risk factors. Consider carotid ultrasound if not recently performed.",
    "Neurology consultation recommended. Follow-up MRI in 3 months to evaluate for evolution.",
    "Neurology consultation recommended. Consider CSF analysis and evoked potentials to support MS diagnosis.",
    "Urgent neurosurgical consultation recommended. Consider stereotactic biopsy for definitive diagnosis."
  ];
  
  // Randomly select an index
  const index = Math.floor(Math.random() * findings.length);
  
  return {
    finding_type: findings[index],
    location: locations[index],
    description: descriptions[index],
    possible_diagnosis: diagnoses[index],
    recommendation: recommendations[index],
    limitations: "This is a simulated analysis for demonstration purposes only. In a real scenario, proper radiological interpretation by a qualified radiologist is essential."
  };
}

// Generate mock medical image analysis
function generateMockMedicalAnalysis() {
  const findings = [
    "Normal skin appearance",
    "Superficial laceration",
    "Cellulitis",
    "Second-degree burn",
    "Skin lesion"
  ];
  
  const severity = ["Mild", "Moderate", "Severe"];
  
  const descriptions = [
    "Normal skin with no evidence of rash, lesions, or trauma.",
    "Linear break in skin integrity approximately 3cm in length. No evidence of deep tissue involvement or foreign bodies.",
    "Erythematous, edematous, and warm skin with poorly defined margins. No evidence of abscess formation or necrosis.",
    "Erythematous skin with blister formation. The burn appears to involve the epidermis and part of the dermis.",
    "Well-circumscribed, pigmented lesion with irregular borders and asymmetry. Approximately 8mm in diameter."
  ];
  
  const diagnoses = [
    "No pathological findings",
    "Superficial laceration, likely traumatic in origin",
    "Cellulitis, likely bacterial in origin",
    "Partial-thickness (second-degree) burn",
    "Suspicious pigmented lesion, cannot exclude melanoma"
  ];
  
  const recommendations = [
    "No specific treatment necessary.",
    "Wound cleansing, topical antibiotic ointment, and adhesive closure. Tetanus prophylaxis if indicated.",
    "Oral antibiotics with coverage for common skin pathogens. Elevation of affected area if possible.",
    "Wound care with gentle cleansing, topical antimicrobial, and non-adherent dressings. Pain management as needed.",
    "Dermatology referral for evaluation and possible biopsy."
  ];
  
  // Randomly select an index
  const index = Math.floor(Math.random() * findings.length);
  
  return {
    finding_type: findings[index],
    severity: severity[Math.min(index, severity.length - 1)],
    description: descriptions[index],
    possible_diagnosis: diagnoses[index],
    recommendation: recommendations[index],
    limitations: "This is a simulated analysis for demonstration purposes only. In a real scenario, proper medical evaluation by a qualified healthcare professional is essential."
  };
}

// Generate mock damage analysis
function generateMockDamageAnalysis() {
  const damageTypes = [
    "No significant damage",
    "Superficial wound",
    "Deep laceration",
    "Burn injury",
    "Blunt force trauma"
  ];
  
  const severity = ["Minor", "Moderate", "Severe"];
  
  const descriptions = [
    "No significant injuries or damage observed.",
    "Superficial break in skin integrity without deep tissue involvement.",
    "Deep laceration with possible involvement of underlying structures.",
    "Thermal injury with blistering and erythema.",
    "Contusion with significant swelling and discoloration."
  ];
  
  const recommendations = [
    "No specific treatment necessary.",
    "Clean with mild soap and water. Apply antibiotic ointment and adhesive bandage.",
    "Apply direct pressure to control bleeding. Seek immediate medical attention for evaluation and possible suturing.",
    "Cool the area with running water for 10-15 minutes. Do not use ice. Seek medical attention for further evaluation.",
    "Apply ice wrapped in cloth for 15-20 minutes. Rest and elevate the area if possible. Seek medical evaluation if pain is severe or function is impaired."
  ];
  
  // Randomly select an index
  const index = Math.floor(Math.random() * damageTypes.length);
  
  return {
    damage_type: damageTypes[index],
    severity: severity[Math.min(index, severity.length - 1)],
    description: descriptions[index],
    recommendation: recommendations[index]
  };
}

// Main analysis function for X-rays
export async function analyzeMockXray(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockXrayAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock X-ray Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main analysis function for MRIs
export async function analyzeMockMRI(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockMRIAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock MRI Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main analysis function for medical images
export async function analyzeMockMedical(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockMedicalAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock Medical Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main analysis function for damage assessment
export async function analyzeMockDamage(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockDamageAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock Damage Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Function for medical chat
export async function mockMedicalChat(req: Request, res: Response) {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock responses based on keywords in the message
    let response = "I'm a medical AI assistant. How can I help you today?";
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
      response = "Pain can have many causes. It's important to note the location, intensity, duration, and any factors that make it better or worse. If the pain is severe or persistent, please consult a healthcare professional.";
    } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      response = "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and consider over-the-counter fever reducers if appropriate. If the fever is high (over 103°F/39.4°C), persistent, or accompanied by severe symptoms, seek medical attention.";
    } else if (lowerMessage.includes('headache')) {
      response = "Headaches can be caused by stress, dehydration, eye strain, or more serious conditions. Ensure you're hydrated, rested, and consider over-the-counter pain relievers if needed. If headaches are severe, sudden, or accompanied by other symptoms like vision changes or neck stiffness, seek immediate medical attention.";
    } else if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
      response = "Rest, stay hydrated, and consider over-the-counter medications for symptom relief. If symptoms are severe, persistent, or accompanied by high fever or difficulty breathing, consult a healthcare professional.";
    } else if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension')) {
      response = "Maintaining healthy blood pressure is important for heart and vascular health. Regular exercise, a balanced diet low in sodium, maintaining a healthy weight, limiting alcohol, and not smoking can help manage blood pressure. Regular monitoring and medication (if prescribed) are also important.";
    } else if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
      response = "Managing diabetes involves monitoring blood sugar, taking medications as prescribed, maintaining a balanced diet, regular physical activity, and attending regular check-ups. It's important to recognize and promptly address any symptoms of high or low blood sugar.";
    } else if (lowerMessage.includes('pregnancy') || lowerMessage.includes('pregnant')) {
      response = "Prenatal care is crucial during pregnancy. This includes regular check-ups, a balanced diet, appropriate supplements (like folic acid), avoiding harmful substances (alcohol, tobacco, certain medications), and staying physically active as appropriate. Discuss any concerns with your healthcare provider.";
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      response = "If you're experiencing a medical emergency, please call emergency services (911 in the US) immediately rather than seeking advice here. For symptoms like chest pain, difficulty breathing, severe bleeding, or signs of stroke, immediate medical attention is critical.";
    } else if (lowerMessage.includes('thank')) {
      response = "You're welcome! I'm happy to help. If you have any other health-related questions, feel free to ask.";
    }
    
    return res.json({ response });
  } catch (error) {
    console.error('Mock Chat error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during chat',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
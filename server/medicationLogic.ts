import type { Medication, Patient } from "@shared/schema";

interface DoseResult {
  recommendedDose: string;
  doseUnit: string;
  frequency: string;
  route: string;
  maxDailyDose: string;
  warnings: string[];
  contraindicated: boolean;
  contraindicationReasons: string[];
  requiresMonitoring: string[];
  specialInstructions: string[];
  calculationMethod: string;
}

interface DrugInteractionResult {
  severe: Array<{ drug1: string; drug2: string; description: string; recommendation: string }>;
  moderate: Array<{ drug1: string; drug2: string; description: string; recommendation: string }>;
  mild: Array<{ drug1: string; drug2: string; description: string }>;
}

interface SafetyInfo {
  safeToUse: boolean;
  warnings: string[];
  contraindications: string[];
  allergyRisk: boolean;
  allergyDetails: string[];
  renalCaution: boolean;
  renalDetails: string;
  hepaticCaution: boolean;
  hepaticDetails: string;
  pregnancyCategory: string;
  pregnancyWarning: string;
  monitoringRequired: string[];
}

export function calculateDose(
  medication: Medication,
  patient: Patient,
  indication?: string
): DoseResult {
  const warnings: string[] = [];
  const contraindicated = false;
  const contraindicationReasons: string[] = [];
  const requiresMonitoring: string[] = [];
  const specialInstructions: string[] = [];
  
  // Calculate patient age
  const birthDate = new Date(patient.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  const isPediatric = age < 18;
  const isGeriatric = age >= 65;
  const weight = patient.weight ? parseFloat(patient.weight) : null;
  
  let recommendedDose = "";
  let calculationMethod = "";
  
  // Weight-based dosing
  if (medication.weightBasedDosing && medication.weightBasedFormula && weight) {
    const formulaMatch = medication.weightBasedFormula.match(/(\d+(?:\.\d+)?)\s*mg\/kg/i);
    if (formulaMatch) {
      const mgPerKg = parseFloat(formulaMatch[1]);
      const calculatedDose = mgPerKg * weight;
      recommendedDose = `${calculatedDose.toFixed(1)} mg`;
      calculationMethod = `Weight-based: ${medication.weightBasedFormula} x ${weight}kg = ${calculatedDose.toFixed(1)}mg`;
    }
  } else if (isPediatric && medication.standardDosePediatric) {
    recommendedDose = medication.standardDosePediatric;
    calculationMethod = "Standard pediatric dose";
  } else if (medication.standardDoseAdult) {
    recommendedDose = medication.standardDoseAdult;
    calculationMethod = "Standard adult dose";
  }
  
  // Age-based adjustments
  if (isPediatric) {
    warnings.push("Pediatric patient - verify age-appropriate dosing");
    if (!medication.standardDosePediatric && !medication.weightBasedFormula) {
      warnings.push("No pediatric-specific dosing available - consult pharmacist");
    }
  }
  
  if (isGeriatric) {
    warnings.push("Geriatric patient - consider starting at lower dose");
    warnings.push("Monitor for increased sensitivity to medications");
    specialInstructions.push("Start low and titrate slowly");
  }
  
  // Check for contraindications based on allergies
  if (patient.allergies && medication.contraindications) {
    const patientAllergies = patient.allergies.map(a => a.toLowerCase());
    const medContraindications = medication.contraindications.map(c => c.toLowerCase());
    
    for (const allergy of patientAllergies) {
      for (const contraindication of medContraindications) {
        if (contraindication.includes(allergy) || allergy.includes(contraindication)) {
          contraindicationReasons.push(`Patient allergy: ${allergy}`);
        }
      }
    }
  }
  
  // Check chronic conditions
  if (patient.chronicConditions) {
    const conditions = patient.chronicConditions.map(c => c.toLowerCase());
    
    if (conditions.some(c => c.includes("kidney") || c.includes("renal"))) {
      if (medication.renalAdjustment) {
        warnings.push("Renal impairment - dose adjustment may be required");
        specialInstructions.push(medication.renalAdjustment);
      }
    }
    
    if (conditions.some(c => c.includes("liver") || c.includes("hepatic"))) {
      if (medication.hepaticAdjustment) {
        warnings.push("Hepatic impairment - dose adjustment may be required");
        specialInstructions.push(medication.hepaticAdjustment);
      }
    }
  }
  
  // Add monitoring requirements
  if (medication.monitoringParameters) {
    requiresMonitoring.push(...medication.monitoringParameters);
  }
  
  if (medication.labsRequired) {
    requiresMonitoring.push(`Labs required: ${medication.labsRequired.join(", ")}`);
  }
  
  // Black box warning
  if (medication.blackBoxWarning) {
    warnings.unshift(`BLACK BOX WARNING: ${medication.blackBoxWarning}`);
  }
  
  // Controlled substance warning
  if (medication.isControlled) {
    warnings.push(`Controlled substance (Schedule ${medication.controlledSchedule}) - follow DEA regulations`);
    specialInstructions.push("Document witness for administration");
    specialInstructions.push("Count verification required");
  }
  
  return {
    recommendedDose,
    doseUnit: medication.strength.includes("mg") ? "mg" : medication.strength.includes("ml") ? "ml" : "units",
    frequency: medication.dosingFrequency || "As directed",
    route: medication.route,
    maxDailyDose: medication.maxDailyDose || "Consult pharmacist",
    warnings,
    contraindicated: contraindicationReasons.length > 0,
    contraindicationReasons,
    requiresMonitoring,
    specialInstructions,
    calculationMethod
  };
}

// Known drug interactions database (rule-based, validated medical references)
const knownInteractions: Array<{
  drug1Patterns: string[];
  drug2Patterns: string[];
  severity: 'severe' | 'moderate' | 'mild';
  description: string;
  recommendation: string;
}> = [
  {
    drug1Patterns: ['warfarin', 'coumadin'],
    drug2Patterns: ['aspirin', 'ibuprofen', 'nsaid', 'naproxen'],
    severity: 'severe',
    description: 'Increased risk of bleeding when anticoagulants combined with NSAIDs',
    recommendation: 'Avoid combination. If necessary, monitor INR closely and watch for bleeding signs.'
  },
  {
    drug1Patterns: ['metformin'],
    drug2Patterns: ['contrast', 'iodine'],
    severity: 'severe',
    description: 'Risk of lactic acidosis with contrast media',
    recommendation: 'Hold metformin 48 hours before and after contrast administration.'
  },
  {
    drug1Patterns: ['ssri', 'sertraline', 'fluoxetine', 'paroxetine', 'citalopram', 'escitalopram'],
    drug2Patterns: ['maoi', 'phenelzine', 'tranylcypromine', 'selegiline'],
    severity: 'severe',
    description: 'Risk of serotonin syndrome - potentially fatal',
    recommendation: 'Contraindicated. Allow 14-day washout period between medications.'
  },
  {
    drug1Patterns: ['ace inhibitor', 'lisinopril', 'enalapril', 'ramipril'],
    drug2Patterns: ['potassium', 'spironolactone'],
    severity: 'moderate',
    description: 'Increased risk of hyperkalemia',
    recommendation: 'Monitor potassium levels regularly. Consider alternative diuretic.'
  },
  {
    drug1Patterns: ['digoxin'],
    drug2Patterns: ['amiodarone'],
    severity: 'moderate',
    description: 'Amiodarone increases digoxin levels',
    recommendation: 'Reduce digoxin dose by 50%. Monitor digoxin levels and heart rate.'
  },
  {
    drug1Patterns: ['statin', 'atorvastatin', 'simvastatin', 'rosuvastatin'],
    drug2Patterns: ['gemfibrozil'],
    severity: 'severe',
    description: 'Increased risk of rhabdomyolysis',
    recommendation: 'Avoid combination. Use fenofibrate if fibrate therapy needed.'
  },
  {
    drug1Patterns: ['opioid', 'morphine', 'fentanyl', 'oxycodone', 'hydrocodone'],
    drug2Patterns: ['benzodiazepine', 'diazepam', 'lorazepam', 'alprazolam', 'midazolam'],
    severity: 'severe',
    description: 'Increased risk of respiratory depression and death',
    recommendation: 'Avoid combination when possible. If necessary, use lowest effective doses.'
  },
  {
    drug1Patterns: ['methotrexate'],
    drug2Patterns: ['nsaid', 'ibuprofen', 'naproxen', 'aspirin'],
    severity: 'moderate',
    description: 'NSAIDs may increase methotrexate toxicity',
    recommendation: 'Monitor for methotrexate toxicity. Consider dose adjustment.'
  },
  {
    drug1Patterns: ['theophylline'],
    drug2Patterns: ['ciprofloxacin', 'erythromycin', 'clarithromycin'],
    severity: 'moderate',
    description: 'Antibiotics may increase theophylline levels',
    recommendation: 'Monitor theophylline levels. Consider 25-50% dose reduction.'
  },
  {
    drug1Patterns: ['lithium'],
    drug2Patterns: ['nsaid', 'ibuprofen', 'naproxen', 'ace inhibitor', 'diuretic'],
    severity: 'moderate',
    description: 'Risk of lithium toxicity',
    recommendation: 'Monitor lithium levels closely. Watch for signs of toxicity.'
  }
];

export async function checkDrugInteractions(medicationIds: number[]): Promise<DrugInteractionResult> {
  // In a real implementation, this would fetch medication names from DB
  // For now, return empty result - the actual check happens in routes.ts
  return {
    severe: [],
    moderate: [],
    mild: []
  };
}

export function checkInteractionsByName(medicationNames: string[]): DrugInteractionResult {
  const result: DrugInteractionResult = {
    severe: [],
    moderate: [],
    mild: []
  };
  
  const normalizedNames = medicationNames.map(n => n.toLowerCase());
  
  for (let i = 0; i < normalizedNames.length; i++) {
    for (let j = i + 1; j < normalizedNames.length; j++) {
      const drug1 = normalizedNames[i];
      const drug2 = normalizedNames[j];
      
      for (const interaction of knownInteractions) {
        const drug1Match = interaction.drug1Patterns.some(p => drug1.includes(p));
        const drug2Match = interaction.drug2Patterns.some(p => drug2.includes(p));
        const reverseMatch = interaction.drug1Patterns.some(p => drug2.includes(p)) &&
                            interaction.drug2Patterns.some(p => drug1.includes(p));
        
        if ((drug1Match && drug2Match) || reverseMatch) {
          const interactionRecord = {
            drug1: medicationNames[i],
            drug2: medicationNames[j],
            description: interaction.description,
            recommendation: interaction.recommendation
          };
          
          if (interaction.severity === 'severe') {
            result.severe.push(interactionRecord);
          } else if (interaction.severity === 'moderate') {
            result.moderate.push(interactionRecord);
          } else {
            result.mild.push({ 
              drug1: medicationNames[i], 
              drug2: medicationNames[j], 
              description: interaction.description 
            });
          }
        }
      }
    }
  }
  
  return result;
}

export function getDrugSafetyInfo(medication: Medication, patient: Patient): SafetyInfo {
  const warnings: string[] = [];
  const contraindications: string[] = [];
  const allergyDetails: string[] = [];
  let allergyRisk = false;
  let renalCaution = false;
  let hepaticCaution = false;
  let renalDetails = "";
  let hepaticDetails = "";
  const monitoringRequired: string[] = [];
  
  // Check allergies
  if (patient.allergies && medication.contraindications) {
    for (const allergy of patient.allergies) {
      const allergyLower = allergy.toLowerCase();
      
      // Check if medication name or category matches allergy
      if (medication.name.toLowerCase().includes(allergyLower) ||
          medication.genericName?.toLowerCase().includes(allergyLower) ||
          medication.category.toLowerCase().includes(allergyLower)) {
        allergyRisk = true;
        allergyDetails.push(`Direct allergy match: ${allergy}`);
      }
      
      // Check cross-reactivity patterns
      const crossReactivityPatterns: Record<string, string[]> = {
        'penicillin': ['amoxicillin', 'ampicillin', 'cephalosporin'],
        'sulfa': ['sulfamethoxazole', 'sulfasalazine', 'sulfadiazine'],
        'aspirin': ['nsaid', 'ibuprofen', 'naproxen'],
        'latex': ['banana', 'avocado', 'kiwi'],
        'egg': ['influenza vaccine', 'yellow fever vaccine']
      };
      
      for (const [allergen, crossReactive] of Object.entries(crossReactivityPatterns)) {
        if (allergyLower.includes(allergen)) {
          for (const related of crossReactive) {
            if (medication.name.toLowerCase().includes(related) ||
                medication.genericName?.toLowerCase().includes(related)) {
              allergyRisk = true;
              allergyDetails.push(`Cross-reactivity risk: ${allergy} → ${medication.name}`);
            }
          }
        }
      }
    }
  }
  
  // Check chronic conditions for renal/hepatic concerns
  if (patient.chronicConditions) {
    const conditions = patient.chronicConditions.map(c => c.toLowerCase());
    
    if (conditions.some(c => c.includes('kidney') || c.includes('renal') || c.includes('ckd'))) {
      renalCaution = true;
      renalDetails = medication.renalAdjustment || 'Consult pharmacist for renal dosing adjustments';
      warnings.push('Renal impairment detected - dosing adjustment may be required');
    }
    
    if (conditions.some(c => c.includes('liver') || c.includes('hepatic') || c.includes('cirrhosis'))) {
      hepaticCaution = true;
      hepaticDetails = medication.hepaticAdjustment || 'Consult pharmacist for hepatic dosing adjustments';
      warnings.push('Hepatic impairment detected - dosing adjustment may be required');
    }
  }
  
  // Add medication-specific contraindications
  if (medication.contraindications) {
    contraindications.push(...medication.contraindications);
  }
  
  // Add monitoring requirements
  if (medication.monitoringParameters) {
    monitoringRequired.push(...medication.monitoringParameters);
  }
  
  if (medication.labsRequired) {
    monitoringRequired.push(...medication.labsRequired);
  }
  
  // Black box warning
  if (medication.blackBoxWarning) {
    warnings.unshift(`BLACK BOX WARNING: ${medication.blackBoxWarning}`);
  }
  
  // Pregnancy category
  const pregnancyCategoryWarnings: Record<string, string> = {
    'A': 'Adequate studies show no risk to fetus',
    'B': 'Animal studies show no risk; human studies inadequate',
    'C': 'Animal studies show risk; human studies inadequate - use if benefits outweigh risks',
    'D': 'Evidence of human fetal risk - use only if benefits outweigh serious risks',
    'X': 'CONTRAINDICATED IN PREGNANCY - Fetal abnormalities documented'
  };
  
  const safeToUse = !allergyRisk && contraindications.length === 0;
  
  return {
    safeToUse,
    warnings,
    contraindications,
    allergyRisk,
    allergyDetails,
    renalCaution,
    renalDetails,
    hepaticCaution,
    hepaticDetails,
    pregnancyCategory: medication.pregnancyCategory || 'Not classified',
    pregnancyWarning: pregnancyCategoryWarnings[medication.pregnancyCategory || ''] || 'Consult physician regarding pregnancy safety',
    monitoringRequired
  };
}

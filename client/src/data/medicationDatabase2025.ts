// Enhanced Medication Database - Updated 2025
// Comprehensive drug information with latest formulations and guidelines

export interface EnhancedMedication {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  category: string;
  therapeuticClass: string;
  description: string;
  indications: string[];
  dosageForm: string[];
  dosage: {
    adult: string;
    pediatric: string;
    elderly: string;
    renalImpairment?: string;
    hepaticImpairment?: string;
  };
  administration: {
    route: string[];
    timing: string;
    withFood?: boolean;
    specialInstructions?: string;
  };
  contraindications: string[];
  warnings: string[];
  sideEffects: {
    common: string[];
    serious: string[];
    rare: string[];
  };
  interactions: {
    drugInteractions: string[];
    foodInteractions?: string[];
    labInteractions?: string[];
  };
  monitoring: string[];
  pharmacokinetics: {
    onset: string;
    peakEffect: string;
    duration: string;
    halfLife: string;
    metabolism: string;
    excretion: string;
  };
  pregnancy: {
    category: string;
    notes: string;
  };
  lactation: string;
  pediatricConsiderations?: string;
  geriatricConsiderations?: string;
  storage: string;
  availability: string[];
  cost: 'low' | 'moderate' | 'high' | 'very-high';
  emergencyAntidote?: string;
  blackBoxWarning?: string;
  lastUpdated: string;
  fdaApproved: boolean;
  genericAvailable: boolean;
}

export const enhancedMedicationDatabase: EnhancedMedication[] = [
  // Cardiovascular Medications
  {
    id: "aspirin-2025",
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    brandNames: ["Bayer", "Ecotrin", "St. Joseph"],
    category: "Cardiovascular",
    therapeuticClass: "Antiplatelet Agent",
    description: "NSAID with antiplatelet properties used for cardiovascular protection and pain relief",
    indications: ["Acute coronary syndrome", "Stroke prevention", "Pain relief", "Fever reduction", "Inflammatory conditions"],
    dosageForm: ["Tablet", "Chewable tablet", "Enteric-coated tablet", "Suppository"],
    dosage: {
      adult: "75-325mg daily for cardioprotection; 325-650mg q4-6h PRN for pain/fever (max 4g/day)",
      pediatric: "10-15mg/kg q4-6h PRN (avoid in viral infections - Reye's syndrome risk)",
      elderly: "Use lowest effective dose; increased bleeding risk",
      renalImpairment: "Avoid in severe renal impairment",
      hepaticImpairment: "Use with caution"
    },
    administration: {
      route: ["Oral", "Rectal"],
      timing: "With food to reduce GI irritation",
      withFood: true,
      specialInstructions: "Chew tablet for acute coronary syndrome"
    },
    contraindications: ["Active bleeding", "Hemophilia", "Severe hepatic impairment", "Children with viral infections"],
    warnings: ["Bleeding risk", "GI ulceration", "Reye's syndrome in children", "Ototoxicity at high doses"],
    sideEffects: {
      common: ["GI upset", "Heartburn", "Nausea"],
      serious: ["GI bleeding", "Allergic reactions", "Tinnitus"],
      rare: ["Hepatotoxicity", "Bronchospasm", "Stevens-Johnson syndrome"]
    },
    interactions: {
      drugInteractions: ["Warfarin", "Clopidogrel", "Methotrexate", "ACE inhibitors", "Lithium"],
      foodInteractions: ["Alcohol increases bleeding risk"],
      labInteractions: ["May affect bleeding time", "Interferes with thyroid function tests"]
    },
    monitoring: ["Signs of bleeding", "GI symptoms", "Renal function", "Hearing (high doses)"],
    pharmacokinetics: {
      onset: "30-60 minutes",
      peakEffect: "1-2 hours",
      duration: "4-6 hours",
      halfLife: "2-3 hours (dose-dependent)",
      metabolism: "Hepatic hydrolysis",
      excretion: "Renal"
    },
    pregnancy: {
      category: "D (3rd trimester)",
      notes: "Avoid in 3rd trimester - bleeding risk, premature closure of ductus arteriosus"
    },
    lactation: "Compatible with breastfeeding",
    pediatricConsiderations: "Avoid in children with viral infections due to Reye's syndrome risk",
    geriatricConsiderations: "Increased bleeding risk; monitor for GI complications",
    storage: "Room temperature, protect from moisture",
    availability: ["OTC", "Prescription"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "atorvastatin-2025",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    brandNames: ["Lipitor"],
    category: "Cardiovascular",
    therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
    description: "Cholesterol-lowering medication that reduces cardiovascular risk",
    indications: ["Hypercholesterolemia", "Primary prevention of cardiovascular disease", "Secondary prevention post-MI"],
    dosageForm: ["Tablet"],
    dosage: {
      adult: "10-80mg once daily",
      pediatric: "10-20mg daily (age ≥10 years with familial hypercholesterolemia)",
      elderly: "Start with 10mg daily",
      renalImpairment: "No adjustment needed",
      hepaticImpairment: "Contraindicated in active liver disease"
    },
    administration: {
      route: ["Oral"],
      timing: "Evening preferred, can be taken any time",
      withFood: false,
      specialInstructions: "Can be taken with or without food"
    },
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding", "Myopathy"],
    warnings: ["Myopathy/rhabdomyolysis", "Hepatotoxicity", "Diabetes risk", "Cognitive impairment"],
    sideEffects: {
      common: ["Muscle pain", "Headache", "Diarrhea", "Nasopharyngitis"],
      serious: ["Rhabdomyolysis", "Hepatitis", "Severe muscle weakness"],
      rare: ["Immune-mediated necrotizing myopathy", "Interstitial lung disease"]
    },
    interactions: {
      drugInteractions: ["Cyclosporine", "Gemfibrozil", "Erythromycin", "Niacin", "Warfarin"],
      foodInteractions: ["Grapefruit juice increases levels"],
      labInteractions: ["May increase liver enzymes", "May increase CK levels"]
    },
    monitoring: ["Liver function tests", "Lipid profile", "CK levels if muscle symptoms", "HbA1c"],
    pharmacokinetics: {
      onset: "2 weeks",
      peakEffect: "4-6 weeks",
      duration: "24 hours",
      halfLife: "14 hours",
      metabolism: "Hepatic via CYP3A4",
      excretion: "Biliary/fecal"
    },
    pregnancy: {
      category: "X",
      notes: "Contraindicated - teratogenic effects"
    },
    lactation: "Contraindicated",
    pediatricConsiderations: "Safety established in children ≥10 years with familial hypercholesterolemia",
    geriatricConsiderations: "Higher risk of myopathy; start with lower dose",
    storage: "Room temperature, protect from light and moisture",
    availability: ["Prescription"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  // Emergency Medications
  {
    id: "epinephrine-2025",
    name: "Epinephrine",
    genericName: "Epinephrine",
    brandNames: ["EpiPen", "Adrenaclick", "Auvi-Q", "Twinject"],
    category: "Emergency",
    therapeuticClass: "Alpha/Beta Adrenergic Agonist",
    description: "Life-saving medication for severe allergic reactions and cardiac arrest",
    indications: ["Anaphylaxis", "Severe asthma", "Cardiac arrest", "Severe allergic reactions"],
    dosageForm: ["Auto-injector", "Vial for injection", "Prefilled syringe"],
    dosage: {
      adult: "0.3-0.5mg IM for anaphylaxis; 1mg IV for cardiac arrest",
      pediatric: "0.01mg/kg IM (max 0.3mg) for anaphylaxis; 0.01mg/kg IV for cardiac arrest",
      elderly: "Same as adult, monitor for cardiac effects",
      renalImpairment: "No adjustment needed",
      hepaticImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Intramuscular", "Intravenous", "Subcutaneous", "Endotracheal"],
      timing: "Immediately when indicated",
      withFood: false,
      specialInstructions: "Inject into anterolateral thigh; may repeat every 5-15 minutes"
    },
    contraindications: ["None in life-threatening situations"],
    warnings: ["Cardiac arrhythmias", "Hypertension", "Cerebral hemorrhage", "Pulmonary edema"],
    sideEffects: {
      common: ["Anxiety", "Tremor", "Palpitations", "Headache", "Injection site reactions"],
      serious: ["Cardiac arrhythmias", "Hypertensive crisis", "Pulmonary edema"],
      rare: ["Cerebral hemorrhage", "Renal necrosis"]
    },
    interactions: {
      drugInteractions: ["Beta-blockers", "MAOIs", "Tricyclic antidepressants", "Digoxin"],
      foodInteractions: ["None significant"],
      labInteractions: ["May increase blood glucose", "May increase lactate"]
    },
    monitoring: ["Blood pressure", "Heart rate", "Cardiac rhythm", "Respiratory status"],
    pharmacokinetics: {
      onset: "1-2 minutes IM, immediate IV",
      peakEffect: "5-10 minutes",
      duration: "10-30 minutes",
      halfLife: "2-3 minutes",
      metabolism: "Hepatic and tissue",
      excretion: "Renal"
    },
    pregnancy: {
      category: "C",
      notes: "Benefits may outweigh risks in life-threatening situations"
    },
    lactation: "Compatible - minimal excretion",
    pediatricConsiderations: "Dose based on weight; auto-injectors available in pediatric strengths",
    geriatricConsiderations: "Increased risk of cardiac complications",
    storage: "Room temperature, protect from light, do not refrigerate auto-injectors",
    availability: ["Prescription", "Emergency use"],
    cost: "high",
    emergencyAntidote: "Beta-blockers for overdose",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "naloxone-2025",
    name: "Naloxone",
    genericName: "Naloxone Hydrochloride",
    brandNames: ["Narcan", "Evzio", "Kloxxado"],
    category: "Emergency",
    therapeuticClass: "Opioid Antagonist",
    description: "Opioid overdose reversal agent - life-saving emergency medication",
    indications: ["Opioid overdose", "Opioid-induced respiratory depression"],
    dosageForm: ["Nasal spray", "Auto-injector", "Vial for injection"],
    dosage: {
      adult: "0.4-2mg IV/IM/SC; 4mg intranasal (may repeat every 2-3 minutes)",
      pediatric: "0.01mg/kg IV/IM/SC; 2mg intranasal if >1 year or >20kg",
      elderly: "Same as adult",
      renalImpairment: "No adjustment needed",
      hepaticImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Intranasal", "Intramuscular", "Intravenous", "Subcutaneous"],
      timing: "Immediately upon recognition of overdose",
      withFood: false,
      specialInstructions: "May need multiple doses; call 911; prepare for withdrawal symptoms"
    },
    contraindications: ["Hypersensitivity to naloxone"],
    warnings: ["Opioid withdrawal", "Recurrent respiratory depression", "Cardiovascular effects"],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Agitation", "Tachycardia"],
      serious: ["Severe withdrawal", "Seizures", "Cardiac arrhythmias"],
      rare: ["Pulmonary edema", "Cardiac arrest"]
    },
    interactions: {
      drugInteractions: ["All opioids (reverses effects)"],
      foodInteractions: ["None"],
      labInteractions: ["None significant"]
    },
    monitoring: ["Respiratory rate", "Consciousness level", "Blood pressure", "Heart rate"],
    pharmacokinetics: {
      onset: "1-2 minutes IV, 2-5 minutes IM/SC, 8-13 minutes intranasal",
      peakEffect: "5-15 minutes",
      duration: "30-90 minutes",
      halfLife: "60-90 minutes",
      metabolism: "Hepatic",
      excretion: "Renal"
    },
    pregnancy: {
      category: "B",
      notes: "Safe in pregnancy for opioid overdose"
    },
    lactation: "Compatible",
    pediatricConsiderations: "Weight-based dosing; consider pediatric-specific products",
    geriatricConsiderations: "Monitor for cardiovascular effects",
    storage: "Room temperature, protect from light",
    availability: ["OTC", "Prescription", "Emergency services"],
    cost: "moderate",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  // Diabetes Medications
  {
    id: "metformin-2025",
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    brandNames: ["Glucophage", "Glucophage XR", "Fortamet", "Glumetza"],
    category: "Endocrine",
    therapeuticClass: "Biguanide",
    description: "First-line oral antidiabetic medication for type 2 diabetes",
    indications: ["Type 2 diabetes mellitus", "Prediabetes", "PCOS"],
    dosageForm: ["Immediate-release tablet", "Extended-release tablet", "Oral solution"],
    dosage: {
      adult: "500mg BID or 850mg daily initially; max 2000-2550mg daily",
      pediatric: "500mg BID (age ≥10 years); max 2000mg daily",
      elderly: "Conservative dosing based on renal function",
      renalImpairment: "Contraindicated if eGFR <30; reduce dose if eGFR 30-45",
      hepaticImpairment: "Contraindicated"
    },
    administration: {
      route: ["Oral"],
      timing: "With meals to reduce GI upset",
      withFood: true,
      specialInstructions: "Swallow XR tablets whole; do not crush or chew"
    },
    contraindications: ["eGFR <30", "Metabolic acidosis", "Diabetic ketoacidosis", "Acute heart failure"],
    warnings: ["Lactic acidosis", "Vitamin B12 deficiency", "Contrast-induced nephropathy"],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Abdominal discomfort", "Metallic taste"],
      serious: ["Lactic acidosis", "Severe hypoglycemia (with other agents)"],
      rare: ["Megaloblastic anemia", "Hepatitis"]
    },
    interactions: {
      drugInteractions: ["Contrast agents", "Alcohol", "Insulin", "Sulfonylureas", "Cimetidine"],
      foodInteractions: ["Alcohol increases lactic acidosis risk"],
      labInteractions: ["May decrease vitamin B12", "May affect creatinine"]
    },
    monitoring: ["HbA1c", "Renal function", "Vitamin B12 levels", "Liver function"],
    pharmacokinetics: {
      onset: "Several days to weeks",
      peakEffect: "2-4 weeks",
      duration: "12-24 hours",
      halfLife: "4-9 hours",
      metabolism: "Not metabolized",
      excretion: "Renal (unchanged)"
    },
    pregnancy: {
      category: "B",
      notes: "May be used in pregnancy for diabetes management"
    },
    lactation: "Compatible",
    pediatricConsiderations: "Approved for children ≥10 years with type 2 diabetes",
    geriatricConsiderations: "Assess renal function before initiation; may need dose reduction",
    storage: "Room temperature, protect from moisture",
    availability: ["Prescription"],
    cost: "low",
    blackBoxWarning: "Lactic acidosis risk",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  // Antibiotics
  {
    id: "amoxicillin-2025",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    brandNames: ["Amoxil", "Trimox", "Moxatag"],
    category: "Anti-infective",
    therapeuticClass: "Penicillin Antibiotic",
    description: "Broad-spectrum beta-lactam antibiotic for bacterial infections",
    indications: ["Respiratory tract infections", "UTIs", "Skin infections", "H. pylori eradication", "Endocarditis prophylaxis"],
    dosageForm: ["Capsule", "Tablet", "Chewable tablet", "Oral suspension", "Extended-release tablet"],
    dosage: {
      adult: "250-500mg q8h or 500-875mg q12h",
      pediatric: "20-40mg/kg/day divided q8h or q12h (max 30mg/kg/day for otitis media)",
      elderly: "Adjust for renal function",
      renalImpairment: "Reduce dose based on CrCl",
      hepaticImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Oral"],
      timing: "Can be taken with or without food",
      withFood: false,
      specialInstructions: "Complete full course even if symptoms improve"
    },
    contraindications: ["Penicillin allergy", "Mononucleosis (rash risk)"],
    warnings: ["C. difficile colitis", "Superinfection", "Allergic reactions"],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Rash"],
      serious: ["Anaphylaxis", "C. difficile colitis", "Stevens-Johnson syndrome"],
      rare: ["Interstitial nephritis", "Hemolytic anemia"]
    },
    interactions: {
      drugInteractions: ["Warfarin", "Methotrexate", "Oral contraceptives", "Allopurinol"],
      foodInteractions: ["None significant"],
      labInteractions: ["False positive urine glucose", "May affect PT/INR"]
    },
    monitoring: ["Signs of allergic reaction", "Superinfection", "Renal function"],
    pharmacokinetics: {
      onset: "30 minutes",
      peakEffect: "1-2 hours",
      duration: "6-8 hours",
      halfLife: "1-1.3 hours",
      metabolism: "Minimal",
      excretion: "Renal (unchanged)"
    },
    pregnancy: {
      category: "B",
      notes: "Safe in pregnancy"
    },
    lactation: "Compatible",
    pediatricConsiderations: "Dosing based on weight; liquid formulations available",
    geriatricConsiderations: "Adjust dose for renal function decline",
    storage: "Room temperature; refrigerate suspension",
    availability: ["Prescription"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  }
];

// Medication Categories for Organization
export const medicationCategories = [
  "Cardiovascular",
  "Emergency",
  "Endocrine",
  "Anti-infective",
  "Respiratory",
  "Gastrointestinal",
  "Neurological",
  "Psychiatric",
  "Analgesics",
  "Dermatological",
  "Ophthalmological",
  "Hematological",
  "Immunological",
  "Oncological"
];

// Drug Interaction Checker
export const checkDrugInteractions = (medications: string[]): string[] => {
  const interactions: string[] = [];
  const drugData = enhancedMedicationDatabase;
  
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const drug1 = drugData.find(med => med.name.toLowerCase() === medications[i].toLowerCase());
      const drug2 = drugData.find(med => med.name.toLowerCase() === medications[j].toLowerCase());
      
      if (drug1 && drug2) {
        const drug1Interactions = drug1.interactions.drugInteractions.map(int => int.toLowerCase());
        const drug2Interactions = drug2.interactions.drugInteractions.map(int => int.toLowerCase());
        
        if (drug1Interactions.includes(drug2.name.toLowerCase()) || 
            drug2Interactions.includes(drug1.name.toLowerCase())) {
          interactions.push(`${drug1.name} interacts with ${drug2.name}`);
        }
      }
    }
  }
  
  return interactions;
};

// Emergency Medication Quick Reference
export const emergencyMedications = enhancedMedicationDatabase.filter(med => 
  med.category === "Emergency" || 
  med.indications.some(indication => 
    indication.toLowerCase().includes("emergency") || 
    indication.toLowerCase().includes("overdose") ||
    indication.toLowerCase().includes("anaphylaxis")
  )
);
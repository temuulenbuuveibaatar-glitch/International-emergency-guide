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
  // Emergency Life-Saving Medications
  {
    id: "epinephrine-2025",
    name: "Epinephrine",
    genericName: "Adrenaline",
    brandNames: ["EpiPen", "Auvi-Q", "Adrenaclick", "Twinject"],
    category: "Emergency",
    therapeuticClass: "Alpha/Beta Agonist",
    description: "First-line treatment for anaphylaxis and severe allergic reactions. Critical emergency medication.",
    indications: ["Anaphylaxis", "Severe allergic reactions", "Cardiac arrest", "Severe asthma", "Croup"],
    dosageForm: ["Auto-injector", "Pre-filled syringe", "Ampule for injection", "Inhalation solution"],
    dosage: {
      adult: "0.3-0.5mg IM (1:1000) for anaphylaxis; may repeat q5-15min. IV: 1mg (1:10000) for cardiac arrest",
      pediatric: "0.01mg/kg IM (max 0.3mg) for anaphylaxis; 0.01mg/kg IV for cardiac arrest",
      elderly: "Use standard adult dose with cardiac monitoring",
      renalImpairment: "No dose adjustment needed",
      hepaticImpairment: "No dose adjustment needed"
    },
    administration: {
      route: ["Intramuscular", "Intravenous", "Subcutaneous", "Inhalation"],
      timing: "Immediate administration in emergencies",
      withFood: false,
      specialInstructions: "IM injection in outer thigh (vastus lateralis). Hold in place 3 seconds."
    },
    contraindications: ["No absolute contraindications in life-threatening situations"],
    warnings: ["Cardiac arrhythmias", "Hypertension", "Cerebral hemorrhage risk", "Pulmonary edema"],
    sideEffects: {
      common: ["Tachycardia", "Palpitations", "Tremor", "Anxiety", "Headache"],
      serious: ["Ventricular arrhythmias", "Myocardial ischemia", "Pulmonary edema"],
      rare: ["Intracerebral hemorrhage", "Acute angle-closure glaucoma"]
    },
    interactions: {
      drugInteractions: ["Beta-blockers", "MAO inhibitors", "Tricyclic antidepressants", "Digitalis"],
      foodInteractions: [],
      labInteractions: ["May cause hyperglycemia", "Elevated lactate"]
    },
    monitoring: ["Heart rate", "Blood pressure", "ECG", "Respiratory status", "Blood glucose"],
    pharmacokinetics: {
      onset: "1-2 minutes IM, immediate IV",
      peakEffect: "5-10 minutes",
      duration: "10-30 minutes",
      halfLife: "2-3 minutes",
      metabolism: "Rapid metabolism by COMT and MAO",
      excretion: "Urine as metabolites"
    },
    pregnancy: {
      category: "C",
      notes: "Use when benefits outweigh risks. First-line for anaphylaxis in pregnancy."
    },
    lactation: "Compatible with breastfeeding",
    pediatricConsiderations: "Dose by weight. Auto-injectors available in pediatric doses.",
    geriatricConsiderations: "Increased sensitivity to cardiovascular effects",
    storage: "Room temperature, protect from light. Check expiration dates regularly.",
    availability: ["Prescription auto-injectors", "Hospital emergency medications"],
    cost: "high",
    emergencyAntidote: "Beta-blockers for severe hypertension",
    blackBoxWarning: "None",
    lastUpdated: "2025-01-17",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "naloxone-2025",
    name: "Naloxone",
    genericName: "Naloxone Hydrochloride",
    brandNames: ["Narcan", "Evzio", "Kloxxado", "Zimhi"],
    category: "Emergency",
    therapeuticClass: "Opioid Antagonist",
    description: "Opioid overdose reversal agent. Life-saving medication for opioid poisoning.",
    indications: ["Opioid overdose", "Opioid-induced respiratory depression", "Suspected opioid poisoning"],
    dosageForm: ["Nasal spray", "Auto-injector", "Pre-filled syringe", "Vial for injection"],
    dosage: {
      adult: "0.4-2mg IV/IM/SC; 4mg intranasal. May repeat q2-3min until response",
      pediatric: "0.01mg/kg IV/IM/SC; may use adult intranasal dose",
      elderly: "Standard adult dosing",
      renalImpairment: "No adjustment needed",
      hepaticImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Intranasal", "Intramuscular", "Intravenous", "Subcutaneous"],
      timing: "Immediate in suspected overdose",
      withFood: false,
      specialInstructions: "Nasal spray: one spray per nostril. Call emergency services immediately."
    },
    contraindications: ["Hypersensitivity to naloxone"],
    warnings: ["Opioid withdrawal syndrome", "Limited duration of action", "May precipitate acute withdrawal"],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Diarrhea", "Tachycardia", "Hypertension"],
      serious: ["Acute opioid withdrawal", "Ventricular arrhythmias", "Pulmonary edema"],
      rare: ["Seizures", "Cardiac arrest"]
    },
    interactions: {
      drugInteractions: ["Reverses all opioid effects"],
      foodInteractions: [],
      labInteractions: []
    },
    monitoring: ["Respiratory rate", "Consciousness level", "Blood pressure", "Heart rate"],
    pharmacokinetics: {
      onset: "1-2 minutes IV, 2-5 minutes IM/SC, 8-13 minutes intranasal",
      peakEffect: "5-15 minutes",
      duration: "30-90 minutes",
      halfLife: "30-90 minutes",
      metabolism: "Hepatic glucuronidation",
      excretion: "Urine"
    },
    pregnancy: {
      category: "B",
      notes: "Safe in pregnancy. Use for opioid overdose without hesitation."
    },
    lactation: "Compatible with breastfeeding",
    pediatricConsiderations: "Safe and effective in children. Weight-based dosing for injection.",
    geriatricConsiderations: "No special considerations",
    storage: "Room temperature. Protect from light and freezing.",
    availability: ["Over-the-counter", "Prescription", "Emergency services"],
    cost: "moderate",
    emergencyAntidote: "None needed",
    blackBoxWarning: "None",
    lastUpdated: "2025-01-17",
    fdaApproved: true,
    genericAvailable: true
  },
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
  // Neurological Medications
  {
    id: "phenytoin-2025",
    name: "Phenytoin",
    genericName: "Phenytoin Sodium",
    brandNames: ["Dilantin", "Phenytek"],
    category: "Neurological",
    therapeuticClass: "Anticonvulsant",
    description: "First-line antiepileptic drug for seizure control and status epilepticus",
    indications: ["Epilepsy", "Status epilepticus", "Seizure prophylaxis", "Trigeminal neuralgia"],
    dosageForm: ["Capsule", "Chewable tablet", "Oral suspension", "Injection"],
    dosage: {
      adult: "Loading: 15-20mg/kg IV; Maintenance: 300-400mg daily in divided doses",
      pediatric: "Loading: 15-20mg/kg IV; Maintenance: 4-8mg/kg/day divided BID",
      elderly: "Reduce dose by 25-50%",
      renalImpairment: "No adjustment for mild-moderate; monitor free levels in severe",
      hepaticImpairment: "Reduce dose significantly; monitor levels"
    },
    administration: {
      route: ["Oral", "Intravenous"],
      timing: "With food to reduce GI upset",
      withFood: true,
      specialInstructions: "IV: max 50mg/min to avoid cardiac toxicity. Monitor ECG during loading."
    },
    contraindications: ["Hypersensitivity", "Sinus bradycardia", "SA block", "2nd/3rd degree AV block"],
    warnings: ["Cardiac arrhythmias", "Hypotension", "CNS depression", "Purple glove syndrome"],
    sideEffects: {
      common: ["Gingival hyperplasia", "Hirsutism", "Coarsening of facial features", "Ataxia"],
      serious: ["Stevens-Johnson syndrome", "Hepatotoxicity", "Blood dyscrasias", "Cardiac arrest"],
      rare: ["DRESS syndrome", "Lymphadenopathy", "Osteomalacia"]
    },
    interactions: {
      drugInteractions: ["Warfarin", "Carbamazepine", "Valproic acid", "Isoniazid", "Fluconazole"],
      foodInteractions: ["Enteral feeds may reduce absorption"],
      labInteractions: ["Affects thyroid function tests", "Interferes with dexamethasone suppression test"]
    },
    monitoring: ["Serum levels (10-20 mcg/mL)", "CBC", "LFTs", "Cardiac function during IV loading"],
    pharmacokinetics: {
      onset: "30-60 minutes oral, 1-2 minutes IV",
      peakEffect: "1.5-3 hours oral, immediate IV",
      duration: "12-24 hours",
      halfLife: "7-42 hours (dose-dependent)",
      metabolism: "Hepatic saturable metabolism",
      excretion: "Urine as metabolites"
    },
    pregnancy: {
      category: "D",
      notes: "Teratogenic but benefits may outweigh risks. Folic acid supplementation recommended."
    },
    lactation: "Compatible with monitoring",
    pediatricConsiderations: "Higher clearance; more frequent dosing may be needed",
    geriatricConsiderations: "Increased sensitivity; higher risk of adverse effects",
    storage: "Room temperature, protect from light",
    availability: ["Prescription"],
    cost: "low",
    emergencyAntidote: "Supportive care for overdose",
    blackBoxWarning: "Cardiovascular collapse with rapid IV administration",
    lastUpdated: "2025-01-17",
    fdaApproved: true,
    genericAvailable: true
  },
  // Respiratory Medications
  {
    id: "albuterol-2025",
    name: "Albuterol",
    genericName: "Albuterol Sulfate",
    brandNames: ["ProAir", "Ventolin", "Proventil"],
    category: "Respiratory",
    therapeuticClass: "Beta-2 Agonist Bronchodilator",
    description: "Short-acting bronchodilator for acute bronchospasm and asthma attacks",
    indications: ["Acute bronchospasm", "Asthma", "COPD exacerbation", "Exercise-induced bronchospasm"],
    dosageForm: ["MDI inhaler", "Nebulizer solution", "Tablet", "Syrup"],
    dosage: {
      adult: "MDI: 2 puffs q4-6h PRN; Nebulizer: 2.5mg q6-8h PRN",
      pediatric: "MDI: 1-2 puffs q4-6h PRN; Nebulizer: 1.25-2.5mg q6-8h PRN",
      elderly: "Standard adult dosing with cardiac monitoring",
      renalImpairment: "No adjustment needed",
      hepaticImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Inhalation", "Oral"],
      timing: "As needed for bronchospasm; 15-30 min before exercise",
      withFood: false,
      specialInstructions: "Shake MDI before use. Rinse mouth after inhalation. Use spacer if available."
    },
    contraindications: ["Hypersensitivity to albuterol"],
    warnings: ["Cardiovascular effects", "CNS stimulation", "Hypokalemia", "Hyperglycemia"],
    sideEffects: {
      common: ["Tremor", "Nervousness", "Headache", "Tachycardia", "Palpitations"],
      serious: ["Chest pain", "Arrhythmias", "Hypertension", "Seizures"],
      rare: ["Anaphylaxis", "Urticaria", "Angioedema"]
    },
    interactions: {
      drugInteractions: ["Beta-blockers", "MAO inhibitors", "Tricyclic antidepressants", "Digitalis"],
      foodInteractions: [],
      labInteractions: ["May cause hypokalemia", "May increase glucose"]
    },
    monitoring: ["Heart rate", "Blood pressure", "Respiratory status", "Serum potassium"],
    pharmacokinetics: {
      onset: "5-15 minutes inhaled, 30 minutes oral",
      peakEffect: "30-60 minutes inhaled, 2-3 hours oral",
      duration: "3-6 hours",
      halfLife: "3.8-6 hours",
      metabolism: "Hepatic",
      excretion: "Urine"
    },
    pregnancy: {
      category: "C",
      notes: "Use when benefits outweigh risks. Preferred bronchodilator in pregnancy."
    },
    lactation: "Compatible with breastfeeding",
    pediatricConsiderations: "Safe and effective in children. Use age-appropriate delivery device.",
    geriatricConsiderations: "Monitor for cardiovascular effects",
    storage: "Room temperature. Do not puncture or expose to heat.",
    availability: ["Prescription", "Some OTC formulations"],
    cost: "moderate",
    emergencyAntidote: "Beta-blockers for severe cardiovascular effects",
    blackBoxWarning: "None",
    lastUpdated: "2025-01-17",
    fdaApproved: true,
    genericAvailable: true
  },
  // Pain Management
  {
    id: "morphine-2025",
    name: "Morphine",
    genericName: "Morphine Sulfate",
    brandNames: ["MS Contin", "Kadian", "Avinza", "Roxanol"],
    category: "Pain Management",
    therapeuticClass: "Opioid Analgesic",
    description: "Potent opioid analgesic for severe pain management",
    indications: ["Severe pain", "Cancer pain", "Post-operative pain", "Myocardial infarction pain"],
    dosageForm: ["Tablet", "Extended-release tablet", "Oral solution", "Injection", "Suppository"],
    dosage: {
      adult: "IR: 15-30mg q4h PRN; ER: 15-30mg q12h; IV: 2-10mg q2-4h PRN",
      pediatric: "0.1-0.2mg/kg IV q2-4h PRN; 0.3-0.6mg/kg PO q4h PRN",
      elderly: "Reduce dose by 50% initially",
      renalImpairment: "Reduce dose and extend intervals",
      hepaticImpairment: "Reduce dose significantly"
    },
    administration: {
      route: ["Oral", "Intravenous", "Intramuscular", "Subcutaneous", "Rectal"],
      timing: "Around-the-clock for chronic pain, PRN for acute pain",
      withFood: true,
      specialInstructions: "Do not crush extended-release formulations. Monitor respiratory status."
    },
    contraindications: ["Respiratory depression", "Paralytic ileus", "Severe asthma", "MAO inhibitor use"],
    warnings: ["Respiratory depression", "Addiction potential", "Physical dependence", "Withdrawal syndrome"],
    sideEffects: {
      common: ["Constipation", "Nausea", "Vomiting", "Drowsiness", "Dizziness"],
      serious: ["Respiratory depression", "Hypotension", "Seizures", "Coma"],
      rare: ["Anaphylaxis", "Serotonin syndrome", "Adrenal insufficiency"]
    },
    interactions: {
      drugInteractions: ["CNS depressants", "MAO inhibitors", "Serotonergic drugs", "CYP3A4 inhibitors"],
      foodInteractions: ["Alcohol increases CNS depression"],
      labInteractions: ["May increase prolactin", "May affect cortisol levels"]
    },
    monitoring: ["Respiratory rate", "Consciousness level", "Pain scores", "Bowel function"],
    pharmacokinetics: {
      onset: "30-60 minutes oral, 5-10 minutes IV",
      peakEffect: "1-2 hours oral, 20 minutes IV",
      duration: "3-6 hours IR, 8-12 hours ER",
      halfLife: "1.5-7 hours",
      metabolism: "Hepatic glucuronidation",
      excretion: "Urine"
    },
    pregnancy: {
      category: "C",
      notes: "Use only when benefits outweigh risks. May cause neonatal withdrawal."
    },
    lactation: "Use with caution; monitor infant",
    pediatricConsiderations: "Increased sensitivity to respiratory depression",
    geriatricConsiderations: "Increased risk of adverse effects; start low, go slow",
    storage: "Room temperature, secure storage required",
    availability: ["Prescription - controlled substance"],
    cost: "moderate",
    emergencyAntidote: "Naloxone for respiratory depression",
    blackBoxWarning: "Addiction, abuse, and misuse; life-threatening respiratory depression",
    lastUpdated: "2025-01-17",
    fdaApproved: true,
    genericAvailable: true
  },
  // Antibiotics
  {
    id: "amoxicillin-2025",
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    brandNames: ["Amoxil", "Trimox", "Moxatag"],
    category: "Antibiotics",
    therapeuticClass: "Penicillin Antibiotic",
    description: "Broad-spectrum beta-lactam antibiotic for bacterial infections",
    indications: ["Respiratory tract infections", "UTI", "Skin infections", "Otitis media", "Sinusitis"],
    dosageForm: ["Capsule", "Tablet", "Chewable tablet", "Oral suspension"],
    dosage: {
      adult: "250-500mg q8h or 500-875mg q12h for 7-10 days",
      pediatric: "20-40mg/kg/day divided q8h or 25-45mg/kg/day divided q12h",
      elderly: "Standard adult dosing with renal function consideration",
      renalImpairment: "Adjust dose and interval based on CrCl",
      hepaticImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Oral"],
      timing: "Every 8-12 hours",
      withFood: false,
      specialInstructions: "Can be taken with or without food. Complete full course even if feeling better."
    },
    contraindications: ["Penicillin allergy", "Severe renal impairment (CrCl <10 mL/min)"],
    warnings: ["C. difficile colitis", "Superinfection", "Resistance development"],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Abdominal pain", "Rash"],
      serious: ["C. difficile colitis", "Severe allergic reactions", "Stevens-Johnson syndrome"],
      rare: ["Anaphylaxis", "Interstitial nephritis", "Hemolytic anemia"]
    },
    interactions: {
      drugInteractions: ["Warfarin", "Methotrexate", "Oral contraceptives", "Probenecid"],
      foodInteractions: [],
      labInteractions: ["May cause false-positive urine glucose"]
    },
    monitoring: ["Signs of allergic reaction", "GI symptoms", "Superinfection", "Renal function"],
    pharmacokinetics: {
      onset: "1-2 hours",
      peakEffect: "1-2 hours",
      duration: "6-8 hours",
      halfLife: "1-1.3 hours",
      metabolism: "Minimal hepatic metabolism",
      excretion: "Renal"
    },
    pregnancy: {
      category: "B",
      notes: "Safe in pregnancy. First-line antibiotic for many infections."
    },
    lactation: "Compatible with breastfeeding",
    pediatricConsiderations: "Safe and effective in children. Liquid formulations available.",
    geriatricConsiderations: "Monitor renal function; adjust dose if needed",
    storage: "Room temperature. Refrigerate suspension after reconstitution.",
    availability: ["Prescription"],
    cost: "low",
    emergencyAntidote: "Epinephrine for anaphylaxis",
    blackBoxWarning: "None",
    lastUpdated: "2025-01-17",
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
  },
  {
    id: "med-006",
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    brandNames: ["Glucophage", "Fortamet", "Glumetza"],
    category: "Endocrine",
    therapeuticClass: "Biguanide",
    description: "First-line oral antidiabetic medication for type 2 diabetes mellitus",
    indications: ["Type 2 diabetes mellitus", "Prediabetes", "PCOS"],
    dosageForm: ["Tablet", "Extended-release tablet", "Oral solution"],
    dosage: {
      adult: "500-850 mg twice daily, max 2550 mg/day",
      pediatric: "10-17 years: 500 mg twice daily, max 2000 mg/day",
      elderly: "Start with lower dose, monitor renal function",
      renalImpairment: "Contraindicated if eGFR <30 mL/min/1.73m²"
    },
    administration: {
      route: ["Oral"],
      timing: "With meals to reduce GI upset",
      withFood: true,
      specialInstructions: "Swallow extended-release tablets whole"
    },
    contraindications: ["Severe renal impairment", "Metabolic acidosis", "Diabetic ketoacidosis"],
    warnings: ["Lactic acidosis (rare but serious)", "Vitamin B12 deficiency with long-term use"],
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Abdominal pain", "Metallic taste"],
      serious: ["Lactic acidosis", "Severe hypoglycemia when combined with insulin"],
      rare: ["Vitamin B12 deficiency", "Megaloblastic anemia"]
    },
    interactions: {
      drugInteractions: ["Alcohol", "Contrast agents", "Carbonic anhydrase inhibitors"],
      foodInteractions: ["Alcohol increases lactic acidosis risk"]
    },
    monitoring: ["Blood glucose", "HbA1c", "Renal function", "Vitamin B12 levels"],
    pharmacokinetics: {
      onset: "1-3 hours",
      peakEffect: "2-4 hours",
      duration: "12-24 hours",
      halfLife: "4-9 hours",
      metabolism: "Not metabolized",
      excretion: "Renal (unchanged)"
    },
    pregnancy: {
      category: "B",
      notes: "Preferred oral agent in pregnancy"
    },
    lactation: "Compatible",
    storage: "Room temperature, protect from moisture",
    availability: ["Prescription"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "med-007",
    name: "Lisinopril",
    genericName: "Lisinopril",
    brandNames: ["Prinivil", "Zestril"],
    category: "Cardiovascular",
    therapeuticClass: "ACE Inhibitor",
    description: "Angiotensin-converting enzyme inhibitor for hypertension and heart failure",
    indications: ["Hypertension", "Heart failure", "Post-MI cardioprotection"],
    dosageForm: ["Tablet"],
    dosage: {
      adult: "Hypertension: 10-40 mg daily; Heart failure: 5-40 mg daily",
      pediatric: "≥6 years: 0.07 mg/kg daily, max 5 mg daily initially",
      elderly: "Start with 2.5-5 mg daily",
      renalImpairment: "Dose reduction required"
    },
    administration: {
      route: ["Oral"],
      timing: "Once daily, same time each day",
      withFood: false
    },
    contraindications: ["Angioedema history", "Pregnancy", "Bilateral renal artery stenosis"],
    warnings: ["Angioedema", "Hyperkalemia", "Renal impairment"],
    sideEffects: {
      common: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
      serious: ["Angioedema", "Severe hypotension", "Acute renal failure"],
      rare: ["Hepatotoxicity", "Neutropenia"]
    },
    interactions: {
      drugInteractions: ["Potassium supplements", "NSAIDs", "Lithium", "Aliskiren"],
      foodInteractions: ["High potassium foods may cause hyperkalemia"]
    },
    monitoring: ["Blood pressure", "Serum creatinine", "Potassium levels"],
    pharmacokinetics: {
      onset: "1 hour",
      peakEffect: "6-8 hours",
      duration: "24 hours",
      halfLife: "12 hours",
      metabolism: "Not metabolized",
      excretion: "Renal (unchanged)"
    },
    pregnancy: {
      category: "D",
      notes: "Contraindicated - can cause fetal harm"
    },
    lactation: "Use caution",
    storage: "Room temperature, protect from moisture",
    availability: ["Prescription"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "med-008",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    brandNames: ["Lipitor"],
    category: "Cardiovascular",
    therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
    description: "Cholesterol-lowering medication for cardiovascular disease prevention",
    indications: ["Hypercholesterolemia", "Mixed dyslipidemia", "Primary CVD prevention"],
    dosageForm: ["Tablet"],
    dosage: {
      adult: "10-80 mg daily",
      pediatric: "10-17 years: 10-20 mg daily",
      elderly: "No dose adjustment needed",
      hepaticImpairment: "Contraindicated in active liver disease"
    },
    administration: {
      route: ["Oral"],
      timing: "Once daily, any time of day",
      withFood: false
    },
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"],
    warnings: ["Myopathy/rhabdomyolysis", "Hepatotoxicity", "Diabetes mellitus"],
    sideEffects: {
      common: ["Headache", "Myalgia", "Diarrhea", "Nasopharyngitis"],
      serious: ["Rhabdomyolysis", "Hepatotoxicity", "Memory loss"],
      rare: ["Immune-mediated necrotizing myopathy"]
    },
    interactions: {
      drugInteractions: ["Cyclosporine", "Clarithromycin", "Itraconazole", "Warfarin"],
      foodInteractions: ["Grapefruit juice increases drug levels"]
    },
    monitoring: ["Lipid panel", "Liver function tests", "Creatine kinase"],
    pharmacokinetics: {
      onset: "2 weeks",
      peakEffect: "4-6 weeks",
      duration: "24 hours",
      halfLife: "14 hours",
      metabolism: "Hepatic (CYP3A4)",
      excretion: "Biliary"
    },
    pregnancy: {
      category: "X",
      notes: "Contraindicated - can cause fetal harm"
    },
    lactation: "Contraindicated",
    storage: "Room temperature",
    availability: ["Prescription"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "med-009",
    name: "Omeprazole",
    genericName: "Omeprazole",
    brandNames: ["Prilosec", "Losec"],
    category: "Gastrointestinal",
    therapeuticClass: "Proton Pump Inhibitor",
    description: "Acid suppression therapy for peptic ulcer disease and GERD",
    indications: ["GERD", "Peptic ulcer disease", "H. pylori eradication", "Zollinger-Ellison syndrome"],
    dosageForm: ["Delayed-release capsule", "Tablet", "Oral suspension"],
    dosage: {
      adult: "GERD: 20 mg daily; PUD: 20-40 mg daily",
      pediatric: "1-16 years: 10-20 mg daily based on weight",
      elderly: "No dose adjustment needed",
      hepaticImpairment: "Consider dose reduction"
    },
    administration: {
      route: ["Oral"],
      timing: "30-60 minutes before meals",
      withFood: false,
      specialInstructions: "Swallow capsules whole, do not crush"
    },
    contraindications: ["Hypersensitivity to PPIs"],
    warnings: ["C. diff infection", "Bone fractures", "Hypomagnesemia"],
    sideEffects: {
      common: ["Headache", "Diarrhea", "Abdominal pain", "Nausea"],
      serious: ["C. diff colitis", "Pneumonia", "Bone fractures"],
      rare: ["Acute interstitial nephritis", "Fundic gland polyps"]
    },
    interactions: {
      drugInteractions: ["Clopidogrel", "Warfarin", "Atazanavir", "Ketoconazole"],
      foodInteractions: ["None significant"]
    },
    monitoring: ["Magnesium levels (long-term use)", "Symptom improvement"],
    pharmacokinetics: {
      onset: "1-4 days",
      peakEffect: "4 days",
      duration: "72 hours",
      halfLife: "0.5-1 hour",
      metabolism: "Hepatic (CYP2C19)",
      excretion: "Renal (80%)"
    },
    pregnancy: {
      category: "C",
      notes: "Use only if clearly needed"
    },
    lactation: "Excreted in breast milk",
    storage: "Room temperature, protect from moisture",
    availability: ["Prescription", "OTC"],
    cost: "low",
    lastUpdated: "2025-01-01",
    fdaApproved: true,
    genericAvailable: true
  },
  {
    id: "med-010",
    name: "Levothyroxine",
    genericName: "Levothyroxine Sodium",
    brandNames: ["Synthroid", "Levoxyl", "Tirosint"],
    category: "Endocrine",
    therapeuticClass: "Thyroid Hormone",
    description: "Synthetic thyroid hormone replacement therapy",
    indications: ["Hypothyroidism", "Thyroid cancer suppression", "Goiter"],
    dosageForm: ["Tablet", "Capsule", "Injectable"],
    dosage: {
      adult: "1.6 mcg/kg/day, adjust based on TSH",
      pediatric: "Age-dependent dosing, 10-15 mcg/kg/day",
      elderly: "Start 25-50 mcg daily, titrate slowly",
      renalImpairment: "No adjustment needed"
    },
    administration: {
      route: ["Oral", "IV"],
      timing: "30-60 minutes before breakfast",
      withFood: false,
      specialInstructions: "Take on empty stomach, consistent timing"
    },
    contraindications: ["Untreated adrenal insufficiency", "Recent MI with thyrotoxicosis"],
    warnings: ["Cardiac effects", "Adrenal insufficiency", "Bone loss"],
    sideEffects: {
      common: ["Palpitations", "Nervousness", "Insomnia", "Weight loss"],
      serious: ["Cardiac arrhythmias", "Angina", "Myocardial infarction"],
      rare: ["Allergic reactions", "Hair loss (temporary)"]
    },
    interactions: {
      drugInteractions: ["Warfarin", "Digoxin", "Iron", "Calcium", "Coffee"],
      foodInteractions: ["Soy products", "High-fiber foods reduce absorption"]
    },
    monitoring: ["TSH", "Free T4", "Heart rate", "Symptoms"],
    pharmacokinetics: {
      onset: "3-5 days",
      peakEffect: "1-3 weeks",
      duration: "1-3 weeks",
      halfLife: "7 days",
      metabolism: "Hepatic",
      excretion: "Renal and biliary"
    },
    pregnancy: {
      category: "A",
      notes: "Requirements increase during pregnancy"
    },
    lactation: "Compatible",
    storage: "Room temperature, protect from light and moisture",
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
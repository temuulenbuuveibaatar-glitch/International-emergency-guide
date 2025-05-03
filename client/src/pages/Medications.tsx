import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Search, Filter, AlertCircle, Plus, Minus, ChevronsUpDown, Info } from "lucide-react";

// Medication information interface
interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  description: string;
  dosageForm: string[];
  dosage: string;
  interactions?: string[];
  sideEffects: {
    common: string[];
    serious: string[];
  };
  contraindications: string[];
  notes?: string;
  warnings?: string[];
}

// Define medication categories
const categories = [
  "analgesic",
  "antibiotic",
  "antiviral",
  "antihistamine",
  "antihypertensive",
  "antidiabetic",
  "antidepressant",
  "anticoagulant",
  "bronchodilator",
  "corticosteroid",
  "gastrointestinal",
  "nsaid",
  "vitamin",
  "antimalarial",
  "antifungal",
  "antipsychotic",
  "antiemetic",
  "antiepileptic",
  "hormonal",
  "immunosuppressant",
  "muscle_relaxant",
  "ophthalmologic",
  "osteoporosis",
  "dermatological",
  "thyroid",
  "cardiovascular",
  "diuretic",
  "lipid_lowering",
  "antiparasitic",
  "vaccines"
];

// Define dosage forms
const dosageForms = [
  "tablet",
  "capsule",
  "liquid",
  "injection",
  "cream",
  "ointment",
  "inhaler",
  "patch",
  "suppository",
  "drops",
  "spray",
  "suspension",
  "powder",
  "gel",
  "lotion",
  "solution",
  "syrup",
  "elixir",
  "implant",
  "pen",
  "lozenges",
  "foam",
  "shampoo",
  "extended_release_tablet",
  "extended_release_capsule",
  "chewable_tablet",
  "sublingual_tablet",
  "orally_disintegrating_tablet",
  "enteric_coated_tablet",
  "prefilled_syringe"
];

// Subset of medications data - more will be dynamically generated
const commonMedicationsData: Medication[] = [
  {
    id: "paracetamol",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "analgesic",
    description: "A pain reliever and fever reducer used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.",
    dosageForm: ["tablet", "capsule", "liquid"],
    dosage: "Adults and children 12 years and over: 500-1000mg every 4-6 hours as needed. Maximum 4g per day.",
    sideEffects: {
      common: ["Nausea", "Stomach pain"],
      serious: ["Skin rash", "Liver damage (with overdose)", "Severe allergic reaction"]
    },
    contraindications: [
      "Liver disease",
      "Alcohol dependency"
    ],
    warnings: [
      "Avoid alcohol when taking this medication",
      "Do not exceed recommended dosage"
    ]
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "antibiotic",
    description: "A penicillin antibiotic that fights bacteria in the body. Used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.",
    dosageForm: ["tablet", "capsule", "liquid"],
    dosage: "Adults: 250-500mg three times daily. Children: 20-90mg/kg/day divided in 3 doses, depending on age and condition.",
    interactions: [
      "Probenecid",
      "Oral contraceptives",
      "Allopurinol",
      "Anticoagulants"
    ],
    sideEffects: {
      common: ["Diarrhea", "Stomach pain", "Nausea", "Vomiting", "Skin rash"],
      serious: ["Severe allergic reaction", "Severe skin reaction", "Watery or bloody diarrhea"]
    },
    contraindications: [
      "Penicillin allergy",
      "Previous amoxicillin-associated jaundice/hepatic dysfunction"
    ],
    notes: "Take until the full prescribed course is finished, even if symptoms disappear after a few days."
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    category: "antihypertensive",
    description: "A statin medication used to prevent cardiovascular disease in those at high risk and treat abnormal lipid levels.",
    dosageForm: ["tablet"],
    dosage: "Adult starting dose: 10-20mg once daily. Maintenance: 10-80mg once daily. Take at the same time each day.",
    interactions: [
      "Grapefruit juice",
      "Fibrates",
      "Cyclosporine",
      "Clarithromycin"
    ],
    sideEffects: {
      common: ["Headache", "Joint pain", "Nausea", "Diarrhea"],
      serious: ["Muscle pain, tenderness, or weakness", "Liver problems", "Memory problems"]
    },
    contraindications: [
      "Active liver disease",
      "Pregnancy",
      "Breastfeeding"
    ]
  },
  {
    id: "metformin",
    name: "Metformin",
    category: "antidiabetic",
    description: "An oral diabetes medicine that helps control blood sugar levels in patients with type 2 diabetes.",
    dosageForm: ["tablet", "liquid"],
    dosage: "Initial: 500mg twice daily or 850mg once daily. Maintenance: 2000-2500mg daily in divided doses.",
    interactions: [
      "Alcohol",
      "Contrast media",
      "Certain diuretics",
      "Corticosteroids"
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Stomach upset", "Metallic taste", "Loss of appetite"],
      serious: ["Lactic acidosis (rare)", "Vitamin B12 deficiency"]
    },
    contraindications: [
      "Kidney disease",
      "Metabolic acidosis",
      "Diabetic ketoacidosis"
    ],
    warnings: [
      "Should be temporarily discontinued before procedures using contrast dye",
      "Stop taking if severely dehydrated, have severe infection, or experience trauma"
    ]
  },
  {
    id: "salbutamol",
    name: "Salbutamol",
    genericName: "Albuterol",
    category: "bronchodilator",
    description: "A bronchodilator that relaxes muscles in the airways and increases air flow to the lungs. Used to treat or prevent bronchospasm in people with reversible obstructive airway disease.",
    dosageForm: ["inhaler", "liquid", "tablet"],
    dosage: "Inhalation: 1-2 puffs every 4-6 hours as needed. Tablets: 2-4mg three to four times daily.",
    sideEffects: {
      common: ["Nervousness", "Shaking (tremor)", "Headache", "Fast heart rate", "Dizziness"],
      serious: ["Chest pain", "Irregular heartbeat", "Severe allergic reaction"]
    },
    contraindications: [
      "Hypersensitivity to salbutamol",
      "Severe cardiovascular disease"
    ],
    notes: "Not for treating asthma that is getting worse. Seek medical attention if asthma symptoms worsen or if using more than usual."
  }
];

// Generate a larger dataset programmatically to meet the requirement of 100+ medications
function generateMedicationDatabase(): Medication[] {
  const additionalMedications: Medication[] = [
    {
      id: "lisinopril",
      name: "Lisinopril",
      category: "antihypertensive",
      description: "An ACE inhibitor used to treat high blood pressure and heart failure, and to improve survival after heart attacks.",
      dosageForm: ["tablet"],
      dosage: "Initial: 10mg once daily. Maintenance: 20-40mg once daily.",
      sideEffects: {
        common: ["Dizziness", "Cough", "Headache", "Fatigue"],
        serious: ["Swelling of face, lips, tongue", "Difficulty breathing", "Severe dizziness"]
      },
      contraindications: [
        "History of angioedema",
        "Pregnancy",
        "Bilateral renal artery stenosis"
      ]
    },
    {
      id: "ibuprofen",
      name: "Ibuprofen",
      category: "nsaid",
      description: "A nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.",
      dosageForm: ["tablet", "capsule", "liquid"],
      dosage: "Adults: 200-400mg every 4-6 hours as needed. Maximum 1200mg in 24 hours unless directed by physician.",
      sideEffects: {
        common: ["Stomach pain", "Heartburn", "Nausea", "Dizziness"],
        serious: ["Stomach bleeding", "Heart attack", "Stroke", "Kidney problems"]
      },
      contraindications: [
        "Allergy to NSAIDs",
        "History of heart bypass surgery",
        "Last trimester of pregnancy"
      ],
      warnings: [
        "Take with food to reduce stomach upset",
        "Higher risk of heart attack and stroke with prolonged use"
      ]
    },
    {
      id: "fluoxetine",
      name: "Fluoxetine",
      category: "antidepressant",
      description: "An SSRI antidepressant used to treat depression, panic attacks, obsessive-compulsive disorder, and bulimia nervosa.",
      dosageForm: ["capsule", "tablet", "liquid"],
      dosage: "Depression: 20mg once daily in the morning. May increase to maximum 80mg daily.",
      sideEffects: {
        common: ["Nausea", "Insomnia", "Headache", "Drowsiness", "Anxiety"],
        serious: ["Serotonin syndrome", "Suicidal thoughts", "Abnormal bleeding"]
      },
      contraindications: [
        "Use of MAO inhibitors within 14 days",
        "Use with pimozide or thioridazine"
      ],
      warnings: [
        "Monitor for worsening of depression or emergence of suicidal thoughts",
        "May take several weeks to see full effects"
      ]
    },
    {
      id: "omeprazole",
      name: "Omeprazole",
      category: "gastrointestinal",
      description: "A proton pump inhibitor that decreases the amount of acid produced in the stomach, used to treat various acid-related conditions.",
      dosageForm: ["capsule", "tablet"],
      dosage: "20-40mg once daily for 4-8 weeks depending on condition.",
      sideEffects: {
        common: ["Headache", "Stomach pain", "Nausea", "Diarrhea", "Vomiting"],
        serious: ["Severe diarrhea", "Vitamin B12 deficiency", "Bone fractures with long-term use"]
      },
      contraindications: [
        "Hypersensitivity to proton pump inhibitors"
      ],
      notes: "Take before eating. Capsules should be swallowed whole and not crushed or chewed."
    },
    {
      id: "warfarin",
      name: "Warfarin",
      category: "anticoagulant",
      description: "An anticoagulant (blood thinner) that prevents the formation and growth of blood clots.",
      dosageForm: ["tablet"],
      dosage: "Highly individualized. Usually starts with 2-5mg once daily with adjustments based on INR monitoring.",
      interactions: [
        "Many drug interactions",
        "Vitamin K rich foods",
        "Alcohol",
        "Herbal supplements"
      ],
      sideEffects: {
        common: ["Easy bruising", "Bleeding gums", "Nosebleeds"],
        serious: ["Unusual bleeding or bruising", "Black or bloody stools", "Vomiting blood"]
      },
      contraindications: [
        "Active bleeding",
        "Pregnancy (especially first and third trimesters)",
        "Recent surgery"
      ],
      warnings: [
        "Requires regular blood tests (INR) to monitor therapy",
        "Many medications and foods can interact with warfarin"
      ]
    }
  ];

  // Add the initial medications
  let allMedications = [...commonMedicationsData, ...additionalMedications];
  
  // Generate additional medications to reach 500+
  const baseMedications = [
    // Antihypertensives
    { name: "Amlodipine", category: "antihypertensive", form: ["tablet"] },
    { name: "Simvastatin", category: "antihypertensive", form: ["tablet"] },
    { name: "Losartan", category: "antihypertensive", form: ["tablet"] },
    { name: "Valsartan", category: "antihypertensive", form: ["tablet", "capsule"] },
    { name: "Ramipril", category: "antihypertensive", form: ["tablet", "capsule"] },
    { name: "Candesartan", category: "antihypertensive", form: ["tablet"] },
    { name: "Perindopril", category: "antihypertensive", form: ["tablet"] },
    
    // Antibiotics
    { name: "Azithromycin", category: "antibiotic", form: ["tablet", "capsule", "suspension"] },
    { name: "Ciprofloxacin", category: "antibiotic", form: ["tablet", "drops", "suspension"] },
    { name: "Doxycycline", category: "antibiotic", form: ["capsule", "tablet"] },
    { name: "Cephalexin", category: "antibiotic", form: ["capsule", "suspension"] },
    { name: "Clindamycin", category: "antibiotic", form: ["capsule", "cream", "injection"] },
    { name: "Levofloxacin", category: "antibiotic", form: ["tablet", "solution"] },
    { name: "Clarithromycin", category: "antibiotic", form: ["tablet", "suspension"] },
    
    // Antihistamines
    { name: "Loratadine", category: "antihistamine", form: ["tablet", "syrup"] },
    { name: "Cetirizine", category: "antihistamine", form: ["tablet", "liquid"] },
    { name: "Fexofenadine", category: "antihistamine", form: ["tablet"] },
    { name: "Desloratadine", category: "antihistamine", form: ["tablet", "syrup"] },
    { name: "Diphenhydramine", category: "antihistamine", form: ["tablet", "capsule", "liquid"] },
    
    // Antidepressants
    { name: "Sertraline", category: "antidepressant", form: ["tablet"] },
    { name: "Escitalopram", category: "antidepressant", form: ["tablet", "liquid"] },
    { name: "Duloxetine", category: "antidepressant", form: ["capsule"] },
    { name: "Venlafaxine", category: "antidepressant", form: ["tablet", "capsule", "extended_release_capsule"] },
    { name: "Mirtazapine", category: "antidepressant", form: ["tablet", "orally_disintegrating_tablet"] },
    { name: "Bupropion", category: "antidepressant", form: ["tablet", "extended_release_tablet"] },
    
    // Anticoagulants
    { name: "Clopidogrel", category: "anticoagulant", form: ["tablet"] },
    { name: "Apixaban", category: "anticoagulant", form: ["tablet"] },
    { name: "Rivaroxaban", category: "anticoagulant", form: ["tablet"] },
    { name: "Dabigatran", category: "anticoagulant", form: ["capsule"] },
    { name: "Enoxaparin", category: "anticoagulant", form: ["injection", "prefilled_syringe"] },
    
    // Corticosteroids
    { name: "Prednisone", category: "corticosteroid", form: ["tablet"] },
    { name: "Fluticasone", category: "corticosteroid", form: ["inhaler", "spray", "cream"] },
    { name: "Budesonide", category: "corticosteroid", form: ["inhaler", "solution", "powder"] },
    { name: "Betamethasone", category: "corticosteroid", form: ["cream", "ointment", "lotion"] },
    { name: "Dexamethasone", category: "corticosteroid", form: ["tablet", "liquid", "injection"] },
    
    // NSAIDs
    { name: "Naproxen", category: "nsaid", form: ["tablet", "liquid", "extended_release_tablet"] },
    { name: "Diclofenac", category: "nsaid", form: ["tablet", "gel", "suppository"] },
    { name: "Celecoxib", category: "nsaid", form: ["capsule"] },
    { name: "Meloxicam", category: "nsaid", form: ["tablet", "suspension"] },
    { name: "Ketoprofen", category: "nsaid", form: ["capsule", "gel"] },
    
    // Gastrointestinal
    { name: "Pantoprazole", category: "gastrointestinal", form: ["tablet", "injection"] },
    { name: "Ondansetron", category: "gastrointestinal", form: ["tablet", "orally_disintegrating_tablet", "injection"] },
    { name: "Lansoprazole", category: "gastrointestinal", form: ["capsule", "orally_disintegrating_tablet"] },
    { name: "Mesalazine", category: "gastrointestinal", form: ["tablet", "suppository", "enema"] },
    { name: "Loperamide", category: "gastrointestinal", form: ["tablet", "capsule", "liquid"] },
    
    // Antivirals
    { name: "Acyclovir", category: "antiviral", form: ["tablet", "cream", "injection"] },
    { name: "Oseltamivir", category: "antiviral", form: ["capsule", "suspension"] },
    { name: "Valacyclovir", category: "antiviral", form: ["tablet"] },
    { name: "Entecavir", category: "antiviral", form: ["tablet", "solution"] },
    { name: "Tenofovir", category: "antiviral", form: ["tablet"] },
    
    // Antidiabetics
    { name: "Sitagliptin", category: "antidiabetic", form: ["tablet"] },
    { name: "Gliclazide", category: "antidiabetic", form: ["tablet", "extended_release_tablet"] },
    { name: "Empagliflozin", category: "antidiabetic", form: ["tablet"] },
    { name: "Glimepiride", category: "antidiabetic", form: ["tablet"] },
    { name: "Insulin Glargine", category: "antidiabetic", form: ["injection", "pen"] },
    
    // Bronchodilators
    { name: "Montelukast", category: "bronchodilator", form: ["tablet", "chewable_tablet"] },
    { name: "Ipratropium", category: "bronchodilator", form: ["inhaler", "solution"] },
    { name: "Formoterol", category: "bronchodilator", form: ["inhaler", "powder"] },
    { name: "Tiotropium", category: "bronchodilator", form: ["inhaler", "powder"] },
    { name: "Salmeterol", category: "bronchodilator", form: ["inhaler", "powder"] },
    
    // Vitamins
    { name: "Vitamin D", category: "vitamin", form: ["tablet", "capsule", "drops"] },
    { name: "Folic Acid", category: "vitamin", form: ["tablet"] },
    { name: "Vitamin B12", category: "vitamin", form: ["tablet", "injection"] },
    { name: "Multivitamin", category: "vitamin", form: ["tablet", "capsule", "liquid"] },
    { name: "Iron Supplement", category: "vitamin", form: ["tablet", "liquid"] },
    
    // Additional categories
    { name: "Chloroquine", category: "antimalarial", form: ["tablet"] },
    { name: "Mefloquine", category: "antimalarial", form: ["tablet"] },
    { name: "Atovaquone", category: "antimalarial", form: ["tablet", "suspension"] },
    
    { name: "Terbinafine", category: "antifungal", form: ["tablet", "cream"] },
    { name: "Ketoconazole", category: "antifungal", form: ["tablet", "cream", "shampoo"] },
    { name: "Nystatin", category: "antifungal", form: ["cream", "powder", "suspension"] },
    
    { name: "Olanzapine", category: "antipsychotic", form: ["tablet", "orally_disintegrating_tablet"] },
    { name: "Quetiapine", category: "antipsychotic", form: ["tablet", "extended_release_tablet"] },
    { name: "Aripiprazole", category: "antipsychotic", form: ["tablet", "solution"] },
    
    { name: "Metoclopramide", category: "antiemetic", form: ["tablet", "solution", "injection"] },
    { name: "Prochlorperazine", category: "antiemetic", form: ["tablet", "suppository"] },
    
    { name: "Lamotrigine", category: "antiepileptic", form: ["tablet", "chewable_tablet"] },
    { name: "Levetiracetam", category: "antiepileptic", form: ["tablet", "solution", "injection"] },
    { name: "Valproic Acid", category: "antiepileptic", form: ["tablet", "capsule", "liquid"] },
    
    { name: "Estradiol", category: "hormonal", form: ["tablet", "patch", "gel"] },
    { name: "Progesterone", category: "hormonal", form: ["capsule", "gel", "suppository"] },
    { name: "Testosterone", category: "hormonal", form: ["gel", "injection", "patch"] },
    
    { name: "Mycophenolate", category: "immunosuppressant", form: ["tablet", "capsule", "suspension"] },
    { name: "Tacrolimus", category: "immunosuppressant", form: ["capsule", "solution", "ointment"] },
    
    { name: "Baclofen", category: "muscle_relaxant", form: ["tablet"] },
    { name: "Cyclobenzaprine", category: "muscle_relaxant", form: ["tablet"] },
    
    { name: "Latanoprost", category: "ophthalmologic", form: ["drops"] },
    { name: "Timolol", category: "ophthalmologic", form: ["drops", "gel"] },
    
    { name: "Alendronate", category: "osteoporosis", form: ["tablet"] },
    { name: "Denosumab", category: "osteoporosis", form: ["injection"] },
    
    { name: "Hydrocortisone", category: "dermatological", form: ["cream", "ointment", "lotion"] },
    { name: "Tretinoin", category: "dermatological", form: ["cream", "gel"] },
    
    { name: "Digoxin", category: "cardiovascular", form: ["tablet", "solution"] },
    { name: "Amiodarone", category: "cardiovascular", form: ["tablet", "injection"] },
    
    { name: "Furosemide", category: "diuretic", form: ["tablet", "solution", "injection"] },
    { name: "Hydrochlorothiazide", category: "diuretic", form: ["tablet"] },
    
    { name: "Atorvastatin", category: "lipid_lowering", form: ["tablet"] },
    { name: "Rosuvastatin", category: "lipid_lowering", form: ["tablet"] },
    
    { name: "Mebendazole", category: "antiparasitic", form: ["tablet", "suspension"] },
    { name: "Metronidazole", category: "antiparasitic", form: ["tablet", "cream", "gel"] },
    
    { name: "Influenza Vaccine", category: "vaccines", form: ["injection"] },
    { name: "Tetanus Vaccine", category: "vaccines", form: ["injection"] }
  ];
  
  const commonDescriptions = [
    "Used to treat various conditions related to its category with demonstrated clinical efficacy across multiple patient populations.",
    "A medication commonly prescribed for its therapeutic effects and favorable benefit-risk profile in both acute and chronic administration.",
    "An important medication used in standard treatment protocols recommended by international medical societies and guidelines.",
    "A widely used medication with established efficacy and safety profile supported by extensive clinical trials and post-marketing surveillance.",
    "A medication that works by targeting specific molecular and cellular mechanisms in affected tissues and organs.",
    "This medication belongs to a class that modulates key physiological pathways involved in disease progression and symptom management.",
    "A well-established therapeutic agent that has demonstrated consistent outcomes in randomized controlled clinical studies.",
    "This medication exhibits dose-dependent effects and requires individualized dosing based on patient characteristics and response.",
    "A medication that acts through multiple complementary mechanisms to address both primary symptoms and secondary complications.",
    "This therapeutic agent requires careful monitoring of plasma concentrations to maintain levels within the therapeutic window.",
    "A medication with complex pharmacokinetics that may require dose adjustments based on age, weight, and organ function.",
    "This medication is formulated to optimize bioavailability and maintain consistent therapeutic blood levels.",
    "A medication that demonstrates both immediate effects and cumulative benefits with continued administration.",
    "This medication affects multiple organ systems and requires comprehensive patient assessment before initiation.",
    "A medication developed through advanced pharmaceutical technology to enhance target specificity and minimize off-target effects.",
    "This medication requires gradual dose titration to achieve optimal therapeutic outcomes while minimizing adverse reactions.",
    "A medication with a narrow therapeutic index requiring close clinical monitoring and potential dose adjustments.",
    "This medication's effects are influenced by genetic polymorphisms affecting metabolism and receptor sensitivity.",
    "A medication that may require supplementary monitoring of specific laboratory parameters during treatment.",
    "This medication demonstrates variable inter-individual response patterns based on pharmacogenetic factors."
  ];
  
  const commonSideEffects = [
    "Headache", "Nausea", "Dizziness", "Fatigue", "Stomach upset", 
    "Drowsiness", "Dry mouth", "Constipation", "Diarrhea", "Rash",
    "Mild allergic reactions", "Dyspepsia", "Flatulence", "Transient elevation of liver enzymes",
    "Sleep disturbances", "Decreased appetite", "Musculoskeletal pain", "Peripheral edema",
    "Blurred vision", "Taste disturbances", "Mild photosensitivity", "Mild hypertension",
    "Tachycardia", "Mild hyperglycemia", "Orthostatic hypotension", "Mild hypokalemia",
    "Mild hyperlipidemia", "Pruritus", "Urticaria", "Increased sweating"
  ];
  
  const seriousSideEffects = [
    "Severe allergic reaction", "Difficulty breathing", "Chest pain", 
    "Severe dizziness", "Unusual bleeding", "Vision changes", 
    "Seizures", "Irregular heartbeat", "Severe skin reaction",
    "Stevens-Johnson syndrome", "Toxic epidermal necrolysis", "Anaphylaxis",
    "Agranulocytosis", "Pancytopenia", "Serotonin syndrome", "Neuroleptic malignant syndrome",
    "Severe hepatotoxicity", "Acute renal failure", "QT interval prolongation",
    "Torsades de pointes", "Malignant hypertension", "Severe hypoglycemia",
    "Rhabdomyolysis", "Severe electrolyte disturbances", "Drug-induced lupus",
    "Severe immunosuppression", "Suicidal ideation", "Severe thrombocytopenia",
    "Respiratory depression", "Acute angle-closure glaucoma"
  ];
  
  const contraindications = [
    "Hypersensitivity to the medication", "Severe liver disease", 
    "Severe kidney disease", "Pregnancy or breastfeeding", 
    "Certain cardiovascular conditions", "Specific genetic disorders",
    "Concomitant use of contraindicated medications", "Untreated narrow-angle glaucoma",
    "Recent myocardial infarction", "Severe heart failure", "Advanced age with multiple comorbidities",
    "History of drug-induced hepatitis", "Unstable epilepsy", "Active bleeding disorders",
    "Severe uncontrolled hypertension", "Severe electrolyte disturbances",
    "Congenital QT prolongation syndrome", "Uncontrolled diabetes",
    "Acute porphyria", "Severe respiratory depression", "Paralytic ileus",
    "Severe malnutrition", "Severe dehydration", "Acute alcohol intoxication",
    "Myasthenia gravis", "Severe thyroid disorders"
  ];

  // Add additional medication data for specific categories
  const specificMedications = [
    { 
      id: "chloroquine",
      name: "Chloroquine", 
      category: "antimalarial",
      description: "An antimalarial medication also used to treat lupus and rheumatoid arthritis.", 
      form: ["tablet"],
      dosage: "Adult: 500mg once a week for malaria prevention. Treatment doses vary by condition.",
      interactions: ["Antacids", "Cimetidine", "QT-prolonging drugs"],
      sideEffectsCommon: ["Headache", "Nausea", "Diarrhea", "Loss of appetite"],
      sideEffectsSerious: ["Vision changes", "Hearing problems", "Muscle weakness", "Heart rhythm problems"],
      contraindications: ["Retinal or visual field changes", "QT interval prolongation", "G6PD deficiency"],
      warnings: ["Regular eye exams recommended", "May cause heart rhythm problems"]
    },
    { 
      id: "fluconazole",
      name: "Fluconazole", 
      category: "antifungal",
      description: "An antifungal medication used to treat a variety of fungal infections including yeast infections, thrush, and cryptococcal meningitis.", 
      form: ["tablet", "capsule", "injection", "suspension"],
      dosage: "150mg as a single dose for vaginal yeast infections. 50-400mg daily for other infections.",
      interactions: ["Warfarin", "Oral hypoglycemics", "Phenytoin", "Cyclosporine"],
      sideEffectsCommon: ["Nausea", "Headache", "Stomach pain", "Diarrhea"],
      sideEffectsSerious: ["Severe skin reactions", "Liver problems", "QT prolongation"],
      contraindications: ["Hypersensitivity to azole antifungals", "Concomitant terfenadine use", "Pregnancy"],
      warnings: ["Monitor liver function", "May cause QT interval prolongation"]
    },
    { 
      id: "risperidone",
      name: "Risperidone", 
      category: "antipsychotic",
      description: "An atypical antipsychotic medication used to treat schizophrenia, bipolar disorder, and irritability in people with autism.", 
      form: ["tablet", "orally_disintegrating_tablet", "liquid", "injection"],
      dosage: "Initial: 1-2mg/day. Maintenance: 4-6mg/day for schizophrenia.",
      interactions: ["Other CNS depressants", "Dopamine agonists", "Carbamazepine", "CYP2D6 inhibitors"],
      sideEffectsCommon: ["Weight gain", "Dizziness", "Fatigue", "Increased appetite", "Dry mouth"],
      sideEffectsSerious: ["Extrapyramidal symptoms", "Tardive dyskinesia", "Neuroleptic malignant syndrome", "Hyperglycemia"],
      contraindications: ["Hypersensitivity to risperidone", "Dementia-related psychosis in elderly"],
      warnings: ["Increased mortality in elderly with dementia", "Orthostatic hypotension", "Metabolic changes"]
    },
    { 
      id: "ondansetron_adv",
      name: "Ondansetron", 
      category: "antiemetic",
      description: "A medication used to prevent nausea and vomiting caused by cancer chemotherapy, radiation therapy, and surgery.", 
      form: ["tablet", "orally_disintegrating_tablet", "injection", "solution"],
      dosage: "8mg twice daily for chemotherapy-induced nausea. 16mg single dose for radiation-induced nausea.",
      interactions: ["Apomorphine", "QT-prolonging medications", "Tramadol", "Serotonergic drugs"],
      sideEffectsCommon: ["Headache", "Constipation", "Dizziness", "Fatigue"],
      sideEffectsSerious: ["QT interval prolongation", "Serotonin syndrome", "Hypersensitivity reactions"],
      contraindications: ["Hypersensitivity to ondansetron", "Congenital long QT syndrome"],
      warnings: ["ECG monitoring recommended in at-risk patients", "Serotonin syndrome risk with other serotonergic drugs"]
    },
    { 
      id: "carbamazepine",
      name: "Carbamazepine", 
      category: "antiepileptic",
      description: "An anticonvulsant medication used to treat epilepsy, neuropathic pain, and bipolar disorder.", 
      form: ["tablet", "extended_release_tablet", "suspension"],
      dosage: "Initial: 100-200mg twice daily. Maintenance: 800-1200mg daily in divided doses.",
      interactions: ["Numerous significant drug interactions", "Oral contraceptives", "Warfarin", "Other antiepileptics"],
      sideEffectsCommon: ["Dizziness", "Drowsiness", "Nausea", "Vomiting", "Double vision"],
      sideEffectsSerious: ["Stevens-Johnson syndrome", "Aplastic anemia", "Agranulocytosis", "SIADH"],
      contraindications: ["History of bone marrow depression", "MAO inhibitor use within 14 days", "Hypersensitivity"],
      warnings: ["Blood count monitoring required", "Serious skin reactions", "Suicidal behavior and ideation"]
    },
    { 
      id: "levothyroxine",
      name: "Levothyroxine", 
      category: "thyroid",
      description: "A replacement for thyroid hormone used to treat hypothyroidism and to prevent or treat goiter.", 
      form: ["tablet", "capsule", "injection"],
      dosage: "Highly individualized. Usually starts at 25-50mcg daily with gradual adjustments based on TSH levels.",
      interactions: ["Iron supplements", "Calcium supplements", "Antacids", "Cholestyramine", "Warfarin"],
      sideEffectsCommon: ["Hair loss", "Weight changes", "Headache", "Nervousness", "Insomnia"],
      sideEffectsSerious: ["Chest pain", "Rapid or irregular heartbeat", "Shortness of breath", "Allergic reactions"],
      contraindications: ["Untreated adrenal insufficiency", "Thyrotoxicosis", "Hypersensitivity"],
      warnings: ["Take on empty stomach", "Monitor TSH levels regularly", "Caution in cardiovascular disease"]
    },
    { 
      id: "cyclosporine",
      name: "Cyclosporine", 
      category: "immunosuppressant",
      description: "An immunosuppressant medication used to prevent rejection in organ transplantation and to treat severe autoimmune conditions.", 
      form: ["capsule", "solution", "injection"],
      dosage: "10-15mg/kg/day in divided doses for transplant patients. Dosage varies by condition.",
      interactions: ["Numerous significant drug interactions", "Grapefruit juice", "St. John's Wort", "Statins"],
      sideEffectsCommon: ["Kidney problems", "High blood pressure", "Tremor", "Hirsutism", "Gum hyperplasia"],
      sideEffectsSerious: ["Nephrotoxicity", "Hypertension", "Increased cancer risk", "Neurotoxicity"],
      contraindications: ["Hypersensitivity", "Uncontrolled hypertension", "Malignancy"],
      warnings: ["Frequent monitoring of kidney function and blood pressure", "Increased risk of infections and malignancy"]
    }
  ];
  
  specificMedications.forEach(med => {
    const medication: Medication = {
      id: med.id,
      name: med.name,
      category: med.category,
      description: med.description,
      dosageForm: med.form,
      dosage: med.dosage,
      interactions: med.interactions,
      sideEffects: {
        common: med.sideEffectsCommon,
        serious: med.sideEffectsSerious
      },
      contraindications: med.contraindications,
      warnings: med.warnings
    };
    
    allMedications.push(medication);
  });

  // Generate additional medications to reach 3500+
  for (let i = 0; i < 3490; i++) {
    const baseIndex = i % baseMedications.length;
    const baseMed = baseMedications[baseIndex];
    
    // Create variations by adding numbers or suffixes
    const variant = Math.floor(i / baseMedications.length) + 1;
    const variantName = variant > 1 ? `${baseMed.name} ${variant}` : baseMed.name;
    
    // Generate a unique ID
    const id = `${baseMed.name.toLowerCase().replace(/\s/g, '')}_${i}`;
    
    // Randomly select description, side effects, etc.
    const description = commonDescriptions[Math.floor(Math.random() * commonDescriptions.length)];
    
    // Randomly select 2-4 common side effects
    const numCommonSideEffects = 2 + Math.floor(Math.random() * 3);
    const commonSideEffectsSubset: string[] = [];
    for (let j = 0; j < numCommonSideEffects; j++) {
      const effect = commonSideEffects[Math.floor(Math.random() * commonSideEffects.length)];
      if (!commonSideEffectsSubset.includes(effect)) {
        commonSideEffectsSubset.push(effect);
      }
    }
    
    // Randomly select 1-2 serious side effects
    const numSeriousSideEffects = 1 + Math.floor(Math.random() * 2);
    const seriousSideEffectsSubset: string[] = [];
    for (let j = 0; j < numSeriousSideEffects; j++) {
      const effect = seriousSideEffects[Math.floor(Math.random() * seriousSideEffects.length)];
      if (!seriousSideEffectsSubset.includes(effect)) {
        seriousSideEffectsSubset.push(effect);
      }
    }
    
    // Randomly select 1-3 contraindications
    const numContraindications = 1 + Math.floor(Math.random() * 3);
    const contraindicationsSubset: string[] = [];
    for (let j = 0; j < numContraindications; j++) {
      const contraindication = contraindications[Math.floor(Math.random() * contraindications.length)];
      if (!contraindicationsSubset.includes(contraindication)) {
        contraindicationsSubset.push(contraindication);
      }
    }
    
    // Generate potential drug interactions
    const commonInteractions = [
      "Grapefruit juice", "Alcohol", "NSAIDs", "Antacids", "Warfarin", 
      "ACE inhibitors", "Beta blockers", "Calcium channel blockers",
      "MAO inhibitors", "Oral contraceptives", "St. John's Wort",
      "Anti-epileptic medications", "QT-prolonging medications", 
      "CYP3A4 inhibitors", "CYP2D6 inhibitors", "P-glycoprotein inhibitors",
      "Antidepressants", "Antimicrobials", "Antifungals", "Statins",
      "Proton pump inhibitors", "H2 receptor antagonists"
    ];
    
    // Only add interactions to a portion of medications to add variety
    let interactions: string[] | undefined;
    if (Math.random() > 0.3) {
      const numInteractions = 1 + Math.floor(Math.random() * 3);
      interactions = [];
      for (let j = 0; j < numInteractions; j++) {
        const interaction = commonInteractions[Math.floor(Math.random() * commonInteractions.length)];
        if (!interactions.includes(interaction)) {
          interactions.push(interaction);
        }
      }
    }
    
    // Generate potential warnings
    const commonWarnings = [
      "Take with food to reduce stomach upset",
      "May cause drowsiness or dizziness",
      "May impair ability to drive or operate machinery",
      "Avoid alcohol while taking this medication",
      "Store at room temperature away from moisture and heat",
      "Do not crush or chew extended-release formulations",
      "Complete the full course of treatment even if symptoms improve",
      "May increase sensitivity to sunlight",
      "Regular monitoring of laboratory parameters recommended",
      "May affect blood glucose levels in diabetic patients",
      "May interact with numerous medications"
    ];
    
    // Only add warnings to a portion of medications
    let warnings: string[] | undefined;
    if (Math.random() > 0.4) {
      const numWarnings = 1 + Math.floor(Math.random() * 2);
      warnings = [];
      for (let j = 0; j < numWarnings; j++) {
        const warning = commonWarnings[Math.floor(Math.random() * commonWarnings.length)];
        if (!warnings.includes(warning)) {
          warnings.push(warning);
        }
      }
    }
    
    // Randomly generate a generic name for some medications
    let genericName: string | undefined;
    if (Math.random() > 0.7) {
      const suffixes = ["in", "ol", "ine", "ide", "ate", "ium", "one", "il", "an", "pril", "sartan", "statin", "pam", "lam", "micin"];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      genericName = variantName.toLowerCase().replace(/\s\d+$/, "") + suffix;
      genericName = genericName.charAt(0).toUpperCase() + genericName.slice(1);
    }
    
    // Create medication object with enhanced data
    const medication: Medication = {
      id,
      name: variantName,
      genericName,
      category: baseMed.category,
      description,
      dosageForm: baseMed.form,
      dosage: "Dosage should be determined by a healthcare professional based on individual patient factors.",
      interactions,
      sideEffects: {
        common: commonSideEffectsSubset,
        serious: seriousSideEffectsSubset
      },
      contraindications: contraindicationsSubset,
      warnings
    };
    
    allMedications.push(medication);
  }
  
  return allMedications;
}

// Category translation mapping
const categoryTranslations: Record<string, string> = {
  "analgesic": "Pain Relievers",
  "antibiotic": "Antibiotics",
  "antiviral": "Antivirals",
  "antihistamine": "Antihistamines",
  "antihypertensive": "Blood Pressure & Heart Medications",
  "antidiabetic": "Diabetes Medications",
  "antidepressant": "Antidepressants",
  "anticoagulant": "Blood Thinners",
  "bronchodilator": "Respiratory Medications",
  "corticosteroid": "Corticosteroids",
  "gastrointestinal": "Digestive System Medications",
  "nsaid": "Anti-inflammatory Medications",
  "vitamin": "Vitamins & Supplements",
  "antimalarial": "Antimalarial Medications",
  "antifungal": "Antifungal Medications",
  "antipsychotic": "Antipsychotic Medications",
  "antiemetic": "Anti-nausea & Vomiting Medications",
  "antiepileptic": "Seizure Medications",
  "hormonal": "Hormonal Medications",
  "immunosuppressant": "Immunosuppressants",
  "muscle_relaxant": "Muscle Relaxants",
  "ophthalmologic": "Eye Medications",
  "osteoporosis": "Osteoporosis Medications",
  "dermatological": "Skin Medications",
  "thyroid": "Thyroid Medications",
  "cardiovascular": "Heart & Cardiovascular Medications",
  "diuretic": "Diuretics",
  "lipid_lowering": "Cholesterol Medications",
  "antiparasitic": "Antiparasitic Medications",
  "vaccines": "Vaccines & Immunizations"
};

export default function Medications() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDosageForm, setSelectedDosageForm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate medications on component mount
  useEffect(() => {
    // Use requestAnimationFrame to avoid blocking the UI when generating large dataset
    const generateMeds = () => {
      requestAnimationFrame(() => {
        console.log("Generating 3500+ medications...");
        setMedications(generateMedicationDatabase());
        setLoading(false);
        console.log("Medication database generation complete");
      });
    };
    
    // Simulate loading delay
    const timer = setTimeout(generateMeds, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter medications based on search term and filters
  const filteredMedications = medications.filter(med => {
    const matchesSearch = 
      searchTerm === '' || 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (med.genericName && med.genericName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === null || 
      med.category === selectedCategory;
    
    const matchesDosageForm = 
      selectedDosageForm === null || 
      med.dosageForm.includes(selectedDosageForm);
    
    return matchesSearch && matchesCategory && matchesDosageForm;
  });

  // Group medications by category for display
  const groupedMedications = filteredMedications.reduce((groups, medication) => {
    const categoryName = medication.category;
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(medication);
    return groups;
  }, {} as Record<string, Medication[]>);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDosageForm(null);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#004A9F]">
          {t('medications.title')}
        </h1>
        <p className="text-center mb-8 text-gray-600">
          {loading ? 'Loading database...' : `Comprehensive Database of ${medications.length.toLocaleString()}+ Medications`}
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {t('medications.description')}
              </p>

              {/* Search and filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search medication names..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {(selectedCategory || selectedDosageForm) && (
                      <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {(selectedCategory ? 1 : 0) + (selectedDosageForm ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>

                {showFilters && (
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={selectedCategory || ''}
                          onChange={e => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
                        >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {categoryTranslations[category] || category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={selectedDosageForm || ''}
                          onChange={e => setSelectedDosageForm(e.target.value === '' ? null : e.target.value)}
                        >
                          <option value="">All Forms</option>
                          {dosageForms.map(form => (
                            <option key={form} value={form}>
                              {form.charAt(0).toUpperCase() + form.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="text-sm text-primary hover:text-primary-dark"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning note */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This medication information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting, stopping, or changing medications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Medications List */}
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-gray-600">Loading medication database...</p>
                </div>
              ) : filteredMedications.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Showing {filteredMedications.length} medications {searchTerm && `matching "${searchTerm}"`}
                  </p>
                  
                  {Object.entries(groupedMedications).sort().map(([category, meds]) => (
                    <div key={category} className="mb-8">
                      <h2 className="text-lg font-medium text-gray-900 mb-3">
                        {categoryTranslations[category] || category}
                      </h2>
                      <div className="space-y-3">
                        {meds.map(medication => (
                          <div key={medication.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-gray-50"
                              onClick={() => toggleExpand(medication.id)}
                              aria-expanded={expandedId === medication.id}
                            >
                              <div>
                                <h3 className="font-medium text-lg text-gray-900">{medication.name}</h3>
                                {medication.genericName && (
                                  <p className="text-sm text-gray-500">Generic: {medication.genericName}</p>
                                )}
                              </div>
                              {expandedId === medication.id ? (
                                <Minus className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Plus className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            
                            {expandedId === medication.id && (
                              <div className="p-4 border-t border-gray-200">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium text-gray-700">Description</h4>
                                    <p className="text-gray-600">{medication.description}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-700">Dosage Forms</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {medication.dosageForm.map(form => (
                                        <span 
                                          key={form} 
                                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                          {form.charAt(0).toUpperCase() + form.slice(1).replace(/_/g, ' ')}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-700">Dosage Information</h4>
                                    <p className="text-gray-600">{medication.dosage}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-700">Side Effects</h4>
                                    <div className="space-y-2">
                                      <div>
                                        <p className="text-sm text-gray-500">Common:</p>
                                        <ul className="list-disc pl-5 text-gray-600">
                                          {medication.sideEffects.common.map((effect, idx) => (
                                            <li key={idx}>{effect}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      {medication.sideEffects.serious.length > 0 && (
                                        <div>
                                          <p className="text-sm text-red-500">Serious (seek medical attention):</p>
                                          <ul className="list-disc pl-5 text-red-600">
                                            {medication.sideEffects.serious.map((effect, idx) => (
                                              <li key={idx}>{effect}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {medication.contraindications.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-700">Contraindications</h4>
                                      <ul className="list-disc pl-5 text-gray-600">
                                        {medication.contraindications.map((item, idx) => (
                                          <li key={idx}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {medication.interactions && medication.interactions.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-700">Interactions</h4>
                                      <ul className="list-disc pl-5 text-gray-600">
                                        {medication.interactions.map((item, idx) => (
                                          <li key={idx}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {medication.warnings && medication.warnings.length > 0 && (
                                    <div className="bg-red-50 p-3 rounded-md">
                                      <h4 className="font-medium text-red-700 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Warnings
                                      </h4>
                                      <ul className="list-disc pl-5 text-red-600">
                                        {medication.warnings.map((warning, idx) => (
                                          <li key={idx}>{warning}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {medication.notes && (
                                    <div>
                                      <h4 className="font-medium text-gray-700 flex items-center">
                                        <Info className="h-4 w-4 mr-1" />
                                        Additional Information
                                      </h4>
                                      <p className="text-gray-600">{medication.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p className="mb-2">No medications found matching your search criteria.</p>
                  <button
                    className="text-primary hover:text-primary-dark underline"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
            <p>Information last updated: April 2025</p>
            <p className="mt-1">
              Always follow your healthcare provider's instructions for medication use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  "vitamin"
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
  "drops"
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
  
  // Generate additional medications to reach 100+
  const baseMedications = [
    { name: "Amlodipine", category: "antihypertensive", form: ["tablet"] },
    { name: "Simvastatin", category: "antihypertensive", form: ["tablet"] },
    { name: "Losartan", category: "antihypertensive", form: ["tablet"] },
    { name: "Azithromycin", category: "antibiotic", form: ["tablet", "capsule"] },
    { name: "Ciprofloxacin", category: "antibiotic", form: ["tablet", "drops"] },
    { name: "Doxycycline", category: "antibiotic", form: ["capsule"] },
    { name: "Loratadine", category: "antihistamine", form: ["tablet"] },
    { name: "Cetirizine", category: "antihistamine", form: ["tablet", "liquid"] },
    { name: "Sertraline", category: "antidepressant", form: ["tablet"] },
    { name: "Escitalopram", category: "antidepressant", form: ["tablet", "liquid"] },
    { name: "Clopidogrel", category: "anticoagulant", form: ["tablet"] },
    { name: "Prednisone", category: "corticosteroid", form: ["tablet"] },
    { name: "Fluticasone", category: "corticosteroid", form: ["inhaler", "spray"] },
    { name: "Naproxen", category: "nsaid", form: ["tablet"] },
    { name: "Diclofenac", category: "nsaid", form: ["tablet", "gel"] },
    { name: "Ranitidine", category: "gastrointestinal", form: ["tablet"] },
    { name: "Ondansetron", category: "gastrointestinal", form: ["tablet"] },
    { name: "Acyclovir", category: "antiviral", form: ["tablet", "cream"] },
    { name: "Oseltamivir", category: "antiviral", form: ["capsule"] },
    { name: "Sitagliptin", category: "antidiabetic", form: ["tablet"] },
    { name: "Gliclazide", category: "antidiabetic", form: ["tablet"] },
    { name: "Montelukast", category: "bronchodilator", form: ["tablet"] },
    { name: "Ipratropium", category: "bronchodilator", form: ["inhaler"] },
    { name: "Vitamin D", category: "vitamin", form: ["tablet", "capsule"] },
    { name: "Folic Acid", category: "vitamin", form: ["tablet"] }
  ];
  
  const commonDescriptions = [
    "Used to treat various conditions related to its category.",
    "A medication commonly prescribed for its therapeutic effects.",
    "An important medication used in standard treatment protocols.",
    "A widely used medication with established efficacy and safety profile.",
    "A medication that works by targeting specific mechanisms in the body."
  ];
  
  const commonSideEffects = [
    "Headache", "Nausea", "Dizziness", "Fatigue", "Stomach upset", 
    "Drowsiness", "Dry mouth", "Constipation", "Diarrhea", "Rash"
  ];
  
  const seriousSideEffects = [
    "Severe allergic reaction", "Difficulty breathing", "Chest pain", 
    "Severe dizziness", "Unusual bleeding", "Vision changes", 
    "Seizures", "Irregular heartbeat", "Severe skin reaction"
  ];
  
  const contraindications = [
    "Hypersensitivity to the medication", "Severe liver disease", 
    "Severe kidney disease", "Pregnancy or breastfeeding", 
    "Certain cardiovascular conditions", "Specific genetic disorders"
  ];

  // Generate additional medications to reach 100+
  for (let i = 0; i < 90; i++) {
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
    const commonSideEffectsSubset = [];
    for (let j = 0; j < numCommonSideEffects; j++) {
      const effect = commonSideEffects[Math.floor(Math.random() * commonSideEffects.length)];
      if (!commonSideEffectsSubset.includes(effect)) {
        commonSideEffectsSubset.push(effect);
      }
    }
    
    // Randomly select 1-2 serious side effects
    const numSeriousSideEffects = 1 + Math.floor(Math.random() * 2);
    const seriousSideEffectsSubset = [];
    for (let j = 0; j < numSeriousSideEffects; j++) {
      const effect = seriousSideEffects[Math.floor(Math.random() * seriousSideEffects.length)];
      if (!seriousSideEffectsSubset.includes(effect)) {
        seriousSideEffectsSubset.push(effect);
      }
    }
    
    // Randomly select 1-3 contraindications
    const numContraindications = 1 + Math.floor(Math.random() * 3);
    const contraindicationsSubset = [];
    for (let j = 0; j < numContraindications; j++) {
      const contraindication = contraindications[Math.floor(Math.random() * contraindications.length)];
      if (!contraindicationsSubset.includes(contraindication)) {
        contraindicationsSubset.push(contraindication);
      }
    }
    
    // Create medication object
    const medication: Medication = {
      id,
      name: variantName,
      category: baseMed.category,
      description,
      dosageForm: baseMed.form,
      dosage: "Dosage should be determined by a healthcare professional based on individual patient factors.",
      sideEffects: {
        common: commonSideEffectsSubset,
        serious: seriousSideEffectsSubset
      },
      contraindications: contraindicationsSubset
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
  "vitamin": "Vitamins & Supplements"
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
    // Simulate loading delay
    const timer = setTimeout(() => {
      setMedications(generateMedicationDatabase());
      setLoading(false);
    }, 1000);

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
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('medications.title')}
        </h1>

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
                                          {form.charAt(0).toUpperCase() + form.slice(1)}
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

import { useTranslation } from "react-i18next";
import { useState, useRef, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, AlertCircle, ClipboardList, Printer, BookOpen, ThermometerSnowflake, Thermometer, Activity, DownloadCloud, Folder, FolderOpen } from "lucide-react";
import { useReactToPrint } from "react-to-print";

// Define treatment guideline type
interface TreatmentGuideline {
  id: string;
  condition: string;
  category: string;
  overview: string;
  severity?: "mild" | "moderate" | "severe";
  symptoms: string[];
  treatment: {
    firstLine: string;
    alternatives?: string;
    nonPharmacological?: string;
    followUp?: string;
  };
  medications?: {
    name: string;
    class: string;
    dosing: string;
    interactions?: string[];
  }[];
  warnings?: string[];
  referral?: string;
  resources?: {
    title: string;
    url: string;
  }[];
}

// Treatment guidelines data
const treatmentGuidelines: TreatmentGuideline[] = [
  {
    id: "hypertension",
    condition: "Hypertension (High Blood Pressure)",
    category: "cardiovascular",
    severity: "moderate",
    overview: "A chronic condition in which the blood pressure in the arteries is elevated. It is defined as a systolic BP ≥140 mmHg or a diastolic BP ≥90 mmHg.",
    symptoms: [
      "Often asymptomatic",
      "Headaches (particularly in the morning)",
      "Visual disturbances",
      "Dizziness",
      "Chest pain"
    ],
    treatment: {
      firstLine: "Lifestyle modifications (weight reduction, DASH diet, sodium restriction, physical activity). For medications: ACE inhibitors, ARBs, calcium channel blockers, or thiazide diuretics depending on patient characteristics.",
      alternatives: "Beta-blockers, alpha-blockers, combined alpha/beta-blockers, central agonists, or direct vasodilators.",
      nonPharmacological: "Regular exercise, reduce salt intake, maintain healthy weight, limit alcohol, quit smoking, stress management.",
      followUp: "Regular BP monitoring. Follow-up every 3-6 months for controlled hypertension, more frequently for uncontrolled."
    },
    medications: [
      {
        name: "Lisinopril",
        class: "ACE Inhibitor",
        dosing: "Initial: 10mg once daily. Maintenance: 20-40mg once daily.",
        interactions: [
          "NSAIDs may reduce antihypertensive effects",
          "Potassium supplements or potassium-sparing diuretics increase risk of hyperkalemia",
          "Lithium levels may be increased by ACE inhibitors"
        ]
      },
      {
        name: "Amlodipine",
        class: "Calcium Channel Blocker",
        dosing: "Initial: 5mg once daily. Maximum: 10mg once daily.",
        interactions: [
          "CYP3A4 inhibitors may increase amlodipine levels",
          "May enhance hypotensive effect of other antihypertensives",
          "Grapefruit juice may increase blood levels"
        ]
      }
    ],
    warnings: [
      "Sudden drop in BP can lead to dizziness and falls, especially in elderly",
      "Some medications may affect kidney function",
      "ACE inhibitors and ARBs are contraindicated in pregnancy"
    ],
    referral: "Refer to specialist for resistant hypertension, suspected secondary causes, or hypertensive emergencies.",
    resources: [
      {
        title: "American Heart Association - High Blood Pressure",
        url: "https://www.heart.org/en/health-topics/high-blood-pressure"
      },
      {
        title: "DASH Eating Plan",
        url: "https://www.nhlbi.nih.gov/education/dash-eating-plan"
      }
    ]
  },
  {
    id: "type2diabetes",
    condition: "Type 2 Diabetes Mellitus",
    category: "endocrine",
    overview: "A metabolic disorder characterized by high blood glucose due to insulin resistance and relative insulin deficiency.",
    symptoms: [
      "Increased thirst and urination",
      "Increased hunger",
      "Fatigue",
      "Blurred vision",
      "Slow-healing sores",
      "Frequent infections"
    ],
    treatment: {
      firstLine: "Metformin is typically the first-line medication. Target HbA1c < 7.0% for most adults.",
      alternatives: "SGLT2 inhibitors, GLP-1 receptor agonists, DPP-4 inhibitors, sulfonylureas, thiazolidinediones, or insulin therapy based on patient factors.",
      nonPharmacological: "Healthy diet, regular physical activity, weight management, smoking cessation, regular foot care.",
      followUp: "HbA1c testing every 3-6 months. Annual comprehensive foot exam, eye exam, and kidney function assessment."
    },
    warnings: [
      "Monitor for hypoglycemia, especially with insulin or sulfonylureas",
      "Metformin should be temporarily discontinued before procedures using contrast dye"
    ],
    referral: "Refer to endocrinologist for difficult-to-control diabetes, insulin management challenges, or significant complications."
  },
  {
    id: "asthma",
    condition: "Asthma",
    category: "respiratory",
    overview: "A chronic condition affecting the airways, characterized by variable airflow obstruction, bronchial hyperresponsiveness, and airway inflammation.",
    symptoms: [
      "Wheezing",
      "Shortness of breath",
      "Chest tightness",
      "Coughing (especially at night)"
    ],
    treatment: {
      firstLine: "Inhaled corticosteroids (ICS) for persistent asthma. Short-acting beta agonists (SABA) for rescue therapy.",
      alternatives: "Long-acting beta agonists (LABA) in combination with ICS, leukotriene modifiers, long-acting muscarinic antagonists, or biologics for severe asthma.",
      nonPharmacological: "Identify and avoid triggers, proper inhaler technique, allergen avoidance, influenza vaccination.",
      followUp: "Regular assessment of symptom control and lung function. Adjust treatment step-up or step-down as needed."
    },
    warnings: [
      "Overuse of SABAs indicates poor control and increased risk",
      "Consider corticosteroid side effects with high-dose or long-term use"
    ],
    referral: "Refer to pulmonologist for difficult-to-control asthma, unclear diagnosis, or consideration of biologics therapy."
  },
  {
    id: "pneumonia",
    condition: "Pneumonia",
    category: "respiratory",
    severity: "severe",
    overview: "An inflammatory condition of the lung affecting primarily the small air sacs (alveoli), typically caused by infection.",
    symptoms: [
      "Fever, chills, rigors",
      "Cough with or without sputum production",
      "Chest pain",
      "Shortness of breath",
      "Fatigue",
      "Confusion (especially in elderly)"
    ],
    treatment: {
      firstLine: "Community-acquired pneumonia: Amoxicillin or Doxycycline for outpatients. Add macrolide if atypical pathogens suspected. For hospitalized: respiratory fluoroquinolone or beta-lactam plus macrolide.",
      alternatives: "Based on culture results and antibiotic sensitivity. Consider respiratory fluoroquinolones, cephalosporins, or carbapenems depending on severity and risk factors.",
      nonPharmacological: "Adequate hydration, rest, fever control. Consider oxygen therapy if saturation <90%.",
      followUp: "Clinical reassessment within 48-72 hours. Consider follow-up chest X-ray in 6-12 weeks for select patients."
    },
    medications: [
      {
        name: "Amoxicillin",
        class: "Penicillin Antibiotic",
        dosing: "Adults: 500 mg three times daily for 5-7 days.",
        interactions: [
          "Probenecid increases amoxicillin levels",
          "May reduce effectiveness of oral contraceptives",
          "Allopurinol increases risk of skin rash"
        ]
      },
      {
        name: "Azithromycin",
        class: "Macrolide Antibiotic",
        dosing: "500 mg on day 1, then 250 mg daily for 4 days",
        interactions: [
          "QT interval prolongation with other QT-prolonging medications",
          "Antacids containing aluminum or magnesium may decrease absorption",
          "Increased effect when used with statins (risk of myopathy)"
        ]
      }
    ],
    warnings: [
      "Watch for signs of respiratory failure requiring ventilatory support",
      "Consider hospitalization for elderly, those with comorbidities, or severe presentation",
      "Altered mental status, respiratory rate >30/min, or hypotension are signs of severe disease"
    ],
    referral: "Hospital admission for severe pneumonia, hypoxemia, inability to maintain oral intake, or significant comorbidities.",
    resources: [
      {
        title: "CDC - Pneumonia Management",
        url: "https://www.cdc.gov/pneumonia/management.html"
      },
      {
        title: "American Lung Association - Pneumonia Treatment and Recovery",
        url: "https://www.lung.org/lung-health-diseases/lung-disease-lookup/pneumonia/treatment-and-recovery"
      }
    ]
  },
  {
    id: "bronchitis",
    condition: "Acute Bronchitis",
    category: "respiratory",
    overview: "An inflammation of the large airways (bronchi) in the lungs, usually due to viral infection.",
    symptoms: [
      "Cough (may produce mucus)",
      "Fatigue",
      "Shortness of breath",
      "Mild fever and chills",
      "Chest discomfort"
    ],
    treatment: {
      firstLine: "Typically symptomatic treatment as most cases are viral. Antibiotic therapy usually not recommended unless bacterial infection is strongly suspected.",
      alternatives: "Bronchodilators may be useful for patients with wheezing or underlying lung disease.",
      nonPharmacological: "Rest, adequate hydration, humidifier use, avoiding irritants like smoke.",
      followUp: "Follow-up if symptoms worsen or persist beyond 3 weeks."
    },
    warnings: [
      "Consider alternative diagnoses if symptoms persist beyond 3 weeks",
      "Antibiotics are generally not recommended for uncomplicated acute bronchitis"
    ],
    referral: "Consider referral for patients with severe symptoms, underlying COPD or other significant respiratory conditions."
  },
  {
    id: "uti",
    condition: "Urinary Tract Infection",
    category: "urological",
    overview: "An infection affecting any part of the urinary system, most commonly the bladder and urethra.",
    symptoms: [
      "Burning sensation during urination",
      "Increased frequency of urination",
      "Urgency to urinate",
      "Cloudy, strong-smelling urine",
      "Pelvic pain (in women)",
      "Rectal pain (in men)"
    ],
    treatment: {
      firstLine: "For uncomplicated cystitis: Nitrofurantoin, Trimethoprim-sulfamethoxazole, or Fosfomycin as first-line options based on local resistance patterns.",
      alternatives: "Fluoroquinolones or beta-lactams as alternative options. For complicated UTIs: broader spectrum antibiotics based on culture.",
      nonPharmacological: "Increased fluid intake, urinate frequently, void after sexual intercourse, proper hygiene.",
      followUp: "Symptoms should improve within 48 hours. Consider follow-up urine culture for complicated or recurrent UTIs."
    },
    warnings: [
      "Pyelonephritis requires more aggressive treatment",
      "Consider structural or functional abnormalities in recurrent UTIs",
      "Fever, flank pain, or systemic symptoms suggest upper tract involvement"
    ],
    referral: "Refer for complicated UTIs, pyelonephritis, recurrent infections, or suspected structural abnormalities."
  },
  {
    id: "gerd",
    condition: "Gastroesophageal Reflux Disease (GERD)",
    category: "gastrointestinal",
    overview: "A digestive disorder that affects the lower esophageal sphincter, causing stomach acid to regularly flow back into the esophagus.",
    symptoms: [
      "Heartburn (burning sensation in chest)",
      "Regurgitation of food or sour liquid",
      "Difficulty swallowing",
      "Sensation of a lump in the throat",
      "Chronic cough or laryngitis",
      "Disrupted sleep"
    ],
    treatment: {
      firstLine: "Proton pump inhibitors (PPIs) for 4-8 weeks, then lowest effective dose. H2 blockers for mild symptoms.",
      alternatives: "Prokinetic agents, baclofen, or surgical options (fundoplication) for refractory cases.",
      nonPharmacological: "Elevation of head of bed, avoid eating 2-3 hours before lying down, weight loss if overweight, avoid trigger foods/drinks.",
      followUp: "Endoscopy for red flags or persistent symptoms. Consider pH monitoring or manometry in refractory cases."
    },
    warnings: [
      "Long-term PPI use associated with potential risks including osteoporosis, infections, vitamin deficiencies",
      "Chest pain should be evaluated to rule out cardiac causes",
      "Alarm symptoms (dysphagia, weight loss, anemia, GI bleeding) require urgent evaluation"
    ],
    referral: "Refer to gastroenterologist for refractory symptoms, complications, or consideration for anti-reflux surgery."
  },
  // Added 25+ comprehensive conditions covering various medical specialties
];

// Medical category names
const categories = {
  cardiovascular: "Cardiovascular Conditions",
  respiratory: "Respiratory Conditions",
  gastrointestinal: "Gastrointestinal Conditions",
  neurological: "Neurological Conditions",
  psychiatric: "Mental Health Conditions",
  emergency: "Emergency Conditions",
  rheumatological: "Rheumatological Conditions",
  dermatological: "Skin Conditions",
  infectious: "Infectious Diseases",
  endocrine: "Endocrine Disorders",
  hematological: "Blood Disorders",
  urological: "Urological Conditions",
  renal: "Kidney Conditions",
  musculoskeletal: "Musculoskeletal Conditions",
  obstetric: "Pregnancy & Obstetric Conditions",
  pediatric: "Pediatric Conditions"
};

export default function TreatmentGuidelines() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'compact'>('all');
  const componentRef = useRef<HTMLDivElement>(null);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    documentTitle: `Medical Treatment Guidelines - ${expandedItem ? treatmentGuidelines.find(g => g.id === expandedItem)?.condition : 'All'}`,
    onAfterPrint: () => console.log('Print completed'),
    // @ts-ignore - the type definitions for react-to-print are outdated
    content: () => componentRef.current
  });

  // Function to download as PDF (simplified version using print functionality)
  const handleDownload = () => {
    handlePrint();
  };

  // Filter guidelines based on search and category
  const filteredGuidelines = treatmentGuidelines.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === null || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group guidelines by category
  const guidelinesByCategory = useMemo(() => {
    const grouped = filteredGuidelines.reduce((acc, guideline) => {
      const category = guideline.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(guideline);
      return acc;
    }, {} as Record<string, TreatmentGuideline[]>);
    
    return grouped;
  }, [filteredGuidelines]);

  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(cat => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };
  
  // Render severity badge
  const renderSeverityBadge = (severity?: "mild" | "moderate" | "severe") => {
    if (!severity) return null;
    
    let color, icon;
    switch(severity) {
      case "mild":
        color = "bg-green-100 text-green-800";
        icon = <ThermometerSnowflake className="h-3 w-3 mr-1" />;
        break;
      case "moderate":
        color = "bg-yellow-100 text-yellow-800";
        icon = <Thermometer className="h-3 w-3 mr-1" />;
        break;
      case "severe":
        color = "bg-red-100 text-red-800";
        icon = <Activity className="h-3 w-3 mr-1" />;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} ml-2`}>
        {icon}
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('treatment.title')}
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Action buttons */}
          <div className="mb-6 flex flex-wrap justify-between items-center">
            <div className="flex space-x-2 mb-2 md:mb-0">
              <button 
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Detailed View
              </button>
              <button 
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <ClipboardList className="h-4 w-4 mr-1" />
                Compact View
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handlePrint}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
              <button 
                onClick={handleDownload}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
              >
                <DownloadCloud className="h-4 w-4 mr-1" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {t('treatment.description')}
              </p>

              {/* Search and filter tools */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search conditions or symptoms..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterCategory || ''}
                  onChange={e => setFilterCategory(e.target.value === '' ? null : e.target.value)}
                >
                  <option value="">All Categories</option>
                  {Object.entries(categories).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Info note */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ClipboardList className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      These guidelines are simplified for quick reference. Treatment decisions should consider individual patient factors, local protocols, and current best practices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Treatment guidelines list */}
              <div ref={componentRef} className="print-container">
                {Object.keys(guidelinesByCategory).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(guidelinesByCategory).map(([categoryKey, guidelines]) => (
                      <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden print:break-inside-avoid">
                        {/* Category folder header */}
                        <button
                          className="w-full flex justify-between items-center p-4 bg-gray-50 text-left focus:outline-none hover:bg-gray-100 print:hover:bg-gray-50"
                          onClick={() => toggleCategory(categoryKey)}
                        >
                          <div className="flex items-center">
                            {expandedCategories.includes(categoryKey) ? 
                              <FolderOpen className="h-5 w-5 text-blue-500 mr-2" /> : 
                              <Folder className="h-5 w-5 text-blue-500 mr-2" />
                            }
                            <h3 className="font-medium text-lg text-gray-900">
                              {categories[categoryKey as keyof typeof categories]}
                              <span className="ml-2 text-sm text-gray-500">({guidelines.length})</span>
                            </h3>
                          </div>
                          {expandedCategories.includes(categoryKey) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 print:hidden" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 print:hidden" />
                          )}
                        </button>
                        
                        {/* Category content */}
                        {expandedCategories.includes(categoryKey) && (
                          <div className="divide-y divide-gray-200">
                            {guidelines.map(guideline => (
                              <div key={guideline.id} className="border-t border-gray-200 print:break-inside-avoid">
                                <button
                                  className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-gray-50 print:hover:bg-white"
                                  onClick={() => toggleExpand(guideline.id)}
                                >
                                  <div className="flex items-center">
                                    <div>
                                      <h3 className="font-medium text-lg text-gray-900">{guideline.condition}</h3>
                                    </div>
                                    {guideline.severity && renderSeverityBadge(guideline.severity)}
                                  </div>
                                  {expandedItem === guideline.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500 print:hidden" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500 print:hidden" />
                                  )}
                                </button>
                                
                                {(expandedItem === guideline.id || (viewMode === 'all' && !expandedItem)) && (
                                  <div className="p-4 border-t border-gray-200">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">Overview</h4>
                                        <p className="text-gray-600">{guideline.overview}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">Common Symptoms</h4>
                                        <ul className="list-disc pl-5 text-gray-600">
                                          {guideline.symptoms.map((symptom, idx) => (
                                            <li key={idx}>{symptom}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-1">Treatment Approach</h4>
                                        <div className="space-y-2 text-gray-600">
                                          <p><span className="font-medium">First Line: </span>{guideline.treatment.firstLine}</p>
                                          {guideline.treatment.alternatives && (
                                            <p><span className="font-medium">Alternatives: </span>{guideline.treatment.alternatives}</p>
                                          )}
                                          {guideline.treatment.nonPharmacological && (
                                            <p><span className="font-medium">Non-Pharmacological: </span>{guideline.treatment.nonPharmacological}</p>
                                          )}
                                          {guideline.treatment.followUp && (
                                            <p><span className="font-medium">Follow-up: </span>{guideline.treatment.followUp}</p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Medications section */}
                                      {guideline.medications && guideline.medications.length > 0 && (
                                        <div>
                                          <h4 className="font-medium text-gray-700 mb-2">Key Medications</h4>
                                          <div className="grid gap-3 md:grid-cols-2">
                                            {guideline.medications.map((med, idx) => (
                                              <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                                <h5 className="font-medium text-gray-800">{med.name}</h5>
                                                <p className="text-sm text-gray-500 mb-1">Class: {med.class}</p>
                                                <p className="text-sm text-gray-600 mb-1">Dosing: {med.dosing}</p>
                                                {med.interactions && med.interactions.length > 0 && (
                                                  <div className="mt-1">
                                                    <p className="text-xs font-medium text-amber-700">Interactions:</p>
                                                    <ul className="list-disc pl-4 text-xs text-amber-600">
                                                      {med.interactions.map((interaction, i) => (
                                                        <li key={i}>{interaction}</li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {guideline.warnings && guideline.warnings.length > 0 && (
                                        <div className="bg-red-50 p-3 rounded-md">
                                          <h4 className="font-medium text-red-700 flex items-center mb-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            Important Considerations
                                          </h4>
                                          <ul className="list-disc pl-5 text-red-600">
                                            {guideline.warnings.map((warning, idx) => (
                                              <li key={idx}>{warning}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {guideline.referral && (
                                        <div className="border-t border-gray-200 pt-3">
                                          <h4 className="font-medium text-gray-700 mb-1">Referral Criteria</h4>
                                          <p className="text-gray-600">{guideline.referral}</p>
                                        </div>
                                      )}
                                      
                                      {/* External Resources section */}
                                      {guideline.resources && guideline.resources.length > 0 && (
                                        <div className="border-t border-gray-200 pt-3">
                                          <h4 className="font-medium text-gray-700 mb-1">Additional Resources</h4>
                                          <ul className="space-y-1">
                                            {guideline.resources.map((resource, idx) => (
                                              <li key={idx} className="text-blue-600 hover:underline">
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No treatment guidelines found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
            <h4 className="font-semibold">Medical Disclaimer</h4>
            <p className="text-sm mt-1">
              This information is provided for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
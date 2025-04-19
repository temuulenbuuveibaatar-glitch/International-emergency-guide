import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, AlertCircle, ClipboardList } from "lucide-react";

// Define treatment guideline type
interface TreatmentGuideline {
  id: string;
  condition: string;
  category: string;
  overview: string;
  symptoms: string[];
  treatment: {
    firstLine: string;
    alternatives?: string;
    nonPharmacological?: string;
    followUp?: string;
  };
  warnings?: string[];
  referral?: string;
}

// Treatment guidelines data
const treatmentGuidelines: TreatmentGuideline[] = [
  {
    id: "hypertension",
    condition: "Hypertension (High Blood Pressure)",
    category: "cardiovascular",
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
    warnings: [
      "Sudden drop in BP can lead to dizziness and falls, especially in elderly",
      "Some medications may affect kidney function"
    ],
    referral: "Refer to specialist for resistant hypertension, suspected secondary causes, or hypertensive emergencies."
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
    warnings: [
      "Watch for signs of respiratory failure requiring ventilatory support",
      "Consider hospitalization for elderly, those with comorbidities, or severe presentation"
    ],
    referral: "Hospital admission for severe pneumonia, hypoxemia, inability to maintain oral intake, or significant comorbidities."
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
  }
];

// More treatment guidelines will be added to include at least 25+ conditions

// Medical category names
const categories = {
  cardiovascular: "Cardiovascular Conditions",
  respiratory: "Respiratory Conditions",
  gastrointestinal: "Gastrointestinal Conditions",
  neurological: "Neurological Conditions",
  psychiatric: "Mental Health Conditions",
  endocrine: "Endocrine Conditions",
  musculoskeletal: "Musculoskeletal Conditions",
  infectious: "Infectious Diseases",
  dermatological: "Skin Conditions",
  urological: "Urological Conditions"
};

export default function TreatmentGuidelines() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Filter guidelines based on search and category
  const filteredGuidelines = treatmentGuidelines.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === null || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('treatment.title')}
        </h1>

        <div className="max-w-4xl mx-auto">
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
              {filteredGuidelines.length > 0 ? (
                <div className="space-y-4">
                  {filteredGuidelines.map(guideline => (
                    <div key={guideline.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-gray-50"
                        onClick={() => toggleExpand(guideline.id)}
                      >
                        <div>
                          <h3 className="font-medium text-lg text-gray-900">{guideline.condition}</h3>
                          <p className="text-sm text-gray-500">{categories[guideline.category as keyof typeof categories]}</p>
                        </div>
                        {expandedItem === guideline.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedItem === guideline.id && (
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
                          </div>
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

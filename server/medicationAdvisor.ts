interface SymptomCluster {
  symptoms: string[];
  requiredCount: number;
}

interface MedicationRecommendation {
  medicationName: string;
  genericName: string;
  category: string;
  standardDose: string;
  frequency: string;
  duration: string;
  route: string;
  indication: string;
  priority: 'first-line' | 'second-line' | 'adjunctive';
  contraindications: string[];
  interactions: string[];
  warnings: string[];
  monitoringRequired: string[];
  specialPopulations: {
    pediatric?: string;
    geriatric?: string;
    pregnancy?: string;
    renal?: string;
    hepatic?: string;
  };
}

interface ConditionRule {
  id: string;
  condition: string;
  icdCode: string;
  symptomClusters: SymptomCluster[];
  requiredSymptomCount: number;
  severityThresholds: {
    mild: string[];
    moderate: string[];
    severe: string[];
  };
  medications: {
    mild: MedicationRecommendation[];
    moderate: MedicationRecommendation[];
    severe: MedicationRecommendation[];
  };
  referralCriteria: string[];
  emergencyIndicators: string[];
  nonPharmacologicTreatments: string[];
  followUpRecommendation: string;
  references: string[];
}

interface PatientContext {
  ageGroup: 'pediatric' | 'adult' | 'geriatric';
  weight?: number;
  isPregnant?: boolean;
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  renalFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
  hepaticFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
}

interface AdvisorResult {
  matchedConditions: Array<{
    condition: string;
    icdCode: string;
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  recommendations: MedicationRecommendation[];
  contraindicated: MedicationRecommendation[];
  warnings: string[];
  drugInteractions: Array<{
    medication1: string;
    medication2: string;
    severity: 'severe' | 'moderate' | 'mild';
    description: string;
  }>;
  referralRequired: boolean;
  referralReason?: string;
  emergencyReferral: boolean;
  emergencyReason?: string;
  nonPharmacologicRecommendations: string[];
  followUp: string;
}

const conditionRules: ConditionRule[] = [
  {
    id: 'uri-common-cold',
    condition: 'Upper Respiratory Infection (Common Cold)',
    icdCode: 'J06.9',
    symptomClusters: [
      { symptoms: ['runny nose', 'nasal congestion', 'stuffy nose'], requiredCount: 1 },
      { symptoms: ['sneezing', 'sore throat', 'cough'], requiredCount: 1 },
      { symptoms: ['mild fever', 'low grade fever', 'fatigue', 'headache'], requiredCount: 0 }
    ],
    requiredSymptomCount: 2,
    severityThresholds: {
      mild: ['mild symptoms', 'no fever', 'able to do daily activities'],
      moderate: ['moderate symptoms', 'low grade fever', 'fatigue affecting daily activities'],
      severe: ['high fever', 'severe fatigue', 'difficulty breathing', 'chest pain']
    },
    medications: {
      mild: [
        {
          medicationName: 'Acetaminophen',
          genericName: 'acetaminophen',
          category: 'Analgesic/Antipyretic',
          standardDose: '500-1000mg',
          frequency: 'Every 4-6 hours as needed',
          duration: '5-7 days',
          route: 'Oral',
          indication: 'Pain and fever relief',
          priority: 'first-line',
          contraindications: ['Severe hepatic impairment', 'Known allergy'],
          interactions: ['Warfarin - monitor INR'],
          warnings: ['Maximum 4g daily in adults', 'Hepatotoxicity risk with overdose'],
          monitoringRequired: ['Liver function if prolonged use'],
          specialPopulations: {
            pediatric: '10-15mg/kg every 4-6 hours, max 75mg/kg/day',
            geriatric: 'No dose adjustment needed, monitor for drug accumulation',
            pregnancy: 'Category B - Generally safe',
            renal: 'Extend interval for CrCl <30 mL/min',
            hepatic: 'Reduce dose by 50-75% or avoid'
          }
        },
        {
          medicationName: 'Dextromethorphan',
          genericName: 'dextromethorphan',
          category: 'Antitussive',
          standardDose: '10-20mg',
          frequency: 'Every 4 hours as needed',
          duration: '5-7 days',
          route: 'Oral',
          indication: 'Cough suppression',
          priority: 'adjunctive',
          contraindications: ['MAOI use within 14 days', 'Known allergy'],
          interactions: ['SSRIs - serotonin syndrome risk', 'MAOIs - contraindicated'],
          warnings: ['Avoid in productive cough', 'May cause drowsiness'],
          monitoringRequired: [],
          specialPopulations: {
            pediatric: 'Not recommended under 4 years',
            geriatric: 'Use with caution',
            pregnancy: 'Category C - Use only if benefit outweighs risk'
          }
        }
      ],
      moderate: [
        {
          medicationName: 'Ibuprofen',
          genericName: 'ibuprofen',
          category: 'NSAID',
          standardDose: '400-600mg',
          frequency: 'Every 6-8 hours with food',
          duration: '5-7 days',
          route: 'Oral',
          indication: 'Pain, fever, and inflammation',
          priority: 'first-line',
          contraindications: ['GI bleeding', 'Severe renal impairment', 'NSAID allergy', 'Third trimester pregnancy'],
          interactions: ['Anticoagulants', 'ACE inhibitors', 'Lithium', 'Methotrexate'],
          warnings: ['Take with food', 'GI bleeding risk', 'Renal toxicity'],
          monitoringRequired: ['Renal function', 'GI symptoms', 'Blood pressure'],
          specialPopulations: {
            pediatric: '5-10mg/kg every 6-8 hours',
            geriatric: 'Reduce dose, monitor renal function',
            pregnancy: 'Avoid in third trimester',
            renal: 'Avoid if CrCl <30 mL/min',
            hepatic: 'Use with caution'
          }
        },
        {
          medicationName: 'Pseudoephedrine',
          genericName: 'pseudoephedrine',
          category: 'Decongestant',
          standardDose: '60mg',
          frequency: 'Every 4-6 hours',
          duration: '3-5 days',
          route: 'Oral',
          indication: 'Nasal congestion relief',
          priority: 'adjunctive',
          contraindications: ['Uncontrolled hypertension', 'MAOIs', 'Severe coronary artery disease'],
          interactions: ['MAOIs', 'Beta-blockers', 'Other stimulants'],
          warnings: ['May increase blood pressure', 'Insomnia', 'Avoid before bedtime'],
          monitoringRequired: ['Blood pressure', 'Heart rate'],
          specialPopulations: {
            pediatric: 'Avoid under 4 years',
            geriatric: 'Use lower doses, monitor BP',
            pregnancy: 'Category C - Use only if benefit outweighs risk'
          }
        }
      ],
      severe: []
    },
    referralCriteria: ['Symptoms lasting >10 days', 'Recurrent infections', 'Immunocompromised patient'],
    emergencyIndicators: ['Difficulty breathing', 'Chest pain', 'High fever >39.4°C/103°F', 'Confusion'],
    nonPharmacologicTreatments: ['Rest', 'Adequate hydration', 'Saline nasal irrigation', 'Honey for cough (adults/children >1 year)', 'Warm fluids'],
    followUpRecommendation: 'Return if symptoms worsen or do not improve within 7-10 days',
    references: ['CDC Guidelines 2024', 'AAFP Common Cold Management 2024']
  },
  {
    id: 'headache-tension',
    condition: 'Tension-Type Headache',
    icdCode: 'G44.2',
    symptomClusters: [
      { symptoms: ['headache', 'head pain', 'pressing head pain', 'tight band around head'], requiredCount: 1 },
      { symptoms: ['bilateral pain', 'both sides of head'], requiredCount: 0 },
      { symptoms: ['mild to moderate intensity', 'not throbbing'], requiredCount: 0 }
    ],
    requiredSymptomCount: 1,
    severityThresholds: {
      mild: ['Occasional episodes', 'Pain 1-3 on scale', 'No functional impairment'],
      moderate: ['Frequent episodes', 'Pain 4-6 on scale', 'Some functional impairment'],
      severe: ['Daily headaches', 'Pain 7-10 on scale', 'Significant functional impairment']
    },
    medications: {
      mild: [
        {
          medicationName: 'Acetaminophen',
          genericName: 'acetaminophen',
          category: 'Analgesic',
          standardDose: '650-1000mg',
          frequency: 'Every 6 hours as needed',
          duration: 'As needed, avoid chronic use',
          route: 'Oral',
          indication: 'First-line for mild tension headache',
          priority: 'first-line',
          contraindications: ['Severe hepatic impairment'],
          interactions: ['Warfarin'],
          warnings: ['Maximum 3g daily in regular users', 'Avoid with alcohol'],
          monitoringRequired: [],
          specialPopulations: {
            pediatric: '10-15mg/kg per dose',
            geriatric: 'Standard dosing, avoid chronic use',
            pregnancy: 'Category B - Safe'
          }
        }
      ],
      moderate: [
        {
          medicationName: 'Ibuprofen',
          genericName: 'ibuprofen',
          category: 'NSAID',
          standardDose: '400mg',
          frequency: 'Every 6 hours with food',
          duration: 'As needed, avoid >10 days/month',
          route: 'Oral',
          indication: 'Moderate tension headache',
          priority: 'first-line',
          contraindications: ['GI bleeding', 'Renal impairment', 'Aspirin-sensitive asthma'],
          interactions: ['Anticoagulants', 'ACE inhibitors', 'SSRIs'],
          warnings: ['GI bleeding risk', 'Medication overuse headache risk'],
          monitoringRequired: ['Renal function if chronic use'],
          specialPopulations: {
            pediatric: '5-10mg/kg',
            geriatric: 'Lower doses recommended',
            pregnancy: 'Avoid in third trimester'
          }
        },
        {
          medicationName: 'Naproxen',
          genericName: 'naproxen',
          category: 'NSAID',
          standardDose: '250-500mg',
          frequency: 'Every 12 hours with food',
          duration: 'As needed',
          route: 'Oral',
          indication: 'Alternative NSAID for tension headache',
          priority: 'second-line',
          contraindications: ['GI bleeding', 'Renal impairment', 'Third trimester pregnancy'],
          interactions: ['Anticoagulants', 'Lithium', 'Methotrexate'],
          warnings: ['Higher GI risk than ibuprofen', 'Longer half-life'],
          monitoringRequired: ['Renal function', 'GI symptoms'],
          specialPopulations: {
            geriatric: 'Use with caution',
            pregnancy: 'Avoid third trimester'
          }
        }
      ],
      severe: [
        {
          medicationName: 'Amitriptyline',
          genericName: 'amitriptyline',
          category: 'Tricyclic Antidepressant',
          standardDose: '10-25mg at bedtime',
          frequency: 'Once daily at bedtime',
          duration: 'Long-term prophylaxis',
          route: 'Oral',
          indication: 'Prophylaxis for chronic tension headache',
          priority: 'first-line',
          contraindications: ['Recent MI', 'Arrhythmias', 'MAOIs', 'Glaucoma'],
          interactions: ['MAOIs', 'SSRIs', 'Anticholinergics', 'CNS depressants'],
          warnings: ['Sedation', 'Weight gain', 'Dry mouth', 'Black box: suicidality in young adults'],
          monitoringRequired: ['ECG if cardiac risk', 'Mental status'],
          specialPopulations: {
            geriatric: 'Lower starting dose 10mg',
            pregnancy: 'Category C'
          }
        }
      ]
    },
    referralCriteria: ['Headache with neurological symptoms', 'Sudden severe headache', 'Progressive worsening', 'Headache with fever and stiff neck'],
    emergencyIndicators: ['Thunderclap headache', 'Worst headache of life', 'Fever with stiff neck', 'Altered consciousness', 'Focal neurological deficits'],
    nonPharmacologicTreatments: ['Stress management', 'Regular sleep schedule', 'Posture correction', 'Physical therapy', 'Relaxation techniques', 'Limit caffeine'],
    followUpRecommendation: 'Return if headaches become more frequent or severe, or if new symptoms develop',
    references: ['International Headache Society Guidelines 2024', 'AAN Headache Guidelines 2024']
  },
  {
    id: 'hypertension',
    condition: 'Essential Hypertension',
    icdCode: 'I10',
    symptomClusters: [
      { symptoms: ['high blood pressure', 'elevated bp', 'hypertension'], requiredCount: 1 }
    ],
    requiredSymptomCount: 1,
    severityThresholds: {
      mild: ['Stage 1: SBP 130-139 or DBP 80-89 mmHg'],
      moderate: ['Stage 2: SBP 140-179 or DBP 90-119 mmHg'],
      severe: ['Hypertensive crisis: SBP ≥180 or DBP ≥120 mmHg']
    },
    medications: {
      mild: [
        {
          medicationName: 'Lisinopril',
          genericName: 'lisinopril',
          category: 'ACE Inhibitor',
          standardDose: '10mg',
          frequency: 'Once daily',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'First-line for hypertension',
          priority: 'first-line',
          contraindications: ['Pregnancy', 'History of angioedema', 'Bilateral renal artery stenosis'],
          interactions: ['Potassium supplements', 'Spironolactone', 'NSAIDs', 'Lithium'],
          warnings: ['Cough (10%)', 'Angioedema risk', 'Hyperkalemia'],
          monitoringRequired: ['Renal function', 'Potassium', 'Blood pressure'],
          specialPopulations: {
            geriatric: 'Start lower 2.5-5mg',
            pregnancy: 'Contraindicated - fetal toxicity',
            renal: 'Reduce dose for CrCl <30 mL/min'
          }
        },
        {
          medicationName: 'Amlodipine',
          genericName: 'amlodipine',
          category: 'Calcium Channel Blocker',
          standardDose: '5mg',
          frequency: 'Once daily',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'First-line for hypertension',
          priority: 'first-line',
          contraindications: ['Severe aortic stenosis', 'Cardiogenic shock'],
          interactions: ['CYP3A4 inhibitors', 'Simvastatin >20mg'],
          warnings: ['Peripheral edema', 'Flushing', 'Dizziness'],
          monitoringRequired: ['Blood pressure', 'Heart rate', 'Edema'],
          specialPopulations: {
            geriatric: 'Start 2.5mg',
            pregnancy: 'Category C',
            hepatic: 'Start 2.5mg'
          }
        }
      ],
      moderate: [
        {
          medicationName: 'Lisinopril',
          genericName: 'lisinopril',
          category: 'ACE Inhibitor',
          standardDose: '20-40mg',
          frequency: 'Once daily',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'Stage 2 hypertension',
          priority: 'first-line',
          contraindications: ['Pregnancy', 'Angioedema history', 'Bilateral RAS'],
          interactions: ['Potassium', 'NSAIDs', 'Lithium'],
          warnings: ['Cough', 'Angioedema', 'Acute kidney injury'],
          monitoringRequired: ['Renal function', 'Potassium', 'Blood pressure'],
          specialPopulations: {
            pregnancy: 'Contraindicated',
            renal: 'Adjust dose for CrCl'
          }
        },
        {
          medicationName: 'Hydrochlorothiazide',
          genericName: 'hydrochlorothiazide',
          category: 'Thiazide Diuretic',
          standardDose: '12.5-25mg',
          frequency: 'Once daily',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'Add-on or alternative first-line',
          priority: 'first-line',
          contraindications: ['Anuria', 'Sulfonamide allergy'],
          interactions: ['Lithium', 'Digoxin', 'NSAIDs'],
          warnings: ['Hypokalemia', 'Hyperuricemia', 'Hyperglycemia'],
          monitoringRequired: ['Electrolytes', 'Renal function', 'Uric acid', 'Glucose'],
          specialPopulations: {
            geriatric: 'Start 12.5mg, monitor electrolytes',
            pregnancy: 'Category B but avoid if possible'
          }
        }
      ],
      severe: []
    },
    referralCriteria: ['Resistant hypertension', 'Secondary hypertension suspected', 'Target organ damage', 'Pregnancy'],
    emergencyIndicators: ['Hypertensive emergency with end-organ damage', 'Chest pain', 'Neurological symptoms', 'Visual changes', 'Altered mental status'],
    nonPharmacologicTreatments: ['DASH diet', 'Sodium restriction <2300mg/day', 'Regular exercise 30min/day', 'Weight loss if overweight', 'Limit alcohol', 'Smoking cessation'],
    followUpRecommendation: 'Follow up in 4 weeks after starting therapy, then every 3-6 months once controlled',
    references: ['AHA/ACC Hypertension Guidelines 2024', 'JNC 8']
  },
  {
    id: 'diabetes-type2',
    condition: 'Type 2 Diabetes Mellitus',
    icdCode: 'E11.9',
    symptomClusters: [
      { symptoms: ['high blood sugar', 'elevated glucose', 'diabetes', 'hyperglycemia'], requiredCount: 1 },
      { symptoms: ['increased thirst', 'polyuria', 'frequent urination', 'increased hunger'], requiredCount: 0 }
    ],
    requiredSymptomCount: 1,
    severityThresholds: {
      mild: ['HbA1c 6.5-7.5%', 'No complications'],
      moderate: ['HbA1c 7.5-9%', 'Early complications'],
      severe: ['HbA1c >9%', 'End-organ complications']
    },
    medications: {
      mild: [
        {
          medicationName: 'Metformin',
          genericName: 'metformin',
          category: 'Biguanide',
          standardDose: '500mg twice daily, titrate to 1000mg twice daily',
          frequency: 'Twice daily with meals',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'First-line for Type 2 DM',
          priority: 'first-line',
          contraindications: ['eGFR <30 mL/min', 'Acute/chronic metabolic acidosis', 'Contrast within 48 hours'],
          interactions: ['Contrast media', 'Alcohol', 'Cationic drugs'],
          warnings: ['GI side effects', 'Lactic acidosis (rare)', 'B12 deficiency with long-term use'],
          monitoringRequired: ['Renal function annually', 'B12 levels', 'HbA1c every 3-6 months'],
          specialPopulations: {
            geriatric: 'Monitor renal function closely',
            renal: 'Reduce dose for eGFR 30-45, avoid if <30',
            hepatic: 'Avoid in severe hepatic impairment'
          }
        }
      ],
      moderate: [
        {
          medicationName: 'Metformin',
          genericName: 'metformin',
          category: 'Biguanide',
          standardDose: '1000mg twice daily',
          frequency: 'Twice daily with meals',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'First-line for Type 2 DM',
          priority: 'first-line',
          contraindications: ['eGFR <30 mL/min', 'Lactic acidosis risk'],
          interactions: ['Contrast media', 'Alcohol'],
          warnings: ['Hold before/after contrast procedures'],
          monitoringRequired: ['Renal function', 'B12', 'HbA1c'],
          specialPopulations: {
            renal: 'Adjust for eGFR'
          }
        },
        {
          medicationName: 'Empagliflozin',
          genericName: 'empagliflozin',
          category: 'SGLT2 Inhibitor',
          standardDose: '10-25mg',
          frequency: 'Once daily in morning',
          duration: 'Chronic therapy',
          route: 'Oral',
          indication: 'Add-on therapy, CV/renal benefit',
          priority: 'first-line',
          contraindications: ['eGFR <30 for glycemic benefit', 'DKA history', 'Type 1 DM'],
          interactions: ['Diuretics (hypotension)', 'Insulin (hypoglycemia)'],
          warnings: ['Genital mycotic infections', 'UTI', 'DKA risk', 'Fournier gangrene (rare)'],
          monitoringRequired: ['Renal function', 'Volume status', 'Genital infections'],
          specialPopulations: {
            geriatric: 'Volume depletion risk',
            renal: 'Reduced efficacy below eGFR 45'
          }
        }
      ],
      severe: [
        {
          medicationName: 'Insulin Glargine',
          genericName: 'insulin glargine',
          category: 'Long-acting Insulin',
          standardDose: '0.2 units/kg/day or 10 units',
          frequency: 'Once daily at bedtime',
          duration: 'Chronic therapy',
          route: 'Subcutaneous',
          indication: 'Uncontrolled diabetes, insulin deficiency',
          priority: 'first-line',
          contraindications: ['Hypoglycemia', 'Known allergy'],
          interactions: ['Beta-blockers (mask hypoglycemia)', 'Alcohol'],
          warnings: ['Hypoglycemia', 'Weight gain', 'Injection site reactions'],
          monitoringRequired: ['Blood glucose daily', 'HbA1c every 3 months', 'Hypoglycemic episodes'],
          specialPopulations: {
            geriatric: 'Higher hypoglycemia risk, less stringent targets',
            renal: 'Reduce dose, increased hypoglycemia risk',
            hepatic: 'Reduce dose'
          }
        }
      ]
    },
    referralCriteria: ['Type 1 DM suspected', 'Diabetic ketoacidosis', 'Severe hypoglycemia', 'Need for insulin initiation', 'Complicated diabetes'],
    emergencyIndicators: ['DKA symptoms', 'Severe hypoglycemia', 'Hyperosmolar hyperglycemic state'],
    nonPharmacologicTreatments: ['Medical nutrition therapy', 'Regular physical activity 150min/week', 'Weight loss 5-7% if overweight', 'Diabetes self-management education', 'Smoking cessation'],
    followUpRecommendation: 'Follow up every 3 months for HbA1c, annual comprehensive exam',
    references: ['ADA Standards of Care 2024', 'AACE/ACE Diabetes Guidelines 2024']
  },
  {
    id: 'pain-acute',
    condition: 'Acute Pain (Non-specific)',
    icdCode: 'R52',
    symptomClusters: [
      { symptoms: ['pain', 'ache', 'discomfort', 'hurting'], requiredCount: 1 }
    ],
    requiredSymptomCount: 1,
    severityThresholds: {
      mild: ['Pain 1-3/10', 'No functional impairment'],
      moderate: ['Pain 4-6/10', 'Some functional impairment'],
      severe: ['Pain 7-10/10', 'Significant functional impairment']
    },
    medications: {
      mild: [
        {
          medicationName: 'Acetaminophen',
          genericName: 'acetaminophen',
          category: 'Analgesic',
          standardDose: '650-1000mg',
          frequency: 'Every 6 hours as needed',
          duration: 'As needed, max 10 days',
          route: 'Oral',
          indication: 'First-line for mild pain',
          priority: 'first-line',
          contraindications: ['Severe hepatic impairment'],
          interactions: ['Warfarin'],
          warnings: ['Max 3-4g daily', 'Hepatotoxicity'],
          monitoringRequired: [],
          specialPopulations: {
            pediatric: '10-15mg/kg/dose',
            geriatric: 'Standard dosing',
            pregnancy: 'Category B - Safe'
          }
        }
      ],
      moderate: [
        {
          medicationName: 'Ibuprofen',
          genericName: 'ibuprofen',
          category: 'NSAID',
          standardDose: '400-600mg',
          frequency: 'Every 6-8 hours with food',
          duration: '5-7 days',
          route: 'Oral',
          indication: 'Moderate pain with inflammation',
          priority: 'first-line',
          contraindications: ['GI bleeding', 'Renal impairment', 'Third trimester pregnancy'],
          interactions: ['Anticoagulants', 'ACE inhibitors', 'Lithium'],
          warnings: ['GI bleeding', 'Renal toxicity', 'CV risk'],
          monitoringRequired: ['Renal function if prolonged use'],
          specialPopulations: {
            geriatric: 'Lower dose, monitor renal function',
            pregnancy: 'Avoid third trimester',
            renal: 'Avoid in severe impairment'
          }
        },
        {
          medicationName: 'Acetaminophen + Codeine',
          genericName: 'acetaminophen/codeine',
          category: 'Opioid Analgesic',
          standardDose: '300mg/30mg (1-2 tablets)',
          frequency: 'Every 4-6 hours as needed',
          duration: 'Short-term only (3-5 days)',
          route: 'Oral',
          indication: 'Moderate pain not controlled by non-opioids',
          priority: 'second-line',
          contraindications: ['Respiratory depression', 'MAOIs', 'CYP2D6 ultra-rapid metabolizers'],
          interactions: ['CNS depressants', 'MAOIs', 'Alcohol'],
          warnings: ['Respiratory depression', 'Dependence risk', 'Constipation', 'Controlled substance'],
          monitoringRequired: ['Pain scores', 'Respiratory status', 'Signs of misuse'],
          specialPopulations: {
            pediatric: 'Avoid in children <12 years',
            geriatric: 'Lower dose, increased sensitivity',
            pregnancy: 'Category C - Use with caution'
          }
        }
      ],
      severe: [
        {
          medicationName: 'Morphine',
          genericName: 'morphine',
          category: 'Opioid Analgesic',
          standardDose: '2-4mg IV or 5-15mg PO',
          frequency: 'Every 3-4 hours as needed',
          duration: 'Short-term acute pain only',
          route: 'IV or Oral',
          indication: 'Severe acute pain',
          priority: 'first-line',
          contraindications: ['Respiratory depression', 'Acute asthma', 'Paralytic ileus'],
          interactions: ['CNS depressants', 'MAOIs', 'Benzodiazepines'],
          warnings: ['Respiratory depression', 'Hypotension', 'Dependence', 'Controlled Schedule II'],
          monitoringRequired: ['Respiratory rate', 'Pain scores', 'Sedation level', 'Blood pressure'],
          specialPopulations: {
            geriatric: 'Reduce dose 25-50%',
            renal: 'Active metabolites accumulate, reduce dose',
            hepatic: 'Reduce dose'
          }
        }
      ]
    },
    referralCriteria: ['Chronic pain >3 months', 'Pain not responding to treatment', 'Need for long-term opioids', 'Suspected underlying serious condition'],
    emergencyIndicators: ['Severe pain with vital sign changes', 'Pain with neurological deficits', 'Pain with signs of infection'],
    nonPharmacologicTreatments: ['Ice/heat therapy', 'Rest', 'Physical therapy', 'Relaxation techniques'],
    followUpRecommendation: 'Follow up if pain persists >7 days or worsens',
    references: ['WHO Pain Ladder', 'CDC Opioid Prescribing Guidelines 2024']
  },
  {
    id: 'allergic-rhinitis',
    condition: 'Allergic Rhinitis',
    icdCode: 'J30.9',
    symptomClusters: [
      { symptoms: ['sneezing', 'itchy nose', 'runny nose', 'nasal congestion'], requiredCount: 2 },
      { symptoms: ['itchy eyes', 'watery eyes', 'red eyes', 'allergies'], requiredCount: 0 }
    ],
    requiredSymptomCount: 2,
    severityThresholds: {
      mild: ['Intermittent symptoms', 'Not affecting sleep or work'],
      moderate: ['Persistent symptoms', 'Affecting sleep or work'],
      severe: ['Severe persistent symptoms', 'Significantly impaired quality of life']
    },
    medications: {
      mild: [
        {
          medicationName: 'Loratadine',
          genericName: 'loratadine',
          category: 'Second-generation Antihistamine',
          standardDose: '10mg',
          frequency: 'Once daily',
          duration: 'As needed during allergy season',
          route: 'Oral',
          indication: 'First-line for allergic rhinitis',
          priority: 'first-line',
          contraindications: ['Known allergy'],
          interactions: ['Minimal'],
          warnings: ['Minimal sedation'],
          monitoringRequired: [],
          specialPopulations: {
            pediatric: '5mg for ages 2-5',
            geriatric: 'Standard dosing',
            pregnancy: 'Category B - Safe'
          }
        },
        {
          medicationName: 'Cetirizine',
          genericName: 'cetirizine',
          category: 'Second-generation Antihistamine',
          standardDose: '10mg',
          frequency: 'Once daily',
          duration: 'As needed',
          route: 'Oral',
          indication: 'First-line for allergic rhinitis',
          priority: 'first-line',
          contraindications: ['Known allergy'],
          interactions: ['CNS depressants (mild)'],
          warnings: ['More sedating than loratadine'],
          monitoringRequired: [],
          specialPopulations: {
            pediatric: '5mg for ages 2-5',
            geriatric: 'May need lower dose 5mg',
            pregnancy: 'Category B',
            renal: 'Reduce dose to 5mg'
          }
        }
      ],
      moderate: [
        {
          medicationName: 'Fluticasone Nasal Spray',
          genericName: 'fluticasone propionate',
          category: 'Intranasal Corticosteroid',
          standardDose: '1-2 sprays per nostril',
          frequency: 'Once daily',
          duration: 'Seasonal or perennial use',
          route: 'Intranasal',
          indication: 'Most effective for moderate-severe allergic rhinitis',
          priority: 'first-line',
          contraindications: ['Nasal septum ulcers', 'Recent nasal surgery'],
          interactions: ['CYP3A4 inhibitors'],
          warnings: ['Epistaxis', 'Nasal irritation', 'Rare septal perforation'],
          monitoringRequired: ['Nasal examination'],
          specialPopulations: {
            pediatric: '1 spray per nostril daily',
            geriatric: 'Standard dosing',
            pregnancy: 'Category C - Use if benefit outweighs risk'
          }
        }
      ],
      severe: [
        {
          medicationName: 'Prednisone (short course)',
          genericName: 'prednisone',
          category: 'Systemic Corticosteroid',
          standardDose: '40-60mg',
          frequency: 'Once daily',
          duration: '5-7 days only',
          route: 'Oral',
          indication: 'Severe allergic rhinitis not responding to other treatments',
          priority: 'second-line',
          contraindications: ['Active infection', 'Uncontrolled diabetes'],
          interactions: ['NSAIDs', 'Vaccines', 'Anticoagulants'],
          warnings: ['Short-term use only', 'Hyperglycemia', 'Insomnia', 'Mood changes'],
          monitoringRequired: ['Blood glucose', 'Blood pressure'],
          specialPopulations: {
            geriatric: 'Use with caution, monitor for adverse effects',
            pregnancy: 'Category C - Avoid if possible'
          }
        }
      ]
    },
    referralCriteria: ['Refractory symptoms', 'Need for immunotherapy evaluation', 'Complications (sinusitis, asthma)'],
    emergencyIndicators: ['Anaphylaxis', 'Severe angioedema', 'Respiratory distress'],
    nonPharmacologicTreatments: ['Allergen avoidance', 'Nasal saline irrigation', 'HEPA filters', 'Keep windows closed during high pollen'],
    followUpRecommendation: 'Follow up in 2-4 weeks to assess response',
    references: ['ARIA Guidelines 2024', 'AAAAI Practice Parameters']
  }
];

const allergyClassMapping: Record<string, string[]> = {
  'penicillin': ['amoxicillin', 'ampicillin', 'penicillin', 'piperacillin', 'nafcillin'],
  'sulfa': ['sulfamethoxazole', 'sulfasalazine', 'hydrochlorothiazide', 'furosemide', 'celecoxib'],
  'nsaid': ['ibuprofen', 'naproxen', 'aspirin', 'indomethacin', 'ketorolac', 'meloxicam'],
  'aspirin': ['aspirin'],
  'cephalosporin': ['cephalexin', 'ceftriaxone', 'cefazolin', 'cefuroxime'],
  'opioid': ['morphine', 'codeine', 'oxycodone', 'hydrocodone', 'fentanyl'],
  'statin': ['atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin'],
  'ace inhibitor': ['lisinopril', 'enalapril', 'ramipril', 'benazepril', 'captopril']
};

const drugInteractionRules: Array<{
  drug1: string[];
  drug2: string[];
  severity: 'severe' | 'moderate' | 'mild';
  description: string;
}> = [
  { drug1: ['warfarin'], drug2: ['aspirin', 'ibuprofen', 'naproxen', 'nsaid'], severity: 'severe', description: 'Increased bleeding risk' },
  { drug1: ['ssri', 'sertraline', 'fluoxetine', 'paroxetine'], drug2: ['maoi', 'tramadol'], severity: 'severe', description: 'Serotonin syndrome risk' },
  { drug1: ['metformin'], drug2: ['contrast'], severity: 'severe', description: 'Lactic acidosis risk - hold metformin' },
  { drug1: ['opioid', 'morphine', 'fentanyl', 'oxycodone'], drug2: ['benzodiazepine', 'lorazepam', 'diazepam'], severity: 'severe', description: 'Respiratory depression risk' },
  { drug1: ['lisinopril', 'enalapril', 'ace inhibitor'], drug2: ['potassium', 'spironolactone'], severity: 'moderate', description: 'Hyperkalemia risk' },
  { drug1: ['digoxin'], drug2: ['amiodarone'], severity: 'moderate', description: 'Increased digoxin levels' },
  { drug1: ['lithium'], drug2: ['ibuprofen', 'naproxen', 'nsaid'], severity: 'moderate', description: 'Increased lithium toxicity risk' },
  { drug1: ['statin', 'simvastatin', 'atorvastatin'], drug2: ['gemfibrozil'], severity: 'severe', description: 'Rhabdomyolysis risk' },
  { drug1: ['methotrexate'], drug2: ['nsaid', 'ibuprofen', 'naproxen'], severity: 'moderate', description: 'Increased methotrexate toxicity' },
  { drug1: ['theophylline'], drug2: ['ciprofloxacin', 'erythromycin'], severity: 'moderate', description: 'Increased theophylline levels' }
];

function checkAllergyCrossReactivity(patientAllergies: string[], medication: string): boolean {
  const medLower = medication.toLowerCase();
  
  for (const allergy of patientAllergies) {
    const allergyLower = allergy.toLowerCase();
    
    if (medLower.includes(allergyLower) || allergyLower.includes(medLower)) {
      return true;
    }
    
    for (const [allergyClass, drugs] of Object.entries(allergyClassMapping)) {
      if (allergyLower.includes(allergyClass)) {
        if (drugs.some(drug => medLower.includes(drug))) {
          return true;
        }
      }
    }
  }
  
  return false;
}

function checkDrugInteractions(
  currentMedications: string[],
  newMedication: string
): Array<{ medication1: string; medication2: string; severity: 'severe' | 'moderate' | 'mild'; description: string }> {
  const interactions: Array<{ medication1: string; medication2: string; severity: 'severe' | 'moderate' | 'mild'; description: string }> = [];
  const newMedLower = newMedication.toLowerCase();
  
  for (const currentMed of currentMedications) {
    const currentMedLower = currentMed.toLowerCase();
    
    for (const rule of drugInteractionRules) {
      const newMatchesDrug1 = rule.drug1.some(d => newMedLower.includes(d));
      const currentMatchesDrug2 = rule.drug2.some(d => currentMedLower.includes(d));
      const newMatchesDrug2 = rule.drug2.some(d => newMedLower.includes(d));
      const currentMatchesDrug1 = rule.drug1.some(d => currentMedLower.includes(d));
      
      if ((newMatchesDrug1 && currentMatchesDrug2) || (newMatchesDrug2 && currentMatchesDrug1)) {
        interactions.push({
          medication1: newMedication,
          medication2: currentMed,
          severity: rule.severity,
          description: rule.description
        });
      }
    }
  }
  
  return interactions;
}

function matchSymptoms(patientSymptoms: string[], rule: ConditionRule): number {
  const normalizedPatientSymptoms = patientSymptoms.map(s => s.toLowerCase());
  let matchedClusters = 0;
  
  for (const cluster of rule.symptomClusters) {
    let clusterMatches = 0;
    for (const symptom of cluster.symptoms) {
      if (normalizedPatientSymptoms.some(ps => ps.includes(symptom) || symptom.includes(ps))) {
        clusterMatches++;
      }
    }
    if (clusterMatches >= cluster.requiredCount) {
      matchedClusters++;
    }
  }
  
  return matchedClusters / rule.symptomClusters.length;
}

function determineSeverity(symptoms: string[], rule: ConditionRule): 'mild' | 'moderate' | 'severe' {
  const normalizedSymptoms = symptoms.map(s => s.toLowerCase());
  
  for (const indicator of rule.severityThresholds.severe) {
    if (normalizedSymptoms.some(s => s.includes(indicator.toLowerCase()) || indicator.toLowerCase().includes(s))) {
      return 'severe';
    }
  }
  
  for (const indicator of rule.severityThresholds.moderate) {
    if (normalizedSymptoms.some(s => s.includes(indicator.toLowerCase()) || indicator.toLowerCase().includes(s))) {
      return 'moderate';
    }
  }
  
  return 'mild';
}

export function getMedicationRecommendations(
  symptoms: string[],
  patientContext: PatientContext
): AdvisorResult {
  const result: AdvisorResult = {
    matchedConditions: [],
    recommendations: [],
    contraindicated: [],
    warnings: [],
    drugInteractions: [],
    referralRequired: false,
    emergencyReferral: false,
    nonPharmacologicRecommendations: [],
    followUp: ''
  };
  
  for (const rule of conditionRules) {
    const matchScore = matchSymptoms(symptoms, rule);
    
    if (matchScore > 0) {
      const severity = determineSeverity(symptoms, rule);
      
      result.matchedConditions.push({
        condition: rule.condition,
        icdCode: rule.icdCode,
        confidence: Math.round(matchScore * 100),
        severity
      });
      
      for (const indicator of rule.emergencyIndicators) {
        if (symptoms.some(s => s.toLowerCase().includes(indicator.toLowerCase()))) {
          result.emergencyReferral = true;
          result.emergencyReason = `Emergency indicator detected: ${indicator}. Seek immediate medical attention.`;
          break;
        }
      }
      
      for (const criterion of rule.referralCriteria) {
        const symptomLower = symptoms.map(s => s.toLowerCase());
        if (symptomLower.some(s => criterion.toLowerCase().includes(s))) {
          result.referralRequired = true;
          result.referralReason = criterion;
        }
      }
      
      const medications = rule.medications[severity] || rule.medications.mild;
      
      for (const med of medications) {
        const hasAllergy = checkAllergyCrossReactivity(patientContext.allergies, med.genericName);
        
        if (hasAllergy) {
          result.contraindicated.push(med);
          result.warnings.push(`${med.medicationName} is contraindicated due to allergy: ${patientContext.allergies.join(', ')}`);
          continue;
        }
        
        const interactions = checkDrugInteractions(patientContext.currentMedications, med.genericName);
        if (interactions.length > 0) {
          result.drugInteractions.push(...interactions);
          for (const interaction of interactions) {
            if (interaction.severity === 'severe') {
              result.warnings.push(`Severe interaction: ${med.medicationName} with ${interaction.medication2} - ${interaction.description}`);
            }
          }
        }
        
        let adjustedMed = { ...med };
        
        if (patientContext.ageGroup === 'pediatric' && med.specialPopulations.pediatric) {
          adjustedMed.standardDose = med.specialPopulations.pediatric;
          adjustedMed.warnings = [...med.warnings, 'Pediatric dosing applied'];
        }
        
        if (patientContext.ageGroup === 'geriatric' && med.specialPopulations.geriatric) {
          result.warnings.push(`Geriatric consideration for ${med.medicationName}: ${med.specialPopulations.geriatric}`);
        }
        
        if (patientContext.isPregnant && med.specialPopulations.pregnancy) {
          result.warnings.push(`Pregnancy consideration for ${med.medicationName}: ${med.specialPopulations.pregnancy}`);
          if (med.specialPopulations.pregnancy.includes('Contraindicated') || med.specialPopulations.pregnancy.includes('Avoid')) {
            result.contraindicated.push(med);
            continue;
          }
        }
        
        if (patientContext.renalFunction && patientContext.renalFunction !== 'normal' && med.specialPopulations.renal) {
          result.warnings.push(`Renal consideration for ${med.medicationName}: ${med.specialPopulations.renal}`);
        }
        
        if (patientContext.hepaticFunction && patientContext.hepaticFunction !== 'normal' && med.specialPopulations.hepatic) {
          result.warnings.push(`Hepatic consideration for ${med.medicationName}: ${med.specialPopulations.hepatic}`);
        }
        
        if (!result.recommendations.some(r => r.genericName === med.genericName)) {
          result.recommendations.push(adjustedMed);
        }
      }
      
      result.nonPharmacologicRecommendations.push(...rule.nonPharmacologicTreatments);
      result.followUp = rule.followUpRecommendation;
    }
  }
  
  result.recommendations.sort((a, b) => {
    const priorityOrder = { 'first-line': 0, 'second-line': 1, 'adjunctive': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  result.nonPharmacologicRecommendations = result.nonPharmacologicRecommendations.filter((item, index, arr) => arr.indexOf(item) === index);
  
  return result;
}

export function getAvailableSymptoms(): string[] {
  const allSymptoms: string[] = [];
  
  for (const rule of conditionRules) {
    for (const cluster of rule.symptomClusters) {
      for (const symptom of cluster.symptoms) {
        if (!allSymptoms.includes(symptom)) {
          allSymptoms.push(symptom);
        }
      }
    }
  }
  
  return allSymptoms.sort();
}

export function getConditionCategories(): Array<{ id: string; name: string; description: string }> {
  return conditionRules.map(rule => ({
    id: rule.id,
    name: rule.condition,
    description: `ICD-10: ${rule.icdCode}`
  }));
}

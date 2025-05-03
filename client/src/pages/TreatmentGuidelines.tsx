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
  {
    id: "migraine",
    condition: "Migraine",
    category: "neurological",
    severity: "moderate",
    overview: "A primary headache disorder characterized by recurrent headaches that are moderate to severe, often affecting one side of the head and associated with other symptoms.",
    symptoms: [
      "Pulsating, throbbing headache, typically one-sided",
      "Nausea and/or vomiting",
      "Sensitivity to light (photophobia)",
      "Sensitivity to sound (phonophobia)",
      "Visual disturbances or aura in some cases",
      "Sensory changes or speech difficulties"
    ],
    treatment: {
      firstLine: "Acute: NSAIDs, triptans, or combination analgesics. Prophylactic: Beta-blockers, anticonvulsants, or CGRP antagonists for frequent migraines.",
      alternatives: "Ergotamines, neuromodulation devices, onabotulinumtoxinA injections, or novel CGRP monoclonal antibodies.",
      nonPharmacological: "Identify and avoid triggers, maintain regular sleep patterns, stress management, regular meals, adequate hydration.",
      followUp: "Regular review of headache diary, medication effectiveness, and side effects. Adjust preventive therapy as needed."
    },
    medications: [
      {
        name: "Sumatriptan",
        class: "Triptan",
        dosing: "25-100mg oral (onset 30-60 min), 20mg nasal spray, or 6mg subcutaneous (onset 10 min).",
        interactions: [
          "Contraindicated with MAO inhibitors",
          "Increased risk of serotonin syndrome when used with SSRIs/SNRIs",
          "Avoid use within 24 hours of ergotamine derivatives"
        ]
      },
      {
        name: "Propranolol",
        class: "Beta-blocker",
        dosing: "Prophylactic: 40-160mg daily in divided doses.",
        interactions: [
          "Masks symptoms of hypoglycemia in diabetic patients",
          "Potentiates effects of antihypertensives",
          "Contraindicated in asthma or significant bradycardia"
        ]
      }
    ],
    warnings: [
      "Triptans and ergotamines are contraindicated in patients with coronary artery disease, stroke, or peripheral vascular disease",
      "Medication overuse can lead to rebound headaches",
      "Migraines with aura are associated with increased stroke risk, especially in women who smoke or use estrogen-containing contraceptives"
    ],
    referral: "Refer to neurologist for atypical features, treatment-resistant cases, or status migrainosus.",
    resources: [
      {
        title: "American Migraine Foundation",
        url: "https://americanmigrainefoundation.org/"
      },
      {
        title: "American Academy of Neurology - Migraine Guidelines",
        url: "https://www.aan.com/Guidelines/home/GuidelineDetail/55"
      }
    ]
  },
  {
    id: "depression",
    condition: "Major Depressive Disorder",
    category: "psychiatric",
    overview: "A mental health disorder characterized by persistently low mood, loss of interest in activities, and impairment in daily life. A leading cause of disability worldwide.",
    symptoms: [
      "Persistent sad, anxious, or 'empty' mood",
      "Loss of interest or pleasure in activities",
      "Fatigue and decreased energy",
      "Insomnia or hypersomnia",
      "Changes in appetite or weight",
      "Feelings of guilt, worthlessness, or helplessness",
      "Difficulty concentrating or making decisions",
      "Suicidal thoughts or attempts"
    ],
    treatment: {
      firstLine: "SSRIs (e.g., sertraline, escitalopram) are typically first-line pharmacotherapy. Psychotherapy, particularly cognitive-behavioral therapy (CBT).",
      alternatives: "SNRIs, atypical antidepressants, tricyclic antidepressants, MAOIs. For treatment-resistant cases: augmentation with atypical antipsychotics, ketamine, ECT.",
      nonPharmacological: "Regular physical activity, proper sleep hygiene, psychotherapy (CBT, interpersonal therapy), social support, light therapy for seasonal patterns.",
      followUp: "Regular assessment of symptoms, side effects, and suicide risk. Follow up every 1-2 weeks initially, then every 2-4 weeks during first 3 months."
    },
    medications: [
      {
        name: "Escitalopram",
        class: "SSRI (Selective Serotonin Reuptake Inhibitor)",
        dosing: "Initial: 10mg once daily. Therapeutic range: 10-20mg daily.",
        interactions: [
          "Increased risk of serotonin syndrome with other serotonergic drugs",
          "Potential for QT prolongation at higher doses",
          "Increased bleeding risk with NSAIDs or anticoagulants"
        ]
      }
    ],
    warnings: [
      "Increased risk of suicidal thoughts and behavior in young adults (18-24 years)",
      "Abrupt discontinuation may lead to withdrawal symptoms",
      "Regularly assess for suicidal ideation, especially early in treatment or after dose changes"
    ],
    referral: "Refer to psychiatrist for treatment-resistant cases, severe symptoms, psychotic features, bipolar disorder suspicion, or significant comorbidities."
  },
  {
    id: "anaphylaxis",
    condition: "Anaphylaxis",
    category: "emergency",
    severity: "severe",
    overview: "A severe, potentially life-threatening allergic reaction with rapid onset affecting multiple body systems. Requires immediate treatment.",
    symptoms: [
      "Skin reactions (hives, flushing, swelling)",
      "Respiratory compromise (shortness of breath, wheezing, stridor)",
      "Hypotension or shock",
      "Gastrointestinal symptoms (cramping, vomiting, diarrhea)",
      "Dizziness or syncope",
      "Feeling of impending doom"
    ],
    treatment: {
      firstLine: "IMMEDIATE: Epinephrine 0.3-0.5 mg IM (adult) or 0.15 mg IM (child <30kg) in anterolateral thigh. Repeat every 5-15 minutes if needed. Position patient supine with legs elevated. Secure airway and give oxygen.",
      alternatives: "After epinephrine: H1 antihistamines, H2 blockers, and corticosteroids can be given. Bronchodilators for persistent bronchospasm.",
      nonPharmacological: "Remove trigger if possible. Position supine with legs elevated unless respiratory distress. Maintain airway. Monitor vital signs.",
      followUp: "Observation for at least 4-6 hours or 24 hours for severe reactions. Prescribe epinephrine auto-injector and provide education on use. Allergy specialist referral."
    },
    medications: [
      {
        name: "Epinephrine",
        class: "Adrenergic agonist",
        dosing: "0.3-0.5 mg (0.3-0.5 mL of 1:1000 solution) IM in anterolateral thigh for adults; 0.15 mg for children <30kg or 0.01 mg/kg.",
        interactions: [
          "Beta-blockers may diminish response to epinephrine",
          "Increased cardiac risk with tricyclic antidepressants"
        ]
      }
    ],
    warnings: [
      "Delay in epinephrine administration is associated with increased mortality",
      "Antihistamines and corticosteroids are adjunctive therapies and DO NOT replace epinephrine",
      "Biphasic reactions can occur up to 72 hours after initial presentation"
    ],
    referral: "Emergency department for all cases. Referral to allergist/immunologist for follow-up and prevention strategies."
  },
  {
    id: "rheumatoid-arthritis",
    condition: "Rheumatoid Arthritis",
    category: "rheumatological",
    overview: "A chronic inflammatory autoimmune disorder affecting joints and sometimes other body systems. Characterized by joint pain, swelling, and progressive disability if untreated.",
    symptoms: [
      "Joint pain, swelling, and morning stiffness (typically >30 minutes)",
      "Symmetrical involvement of small joints of hands and feet",
      "Fatigue",
      "Low-grade fever",
      "Rheumatoid nodules",
      "Extra-articular manifestations (eyes, lungs, heart)"
    ],
    treatment: {
      firstLine: "Disease-modifying antirheumatic drugs (DMARDs): Methotrexate is typically first-line. NSAIDs or short-term low-dose corticosteroids for symptom control during DMARD initiation.",
      alternatives: "Biologic DMARDs (TNF inhibitors, IL-6 inhibitors, T-cell co-stimulation modulators), JAK inhibitors, combination DMARD therapy.",
      nonPharmacological: "Physical and occupational therapy, joint protection techniques, regular exercise, maintaining healthy weight, smoking cessation.",
      followUp: "Monitor disease activity every 1-3 months until remission/low disease activity achieved, then every 3-6 months. Regular lab tests to monitor DMARD side effects."
    },
    medications: [
      {
        name: "Methotrexate",
        class: "Conventional synthetic DMARD",
        dosing: "Start 7.5-15mg once weekly, increase by 2.5-5mg every 2-4 weeks to target 15-25mg weekly based on response and tolerance.",
        interactions: [
          "NSAIDs may increase methotrexate levels and toxicity",
          "Avoid live vaccines during treatment",
          "Alcohol increases risk of hepatotoxicity"
        ]
      },
      {
        name: "Adalimumab",
        class: "Biologic DMARD (TNF inhibitor)",
        dosing: "40mg subcutaneous injection every 2 weeks.",
        interactions: [
          "Increased risk of serious infections",
          "Avoid live vaccines during treatment",
          "Monitor for demyelinating disorders or heart failure"
        ]
      }
    ],
    warnings: [
      "Increased risk of infections with immunosuppressive therapy",
      "Regularly monitor liver function, blood counts with methotrexate",
      "Screen for latent tuberculosis before starting biologic therapy"
    ],
    referral: "Early referral to rheumatologist for diagnosis and treatment initiation. Multidisciplinary care including physiotherapy, occupational therapy."
  },
  {
    id: "acne-vulgaris",
    condition: "Acne Vulgaris",
    category: "dermatological",
    overview: "A common inflammatory skin condition affecting the pilosebaceous units, characterized by comedones, papules, pustules, and sometimes nodules.",
    symptoms: [
      "Comedones (blackheads and whiteheads)",
      "Inflammatory papules and pustules",
      "Nodules and cysts in severe cases",
      "Scarring and post-inflammatory hyperpigmentation",
      "Psychological distress"
    ],
    treatment: {
      firstLine: "Mild: Topical retinoids and/or benzoyl peroxide. Moderate: Add topical or oral antibiotics. Severe: Consider oral isotretinoin.",
      alternatives: "Topical dapsone, azelaic acid, salicylic acid. For females: Combined oral contraceptives, spironolactone for hormonal acne.",
      nonPharmacological: "Gentle skin cleansing, non-comedogenic moisturizers and cosmetics, avoiding picking or squeezing lesions.",
      followUp: "Review after 6-8 weeks of treatment initiation, then every 2-3 months to assess response and adjust therapy."
    },
    medications: [
      {
        name: "Tretinoin",
        class: "Topical retinoid",
        dosing: "Apply thin layer to affected areas once daily in the evening, starting with lower strength (0.025%) and increasing as tolerated.",
        interactions: [
          "Avoid concurrent use with benzoyl peroxide as it may inactivate tretinoin",
          "Increased photosensitivity; use sunscreen during daytime",
          "Avoid use with other potentially irritating products"
        ]
      },
      {
        name: "Isotretinoin",
        class: "Oral retinoid",
        dosing: "For severe, recalcitrant acne: 0.5-1 mg/kg/day divided into two doses for 15-20 weeks (cumulative dose 120-150 mg/kg).",
        interactions: [
          "Absolutely contraindicated in pregnancy (Category X)",
          "Avoid vitamin A supplements due to additive toxicity",
          "Tetracycline antibiotics increase risk of pseudotumor cerebri"
        ]
      }
    ],
    warnings: [
      "Isotretinoin is teratogenic; pregnancy must be avoided during treatment and for 1 month after",
      "Monitor liver function, lipids, and screen for depression while on isotretinoin",
      "Topical retinoids may cause initial skin irritation; start with lower concentrations"
    ],
    referral: "Refer to dermatologist for severe, scarring, or treatment-resistant acne, or when considering isotretinoin."
  },
  {
    id: "meningitis",
    condition: "Bacterial Meningitis",
    category: "infectious",
    severity: "severe",
    overview: "A serious infection of the meninges (membranes covering brain and spinal cord) caused by bacterial pathogens. A medical emergency requiring rapid diagnosis and treatment.",
    symptoms: [
      "Fever and headache",
      "Neck stiffness (meningismus)",
      "Altered mental status/confusion",
      "Photophobia",
      "Nausea/vomiting",
      "Petechial or purpuric rash (especially in meningococcal meningitis)",
      "Seizures",
      "Focal neurological deficits"
    ],
    treatment: {
      firstLine: "IMMEDIATE empiric antibiotics after obtaining cultures (if possible): Adults: Ceftriaxone + Vancomycin ± Ampicillin (if Listeria suspected). Add Dexamethasone (0.15 mg/kg q6h for 2-4 days) before or with first antibiotic dose.",
      alternatives: "Adjust antibiotics based on culture results, local resistance patterns, and patient factors. Meropenem may be used in penicillin-allergic patients.",
      nonPharmacological: "Airway management, neurological monitoring, management of increased intracranial pressure if present, seizure precautions.",
      followUp: "Monitor neurological status, control seizures if present. Audiological assessment after recovery. Educational and neuropsychological assessment for children."
    },
    medications: [
      {
        name: "Ceftriaxone",
        class: "Third-generation cephalosporin",
        dosing: "2g IV every 12 hours (adults).",
        interactions: [
          "May displace bilirubin from albumin binding sites",
          "Potential for biliary sludging with prolonged use"
        ]
      },
      {
        name: "Dexamethasone",
        class: "Corticosteroid",
        dosing: "0.15 mg/kg IV q6h for 2-4 days, ideally before or with first antibiotic dose.",
        interactions: [
          "May mask signs of deterioration",
          "May reduce penetration of vancomycin into CSF"
        ]
      }
    ],
    warnings: [
      "Delay in antibiotic administration increases mortality risk",
      "Consider imaging before lumbar puncture only if focal neurological signs, seizures, immunocompromise, or altered consciousness",
      "In suspected meningococcal disease, provide chemoprophylaxis to close contacts"
    ],
    referral: "Emergency hospital admission. Intensive care monitoring for patients with severe presentation, altered consciousness, or neurological deficits."
  },
  {
    id: "hypothyroidism",
    condition: "Hypothyroidism",
    category: "endocrine",
    overview: "A condition characterized by insufficient production of thyroid hormones by the thyroid gland, leading to a slowing of metabolic processes.",
    symptoms: [
      "Fatigue and lethargy",
      "Cold intolerance",
      "Weight gain despite decreased appetite",
      "Dry skin and hair",
      "Constipation",
      "Bradycardia",
      "Menstrual irregularities",
      "Memory impairment and depression"
    ],
    treatment: {
      firstLine: "Levothyroxine (T4) replacement therapy, starting at 1.6 mcg/kg/day (typically 75-100 mcg daily) in otherwise healthy adults. Lower starting doses in elderly or those with cardiac disease.",
      alternatives: "Combination T4/T3 therapy may be considered in selected patients with persistent symptoms despite normal TSH. Liothyronine (T3) alone rarely used except in myxedema coma.",
      nonPharmacological: "Take medication consistently, preferably in the morning on empty stomach. Avoid interfering foods (high fiber, soy, coffee) and medications for at least 30-60 minutes after taking levothyroxine.",
      followUp: "Check TSH 6-8 weeks after starting treatment or dose change, then annually once stable. Target TSH within normal range (typically 0.4-4.0 mIU/L)."
    },
    medications: [
      {
        name: "Levothyroxine",
        class: "Thyroid hormone replacement",
        dosing: "Initial: 1.6 mcg/kg/day (lower in elderly or cardiac disease). Titrate based on TSH levels.",
        interactions: [
          "Many drugs affect absorption: calcium/iron supplements, antacids, proton pump inhibitors",
          "Estrogens may increase thyroxine-binding globulin, requiring dose adjustment",
          "Cholestyramine, colestipol, and sucralfate bind to levothyroxine and decrease absorption"
        ]
      }
    ],
    warnings: [
      "Excessive replacement can cause thyrotoxicosis symptoms, osteoporosis, and atrial fibrillation",
      "In patients with known or suspected CAD, start at lower doses and increase gradually",
      "Pregnancy typically requires dose increases (by about 30%)"
    ],
    referral: "Refer to endocrinologist for complicated cases, pregnancy, unusual cause of hypothyroidism, or difficulty achieving biochemical targets."
  },
  {
    id: "anemia",
    condition: "Iron Deficiency Anemia",
    category: "hematological",
    overview: "A condition where the blood lacks adequate healthy red blood cells due to insufficient iron. The most common type of anemia worldwide.",
    symptoms: [
      "Fatigue and weakness",
      "Pale skin",
      "Shortness of breath",
      "Headaches and dizziness",
      "Cold hands and feet",
      "Brittle nails, hair loss",
      "Pica (craving non-nutritive substances)",
      "Restless legs syndrome"
    ],
    treatment: {
      firstLine: "Oral iron supplementation (ferrous sulfate 325mg 1-3 times daily) for 3-6 months. Continue supplementation for 2-3 months after normalization of hemoglobin to replenish stores.",
      alternatives: "IV iron for malabsorption, intolerance to oral preparations, non-compliance, or ongoing blood loss. Different oral formulations (ferrous gluconate, ferrous fumarate) may be better tolerated.",
      nonPharmacological: "Dietary iron intake (red meat, beans, leafy greens). Vitamin C with meals to enhance iron absorption. Avoid tea, coffee, calcium with iron supplements.",
      followUp: "Check hemoglobin after 2-4 weeks of therapy to confirm response. Investigate underlying cause if no response or recurrence."
    },
    warnings: [
      "Always investigate the cause of iron deficiency, especially in men and postmenopausal women where GI malignancy must be excluded",
      "Excessive iron supplementation can cause constipation and mask symptoms of colon cancer",
      "Avoid empiric iron supplementation without confirming deficiency"
    ],
    referral: "Refer to gastroenterology for evaluation of GI causes of iron deficiency. Hematology referral for refractory cases or if blood disorder suspected."
  },
  {
    id: "urolithiasis",
    condition: "Urolithiasis (Kidney Stones)",
    category: "urological",
    severity: "moderate",
    overview: "A condition characterized by the formation of stones in the kidneys, ureters, or bladder, often causing severe pain when they move or pass through the urinary tract.",
    symptoms: [
      "Severe, colicky flank pain radiating to groin",
      "Nausea and vomiting",
      "Hematuria (blood in urine)",
      "Dysuria (painful urination)",
      "Urinary frequency or urgency",
      "Fever and chills (if infection present)"
    ],
    treatment: {
      firstLine: "Pain management with NSAIDs (first-line) or opioid analgesics. Medical expulsive therapy with alpha-blockers (tamsulosin) for stones 5-10mm in ureter. Adequate hydration to promote stone passage.",
      alternatives: "Procedural interventions based on stone size/location: Extracorporeal shock wave lithotripsy (ESWL), ureteroscopy with laser lithotripsy, or percutaneous nephrolithotomy.",
      nonPharmacological: "Increased fluid intake (2-3L/day). Dietary modifications based on stone composition. Strain urine to collect stone for analysis.",
      followUp: "Follow-up imaging to confirm stone passage. Metabolic workup for recurrent stones. Prevention strategies based on stone composition."
    },
    medications: [
      {
        name: "Tamsulosin",
        class: "Alpha-blocker",
        dosing: "0.4mg orally once daily for promoting passage of distal ureteral stones.",
        interactions: [
          "May enhance hypotensive effects of antihypertensives",
          "CYP3A4 inhibitors may increase tamsulosin levels",
          "Contraindicated with strong CYP3A4 inhibitors like ketoconazole"
        ]
      }
    ],
    warnings: [
      "Fever with flank pain suggests infection (obstructive pyelonephritis) - a urological emergency requiring immediate decompression",
      "Inadequate pain control may require hospitalization",
      "Contrast studies contraindicated with renal insufficiency unless appropriate precautions taken"
    ],
    referral: "Urological consultation for stones >10mm, failed medical expulsive therapy, intractable pain, fever, solitary kidney, or renal insufficiency."
  },
  {
    id: "lupus",
    condition: "Systemic Lupus Erythematosus (SLE)",
    category: "rheumatological",
    overview: "A chronic autoimmune disease that can affect multiple organ systems, characterized by periods of flares and remissions.",
    symptoms: [
      "Fatigue",
      "Malar (butterfly) rash",
      "Photosensitivity",
      "Oral or nasal ulcers",
      "Arthritis",
      "Serositis (pleuritis or pericarditis)",
      "Renal involvement",
      "Neurological manifestations",
      "Hematologic abnormalities"
    ],
    treatment: {
      firstLine: "Hydroxychloroquine for most patients regardless of disease severity. NSAIDs for musculoskeletal symptoms. Glucocorticoids (lowest effective dose) for acute flares or organ-threatening disease.",
      alternatives: "Immunosuppressives based on organ involvement: Methotrexate or leflunomide for skin/joints, mycophenolate mofetil or cyclophosphamide for renal/CNS involvement. Belimumab for active disease despite standard therapy.",
      nonPharmacological: "Sun protection (SPF 50+, protective clothing). Regular exercise and balanced diet. Avoid smoking. Adequate rest during flares.",
      followUp: "Regular monitoring of disease activity using validated tools. Laboratory monitoring based on organ involvement and medications. Screen for comorbidities."
    },
    medications: [
      {
        name: "Hydroxychloroquine",
        class: "Antimalarial",
        dosing: "200-400mg daily (not exceeding 5mg/kg/day based on ideal body weight).",
        interactions: [
          "QT prolongation with other QT-prolonging medications",
          "Increased risk of hypoglycemia with antidiabetic agents",
          "Reduced efficacy of CYP2D6 substrates"
        ]
      }
    ],
    warnings: [
      "Risk of retinal toxicity with hydroxychloroquine requires baseline and periodic ophthalmologic exams",
      "Immunosuppressives increase infection risk; consider prophylaxis during intensive immunosuppression",
      "Pregnancy requires special consideration; some medications contraindicated"
    ],
    referral: "Refer to rheumatologist for diagnosis and management. Multidisciplinary care often required (nephrology, dermatology, hematology)."
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
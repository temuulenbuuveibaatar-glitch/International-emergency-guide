import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { Search, ChevronDown, ChevronUp, AlertCircle, ClipboardList, Printer, BookOpen, ThermometerSnowflake, Thermometer, Activity, DownloadCloud } from "lucide-react";
import type { ReactToPrintProps } from "react-to-print";
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
      nonPharmacological: "Weight loss if overweight, elevate head of bed, avoid trigger foods, eat smaller meals, avoid eating 2-3 hours before bedtime, smoking cessation.",
      followUp: "Evaluation of symptom response after 4-8 weeks. Consider endoscopy for alarm symptoms or persistent GERD."
    },
    warnings: [
      "Long-term PPI use linked to potential risks (bone fractures, C. difficile, pneumonia)",
      "Alarm symptoms (dysphagia, weight loss, anemia) require prompt endoscopy",
      "Consider cardiac causes for chest pain"
    ],
    referral: "Refer for endoscopy if alarm symptoms, age >50 with new-onset GERD, or inadequate response to therapy."
  },
  {
    id: "migraine",
    condition: "Migraine",
    category: "neurological",
    overview: "A primary headache disorder characterized by recurrent headaches that are moderate to severe, often with associated symptoms such as nausea, vomiting, and sensitivity to light and sound.",
    symptoms: [
      "Throbbing or pulsating headache (often one-sided)",
      "Visual disturbances (aura in some patients)",
      "Nausea and/or vomiting",
      "Sensitivity to light, sound, and sometimes smells",
      "Dizziness or vertigo",
      "Fatigue"
    ],
    treatment: {
      firstLine: "Acute treatment: NSAIDs, acetaminophen, or triptans. Prophylaxis for frequent migraines: Beta-blockers, anticonvulsants, or antidepressants.",
      alternatives: "CGRP antagonists, botulinum toxin for chronic migraine, neuromodulation devices, or ergot derivatives.",
      nonPharmacological: "Identify and avoid triggers, maintain regular sleep schedule, stress management, regular exercise, adequate hydration.",
      followUp: "Regular assessment of headache frequency, severity, and response to therapy. Adjust preventive medications as needed."
    },
    warnings: [
      "Medication overuse can lead to rebound headaches",
      "Triptan contraindications include coronary artery disease and uncontrolled hypertension",
      "New onset severe headache may indicate secondary causes requiring urgent evaluation"
    ],
    referral: "Refer to neurologist for atypical features, treatment-resistant migraines, or consideration of newer therapeutic options."
  },
  {
    id: "depression",
    condition: "Major Depressive Disorder",
    category: "psychiatric",
    overview: "A mood disorder that causes a persistent feeling of sadness and loss of interest, affecting how a person feels, thinks, and behaves.",
    symptoms: [
      "Persistent sad, anxious, or empty mood",
      "Loss of interest in activities once enjoyed",
      "Decreased energy, fatigue",
      "Difficulty concentrating, remembering, making decisions",
      "Insomnia or hypersomnia",
      "Changes in appetite or weight",
      "Thoughts of death or suicide"
    ],
    treatment: {
      firstLine: "Selective serotonin reuptake inhibitors (SSRIs) or serotonin-norepinephrine reuptake inhibitors (SNRIs). Psychotherapy (particularly cognitive-behavioral therapy).",
      alternatives: "Atypical antidepressants, tricyclic antidepressants, monoamine oxidase inhibitors, or adjunctive therapies (antipsychotics, lithium, thyroid hormone).",
      nonPharmacological: "Regular exercise, healthy sleep habits, social connection, stress reduction, problem-solving therapy, light therapy for seasonal patterns.",
      followUp: "Monitor for response after 2-4 weeks, adjust dose if needed. Full response may take 6-12 weeks. Regular follow-up to monitor symptoms and side effects."
    },
    warnings: [
      "Increased suicide risk, especially in young adults, during early treatment phase",
      "Monitor for activation syndrome or manic switch",
      "Abrupt discontinuation may cause withdrawal symptoms"
    ],
    referral: "Refer to psychiatrist for treatment-resistant depression, comorbid psychiatric conditions, suicidal ideation, or psychotic features."
  },
  {
    id: "rheumatoid",
    condition: "Rheumatoid Arthritis",
    category: "musculoskeletal",
    overview: "An autoimmune and inflammatory disease in which the immune system attacks healthy cells in the body, primarily affecting the joints.",
    symptoms: [
      "Joint pain, swelling, and stiffness (typically symmetrical)",
      "Morning stiffness lasting >30 minutes",
      "Fatigue and malaise",
      "Low-grade fever",
      "Joint deformity (in later stages)",
      "Rheumatoid nodules"
    ],
    treatment: {
      firstLine: "Disease-modifying antirheumatic drugs (DMARDs) such as methotrexate. NSAIDs or low-dose corticosteroids for symptomatic relief.",
      alternatives: "Biologic DMARDs (TNF inhibitors, IL-6 inhibitors, T-cell costimulation modulators), JAK inhibitors, or combination DMARD therapy.",
      nonPharmacological: "Physical and occupational therapy, regular exercise, joint protection techniques, assistive devices, healthy diet.",
      followUp: "Regular monitoring of disease activity and medication toxicity. Adjust therapy based on treat-to-target approach."
    },
    warnings: [
      "Increased risk of infections with biologic therapy",
      "Monitor for organ toxicity with DMARD therapy",
      "Early aggressive treatment is essential to prevent joint damage"
    ],
    referral: "Early referral to rheumatologist for diagnosis and treatment initiation. Ongoing collaborative management."
  },
  {
    id: "hypothyroidism",
    condition: "Hypothyroidism",
    category: "endocrine",
    overview: "A condition in which the thyroid gland doesn't produce enough thyroid hormone, leading to slowed metabolism and various systemic effects.",
    symptoms: [
      "Fatigue and weakness",
      "Increased sensitivity to cold",
      "Constipation",
      "Dry skin and hair",
      "Weight gain",
      "Puffy face",
      "Hoarseness",
      "Depression",
      "Impaired memory"
    ],
    treatment: {
      firstLine: "Levothyroxine (synthetic T4) replacement therapy, started at appropriate dose based on age, weight, and comorbidities.",
      alternatives: "Combination T4/T3 therapy in selected cases. Liothyronine (synthetic T3) rarely used alone.",
      nonPharmacological: "Take medication consistently (typically in morning on empty stomach), separate from interfering medications and supplements.",
      followUp: "Monitor TSH and free T4 levels 6-8 weeks after initiation or dose adjustment, then annually once stable."
    },
    warnings: [
      "Overtreatment can cause thyrotoxicosis symptoms",
      "Increased risk of osteoporosis and atrial fibrillation with long-term over-replacement",
      "Abrupt dose increases in elderly or those with cardiac disease may precipitate angina or arrhythmias"
    ],
    referral: "Refer to endocrinologist for complicated cases, pregnancy, unusual presentations, or difficulty achieving euthyroid state."
  },
  {
    id: "atrial_fibrillation",
    condition: "Atrial Fibrillation",
    category: "cardiovascular",
    overview: "An irregular and often rapid heart rhythm that can lead to blood clots, stroke, heart failure and other heart-related complications.",
    symptoms: [
      "Palpitations",
      "Shortness of breath",
      "Weakness or fatigue",
      "Dizziness or lightheadedness",
      "Chest pain or discomfort",
      "Often asymptomatic"
    ],
    treatment: {
      firstLine: "Rate control (beta-blockers, calcium channel blockers, digoxin) and stroke prevention with anticoagulation based on CHA₂DS₂-VASc score. Consider rhythm control in symptomatic patients.",
      alternatives: "Antiarrhythmic drugs for rhythm control. Catheter ablation for symptomatic patients resistant to medical therapy. Left atrial appendage closure for those unable to take anticoagulants.",
      nonPharmacological: "Lifestyle modifications (weight loss, exercise, sleep apnea treatment, alcohol reduction). Consider cardioversion for recent-onset AF.",
      followUp: "Regular monitoring of heart rate control, anticoagulation status, and symptoms. Periodic ECG to assess rhythm."
    },
    warnings: [
      "Bleeding risk with anticoagulation therapy needs regular assessment",
      "Interactions between antiarrhythmics and other medications",
      "Proarrhythmic effects of antiarrhythmic drugs"
    ],
    referral: "Refer to cardiologist/electrophysiologist for complicated rate control, rhythm control considerations, or ablation assessment."
  },
  {
    id: "copd",
    condition: "Chronic Obstructive Pulmonary Disease (COPD)",
    category: "respiratory",
    overview: "A chronic inflammatory lung disease that causes obstructed airflow from the lungs, typically caused by long-term exposure to irritants, most commonly cigarette smoke.",
    symptoms: [
      "Progressive dyspnea (shortness of breath)",
      "Chronic cough, often with sputum",
      "Wheezing",
      "Chest tightness",
      "Frequent respiratory infections",
      "Fatigue"
    ],
    treatment: {
      firstLine: "Bronchodilators (LABA, LAMA, or combination) as cornerstone therapy. Add inhaled corticosteroids for frequent exacerbations and elevated eosinophil count.",
      alternatives: "Phosphodiesterase-4 inhibitors, theophylline, mucolytics, or macrolides (for frequent exacerbations).",
      nonPharmacological: "Smoking cessation, pulmonary rehabilitation, influenza and pneumococcal vaccinations, oxygen therapy if hypoxemic, proper inhaler technique.",
      followUp: "Regular assessment of symptoms, exacerbation frequency, and lung function. Adjust therapy according to GOLD guidelines."
    },
    warnings: [
      "Risk of pneumonia with inhaled corticosteroids",
      "Cardiovascular side effects with some bronchodilators",
      "Acute exacerbations require prompt treatment to prevent deterioration"
    ],
    referral: "Refer to pulmonologist for diagnostic uncertainty, severe disease, consideration for advanced therapies, or surgical options."
  },
  {
    id: "osteoarthritis",
    condition: "Osteoarthritis",
    category: "musculoskeletal",
    overview: "A degenerative joint disease characterized by the breakdown of joint cartilage and underlying bone, causing pain and stiffness.",
    symptoms: [
      "Joint pain that worsens with activity and improves with rest",
      "Joint stiffness, especially in the morning or after inactivity",
      "Reduced range of motion",
      "Joint tenderness",
      "Crepitus (cracking or popping sounds)",
      "Bone spurs"
    ],
    treatment: {
      firstLine: "Acetaminophen for mild pain. NSAIDs (oral or topical) for moderate pain. Intra-articular corticosteroid injections for flare-ups.",
      alternatives: "Duloxetine, tramadol, or opioids for severe pain unresponsive to other treatments. Viscosupplementation in selected cases.",
      nonPharmacological: "Weight management, appropriate exercise (low-impact aerobic and strengthening), physical therapy, assistive devices, heat/cold therapy, acupuncture.",
      followUp: "Regular assessment of pain control, function, and medication side effects."
    },
    warnings: [
      "NSAID risks include GI bleeding, renal impairment, and cardiovascular events",
      "Avoid long-term opioid use due to dependency risk and side effects",
      "Corticosteroid injections limited to 3-4 per year per joint"
    ],
    referral: "Refer to orthopedic surgeon for advanced disease with significant functional impairment or failed conservative management."
  },
  {
    id: "anxiety",
    condition: "Generalized Anxiety Disorder",
    category: "psychiatric",
    overview: "A mental health disorder characterized by persistent, excessive worry about various things that is difficult to control and interferes with daily activities.",
    symptoms: [
      "Persistent worry and anxiety",
      "Restlessness or feeling on edge",
      "Fatigue",
      "Difficulty concentrating",
      "Irritability",
      "Muscle tension",
      "Sleep disturbances"
    ],
    treatment: {
      firstLine: "SSRIs or SNRIs as first-line pharmacotherapy. Cognitive-behavioral therapy as highly effective psychological treatment.",
      alternatives: "Buspirone, pregabalin, benzodiazepines (short-term use only), or hydroxyzine.",
      nonPharmacological: "Stress management techniques, mindfulness meditation, regular exercise, adequate sleep hygiene, limiting caffeine and alcohol.",
      followUp: "Monitor for response after 4-6 weeks of medication, adjust as needed. Regular therapy sessions for CBT approach."
    },
    warnings: [
      "Benzodiazepines have dependency and tolerance risks",
      "SSRIs/SNRIs may cause initial increase in anxiety",
      "Abrupt discontinuation of medications may cause withdrawal symptoms"
    ],
    referral: "Refer to psychiatrist or psychologist for specialized treatment, especially for treatment-resistant cases or significant comorbidities."
  },
  {
    id: "ibs",
    condition: "Irritable Bowel Syndrome",
    category: "gastrointestinal",
    overview: "A functional gastrointestinal disorder characterized by abdominal pain, bloating, and altered bowel habits in the absence of detectable structural abnormalities.",
    symptoms: [
      "Abdominal pain or cramping",
      "Bloating and gas",
      "Diarrhea or constipation (or alternating between both)",
      "Mucus in stool",
      "Symptoms often worsen with stress",
      "Food intolerances"
    ],
    treatment: {
      firstLine: "For IBS-D: loperamide, antispasmodics, bile acid sequestrants. For IBS-C: fiber supplements, osmotic laxatives. For pain: antispasmodics or tricyclic antidepressants.",
      alternatives: "For IBS-D: rifaximin, eluxadoline, alosetron. For IBS-C: linaclotide, plecanatide, lubiprostone. SSRIs for global symptoms and comorbid anxiety/depression.",
      nonPharmacological: "Dietary modifications (low FODMAP diet), regular exercise, stress reduction techniques, adequate sleep, probiotics trial.",
      followUp: "Regular assessment of symptom control and quality of life. Adjust therapy based on predominant symptoms."
    },
    warnings: [
      "Avoid long-term antidiarrheal use in IBS-D",
      "Monitor for side effects with neuromodulators",
      "Alarm symptoms (weight loss, anemia, nocturnal symptoms) require further investigation"
    ],
    referral: "Refer to gastroenterologist for diagnostic uncertainty, alarm features, or inadequate response to therapy."
  },
  {
    id: "anemia",
    condition: "Iron Deficiency Anemia",
    category: "hematological",
    overview: "A common type of anemia — a condition in which blood lacks adequate healthy red blood cells to carry sufficient oxygen to tissues, specifically due to insufficient iron.",
    symptoms: [
      "Fatigue and weakness",
      "Pale skin",
      "Shortness of breath",
      "Headaches",
      "Dizziness or lightheadedness",
      "Cold hands and feet",
      "Brittle nails",
      "Pica (craving for non-food items)"
    ],
    treatment: {
      firstLine: "Oral iron supplements (ferrous sulfate, ferrous gluconate, or ferrous fumarate) for 3-6 months after correction of anemia.",
      alternatives: "Intravenous iron for patients with intolerance to oral iron, malabsorption, or ongoing blood loss. Different oral formulations or schedules to improve tolerance.",
      nonPharmacological: "Iron-rich diet (red meat, leafy greens, iron-fortified cereals), vitamin C with meals to enhance iron absorption, avoid tea/coffee with meals.",
      followUp: "Monitor hemoglobin response after 2-4 weeks, then periodically. Continue iron supplementation for 3-6 months after normalization."
    },
    warnings: [
      "Investigate cause of iron deficiency, especially in men and postmenopausal women",
      "Gastrointestinal side effects common with oral iron",
      "IV iron carries risk of hypersensitivity reactions"
    ],
    referral: "Refer to gastroenterologist or gynecologist for evaluation of blood loss. Hematology referral for complex cases or suspected malabsorption."
  },
  {
    id: "acne",
    condition: "Acne Vulgaris",
    category: "dermatological",
    overview: "A common skin condition characterized by hair follicles plugged with oil and dead skin cells, leading to whiteheads, blackheads, pimples, and deeper lumps.",
    symptoms: [
      "Whiteheads (closed plugged pores)",
      "Blackheads (open plugged pores)",
      "Papules (small red, tender bumps)",
      "Pustules (papules with pus at tips)",
      "Nodules (large, solid, painful lumps beneath the skin)",
      "Cystic lesions (painful, pus-filled lumps beneath the skin)"
    ],
    treatment: {
      firstLine: "Mild: Topical retinoids and/or benzoyl peroxide. Moderate: Add topical antibiotics or consider oral antibiotics. Severe: Consider isotretinoin.",
      alternatives: "Azelaic acid, salicylic acid, topical dapsone, hormonal therapy (in females), or oral spironolactone (for females with hormonal acne).",
      nonPharmacological: "Gentle skin care routine, non-comedogenic products, regular cleansing, avoid picking/squeezing lesions, stress management.",
      followUp: "Assess response after 4-8 weeks of therapy. Adjust treatment based on response and tolerability."
    },
    warnings: [
      "Isotretinoin has significant side effects and teratogenicity; requires strict monitoring",
      "Antibiotic resistance concerns with long-term antibiotic use",
      "Some treatments may initially worsen acne before improvement"
    ],
    referral: "Refer to dermatologist for severe, scarring, or treatment-resistant acne, or when considering isotretinoin."
  },
  {
    id: "epilepsy",
    condition: "Epilepsy",
    category: "neurological",
    overview: "A chronic neurological disorder characterized by recurrent, unprovoked seizures due to abnormal electrical activity in the brain.",
    symptoms: [
      "Seizures (various types: generalized tonic-clonic, absence, focal, etc.)",
      "Temporary confusion",
      "Staring spells",
      "Uncontrollable jerking movements",
      "Loss of consciousness or awareness",
      "Psychological symptoms (fear, anxiety, déjà vu)"
    ],
    treatment: {
      firstLine: "Monotherapy with an antiepileptic drug (AED) appropriate for seizure type. Options include levetiracetam, lamotrigine, carbamazepine, oxcarbazepine, or valproate (avoid in women of childbearing potential).",
      alternatives: "Add second AED if monotherapy fails. Consider other options like topiramate, zonisamide, lacosamide, perampanel, or brivaracetam based on seizure type and patient factors.",
      nonPharmacological: "Regular sleep schedule, stress reduction, avoid seizure triggers (alcohol, drugs), adherence to medication. Consider ketogenic diet in select cases.",
      followUp: "Regular monitoring of seizure frequency, medication adherence, and side effects. AED levels if indicated."
    },
    warnings: [
      "Abrupt discontinuation of AEDs may precipitate seizures or status epilepticus",
      "Many AEDs have significant drug interactions",
      "Teratogenic potential of some AEDs in pregnant women"
    ],
    referral: "Refer to neurologist for diagnosis, treatment initiation, and continued management. Consider epilepsy specialist for refractory epilepsy."
  },
  {
    id: "cellulitis",
    condition: "Cellulitis",
    category: "infectious",
    overview: "A common bacterial skin infection that affects the deeper layers of the skin and the subcutaneous tissue, characterized by skin inflammation and infection.",
    symptoms: [
      "Skin redness and swelling",
      "Pain and tenderness",
      "Skin dimpling",
      "Warmth in the affected area",
      "Fever and chills",
      "Skin ulceration or blistering"
    ],
    treatment: {
      firstLine: "Empiric antibiotic therapy covering streptococci and staphylococci. Options include dicloxacillin, cephalexin, or clindamycin for mild cases; consider MRSA coverage if risk factors present.",
      alternatives: "For more severe cases or MRSA concerns: trimethoprim-sulfamethoxazole, doxycycline, or linezolid. IV antibiotics for severe infection or systemic symptoms.",
      nonPharmacological: "Elevation of affected limb, rest, warm compresses, proper wound care if applicable, adequate pain control.",
      followUp: "Assess response within 48-72 hours. Complete antibiotic course (typically 5-10 days depending on severity and response)."
    },
    warnings: [
      "Rapid progression may indicate necrotizing fasciitis requiring urgent surgical evaluation",
      "Diabetic patients at higher risk for complications",
      "Recurrent cellulitis may indicate underlying condition requiring additional management"
    ],
    referral: "Hospital admission for severe infection, systemic symptoms, immunocompromised patients, or failure of oral antibiotics."
  },
  {
    id: "acute_otitis_media",
    condition: "Acute Otitis Media",
    category: "ent",
    overview: "An infection of the middle ear, typically following an upper respiratory infection, causing inflammation and fluid buildup behind the eardrum.",
    symptoms: [
      "Ear pain (otalgia)",
      "Impaired hearing",
      "Fever",
      "Irritability in young children",
      "Ear drainage if eardrum ruptures",
      "Balance problems"
    ],
    treatment: {
      firstLine: "Mild cases in older children/adults may be observed for 48-72 hours with pain management. For others: Amoxicillin as first-line antibiotic therapy.",
      alternatives: "Amoxicillin-clavulanate for treatment failure, recent antibiotic use, or high-risk factors. Cefuroxime, ceftriaxone, or clindamycin for penicillin allergy.",
      nonPharmacological: "Pain management with acetaminophen or ibuprofen. Warm compress to affected ear. Elevate head while resting.",
      followUp: "Assess response within 48-72 hours if symptoms persist. Consider follow-up in 4-6 weeks for persistent effusion."
    },
    warnings: [
      "Complications include mastoiditis, hearing loss, or tympanic membrane perforation",
      "Recurrent AOM may require consideration of tympanostomy tubes",
      "Distinguishing AOM from otitis media with effusion is important for management"
    ],
    referral: "Refer to otolaryngologist for complications, recurrent AOM (3+ episodes in 6 months), or consideration of tympanostomy tubes."
  }
];

// Added 15+ comprehensive conditions covering various medical specialties

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
  urological: "Urological Conditions",
  hematological: "Blood Disorders",
  ent: "Ear, Nose & Throat Conditions"
};

export default function TreatmentGuidelines() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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

  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
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
                {filteredGuidelines.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGuidelines.map(guideline => (
                      <div key={guideline.id} className="border border-gray-200 rounded-lg overflow-hidden print:break-inside-avoid">
                        <button
                          className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-gray-50 print:hover:bg-white"
                          onClick={() => toggleExpand(guideline.id)}
                        >
                          <div className="flex items-center">
                            <div>
                              <h3 className="font-medium text-lg text-gray-900">{guideline.condition}</h3>
                              <p className="text-sm text-gray-500">{categories[guideline.category as keyof typeof categories]}</p>
                            </div>
                            {guideline.severity && renderSeverityBadge(guideline.severity)}
                          </div>
                          {expandedItem === guideline.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 print:hidden" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 print:hidden" />
                          )}
                        </button>
                        
                        {(expandedItem === guideline.id || viewMode === 'all') && (
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

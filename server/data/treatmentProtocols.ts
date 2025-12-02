export interface TreatmentProtocol {
  id: string;
  name: string;
  category: string;
  icdCodes: string[];
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  steps: Array<{
    order: number;
    action: string;
    timing?: string;
    notes?: string;
    warnings?: string[];
  }>;
  firstLineMedications: Array<{
    name: string;
    dose: string;
    route: string;
    frequency: string;
    duration?: string;
    notes?: string;
  }>;
  secondLineMedications?: Array<{
    name: string;
    dose: string;
    route: string;
    frequency: string;
    duration?: string;
    notes?: string;
  }>;
  adjunctiveTreatments?: string[];
  contraindications: string[];
  warningSymptoms: string[];
  referralCriteria: string[];
  followUp: string;
  references: string[];
  lastUpdated: string;
}

export const treatmentProtocols: TreatmentProtocol[] = [
  // RESPIRATORY PROTOCOLS
  {
    id: "asthma-exacerbation",
    name: "Asthma Exacerbation Management",
    category: "Respiratory",
    icdCodes: ["J45.20", "J45.21", "J45.22", "J45.30", "J45.31"],
    description: "Acute asthma exacerbation management protocol for adults and children following GINA 2025 guidelines",
    severity: "moderate",
    steps: [
      { order: 1, action: "Assess severity using peak flow, SpO2, and clinical signs", timing: "Immediate" },
      { order: 2, action: "Administer oxygen to maintain SpO2 93-95% (adults) or 94-98% (children)", timing: "Immediate" },
      { order: 3, action: "Start SABA nebulization", timing: "Within 5 minutes" },
      { order: 4, action: "Administer systemic corticosteroids if moderate-severe", timing: "Within 1 hour" },
      { order: 5, action: "Reassess response after initial treatment", timing: "At 20-30 minutes" },
      { order: 6, action: "Consider ipratropium for severe exacerbation", timing: "If poor response" },
      { order: 7, action: "Reassess for admission or discharge criteria", timing: "At 1-2 hours" }
    ],
    firstLineMedications: [
      { name: "Albuterol nebulizer", dose: "2.5-5mg", route: "Nebulizer", frequency: "Every 20 min x 3, then as needed", notes: "Continuous nebulization for severe" },
      { name: "Prednisone", dose: "40-60mg (adults), 1-2mg/kg (children, max 60mg)", route: "Oral", frequency: "Once daily", duration: "5-7 days", notes: "No taper needed if <10 days" }
    ],
    secondLineMedications: [
      { name: "Ipratropium", dose: "0.5mg (adults), 0.25-0.5mg (children)", route: "Nebulizer", frequency: "Every 20 min x 3", notes: "Combine with SABA for severe" },
      { name: "Magnesium sulfate", dose: "2g IV over 20 min", route: "IV", frequency: "Once", notes: "For severe/life-threatening only" }
    ],
    adjunctiveTreatments: ["Supplemental oxygen", "IV fluids if dehydrated", "Upright positioning"],
    contraindications: ["Use beta-blockers with caution", "Avoid sedatives"],
    warningSymptoms: ["Silent chest", "Cyanosis", "Altered consciousness", "Peak flow <25% predicted", "SpO2 <92%"],
    referralCriteria: ["ICU admission for life-threatening features", "Intubation required", "Failed to improve with initial treatment"],
    followUp: "Review within 2-7 days; arrange asthma action plan; review inhaler technique",
    references: ["GINA 2025 Guidelines", "NICE NG80"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "copd-exacerbation",
    name: "COPD Exacerbation Management",
    category: "Respiratory",
    icdCodes: ["J44.0", "J44.1"],
    description: "Acute exacerbation of COPD management following GOLD 2025 guidelines",
    severity: "moderate",
    steps: [
      { order: 1, action: "Assess severity and identify trigger (infection vs environmental)", timing: "Immediate" },
      { order: 2, action: "Controlled oxygen therapy to target SpO2 88-92%", timing: "Immediate", warnings: ["Avoid high-flow oxygen - risk of CO2 retention"] },
      { order: 3, action: "Administer bronchodilators", timing: "Immediate" },
      { order: 4, action: "Start systemic corticosteroids", timing: "Within 1 hour" },
      { order: 5, action: "Consider antibiotics if infection suspected", timing: "Within 1 hour" },
      { order: 6, action: "Assess for non-invasive ventilation if respiratory acidosis", timing: "If pH <7.35" },
      { order: 7, action: "Monitor for need for escalation to ICU", timing: "Ongoing" }
    ],
    firstLineMedications: [
      { name: "Albuterol nebulizer", dose: "2.5mg", route: "Nebulizer", frequency: "Every 4-6 hours" },
      { name: "Ipratropium", dose: "0.5mg", route: "Nebulizer", frequency: "Every 4-6 hours", notes: "May combine with SABA" },
      { name: "Prednisone", dose: "40mg", route: "Oral", frequency: "Once daily", duration: "5 days" }
    ],
    secondLineMedications: [
      { name: "Amoxicillin-clavulanate", dose: "875/125mg", route: "Oral", frequency: "Twice daily", duration: "5-7 days", notes: "If purulent sputum" },
      { name: "Azithromycin", dose: "500mg", route: "Oral", frequency: "Once daily", duration: "3 days", notes: "Alternative antibiotic" }
    ],
    adjunctiveTreatments: ["Non-invasive ventilation if acidosis", "Chest physiotherapy", "DVT prophylaxis"],
    contraindications: ["Avoid sedatives", "Avoid high-flow oxygen without monitoring"],
    warningSymptoms: ["Altered mental status", "Worsening respiratory acidosis", "Hemodynamic instability"],
    referralCriteria: ["Failed NIV", "Need for intubation", "Multi-organ failure"],
    followUp: "Review maintenance therapy; smoking cessation counseling; pulmonary rehabilitation referral",
    references: ["GOLD 2025 Report", "NICE NG115"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "community-acquired-pneumonia",
    name: "Community-Acquired Pneumonia",
    category: "Respiratory",
    icdCodes: ["J18.0", "J18.1", "J18.9", "J15.9"],
    description: "CAP management in adults following ATS/IDSA 2019/2025 guidelines",
    severity: "moderate",
    steps: [
      { order: 1, action: "Confirm diagnosis with chest X-ray and clinical assessment" },
      { order: 2, action: "Calculate severity score (CURB-65 or PSI)" },
      { order: 3, action: "Obtain cultures if indicated (severe CAP, risk factors)" },
      { order: 4, action: "Start empiric antibiotics within 4 hours of presentation" },
      { order: 5, action: "Provide supportive care (oxygen, fluids)" },
      { order: 6, action: "Assess response at 48-72 hours" },
      { order: 7, action: "Switch to oral therapy when clinically stable" }
    ],
    firstLineMedications: [
      { name: "Amoxicillin", dose: "1g", route: "Oral", frequency: "Three times daily", duration: "5-7 days", notes: "Outpatient, no comorbidities" },
      { name: "Amoxicillin-clavulanate", dose: "875/125mg", route: "Oral", frequency: "Twice daily", duration: "5-7 days", notes: "Outpatient with comorbidities" },
      { name: "Azithromycin", dose: "500mg day 1, then 250mg", route: "Oral", frequency: "Once daily", duration: "5 days", notes: "Add to beta-lactam or use alone if allergic" }
    ],
    secondLineMedications: [
      { name: "Ceftriaxone", dose: "1-2g", route: "IV", frequency: "Once daily", notes: "Inpatient non-severe" },
      { name: "Levofloxacin", dose: "750mg", route: "Oral/IV", frequency: "Once daily", duration: "5 days", notes: "Alternative for allergies" },
      { name: "Vancomycin", dose: "15-20mg/kg", route: "IV", frequency: "Every 8-12 hours", notes: "Add if MRSA risk factors" }
    ],
    adjunctiveTreatments: ["Oxygen therapy", "IV fluids", "DVT prophylaxis", "Early mobilization"],
    contraindications: ["Review antibiotic allergies carefully"],
    warningSymptoms: ["Respiratory failure", "Septic shock", "Empyema", "Multi-organ dysfunction"],
    referralCriteria: ["ICU admission for severe CAP", "Failure to improve at 72 hours", "Complicated effusion"],
    followUp: "Chest X-ray at 6-8 weeks to confirm resolution; pneumococcal/influenza vaccination",
    references: ["ATS/IDSA CAP Guidelines 2019", "NICE NG138"],
    lastUpdated: "2025-01-01"
  },

  // CARDIOVASCULAR PROTOCOLS
  {
    id: "acute-coronary-syndrome",
    name: "Acute Coronary Syndrome (STEMI/NSTEMI)",
    category: "Cardiovascular",
    icdCodes: ["I21.0", "I21.1", "I21.2", "I21.3", "I21.4"],
    description: "Acute management of ST-elevation and non-ST-elevation myocardial infarction",
    severity: "life-threatening",
    steps: [
      { order: 1, action: "Obtain 12-lead ECG within 10 minutes", timing: "Immediate" },
      { order: 2, action: "Activate cath lab if STEMI (door-to-balloon <90 min)", timing: "Immediate" },
      { order: 3, action: "Establish IV access, continuous monitoring", timing: "Immediate" },
      { order: 4, action: "Administer aspirin 325mg chewed", timing: "Immediate" },
      { order: 5, action: "Administer P2Y12 inhibitor loading dose", timing: "Once PCI decided" },
      { order: 6, action: "Start anticoagulation", timing: "Immediate" },
      { order: 7, action: "Administer morphine if severe chest pain", timing: "As needed", warnings: ["May increase mortality in some studies - use judiciously"] },
      { order: 8, action: "Start beta-blocker within 24 hours if no contraindication", timing: "When stable" }
    ],
    firstLineMedications: [
      { name: "Aspirin", dose: "325mg", route: "Chewed", frequency: "Stat", notes: "Non-enteric coated" },
      { name: "Ticagrelor", dose: "180mg", route: "Oral", frequency: "Loading dose", notes: "Preferred P2Y12 inhibitor" },
      { name: "Heparin (UFH)", dose: "60 units/kg bolus, max 4000 units", route: "IV", frequency: "Then infusion" },
      { name: "Metoprolol", dose: "25-50mg", route: "Oral", frequency: "Every 6-12 hours", notes: "When hemodynamically stable" }
    ],
    secondLineMedications: [
      { name: "Clopidogrel", dose: "600mg", route: "Oral", frequency: "Loading dose", notes: "Alternative P2Y12 if ticagrelor not available" },
      { name: "Nitroglycerin", dose: "0.4mg SL", route: "Sublingual", frequency: "Every 5 min x 3", notes: "For ongoing chest pain" },
      { name: "Morphine", dose: "2-4mg", route: "IV", frequency: "Every 5-15 min", notes: "Use cautiously, only for severe pain" }
    ],
    adjunctiveTreatments: ["Oxygen if SpO2 <90%", "Primary PCI for STEMI", "Risk stratification for NSTEMI"],
    contraindications: ["Avoid beta-blockers if cardiogenic shock, bradycardia, or decompensated HF", "Avoid nitroglycerin if hypotension or RV infarct"],
    warningSymptoms: ["Cardiogenic shock", "Ventricular arrhythmias", "Complete heart block", "Mechanical complications"],
    referralCriteria: ["All STEMI to cath lab", "High-risk NSTEMI to early invasive strategy"],
    followUp: "Cardiac rehabilitation; optimize secondary prevention (statin, ACEi, beta-blocker); lifestyle modification",
    references: ["ACC/AHA STEMI Guidelines 2021", "ACC/AHA NSTE-ACS Guidelines 2021"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "acute-heart-failure",
    name: "Acute Heart Failure Exacerbation",
    category: "Cardiovascular",
    icdCodes: ["I50.20", "I50.21", "I50.22", "I50.23"],
    description: "Management of acute decompensated heart failure",
    severity: "severe",
    steps: [
      { order: 1, action: "Assess hemodynamic profile (warm/cold, wet/dry)", timing: "Immediate" },
      { order: 2, action: "Position patient upright, provide supplemental oxygen", timing: "Immediate" },
      { order: 3, action: "Establish IV access, continuous monitoring", timing: "Immediate" },
      { order: 4, action: "Administer IV diuretic", timing: "Within 30 minutes" },
      { order: 5, action: "Consider vasodilator if hypertensive", timing: "If SBP >110" },
      { order: 6, action: "Obtain echo if new presentation or significant change", timing: "Within 24-48 hours" },
      { order: 7, action: "Identify and treat precipitating factors", timing: "Ongoing" }
    ],
    firstLineMedications: [
      { name: "Furosemide", dose: "40-80mg (or 1-2.5x home dose)", route: "IV", frequency: "Every 8-12 hours or continuous", notes: "Adjust based on response" },
      { name: "Nitroglycerin", dose: "Start 5-10mcg/min", route: "IV infusion", frequency: "Continuous", notes: "If hypertensive and congested" }
    ],
    secondLineMedications: [
      { name: "Metolazone", dose: "2.5-5mg", route: "Oral", frequency: "Once daily", notes: "Add for diuretic resistance" },
      { name: "Dobutamine", dose: "2.5-10mcg/kg/min", route: "IV infusion", frequency: "Continuous", notes: "For cardiogenic shock" },
      { name: "Milrinone", dose: "0.375-0.75mcg/kg/min", route: "IV infusion", frequency: "Continuous", notes: "Inodilator for low-output state" }
    ],
    adjunctiveTreatments: ["Fluid restriction 1.5-2L/day", "Daily weights", "Electrolyte monitoring", "DVT prophylaxis"],
    contraindications: ["Avoid NSAIDs", "Avoid calcium channel blockers (diltiazem/verapamil) in HFrEF"],
    warningSymptoms: ["Cardiogenic shock", "Severe respiratory distress", "Worsening renal function", "Arrhythmias"],
    referralCriteria: ["Cardiogenic shock requiring inotropes", "Need for mechanical circulatory support", "Transplant/LVAD evaluation"],
    followUp: "Volume status optimization; GDMT initiation/optimization; cardiac rehabilitation",
    references: ["AHA/ACC HF Guidelines 2022", "ESC HF Guidelines 2021"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "hypertensive-urgency",
    name: "Hypertensive Urgency/Emergency",
    category: "Cardiovascular",
    icdCodes: ["I16.0", "I16.1", "I16.9"],
    description: "Management of severely elevated blood pressure with or without target organ damage",
    severity: "severe",
    steps: [
      { order: 1, action: "Assess for target organ damage (stroke, MI, aortic dissection, AKI)", timing: "Immediate" },
      { order: 2, action: "If hypertensive emergency with organ damage, admit to ICU", timing: "Immediate" },
      { order: 3, action: "If urgency (no organ damage), reinstitute/adjust oral medications", timing: "Within 1 hour" },
      { order: 4, action: "For emergency: IV antihypertensive with controlled reduction", timing: "Immediate" },
      { order: 5, action: "Reduce BP by 25% in first hour, then to 160/100 over 2-6 hours", timing: "Controlled", warnings: ["Too rapid reduction can cause stroke or MI"] },
      { order: 6, action: "Transition to oral therapy when stable", timing: "24-48 hours" }
    ],
    firstLineMedications: [
      { name: "Labetalol", dose: "20mg IV then 40-80mg every 10 min", route: "IV", frequency: "Or infusion 0.5-2mg/min", notes: "Most commonly used" },
      { name: "Nicardipine", dose: "5mg/hr, titrate by 2.5mg/hr every 5-15 min", route: "IV infusion", frequency: "Continuous", notes: "Max 15mg/hr" },
      { name: "Amlodipine", dose: "5-10mg", route: "Oral", frequency: "Once daily", notes: "For urgency/transition" }
    ],
    secondLineMedications: [
      { name: "Nitroprusside", dose: "0.25-10mcg/kg/min", route: "IV infusion", frequency: "Continuous", notes: "Last resort - cyanide toxicity risk" },
      { name: "Hydralazine", dose: "10-20mg", route: "IV", frequency: "Every 4-6 hours", notes: "Especially in pregnancy" },
      { name: "Esmolol", dose: "500mcg/kg bolus, then 50-300mcg/kg/min", route: "IV infusion", frequency: "Continuous", notes: "For aortic dissection" }
    ],
    adjunctiveTreatments: ["Pain control if aortic dissection", "Treat underlying cause", "Medication compliance education"],
    contraindications: ["Avoid sublingual nifedipine (unpredictable drops)", "Avoid rapid reduction (stroke risk)"],
    warningSymptoms: ["Chest pain (aortic dissection, MI)", "Neurological symptoms", "Visual changes", "Oliguria"],
    referralCriteria: ["All hypertensive emergencies to ICU", "New-onset hypertension evaluation"],
    followUp: "BP monitoring; medication adjustment; secondary cause evaluation if appropriate",
    references: ["AHA/ACC Hypertension Guidelines 2017", "JNC 8"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "atrial-fibrillation-rvr",
    name: "Atrial Fibrillation with Rapid Ventricular Response",
    category: "Cardiovascular",
    icdCodes: ["I48.0", "I48.1", "I48.2"],
    description: "Management of atrial fibrillation with rapid ventricular rate",
    severity: "moderate",
    steps: [
      { order: 1, action: "Assess hemodynamic stability", timing: "Immediate" },
      { order: 2, action: "If unstable: immediate synchronized cardioversion", timing: "Immediate" },
      { order: 3, action: "If stable: rate control with IV agents", timing: "Within 30 minutes" },
      { order: 4, action: "Calculate CHA2DS2-VASc score for anticoagulation decision", timing: "During stabilization" },
      { order: 5, action: "Identify and treat underlying cause (infection, thyroid, etc.)", timing: "Ongoing" },
      { order: 6, action: "Consider rhythm control in appropriate candidates", timing: "After rate control" }
    ],
    firstLineMedications: [
      { name: "Diltiazem", dose: "0.25mg/kg IV over 2 min, then 5-15mg/hr infusion", route: "IV", frequency: "Until rate controlled", notes: "Avoid in HFrEF" },
      { name: "Metoprolol", dose: "2.5-5mg IV every 5 min, max 15mg", route: "IV", frequency: "Then oral maintenance", notes: "Preferred in HFrEF" }
    ],
    secondLineMedications: [
      { name: "Amiodarone", dose: "150mg IV over 10 min, then 1mg/min x 6hr, then 0.5mg/min", route: "IV", frequency: "Continuous", notes: "For rate or rhythm control" },
      { name: "Digoxin", dose: "0.5mg IV, then 0.25mg q6h x 2", route: "IV", frequency: "Loading dose", notes: "Slower onset; adjunct for refractory" },
      { name: "Apixaban", dose: "5mg", route: "Oral", frequency: "Twice daily", notes: "For anticoagulation if CHA2DS2-VASc ≥2 (men) or ≥3 (women)" }
    ],
    adjunctiveTreatments: ["Synchronized cardioversion if unstable", "TEE before cardioversion if >48 hours", "Treat precipitating factors"],
    contraindications: ["Avoid CCBs/digoxin in WPW", "Avoid CCBs in severe HFrEF"],
    warningSymptoms: ["Hypotension", "Chest pain", "Altered mental status", "Pulmonary edema"],
    referralCriteria: ["Failed rate control", "Refractory to antiarrhythmics", "Ablation candidate"],
    followUp: "Rate control optimization; anticoagulation management; rhythm control consideration",
    references: ["AHA/ACC AF Guidelines 2023", "ESC AF Guidelines 2020"],
    lastUpdated: "2025-01-01"
  },

  // DIABETES PROTOCOLS
  {
    id: "diabetic-ketoacidosis",
    name: "Diabetic Ketoacidosis (DKA)",
    category: "Endocrine",
    icdCodes: ["E10.10", "E10.11", "E11.10", "E11.11"],
    description: "Management of diabetic ketoacidosis following ADA 2025 guidelines",
    severity: "life-threatening",
    steps: [
      { order: 1, action: "Confirm diagnosis: glucose >250, pH <7.3, bicarb <18, ketones positive", timing: "Immediate" },
      { order: 2, action: "Establish large-bore IV access x 2", timing: "Immediate" },
      { order: 3, action: "Start aggressive fluid resuscitation with NS", timing: "Immediate" },
      { order: 4, action: "Start insulin infusion (do not bolus)", timing: "After initial fluid resuscitation" },
      { order: 5, action: "Replace potassium when K <5.2 and urine output confirmed", timing: "With fluids/insulin" },
      { order: 6, action: "Add dextrose to fluids when glucose <200", timing: "Continue insulin until anion gap closed" },
      { order: 7, action: "Transition to SC insulin when eating and gap closed", timing: "Overlap IV insulin 1-2 hours" }
    ],
    firstLineMedications: [
      { name: "Normal Saline", dose: "1-1.5L in first hour, then 250-500mL/hr", route: "IV", frequency: "Continuous", notes: "Switch to 0.45% NS when Na normal/high" },
      { name: "Regular Insulin", dose: "0.1 units/kg/hr (no bolus)", route: "IV infusion", frequency: "Continuous", notes: "Reduce to 0.02-0.05 when glucose <200" },
      { name: "Potassium chloride", dose: "20-40 mEq/L of IV fluid", route: "IV", frequency: "With fluids", notes: "If K 3.3-5.2; hold if K >5.2; treat hypokalemia first if K <3.3" }
    ],
    secondLineMedications: [
      { name: "Sodium bicarbonate", dose: "100mEq in 400mL NS over 2 hours", route: "IV", frequency: "If pH <6.9 only", notes: "Controversial - only for severe acidosis" },
      { name: "Phosphate (as potassium phosphate)", dose: "20-30 mEq", route: "IV", frequency: "If phosphate <1", notes: "Replace if severely depleted" }
    ],
    adjunctiveTreatments: ["Continuous cardiac monitoring", "Foley catheter for accurate I/O", "Search for precipitating cause (infection, MI)", "DVT prophylaxis"],
    contraindications: ["Avoid NS bolus if cardiogenic shock", "Avoid IV bicarbonate if pH >6.9"],
    warningSymptoms: ["Cerebral edema (especially pediatric)", "Severe hypokalemia", "ARDS", "Rhabdomyolysis"],
    referralCriteria: ["ICU admission for all moderate-severe DKA", "Pediatric DKA to specialized center"],
    followUp: "Diabetes education; identify precipitating cause; adjust home regimen; sick day rules",
    references: ["ADA Standards of Care 2025", "DKA Management Consensus Statement"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "hypoglycemia",
    name: "Hypoglycemia Management",
    category: "Endocrine",
    icdCodes: ["E16.0", "E16.1", "E16.2"],
    description: "Management of hypoglycemia in diabetic patients",
    severity: "moderate",
    steps: [
      { order: 1, action: "Confirm hypoglycemia: glucose <70mg/dL with symptoms", timing: "Immediate" },
      { order: 2, action: "If conscious and able to swallow: give 15-20g fast-acting carbohydrate", timing: "Immediate" },
      { order: 3, action: "If unconscious or unable to swallow: give glucagon or IV dextrose", timing: "Immediate" },
      { order: 4, action: "Recheck glucose in 15 minutes", timing: "15 minutes" },
      { order: 5, action: "Repeat treatment if glucose still <70", timing: "As needed" },
      { order: 6, action: "Once glucose >70, give a meal or snack", timing: "When recovered" },
      { order: 7, action: "Identify and address cause of hypoglycemia", timing: "Ongoing" }
    ],
    firstLineMedications: [
      { name: "Glucose tablets/gel", dose: "15-20g", route: "Oral", frequency: "Repeat every 15 min if needed", notes: "Preferred for conscious patients" },
      { name: "Dextrose 50%", dose: "25-50mL (12.5-25g)", route: "IV", frequency: "Repeat as needed", notes: "For unconscious or unable to swallow" },
      { name: "Glucagon", dose: "1mg (adults), 0.5mg (<25kg)", route: "IM/SC/Intranasal", frequency: "Once", notes: "For unconscious without IV access" }
    ],
    adjunctiveTreatments: ["IV fluids if dehydrated", "Continuous glucose monitoring after severe episode", "Review and adjust diabetes medications"],
    contraindications: ["Avoid oral glucose if altered consciousness (aspiration risk)"],
    warningSymptoms: ["Seizures", "Loss of consciousness", "Inability to self-treat", "Prolonged hypoglycemia"],
    referralCriteria: ["Recurrent severe hypoglycemia", "Hypoglycemia unawareness", "Hypoglycemia requiring hospitalization"],
    followUp: "Review diabetes regimen; hypoglycemia education; consider CGM; adjust medications",
    references: ["ADA Standards of Care 2025", "Endocrine Society Hypoglycemia Guidelines"],
    lastUpdated: "2025-01-01"
  },

  // INFECTIOUS DISEASE PROTOCOLS
  {
    id: "sepsis",
    name: "Sepsis and Septic Shock",
    category: "Infectious Disease",
    icdCodes: ["A41.9", "R65.20", "R65.21"],
    description: "Early recognition and management of sepsis following Surviving Sepsis 2021 guidelines",
    severity: "life-threatening",
    steps: [
      { order: 1, action: "Screen for sepsis using qSOFA or SIRS criteria", timing: "Immediate" },
      { order: 2, action: "Measure serum lactate", timing: "Immediate" },
      { order: 3, action: "Obtain blood cultures before antibiotics", timing: "Immediate" },
      { order: 4, action: "Administer broad-spectrum antibiotics", timing: "Within 1 hour of recognition" },
      { order: 5, action: "Begin fluid resuscitation with 30mL/kg crystalloid", timing: "Within 3 hours" },
      { order: 6, action: "Apply vasopressors if hypotensive despite fluids", timing: "If MAP <65 after fluids" },
      { order: 7, action: "Reassess volume status and tissue perfusion", timing: "Ongoing" },
      { order: 8, action: "Remeasure lactate if initially elevated", timing: "Within 6 hours" }
    ],
    firstLineMedications: [
      { name: "Normal Saline or Lactated Ringers", dose: "30mL/kg", route: "IV", frequency: "Rapid infusion over 3 hours", notes: "May need more based on response" },
      { name: "Vancomycin", dose: "25-30mg/kg loading", route: "IV", frequency: "Then per protocol", notes: "For MRSA coverage if risk factors" },
      { name: "Cefepime", dose: "2g", route: "IV", frequency: "Every 8 hours", notes: "Broad gram-negative coverage" },
      { name: "Norepinephrine", dose: "0.01-0.3mcg/kg/min", route: "IV infusion", frequency: "Continuous", notes: "First-line vasopressor, target MAP ≥65" }
    ],
    secondLineMedications: [
      { name: "Piperacillin-tazobactam", dose: "4.5g", route: "IV", frequency: "Every 6 hours", notes: "Alternative broad-spectrum" },
      { name: "Meropenem", dose: "1-2g", route: "IV", frequency: "Every 8 hours", notes: "For ESBL or resistant organisms" },
      { name: "Vasopressin", dose: "0.03-0.04 units/min", route: "IV infusion", frequency: "Continuous", notes: "Add if norepinephrine insufficient" },
      { name: "Hydrocortisone", dose: "200mg/day", route: "IV", frequency: "Continuous or divided", notes: "Only if vasopressors failing" }
    ],
    adjunctiveTreatments: ["Source control (drainage, debridement)", "Venous thromboembolism prophylaxis", "Stress ulcer prophylaxis", "Glucose control (target <180)"],
    contraindications: ["Avoid excessive fluid in cardiogenic/pulmonary edema", "Avoid steroids routinely"],
    warningSymptoms: ["Refractory hypotension", "Multi-organ dysfunction", "DIC", "ARDS"],
    referralCriteria: ["ICU admission for septic shock", "Need for mechanical ventilation", "Multiple organ failure"],
    followUp: "De-escalate antibiotics based on cultures; complete appropriate antibiotic course; functional recovery",
    references: ["Surviving Sepsis Campaign 2021", "Sepsis-3 Definition"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "urinary-tract-infection",
    name: "Urinary Tract Infection",
    category: "Infectious Disease",
    icdCodes: ["N39.0", "N30.0", "N10"],
    description: "Management of uncomplicated and complicated urinary tract infections",
    severity: "mild",
    steps: [
      { order: 1, action: "Assess for complicated vs uncomplicated UTI" },
      { order: 2, action: "Obtain urinalysis and culture" },
      { order: 3, action: "Start empiric antibiotics based on local resistance patterns" },
      { order: 4, action: "Adjust therapy based on culture results" },
      { order: 5, action: "Ensure adequate hydration" },
      { order: 6, action: "Follow up to confirm symptom resolution" }
    ],
    firstLineMedications: [
      { name: "Nitrofurantoin", dose: "100mg", route: "Oral", frequency: "Twice daily", duration: "5 days", notes: "For uncomplicated cystitis; avoid if CrCl <30" },
      { name: "Trimethoprim-sulfamethoxazole", dose: "160/800mg", route: "Oral", frequency: "Twice daily", duration: "3 days", notes: "If local resistance <20%" },
      { name: "Fosfomycin", dose: "3g", route: "Oral", frequency: "Single dose", notes: "For uncomplicated cystitis" }
    ],
    secondLineMedications: [
      { name: "Ciprofloxacin", dose: "500mg", route: "Oral", frequency: "Twice daily", duration: "7 days", notes: "For complicated UTI or pyelonephritis" },
      { name: "Ceftriaxone", dose: "1g", route: "IV", frequency: "Once daily", notes: "For pyelonephritis requiring hospitalization" },
      { name: "Amoxicillin-clavulanate", dose: "875/125mg", route: "Oral", frequency: "Twice daily", duration: "7 days", notes: "Alternative for complicated UTI" }
    ],
    adjunctiveTreatments: ["Increased fluid intake", "Cranberry products (limited evidence)", "Void after intercourse"],
    contraindications: ["Avoid nitrofurantoin in renal impairment", "Avoid fluoroquinolones as first-line for uncomplicated"],
    warningSymptoms: ["Fever >101°F", "Flank pain", "Nausea/vomiting", "Signs of sepsis"],
    referralCriteria: ["Recurrent UTIs (≥3/year)", "Structural abnormalities", "Failed initial treatment"],
    followUp: "Confirm symptom resolution; repeat culture only if symptoms persist; address recurrence risk factors",
    references: ["IDSA UTI Guidelines 2011", "AUA Guidelines"],
    lastUpdated: "2025-01-01"
  },

  // NEUROLOGICAL PROTOCOLS
  {
    id: "acute-ischemic-stroke",
    name: "Acute Ischemic Stroke",
    category: "Neurology",
    icdCodes: ["I63.0", "I63.1", "I63.2", "I63.3", "I63.4", "I63.5"],
    description: "Acute management of ischemic stroke following AHA/ASA 2019 guidelines",
    severity: "life-threatening",
    steps: [
      { order: 1, action: "Activate stroke code; obtain time of symptom onset", timing: "Immediate" },
      { order: 2, action: "Obtain non-contrast CT head to rule out hemorrhage", timing: "Within 25 minutes" },
      { order: 3, action: "Assess eligibility for thrombolysis (within 4.5 hours)", timing: "Door-to-needle <60 min" },
      { order: 4, action: "Administer IV alteplase if eligible", timing: "As soon as possible" },
      { order: 5, action: "Consider mechanical thrombectomy for large vessel occlusion", timing: "Within 6-24 hours" },
      { order: 6, action: "Admit to stroke unit or ICU", timing: "Immediately" },
      { order: 7, action: "Start secondary prevention measures", timing: "Within 24-48 hours" }
    ],
    firstLineMedications: [
      { name: "Alteplase (tPA)", dose: "0.9mg/kg, max 90mg (10% bolus, 90% infusion)", route: "IV", frequency: "Once over 60 min", notes: "Within 4.5 hours; strict criteria" },
      { name: "Aspirin", dose: "325mg", route: "Oral/Rectal", frequency: "Within 24-48 hours", notes: "Wait 24 hours if tPA given" }
    ],
    secondLineMedications: [
      { name: "Labetalol", dose: "10-20mg IV", route: "IV", frequency: "Every 10-20 min", notes: "Target BP <185/110 before tPA" },
      { name: "Atorvastatin", dose: "40-80mg", route: "Oral", frequency: "Once daily", notes: "High-intensity statin" },
      { name: "Clopidogrel", dose: "75mg", route: "Oral", frequency: "Once daily", notes: "Alternative or add-on to aspirin" }
    ],
    adjunctiveTreatments: ["Swallow evaluation before oral intake", "DVT prophylaxis", "Glucose control", "Temperature management"],
    contraindications: ["tPA contraindicated if: recent surgery, bleeding, ICH, severe uncontrolled HTN, coagulopathy"],
    warningSymptoms: ["Hemorrhagic transformation", "Malignant edema", "Seizures", "Aspiration pneumonia"],
    referralCriteria: ["All stroke patients to stroke center", "Thrombectomy-capable center for LVO"],
    followUp: "Rehabilitation; secondary prevention optimization; carotid evaluation; cardiac workup for embolic source",
    references: ["AHA/ASA Stroke Guidelines 2019", "AHA/ASA 2021 Updates"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "migraine-acute",
    name: "Acute Migraine Treatment",
    category: "Neurology",
    icdCodes: ["G43.0", "G43.1", "G43.8", "G43.9"],
    description: "Acute treatment of migraine headache",
    severity: "mild",
    steps: [
      { order: 1, action: "Assess headache characteristics and rule out secondary causes" },
      { order: 2, action: "Administer analgesic/abortive therapy early in attack" },
      { order: 3, action: "Consider antiemetic if nausea/vomiting present" },
      { order: 4, action: "Place patient in quiet, dark room" },
      { order: 5, action: "Reassess in 2 hours; consider rescue therapy if needed" },
      { order: 6, action: "Discuss preventive therapy if frequent migraines" }
    ],
    firstLineMedications: [
      { name: "Sumatriptan", dose: "50-100mg", route: "Oral", frequency: "May repeat in 2 hours, max 200mg/day", notes: "Take early in attack" },
      { name: "Ibuprofen", dose: "400-800mg", route: "Oral", frequency: "Once", notes: "Effective for mild-moderate" },
      { name: "Acetaminophen", dose: "1000mg", route: "Oral", frequency: "Once", notes: "For those who cannot take NSAIDs" }
    ],
    secondLineMedications: [
      { name: "Sumatriptan", dose: "6mg", route: "Subcutaneous", frequency: "May repeat in 1 hour", notes: "For severe or vomiting" },
      { name: "Metoclopramide", dose: "10mg", route: "IV/IM/Oral", frequency: "Once", notes: "Antiemetic and may enhance analgesic" },
      { name: "Ketorolac", dose: "30-60mg", route: "IM/IV", frequency: "Once", notes: "For severe or refractory" }
    ],
    adjunctiveTreatments: ["Hydration", "Rest in dark quiet room", "Cold compress", "Caffeine (limited)"],
    contraindications: ["Triptans contraindicated in CAD, uncontrolled HTN, hemiplegic migraine", "Avoid opioids (rebound risk)"],
    warningSymptoms: ["New/different headache", "Worst headache of life", "Fever", "Neurological deficits"],
    referralCriteria: ["Frequent migraines (>4/month)", "Medication overuse", "Refractory to treatment"],
    followUp: "Headache diary; discuss triggers; consider preventive therapy",
    references: ["AHS Acute Migraine Guidelines", "AAN Evidence-Based Guideline"],
    lastUpdated: "2025-01-01"
  },

  // GI PROTOCOLS
  {
    id: "gi-bleeding-upper",
    name: "Upper GI Bleeding",
    category: "Gastroenterology",
    icdCodes: ["K92.0", "K92.1", "K92.2"],
    description: "Management of acute upper gastrointestinal bleeding",
    severity: "severe",
    steps: [
      { order: 1, action: "Assess hemodynamic stability; establish IV access x 2", timing: "Immediate" },
      { order: 2, action: "Resuscitate with crystalloids and blood products as needed", timing: "Immediate" },
      { order: 3, action: "Calculate GBS or Rockall score to risk stratify", timing: "During stabilization" },
      { order: 4, action: "Start IV PPI", timing: "Immediate" },
      { order: 5, action: "Arrange urgent endoscopy", timing: "Within 24 hours (12 hours if high-risk)" },
      { order: 6, action: "Correct coagulopathy if present", timing: "Ongoing" },
      { order: 7, action: "Consider ICU admission if hemodynamically unstable", timing: "Based on assessment" }
    ],
    firstLineMedications: [
      { name: "Pantoprazole", dose: "80mg bolus, then 8mg/hr infusion", route: "IV", frequency: "Continuous", notes: "High-dose PPI for bleeding" },
      { name: "Octreotide", dose: "50mcg bolus, then 25-50mcg/hr", route: "IV", frequency: "Continuous", notes: "For suspected variceal bleeding" }
    ],
    secondLineMedications: [
      { name: "Ceftriaxone", dose: "1g", route: "IV", frequency: "Once daily x 7 days", notes: "Prophylaxis in cirrhotic patients" },
      { name: "Erythromycin", dose: "250mg", route: "IV", frequency: "Once before endoscopy", notes: "Prokinetic to clear stomach" },
      { name: "Tranexamic acid", dose: "1g", route: "IV", frequency: "Every 8 hours", notes: "May reduce transfusion needs (some evidence)" }
    ],
    adjunctiveTreatments: ["Blood transfusion (target Hgb 7-8)", "FFP/platelets if coagulopathic", "Foley catheter for I/O", "NPO before endoscopy"],
    contraindications: ["Avoid NG lavage routinely (no benefit, aspiration risk)"],
    warningSymptoms: ["Ongoing hematemesis", "Hemodynamic instability despite resuscitation", "Need for >6 units PRBC"],
    referralCriteria: ["Endoscopy for all UGIB", "Surgery/IR for rebleeding after endoscopic therapy"],
    followUp: "PPI therapy; H. pylori testing and treatment; discontinue/modify culprit medications",
    references: ["ACG UGIB Guidelines 2021", "BSG Guidelines"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "acute-pancreatitis",
    name: "Acute Pancreatitis",
    category: "Gastroenterology",
    icdCodes: ["K85.0", "K85.1", "K85.2", "K85.9"],
    description: "Management of acute pancreatitis",
    severity: "moderate",
    steps: [
      { order: 1, action: "Confirm diagnosis with 2 of 3: abdominal pain, lipase >3x ULN, imaging" },
      { order: 2, action: "Assess severity (mild, moderately severe, severe)" },
      { order: 3, action: "Aggressive IV fluid resuscitation", timing: "First 12-24 hours" },
      { order: 4, action: "NPO initially, advance diet as tolerated", timing: "Within 24-48 hours if mild" },
      { order: 5, action: "Pain control", timing: "Ongoing" },
      { order: 6, action: "Monitor for complications", timing: "Ongoing" },
      { order: 7, action: "Determine etiology and address", timing: "During admission" }
    ],
    firstLineMedications: [
      { name: "Lactated Ringers", dose: "5-10mL/kg/hr initially, then 3mL/kg/hr", route: "IV", frequency: "Continuous", notes: "Goal-directed resuscitation" },
      { name: "Morphine or Hydromorphone", dose: "Titrate to pain", route: "IV", frequency: "As needed", notes: "Adequate pain control is important" }
    ],
    secondLineMedications: [
      { name: "Meropenem", dose: "1g", route: "IV", frequency: "Every 8 hours", notes: "Only if infected necrosis suspected" }
    ],
    adjunctiveTreatments: ["Early oral feeding when tolerated", "Enteral nutrition if unable to eat", "ERCP for choledocholithiasis if cholangitis"],
    contraindications: ["Avoid prophylactic antibiotics", "Avoid routine ERCP without cholangitis"],
    warningSymptoms: ["Persistent organ failure (>48 hours)", "Infected necrosis", "Abdominal compartment syndrome"],
    referralCriteria: ["Severe pancreatitis to ICU", "Necrotizing pancreatitis to tertiary center"],
    followUp: "Cholecystectomy for gallstone pancreatitis; alcohol cessation; address other etiologies",
    references: ["AGA Acute Pancreatitis Guidelines 2018", "ACG Guidelines"],
    lastUpdated: "2025-01-01"
  },

  // PSYCHIATRIC PROTOCOLS
  {
    id: "acute-agitation",
    name: "Acute Agitation Management",
    category: "Psychiatry",
    icdCodes: ["R45.1", "F23", "F10.231"],
    description: "Management of acute agitation in emergency and inpatient settings",
    severity: "moderate",
    steps: [
      { order: 1, action: "Ensure safety of patient and staff", timing: "Immediate" },
      { order: 2, action: "Attempt verbal de-escalation", timing: "First-line" },
      { order: 3, action: "Offer voluntary oral medications", timing: "If de-escalation fails" },
      { order: 4, action: "Use IM medications if patient refuses oral or unsafe", timing: "If oral refused" },
      { order: 5, action: "Consider restraints only as last resort", timing: "Only if imminent danger" },
      { order: 6, action: "Monitor vital signs and level of sedation", timing: "Ongoing" },
      { order: 7, action: "Identify and treat underlying cause", timing: "As soon as safe" }
    ],
    firstLineMedications: [
      { name: "Lorazepam", dose: "1-2mg", route: "Oral/IM", frequency: "Every 30-60 min as needed", notes: "Preferred in alcohol/benzo withdrawal" },
      { name: "Haloperidol", dose: "2-5mg", route: "IM", frequency: "Every 30-60 min as needed", notes: "For psychosis; avoid in alcohol withdrawal" },
      { name: "Olanzapine", dose: "5-10mg", route: "IM", frequency: "May repeat in 2 hours", notes: "Do not combine with IM benzodiazepines" }
    ],
    secondLineMedications: [
      { name: "Ziprasidone", dose: "10-20mg", route: "IM", frequency: "Every 4 hours, max 40mg/day", notes: "Alternative atypical" },
      { name: "Droperidol", dose: "2.5-5mg", route: "IM/IV", frequency: "May repeat", notes: "Rapid onset; QT monitoring" }
    ],
    adjunctiveTreatments: ["Quiet, low-stimulation environment", "1:1 observation", "Address physical needs (pain, hunger, bladder)"],
    contraindications: ["Avoid IM olanzapine with benzodiazepines", "Avoid haloperidol in anticholinergic toxicity"],
    warningSymptoms: ["Respiratory depression", "Severe hypotension", "Dystonic reactions", "QT prolongation"],
    referralCriteria: ["Psychiatric evaluation for underlying disorder", "Consider involuntary hold if danger to self/others"],
    followUp: "Psychiatric follow-up; medication reconciliation; address substance use",
    references: ["AAEP Consensus Statement on Agitation", "APA Practice Guidelines"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "opioid-overdose",
    name: "Opioid Overdose",
    category: "Toxicology/Emergency",
    icdCodes: ["T40.0X1", "T40.2X1", "T40.4X1"],
    description: "Management of suspected opioid overdose",
    severity: "life-threatening",
    steps: [
      { order: 1, action: "Check responsiveness and call for help", timing: "Immediate" },
      { order: 2, action: "Open airway and assess breathing", timing: "Immediate" },
      { order: 3, action: "Provide rescue breathing if not breathing adequately", timing: "Immediate" },
      { order: 4, action: "Administer naloxone", timing: "Immediate" },
      { order: 5, action: "Repeat naloxone every 2-3 minutes if no response", timing: "Until response" },
      { order: 6, action: "Continue monitoring for renarcotization", timing: "Minimum 2-4 hours" },
      { order: 7, action: "Consider naloxone infusion for long-acting opioids", timing: "If needed" }
    ],
    firstLineMedications: [
      { name: "Naloxone", dose: "0.4-2mg", route: "IV/IM/SC/Intranasal", frequency: "Every 2-3 min as needed", notes: "May need high doses for synthetic opioids" }
    ],
    secondLineMedications: [
      { name: "Naloxone infusion", dose: "2/3 of effective bolus per hour", route: "IV infusion", frequency: "Continuous", notes: "For long-acting opioids (methadone)" }
    ],
    adjunctiveTreatments: ["Bag-mask ventilation if inadequate breathing", "Intubation if unable to protect airway", "IV fluids"],
    contraindications: ["No absolute contraindications in overdose"],
    warningSymptoms: ["Recurrent sedation (renarcotization)", "Aspiration pneumonia", "Pulmonary edema"],
    referralCriteria: ["Addiction medicine referral", "Social work involvement", "Naloxone kit and training on discharge"],
    followUp: "Substance use treatment referral; harm reduction counseling; naloxone prescription",
    references: ["ASAM Guidelines", "AHA ACLS Guidelines"],
    lastUpdated: "2025-01-01"
  },

  // PEDIATRIC PROTOCOLS
  {
    id: "pediatric-fever",
    name: "Pediatric Fever Evaluation",
    category: "Pediatrics",
    icdCodes: ["R50.9"],
    description: "Evaluation and management of fever in children",
    severity: "mild",
    steps: [
      { order: 1, action: "Obtain accurate temperature and history" },
      { order: 2, action: "Assess for source of infection and toxicity" },
      { order: 3, action: "Risk stratify based on age and appearance" },
      { order: 4, action: "Obtain labs/cultures based on risk stratification" },
      { order: 5, action: "Administer antipyretics for comfort" },
      { order: 6, action: "Start empiric antibiotics if high-risk or toxic-appearing" },
      { order: 7, action: "Disposition based on risk and workup results" }
    ],
    firstLineMedications: [
      { name: "Acetaminophen", dose: "10-15mg/kg", route: "Oral/Rectal", frequency: "Every 4-6 hours", notes: "Max 75mg/kg/day or 4g/day" },
      { name: "Ibuprofen", dose: "10mg/kg", route: "Oral", frequency: "Every 6-8 hours", notes: "For children >6 months; max 40mg/kg/day" }
    ],
    secondLineMedications: [
      { name: "Ceftriaxone", dose: "50-75mg/kg", route: "IV/IM", frequency: "Once daily", notes: "For febrile infants <3 months or high-risk" },
      { name: "Ampicillin", dose: "50mg/kg", route: "IV", frequency: "Every 6 hours", notes: "Add for Listeria coverage in neonates" }
    ],
    adjunctiveTreatments: ["Adequate hydration", "Light clothing", "Tepid sponging (not recommended routinely)"],
    contraindications: ["Avoid aspirin in children (Reye syndrome)", "Avoid ibuprofen in dehydrated children"],
    warningSymptoms: ["Petechial rash", "Bulging fontanelle", "Toxic appearance", "Altered mental status", "Inconsolable crying"],
    referralCriteria: ["All febrile neonates <28 days to ED", "Immunocompromised children", "Toxic-appearing children"],
    followUp: "Recheck if fever persists >72 hours; return precautions for warning signs",
    references: ["AAP Febrile Infant Guidelines 2021", "Pediatric Infectious Disease Society"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "pediatric-dehydration",
    name: "Pediatric Dehydration",
    category: "Pediatrics",
    icdCodes: ["E86.0", "E86.1", "E86.9"],
    description: "Assessment and treatment of dehydration in children",
    severity: "moderate",
    steps: [
      { order: 1, action: "Assess degree of dehydration (mild, moderate, severe)" },
      { order: 2, action: "Calculate fluid deficit" },
      { order: 3, action: "Begin oral rehydration therapy if mild-moderate" },
      { order: 4, action: "IV fluids if severe or ORT fails" },
      { order: 5, action: "Replace ongoing losses" },
      { order: 6, action: "Gradually advance diet" },
      { order: 7, action: "Monitor for complications" }
    ],
    firstLineMedications: [
      { name: "Oral Rehydration Solution (Pedialyte)", dose: "50-100mL/kg over 3-4 hours", route: "Oral", frequency: "Small frequent amounts", notes: "For mild-moderate dehydration" },
      { name: "Normal Saline", dose: "20mL/kg bolus", route: "IV", frequency: "May repeat x 2-3", notes: "For severe dehydration" }
    ],
    secondLineMedications: [
      { name: "D5 1/2 NS with 20 mEq KCl/L", dose: "Maintenance + deficit over 24 hours", route: "IV", frequency: "Continuous", notes: "After initial resuscitation" },
      { name: "Ondansetron", dose: "0.1mg/kg (max 4mg)", route: "Oral/IV", frequency: "Once", notes: "To facilitate ORT if vomiting" }
    ],
    adjunctiveTreatments: ["Zinc supplementation for diarrhea in developing countries", "Continue breastfeeding", "BRAT diet (limited evidence)"],
    contraindications: ["Avoid ORT if altered mental status, ileus, or severe dehydration"],
    warningSymptoms: ["Altered mental status", "Prolonged capillary refill >3 sec", "No urine output >8 hours", "Sunken eyes/fontanelle"],
    referralCriteria: ["Severe dehydration", "Failed ORT", "Intractable vomiting", "Concern for surgical abdomen"],
    followUp: "Follow up if symptoms persist or worsen; hydration teaching",
    references: ["WHO ORS Guidelines", "AAP Clinical Practice Guidelines"],
    lastUpdated: "2025-01-01"
  },

  // PAIN MANAGEMENT PROTOCOLS  
  {
    id: "acute-pain-multimodal",
    name: "Multimodal Acute Pain Management",
    category: "Pain Management",
    icdCodes: ["G89.11", "G89.18"],
    description: "Evidence-based multimodal approach to acute pain management",
    severity: "moderate",
    steps: [
      { order: 1, action: "Assess pain severity using appropriate scale (0-10 NRS)" },
      { order: 2, action: "Identify source and expected duration of pain" },
      { order: 3, action: "Start with non-opioid analgesics as foundation" },
      { order: 4, action: "Add adjuvant therapies based on pain type" },
      { order: 5, action: "Add opioids for moderate-severe pain if needed" },
      { order: 6, action: "Incorporate non-pharmacologic therapies" },
      { order: 7, action: "Reassess pain and side effects regularly" }
    ],
    firstLineMedications: [
      { name: "Acetaminophen", dose: "1000mg", route: "Oral/IV", frequency: "Every 6 hours", notes: "Round the clock, max 4g/day" },
      { name: "Ibuprofen", dose: "400-800mg", route: "Oral", frequency: "Every 6-8 hours", notes: "If no contraindications" },
      { name: "Ketorolac", dose: "15-30mg", route: "IV", frequency: "Every 6 hours, max 5 days", notes: "Short-term use only" }
    ],
    secondLineMedications: [
      { name: "Gabapentin", dose: "300mg", route: "Oral", frequency: "Three times daily", notes: "For neuropathic component" },
      { name: "Lidocaine patch", dose: "1-3 patches", route: "Topical", frequency: "12 hours on/12 hours off", notes: "For localized pain" },
      { name: "Oxycodone", dose: "5-10mg", route: "Oral", frequency: "Every 4-6 hours as needed", notes: "Lowest effective dose, shortest duration" }
    ],
    adjunctiveTreatments: ["Ice/heat therapy", "Physical therapy", "TENS unit", "Relaxation techniques", "Regional anesthesia when applicable"],
    contraindications: ["Avoid NSAIDs in renal impairment, GI bleeding, cardiac disease", "Limit opioids in opioid-naive elderly"],
    warningSymptoms: ["Severe pain despite treatment", "Signs of compartment syndrome", "Neurological changes"],
    referralCriteria: ["Pain specialist for chronic pain development", "Anesthesia for nerve blocks"],
    followUp: "Taper opioids as pain improves; transition to non-opioid regimen; address chronic pain risk",
    references: ["APS Acute Pain Guidelines", "ERAS Society Guidelines"],
    lastUpdated: "2025-01-01"
  }
];

export const getProtocolById = (id: string): TreatmentProtocol | undefined => {
  return treatmentProtocols.find(p => p.id === id);
};

export const getProtocolsByCategory = (category: string): TreatmentProtocol[] => {
  return treatmentProtocols.filter(p => 
    p.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getProtocolsByICD = (icdCode: string): TreatmentProtocol[] => {
  return treatmentProtocols.filter(p => 
    p.icdCodes.some(code => code.startsWith(icdCode))
  );
};

export const searchProtocols = (query: string): TreatmentProtocol[] => {
  const searchLower = query.toLowerCase();
  return treatmentProtocols.filter(p =>
    p.name.toLowerCase().includes(searchLower) ||
    p.category.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower)
  );
};

export const getSeverityProtocols = (severity: TreatmentProtocol['severity']): TreatmentProtocol[] => {
  return treatmentProtocols.filter(p => p.severity === severity);
};

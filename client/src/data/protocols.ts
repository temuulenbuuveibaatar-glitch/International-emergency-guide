// Updated Emergency Protocols - Latest International Standards 2025
export const emergencyProtocols = [
  // Cardiac Emergencies - AHA 2025 Guidelines
  {
    id: "cpr-2025",
    title: "CPR (AHA 2025 Guidelines)",
    description: "Updated high-quality CPR with hands-only emphasis for untrained bystanders",
    category: "cardiac",
    lastUpdated: "2025-01-01",
    certificationLevel: "BLS",
    estimatedTime: "Until EMS arrives",
    guidelines: "AHA 2025"
  },
  {
    id: "heart-attack-2025",
    title: "Acute Coronary Syndrome Protocol",
    description: "STEMI/NSTEMI recognition, aspirin administration, and rapid transport guidelines",
    category: "cardiac",
    lastUpdated: "2025-01-01",
    certificationLevel: "ACLS",
    estimatedTime: "5-15 minutes",
    guidelines: "AHA 2025"
  },
  
  // Airway Emergencies
  {
    id: "choking-2025",
    title: "Choking Response (Updated Protocol)",
    description: "Back blows first approach, abdominal thrusts, and continuous chest compressions for unconscious victims",
    category: "airway",
    lastUpdated: "2025-01-01",
    certificationLevel: "Basic First Aid",
    estimatedTime: "2-5 minutes",
    guidelines: "ARC 2025"
  },
  {
    id: "respiratory-distress-2025",
    title: "Respiratory Emergency Protocol",
    description: "Asthma, COPD, and severe dyspnea management with position optimization",
    category: "respiratory",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "Ongoing",
    guidelines: "ERS 2025"
  },

  // Trauma Protocols - ATLS 10th Edition
  {
    id: "bleeding-control-2025",
    title: "Hemorrhage Control (Stop the Bleed)",
    description: "Tourniquet application, wound packing, and pressure point techniques",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "Stop the Bleed",
    estimatedTime: "1-3 minutes",
    guidelines: "ACS 2025"
  },
  {
    id: "trauma-assessment-2025",
    title: "Primary Trauma Survey (ABCDE)",
    description: "Systematic assessment: Airway with C-spine, Breathing, Circulation, Disability, Exposure",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "5-10 minutes",
    guidelines: "ATLS 10th"
  },
  {
    id: "burns-2025",
    title: "Burn Management Protocol",
    description: "Rule of nines assessment, cooling techniques, and fluid resuscitation calculations",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "5-15 minutes",
    guidelines: "ABA 2025"
  },
  {
    id: "fractures-2025",
    title: "Fracture Stabilization Protocol",
    description: "Splinting techniques, neurovascular assessment, and pain management",
    category: "orthopedic",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "10-20 minutes",
    guidelines: "AAOS 2025"
  },
  {
    id: "spinal-injury-2025",
    title: "Spinal Injury Management",
    description: "C-spine immobilization, log rolling techniques, and neurological assessment",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "15-30 minutes",
    guidelines: "ATLS 10th"
  },
  {
    id: "head-injury-2025",
    title: "Traumatic Brain Injury Protocol",
    description: "GCS assessment, intracranial pressure management, and cervical spine protection",
    category: "neurological",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "Ongoing",
    guidelines: "BTF 2024"
  },

  // Neurological Emergencies
  {
    id: "stroke-befast-2025",
    title: "Stroke Assessment (BE-FAST)",
    description: "Balance, Eyes, Face, Arms, Speech, Time - enhanced stroke recognition protocol",
    category: "neurological",
    lastUpdated: "2025-01-01",
    certificationLevel: "Basic First Aid",
    estimatedTime: "2-5 minutes",
    guidelines: "ASA 2025"
  },
  {
    id: "seizure-2025",
    title: "Seizure & Status Epilepticus",
    description: "Seizure safety, benzodiazepine administration, and post-ictal care",
    category: "neurological",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "Variable",
    guidelines: "AES 2025"
  },

  // Allergic & Anaphylaxis
  {
    id: "anaphylaxis-2025",
    title: "Anaphylaxis Management",
    description: "Epinephrine auto-injector use, airway management, and biphasic reaction monitoring",
    category: "allergic",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "5-30 minutes",
    guidelines: "WAO 2025"
  },

  // Environmental Emergencies
  {
    id: "hypothermia-2025",
    title: "Hypothermia Management",
    description: "Staged rewarming, core temperature monitoring, and afterdrop prevention",
    category: "environmental",
    lastUpdated: "2025-01-01",
    certificationLevel: "Wilderness First Aid",
    estimatedTime: "1-6 hours",
    guidelines: "WMS 2025"
  },
  {
    id: "heat-illness-2025",
    title: "Heat-Related Illness Protocol",
    description: "Heat exhaustion vs stroke differentiation and aggressive cooling strategies",
    category: "environmental",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "15-60 minutes",
    guidelines: "ACSM 2025"
  },
  {
    id: "drowning-2025",
    title: "Drowning & Water Rescue",
    description: "Water rescue safety, rescue breathing, and hypothermia prevention",
    category: "environmental",
    lastUpdated: "2025-01-01",
    certificationLevel: "Water Safety",
    estimatedTime: "Variable",
    guidelines: "ILCOR 2025"
  },

  // Metabolic & Endocrine
  {
    id: "diabetic-emergency-2025",
    title: "Diabetic Emergency Protocol",
    description: "Hypoglycemia vs DKA recognition, glucose administration, and insulin protocols",
    category: "metabolic",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "10-30 minutes",
    guidelines: "ADA 2025"
  },

  // Toxicological Emergencies
  {
    id: "overdose-naloxone-2025",
    title: "Opioid Overdose & Naloxone",
    description: "Naloxone administration, airway management, and post-reversal monitoring",
    category: "toxicological",
    lastUpdated: "2025-01-01",
    certificationLevel: "Naloxone Certified",
    estimatedTime: "Variable",
    guidelines: "SAMHSA 2025"
  },
  {
    id: "poisoning-2025",
    title: "Poisoning & Decontamination",
    description: "Poison control consultation, decontamination procedures, and antidote administration",
    category: "toxicological",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "Variable",
    guidelines: "AAPCC 2025"
  },

  // Shock Management
  {
    id: "shock-2025",
    title: "Shock Recognition & Management",
    description: "Cardiogenic, hypovolemic, distributive, and obstructive shock protocols",
    category: "critical",
    lastUpdated: "2025-01-01",
    certificationLevel: "ACLS",
    estimatedTime: "Ongoing",
    guidelines: "SSC 2025"
  },

  // Pediatric Emergencies
  {
    id: "pediatric-emergencies-2025",
    title: "Pediatric Emergency Protocols",
    description: "Age-specific procedures, pediatric assessment triangle, and family-centered care",
    category: "pediatric",
    lastUpdated: "2025-01-01",
    certificationLevel: "PALS",
    estimatedTime: "Variable",
    guidelines: "AAP 2025"
  },
  {
    id: "childbirth-2025",
    title: "Emergency Childbirth",
    description: "Labor assessment, delivery assistance, and neonatal resuscitation basics",
    category: "obstetric",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "Variable",
    guidelines: "ACOG 2025"
  },

  // Psychiatric Emergencies
  {
    id: "mental-health-2025",
    title: "Mental Health Crisis Intervention",
    description: "De-escalation, suicide assessment, and safe transport for psychiatric emergencies",
    category: "psychiatric",
    lastUpdated: "2025-01-01",
    certificationLevel: "CIT",
    estimatedTime: "Variable",
    guidelines: "APA 2025"
  },

  // Special Circumstances
  {
    id: "electrical-injury-2025",
    title: "Electrical Injury Protocol",
    description: "Scene safety, cardiac monitoring, and burn assessment for electrical injuries",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "EMT",
    estimatedTime: "Variable",
    guidelines: "NFPA 2025"
  },
  {
    id: "eye-injury-2025",
    title: "Eye Injury Management",
    description: "Chemical burns, foreign bodies, and penetrating eye injury protocols",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "5-15 minutes",
    guidelines: "AAO 2025"
  },
  {
    id: "dental-emergency-2025",
    title: "Dental Emergency Protocol",
    description: "Tooth avulsion, fractures, and oral bleeding management",
    category: "dental",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "5-20 minutes",
    guidelines: "ADA 2025"
  },
  {
    id: "animal-bites-2025",
    title: "Animal Bite Management",
    description: "Wound care, rabies risk assessment, and infection prevention",
    category: "trauma",
    lastUpdated: "2025-01-01",
    certificationLevel: "First Aid",
    estimatedTime: "10-30 minutes",
    guidelines: "CDC 2025"
  },

  // Fire Safety
  {
    id: "fire-emergency-2025",
    title: "Fire Emergency Response",
    description: "RACE protocol (Rescue, Alert, Confine, Extinguish) and evacuation procedures",
    category: "fire",
    lastUpdated: "2025-01-01",
    certificationLevel: "Fire Safety",
    estimatedTime: "Variable",
    guidelines: "NFPA 2025"
  },
  {
    id: "fire-safety-equipment-2025",
    title: "Fire Safety Equipment Use",
    description: "Fire extinguisher types, sprinkler systems, and emergency evacuation equipment",
    category: "fire",
    lastUpdated: "2025-01-01",
    certificationLevel: "Fire Safety",
    estimatedTime: "Variable",
    guidelines: "NFPA 2025"
  }
];

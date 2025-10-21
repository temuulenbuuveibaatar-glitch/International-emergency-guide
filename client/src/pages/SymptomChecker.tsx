import { useTranslation } from "react-i18next";
import { useState, useCallback } from "react";
import { Check, AlertCircle, Search, Brain, Heart, Thermometer, Activity, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BodyPart = "head" | "chest" | "abdomen" | "limbs" | "skin" | "general" | "neurological" | "cardiovascular" | "respiratory" | "gastrointestinal";

type SymptomSeverity = "mild" | "moderate" | "severe" | "critical";

type Symptom = {
  id: string;
  name: string;
  bodyPart: BodyPart;
  isCritical?: boolean;
  severity?: SymptomSeverity;
  duration?: string;
  description: string;
  relatedSymptoms?: string[];
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1 = Emergency, 5 = Self-care
};

type Condition = {
  id: string;
  name: string;
  symptoms: string[];
  urgency: "emergency" | "urgent" | "semi-urgent" | "non-urgent";
  description: string;
  recommendation: string;
  probability: number;
  specialistRequired?: string;
  followUpActions: string[];
  redFlags: string[];
  selfCareOptions?: string[];
  estimatedTimeToSeeCare: string;
};

type PatientInfo = {
  age?: number;
  gender?: "male" | "female" | "other";
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
  };
};

// Comprehensive symptom database with advanced triage capabilities
const symptoms: Symptom[] = [
  // Neurological Symptoms
  { 
    id: "severe_headache", 
    name: "Severe Sudden Headache", 
    bodyPart: "neurological", 
    isCritical: true,
    description: "Sudden onset of the worst headache of your life",
    triageLevel: 1,
    relatedSymptoms: ["nausea_vomiting", "vision_changes", "neck_stiffness"]
  },
  { 
    id: "headache", 
    name: "Headache", 
    bodyPart: "head",
    description: "Pain in the head or upper neck",
    triageLevel: 4,
    relatedSymptoms: ["vision_changes", "nausea_vomiting"]
  },
  { 
    id: "dizziness", 
    name: "Dizziness/Vertigo", 
    bodyPart: "neurological",
    description: "Feeling of spinning or loss of balance",
    triageLevel: 3,
    relatedSymptoms: ["nausea_vomiting", "hearing_loss"]
  },
  { 
    id: "vision_changes", 
    name: "Vision Changes", 
    bodyPart: "neurological",
    description: "Sudden loss of vision, double vision, or visual disturbances",
    triageLevel: 2,
    relatedSymptoms: ["severe_headache", "difficulty_speaking"]
  },
  { 
    id: "difficulty_speaking", 
    name: "Speech Difficulties", 
    bodyPart: "neurological", 
    isCritical: true,
    description: "Slurred speech, inability to speak, or trouble understanding speech",
    triageLevel: 1,
    relatedSymptoms: ["facial_drooping", "arm_weakness"]
  },
  { 
    id: "facial_drooping", 
    name: "Facial Drooping", 
    bodyPart: "neurological", 
    isCritical: true,
    description: "One side of face droops or feels numb",
    triageLevel: 1,
    relatedSymptoms: ["difficulty_speaking", "arm_weakness"]
  },
  { 
    id: "arm_weakness", 
    name: "Arm Weakness", 
    bodyPart: "neurological", 
    isCritical: true,
    description: "Sudden weakness or numbness in arm, especially one side",
    triageLevel: 1,
    relatedSymptoms: ["difficulty_speaking", "facial_drooping"]
  },
  { 
    id: "confusion", 
    name: "Confusion/Altered Mental State", 
    bodyPart: "neurological", 
    isCritical: true,
    description: "Sudden confusion, disorientation, or altered consciousness",
    triageLevel: 1,
    relatedSymptoms: ["severe_headache", "fever"]
  },
  { 
    id: "seizure", 
    name: "Seizure", 
    bodyPart: "neurological", 
    isCritical: true,
    description: "Uncontrolled electrical activity in the brain causing convulsions",
    triageLevel: 1,
    relatedSymptoms: ["confusion", "loss_of_consciousness"]
  },
  { 
    id: "neck_stiffness", 
    name: "Neck Stiffness", 
    bodyPart: "neurological",
    description: "Inability to flex neck forward due to stiffness",
    triageLevel: 2,
    relatedSymptoms: ["severe_headache", "fever", "light_sensitivity"]
  },
  
  // Cardiovascular Symptoms
  { 
    id: "chest_pain", 
    name: "Chest Pain", 
    bodyPart: "cardiovascular", 
    isCritical: true,
    description: "Pain, pressure, or tightness in chest",
    triageLevel: 1,
    relatedSymptoms: ["shortness_of_breath", "arm_pain", "nausea_vomiting"]
  },
  { 
    id: "shortness_of_breath", 
    name: "Shortness of Breath", 
    bodyPart: "respiratory", 
    isCritical: true,
    description: "Difficulty breathing or feeling out of breath",
    triageLevel: 1,
    relatedSymptoms: ["chest_pain", "palpitations", "leg_swelling"]
  },
  { 
    id: "palpitations", 
    name: "Palpitations", 
    bodyPart: "cardiovascular",
    description: "Feeling of rapid, strong, or irregular heartbeat",
    triageLevel: 3,
    relatedSymptoms: ["chest_pain", "shortness_of_breath", "dizziness"]
  },
  { 
    id: "arm_pain", 
    name: "Arm Pain", 
    bodyPart: "cardiovascular",
    description: "Pain in arm, especially left arm with chest symptoms",
    triageLevel: 2,
    relatedSymptoms: ["chest_pain", "jaw_pain", "shortness_of_breath"]
  },
  { 
    id: "leg_swelling", 
    name: "Leg Swelling", 
    bodyPart: "cardiovascular",
    description: "Swelling in legs, ankles, or feet",
    triageLevel: 3,
    relatedSymptoms: ["shortness_of_breath", "fatigue", "rapid_weight_gain"]
  },
  { 
    id: "fainting", 
    name: "Fainting/Syncope", 
    bodyPart: "cardiovascular", 
    isCritical: true,
    description: "Temporary loss of consciousness",
    triageLevel: 2,
    relatedSymptoms: ["palpitations", "chest_pain", "dizziness"]
  },
  
  // Respiratory Symptoms
  { 
    id: "severe_breathing_difficulty", 
    name: "Severe Breathing Difficulty", 
    bodyPart: "respiratory", 
    isCritical: true,
    description: "Unable to speak in full sentences due to breathlessness",
    triageLevel: 1,
    relatedSymptoms: ["chest_pain", "blue_lips", "wheezing"]
  },
  { 
    id: "wheezing", 
    name: "Wheezing", 
    bodyPart: "respiratory",
    description: "High-pitched whistling sound when breathing",
    triageLevel: 3,
    relatedSymptoms: ["shortness_of_breath", "cough", "chest_tightness"]
  },
  { 
    id: "cough_blood", 
    name: "Coughing Blood", 
    bodyPart: "respiratory", 
    isCritical: true,
    description: "Blood in sputum or coughing up blood",
    triageLevel: 1,
    relatedSymptoms: ["shortness_of_breath", "chest_pain"]
  },
  { 
    id: "blue_lips", 
    name: "Blue Lips/Fingernails", 
    bodyPart: "respiratory", 
    isCritical: true,
    description: "Bluish discoloration of lips or fingernails",
    triageLevel: 1,
    relatedSymptoms: ["severe_breathing_difficulty", "confusion"]
  },
  
  // Gastrointestinal Symptoms
  { 
    id: "severe_abdominal_pain", 
    name: "Severe Abdominal Pain", 
    bodyPart: "gastrointestinal", 
    isCritical: true,
    description: "Intense, sudden onset abdominal pain",
    triageLevel: 1,
    relatedSymptoms: ["nausea_vomiting", "fever", "inability_to_pass_gas"]
  },
  { 
    id: "abdominal_pain", 
    name: "Abdominal Pain", 
    bodyPart: "gastrointestinal",
    description: "Pain or discomfort in the abdomen",
    triageLevel: 3,
    relatedSymptoms: ["nausea_vomiting", "diarrhea", "constipation"]
  },
  { 
    id: "vomiting_blood", 
    name: "Vomiting Blood", 
    bodyPart: "gastrointestinal", 
    isCritical: true,
    description: "Blood in vomit or coffee-ground appearing vomit",
    triageLevel: 1,
    relatedSymptoms: ["abdominal_pain", "black_stools", "dizziness"]
  },
  { 
    id: "black_stools", 
    name: "Black/Tarry Stools", 
    bodyPart: "gastrointestinal", 
    isCritical: true,
    description: "Dark, tarry stools indicating possible internal bleeding",
    triageLevel: 1,
    relatedSymptoms: ["vomiting_blood", "abdominal_pain", "weakness"]
  },
  { 
    id: "diarrhea", 
    name: "Diarrhea", 
    bodyPart: "gastrointestinal",
    description: "Loose, watery stools",
    triageLevel: 4,
    relatedSymptoms: ["dehydration", "fever", "abdominal_pain"]
  },
  { 
    id: "constipation", 
    name: "Constipation", 
    bodyPart: "gastrointestinal",
    description: "Difficulty passing stools",
    triageLevel: 5,
    relatedSymptoms: ["abdominal_pain", "bloating"]
  },
  
  // General Symptoms
  { 
    id: "high_fever", 
    name: "High Fever (>39°C/102°F)", 
    bodyPart: "general", 
    isCritical: true,
    description: "Body temperature above 39°C (102°F)",
    triageLevel: 2,
    relatedSymptoms: ["chills", "sweating", "dehydration"]
  },
  { 
    id: "fever", 
    name: "Fever", 
    bodyPart: "general",
    description: "Elevated body temperature",
    triageLevel: 4,
    relatedSymptoms: ["chills", "fatigue", "headache"]
  },
  { 
    id: "severe_dehydration", 
    name: "Severe Dehydration", 
    bodyPart: "general", 
    isCritical: true,
    description: "Signs of severe fluid loss",
    triageLevel: 2,
    relatedSymptoms: ["dizziness", "dry_mouth", "decreased_urination"]
  },
  { 
    id: "fatigue", 
    name: "Fatigue", 
    bodyPart: "general",
    description: "Extreme tiredness or lack of energy",
    triageLevel: 5,
    relatedSymptoms: ["weakness", "difficulty_concentrating"]
  },
  { 
    id: "nausea_vomiting", 
    name: "Nausea/Vomiting", 
    bodyPart: "general",
    description: "Feeling sick to stomach or throwing up",
    triageLevel: 4,
    relatedSymptoms: ["abdominal_pain", "diarrhea", "dehydration"]
  },
  
  // Skin/External Symptoms
  { 
    id: "severe_allergic_reaction", 
    name: "Severe Allergic Reaction", 
    bodyPart: "skin", 
    isCritical: true,
    description: "Widespread rash, swelling, difficulty breathing",
    triageLevel: 1,
    relatedSymptoms: ["shortness_of_breath", "swelling", "rash"]
  },
  { 
    id: "rash", 
    name: "Rash", 
    bodyPart: "skin",
    description: "Skin irritation or eruption",
    triageLevel: 4,
    relatedSymptoms: ["itching", "fever"]
  },
  { 
    id: "severe_burn", 
    name: "Severe Burn", 
    bodyPart: "skin", 
    isCritical: true,
    description: "Third-degree burn or large area burned",
    triageLevel: 1,
    relatedSymptoms: ["pain", "blisters", "shock"]
  }
];

const conditions: Condition[] = [
  {
    id: "stroke",
    name: "Stroke (Acute)",
    symptoms: ["severe_headache", "dizziness", "vision_changes", "difficulty_speaking", "facial_drooping", "arm_weakness", "confusion"],
    urgency: "emergency",
    description: "Acute stroke occurs when blood flow to the brain is interrupted. Time-critical emergency requiring immediate intervention.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. Use FAST assessment: Face drooping, Arm weakness, Speech difficulties, Time to call emergency services.",
    probability: 0.95,
    specialistRequired: "Neurologist/Emergency Medicine",
    followUpActions: [
      "Immediate transport to stroke center",
      "CT/MRI brain imaging",
      "Neurological assessment",
      "Potential thrombolytic therapy"
    ],
    redFlags: [
      "Sudden onset worst headache of life",
      "Rapid neurological deterioration",
      "Loss of consciousness",
      "Seizure activity"
    ],
    estimatedTimeToSeeCare: "Within 15 minutes"
  },
  {
    id: "heart_attack",
    name: "Myocardial Infarction (STEMI/NSTEMI)",
    symptoms: ["chest_pain", "shortness_of_breath", "nausea_vomiting", "arm_pain", "fainting", "severe_dehydration"],
    urgency: "emergency",
    description: "Acute coronary syndrome with blocked coronary artery. Life-threatening emergency requiring immediate cardiac intervention.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. Chew 325mg aspirin if not allergic. Rest in semi-upright position.",
    probability: 0.92,
    specialistRequired: "Cardiologist/Emergency Medicine",
    followUpActions: [
      "12-lead ECG immediately",
      "Cardiac enzymes (troponin)",
      "Chest X-ray",
      "Cardiac catheterization if indicated"
    ],
    redFlags: [
      "Chest pain >30 minutes duration",
      "Hemodynamic instability",
      "Pulmonary edema",
      "Cardiogenic shock"
    ],
    estimatedTimeToSeeCare: "Within 10 minutes"
  },
  {
    id: "anaphylaxis",
    name: "Anaphylactic Shock",
    symptoms: ["severe_allergic_reaction", "shortness_of_breath", "severe_breathing_difficulty", "fainting", "rash"],
    urgency: "emergency",
    description: "Life-threatening systemic allergic reaction causing airway compromise and cardiovascular collapse.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. Use epinephrine auto-injector if available. Position patient supine with legs elevated.",
    probability: 0.88,
    specialistRequired: "Emergency Medicine/Allergy-Immunology",
    followUpActions: [
      "Epinephrine administration",
      "IV fluids and vasopressors",
      "Corticosteroids",
      "H1/H2 antihistamines"
    ],
    redFlags: [
      "Rapid progression of symptoms",
      "Respiratory distress",
      "Hypotension/shock",
      "Loss of consciousness"
    ],
    estimatedTimeToSeeCare: "Within 5 minutes"
  },
  {
    id: "meningitis",
    name: "Bacterial Meningitis",
    symptoms: ["severe_headache", "neck_stiffness", "high_fever", "confusion", "rash"],
    urgency: "emergency",
    description: "Infection of protective membranes covering brain and spinal cord. Medical emergency with high mortality if untreated.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. Time-critical condition requiring immediate antibiotic therapy.",
    probability: 0.85,
    specialistRequired: "Infectious Disease/Neurology",
    followUpActions: [
      "Lumbar puncture for CSF analysis",
      "Blood cultures",
      "Immediate empiric antibiotics",
      "Corticosteroids"
    ],
    redFlags: [
      "Petechial rash",
      "Altered mental status",
      "Seizures",
      "Focal neurological deficits"
    ],
    estimatedTimeToSeeCare: "Within 30 minutes"
  },
  {
    id: "pulmonary_embolism",
    name: "Pulmonary Embolism",
    symptoms: ["chest_pain", "severe_breathing_difficulty", "cough_blood", "fainting", "leg_swelling"],
    urgency: "emergency",
    description: "Blood clot blocking pulmonary arteries. Life-threatening condition requiring immediate anticoagulation.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. High suspicion requires urgent imaging and anticoagulation.",
    probability: 0.78,
    specialistRequired: "Emergency Medicine/Pulmonology",
    followUpActions: [
      "CT pulmonary angiogram (CTPA)",
      "D-dimer and arterial blood gas",
      "Echocardiogram",
      "Anticoagulation therapy"
    ],
    redFlags: [
      "Massive PE with hemodynamic instability",
      "Right heart strain",
      "Hypoxemia",
      "Syncope"
    ],
    estimatedTimeToSeeCare: "Within 1 hour"
  },
  {
    id: "appendicitis",
    name: "Acute Appendicitis",
    symptoms: ["severe_abdominal_pain", "nausea_vomiting", "fever", "constipation"],
    urgency: "urgent",
    description: "Inflammation of appendix requiring surgical intervention. Risk of perforation if delayed.",
    recommendation: "Seek immediate medical attention. NPO (nothing by mouth). Avoid pain medications until evaluated.",
    probability: 0.82,
    specialistRequired: "General Surgery",
    followUpActions: [
      "CT abdomen/pelvis with contrast",
      "Complete blood count",
      "Surgical consultation",
      "Laparoscopic appendectomy"
    ],
    redFlags: [
      "Signs of perforation",
      "Peritonitis",
      "Sepsis",
      "Abscess formation"
    ],
    estimatedTimeToSeeCare: "Within 4 hours"
  },
  {
    id: "diabetic_ketoacidosis",
    name: "Diabetic Ketoacidosis (DKA)",
    symptoms: ["high_fever", "severe_dehydration", "nausea_vomiting", "confusion", "fatigue"],
    urgency: "emergency",
    description: "Life-threatening complication of diabetes with severe hyperglycemia and ketosis.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. Requires immediate fluid resuscitation and insulin therapy.",
    probability: 0.75,
    specialistRequired: "Endocrinology/Emergency Medicine",
    followUpActions: [
      "Arterial blood gas analysis",
      "Serum glucose and ketones",
      "Electrolyte monitoring",
      "IV insulin and fluids"
    ],
    redFlags: [
      "Kussmaul breathing",
      "Severe dehydration",
      "Altered mental status",
      "Hyperkalemia"
    ],
    estimatedTimeToSeeCare: "Within 30 minutes"
  },
  {
    id: "severe_asthma",
    name: "Severe Asthma Exacerbation",
    symptoms: ["severe_breathing_difficulty", "wheezing", "blue_lips", "fatigue", "palpitations"],
    urgency: "emergency",
    description: "Life-threatening asthma attack with severe airway obstruction and hypoxemia.",
    recommendation: "CALL EMERGENCY SERVICES (103). Use rescue inhaler. Sit upright, remain calm.",
    probability: 0.87,
    specialistRequired: "Emergency Medicine/Pulmonology",
    followUpActions: [
      "Peak flow measurement",
      "Arterial blood gas",
      "Chest X-ray",
      "High-dose bronchodilators"
    ],
    redFlags: [
      "Silent chest",
      "Cyanosis",
      "Exhaustion",
      "Inability to speak"
    ],
    estimatedTimeToSeeCare: "Within 20 minutes"
  },
  {
    id: "migraine_severe",
    name: "Severe Migraine with Aura",
    symptoms: ["severe_headache", "vision_changes", "nausea_vomiting", "dizziness"],
    urgency: "urgent",
    description: "Severe migraine headache with neurological symptoms requiring medical evaluation.",
    recommendation: "Seek medical attention if first severe headache or change in pattern. Rest in dark, quiet room.",
    probability: 0.65,
    specialistRequired: "Neurology",
    followUpActions: [
      "Neurological examination",
      "Consider brain imaging if atypical",
      "Migraine-specific therapy",
      "Preventive medication review"
    ],
    redFlags: [
      "First severe headache",
      "Change in headache pattern",
      "Neurological deficits",
      "Fever with headache"
    ],
    selfCareOptions: [
      "Rest in dark, quiet environment",
      "Apply cold compress",
      "Stay hydrated",
      "Avoid triggers"
    ],
    estimatedTimeToSeeCare: "Within 2-4 hours"
  },
  {
    id: "gastroenteritis_viral",
    name: "Viral Gastroenteritis",
    symptoms: ["diarrhea", "nausea_vomiting", "abdominal_pain", "fever", "fatigue"],
    urgency: "non-urgent",
    description: "Self-limiting viral infection of gastrointestinal tract. Usually resolves with supportive care.",
    recommendation: "Stay hydrated with clear fluids. Rest. Gradual diet advancement. Monitor for dehydration.",
    probability: 0.72,
    followUpActions: [
      "Oral rehydration therapy",
      "BRAT diet when tolerated",
      "Monitor fluid balance",
      "Return if worsening"
    ],
    redFlags: [
      "Signs of severe dehydration",
      "Blood in stool",
      "High fever >39°C",
      "Severe abdominal pain"
    ],
    selfCareOptions: [
      "Clear fluids (water, broth, electrolyte solutions)",
      "Rest and avoid solid foods initially",
      "Gradual reintroduction of bland foods",
      "Avoid dairy and caffeine"
    ],
    estimatedTimeToSeeCare: "Self-care, seek help if worsening"
  }
];

export default function SymptomChecker() {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Condition[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasCriticalSymptoms, setHasCriticalSymptoms] = useState(false);

  const bodyPartSections: Record<BodyPart, string> = {
    head: "Head",
    neurological: "Neurological",
    chest: "Chest",
    cardiovascular: "Cardiovascular",
    respiratory: "Respiratory",
    abdomen: "Abdomen",
    gastrointestinal: "Gastrointestinal",
    limbs: "Arms & Legs",
    skin: "Skin",
    general: "General Symptoms"
  };

  const toggleSymptom = (symptomId: string) => {
    const symptom = symptoms.find(s => s.id === symptomId);
    
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(prev => prev.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms(prev => [...prev, symptomId]);
    }

    // Check if any critical symptoms are selected
    const selectedCritical = symptoms
      .filter(s => selectedSymptoms.includes(s.id) || s.id === symptomId)
      .some(s => s.isCritical);
    
    setHasCriticalSymptoms(selectedCritical);
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    // Find matching conditions based on symptoms
    const matchedConditions = conditions.filter(condition => {
      // Calculate how many of the condition's symptoms match the selected symptoms
      const matchingSymptoms = condition.symptoms.filter(symptomId => 
        selectedSymptoms.includes(symptomId)
      );
      
      // Require at least 2 matching symptoms to include in results
      // And at least 30% of the condition's symptoms should match
      return matchingSymptoms.length >= 2 && 
             (matchingSymptoms.length / condition.symptoms.length) >= 0.3;
    });

    // Sort by urgency and number of matching symptoms
    const sortedConditions = [...matchedConditions].sort((a, b) => {
      const urgencyOrder = { "emergency": 0, "urgent": 1, "semi-urgent": 2, "non-urgent": 3 };
      
      // First by urgency
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      
      // Then by number of matching symptoms
      const aMatchCount = a.symptoms.filter(s => selectedSymptoms.includes(s)).length;
      const bMatchCount = b.symptoms.filter(s => selectedSymptoms.includes(s)).length;
      
      return bMatchCount - aMatchCount;
    });

    setResults(sortedConditions);
    setShowResults(true);
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setResults([]);
    setShowResults(false);
    setHasCriticalSymptoms(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-600';
      case 'urgent': return 'bg-amber-500';
      case 'semi-urgent': return 'bg-yellow-500';
      case 'non-urgent': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('symptoms.title')}
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {t('symptoms.description')}
              </p>

              {hasCriticalSymptoms && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-600">Critical Symptoms Detected</h3>
                      <p className="text-gray-700">You've selected one or more symptoms that may indicate a medical emergency. Please consider calling emergency services (103) immediately.</p>
                    </div>
                  </div>
                </div>
              )}

              {!showResults ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select Your Symptoms</h2>
                  
                  {Object.entries(bodyPartSections).map(([part, label]) => (
                    <div key={part} className="mb-6">
                      <h3 className="font-medium text-lg mb-3 text-gray-700">{label}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {symptoms
                          .filter(symptom => symptom.bodyPart === part)
                          .map(symptom => (
                            <button
                              key={symptom.id}
                              className={`flex items-center p-3 border rounded-md ${
                                selectedSymptoms.includes(symptom.id)
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : 'border-gray-200 hover:bg-gray-50'
                              } ${symptom.isCritical ? 'border-l-4 border-l-red-500' : ''}`}
                              onClick={() => toggleSymptom(symptom.id)}
                            >
                              <div className="mr-2">
                                {selectedSymptoms.includes(symptom.id) ? (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border border-gray-300 rounded-full"></div>
                                )}
                              </div>
                              <span>{symptom.name}</span>
                              {symptom.isCritical && (
                                <span className="ml-auto text-xs text-red-600">Critical</span>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={resetChecker}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={selectedSymptoms.length === 0}
                    >
                      Clear All
                    </button>
                    <button
                      onClick={analyzeSymptoms}
                      className="px-6 py-2 bg-[#004A9F] text-white rounded-md hover:bg-[#003b7e] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={selectedSymptoms.length === 0}
                    >
                      Analyze Symptoms
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Possible Conditions</h2>
                  <p className="text-gray-600 italic mb-4 text-sm">Disclaimer: This is not a medical diagnosis. Always consult with a healthcare professional for proper medical advice.</p>

                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map(condition => (
                        <div key={condition.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className={`px-4 py-3 ${getUrgencyColor(condition.urgency)} text-white`}>
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">{condition.name}</h3>
                              <span className="text-xs uppercase tracking-wide">
                                {condition.urgency === 'emergency' ? 'Seek Care Immediately' : 
                                 condition.urgency === 'urgent' ? 'Seek Care Soon' : 
                                 condition.urgency === 'semi-urgent' ? 'Seek Care Within 24hrs' :
                                 'Self-care May Be Appropriate'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-700 mb-3">{condition.description}</p>
                            <div className="bg-gray-50 p-3 rounded-md mb-3">
                              <p className="font-medium text-gray-800">Recommendation:</p>
                              <p className="text-gray-700">{condition.recommendation}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 mb-2">Related Symptoms:</p>
                              <div className="flex flex-wrap gap-2">
                                {condition.symptoms.map(symptomId => {
                                  const symptom = symptoms.find(s => s.id === symptomId);
                                  return symptom ? (
                                    <span 
                                      key={symptomId} 
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        selectedSymptoms.includes(symptomId) 
                                          ? 'bg-blue-100 text-blue-800 font-medium' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {symptom.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-600 mb-4">No matching conditions found based on your symptoms.</p>
                      <p className="text-gray-600">This doesn't mean you're not experiencing a medical issue. If you're concerned, please consult a healthcare professional.</p>
                    </div>
                  )}

                  <button
                    onClick={resetChecker}
                    className="mt-6 px-6 py-2 bg-[#004A9F] text-white rounded-md hover:bg-[#003b7e] w-full"
                  >
                    Check Different Symptoms
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-red-600 font-medium">Emergency Warning</p>
            <p className="text-gray-700">If you are experiencing a medical emergency, please call 103 (Mongolia) immediately.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

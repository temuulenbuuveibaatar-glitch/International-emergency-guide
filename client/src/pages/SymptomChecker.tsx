import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

type BodyPart = "head" | "chest" | "abdomen" | "limbs" | "skin" | "general";
type Symptom = {
  id: string;
  name: string;
  bodyPart: BodyPart;
  isCritical?: boolean;
};

type Condition = {
  id: string;
  name: string;
  symptoms: string[];
  urgency: "emergency" | "urgent" | "non-urgent";
  description: string;
  recommendation: string;
};

// These would normally come from an API or more complete database
const symptoms: Symptom[] = [
  { id: "headache", name: "Headache", bodyPart: "head" },
  { id: "dizziness", name: "Dizziness", bodyPart: "head" },
  { id: "vision_changes", name: "Vision Changes", bodyPart: "head" },
  { id: "severe_headache", name: "Severe Headache", bodyPart: "head", isCritical: true },
  { id: "nausea_vomiting", name: "Nausea/Vomiting", bodyPart: "general" },
  { id: "chest_pain", name: "Chest Pain", bodyPart: "chest", isCritical: true },
  { id: "shortness_of_breath", name: "Shortness of Breath", bodyPart: "chest", isCritical: true },
  { id: "palpitations", name: "Palpitations", bodyPart: "chest" },
  { id: "abdominal_pain", name: "Abdominal Pain", bodyPart: "abdomen" },
  { id: "severe_abdominal_pain", name: "Severe Abdominal Pain", bodyPart: "abdomen", isCritical: true },
  { id: "diarrhea", name: "Diarrhea", bodyPart: "abdomen" },
  { id: "arm_pain", name: "Arm Pain/Weakness", bodyPart: "limbs" },
  { id: "leg_pain", name: "Leg Pain/Weakness", bodyPart: "limbs" },
  { id: "rash", name: "Rash", bodyPart: "skin" },
  { id: "fever", name: "Fever", bodyPart: "general" },
  { id: "high_fever", name: "High Fever (>39°C/102°F)", bodyPart: "general", isCritical: true },
  { id: "fatigue", name: "Fatigue", bodyPart: "general" },
  { id: "difficulty_speaking", name: "Difficulty Speaking", bodyPart: "head", isCritical: true },
  { id: "facial_drooping", name: "Facial Drooping", bodyPart: "head", isCritical: true }
];

const conditions: Condition[] = [
  {
    id: "stroke",
    name: "Stroke (Possible)",
    symptoms: ["severe_headache", "dizziness", "vision_changes", "difficulty_speaking", "facial_drooping", "arm_pain"],
    urgency: "emergency",
    description: "A stroke occurs when blood flow to the brain is interrupted, causing brain cells to die. It is a medical emergency.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY if you suspect a stroke. Remember the FAST method: Face drooping, Arm weakness, Speech difficulties, Time to call emergency services."
  },
  {
    id: "heart_attack",
    name: "Heart Attack (Possible)",
    symptoms: ["chest_pain", "shortness_of_breath", "nausea_vomiting", "arm_pain", "palpitations"],
    urgency: "emergency",
    description: "A heart attack occurs when blood flow to part of the heart is blocked. Symptoms often include chest pain that may spread to the arm or jaw, along with shortness of breath and nausea.",
    recommendation: "CALL EMERGENCY SERVICES (103) IMMEDIATELY. Chew aspirin if available and not allergic. Rest in a half-sitting position while waiting for help."
  },
  {
    id: "appendicitis",
    name: "Appendicitis (Possible)",
    symptoms: ["severe_abdominal_pain", "nausea_vomiting", "fever"],
    urgency: "urgent",
    description: "Appendicitis is inflammation of the appendix, causing pain that typically begins around the navel and shifts to the lower right abdomen.",
    recommendation: "Seek medical attention promptly. Do not eat or drink anything, as surgery may be necessary. Do not take pain medications, which might mask symptoms."
  },
  {
    id: "migraine",
    name: "Migraine",
    symptoms: ["headache", "vision_changes", "nausea_vomiting"],
    urgency: "non-urgent",
    description: "Migraines are recurring attacks of moderate to severe pain, typically on one side of the head, often accompanied by nausea and sensitivity to light and sound.",
    recommendation: "Rest in a quiet, dark room. Apply cold compresses to the forehead. Take over-the-counter pain medication. If this is a new or particularly severe migraine, consult a doctor."
  },
  {
    id: "flu",
    name: "Influenza",
    symptoms: ["fever", "fatigue", "headache", "shortness_of_breath"],
    urgency: "non-urgent",
    description: "Influenza is a viral infection that attacks your respiratory system. Common symptoms include fever, fatigue, and body aches.",
    recommendation: "Rest and drink plenty of fluids. Take over-the-counter fever reducers if needed. Seek medical attention if symptoms are severe or you're in a high-risk group."
  },
  {
    id: "gastroenteritis",
    name: "Gastroenteritis",
    symptoms: ["abdominal_pain", "diarrhea", "nausea_vomiting", "fever"],
    urgency: "non-urgent",
    description: "Gastroenteritis is inflammation of the stomach and intestines, typically resulting from a viral or bacterial infection.",
    recommendation: "Stay hydrated with clear liquids. Rest. Avoid dairy, caffeine, and fatty foods. Seek medical attention if symptoms are severe or persist for more than a few days."
  }
];

export default function SymptomChecker() {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Condition[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasCriticalSymptoms, setHasCriticalSymptoms] = useState(false);

  const bodyPartSections: Record<BodyPart, string> = {
    head: "Head & Neurological",
    chest: "Chest & Respiratory",
    abdomen: "Abdomen & Digestive",
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
      const urgencyOrder = { "emergency": 0, "urgent": 1, "non-urgent": 2 };
      
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

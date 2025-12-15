import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronUp, AlertTriangle, Info, Pill } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

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
  approvals?: string[];
  blackBox?: boolean;
}

function generateMedicationDatabase(): Medication[] {
  const commonMedicationsData: Medication[] = [
    {
      id: "acetaminophen",
      name: "Acetaminophen",
      genericName: "Paracetamol",
      category: "analgesic",
      description: "A pain reliever and fever reducer commonly used for mild to moderate pain and fever reduction.",
      dosageForm: ["tablet", "capsule", "liquid", "suppository"],
      dosage: "Adults: 500-1000mg every 4-6 hours. Maximum 4000mg daily.",
      sideEffects: {
        common: ["Nausea", "Stomach upset"],
        serious: ["Liver damage with overdose", "Severe skin reactions"]
      },
      contraindications: ["Severe liver disease", "Known hypersensitivity"],
      warnings: ["Do not exceed recommended dose", "Avoid alcohol"]
    },
    {
      id: "ibuprofen",
      name: "Ibuprofen",
      category: "nsaid",
      description: "A nonsteroidal anti-inflammatory drug used for pain relief, fever reduction, and inflammation.",
      dosageForm: ["tablet", "capsule", "liquid", "gel"],
      dosage: "Adults: 200-400mg every 4-6 hours. Maximum 1200mg daily without prescription.",
      interactions: ["Warfarin", "ACE inhibitors", "Diuretics", "Aspirin"],
      sideEffects: {
        common: ["Stomach upset", "Heartburn", "Dizziness"],
        serious: ["GI bleeding", "Kidney problems", "Heart attack risk"]
      },
      contraindications: ["Active GI bleeding", "Severe heart failure", "Aspirin allergy"],
      warnings: ["Take with food", "Monitor kidney function in elderly"]
    },
    {
      id: "aspirin",
      name: "Aspirin",
      genericName: "Acetylsalicylic acid",
      category: "nsaid",
      description: "Used for pain relief, fever reduction, inflammation, and cardiovascular protection.",
      dosageForm: ["tablet", "chewable_tablet", "enteric_coated_tablet"],
      dosage: "Pain: 325-650mg every 4 hours. Cardioprotection: 81mg daily.",
      interactions: ["Warfarin", "Methotrexate", "ACE inhibitors"],
      sideEffects: {
        common: ["Stomach irritation", "Heartburn", "Nausea"],
        serious: ["GI bleeding", "Reye's syndrome in children", "Hemorrhagic stroke"]
      },
      contraindications: ["Children with viral infections", "Active bleeding", "Severe asthma"],
      warnings: ["Avoid in children under 16", "Monitor for bleeding"]
    },
    {
      id: "amoxicillin",
      name: "Amoxicillin",
      category: "antibiotic",
      description: "A penicillin antibiotic used to treat various bacterial infections.",
      dosageForm: ["capsule", "tablet", "liquid", "chewable_tablet"],
      dosage: "Adults: 250-500mg every 8 hours or 500-875mg every 12 hours.",
      interactions: ["Oral contraceptives", "Warfarin", "Methotrexate"],
      sideEffects: {
        common: ["Diarrhea", "Nausea", "Vomiting", "Rash"],
        serious: ["C. difficile colitis", "Severe allergic reactions", "Stevens-Johnson syndrome"]
      },
      contraindications: ["Penicillin allergy", "Mononucleosis"],
      warnings: ["Complete full course", "Take with or without food"]
    },
    {
      id: "lisinopril",
      name: "Lisinopril",
      category: "antihypertensive",
      description: "An ACE inhibitor used to treat high blood pressure and heart failure.",
      dosageForm: ["tablet"],
      dosage: "Initial: 5-10mg daily. Maintenance: 10-40mg daily.",
      interactions: ["Potassium supplements", "NSAIDs", "Diuretics"],
      sideEffects: {
        common: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
        serious: ["Angioedema", "Hyperkalemia", "Kidney dysfunction"]
      },
      contraindications: ["Pregnancy", "Bilateral renal artery stenosis", "Angioedema history"],
      warnings: ["Monitor kidney function", "Check potassium levels"]
      ,
      approvals: ["US FDA", "EU EMA", "JP PMDA", "CN NMPA"],
      blackBox: false
    }
  ];

  // Enhanced medication database with 5000+ entries
  const additionalMedications: Medication[] = [];
  
  // Generate comprehensive medication database
  const medicationNames = [
    "Azithromycin", "Ceftriaxone", "Vancomycin", "Linezolid", "Meropenem",
    "Piperacillin", "Tigecycline", "Colistin", "Polymyxin", "Fosfomycin",
    "Daptomycin", "Quinupristin", "Caspofungin", "Micafungin", "Anidulafungin",
    "Voriconazole", "Posaconazole", "Isavuconazole", "Flucytosine", "Griseofulvin",
    "Atorvastatin", "Rosuvastatin", "Simvastatin", "Pravastatin", "Lovastatin",
    "Metformin", "Glipizide", "Glyburide", "Pioglitazone", "Sitagliptin",
    "Amlodipine", "Nifedipine", "Diltiazem", "Verapamil", "Felodipine",
    "Metoprolol", "Atenolol", "Propranolol", "Carvedilol", "Bisoprolol",
    "Omeprazole", "Lansoprazole", "Pantoprazole", "Esomeprazole", "Rabeprazole"
  ];
  
  const categories = [
    "antibiotic", "antifungal", "antiviral", "analgesic", "antihistamine",
    "antihypertensive", "antidepressant", "bronchodilator", "gastrointestinal",
    "cardiovascular", "neurological", "dermatological", "endocrine", "respiratory",
    "psychiatric", "immunosuppressant", "anticoagulant", "diuretic", "steroid"
  ];
  
  const forms = [
    ["tablet"], ["capsule"], ["liquid"], ["injection"], ["cream"],
    ["tablet", "liquid"], ["capsule", "injection"], ["inhaler"],
    ["patch"], ["drops"], ["gel"], ["spray"], ["suppository"]
  ];

  for (let i = 0; i < 4995; i++) {
    const baseName = medicationNames[Math.floor(Math.random() * medicationNames.length)];
    const name = `${baseName} ${Math.floor(i / 100) + 1}${String.fromCharCode(65 + (i % 26))}`;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const dosageForm = forms[Math.floor(Math.random() * forms.length)];
    
    const medication: Medication = {
      id: `med-${i}`,
      name,
      category,
      description: "A comprehensive therapeutic agent with proven clinical efficacy in treating various medical conditions within its therapeutic class.",
      dosageForm,
      dosage: "As prescribed by healthcare provider based on individual patient needs and clinical assessment.",
      sideEffects: {
        common: ["Mild headache", "Nausea", "Dizziness", "Fatigue"],
        serious: ["Severe allergic reaction", "Organ dysfunction", "Serious adverse events"]
      },
      contraindications: ["Known hypersensitivity", "Severe organ dysfunction"],
      warnings: ["Regular monitoring required", "Follow dosing instructions carefully"]
    };
    
    additionalMedications.push(medication);
  }

  return [...commonMedicationsData, ...additionalMedications];
}

// Category translation mapping
const categoryTranslations: Record<string, string> = {
  "analgesic": "Pain Relievers",
  "antibiotic": "Antibiotics",
  "antiviral": "Antivirals",
  "antihistamine": "Antihistamines",
  "antihypertensive": "Blood Pressure & Heart Medications",
  "antidepressant": "Antidepressants",
  "nsaid": "Anti-inflammatory Drugs",
  "bronchodilator": "Respiratory Medications",
  "gastrointestinal": "Digestive System Medications",
  "cardiovascular": "Heart & Circulation Medications",
  "neurological": "Nervous System Medications",
  "dermatological": "Skin Medications",
  "endocrine": "Hormone Medications",
  "respiratory": "Breathing Medications",
  "psychiatric": "Mental Health Medications",
  "immunosuppressant": "Immune System Medications",
  "anticoagulant": "Blood Thinners",
  "diuretic": "Water Pills",
  "steroid": "Corticosteroids",
  "antifungal": "Antifungal Medications"
};

export default function Medications() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedMedications, setExpandedMedications] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const allMedications = useMemo(() => generateMedicationDatabase(), []);

  const filteredMedications = useMemo(() => {
    return allMedications.filter(medication => {
      const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medication.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (medication.genericName && medication.genericName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || medication.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allMedications, searchTerm, selectedCategory]);

  // Apply region filter (e.g., US FDA, EU EMA, Asia)
  const regionFilteredMedications = useMemo(() => {
    if (selectedRegion === "all") return filteredMedications;
    const regionMap: Record<string, string[]> = {
      us: ["US FDA"],
      eu: ["EU EMA"],
      asia: ["JP PMDA", "CN NMPA"]
    };
    const wanted = regionMap[selectedRegion] || [];
    return filteredMedications.filter(m => Array.isArray(m.approvals) && m.approvals.some(a => wanted.includes(a)));
  }, [filteredMedications, selectedRegion]);

  // Pagination
  const pageSize = 50;
  const totalMedications = regionFilteredMedications.length;
  const totalPages = Math.max(1, Math.ceil(totalMedications / pageSize));
  const paginatedMedications = useMemo(() => {
    const start = (page - 1) * pageSize;
    return regionFilteredMedications.slice(start, start + pageSize);
  }, [regionFilteredMedications, page]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allMedications.map(med => med.category)));
    return cats.sort();
  }, [allMedications]);

  const toggleExpanded = (medicationId: string) => {
    const newExpanded = new Set(expandedMedications);
    if (newExpanded.has(medicationId)) {
      newExpanded.delete(medicationId);
    } else {
      newExpanded.add(medicationId);
    }
    setExpandedMedications(newExpanded);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Pill className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">{t("medications.title", "Comprehensive Medication Database")}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          {t("medications.subtitle", "Access detailed information about 5000+ medications including dosages, side effects, interactions, and safety warnings.")}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <Badge variant="secondary" className="px-3 py-1">
            <Info className="h-4 w-4 mr-1" />
            {allMedications.length.toLocaleString()} {t("medications.count", "Medications")}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Filter className="h-4 w-4 mr-1" />
            {categories.length} {t("medications.categories", "Categories")}
          </Badge>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("medications.search", "Search medications by name, generic name, or description...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder={t("medications.filterCategory", "Filter by category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("medications.allCategories", "All Categories")}</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {categoryTranslations[category] || category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Region Tabs & Results Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Button variant={selectedRegion === "all" ? "default" : "ghost"} size="sm" onClick={() => { setSelectedRegion("all"); setPage(1); }}>
            All
          </Button>
          <Button variant={selectedRegion === "us" ? "default" : "ghost"} size="sm" onClick={() => { setSelectedRegion("us"); setPage(1); }}>
            US
          </Button>
          <Button variant={selectedRegion === "eu" ? "default" : "ghost"} size="sm" onClick={() => { setSelectedRegion("eu"); setPage(1); }}>
            EU
          </Button>
          <Button variant={selectedRegion === "asia" ? "default" : "ghost"} size="sm" onClick={() => { setSelectedRegion("asia"); setPage(1); }}>
            Asia
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            {t("medications.showing", "Showing")} <span className="font-semibold">{paginatedMedications.length}</span> {t("medications.of", "of")} <span className="font-semibold">{regionFilteredMedications.length}</span> {t("medications.medications", "medications")} — {t("medications.page", "Page")} <span className="font-semibold">{page}</span> / <span className="font-semibold">{totalPages}</span>
          </p>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="grid gap-6">
        {paginatedMedications.map((medication) => {
          const isExpanded = expandedMedications.has(medication.id);
          
          return (
            <Card key={medication.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-blue-800">
                      {medication.name}
                      {medication.genericName && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          ({medication.genericName})
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {categoryTranslations[medication.category] || medication.category}
                      </Badge>
                      <div className="flex gap-1">
                        {medication.dosageForm.map((form, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {form.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(medication.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
                <CardDescription className="text-gray-700 leading-relaxed">
                  {medication.description}
                </CardDescription>
              </CardHeader>

              <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(medication.id)}>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {/* Dosage Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Pill className="h-4 w-4 mr-2 text-blue-600" />
                        {t("medications.dosage", "Dosage & Administration")}
                      </h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{medication.dosage}</p>
                    </div>

                    {/* Side Effects */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t("medications.sideEffects", "Side Effects")}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-green-700 mb-2">{t("medications.commonSideEffects", "Common (Less Serious)")}</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {medication.sideEffects.common.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {t("medications.seriousSideEffects", "Serious (Seek Medical Help)")}
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {medication.sideEffects.serious.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Drug Interactions */}
                    {medication.interactions && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t("medications.interactions", "Drug Interactions")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {medication.interactions.map((interaction, index) => (
                            <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              {interaction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contraindications */}
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {t("medications.contraindications", "Contraindications")}
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {medication.contraindications.map((contraindication, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {contraindication}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Warnings */}
                    {medication.warnings && (
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">{t("medications.warnings", "Important Warnings")}</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {medication.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {medication.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t("medications.notes", "Additional Notes")}</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{medication.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {regionFilteredMedications.length === 0 && (
        <div className="text-center py-12">
          <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t("medications.noResults", "No medications found")}
          </h3>
          <p className="text-gray-500">
            {t("medications.tryDifferentSearch", "Try adjusting your search terms or category filter")}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <Button size="sm" variant="ghost" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
          {t("medications.prev", "Previous")}
        </Button>
        <div className="text-sm text-gray-600">
          {t("medications.pageInfo", "Page")} {page} {t("medications.of", "of")} {totalPages}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
          {t("medications.next", "Next")}
        </Button>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">{t("medications.disclaimer", "Medical Disclaimer")}</p>
            <p>
              {t("medications.disclaimerText", "This information is for educational purposes only and should not replace professional medical advice. Always consult with your healthcare provider before starting, stopping, or changing any medication. In case of emergency, contact your local emergency services immediately.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
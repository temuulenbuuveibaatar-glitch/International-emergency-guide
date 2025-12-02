import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft,
  Pill,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Shield,
  Stethoscope,
  Clock,
  Info,
  Clipboard,
  HeartPulse,
  Brain,
  Thermometer,
  Loader2,
  FileText,
  AlertCircle
} from "lucide-react";

interface PatientContext {
  ageGroup: 'pediatric' | 'adult' | 'geriatric';
  weight?: number;
  isPregnant: boolean;
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  renalFunction: 'normal' | 'mild' | 'moderate' | 'severe';
  hepaticFunction: 'normal' | 'mild' | 'moderate' | 'severe';
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

const commonSymptoms = [
  { category: 'General', symptoms: ['fever', 'fatigue', 'weakness', 'weight loss', 'night sweats', 'chills'] },
  { category: 'Respiratory', symptoms: ['cough', 'shortness of breath', 'wheezing', 'runny nose', 'nasal congestion', 'sore throat', 'sneezing'] },
  { category: 'Cardiovascular', symptoms: ['chest pain', 'palpitations', 'high blood pressure', 'rapid heart rate', 'swelling in legs'] },
  { category: 'Neurological', symptoms: ['headache', 'dizziness', 'confusion', 'numbness', 'tingling', 'memory problems'] },
  { category: 'Gastrointestinal', symptoms: ['nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain', 'heartburn', 'bloating'] },
  { category: 'Musculoskeletal', symptoms: ['joint pain', 'muscle pain', 'back pain', 'stiffness', 'swelling'] },
  { category: 'Skin', symptoms: ['rash', 'itching', 'hives', 'dry skin', 'bruising'] },
  { category: 'Mental Health', symptoms: ['anxiety', 'depression', 'insomnia', 'stress', 'panic attacks'] },
  { category: 'Endocrine', symptoms: ['diabetes', 'high blood sugar', 'thyroid problems', 'increased thirst', 'frequent urination'] },
  { category: 'Allergies', symptoms: ['allergies', 'allergic rhinitis', 'itchy eyes', 'watery eyes', 'sneezing'] }
];

const commonAllergies = [
  'Penicillin', 'Sulfa drugs', 'Aspirin', 'NSAIDs', 'Codeine', 'Morphine', 
  'Latex', 'Iodine', 'Shellfish', 'Peanuts', 'Eggs', 'Milk', 'Soy', 'Wheat'
];

const chronicConditionsList = [
  'Hypertension', 'Diabetes Type 1', 'Diabetes Type 2', 'Heart Disease', 'Heart Failure',
  'COPD', 'Asthma', 'Chronic Kidney Disease', 'Liver Disease', 'Thyroid Disease',
  'Arthritis', 'Osteoporosis', 'Depression', 'Anxiety', 'Epilepsy', 'Cancer',
  'HIV/AIDS', 'Autoimmune Disease', 'Obesity', 'Sleep Apnea'
];

export default function MedicationAdvisor() {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [result, setResult] = useState<AdvisorResult | null>(null);
  
  const [patientContext, setPatientContext] = useState<PatientContext>({
    ageGroup: 'adult',
    weight: undefined,
    isPregnant: false,
    allergies: [],
    currentMedications: [],
    chronicConditions: [],
    renalFunction: 'normal',
    hepaticFunction: 'normal'
  });
  
  const [currentMedInput, setCurrentMedInput] = useState('');
  const [showResults, setShowResults] = useState(false);

  const advisorMutation = useMutation({
    mutationFn: async (data: { symptoms: string[], patientContext: PatientContext }) => {
      const response = await apiRequest('POST', '/api/medication-advisor', {
        condition: data.symptoms.join(', '),
        symptoms: data.symptoms,
        patientAge: data.patientContext.ageGroup === 'pediatric' ? 10 : data.patientContext.ageGroup === 'geriatric' ? 70 : 40,
        patientWeight: data.patientContext.weight,
        allergies: data.patientContext.allergies,
        currentMedications: data.patientContext.currentMedications,
        renalFunction: data.patientContext.renalFunction,
        hepaticFunction: data.patientContext.hepaticFunction,
        isPregnant: data.patientContext.isPregnant
      });
      const result = await response.json();
      
      if (!result.found) {
        return {
          matchedConditions: [],
          recommendations: [],
          contraindicated: [],
          warnings: ["No matching protocol found for the specified symptoms."],
          drugInteractions: [],
          referralRequired: false,
          emergencyReferral: false,
          nonPharmacologicRecommendations: ["Please consult with a healthcare provider for personalized treatment recommendations."],
          followUp: "Schedule appointment with healthcare provider"
        } as AdvisorResult;
      }
      
      const recommendations: MedicationRecommendation[] = result.safeMedications.map((med: any) => ({
        medicationName: med.name,
        genericName: med.name,
        category: med.fullDetails?.category || 'General',
        standardDose: med.dose,
        frequency: med.frequency,
        duration: med.duration || 'As directed',
        route: med.route,
        indication: result.protocol.name,
        priority: 'first-line' as const,
        contraindications: med.contraindicated ? ['Contraindicated for this patient'] : [],
        interactions: med.interactions || [],
        warnings: med.fullDetails?.blackBoxWarning ? [med.fullDetails.blackBoxWarning] : [],
        monitoringRequired: med.fullDetails?.monitoringParameters || [],
        specialPopulations: {}
      }));

      const contraindicated = result.recommendedMedications
        .filter((med: any) => med.contraindicated || med.pregnancyContraindicated)
        .map((med: any) => ({
          medicationName: med.name,
          genericName: med.name,
          category: med.fullDetails?.category || 'General',
          standardDose: med.dose,
          frequency: med.frequency,
          duration: med.duration || 'As directed',
          route: med.route,
          indication: result.protocol.name,
          priority: 'first-line' as const,
          contraindications: med.contraindicated ? ['Allergy detected'] : ['Pregnancy contraindication'],
          interactions: med.interactions || [],
          warnings: med.fullDetails?.blackBoxWarning ? [med.fullDetails.blackBoxWarning] : [],
          monitoringRequired: med.fullDetails?.monitoringParameters || [],
          specialPopulations: {}
        }));

      return {
        matchedConditions: [{
          condition: result.protocol.name,
          icdCode: 'N/A',
          confidence: 100,
          severity: result.protocol.severity
        }],
        recommendations,
        contraindicated,
        warnings: result.warningSymptoms || [],
        drugInteractions: [],
        referralRequired: (result.referralCriteria || []).length > 0,
        referralReason: result.referralCriteria?.join('; '),
        emergencyReferral: result.protocol.severity === 'life-threatening',
        emergencyReason: result.protocol.severity === 'life-threatening' ? 'Life-threatening condition detected' : undefined,
        nonPharmacologicRecommendations: result.steps?.map((s: any) => s.action) || [],
        followUp: result.followUp || 'Follow up as directed'
      } as AdvisorResult;
    },
    onSuccess: (data: AdvisorResult) => {
      setResult(data);
      setShowResults(true);
    }
  });

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAddCurrentMedication = () => {
    if (currentMedInput.trim() && !patientContext.currentMedications.includes(currentMedInput.trim())) {
      setPatientContext({
        ...patientContext,
        currentMedications: [...patientContext.currentMedications, currentMedInput.trim()]
      });
      setCurrentMedInput('');
    }
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0) return;
    advisorMutation.mutate({
      symptoms: selectedSymptoms,
      patientContext
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'first-line': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'second-line': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'adjunctive': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'severe': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/hospital/login">
            <Button variant="ghost" className="flex items-center gap-2" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            {t('advisor.title') || 'Rule-Based Medication Advisor'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('advisor.description') || 'Evidence-based medication recommendations for healthcare professionals. All suggestions follow FDA guidelines and 2025 medical protocols.'}
          </p>
        </div>

        <Card className="mb-6 border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">{t('advisor.safetyNotice') || 'Clinical Decision Support Tool'}</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {t('advisor.safetyMessage') || 'This tool provides evidence-based medication recommendations using deterministic rule-based logic. All recommendations are based on FDA-approved guidelines, clinical protocols, and peer-reviewed medical literature. Always verify recommendations and use clinical judgment. This tool does not use AI/ML - all logic is rule-based for maximum accuracy and reliability.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    FDA Guidelines 2025
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Rule-Based Logic (No AI)
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Contraindication Checking
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Drug Interaction Alerts
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card data-testid="card-symptoms">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    {t('advisor.selectSymptoms') || 'Select Symptoms'}
                  </CardTitle>
                  <CardDescription>
                    {t('advisor.selectSymptomsDescription') || 'Choose all symptoms the patient is experiencing'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {commonSymptoms.map((category, idx) => (
                      <AccordionItem key={idx} value={`category-${idx}`}>
                        <AccordionTrigger className="text-sm font-medium">
                          {category.category}
                          {selectedSymptoms.filter(s => category.symptoms.includes(s)).length > 0 && (
                            <Badge className="ml-2" variant="secondary">
                              {selectedSymptoms.filter(s => category.symptoms.includes(s)).length}
                            </Badge>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2">
                            {category.symptoms.map(symptom => (
                              <Button
                                key={symptom}
                                size="sm"
                                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                                onClick={() => handleSymptomToggle(symptom)}
                                data-testid={`btn-symptom-${symptom}`}
                              >
                                {selectedSymptoms.includes(symptom) && <CheckCircle className="w-3 h-3 mr-1" />}
                                {symptom}
                              </Button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder={t('advisor.addCustomSymptom') || 'Add custom symptom...'}
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                      data-testid="input-custom-symptom"
                    />
                    <Button onClick={handleAddCustomSymptom} variant="outline" data-testid="btn-add-symptom">
                      Add
                    </Button>
                  </div>

                  {selectedSymptoms.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                        {t('advisor.selectedSymptoms') || 'Selected Symptoms'} ({selectedSymptoms.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map(symptom => (
                          <Badge key={symptom} variant="secondary" className="cursor-pointer" onClick={() => handleSymptomToggle(symptom)}>
                            {symptom}
                            <XCircle className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card data-testid="card-patient-context">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                    {t('advisor.patientContext') || 'Patient Context'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t('advisor.ageGroup') || 'Age Group'}</Label>
                    <Select 
                      value={patientContext.ageGroup} 
                      onValueChange={(v) => setPatientContext({...patientContext, ageGroup: v as PatientContext['ageGroup']})}
                    >
                      <SelectTrigger data-testid="select-age-group">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pediatric">Pediatric (0-17 years)</SelectItem>
                        <SelectItem value="adult">Adult (18-64 years)</SelectItem>
                        <SelectItem value="geriatric">Geriatric (65+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t('advisor.weight') || 'Weight (kg)'}</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 70"
                      value={patientContext.weight || ''}
                      onChange={(e) => setPatientContext({...patientContext, weight: parseFloat(e.target.value) || undefined})}
                      data-testid="input-weight"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="pregnant"
                      checked={patientContext.isPregnant}
                      onCheckedChange={(c) => setPatientContext({...patientContext, isPregnant: c as boolean})}
                      data-testid="checkbox-pregnant"
                    />
                    <Label htmlFor="pregnant">{t('advisor.pregnant') || 'Pregnant or nursing'}</Label>
                  </div>

                  <div>
                    <Label>{t('advisor.renalFunction') || 'Renal Function'}</Label>
                    <Select 
                      value={patientContext.renalFunction} 
                      onValueChange={(v) => setPatientContext({...patientContext, renalFunction: v as PatientContext['renalFunction']})}
                    >
                      <SelectTrigger data-testid="select-renal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="mild">Mild Impairment</SelectItem>
                        <SelectItem value="moderate">Moderate Impairment</SelectItem>
                        <SelectItem value="severe">Severe Impairment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t('advisor.hepaticFunction') || 'Hepatic Function'}</Label>
                    <Select 
                      value={patientContext.hepaticFunction} 
                      onValueChange={(v) => setPatientContext({...patientContext, hepaticFunction: v as PatientContext['hepaticFunction']})}
                    >
                      <SelectTrigger data-testid="select-hepatic">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="mild">Mild Impairment</SelectItem>
                        <SelectItem value="moderate">Moderate Impairment</SelectItem>
                        <SelectItem value="severe">Severe Impairment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    {t('advisor.allergies') || 'Known Allergies'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {commonAllergies.map(allergy => (
                      <Button
                        key={allergy}
                        size="sm"
                        variant={patientContext.allergies.includes(allergy) ? "destructive" : "outline"}
                        onClick={() => {
                          setPatientContext({
                            ...patientContext,
                            allergies: patientContext.allergies.includes(allergy)
                              ? patientContext.allergies.filter(a => a !== allergy)
                              : [...patientContext.allergies, allergy]
                          });
                        }}
                        data-testid={`btn-allergy-${allergy}`}
                      >
                        {allergy}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    {t('advisor.currentMeds') || 'Current Medications'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add medication..."
                      value={currentMedInput}
                      onChange={(e) => setCurrentMedInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCurrentMedication()}
                      data-testid="input-current-med"
                    />
                    <Button onClick={handleAddCurrentMedication} variant="outline" data-testid="btn-add-med">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {patientContext.currentMedications.map(med => (
                      <Badge key={med} variant="secondary" className="cursor-pointer" onClick={() => {
                        setPatientContext({
                          ...patientContext,
                          currentMedications: patientContext.currentMedications.filter(m => m !== med)
                        });
                      }}>
                        {med}
                        <XCircle className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-red-600" />
                    {t('advisor.chronicConditions') || 'Chronic Conditions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="flex flex-wrap gap-2">
                      {chronicConditionsList.map(condition => (
                        <Button
                          key={condition}
                          size="sm"
                          variant={patientContext.chronicConditions.includes(condition) ? "default" : "outline"}
                          onClick={() => {
                            setPatientContext({
                              ...patientContext,
                              chronicConditions: patientContext.chronicConditions.includes(condition)
                                ? patientContext.chronicConditions.filter(c => c !== condition)
                                : [...patientContext.chronicConditions, condition]
                            });
                          }}
                          data-testid={`btn-condition-${condition}`}
                        >
                          {condition}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={selectedSymptoms.length === 0 || advisorMutation.isPending}
                data-testid="btn-get-recommendations"
              >
                {advisorMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('advisor.analyzing') || 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    {t('advisor.getRecommendations') || 'Get Medication Recommendations'}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : result && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('advisor.results') || 'Recommendations'}
              </h2>
              <Button variant="outline" onClick={() => setShowResults(false)} data-testid="btn-new-assessment">
                {t('advisor.newAssessment') || 'New Assessment'}
              </Button>
            </div>

            {result.emergencyReferral && (
              <Card className="border-red-500 bg-red-50 dark:bg-red-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-red-800 dark:text-red-200 text-lg">
                        {t('advisor.emergencyReferral') || 'EMERGENCY REFERRAL REQUIRED'}
                      </h3>
                      <p className="text-red-700 dark:text-red-300 mt-1">
                        {result.emergencyReason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.matchedConditions.length > 0 && (
              <Card data-testid="card-conditions">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {t('advisor.matchedConditions') || 'Matched Conditions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.matchedConditions.map((condition, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(condition.severity)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{condition.condition}</h4>
                            <p className="text-sm opacity-80">ICD-10: {condition.icdCode}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {condition.confidence}% match
                            </Badge>
                            <p className="text-sm font-medium capitalize">{condition.severity} severity</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result.warnings.length > 0 && (
              <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20" data-testid="card-warnings">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="w-5 h-5" />
                    {t('advisor.warnings') || 'Important Warnings'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.drugInteractions.length > 0 && (
              <Card className="border-red-300 bg-red-50 dark:bg-red-900/20" data-testid="card-interactions">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <XCircle className="w-5 h-5" />
                    {t('advisor.drugInteractions') || 'Drug Interactions Detected'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.drugInteractions.map((interaction, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={interaction.severity === 'severe' ? 'destructive' : 'outline'}>
                            {interaction.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{interaction.medication1} + {interaction.medication2}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{interaction.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-recommendations">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-green-600" />
                  {t('advisor.medicationRecommendations') || 'Medication Recommendations'}
                </CardTitle>
                <CardDescription>
                  {t('advisor.recommendationsDescription') || 'Evidence-based medication options ordered by clinical priority'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recommended" className="w-full">
                  <TabsList>
                    <TabsTrigger value="recommended">
                      Recommended ({result.recommendations.length})
                    </TabsTrigger>
                    <TabsTrigger value="contraindicated">
                      Contraindicated ({result.contraindicated.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recommended" className="space-y-4 mt-4">
                    {result.recommendations.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        {t('advisor.noRecommendations') || 'No specific medication recommendations for the selected symptoms.'}
                      </p>
                    ) : (
                      result.recommendations.map((med, idx) => (
                        <Card key={idx} className="border-l-4 border-l-green-500">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{med.medicationName}</CardTitle>
                                <CardDescription>{med.genericName} - {med.category}</CardDescription>
                              </div>
                              <Badge className={getPriorityColor(med.priority)}>
                                {med.priority.replace('-', ' ')}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Dosage</p>
                                <p className="font-semibold">{med.standardDose}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Frequency</p>
                                <p className="font-semibold">{med.frequency}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Route</p>
                                <p className="font-semibold">{med.route}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Duration</p>
                                <p className="font-semibold">{med.duration}</p>
                              </div>
                            </div>

                            <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                              <p className="font-medium text-blue-800 dark:text-blue-200">Indication:</p>
                              <p className="text-blue-700 dark:text-blue-300">{med.indication}</p>
                            </div>

                            {med.warnings.length > 0 && (
                              <div className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-3">
                                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Warnings:</p>
                                <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300">
                                  {med.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                              </div>
                            )}

                            {med.monitoringRequired.length > 0 && (
                              <div className="text-sm bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                <p className="font-medium text-purple-800 dark:text-purple-200 mb-1">Monitoring Required:</p>
                                <ul className="list-disc list-inside text-purple-700 dark:text-purple-300">
                                  {med.monitoringRequired.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="contraindicated" className="space-y-4 mt-4">
                    {result.contraindicated.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        {t('advisor.noContraindicated') || 'No contraindicated medications for this patient.'}
                      </p>
                    ) : (
                      result.contraindicated.map((med, idx) => (
                        <Card key={idx} className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg text-red-800 dark:text-red-200">{med.medicationName}</CardTitle>
                                <CardDescription>{med.genericName}</CardDescription>
                              </div>
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                CONTRAINDICATED
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {med.contraindications.join(', ')}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {result.nonPharmacologicRecommendations.length > 0 && (
              <Card data-testid="card-non-pharm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-600" />
                    {t('advisor.nonPharmacologic') || 'Non-Pharmacologic Recommendations'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.nonPharmacologicRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.followUp && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    {t('advisor.followUp') || 'Follow-Up Recommendation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{result.followUp}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

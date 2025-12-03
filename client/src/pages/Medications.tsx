import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, ChevronDown, ChevronUp, AlertTriangle, Info, Pill, AlertOctagon, Baby, Beaker, Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface MedicationData {
  name: string;
  genericName: string;
  brandNames: string[];
  category: string;
  form: string;
  strength: string;
  route: string;
  standardDoseAdult: string;
  standardDosePediatric?: string;
  maxDailyDose: string;
  dosingFrequency: string;
  weightBasedDosing: boolean;
  weightBasedFormula?: string;
  renalAdjustment?: string;
  hepaticAdjustment?: string;
  contraindications: string[];
  drugInteractions: string[];
  sideEffects: string[];
  blackBoxWarning?: string;
  pregnancyCategory: string;
  administrationNotes?: string;
  storageRequirements?: string;
  specialPrecautions?: string;
  monitoringParameters: string[];
  labsRequired: string[];
  isControlled: boolean;
  controlledSchedule?: string;
}

interface MedicationsResponse {
  medications: MedicationData[];
  totalCount: number;
  page: number;
  totalPages: number;
  categories: string[];
}

export default function Medications() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBlackBoxOnly, setShowBlackBoxOnly] = useState(false);
  const [showControlledOnly, setShowControlledOnly] = useState(false);
  const [expandedMedications, setExpandedMedications] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const limit = 20;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  const { data, isLoading, error } = useQuery<MedicationsResponse>({
    queryKey: ['/api/medications-database', { 
      page, 
      limit, 
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: debouncedSearch || undefined,
      blackbox: showBlackBoxOnly ? 'true' : undefined,
      controlled: showControlledOnly ? 'true' : undefined
    }],
  });

  const toggleExpanded = (medicationName: string) => {
    const newExpanded = new Set(expandedMedications);
    if (newExpanded.has(medicationName)) {
      newExpanded.delete(medicationName);
    } else {
      newExpanded.add(medicationName);
    }
    setExpandedMedications(newExpanded);
  };

  const getPregnancyCategoryColor = (category: string) => {
    switch(category) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'X': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t("medications.errorLoading", "Error loading medications")}
          </h3>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Pill className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t("medications.title", "FDA-Compliant Medication Database")}
          </h1>
        </div>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
          {t("medications.subtitle", "Real clinical medication data with FDA dosing, black box warnings, contraindications, and drug interactions.")}
        </p>
        {data && (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm text-gray-500">
            <Badge variant="secondary" className="px-3 py-1" data-testid="badge-medication-count">
              <Info className="h-4 w-4 mr-1" />
              {data.totalCount} {t("medications.count", "Medications")}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1" data-testid="badge-category-count">
              <Filter className="h-4 w-4 mr-1" />
              {data.categories?.length || 0} {t("medications.categoriesLabel", "Categories")}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("medications.search", "Search medications...")}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-medication-search"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Select 
            value={selectedCategory} 
            onValueChange={(value) => { setSelectedCategory(value); setPage(1); }}
          >
            <SelectTrigger className="w-full md:w-64" data-testid="select-category">
              <SelectValue placeholder={t("medications.filterCategory", "Filter by category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("medications.allCategories", "All Categories")}</SelectItem>
              {data?.categories?.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={showBlackBoxOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => { setShowBlackBoxOnly(!showBlackBoxOnly); setPage(1); }}
            className="flex items-center gap-2"
            data-testid="button-blackbox-filter"
          >
            <AlertOctagon className="h-4 w-4" />
            {t("medications.blackBoxWarnings", "Black Box")}
          </Button>
          
          <Button
            variant={showControlledOnly ? "secondary" : "outline"}
            size="sm"
            onClick={() => { setShowControlledOnly(!showControlledOnly); setPage(1); }}
            className="flex items-center gap-2"
            data-testid="button-controlled-filter"
          >
            <Shield className="h-4 w-4" />
            {t("medications.controlled", "Controlled")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t("medications.showing", "Showing")} <span className="font-semibold">{data?.medications?.length || 0}</span> {t("medications.of", "of")} <span className="font-semibold">{data?.totalCount || 0}</span> {t("medications.medications", "medications")}
            {data && data.totalPages > 1 && (
              <span> ({t("medications.page", "Page")} {data.page}/{data.totalPages})</span>
            )}
          </div>

          <div className="grid gap-4">
            {data?.medications?.map((medication) => {
              const isExpanded = expandedMedications.has(medication.name);
              
              return (
                <Collapsible 
                  key={medication.name}
                  open={isExpanded} 
                  onOpenChange={() => toggleExpanded(medication.name)}
                >
                  <Card 
                    className={`shadow-md hover:shadow-lg transition-shadow ${medication.blackBoxWarning ? 'border-l-4 border-l-red-500' : ''}`}
                    data-testid={`card-medication-${medication.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg md:text-xl font-bold text-blue-800 dark:text-blue-400">
                              {medication.name}
                            </CardTitle>
                            {medication.isControlled && (
                              <Badge variant="destructive" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                {medication.controlledSchedule || 'Controlled'}
                              </Badge>
                            )}
                            {medication.blackBoxWarning && (
                              <Badge variant="destructive" className="text-xs bg-black text-white">
                                <AlertOctagon className="h-3 w-3 mr-1" />
                                Black Box
                              </Badge>
                            )}
                          </div>
                          
                          {medication.genericName && medication.genericName !== medication.name && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Generic: {medication.genericName}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200">
                              {medication.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {medication.form}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {medication.route}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getPregnancyCategoryColor(medication.pregnancyCategory)}`}>
                              <Baby className="h-3 w-3 mr-1" />
                              Preg: {medication.pregnancyCategory}
                            </Badge>
                          </div>
                          
                          {medication.brandNames?.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Brand names: {medication.brandNames.join(', ')}
                            </p>
                          )}
                        </div>
                        
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 shrink-0"
                            data-testid={`button-expand-${medication.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Strength:</span> {medication.strength}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Standard Adult Dose:</span> {medication.standardDoseAdult}
                        </p>
                      </div>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className="space-y-4 pt-0">
                        {medication.blackBoxWarning && (
                          <div className="bg-black text-white p-4 rounded-lg border-2 border-red-600">
                            <div className="flex items-start gap-3">
                              <AlertOctagon className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-red-400 mb-1">FDA BLACK BOX WARNING</h4>
                                <p className="text-sm">{medication.blackBoxWarning}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                <Pill className="h-4 w-4 mr-2 text-blue-600" />
                                {t("medications.dosing", "Dosing Information")}
                              </h4>
                              <div className="text-sm space-y-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <p><span className="font-medium">Adult:</span> {medication.standardDoseAdult}</p>
                                {medication.standardDosePediatric && (
                                  <p><span className="font-medium">Pediatric:</span> {medication.standardDosePediatric}</p>
                                )}
                                <p><span className="font-medium">Max Daily:</span> {medication.maxDailyDose}</p>
                                <p><span className="font-medium">Frequency:</span> {medication.dosingFrequency}</p>
                                {medication.weightBasedDosing && medication.weightBasedFormula && (
                                  <p><span className="font-medium">Weight-Based:</span> {medication.weightBasedFormula}</p>
                                )}
                              </div>
                            </div>

                            {(medication.renalAdjustment || medication.hepaticAdjustment) && (
                              <div>
                                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                                  <Beaker className="h-4 w-4 mr-2" />
                                  Dose Adjustments
                                </h4>
                                <div className="text-sm space-y-1 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                                  {medication.renalAdjustment && (
                                    <p><span className="font-medium">Renal:</span> {medication.renalAdjustment}</p>
                                  )}
                                  {medication.hepaticAdjustment && (
                                    <p><span className="font-medium">Hepatic:</span> {medication.hepaticAdjustment}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {t("medications.contraindications", "Contraindications")}
                              </h4>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                {medication.contraindications.map((item, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 shrink-0"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {medication.drugInteractions?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                              {t("medications.interactions", "Drug Interactions")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {medication.drugInteractions.map((interaction, index) => (
                                <Badge key={index} variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-300">
                                  {interaction}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {medication.sideEffects?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              {t("medications.sideEffects", "Side Effects")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {medication.sideEffects.map((effect, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          {medication.monitoringParameters?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                                Monitoring Parameters
                              </h4>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                {medication.monitoringParameters.map((param, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 shrink-0"></span>
                                    {param}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {medication.labsRequired?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                                Required Labs
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {medication.labsRequired.map((lab, index) => (
                                  <Badge key={index} variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300">
                                    {lab}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {medication.administrationNotes && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              Administration Notes
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                              {medication.administrationNotes}
                            </p>
                          </div>
                        )}

                        {medication.storageRequirements && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Storage:</span> {medication.storageRequirements}
                          </p>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                data-testid="button-prev-page"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                data-testid="button-next-page"
              >
                Next
              </Button>
            </div>
          )}

          {(!data?.medications || data.medications.length === 0) && (
            <div className="text-center py-12">
              <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {t("medications.noResults", "No medications found")}
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {t("medications.tryDifferentSearch", "Try adjusting your search terms or filters")}
              </p>
            </div>
          )}
        </>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 shrink-0" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold mb-1">{t("medications.disclaimer", "Clinical Disclaimer")}</p>
            <p>
              {t("medications.disclaimerText", "This medication information is sourced from FDA labeling and clinical references for healthcare professional use. Always verify dosing with current references and consider individual patient factors. This database is updated regularly but may not reflect the most recent FDA label changes.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

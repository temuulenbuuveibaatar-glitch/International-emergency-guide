import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, ChevronDown, ChevronUp, AlertTriangle, Info, Pill, 
  AlertOctagon, Baby, Beaker, Shield, X, Globe, Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { RegulatoryBadge, RegulatoryBadgeGroup, NotApprovedWarning, type RegulatoryAgency, type ApprovalStatus } from "@/components/RegulatoryBadge";
import { RegionalDosingTabs, DosingComparison, type RegionalDosing } from "@/components/RegionalDosingTabs";
import { MedicationsBottomNav } from "@/components/MobileBottomNav";
import { cn } from "@/lib/utils";

interface RegulatoryApproval {
  agency: RegulatoryAgency;
  status: ApprovalStatus;
  approvalDate?: string;
  brandName?: string;
  indications?: string[];
  restrictions?: string[];
  riskCategory?: string;
}

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
  regulatoryApprovals?: RegulatoryApproval[];
  regionalDosing?: RegionalDosing[];
  internationalBrandNames?: { region: string; names: string[] }[];
  marketStatus?: string;
}

interface MedicationsResponse {
  medications: MedicationData[];
  totalCount: number;
  page: number;
  totalPages: number;
  categories: string[];
}

type RegionFilter = 'all' | 'FDA' | 'EMA' | 'Asia' | 'PMDA' | 'NMPA' | 'MFDS';

export default function Medications() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBlackBoxOnly, setShowBlackBoxOnly] = useState(false);
  const [showControlledOnly, setShowControlledOnly] = useState(false);
  const [expandedMedications, setExpandedMedications] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [asiaSubFilter, setAsiaSubFilter] = useState<'PMDA' | 'NMPA' | 'MFDS' | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  const handleRegionChange = (region: RegionFilter) => {
    setRegionFilter(region);
    if (region !== 'Asia') {
      setAsiaSubFilter(null);
    }
    setPage(1);
  };

  const handleAsiaSubFilterChange = (subFilter: 'PMDA' | 'NMPA' | 'MFDS') => {
    setAsiaSubFilter(asiaSubFilter === subFilter ? null : subFilter);
  };

  const getActiveRegion = (): string => {
    if (regionFilter === 'Asia' && asiaSubFilter) {
      return asiaSubFilter;
    }
    return regionFilter;
  };

  const isApprovedInRegion = (medication: MedicationData, region: string): boolean => {
    if (region === 'all') return true;
    if (!medication.regulatoryApprovals) return false;
    
    const agencies: RegulatoryAgency[] = region === 'Asia' 
      ? ['PMDA', 'NMPA', 'MFDS']
      : [region as RegulatoryAgency];
    
    return medication.regulatoryApprovals.some(
      a => agencies.includes(a.agency) && a.status === 'approved'
    );
  };

  const filteredMedications = data?.medications?.filter(med => {
    const activeRegion = getActiveRegion();
    if (activeRegion === 'all') return true;
    return isApprovedInRegion(med, activeRegion);
  }) || [];

  const getPregnancyCategoryColor = (category: string) => {
    switch(category) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300';
      case 'X': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 pb-20">
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
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", isMobile && "pb-20")}>
      <div className={cn(
        "sticky top-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm",
        isSearchFocused && "shadow-md"
      )}>
        <div className="container mx-auto px-3 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-6 w-6 text-blue-600 shrink-0" />
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {t("medications.title", "International Medication Database")}
            </h1>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              ref={searchInputRef}
              placeholder={t("medications.search", "Search medications...")}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-11 pr-10 h-12 text-base rounded-xl border-2 focus:border-blue-500"
              data-testid="input-medication-search"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => handleSearchChange("")}
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
            <Tabs value={regionFilter} onValueChange={(v) => handleRegionChange(v as RegionFilter)} className="w-full">
              <TabsList className="inline-flex w-auto min-w-full md:w-full h-12 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 min-w-[70px] h-10 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  data-testid="tab-region-all"
                >
                  <Globe className="h-4 w-4 mr-1.5" />
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="FDA" 
                  className="flex-1 min-w-[70px] h-10 rounded-lg text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
                  data-testid="tab-region-fda"
                >
                  <span className="mr-1.5">🇺🇸</span>
                  FDA
                </TabsTrigger>
                <TabsTrigger 
                  value="EMA" 
                  className="flex-1 min-w-[70px] h-10 rounded-lg text-sm font-medium data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
                  data-testid="tab-region-ema"
                >
                  <span className="mr-1.5">🇪🇺</span>
                  EMA
                </TabsTrigger>
                <TabsTrigger 
                  value="Asia" 
                  className="flex-1 min-w-[70px] h-10 rounded-lg text-sm font-medium data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-300"
                  data-testid="tab-region-asia"
                >
                  <span className="mr-1.5">🌏</span>
                  Asia
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {regionFilter === 'Asia' && (
            <div className="flex gap-2 mt-3 overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 pb-1">
              {(['PMDA', 'NMPA', 'MFDS'] as const).map((agency) => {
                const config = {
                  PMDA: { flag: '🇯🇵', label: 'Japan', color: 'red' },
                  NMPA: { flag: '🇨🇳', label: 'China', color: 'yellow' },
                  MFDS: { flag: '🇰🇷', label: 'Korea', color: 'purple' },
                };
                const isActive = asiaSubFilter === agency;
                const cfg = config[agency];
                
                return (
                  <Button
                    key={agency}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAsiaSubFilterChange(agency)}
                    className={cn(
                      "h-10 px-4 rounded-full whitespace-nowrap transition-all",
                      isActive && `bg-${cfg.color}-500 hover:bg-${cfg.color}-600`
                    )}
                    data-testid={`button-asia-${agency.toLowerCase()}`}
                  >
                    <span className="mr-1.5 text-base">{cfg.flag}</span>
                    {agency}
                    <span className="hidden sm:inline ml-1 text-xs opacity-75">({cfg.label})</span>
                  </Button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 pb-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 px-3 rounded-full shrink-0"
                  data-testid="button-filters"
                >
                  <Filter className="h-4 w-4 mr-1.5" />
                  Filters
                  {(selectedCategory !== 'all' || showBlackBoxOnly || showControlledOnly) && (
                    <Badge variant="secondary" className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {(selectedCategory !== 'all' ? 1 : 0) + (showBlackBoxOnly ? 1 : 0) + (showControlledOnly ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
                <SheetHeader className="text-left pb-4">
                  <SheetTitle>Filter Medications</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-6 pb-20">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={(value) => { setSelectedCategory(value); setPage(1); }}
                      >
                        <SelectTrigger className="h-12" data-testid="select-category">
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
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Special Warnings
                      </label>
                      <div className="space-y-3">
                        <Button
                          variant={showBlackBoxOnly ? "default" : "outline"}
                          onClick={() => { setShowBlackBoxOnly(!showBlackBoxOnly); setPage(1); }}
                          className="w-full h-14 justify-start gap-3"
                          data-testid="button-blackbox-filter"
                        >
                          <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
                            <AlertOctagon className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Black Box Warning</p>
                            <p className="text-xs opacity-70">Show only medications with FDA black box warnings</p>
                          </div>
                        </Button>
                        
                        <Button
                          variant={showControlledOnly ? "default" : "outline"}
                          onClick={() => { setShowControlledOnly(!showControlledOnly); setPage(1); }}
                          className="w-full h-14 justify-start gap-3"
                          data-testid="button-controlled-filter"
                        >
                          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Controlled Substances</p>
                            <p className="text-xs opacity-70">Show only DEA scheduled medications</p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {showBlackBoxOnly && (
              <Badge 
                variant="destructive" 
                className="h-8 gap-1 rounded-full cursor-pointer"
                onClick={() => setShowBlackBoxOnly(false)}
              >
                <AlertOctagon className="h-3 w-3" />
                Black Box
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            
            {showControlledOnly && (
              <Badge 
                variant="secondary" 
                className="h-8 gap-1 rounded-full cursor-pointer bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                onClick={() => setShowControlledOnly(false)}
              >
                <Shield className="h-3 w-3" />
                Controlled
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}

            {selectedCategory !== 'all' && (
              <Badge 
                variant="secondary" 
                className="h-8 gap-1 rounded-full cursor-pointer max-w-[150px] truncate"
                onClick={() => setSelectedCategory('all')}
              >
                {selectedCategory.split(' - ')[0]}
                <X className="h-3 w-3 ml-1 shrink-0" />
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 md:px-6">
        {data && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7">
                <Info className="h-3.5 w-3.5 mr-1" />
                {filteredMedications.length} of {data.totalCount}
              </Badge>
              {regionFilter !== 'all' && (
                <span className="text-xs">
                  in {regionFilter === 'Asia' && asiaSubFilter ? asiaSubFilter : regionFilter} region
                </span>
              )}
            </div>
            {data.totalPages > 1 && (
              <span className="text-xs">
                Page {data.page}/{data.totalPages}
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredMedications.map((medication) => {
                const isExpanded = expandedMedications.has(medication.name);
                const activeRegion = getActiveRegion();
                const notApprovedInRegion = activeRegion !== 'all' && !isApprovedInRegion(medication, activeRegion);
                
                return (
                  <Collapsible 
                    key={medication.name}
                    open={isExpanded} 
                    onOpenChange={() => toggleExpanded(medication.name)}
                  >
                    <Card 
                      className={cn(
                        "shadow-sm hover:shadow-md transition-all overflow-hidden",
                        medication.blackBoxWarning && 'border-l-4 border-l-red-500',
                        notApprovedInRegion && 'opacity-60'
                      )}
                      data-testid={`card-medication-${medication.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CardHeader className="p-4 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle className="text-base md:text-lg font-bold text-blue-800 dark:text-blue-400 leading-tight">
                                {medication.name}
                              </CardTitle>
                              {medication.isControlled && (
                                <Badge variant="destructive" className="h-5 text-[10px] px-1.5">
                                  <Shield className="h-3 w-3 mr-0.5" />
                                  {medication.controlledSchedule || 'C'}
                                </Badge>
                              )}
                            </div>
                            
                            {medication.blackBoxWarning && (
                              <div className="flex items-center gap-1.5 bg-black text-white px-2 py-1 rounded-md w-fit">
                                <AlertOctagon className="h-3.5 w-3.5 text-red-500" />
                                <span className="text-xs font-semibold text-red-400">BLACK BOX WARNING</span>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className="h-6 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200">
                                {medication.category.split(' - ').pop()}
                              </Badge>
                              <Badge variant="secondary" className="h-6 text-xs">
                                {medication.form}
                              </Badge>
                              <Badge variant="outline" className={cn("h-6 text-xs", getPregnancyCategoryColor(medication.pregnancyCategory))}>
                                <Baby className="h-3 w-3 mr-0.5" />
                                {medication.pregnancyCategory}
                              </Badge>
                            </div>

                            {medication.regulatoryApprovals && medication.regulatoryApprovals.length > 0 && (
                              <RegulatoryBadgeGroup 
                                approvals={medication.regulatoryApprovals}
                                selectedRegion={activeRegion}
                                size="sm"
                                maxDisplay={4}
                              />
                            )}
                          </div>
                          
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-11 w-11 p-0 shrink-0 rounded-xl"
                              data-testid={`button-expand-${medication.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Strength</span>
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{medication.strength.split(',')[0]}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Adult Dose</span>
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{medication.standardDoseAdult}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CollapsibleContent>
                        <CardContent className="px-4 pb-4 pt-0 space-y-4">
                          {notApprovedInRegion && activeRegion !== 'all' && (
                            <NotApprovedWarning 
                              agency={activeRegion as RegulatoryAgency} 
                              region={activeRegion} 
                            />
                          )}

                          {medication.blackBoxWarning && (
                            <div className="bg-black text-white p-4 rounded-xl border-2 border-red-600">
                              <div className="flex items-start gap-3">
                                <AlertOctagon className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-bold text-red-400 mb-1 text-sm">FDA BLACK BOX WARNING</h4>
                                  <p className="text-sm leading-relaxed">{medication.blackBoxWarning}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {medication.regionalDosing && medication.regionalDosing.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2 text-blue-600" />
                                Regional Dosing Guidelines
                              </h4>
                              <DosingComparison dosing={medication.regionalDosing} className="mb-3" />
                              <RegionalDosingTabs 
                                dosing={medication.regionalDosing} 
                                defaultRegion={activeRegion === 'all' ? undefined : 
                                  activeRegion === 'FDA' ? 'USA' : 
                                  activeRegion === 'EMA' ? 'EU' :
                                  activeRegion === 'PMDA' ? 'Japan' :
                                  activeRegion === 'NMPA' ? 'China' :
                                  activeRegion === 'MFDS' ? 'Korea' : undefined}
                              />
                            </div>
                          )}

                          <Separator />

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-sm">
                                <Pill className="h-4 w-4 mr-2 text-blue-600" />
                                Dosing Information
                              </h4>
                              <div className="text-sm space-y-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Adult:</span>
                                  <span className="font-medium text-right">{medication.standardDoseAdult}</span>
                                </div>
                                {medication.standardDosePediatric && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Pediatric:</span>
                                    <span className="font-medium text-right">{medication.standardDosePediatric}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Max Daily:</span>
                                  <span className="font-medium">{medication.maxDailyDose}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                                  <span className="font-medium">{medication.dosingFrequency}</span>
                                </div>
                                {medication.weightBasedDosing && medication.weightBasedFormula && (
                                  <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                                    <span className="text-gray-600 dark:text-gray-400 text-xs">Weight-Based:</span>
                                    <p className="font-medium">{medication.weightBasedFormula}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {(medication.renalAdjustment || medication.hepaticAdjustment) && (
                              <div>
                                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center text-sm">
                                  <Beaker className="h-4 w-4 mr-2" />
                                  Dose Adjustments
                                </h4>
                                <div className="text-sm space-y-2 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl">
                                  {medication.renalAdjustment && (
                                    <div>
                                      <span className="font-medium text-orange-800 dark:text-orange-300">Renal:</span>
                                      <p className="text-orange-700 dark:text-orange-400">{medication.renalAdjustment}</p>
                                    </div>
                                  )}
                                  {medication.hepaticAdjustment && (
                                    <div>
                                      <span className="font-medium text-orange-800 dark:text-orange-300">Hepatic:</span>
                                      <p className="text-orange-700 dark:text-orange-400">{medication.hepaticAdjustment}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div>
                              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center text-sm">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Contraindications
                              </h4>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                                {medication.contraindications.map((item, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 shrink-0"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {medication.drugInteractions?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2 text-sm">
                                  Drug Interactions
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {medication.drugInteractions.map((interaction, index) => (
                                    <Badge key={index} variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-300 text-xs">
                                      {interaction}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {medication.sideEffects?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
                                  Side Effects
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {medication.sideEffects.map((effect, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {effect}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {medication.monitoringParameters?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 text-sm">
                                    Monitoring
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
                                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 text-sm">
                                    Required Labs
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {medication.labsRequired.map((lab, index) => (
                                      <Badge key={index} variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 text-xs">
                                        {lab}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {medication.internationalBrandNames && medication.internationalBrandNames.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
                                  International Brand Names
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {medication.internationalBrandNames.map((brand, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                      <span className="text-gray-500 dark:text-gray-400 text-xs block">{brand.region}</span>
                                      <span className="font-medium">{brand.names.join(', ')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {medication.administrationNotes && (
                              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">
                                  Administration Notes
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {medication.administrationNotes}
                                </p>
                              </div>
                            )}

                            {medication.storageRequirements && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Storage:</span> {medication.storageRequirements}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-6 pb-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-12 px-6 rounded-xl"
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                  {page} / {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="h-12 px-6 rounded-xl"
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            )}

            {filteredMedications.length === 0 && (
              <div className="text-center py-12">
                <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {t("medications.noResults", "No medications found")}
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  {regionFilter !== 'all' 
                    ? `No medications approved by ${regionFilter === 'Asia' && asiaSubFilter ? asiaSubFilter : regionFilter} match your criteria`
                    : "Try adjusting your search or filters"
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setDebouncedSearch("");
                    setSelectedCategory("all");
                    setShowBlackBoxOnly(false);
                    setShowControlledOnly(false);
                    setRegionFilter('all');
                    setAsiaSubFilter(null);
                  }}
                  className="h-11"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-1">{t("medications.disclaimer", "Clinical Disclaimer")}</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    This information is for educational purposes. Always verify with current prescribing information and consult regional regulatory guidelines. Dosing may vary by country and individual patient factors.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isMobile && (
        <MedicationsBottomNav 
          activeSection={regionFilter === 'FDA' ? 'fda' : regionFilter === 'EMA' ? 'ema' : regionFilter === 'Asia' ? 'asia' : 'all'}
          onSectionChange={(section) => handleRegionChange(section === 'fda' ? 'FDA' : section === 'ema' ? 'EMA' : section === 'asia' ? 'Asia' : 'all')}
        />
      )}
    </div>
  );
}

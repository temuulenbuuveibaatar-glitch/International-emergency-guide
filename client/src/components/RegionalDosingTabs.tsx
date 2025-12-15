import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Pill, Baby, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RegionalDosing {
  region: 'USA' | 'EU' | 'Japan' | 'China' | 'Korea' | 'Singapore' | 'Australia';
  adultDose: string;
  pediatricDose?: string;
  maxDose: string;
  notes?: string;
}

interface RegionalDosingTabsProps {
  dosing?: RegionalDosing[];
  defaultRegion?: string;
  className?: string;
}

const regionConfig: Record<string, { 
  flag: string; 
  label: string; 
  shortLabel: string;
}> = {
  USA: { flag: '🇺🇸', label: 'USA (FDA)', shortLabel: 'USA' },
  EU: { flag: '🇪🇺', label: 'Europe (EMA)', shortLabel: 'EU' },
  Japan: { flag: '🇯🇵', label: 'Japan (PMDA)', shortLabel: 'JP' },
  China: { flag: '🇨🇳', label: 'China (NMPA)', shortLabel: 'CN' },
  Korea: { flag: '🇰🇷', label: 'Korea (MFDS)', shortLabel: 'KR' },
  Singapore: { flag: '🇸🇬', label: 'Singapore (HSA)', shortLabel: 'SG' },
  Australia: { flag: '🇦🇺', label: 'Australia (TGA)', shortLabel: 'AU' },
};

export function RegionalDosingTabs({ 
  dosing = [],
  defaultRegion,
  className 
}: RegionalDosingTabsProps) {
  if (!dosing || dosing.length === 0) {
    return (
      <div className={cn("p-4 text-center text-gray-500 text-sm", className)}>
        <Info className="h-5 w-5 mx-auto mb-2 opacity-50" />
        <p>Regional dosing data not available</p>
      </div>
    );
  }

  const defaultValue = defaultRegion || dosing[0]?.region || 'USA';

  return (
    <div className={className} data-testid="regional-dosing-tabs">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="w-full flex overflow-x-auto gap-1 h-auto p-1 bg-muted/50">
          {dosing.map((dose) => {
            const config = regionConfig[dose.region] || { 
              flag: '🌍', 
              label: dose.region, 
              shortLabel: dose.region.slice(0, 2) 
            };
            return (
              <TabsTrigger
                key={dose.region}
                value={dose.region}
                className="flex items-center gap-1.5 min-h-[44px] px-3 text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid={`tab-region-${dose.region.toLowerCase()}`}
              >
                <span className="text-base">{config.flag}</span>
                <span className="hidden sm:inline">{config.shortLabel}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {dosing.map((dose) => {
          const config = regionConfig[dose.region] || { 
            flag: '🌍', 
            label: dose.region, 
            shortLabel: dose.region 
          };
          
          return (
            <TabsContent 
              key={dose.region} 
              value={dose.region}
              className="mt-3 space-y-3"
              data-testid={`content-region-${dose.region.toLowerCase()}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{config.flag}</span>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {config.label} Dosing
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Pill className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Adult Dose
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 break-words">
                      {dose.adultDose}
                    </p>
                  </div>
                </div>

                {dose.pediatricDose && (
                  <div className="flex items-start gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <Baby className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-pink-800 dark:text-pink-300">
                        Pediatric Dose
                      </p>
                      <p className="text-sm text-pink-700 dark:text-pink-400 break-words">
                        {dose.pediatricDose}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Dose
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    {dose.maxDose}
                  </Badge>
                </div>

                {dose.notes && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Regional Notes
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 break-words">
                        {dose.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

interface DosingComparisonProps {
  dosing?: RegionalDosing[];
  className?: string;
}

export function DosingComparison({ dosing = [], className }: DosingComparisonProps) {
  if (!dosing || dosing.length < 2) {
    return null;
  }

  const hasVariation = dosing.some((d, i) => 
    i > 0 && (d.adultDose !== dosing[0].adultDose || d.maxDose !== dosing[0].maxDose)
  );

  if (!hasVariation) {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-xs",
        className
      )}
      data-testid="dosing-comparison-warning"
    >
      <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
      <span className="text-orange-700 dark:text-orange-300 font-medium">
        Dosing varies by region - review regional guidelines
      </span>
    </div>
  );
}

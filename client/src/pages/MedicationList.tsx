import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pill, 
  Search,
  ArrowLeft,
  AlertTriangle,
  Info,
  Shield,
  Heart,
  Stethoscope
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MedicationList() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  const { data: medications, isLoading } = useQuery({
    queryKey: ["/api/medications"],
    enabled: !!user,
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = Array.isArray(medications)
    ? Array.from(new Set(medications.map((m: any) => m.category)))
    : [];

  const filteredMedications = Array.isArray(medications)
    ? medications.filter((med: any) => {
        const matchesSearch =
          med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || med.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/hospital">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medication Database</h1>
              <p className="text-sm text-gray-500">FDA-approved dosing and drug information</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]" data-testid="select-category">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: string) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredMedications.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMedications.map((medication: any) => (
              <Dialog key={medication.id}>
                <DialogTrigger asChild>
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedMedication(medication)}
                    data-testid={`card-medication-${medication.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{medication.name}</CardTitle>
                          <CardDescription>{medication.genericName}</CardDescription>
                        </div>
                        {medication.isControlled && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {medication.controlledSchedule}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{medication.category}</Badge>
                          <Badge variant="secondary">{medication.form}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          <strong>Route:</strong> {medication.route}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Strength:</strong> {medication.strength}
                        </p>
                        {medication.blackBoxWarning && (
                          <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                            <AlertTriangle className="w-3 h-3" />
                            Black Box Warning
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      {medication.name}
                      {medication.isControlled && (
                        <Badge variant="destructive">{medication.controlledSchedule}</Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription>
                      {medication.genericName} | {medication.category}
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-[70vh]">
                    <Tabs defaultValue="dosing" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="dosing">Dosing</TabsTrigger>
                        <TabsTrigger value="safety">Safety</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="dosing" className="space-y-4 p-4">
                        <div>
                          <h4 className="font-semibold mb-2">Adult Dosing</h4>
                          <p className="text-sm bg-blue-50 p-3 rounded">
                            {medication.standardDoseAdult || 'See package insert'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Pediatric Dosing</h4>
                          <p className="text-sm bg-blue-50 p-3 rounded">
                            {medication.standardDosePediatric || 'Consult specialist'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Maximum Daily Dose</h4>
                          <p className="text-sm bg-amber-50 p-3 rounded">
                            {medication.maxDailyDose || 'See package insert'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Frequency</h4>
                          <p className="text-sm">{medication.dosingFrequency}</p>
                        </div>
                        {medication.weightBasedDosing && (
                          <div>
                            <h4 className="font-semibold mb-2">Weight-Based Formula</h4>
                            <p className="text-sm bg-green-50 p-3 rounded">
                              {medication.weightBasedFormula}
                            </p>
                          </div>
                        )}
                        {medication.renalAdjustment && (
                          <div>
                            <h4 className="font-semibold mb-2">Renal Adjustment</h4>
                            <p className="text-sm">{medication.renalAdjustment}</p>
                          </div>
                        )}
                        {medication.hepaticAdjustment && (
                          <div>
                            <h4 className="font-semibold mb-2">Hepatic Adjustment</h4>
                            <p className="text-sm">{medication.hepaticAdjustment}</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="safety" className="space-y-4 p-4">
                        {medication.blackBoxWarning && (
                          <div className="bg-red-50 border border-red-200 p-4 rounded">
                            <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                              <AlertTriangle className="w-5 h-5" />
                              BLACK BOX WARNING
                            </div>
                            <p className="text-sm text-red-700">{medication.blackBoxWarning}</p>
                          </div>
                        )}
                        {medication.pregnancyCategory && (
                          <div>
                            <h4 className="font-semibold mb-2">Pregnancy Category</h4>
                            <Badge variant={medication.pregnancyCategory === 'X' ? 'destructive' : 'secondary'}>
                              Category {medication.pregnancyCategory}
                            </Badge>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold mb-2">Contraindications</h4>
                          {medication.contraindications?.length > 0 ? (
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {medication.contraindications.map((c: string, i: number) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">See package insert</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Side Effects</h4>
                          {medication.sideEffects?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {medication.sideEffects.map((s: string, i: number) => (
                                <Badge key={i} variant="outline">{s}</Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">See package insert</p>
                          )}
                        </div>
                        {medication.specialPrecautions && (
                          <div>
                            <h4 className="font-semibold mb-2">Special Precautions</h4>
                            <p className="text-sm">{medication.specialPrecautions}</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="interactions" className="space-y-4 p-4">
                        <div>
                          <h4 className="font-semibold mb-2">Drug Interactions</h4>
                          {medication.drugInteractions?.length > 0 ? (
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {medication.drugInteractions.map((d: string, i: number) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No major interactions documented</p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="monitoring" className="space-y-4 p-4">
                        <div>
                          <h4 className="font-semibold mb-2">Monitoring Parameters</h4>
                          {medication.monitoringParameters?.length > 0 ? (
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {medication.monitoringParameters.map((m: string, i: number) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">Standard monitoring</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Required Labs</h4>
                          {medication.labsRequired?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {medication.labsRequired.map((l: string, i: number) => (
                                <Badge key={i} variant="secondary">{l}</Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">See package insert</p>
                          )}
                        </div>
                        {medication.administrationNotes && (
                          <div>
                            <h4 className="font-semibold mb-2">Administration Notes</h4>
                            <p className="text-sm bg-blue-50 p-3 rounded">
                              {medication.administrationNotes}
                            </p>
                          </div>
                        )}
                        {medication.storageRequirements && (
                          <div>
                            <h4 className="font-semibold mb-2">Storage</h4>
                            <p className="text-sm">{medication.storageRequirements}</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Pill className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No medications found</h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search criteria
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

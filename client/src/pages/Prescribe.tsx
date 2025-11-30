import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { 
  ArrowLeft,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle,
  Search,
  Shield
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Prescribe() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [safetyCheck, setSafetyCheck] = useState<any>(null);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const { toast } = useToast();

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !!user,
  });

  const { data: medications } = useQuery({
    queryKey: ["/api/medications"],
    enabled: !!user,
  });

  const form = useForm({
    defaultValues: {
      patientId: "",
      medicationId: "",
      dose: "",
      doseUnit: "mg",
      frequency: "",
      route: "",
      duration: "",
      instructions: "",
      reason: "",
    },
  });

  const safetyCheckMutation = useMutation({
    mutationFn: async (data: { medicationId: number; patientId: number }) => {
      return await apiRequest("POST", "/api/drug-safety-check", data);
    },
    onSuccess: (data) => {
      setSafetyCheck(data);
      setShowSafetyDialog(true);
    },
    onError: (error) => {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    },
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/prescriptions", {
        ...data,
        patientId: parseInt(data.patientId),
        medicationId: parseInt(data.medicationId),
        startDate: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "Prescription created successfully" });
      form.reset();
      setSelectedPatient(null);
      setSelectedMedication(null);
      setSafetyCheck(null);
    },
    onError: (error: any) => {
      const message = error?.message || String(error);
      if (message.includes("drug interaction")) {
        toast({ 
          title: "Drug Interaction Detected", 
          description: "This medication has a severe interaction with current medications.",
          variant: "destructive" 
        });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">Please sign in to prescribe medications.</p>
            <Button asChild className="mt-4">
              <a href="/api/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = (user as any)?.role || 'nurse';
  if (userRole !== 'doctor' && userRole !== 'director') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-bold">Physician Access Required</h2>
            <p className="text-muted-foreground mt-2">
              Only doctors and directors can prescribe medications.
            </p>
            <p className="text-sm mt-2">Your current role: <Badge>{userRole}</Badge></p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/hospital">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const admittedPatients = Array.isArray(patients) 
    ? patients.filter((p: any) => p.status === 'admitted')
    : [];

  const handlePatientSelect = (patientId: string) => {
    const patient = admittedPatients.find((p: any) => p.id.toString() === patientId);
    setSelectedPatient(patient);
    form.setValue('patientId', patientId);
  };

  const handleMedicationSelect = (medicationId: string) => {
    const medication = Array.isArray(medications) 
      ? medications.find((m: any) => m.id.toString() === medicationId)
      : null;
    setSelectedMedication(medication);
    form.setValue('medicationId', medicationId);
    
    if (medication) {
      form.setValue('route', medication.route || '');
      form.setValue('frequency', medication.dosingFrequency || '');
    }
  };

  const handleSafetyCheck = () => {
    const patientId = form.getValues('patientId');
    const medicationId = form.getValues('medicationId');
    
    if (patientId && medicationId) {
      safetyCheckMutation.mutate({
        patientId: parseInt(patientId),
        medicationId: parseInt(medicationId),
      });
    }
  };

  const onSubmit = (data: any) => {
    createPrescriptionMutation.mutate(data);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Prescribe Medication</h1>
              <p className="text-sm text-gray-500">Create new medication orders with safety checks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Patient</CardTitle>
                <CardDescription>Choose the patient for this prescription</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={handlePatientSelect} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-patient">
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {admittedPatients.map((patient: any) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.firstName} {patient.lastName} (MRN: {patient.mrn})
                              {patient.roomNumber && ` - Room ${patient.roomNumber}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedPatient && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Patient Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Age:</span>{' '}
                        {selectedPatient.dateOfBirth ? 
                          Math.floor((Date.now() - new Date(selectedPatient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) + ' years'
                          : 'N/A'
                        }
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight:</span>{' '}
                        {selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}
                      </div>
                    </div>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        <strong>Allergies:</strong> {selectedPatient.allergies.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Medication</CardTitle>
                <CardDescription>Choose the medication and dosing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication</FormLabel>
                      <Select onValueChange={handleMedicationSelect} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-medication">
                            <SelectValue placeholder="Select medication" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(medications) && medications.map((med: any) => (
                            <SelectItem key={med.id} value={med.id.toString()}>
                              {med.name} ({med.strength}) - {med.form}
                              {med.isControlled && ' [Controlled]'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedMedication && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <h4 className="font-medium">{selectedMedication.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedMedication.genericName}</p>
                    
                    {selectedMedication.blackBoxWarning && (
                      <div className="p-2 bg-red-100 rounded text-sm text-red-800">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        <strong>Black Box Warning:</strong> {selectedMedication.blackBoxWarning}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div><strong>Adult Dose:</strong> {selectedMedication.standardDoseAdult}</div>
                      <div><strong>Max Daily:</strong> {selectedMedication.maxDailyDose}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dose</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 500" {...field} data-testid="input-dose" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doseUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-unit">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="mcg">mcg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="mL">mL</SelectItem>
                            <SelectItem value="units">units</SelectItem>
                            <SelectItem value="tablets">tablets</SelectItem>
                            <SelectItem value="puffs">puffs</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="once">Once</SelectItem>
                            <SelectItem value="BID">Twice daily (BID)</SelectItem>
                            <SelectItem value="TID">Three times daily (TID)</SelectItem>
                            <SelectItem value="QID">Four times daily (QID)</SelectItem>
                            <SelectItem value="Q4H">Every 4 hours</SelectItem>
                            <SelectItem value="Q6H">Every 6 hours</SelectItem>
                            <SelectItem value="Q8H">Every 8 hours</SelectItem>
                            <SelectItem value="Q12H">Every 12 hours</SelectItem>
                            <SelectItem value="daily">Once daily</SelectItem>
                            <SelectItem value="PRN">As needed (PRN)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-route">
                              <SelectValue placeholder="Select route" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Oral">Oral (PO)</SelectItem>
                            <SelectItem value="IV">Intravenous (IV)</SelectItem>
                            <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                            <SelectItem value="SC">Subcutaneous (SC)</SelectItem>
                            <SelectItem value="Inhalation">Inhalation</SelectItem>
                            <SelectItem value="Topical">Topical</SelectItem>
                            <SelectItem value="Rectal">Rectal</SelectItem>
                            <SelectItem value="Sublingual">Sublingual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 7 days, 2 weeks, until discontinued" {...field} data-testid="input-duration" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indication/Reason</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bacterial infection, Hypertension" {...field} data-testid="input-reason" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Take with food, Avoid dairy products"
                          {...field}
                          data-testid="input-instructions"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleSafetyCheck}
                disabled={!form.getValues('patientId') || !form.getValues('medicationId') || safetyCheckMutation.isPending}
                data-testid="btn-safety-check"
              >
                <Shield className="w-4 h-4 mr-2" />
                Run Safety Check
              </Button>
              
              <Button 
                type="submit" 
                disabled={createPrescriptionMutation.isPending || !form.getValues('patientId') || !form.getValues('medicationId') || !form.getValues('dose')}
                data-testid="btn-prescribe"
              >
                <FileText className="w-4 h-4 mr-2" />
                {createPrescriptionMutation.isPending ? "Creating..." : "Create Prescription"}
              </Button>
            </div>
          </form>
        </Form>
      </main>

      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Drug Safety Check Results
            </DialogTitle>
            <DialogDescription>
              Review potential safety concerns before prescribing
            </DialogDescription>
          </DialogHeader>
          {safetyCheck && (
            <div className="space-y-4">
              {safetyCheck.warnings && safetyCheck.warnings.length > 0 ? (
                <div className="space-y-2">
                  {safetyCheck.warnings.map((warning: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 rounded text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">No major safety concerns identified</span>
                </div>
              )}
              
              {safetyCheck.contraindications && safetyCheck.contraindications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-800">Contraindications</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-red-700">
                    {safetyCheck.contraindications.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {safetyCheck.allergyWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    {safetyCheck.allergyWarning}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setShowSafetyDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

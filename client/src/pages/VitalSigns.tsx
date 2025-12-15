import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Activity, 
  ArrowLeft,
  Plus,
  Heart,
  Thermometer,
  Wind,
  Droplet
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function VitalSigns() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: vitalSigns, isLoading } = useQuery({
    queryKey: ["/api/vital-signs", selectedPatient],
    enabled: !!user,
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !!user,
  });

  const form = useForm({
    defaultValues: {
      patientId: "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      oxygenSaturation: "",
      painLevel: "",
      bloodGlucose: "",
      notes: "",
    },
  });

  const createVitalsMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        patientId: parseInt(data.patientId),
        recordedBy: (user as any)?.id,
        temperature: data.temperature ? parseFloat(data.temperature) : null,
        heartRate: data.heartRate ? parseInt(data.heartRate) : null,
        respiratoryRate: data.respiratoryRate ? parseInt(data.respiratoryRate) : null,
        bloodPressureSystolic: data.bloodPressureSystolic ? parseInt(data.bloodPressureSystolic) : null,
        bloodPressureDiastolic: data.bloodPressureDiastolic ? parseInt(data.bloodPressureDiastolic) : null,
        oxygenSaturation: data.oxygenSaturation ? parseInt(data.oxygenSaturation) : null,
        painLevel: data.painLevel ? parseInt(data.painLevel) : null,
        bloodGlucose: data.bloodGlucose ? parseFloat(data.bloodGlucose) : null,
        notes: data.notes || null,
      };
      return await apiRequest("POST", "/api/vital-signs", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vital-signs"] });
      toast({ title: "Vital signs recorded successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    },
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const admittedPatients = Array.isArray(patients) 
    ? patients.filter((p: any) => p.status === 'admitted')
    : [];

  const getPatientName = (patientId: number) => {
    const patient = admittedPatients.find((p: any) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${patientId}`;
  };

  const getVitalStatus = (type: string, value: number | null) => {
    if (value === null) return 'normal';
    
    switch (type) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 50 || value > 120) return 'critical';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'warning';
        if (value < 90) return 'critical';
        return 'normal';
      case 'temperature':
        if (value < 36 || value > 37.5) return 'warning';
        if (value < 35 || value > 38.5) return 'critical';
        return 'normal';
      case 'systolic':
        if (value < 90 || value > 140) return 'warning';
        if (value < 80 || value > 180) return 'critical';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const onSubmit = (data: any) => {
    createVitalsMutation.mutate(data);
  };

  const filteredVitals = Array.isArray(vitalSigns)
    ? (selectedPatient === 'all' 
        ? vitalSigns 
        : vitalSigns.filter((v: any) => v.patientId === parseInt(selectedPatient)))
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
              <h1 className="text-2xl font-bold text-gray-900">Vital Signs</h1>
              <p className="text-sm text-gray-500">Record and monitor patient vital signs</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label>Filter by Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger data-testid="select-patient">
                    <SelectValue placeholder="All patients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients</SelectItem>
                    {admittedPatients.map((patient: any) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.firstName} {patient.lastName} (MRN: {patient.mrn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="btn-record-vitals">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Vitals
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Record Vital Signs</DialogTitle>
                    <DialogDescription>
                      Enter the patient's current vital signs
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="patientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="input-patient">
                                  <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {admittedPatients.map((patient: any) => (
                                  <SelectItem key={patient.id} value={patient.id.toString()}>
                                    {patient.firstName} {patient.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="temperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Temperature (°C)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" placeholder="36.5" {...field} data-testid="input-temp" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="heartRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Heart Rate (bpm)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="72" {...field} data-testid="input-hr" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="respiratoryRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Respiratory Rate</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="16" {...field} data-testid="input-rr" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="oxygenSaturation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>O2 Saturation (%)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="98" {...field} data-testid="input-o2" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bloodPressureSystolic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BP Systolic</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="120" {...field} data-testid="input-sys" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bloodPressureDiastolic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BP Diastolic</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="80" {...field} data-testid="input-dia" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="painLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pain Level (0-10)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="0" {...field} data-testid="input-pain" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bloodGlucose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blood Glucose</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" placeholder="100" {...field} data-testid="input-glucose" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Additional observations..." {...field} data-testid="input-notes" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createVitalsMutation.isPending} data-testid="btn-submit-vitals">
                          {createVitalsMutation.isPending ? "Recording..." : "Record Vitals"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVitals.length > 0 ? (
          <div className="grid gap-4">
            {filteredVitals.slice(0, 20).map((vitals: any) => (
              <Card key={vitals.id} data-testid={`card-vitals-${vitals.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{getPatientName(vitals.patientId)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(vitals.recordedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {vitals.temperature && (
                      <div className="text-center p-2 rounded bg-gray-50">
                        <Thermometer className="w-5 h-5 mx-auto text-gray-500 mb-1" />
                        <p className="text-lg font-semibold">{vitals.temperature}°C</p>
                        <p className="text-xs text-gray-500">Temp</p>
                      </div>
                    )}
                    {vitals.heartRate && (
                      <div className={`text-center p-2 rounded ${
                        getVitalStatus('heartRate', vitals.heartRate) === 'critical' ? 'bg-red-50' :
                        getVitalStatus('heartRate', vitals.heartRate) === 'warning' ? 'bg-amber-50' : 'bg-gray-50'
                      }`}>
                        <Heart className="w-5 h-5 mx-auto text-red-500 mb-1" />
                        <p className="text-lg font-semibold">{vitals.heartRate}</p>
                        <p className="text-xs text-gray-500">HR (bpm)</p>
                      </div>
                    )}
                    {vitals.respiratoryRate && (
                      <div className="text-center p-2 rounded bg-gray-50">
                        <Wind className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                        <p className="text-lg font-semibold">{vitals.respiratoryRate}</p>
                        <p className="text-xs text-gray-500">RR</p>
                      </div>
                    )}
                    {vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic && (
                      <div className={`text-center p-2 rounded ${
                        getVitalStatus('systolic', vitals.bloodPressureSystolic) === 'critical' ? 'bg-red-50' :
                        getVitalStatus('systolic', vitals.bloodPressureSystolic) === 'warning' ? 'bg-amber-50' : 'bg-gray-50'
                      }`}>
                        <Activity className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                        <p className="text-lg font-semibold">{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</p>
                        <p className="text-xs text-gray-500">BP</p>
                      </div>
                    )}
                    {vitals.oxygenSaturation && (
                      <div className={`text-center p-2 rounded ${
                        getVitalStatus('oxygenSaturation', vitals.oxygenSaturation) === 'critical' ? 'bg-red-50' :
                        getVitalStatus('oxygenSaturation', vitals.oxygenSaturation) === 'warning' ? 'bg-amber-50' : 'bg-gray-50'
                      }`}>
                        <Droplet className="w-5 h-5 mx-auto text-cyan-500 mb-1" />
                        <p className="text-lg font-semibold">{vitals.oxygenSaturation}%</p>
                        <p className="text-xs text-gray-500">SpO2</p>
                      </div>
                    )}
                    {vitals.painLevel !== null && vitals.painLevel !== undefined && (
                      <div className={`text-center p-2 rounded ${
                        vitals.painLevel >= 7 ? 'bg-red-50' :
                        vitals.painLevel >= 4 ? 'bg-amber-50' : 'bg-gray-50'
                      }`}>
                        <p className="text-lg font-semibold">{vitals.painLevel}/10</p>
                        <p className="text-xs text-gray-500">Pain</p>
                      </div>
                    )}
                  </div>
                  {vitals.notes && (
                    <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Notes:</strong> {vitals.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No vital signs recorded</h3>
              <p className="text-gray-500 mt-1">
                Record the first set of vital signs to get started
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

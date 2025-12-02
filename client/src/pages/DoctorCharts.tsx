import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  User,
  Pill,
  FileText,
  Activity,
  Search,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Heart,
  Thermometer,
  Stethoscope,
  ClipboardList,
  Edit,
  History,
  Save
} from "lucide-react";
import type { Patient, Prescription, VitalSigns, ClinicalNote, Problem } from "@shared/schema";

export default function DoctorCharts() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, params] = useRoute("/hospital/charts/:patientId?");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    params?.patientId ? parseInt(params.patientId) : null
  );
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  
  const [newNote, setNewNote] = useState({
    noteType: 'progress',
    title: '',
    content: ''
  });

  const [newProblem, setNewProblem] = useState({
    description: '',
    icdCode: '',
    severity: 'moderate',
    onsetDate: '',
    notes: ''
  });

  const { data: patients = [], isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients']
  });

  const { data: searchResults = [] } = useQuery<Patient[]>({
    queryKey: ['/api/patients/search', searchQuery],
    enabled: searchQuery.length > 2
  });

  const { data: selectedPatient } = useQuery<Patient>({
    queryKey: ['/api/patients', selectedPatientId],
    enabled: !!selectedPatientId
  });

  const { data: prescriptions = [] } = useQuery<Prescription[]>({
    queryKey: ['/api/prescriptions', { patientId: selectedPatientId }],
    enabled: !!selectedPatientId
  });

  const { data: vitals = [] } = useQuery<VitalSigns[]>({
    queryKey: ['/api/vitals', { patientId: selectedPatientId }],
    enabled: !!selectedPatientId
  });

  const { data: notes = [] } = useQuery<ClinicalNote[]>({
    queryKey: ['/api/patients', selectedPatientId, 'notes'],
    enabled: !!selectedPatientId
  });

  const { data: problems = [] } = useQuery<Problem[]>({
    queryKey: ['/api/patients', selectedPatientId, 'problems'],
    enabled: !!selectedPatientId
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: typeof newNote) => {
      const response = await apiRequest('POST', `/api/patients/${selectedPatientId}/notes`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', selectedPatientId, 'notes'] });
      setNoteDialogOpen(false);
      setNewNote({ noteType: 'progress', title: '', content: '' });
      toast({ title: "Note added successfully" });
    }
  });

  const createProblemMutation = useMutation({
    mutationFn: async (data: typeof newProblem) => {
      const response = await apiRequest('POST', `/api/patients/${selectedPatientId}/problems`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', selectedPatientId, 'problems'] });
      setProblemDialogOpen(false);
      setNewProblem({ description: '', icdCode: '', severity: 'moderate', onsetDate: '', notes: '' });
      toast({ title: "Problem added successfully" });
    }
  });

  const displayPatients = searchQuery.length > 2 ? searchResults : patients.slice(0, 20);

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
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
            <ClipboardList className="w-8 h-8 text-blue-600" />
            {t('charts.title') || 'Patient Charts'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('charts.description') || 'View and manage patient medical records, medications, and clinical notes'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-4" data-testid="card-patient-list">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {t('charts.findPatient') || 'Find Patient'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder={t('charts.searchPlaceholder') || 'Search by name or MRN...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                  data-testid="input-patient-search"
                />
                
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {patientsLoading ? (
                      <p className="text-center text-gray-500 py-4">Loading...</p>
                    ) : displayPatients.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        {searchQuery ? 'No patients found' : 'No patients'}
                      </p>
                    ) : (
                      displayPatients.map((patient) => (
                        <Card 
                          key={patient.id}
                          className={`cursor-pointer transition-colors ${
                            selectedPatientId === patient.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => setSelectedPatientId(patient.id)}
                          data-testid={`card-patient-${patient.id}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                                <p className="text-sm text-gray-500">MRN: {patient.mrn}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!selectedPatient ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    {t('charts.selectPatient') || 'Select a patient to view their chart'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border-l-4 border-l-blue-500" data-testid="card-patient-header">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </h2>
                          <div className="flex items-center gap-4 mt-1 text-gray-600">
                            <span>MRN: {selectedPatient.mrn}</span>
                            <span>{calculateAge(selectedPatient.dateOfBirth)} years old</span>
                            <span className="capitalize">{selectedPatient.gender}</span>
                            {selectedPatient.bloodType && <span>Blood: {selectedPatient.bloodType}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={selectedPatient.status === 'admitted' ? 'default' : 'secondary'}>
                          {selectedPatient.status}
                        </Badge>
                        {selectedPatient.roomNumber && (
                          <p className="text-sm text-gray-500 mt-1">
                            Room {selectedPatient.roomNumber}
                            {selectedPatient.bedNumber && ` - Bed ${selectedPatient.bedNumber}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {(selectedPatient.allergies?.length || 0) > 0 && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-medium">Allergies:</span>
                          <span>{selectedPatient.allergies?.join(', ')}</span>
                        </div>
                      </div>
                    )}

                    {(selectedPatient.chronicConditions?.length || 0) > 0 && (
                      <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                          <Heart className="w-5 h-5" />
                          <span className="font-medium">Chronic Conditions:</span>
                          <span>{selectedPatient.chronicConditions?.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                    <TabsTrigger value="medications" data-testid="tab-medications">Medications</TabsTrigger>
                    <TabsTrigger value="problems" data-testid="tab-problems">Problems</TabsTrigger>
                    <TabsTrigger value="vitals" data-testid="tab-vitals">Vitals</TabsTrigger>
                    <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Pill className="w-5 h-5 text-purple-600" />
                            Active Medications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {prescriptions.filter(p => p.status === 'active').length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No active medications</p>
                          ) : (
                            <ul className="space-y-2">
                              {prescriptions.filter(p => p.status === 'active').slice(0, 5).map(rx => (
                                <li key={rx.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <span className="font-medium">{rx.dose} {rx.doseUnit}</span>
                                  <span className="text-sm text-gray-500">{rx.frequency}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Active Problems
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {problems.filter(p => p.status === 'active').length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No active problems</p>
                          ) : (
                            <ul className="space-y-2">
                              {problems.filter(p => p.status === 'active').slice(0, 5).map(problem => (
                                <li key={problem.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <span>{problem.description}</span>
                                  {problem.icdCode && (
                                    <Badge variant="outline">{problem.icdCode}</Badge>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-600" />
                            Latest Vitals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {vitals.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No vitals recorded</p>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              {vitals[0]?.temperature && (
                                <div className="flex items-center gap-2">
                                  <Thermometer className="w-4 h-4 text-red-500" />
                                  <span>{vitals[0].temperature}°{vitals[0].temperatureUnit || 'C'}</span>
                                </div>
                              )}
                              {vitals[0]?.heartRate && (
                                <div className="flex items-center gap-2">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span>{vitals[0].heartRate} bpm</span>
                                </div>
                              )}
                              {vitals[0]?.bloodPressureSystolic && (
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-blue-500" />
                                  <span>{vitals[0].bloodPressureSystolic}/{vitals[0].bloodPressureDiastolic} mmHg</span>
                                </div>
                              )}
                              {vitals[0]?.oxygenSaturation && (
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-500">O₂</span>
                                  <span>{vitals[0].oxygenSaturation}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Recent Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {notes.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No clinical notes</p>
                          ) : (
                            <ul className="space-y-2">
                              {notes.slice(0, 3).map(note => (
                                <li key={note.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{note.title || note.noteType}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(note.createdAt!).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {note.content}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Medication List</CardTitle>
                        <Link href={`/hospital/prescribe?patientId=${selectedPatientId}`}>
                          <Button size="sm" data-testid="btn-new-prescription">
                            <Plus className="w-4 h-4 mr-2" />
                            New Prescription
                          </Button>
                        </Link>
                      </CardHeader>
                      <CardContent>
                        {prescriptions.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">No medications on record</p>
                        ) : (
                          <div className="space-y-4">
                            {prescriptions.map(rx => (
                              <Card key={rx.id} className={`${rx.status === 'active' ? 'border-l-4 border-l-green-500' : 'opacity-60'}`}>
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold">{rx.dose} {rx.doseUnit}</h4>
                                      <p className="text-sm text-gray-600">{rx.frequency} - {rx.route}</p>
                                      {rx.instructions && (
                                        <p className="text-sm text-gray-500 mt-1">{rx.instructions}</p>
                                      )}
                                    </div>
                                    <Badge variant={rx.status === 'active' ? 'default' : 'secondary'}>
                                      {rx.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      Started: {new Date(rx.startDate).toLocaleDateString()}
                                    </span>
                                    {rx.endDate && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Ends: {new Date(rx.endDate).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="problems" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Problem List</CardTitle>
                        <Dialog open={problemDialogOpen} onOpenChange={setProblemDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" data-testid="btn-add-problem">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Problem
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Problem</DialogTitle>
                              <DialogDescription>
                                Document a new diagnosis or clinical problem for this patient.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Description *</Label>
                                <Input
                                  value={newProblem.description}
                                  onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                                  placeholder="e.g., Type 2 Diabetes Mellitus"
                                  data-testid="input-problem-description"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>ICD-10 Code</Label>
                                  <Input
                                    value={newProblem.icdCode}
                                    onChange={(e) => setNewProblem({...newProblem, icdCode: e.target.value})}
                                    placeholder="e.g., E11.9"
                                    data-testid="input-problem-icd"
                                  />
                                </div>
                                <div>
                                  <Label>Severity</Label>
                                  <Select value={newProblem.severity} onValueChange={(v) => setNewProblem({...newProblem, severity: v})}>
                                    <SelectTrigger data-testid="select-problem-severity">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="mild">Mild</SelectItem>
                                      <SelectItem value="moderate">Moderate</SelectItem>
                                      <SelectItem value="severe">Severe</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Onset Date</Label>
                                <Input
                                  type="date"
                                  value={newProblem.onsetDate}
                                  onChange={(e) => setNewProblem({...newProblem, onsetDate: e.target.value})}
                                  data-testid="input-problem-onset"
                                />
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <Textarea
                                  value={newProblem.notes}
                                  onChange={(e) => setNewProblem({...newProblem, notes: e.target.value})}
                                  placeholder="Additional clinical notes..."
                                  data-testid="textarea-problem-notes"
                                />
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={() => createProblemMutation.mutate(newProblem)}
                                disabled={!newProblem.description || createProblemMutation.isPending}
                                data-testid="btn-save-problem"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Problem
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {problems.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">No problems documented</p>
                        ) : (
                          <div className="space-y-3">
                            {problems.map(problem => (
                              <Card key={problem.id} className={`${problem.status === 'active' ? 'border-l-4 border-l-orange-500' : 'opacity-60'}`}>
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold">{problem.description}</h4>
                                      {problem.notes && (
                                        <p className="text-sm text-gray-600 mt-1">{problem.notes}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {problem.icdCode && (
                                        <Badge variant="outline">{problem.icdCode}</Badge>
                                      )}
                                      <Badge variant={problem.status === 'active' ? 'default' : 'secondary'}>
                                        {problem.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  {problem.onsetDate && (
                                    <p className="text-sm text-gray-500 mt-2">
                                      Onset: {new Date(problem.onsetDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="vitals" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vital Signs History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {vitals.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">No vitals recorded</p>
                        ) : (
                          <div className="space-y-4">
                            {vitals.map(vital => (
                              <Card key={vital.id}>
                                <CardContent className="pt-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">
                                      {new Date(vital.recordedAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {vital.temperature && (
                                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                          <Thermometer className="w-4 h-4" />
                                          Temperature
                                        </div>
                                        <p className="text-lg font-semibold">{vital.temperature}°{vital.temperatureUnit || 'C'}</p>
                                      </div>
                                    )}
                                    {vital.heartRate && (
                                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                          <Heart className="w-4 h-4" />
                                          Heart Rate
                                        </div>
                                        <p className="text-lg font-semibold">{vital.heartRate} bpm</p>
                                      </div>
                                    )}
                                    {vital.bloodPressureSystolic && (
                                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                          <Activity className="w-4 h-4" />
                                          Blood Pressure
                                        </div>
                                        <p className="text-lg font-semibold">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</p>
                                      </div>
                                    )}
                                    {vital.oxygenSaturation && (
                                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-sm text-gray-500">SpO₂</div>
                                        <p className="text-lg font-semibold">{vital.oxygenSaturation}%</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Clinical Notes</CardTitle>
                        <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" data-testid="btn-add-note">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Add Clinical Note</DialogTitle>
                              <DialogDescription>
                                Document clinical observations, assessments, or plans for this patient.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Note Type</Label>
                                  <Select value={newNote.noteType} onValueChange={(v) => setNewNote({...newNote, noteType: v})}>
                                    <SelectTrigger data-testid="select-note-type">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="progress">Progress Note</SelectItem>
                                      <SelectItem value="admission">Admission Note</SelectItem>
                                      <SelectItem value="discharge">Discharge Note</SelectItem>
                                      <SelectItem value="consultation">Consultation</SelectItem>
                                      <SelectItem value="procedure">Procedure Note</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Title</Label>
                                  <Input
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                                    placeholder="Note title..."
                                    data-testid="input-note-title"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Content *</Label>
                                <Textarea
                                  value={newNote.content}
                                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                                  placeholder="Enter clinical note content..."
                                  rows={10}
                                  data-testid="textarea-note-content"
                                />
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={() => createNoteMutation.mutate(newNote)}
                                disabled={!newNote.content || createNoteMutation.isPending}
                                data-testid="btn-save-note"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Note
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {notes.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">No clinical notes</p>
                        ) : (
                          <div className="space-y-4">
                            {notes.map(note => (
                              <Card key={note.id}>
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline">{note.noteType}</Badge>
                                        {note.title && <h4 className="font-semibold">{note.title}</h4>}
                                      </div>
                                      <p className="text-sm text-gray-500 mt-1">
                                        {new Date(note.createdAt!).toLocaleString()}
                                      </p>
                                    </div>
                                    {note.isSigned && (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Signed
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {note.content}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

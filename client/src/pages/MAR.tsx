import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ClipboardList, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Pill,
  User
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MAR() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [adminAction, setAdminAction] = useState<'administer' | 'hold' | 'refuse' | null>(null);
  const [actionNote, setActionNote] = useState("");
  const { toast } = useToast();

  const { data: administrations, isLoading } = useQuery({
    queryKey: ["/api/medication-administrations", selectedDate],
    enabled: !!user,
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !!user,
  });

  const updateAdminMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return await apiRequest("PATCH", `/api/medication-administrations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medication-administrations"] });
      toast({ title: "Record updated successfully" });
      setSelectedAdmin(null);
      setAdminAction(null);
      setActionNote("");
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

  const getPatientName = (patientId: number) => {
    const patient = Array.isArray(patients) ? patients.find((p: any) => p.id === patientId) : null;
    return patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${patientId}`;
  };

  const handleAdminister = () => {
    if (!selectedAdmin) return;
    updateAdminMutation.mutate({
      id: selectedAdmin.id,
      data: {
        status: 'given',
        actualTime: new Date().toISOString(),
        doseGiven: selectedAdmin.dose,
        administeredBy: (user as any)?.id,
        notes: actionNote,
      }
    });
  };

  const handleHold = () => {
    if (!selectedAdmin) return;
    updateAdminMutation.mutate({
      id: selectedAdmin.id,
      data: {
        status: 'held',
        holdReason: actionNote,
      }
    });
  };

  const handleRefuse = () => {
    if (!selectedAdmin) return;
    updateAdminMutation.mutate({
      id: selectedAdmin.id,
      data: {
        status: 'refused',
        refusedReason: actionNote,
      }
    });
  };

  const groupedByPatient = Array.isArray(administrations)
    ? administrations.reduce((acc: any, admin: any) => {
        if (!acc[admin.patientId]) {
          acc[admin.patientId] = [];
        }
        acc[admin.patientId].push(admin);
        return acc;
      }, {})
    : {};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'given':
        return <Badge className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Given</Badge>;
      case 'held':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Held</Badge>;
      case 'refused':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Refused</Badge>;
      case 'scheduled':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Medication Administration Record</h1>
              <p className="text-sm text-gray-500">Track and document medication administration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label>Date:</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
                data-testid="input-date"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : Object.keys(groupedByPatient).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedByPatient).map(([patientId, admins]: [string, any]) => (
              <Card key={patientId} data-testid={`card-patient-mar-${patientId}`}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <CardTitle>{getPatientName(parseInt(patientId))}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Time</th>
                          <th className="text-left py-2 px-3">Medication</th>
                          <th className="text-left py-2 px-3">Dose</th>
                          <th className="text-left py-2 px-3">Route</th>
                          <th className="text-left py-2 px-3">Status</th>
                          <th className="text-left py-2 px-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin: any) => (
                          <tr key={admin.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-3">
                              {new Date(admin.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3 px-3 font-medium">{admin.medicationName || 'Medication'}</td>
                            <td className="py-3 px-3">{admin.dose || 'As prescribed'}</td>
                            <td className="py-3 px-3">{admin.route || 'N/A'}</td>
                            <td className="py-3 px-3">{getStatusBadge(admin.status)}</td>
                            <td className="py-3 px-3">
                              {admin.status === 'scheduled' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => { setSelectedAdmin(admin); setAdminAction('administer'); }}
                                    data-testid={`btn-give-${admin.id}`}
                                  >
                                    Give
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => { setSelectedAdmin(admin); setAdminAction('hold'); }}
                                    data-testid={`btn-hold-${admin.id}`}
                                  >
                                    Hold
                                  </Button>
                                </div>
                              )}
                              {admin.status !== 'scheduled' && (
                                <span className="text-sm text-gray-500">
                                  {admin.actualTime && `At ${new Date(admin.actualTime).toLocaleTimeString()}`}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No medications scheduled</h3>
              <p className="text-gray-500 mt-1">
                No medication administrations found for this date
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={!!adminAction} onOpenChange={() => { setAdminAction(null); setSelectedAdmin(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adminAction === 'administer' && 'Administer Medication'}
              {adminAction === 'hold' && 'Hold Medication'}
              {adminAction === 'refuse' && 'Document Refusal'}
            </DialogTitle>
            <DialogDescription>
              {selectedAdmin && `Patient: ${getPatientName(selectedAdmin.patientId)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAdmin && (
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Medication:</strong> {selectedAdmin.medicationName || 'Medication'}</p>
                <p><strong>Scheduled Time:</strong> {new Date(selectedAdmin.scheduledTime).toLocaleString()}</p>
                <p><strong>Dose:</strong> {selectedAdmin.dose || 'As prescribed'}</p>
              </div>
            )}
            <div>
              <Label>Notes</Label>
              <Textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={
                  adminAction === 'administer' ? 'Administration notes (optional)' :
                  adminAction === 'hold' ? 'Reason for holding (required)' :
                  'Reason for refusal (required)'
                }
                data-testid="input-notes"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setAdminAction(null); setSelectedAdmin(null); }}>
                Cancel
              </Button>
              {adminAction === 'administer' && (
                <Button 
                  onClick={handleAdminister}
                  disabled={updateAdminMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="btn-confirm-give"
                >
                  Confirm Administration
                </Button>
              )}
              {adminAction === 'hold' && (
                <Button 
                  onClick={handleHold}
                  disabled={updateAdminMutation.isPending || !actionNote.trim()}
                  variant="secondary"
                  data-testid="btn-confirm-hold"
                >
                  Confirm Hold
                </Button>
              )}
              {adminAction === 'refuse' && (
                <Button 
                  onClick={handleRefuse}
                  disabled={updateAdminMutation.isPending || !actionNote.trim()}
                  variant="destructive"
                  data-testid="btn-confirm-refuse"
                >
                  Document Refusal
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

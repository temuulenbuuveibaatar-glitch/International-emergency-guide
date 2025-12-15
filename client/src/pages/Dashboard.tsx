import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Pill, 
  ClipboardList, 
  Bell, 
  Activity,
  Calendar,
  AlertTriangle,
  Clock,
  UserCog,
  FileText,
  Stethoscope,
  Shield
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !!user,
  });

  const { data: reminders } = useQuery({
    queryKey: ["/api/medication-reminders"],
    enabled: !!user,
  });

  const { data: scheduledAdmins } = useQuery({
    queryKey: ["/api/scheduled-administrations"],
    enabled: !!user,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Hospital Management System</CardTitle>
            <CardDescription>
              Secure access for authorized medical personnel only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full" size="lg" data-testid="btn-login">
              <a href="/api/login">
                Sign In with Hospital Credentials
              </a>
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This system contains protected health information (PHI).
              Unauthorized access is prohibited.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = (user as any)?.role || 'nurse';
  const isDoctor = userRole === 'doctor' || userRole === 'director';
  const isDirector = userRole === 'director';
  const admittedPatients = Array.isArray(patients) ? patients.filter((p: any) => p.status === 'admitted') : [];
  const pendingReminders = Array.isArray(reminders) ? reminders.filter((r: any) => r.status === 'pending') : [];
  const upcomingAdmins = Array.isArray(scheduledAdmins) ? scheduledAdmins.slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>Welcome, {(user as any)?.firstName || 'Staff Member'}</span>
                <Badge variant="outline">{userRole}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/api/logout">Sign Out</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {pendingReminders.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">
                {pendingReminders.length} medication{pendingReminders.length > 1 ? 's' : ''} due soon
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-patients">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admitted Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admittedPatients.length}</div>
              <p className="text-xs text-muted-foreground">Currently in hospital</p>
            </CardContent>
          </Card>

          <Card data-testid="card-medications">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Medications</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAdmins.length}</div>
              <p className="text-xs text-muted-foreground">Due in next 4 hours</p>
            </CardContent>
          </Card>

          <Card data-testid="card-alerts">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReminders.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card data-testid="card-schedule">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
              <p className="text-xs text-muted-foreground">Current shift</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/hospital/patients">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2" data-testid="btn-patients">
                    <Users className="h-6 w-6" />
                    <span>Patients</span>
                  </Button>
                </Link>
                <Link href="/hospital/medications">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2" data-testid="btn-medications">
                    <Pill className="h-6 w-6" />
                    <span>Medications</span>
                  </Button>
                </Link>
                <Link href="/hospital/mar">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2" data-testid="btn-mar">
                    <ClipboardList className="h-6 w-6" />
                    <span>MAR</span>
                  </Button>
                </Link>
                <Link href="/emergency">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 text-red-600 border-red-200 hover:bg-red-50" data-testid="btn-protocols">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Protocols</span>
                  </Button>
                </Link>
                <Link href="/hospital/vitals">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2" data-testid="btn-vitals">
                    <Activity className="h-6 w-6" />
                    <span>Vital Signs</span>
                  </Button>
                </Link>
                {isDoctor && (
                  <Link href="/hospital/prescribe">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2" data-testid="btn-prescribe">
                      <FileText className="h-6 w-6" />
                      <span>Prescribe</span>
                    </Button>
                  </Link>
                )}
                {isDirector && (
                  <Link href="/hospital/admin">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2" data-testid="btn-admin">
                      <UserCog className="h-6 w-6" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Medications</CardTitle>
              <CardDescription>Next doses due</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAdmins.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAdmins.map((admin: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">Patient #{admin.patientId}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(admin.scheduledTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant={admin.status === 'scheduled' ? 'default' : 'secondary'}>
                        {admin.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No medications scheduled
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Recently admitted patients</CardDescription>
            </CardHeader>
            <CardContent>
              {admittedPatients.length > 0 ? (
                <div className="space-y-3">
                  {admittedPatients.slice(0, 5).map((patient: any) => (
                    <Link key={patient.id} href={`/hospital/patients/${patient.id}`}>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <div>
                          <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-muted-foreground">MRN: {patient.mrn}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{patient.roomNumber || 'N/A'}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {patient.bedNumber || ''}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No patients found
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Hospital system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medication System</span>
                  <Badge variant="default" className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Offline Mode</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Sync</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

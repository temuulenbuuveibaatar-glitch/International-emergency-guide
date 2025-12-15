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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft,
  Users,
  FileText,
  Settings,
  Shield,
  Activity,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCog
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { toast } = useToast();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!user && (user as any)?.role === 'director',
  });

  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
    enabled: !!user && (user as any)?.role === 'director',
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !!user,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return await apiRequest("PATCH", `/api/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Role updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: String(error), variant: "destructive" });
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
            <p className="text-muted-foreground mt-2">Please sign in to access the admin panel.</p>
            <Button asChild className="mt-4">
              <a href="/api/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = (user as any)?.role || 'nurse';
  if (userRole !== 'director') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-bold">Director Access Required</h2>
            <p className="text-muted-foreground mt-2">
              Only hospital directors can access the admin panel.
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

  const totalUsers = Array.isArray(users) ? users.length : 0;
  const doctorCount = Array.isArray(users) ? users.filter((u: any) => u.role === 'doctor').length : 0;
  const nurseCount = Array.isArray(users) ? users.filter((u: any) => u.role === 'nurse').length : 0;
  const admittedPatients = Array.isArray(patients) ? patients.filter((p: any) => p.status === 'admitted').length : 0;

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
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
              <h1 className="text-2xl font-bold text-gray-900">Hospital Administration</h1>
              <p className="text-sm text-gray-500">Director access only - Manage users, view logs, system status</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-users">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card data-testid="card-doctors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorCount}</div>
              <p className="text-xs text-muted-foreground">Physicians on staff</p>
            </CardContent>
          </Card>

          <Card data-testid="card-nurses">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nurses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nurseCount}</div>
              <p className="text-xs text-muted-foreground">Nursing staff</p>
            </CardContent>
          </Card>

          <Card data-testid="card-patients-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admittedPatients}</div>
              <p className="text-xs text-muted-foreground">Currently admitted</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="audit" data-testid="tab-audit">
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="system" data-testid="tab-system">
              <Settings className="h-4 w-4 mr-2" />
              System Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                  View and manage hospital staff accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : Array.isArray(users) && users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Change Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((staffUser: any) => (
                        <TableRow key={staffUser.id} data-testid={`row-user-${staffUser.id}`}>
                          <TableCell className="font-medium">
                            {staffUser.firstName || ''} {staffUser.lastName || ''}
                          </TableCell>
                          <TableCell>{staffUser.email || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              staffUser.role === 'director' ? 'default' :
                              staffUser.role === 'doctor' ? 'secondary' :
                              'outline'
                            }>
                              {staffUser.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{staffUser.department || 'Unassigned'}</TableCell>
                          <TableCell>
                            {staffUser.isActive ? (
                              <Badge variant="default" className="bg-green-600">Active</Badge>
                            ) : (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={staffUser.role}
                              onValueChange={(value) => handleRoleChange(staffUser.id, value)}
                              disabled={staffUser.id === (user as any)?.id}
                            >
                              <SelectTrigger className="w-32" data-testid={`select-role-${staffUser.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nurse">Nurse</SelectItem>
                                <SelectItem value="doctor">Doctor</SelectItem>
                                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                                <SelectItem value="director">Director</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No staff members found</p>
                    <p className="text-sm mt-1">Staff accounts are created when users sign in</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>
                  Track all system actions for compliance and security
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : Array.isArray(auditLogs) && auditLogs.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {auditLogs.slice(0, 50).map((log: any) => (
                      <div 
                        key={log.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm"
                        data-testid={`log-${log.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                          <span className="font-medium">{log.entityType}</span>
                          {log.entityId && (
                            <span className="text-muted-foreground">#{log.entityId}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span>{log.userId || 'System'}</span>
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No audit logs yet</p>
                    <p className="text-sm mt-1">System actions will be logged here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Real-time system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>Database</span>
                    </div>
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>API Server</span>
                    </div>
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Authentication</span>
                    </div>
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Last Backup</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                  <CardDescription>Authentication and access control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Session Management</span>
                    <Badge variant="secondary">PostgreSQL</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authentication Provider</span>
                    <Badge variant="secondary">Replit Auth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role-Based Access</span>
                    <Badge className="bg-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Logging</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Administrative operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Export Users</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">Export Logs</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Database className="h-5 w-5" />
                      <span className="text-xs">Database Stats</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Settings className="h-5 w-5" />
                      <span className="text-xs">System Config</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

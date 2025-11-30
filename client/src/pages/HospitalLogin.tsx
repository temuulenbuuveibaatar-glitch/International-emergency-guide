import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Hospital, 
  Stethoscope, 
  Users, 
  Pill,
  ClipboardList,
  Activity,
  Settings,
  LogIn,
  User,
  LogOut
} from "lucide-react";

export default function HospitalLogin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userRole = (user as any)?.role || 'nurse';
  const userName = (user as any)?.firstName || (user as any)?.username || 'Staff Member';

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Hospital className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Hospital Management System</h1>
            <p className="text-gray-600 mt-2">Welcome back, {userName}</p>
          </div>

          <Card className="mb-8" data-testid="card-user-info">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={
                        userRole === 'director' ? 'default' :
                        userRole === 'doctor' ? 'secondary' :
                        userRole === 'pharmacist' ? 'outline' :
                        'outline'
                      }>
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" asChild data-testid="btn-logout">
                  <a href="/api/logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/hospital">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" data-testid="link-dashboard">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Dashboard
                  </CardTitle>
                  <CardDescription>Overview of hospital operations</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/hospital/patients">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" data-testid="link-patients">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    Patients
                  </CardTitle>
                  <CardDescription>Manage patient records</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/hospital/medications">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" data-testid="link-medications">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Pill className="w-5 h-5 text-purple-600" />
                    Medications
                  </CardTitle>
                  <CardDescription>Drug database and information</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/hospital/mar">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" data-testid="link-mar">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="w-5 h-5 text-orange-600" />
                    MAR
                  </CardTitle>
                  <CardDescription>Medication Administration Record</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/hospital/vitals">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" data-testid="link-vitals">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-red-600" />
                    Vital Signs
                  </CardTitle>
                  <CardDescription>Monitor patient vitals</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {(userRole === 'doctor' || userRole === 'director') && (
              <Link href="/hospital/prescribe">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full border-blue-200 bg-blue-50" data-testid="link-prescribe">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      Prescribe
                    </CardTitle>
                    <CardDescription>Create medication orders</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )}

            {userRole === 'director' && (
              <Link href="/hospital/admin">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full border-amber-200 bg-amber-50" data-testid="link-admin">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Settings className="w-5 h-5 text-amber-600" />
                      Admin Panel
                    </CardTitle>
                    <CardDescription>System administration</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline">Return to Emergency Guide</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md" data-testid="card-login">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Hospital className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Hospital Management System</CardTitle>
          <CardDescription>
            Sign in to access the hospital system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Secure Healthcare Access</p>
                <p className="text-blue-700 mt-1">
                  This system is protected and complies with healthcare data privacy requirements.
                  Only authorized personnel may access patient information.
                </p>
              </div>
            </div>
          </div>

          <Button asChild className="w-full h-12 text-lg" data-testid="btn-signin">
            <a href="/api/login">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Hospital System
            </a>
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New staff members will be assigned a role by the hospital director after first sign-in.
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you acknowledge that all access to patient data
              is logged and monitored for security and compliance purposes.
            </p>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="link">Return to Emergency Guide</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

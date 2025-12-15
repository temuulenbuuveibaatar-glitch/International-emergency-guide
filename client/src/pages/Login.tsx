import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Hospital, 
  Stethoscope, 
  User,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [showPatientPassword, setShowPatientPassword] = useState(false);

  const staffLoginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login/staff", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: t('auth.login') as string,
        description: `Welcome back, ${data.user.firstName || 'Staff Member'}!`,
      });
      setLocation("/hospital");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const patientLoginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login/patient", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: t('auth.login') as string,
        description: `Welcome back, ${data.user.firstName || 'Patient'}!`,
      });
      setLocation("/patient");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail || !staffPassword) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }
    staffLoginMutation.mutate({ email: staffEmail, password: staffPassword });
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientEmail || !patientPassword) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }
    patientLoginMutation.mutate({ email: patientEmail, password: patientPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Hospital className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('hospitalPortal.title') as string}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sign in to access your account
          </p>
        </div>

        <Card className="shadow-xl" data-testid="card-login">
          <CardHeader>
            <CardTitle className="text-center">{t('auth.login') as string}</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="staff" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="staff" className="flex items-center gap-2" data-testid="tab-staff-login">
                  <Stethoscope className="w-4 h-4" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="patient" className="flex items-center gap-2" data-testid="tab-patient-login">
                  <User className="w-4 h-4" />
                  Patient
                </TabsTrigger>
              </TabsList>

              <TabsContent value="staff">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        For doctors, nurses, and hospital staff
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-email">{t('auth.email') as string}</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      data-testid="input-staff-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-password">{t('auth.password') as string}</Label>
                    <div className="relative">
                      <Input
                        id="staff-password"
                        type={showStaffPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        data-testid="input-staff-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                      >
                        {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={staffLoginMutation.isPending}
                    data-testid="btn-staff-login"
                  >
                    {staffLoginMutation.isPending ? (
                      "Signing in..."
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In as Staff
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="patient">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-green-700 dark:text-green-300">
                        For patients accessing their health portal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-email">{t('auth.email') as string}</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="patient@email.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      data-testid="input-patient-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-password">{t('auth.password') as string}</Label>
                    <div className="relative">
                      <Input
                        id="patient-password"
                        type={showPatientPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={patientPassword}
                        onChange={(e) => setPatientPassword(e.target.value)}
                        data-testid="input-patient-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPatientPassword(!showPatientPassword)}
                      >
                        {showPatientPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={patientLoginMutation.isPending}
                    data-testid="btn-patient-login"
                  >
                    {patientLoginMutation.isPending ? (
                      "Signing in..."
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In as Patient
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
              
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  {t('compliance.hipaaText') as string}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

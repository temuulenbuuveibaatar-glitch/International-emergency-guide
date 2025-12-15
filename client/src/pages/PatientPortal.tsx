import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Hospital,
  User,
  Pill,
  Calendar,
  FileText,
  Activity,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Shield,
  Phone,
  Mail,
  LogIn,
  UserPlus,
  Stethoscope,
  ClipboardList
} from "lucide-react";

export default function PatientPortal() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');

  const mockPatientData = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    dateOfBirth: '1985-03-15',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    emergencyContact: 'Jane Doe (Wife) - +1 555-123-4567'
  };

  const mockMedications = [
    {
      id: 1,
      name: 'Lisinopril',
      dose: '10mg',
      frequency: 'Once daily',
      time: '8:00 AM',
      purpose: 'Blood pressure control',
      refillDate: '2025-01-15',
      pillsRemaining: 12
    },
    {
      id: 2,
      name: 'Metformin',
      dose: '500mg',
      frequency: 'Twice daily',
      time: '8:00 AM, 8:00 PM',
      purpose: 'Blood sugar control',
      refillDate: '2025-01-20',
      pillsRemaining: 24
    },
    {
      id: 3,
      name: 'Atorvastatin',
      dose: '20mg',
      frequency: 'Once daily',
      time: '9:00 PM',
      purpose: 'Cholesterol management',
      refillDate: '2025-02-01',
      pillsRemaining: 45
    }
  ];

  const mockAppointments = [
    {
      id: 1,
      date: '2025-01-10',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      type: 'Follow-up',
      location: 'Main Clinic, Room 204'
    },
    {
      id: 2,
      date: '2025-01-25',
      time: '2:30 PM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      type: 'Annual checkup',
      location: 'Cardiology Wing, Room 301'
    }
  ];

  const mockLabResults = [
    {
      id: 1,
      date: '2024-12-15',
      type: 'Complete Blood Count',
      status: 'Normal',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      date: '2024-12-15',
      type: 'Lipid Panel',
      status: 'Review needed',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: 3,
      date: '2024-11-20',
      type: 'HbA1c',
      status: 'Normal',
      doctor: 'Dr. Sarah Johnson'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl" data-testid="card-patient-login">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Hospital className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{t('patientPortal.title') || 'Patient Portal'}</CardTitle>
            <CardDescription>
              {t('patientPortal.loginDescription') || 'Access your health records, medications, and appointments'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('form.email') || 'Email Address'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    data-testid="input-email"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">{t('form.password') || 'Password'}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" size="lg" data-testid="btn-login">
                <LogIn className="w-5 h-5 mr-2" />
                {t('common.signIn') || 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('patientPortal.noAccount') || "Don't have an account?"}
              </p>
              <Link href="/signup">
                <Button variant="outline" className="w-full" data-testid="btn-signup">
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t('common.createAccount') || 'Create Account'}
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">{t('patientPortal.secureAccess') || 'Secure & HIPAA Compliant'}</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t('patientPortal.securityMessage') || 'Your health information is protected with enterprise-grade encryption'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Hospital className="w-8 h-8 text-blue-600" />
              {t('patientPortal.title') || 'Patient Portal'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('patientPortal.welcome') || 'Welcome back'}, {mockPatientData.firstName}
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)} data-testid="btn-logout">
            {t('common.signOut') || 'Sign Out'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              <Activity className="w-4 h-4 mr-2" />
              {t('patientPortal.dashboard') || 'Dashboard'}
            </TabsTrigger>
            <TabsTrigger value="medications" data-testid="tab-medications">
              <Pill className="w-4 h-4 mr-2" />
              {t('patientPortal.medications') || 'Medications'}
            </TabsTrigger>
            <TabsTrigger value="appointments" data-testid="tab-appointments">
              <Calendar className="w-4 h-4 mr-2" />
              {t('patientPortal.appointments') || 'Appointments'}
            </TabsTrigger>
            <TabsTrigger value="records" data-testid="tab-records">
              <FileText className="w-4 h-4 mr-2" />
              {t('patientPortal.records') || 'Records'}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="w-4 h-4 mr-2" />
              {t('patientPortal.profile') || 'Profile'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="md:col-span-2 lg:col-span-3" data-testid="card-notifications">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    {t('patientPortal.notifications') || 'Notifications & Reminders'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Pill className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                          {t('patientPortal.refillReminder') || 'Medication Refill Needed'}
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Lisinopril - 12 pills remaining. Request refill by Jan 10.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          {t('patientPortal.upcomingAppointment') || 'Upcoming Appointment'}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Dr. Sarah Johnson - Jan 10, 2025 at 10:00 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          {t('patientPortal.newResults') || 'New Lab Results Available'}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your Lipid Panel results are ready for review.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-quick-medications">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-600" />
                    {t('patientPortal.todayMeds') || "Today's Medications"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockMedications.map(med => (
                      <div key={med.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{med.name} {med.dose}</p>
                          <p className="text-sm text-gray-500">{med.time}</p>
                        </div>
                        <Button size="sm" variant="outline" data-testid={`btn-taken-${med.id}`}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Taken
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-quick-appointments">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {t('patientPortal.nextAppointment') || 'Next Appointment'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="font-semibold">{mockAppointments[0].doctor}</p>
                    <p className="text-sm text-gray-500">{mockAppointments[0].specialty}</p>
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        {new Date(mockAppointments[0].date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">{mockAppointments[0].time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-health-summary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    {t('patientPortal.healthSummary') || 'Health Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('patientPortal.bloodType') || 'Blood Type'}</span>
                      <Badge variant="outline">{mockPatientData.bloodType}</Badge>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">{t('patientPortal.allergies') || 'Allergies'}</p>
                      <div className="flex flex-wrap gap-1">
                        {mockPatientData.allergies.map(allergy => (
                          <Badge key={allergy} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('patientPortal.activeMeds') || 'Active Medications'}</span>
                      <Badge>{mockMedications.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medications">
            <Card data-testid="card-medications-list">
              <CardHeader>
                <CardTitle>{t('patientPortal.currentMedications') || 'Current Medications'}</CardTitle>
                <CardDescription>
                  {t('patientPortal.medicationsDescription') || 'Your active prescriptions and medication schedule'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMedications.map(med => (
                    <Card key={med.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{med.name}</h3>
                            <p className="text-gray-600">{med.dose} - {med.frequency}</p>
                            <p className="text-sm text-gray-500 mt-1">{med.purpose}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{med.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500">{t('patientPortal.pillsRemaining') || 'Pills Remaining'}</p>
                            <p className="font-semibold">{med.pillsRemaining}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('patientPortal.nextRefill') || 'Next Refill'}</p>
                            <p className="font-semibold">{new Date(med.refillDate).toLocaleDateString()}</p>
                          </div>
                          <Button size="sm" data-testid={`btn-refill-${med.id}`}>
                            {t('patientPortal.requestRefill') || 'Request Refill'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-upcoming-appointments">
                <CardHeader>
                  <CardTitle>{t('patientPortal.upcomingAppointments') || 'Upcoming Appointments'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAppointments.map(apt => (
                      <Card key={apt.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{apt.doctor}</h4>
                              <p className="text-sm text-gray-500">{apt.specialty}</p>
                              <Badge variant="outline" className="mt-1">{apt.type}</Badge>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500">{t('patientPortal.dateTime') || 'Date & Time'}</p>
                              <p className="font-medium">
                                {new Date(apt.date).toLocaleDateString()} at {apt.time}
                              </p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500">{t('patientPortal.location') || 'Location'}</p>
                              <p className="font-medium">{apt.location}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-book-appointment">
                <CardHeader>
                  <CardTitle>{t('patientPortal.bookAppointment') || 'Book New Appointment'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">
                      {t('patientPortal.bookDescription') || 'Schedule a new appointment with your healthcare provider'}
                    </p>
                    <Button data-testid="btn-book-appointment">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('patientPortal.scheduleNow') || 'Schedule Appointment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records">
            <Card data-testid="card-lab-results">
              <CardHeader>
                <CardTitle>{t('patientPortal.labResults') || 'Lab Results'}</CardTitle>
                <CardDescription>
                  {t('patientPortal.labResultsDescription') || 'Your recent laboratory test results'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLabResults.map(result => (
                    <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{result.type}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(result.date).toLocaleDateString()} - {result.doctor}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={result.status === 'Normal' ? 'default' : 'secondary'}>
                          {result.status === 'Normal' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Normal</>
                          ) : (
                            <><AlertTriangle className="w-3 h-3 mr-1" /> {result.status}</>
                          )}
                        </Badge>
                        <Button variant="outline" size="sm" data-testid={`btn-view-result-${result.id}`}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-personal-info">
                <CardHeader>
                  <CardTitle>{t('patientPortal.personalInfo') || 'Personal Information'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {mockPatientData.firstName} {mockPatientData.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{mockPatientData.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">{t('form.dateOfBirth') || 'Date of Birth'}</Label>
                        <p className="font-medium">
                          {new Date(mockPatientData.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500">{t('patientPortal.bloodType') || 'Blood Type'}</Label>
                        <p className="font-medium">{mockPatientData.bloodType}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-500">{t('form.emergencyContact') || 'Emergency Contact'}</Label>
                      <p className="font-medium">{mockPatientData.emergencyContact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-health-info">
                <CardHeader>
                  <CardTitle>{t('patientPortal.healthInfo') || 'Health Information'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">{t('patientPortal.allergies') || 'Known Allergies'}</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mockPatientData.allergies.map(allergy => (
                          <Badge key={allergy} variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full" data-testid="btn-update-info">
                        {t('patientPortal.updateInfo') || 'Update Health Information'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              {t('common.backToHome') || 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

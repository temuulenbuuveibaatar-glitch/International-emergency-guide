import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Hospital, 
  Stethoscope, 
  User, 
  Shield, 
  FileCheck,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Award,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Lock,
  UserPlus
} from "lucide-react";

type UserType = 'patient' | 'doctor';

interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  licenseIssuingAuthority: string;
  licenseExpiryDate: string;
  specialty: string;
  hospitalAffiliation: string;
  medicalSchool: string;
  graduationYear: string;
  yearsOfExperience: string;
  agreeToTerms: boolean;
  agreeToHIPAA: boolean;
}

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export default function SignUp() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<UserType>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [doctorData, setDoctorData] = useState<DoctorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    licenseIssuingAuthority: '',
    licenseExpiryDate: '',
    specialty: '',
    hospitalAffiliation: '',
    medicalSchool: '',
    graduationYear: '',
    yearsOfExperience: '',
    agreeToTerms: false,
    agreeToHIPAA: false
  });

  const [patientData, setPatientData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const specialties = [
    'General Practice',
    'Internal Medicine',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Surgery',
    'Orthopedics',
    'Psychiatry',
    'Dermatology',
    'Emergency Medicine',
    'Radiology',
    'Anesthesiology',
    'Pathology',
    'Ophthalmology',
    'Obstetrics & Gynecology',
    'Urology',
    'Nephrology',
    'Gastroenterology',
    'Pulmonology',
    'Endocrinology',
    'Rheumatology',
    'Infectious Disease',
    'Geriatrics',
    'Nursing'
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (doctorData.password !== doctorData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!doctorData.agreeToTerms || !doctorData.agreeToHIPAA) {
      toast({
        title: "Error",
        description: "You must agree to all terms and HIPAA compliance",
        variant: "destructive"
      });
      return;
    }

    if (!doctorData.licenseNumber) {
      toast({
        title: "License Required",
        description: "A valid medical license number is required for doctor registration",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...doctorData,
          role: 'doctor'
        })
      });

      if (response.ok) {
        toast({
          title: "Registration Submitted",
          description: "Your application is pending review. You will receive an email once your license is verified.",
        });
        setLocation('/hospital/login');
      } else {
        const error = await response.json();
        toast({
          title: "Registration Failed",
          description: error.message || "Please check your information and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to submit registration. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (patientData.password !== patientData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!patientData.agreeToTerms || !patientData.agreeToPrivacy) {
      toast({
        title: "Error",
        description: "You must agree to all terms and privacy policy",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...patientData,
          role: 'patient'
        })
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your patient portal account has been created. Please check your email to verify your account.",
        });
        setLocation('/patient/login');
      } else {
        const error = await response.json();
        toast({
          title: "Registration Failed",
          description: error.message || "Please check your information and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to submit registration. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2" data-testid="btn-back-home">
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Hospital className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('signup.title') || 'Create Your Account'}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('signup.subtitle') || 'Join our healthcare platform'}</p>
        </div>

        <Card className="mb-8 border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">{t('signup.fdaCompliance') || 'FDA Licensed & HIPAA Compliant'}</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {t('signup.fdaMessage') || 'Our medication database follows FDA guidelines and all patient data is protected under HIPAA regulations. All medical information is verified by licensed healthcare professionals.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="border-green-600 text-green-700 dark:border-green-400 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    FDA Guidelines
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-700 dark:border-green-400 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    HIPAA Compliant
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-700 dark:border-green-400 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    256-bit Encryption
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl" data-testid="card-signup">
          <CardHeader>
            <CardTitle className="text-2xl">{t('signup.selectAccountType') || 'Select Account Type'}</CardTitle>
            <CardDescription>
              {t('signup.selectTypeDescription') || 'Choose the type of account you want to create'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(v) => { setUserType(v as UserType); setStep(1); }}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="patient" className="flex items-center gap-2" data-testid="tab-patient">
                  <User className="w-4 h-4" />
                  {t('signup.patientAccount') || 'Patient'}
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2" data-testid="tab-doctor">
                  <Stethoscope className="w-4 h-4" />
                  {t('signup.doctorAccount') || 'Healthcare Professional'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientSubmit} className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {t('signup.patientPortal') || 'Patient Portal Access'}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {t('signup.patientPortalDescription') || 'Access your medical records, schedule appointments, track medications, and communicate with your healthcare providers.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient-firstName">{t('form.firstName') || 'First Name'} *</Label>
                      <Input
                        id="patient-firstName"
                        value={patientData.firstName}
                        onChange={(e) => setPatientData({...patientData, firstName: e.target.value})}
                        required
                        data-testid="input-patient-firstname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patient-lastName">{t('form.lastName') || 'Last Name'} *</Label>
                      <Input
                        id="patient-lastName"
                        value={patientData.lastName}
                        onChange={(e) => setPatientData({...patientData, lastName: e.target.value})}
                        required
                        data-testid="input-patient-lastname"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient-email">{t('form.email') || 'Email Address'} *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="patient-email"
                          type="email"
                          className="pl-10"
                          value={patientData.email}
                          onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                          required
                          data-testid="input-patient-email"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="patient-phone">{t('form.phone') || 'Phone Number'} *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="patient-phone"
                          type="tel"
                          className="pl-10"
                          value={patientData.phone}
                          onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                          required
                          data-testid="input-patient-phone"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="patient-dob">{t('form.dateOfBirth') || 'Date of Birth'} *</Label>
                      <Input
                        id="patient-dob"
                        type="date"
                        value={patientData.dateOfBirth}
                        onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
                        required
                        data-testid="input-patient-dob"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patient-gender">{t('form.gender') || 'Gender'} *</Label>
                      <Select value={patientData.gender} onValueChange={(v) => setPatientData({...patientData, gender: v})}>
                        <SelectTrigger data-testid="select-patient-gender">
                          <SelectValue placeholder={t('form.selectGender') || 'Select gender'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t('form.male') || 'Male'}</SelectItem>
                          <SelectItem value="female">{t('form.female') || 'Female'}</SelectItem>
                          <SelectItem value="other">{t('form.other') || 'Other'}</SelectItem>
                          <SelectItem value="prefer-not-to-say">{t('form.preferNotToSay') || 'Prefer not to say'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="patient-blood">{t('form.bloodType') || 'Blood Type'}</Label>
                      <Select value={patientData.bloodType} onValueChange={(v) => setPatientData({...patientData, bloodType: v})}>
                        <SelectTrigger data-testid="select-patient-blood">
                          <SelectValue placeholder={t('form.selectBloodType') || 'Select blood type'} />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">{t('form.emergencyContact') || 'Emergency Contact'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency-name">{t('form.contactName') || 'Contact Name'}</Label>
                        <Input
                          id="emergency-name"
                          value={patientData.emergencyContactName}
                          onChange={(e) => setPatientData({...patientData, emergencyContactName: e.target.value})}
                          data-testid="input-emergency-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency-phone">{t('form.contactPhone') || 'Contact Phone'}</Label>
                        <Input
                          id="emergency-phone"
                          type="tel"
                          value={patientData.emergencyContactPhone}
                          onChange={(e) => setPatientData({...patientData, emergencyContactPhone: e.target.value})}
                          data-testid="input-emergency-phone"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">{t('form.createPassword') || 'Create Password'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patient-password">{t('form.password') || 'Password'} *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="patient-password"
                            type="password"
                            className="pl-10"
                            value={patientData.password}
                            onChange={(e) => setPatientData({...patientData, password: e.target.value})}
                            required
                            minLength={8}
                            data-testid="input-patient-password"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="patient-confirm-password">{t('form.confirmPassword') || 'Confirm Password'} *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="patient-confirm-password"
                            type="password"
                            className="pl-10"
                            value={patientData.confirmPassword}
                            onChange={(e) => setPatientData({...patientData, confirmPassword: e.target.value})}
                            required
                            data-testid="input-patient-confirm-password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="patient-terms"
                        checked={patientData.agreeToTerms}
                        onCheckedChange={(c) => setPatientData({...patientData, agreeToTerms: c as boolean})}
                        data-testid="checkbox-patient-terms"
                      />
                      <Label htmlFor="patient-terms" className="text-sm leading-relaxed">
                        {t('signup.agreeToTerms') || 'I agree to the Terms of Service and understand that my health information will be stored securely.'}
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="patient-privacy"
                        checked={patientData.agreeToPrivacy}
                        onCheckedChange={(c) => setPatientData({...patientData, agreeToPrivacy: c as boolean})}
                        data-testid="checkbox-patient-privacy"
                      />
                      <Label htmlFor="patient-privacy" className="text-sm leading-relaxed">
                        {t('signup.agreeToPrivacy') || 'I have read and agree to the Privacy Policy and HIPAA Notice of Privacy Practices.'}
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading} data-testid="btn-patient-submit">
                    <UserPlus className="w-5 h-5 mr-2" />
                    {isLoading ? (t('common.loading') || 'Creating Account...') : (t('signup.createPatientAccount') || 'Create Patient Account')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorSubmit} className="space-y-6">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {t('signup.licenseRequired') || 'Medical License Required'}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      {t('signup.licenseRequiredDescription') || 'Healthcare professional accounts require verification of your medical license issued by your government or accredited medical institution. Your account will be reviewed before activation.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor-firstName">{t('form.firstName') || 'First Name'} *</Label>
                      <Input
                        id="doctor-firstName"
                        value={doctorData.firstName}
                        onChange={(e) => setDoctorData({...doctorData, firstName: e.target.value})}
                        required
                        data-testid="input-doctor-firstname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="doctor-lastName">{t('form.lastName') || 'Last Name'} *</Label>
                      <Input
                        id="doctor-lastName"
                        value={doctorData.lastName}
                        onChange={(e) => setDoctorData({...doctorData, lastName: e.target.value})}
                        required
                        data-testid="input-doctor-lastname"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor-email">{t('form.email') || 'Professional Email'} *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="doctor-email"
                          type="email"
                          className="pl-10"
                          value={doctorData.email}
                          onChange={(e) => setDoctorData({...doctorData, email: e.target.value})}
                          required
                          data-testid="input-doctor-email"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="doctor-phone">{t('form.phone') || 'Phone Number'} *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="doctor-phone"
                          type="tel"
                          className="pl-10"
                          value={doctorData.phone}
                          onChange={(e) => setDoctorData({...doctorData, phone: e.target.value})}
                          required
                          data-testid="input-doctor-phone"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      {t('signup.medicalLicense') || 'Medical License Information'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="license-number">{t('form.licenseNumber') || 'Medical License Number'} *</Label>
                        <div className="relative">
                          <FileCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="license-number"
                            className="pl-10"
                            placeholder="e.g., MD-12345678"
                            value={doctorData.licenseNumber}
                            onChange={(e) => setDoctorData({...doctorData, licenseNumber: e.target.value})}
                            required
                            data-testid="input-license-number"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="license-authority">{t('form.issuingAuthority') || 'Issuing Authority'} *</Label>
                        <Input
                          id="license-authority"
                          placeholder="e.g., State Medical Board"
                          value={doctorData.licenseIssuingAuthority}
                          onChange={(e) => setDoctorData({...doctorData, licenseIssuingAuthority: e.target.value})}
                          required
                          data-testid="input-license-authority"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="license-expiry">{t('form.licenseExpiry') || 'License Expiry Date'} *</Label>
                        <Input
                          id="license-expiry"
                          type="date"
                          value={doctorData.licenseExpiryDate}
                          onChange={(e) => setDoctorData({...doctorData, licenseExpiryDate: e.target.value})}
                          required
                          data-testid="input-license-expiry"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialty">{t('form.specialty') || 'Medical Specialty'} *</Label>
                        <Select value={doctorData.specialty} onValueChange={(v) => setDoctorData({...doctorData, specialty: v})}>
                          <SelectTrigger data-testid="select-specialty">
                            <SelectValue placeholder={t('form.selectSpecialty') || 'Select specialty'} />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map(spec => (
                              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      {t('signup.education') || 'Education & Experience'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="medical-school">{t('form.medicalSchool') || 'Medical School'}</Label>
                        <Input
                          id="medical-school"
                          value={doctorData.medicalSchool}
                          onChange={(e) => setDoctorData({...doctorData, medicalSchool: e.target.value})}
                          data-testid="input-medical-school"
                        />
                      </div>
                      <div>
                        <Label htmlFor="graduation-year">{t('form.graduationYear') || 'Graduation Year'}</Label>
                        <Input
                          id="graduation-year"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear()}
                          value={doctorData.graduationYear}
                          onChange={(e) => setDoctorData({...doctorData, graduationYear: e.target.value})}
                          data-testid="input-graduation-year"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="hospital-affiliation">{t('form.hospitalAffiliation') || 'Hospital Affiliation'}</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="hospital-affiliation"
                            className="pl-10"
                            value={doctorData.hospitalAffiliation}
                            onChange={(e) => setDoctorData({...doctorData, hospitalAffiliation: e.target.value})}
                            data-testid="input-hospital-affiliation"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="years-experience">{t('form.yearsOfExperience') || 'Years of Experience'}</Label>
                        <Input
                          id="years-experience"
                          type="number"
                          min="0"
                          max="60"
                          value={doctorData.yearsOfExperience}
                          onChange={(e) => setDoctorData({...doctorData, yearsOfExperience: e.target.value})}
                          data-testid="input-years-experience"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">{t('form.createPassword') || 'Create Password'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="doctor-password">{t('form.password') || 'Password'} *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="doctor-password"
                            type="password"
                            className="pl-10"
                            value={doctorData.password}
                            onChange={(e) => setDoctorData({...doctorData, password: e.target.value})}
                            required
                            minLength={8}
                            data-testid="input-doctor-password"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="doctor-confirm-password">{t('form.confirmPassword') || 'Confirm Password'} *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="doctor-confirm-password"
                            type="password"
                            className="pl-10"
                            value={doctorData.confirmPassword}
                            onChange={(e) => setDoctorData({...doctorData, confirmPassword: e.target.value})}
                            required
                            data-testid="input-doctor-confirm-password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="doctor-terms"
                        checked={doctorData.agreeToTerms}
                        onCheckedChange={(c) => setDoctorData({...doctorData, agreeToTerms: c as boolean})}
                        data-testid="checkbox-doctor-terms"
                      />
                      <Label htmlFor="doctor-terms" className="text-sm leading-relaxed">
                        {t('signup.agreeToTermsDoctor') || 'I agree to the Terms of Service and confirm that the license information provided is accurate and valid.'}
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="doctor-hipaa"
                        checked={doctorData.agreeToHIPAA}
                        onCheckedChange={(c) => setDoctorData({...doctorData, agreeToHIPAA: c as boolean})}
                        data-testid="checkbox-doctor-hipaa"
                      />
                      <Label htmlFor="doctor-hipaa" className="text-sm leading-relaxed">
                        {t('signup.agreeToHIPAA') || 'I agree to comply with HIPAA regulations and maintain patient confidentiality at all times.'}
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading} data-testid="btn-doctor-submit">
                    <UserPlus className="w-5 h-5 mr-2" />
                    {isLoading ? (t('common.loading') || 'Submitting Application...') : (t('signup.submitApplication') || 'Submit Application for Review')}
                  </Button>

                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {t('signup.reviewNotice') || 'Your application will be reviewed within 24-48 hours. You will receive an email notification once your license is verified.'}
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {t('signup.alreadyHaveAccount') || 'Already have an account?'}{' '}
                <Link href="/hospital/login" className="text-blue-600 hover:underline font-medium" data-testid="link-login">
                  {t('signup.signIn') || 'Sign In'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

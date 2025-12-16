import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupStandaloneAuth, isAuthenticated, requireRole } from "./standaloneAuth";
import { 
  analyzeMockDamage, 
  analyzeMockXray, 
  analyzeMockMRI, 
  analyzeMockMedical,
  mockMedicalChat
} from "./mock-analysis";
import {
  insertPatientSchema,
  insertPrescriptionSchema,
  insertMedicationAdministrationSchema,
  insertVitalSignsSchema,
  insertLabResultSchema,
} from "@shared/schema";
import { calculateDose, checkDrugInteractions, getDrugSafetyInfo } from "./medicationLogic";
import { 
  medicationsDatabase, 
  getMedicationsByCategory, 
  searchMedications, 
  getMedicationByName,
  getControlledSubstances,
  getMedicationsWithBlackBoxWarning,
  getMedicationsByRegulatoryAgency,
  getMedicationsGroupedByAgency,
  getMedicationApprovalStatus,
  getMedicationCountByAgency
} from "./data/medications";
import { 
  treatmentProtocols, 
  getProtocolById, 
  getProtocolsByCategory, 
  searchProtocols,
  getProtocolsByICD 
} from "./data/treatmentProtocols";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup standalone authentication (username/password based)
  await setupStandaloneAuth(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ============ REGISTRATION ROUTES ============
  
  // Doctor registration with license verification
  app.post("/api/auth/register/doctor", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        licenseNumber,
        licenseIssuingAuthority,
        licenseExpiryDate,
        specialty,
        hospitalAffiliation,
        medicalSchool,
        graduationYear,
        yearsOfExperience,
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !licenseNumber) {
        return res.status(400).json({ 
          message: "Missing required fields: email, password, firstName, lastName, and licenseNumber are required" 
        });
      }

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Validate license number format (basic validation)
      if (!/^[A-Z]{2,3}-?\d{4,12}$/i.test(licenseNumber.replace(/\s/g, ''))) {
        return res.status(400).json({ 
          message: "Invalid license number format. Expected format: XX-12345678 or similar" 
        });
      }

      // Hash password securely with bcrypt before storing
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the doctor account with pending status
      const doctorId = `doctor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newDoctor = await storage.upsertUser({
        id: doctorId,
        email,
        firstName,
        lastName,
        role: 'doctor',
        licenseNumber,
        department: specialty,
        isActive: false, // Pending verification
        mfaEnabled: false,
        passwordHash: hashedPassword, // Securely hashed password
      });

      // Log the registration for admin review (password hash NOT logged for security)
      await storage.createAuditLog({
        userId: doctorId,
        action: 'doctor_registration',
        entityType: 'auth_user',
        entityId: doctorId,
        details: {
          email,
          licenseNumber,
          licenseIssuingAuthority,
          licenseExpiryDate,
          specialty,
          hospitalAffiliation,
          medicalSchool,
          graduationYear,
          yearsOfExperience,
          status: 'pending_verification',
          registeredAt: new Date().toISOString()
        }
      });

      res.status(201).json({
        message: "Registration submitted successfully. Your license will be verified within 24-48 hours.",
        userId: doctorId,
        status: 'pending_verification'
      });
    } catch (error) {
      console.error("Error registering doctor:", error);
      res.status(500).json({ message: "Failed to register. Please try again later." });
    }
  });

  // Patient portal registration
  app.post("/api/auth/register/patient", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        dateOfBirth,
        gender,
        bloodType,
        emergencyContactName,
        emergencyContactPhone,
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !dateOfBirth) {
        return res.status(400).json({ 
          message: "Missing required fields: email, password, firstName, lastName, and dateOfBirth are required" 
        });
      }

      // Generate MRN for patient
      const mrn = `P${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Create patient record
      const patient = await storage.createPatient({
        mrn,
        firstName,
        lastName,
        dateOfBirth,
        gender: gender || 'unknown',
        bloodType,
        phone,
        emergencyContactName,
        emergencyContactPhone,
        status: 'outpatient'
      });

      // Hash password securely with bcrypt
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create patient portal account with hashed password
      const portalAccount = await storage.createPatientPortalAccount({
        patientId: patient.id,
        email,
        passwordHash: hashedPassword,
        isVerified: false,
        verificationToken: `verify_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
      });

      // Log the registration
      await storage.createAuditLog({
        action: 'patient_registration',
        entityType: 'patient_portal_account',
        entityId: portalAccount.id.toString(),
        details: {
          patientId: patient.id,
          mrn,
          email,
          registeredAt: new Date().toISOString()
        }
      });

      res.status(201).json({
        message: "Account created successfully. Please check your email to verify your account.",
        patientId: patient.id,
        mrn
      });
    } catch (error) {
      console.error("Error registering patient:", error);
      res.status(500).json({ message: "Failed to register. Please try again later." });
    }
  });

  // ============ LOGIN ROUTES ============
  
  // Doctor login with bcrypt verification
  app.post("/api/auth/login/doctor", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find the doctor by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if user is a doctor
      if (user.role !== 'doctor' && user.role !== 'admin' && user.role !== 'director') {
        return res.status(401).json({ message: "Invalid account type for doctor login" });
      }

      // Check if account is active (verified)
      if (!user.isActive) {
        return res.status(403).json({ 
          message: "Your account is pending verification. Please wait for license approval." 
        });
      }

      // Verify password with bcrypt
      if (!user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Update last login
      await storage.upsertUser({
        ...user,
        lastLoginAt: new Date(),
      });

      // Log the login
      await storage.createAuditLog({
        userId: user.id,
        action: 'doctor_login',
        entityType: 'auth_user',
        entityId: user.id,
        details: {
          email,
          loginAt: new Date().toISOString(),
          mfaRequired: user.mfaEnabled,
        }
      });

      // If MFA is enabled, require MFA verification
      if (user.mfaEnabled) {
        return res.json({
          requireMfa: true,
          userId: user.id,
          message: "MFA verification required"
        });
      }

      // Return user data (excluding sensitive fields)
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          licenseNumber: user.licenseNumber,
          mfaEnabled: user.mfaEnabled,
        }
      });
    } catch (error) {
      console.error("Error during doctor login:", error);
      res.status(500).json({ message: "Login failed. Please try again later." });
    }
  });

  // Patient portal login with bcrypt verification
  app.post("/api/auth/login/patient", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find the patient portal account by email
      const portalAccount = await storage.getPatientPortalAccountByEmail(email);
      
      if (!portalAccount) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if account is verified
      if (!portalAccount.isVerified) {
        return res.status(403).json({ 
          message: "Please verify your email before logging in." 
        });
      }

      // Verify password with bcrypt
      if (!portalAccount.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, portalAccount.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Get the patient record
      const patient = await storage.getPatient(portalAccount.patientId);

      if (!patient) {
        return res.status(500).json({ message: "Patient record not found" });
      }

      // Update last login
      await storage.updatePatientPortalAccount(portalAccount.id, {
        lastLoginAt: new Date(),
      });

      // Log the login
      await storage.createAuditLog({
        userId: portalAccount.id.toString(),
        action: 'patient_login',
        entityType: 'patient_portal_account',
        entityId: portalAccount.id.toString(),
        details: {
          email,
          patientId: patient.id,
          mrn: patient.mrn,
          loginAt: new Date().toISOString(),
        }
      });

      // Return patient data
      res.json({
        success: true,
        patient: {
          id: patient.id,
          mrn: patient.mrn,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: portalAccount.email,
          dateOfBirth: patient.dateOfBirth,
          status: patient.status,
        }
      });
    } catch (error) {
      console.error("Error during patient login:", error);
      res.status(500).json({ message: "Login failed. Please try again later." });
    }
  });

  // ============ PATIENT ROUTES ============
  app.get("/api/patients", isAuthenticated, async (req: any, res) => {
    try {
      const { status, physicianId } = req.query;
      const patients = await storage.getPatients({ 
        status: status as string, 
        physicianId: physicianId as string 
      });
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'view',
        entityType: 'patient_list',
        details: { count: patients.length }
      });
      
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/search", isAuthenticated, async (req: any, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query required" });
      }
      const patients = await storage.searchPatients(q as string);
      res.json(patients);
    } catch (error) {
      console.error("Error searching patients:", error);
      res.status(500).json({ message: "Failed to search patients" });
    }
  });

  app.get("/api/patients/:id", isAuthenticated, async (req: any, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'view',
        entityType: 'patient',
        entityId: req.params.id,
        details: { mrn: patient.mrn }
      });
      
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.post("/api/patients", isAuthenticated, requireRole('doctor', 'director', 'nurse'), async (req: any, res) => {
    try {
      // Convert numeric fields to strings for decimal columns
      const normalizedData = {
        ...req.body,
        weight: req.body.weight !== undefined && req.body.weight !== '' ? String(req.body.weight) : undefined,
        height: req.body.height !== undefined && req.body.height !== '' ? String(req.body.height) : undefined,
        // Convert allergies and chronicConditions to arrays if they're comma-separated strings
        allergies: req.body.allergies 
          ? (typeof req.body.allergies === 'string' 
              ? req.body.allergies.split(',').map((a: string) => a.trim()).filter((a: string) => a) 
              : req.body.allergies)
          : undefined,
        chronicConditions: req.body.chronicConditions 
          ? (typeof req.body.chronicConditions === 'string' 
              ? req.body.chronicConditions.split(',').map((c: string) => c.trim()).filter((c: string) => c) 
              : req.body.chronicConditions)
          : undefined,
      };
      
      const validatedData = insertPatientSchema.parse(normalizedData);
      const patient = await storage.createPatient(validatedData);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'patient',
        entityId: patient.id.toString(),
        details: { mrn: patient.mrn }
      });
      
      res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(400).json({ message: "Failed to create patient", error });
    }
  });

  app.patch("/api/patients/:id", isAuthenticated, requireRole('doctor', 'director', 'nurse'), async (req: any, res) => {
    try {
      const patient = await storage.updatePatient(parseInt(req.params.id), req.body);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'update',
        entityType: 'patient',
        entityId: req.params.id,
        details: { fieldsUpdated: Object.keys(req.body) }
      });
      
      res.json(patient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(400).json({ message: "Failed to update patient" });
    }
  });

  // ============ PRESCRIPTION ROUTES ============
  app.get("/api/patients/:patientId/prescriptions", isAuthenticated, async (req: any, res) => {
    try {
      const { active } = req.query;
      let prescriptions;
      if (active === 'true') {
        prescriptions = await storage.getActivePrescriptions(parseInt(req.params.patientId));
      } else {
        prescriptions = await storage.getPrescriptionsByPatient(parseInt(req.params.patientId));
      }
      res.json(prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });

  app.post("/api/prescriptions", isAuthenticated, requireRole('doctor', 'director'), async (req: any, res) => {
    try {
      const validatedData = insertPrescriptionSchema.parse({
        ...req.body,
        prescriberId: req.user.claims.sub
      });
      
      // Check for drug interactions with current medications
      const currentPrescriptions = await storage.getActivePrescriptions(validatedData.patientId);
      const currentMedIds = currentPrescriptions.map(p => p.medicationId);
      
      if (currentMedIds.length > 0) {
        const interactions = await checkDrugInteractions([...currentMedIds, validatedData.medicationId]);
        if (interactions.severe.length > 0) {
          return res.status(400).json({
            message: "Severe drug interaction detected",
            interactions: interactions.severe
          });
        }
      }
      
      const prescription = await storage.createPrescription(validatedData);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'prescription',
        entityId: prescription.id.toString(),
        details: { patientId: validatedData.patientId, medicationId: validatedData.medicationId }
      });
      
      res.status(201).json(prescription);
    } catch (error) {
      console.error("Error creating prescription:", error);
      res.status(400).json({ message: "Failed to create prescription", error });
    }
  });

  app.patch("/api/prescriptions/:id/discontinue", isAuthenticated, requireRole('doctor', 'director'), async (req: any, res) => {
    try {
      const { reason } = req.body;
      const prescription = await storage.updatePrescription(parseInt(req.params.id), {
        status: 'discontinued',
        discontinuedReason: reason,
        discontinuedBy: req.user.claims.sub,
        discontinuedAt: new Date()
      });
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'update',
        entityType: 'prescription',
        entityId: req.params.id,
        details: { action: 'discontinued', reason }
      });
      
      res.json(prescription);
    } catch (error) {
      console.error("Error discontinuing prescription:", error);
      res.status(400).json({ message: "Failed to discontinue prescription" });
    }
  });

  // ============ MEDICATION ADMINISTRATION ROUTES ============
  app.get("/api/patients/:patientId/mar", isAuthenticated, async (req: any, res) => {
    try {
      const { date } = req.query;
      const administrations = await storage.getAdministrationsByPatient(
        parseInt(req.params.patientId),
        date ? new Date(date as string) : undefined
      );
      res.json(administrations);
    } catch (error) {
      console.error("Error fetching MAR:", error);
      res.status(500).json({ message: "Failed to fetch medication administration records" });
    }
  });

  app.get("/api/medication-administrations", isAuthenticated, async (req: any, res) => {
    try {
      const { date } = req.query;
      const administrations = await storage.getAllMedicationAdministrations(
        date ? new Date(date as string) : undefined
      );
      res.json(administrations);
    } catch (error) {
      console.error("Error fetching medication administrations:", error);
      res.status(500).json({ message: "Failed to fetch medication administrations" });
    }
  });

  app.patch("/api/medication-administrations/:id", isAuthenticated, requireRole('doctor', 'nurse'), async (req: any, res) => {
    try {
      const administration = await storage.updateMedicationAdministration(parseInt(req.params.id), req.body);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'update',
        entityType: 'medication_administration',
        entityId: req.params.id,
        details: { status: req.body.status }
      });
      
      res.json(administration);
    } catch (error) {
      console.error("Error updating medication administration:", error);
      res.status(400).json({ message: "Failed to update medication administration" });
    }
  });

  app.get("/api/scheduled-administrations", isAuthenticated, async (req: any, res) => {
    try {
      const { startTime, endTime } = req.query;
      const start = startTime ? new Date(startTime as string) : new Date();
      const end = endTime ? new Date(endTime as string) : new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const administrations = await storage.getScheduledAdministrations(start, end);
      res.json(administrations);
    } catch (error) {
      console.error("Error fetching scheduled administrations:", error);
      res.status(500).json({ message: "Failed to fetch scheduled administrations" });
    }
  });

  app.post("/api/medication-administration", isAuthenticated, requireRole('doctor', 'nurse'), async (req: any, res) => {
    try {
      const validatedData = insertMedicationAdministrationSchema.parse(req.body);
      const administration = await storage.createMedicationAdministration(validatedData);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'medication_administration',
        entityId: administration.id.toString(),
        details: { patientId: validatedData.patientId, prescriptionId: validatedData.prescriptionId }
      });
      
      res.status(201).json(administration);
    } catch (error) {
      console.error("Error recording medication administration:", error);
      res.status(400).json({ message: "Failed to record medication administration" });
    }
  });

  app.patch("/api/medication-administration/:id/administer", isAuthenticated, requireRole('doctor', 'nurse'), async (req: any, res) => {
    try {
      const { doseGiven, notes, siteOfAdministration, vitalsBefore, vitalsAfter, witnessedBy } = req.body;
      
      const administration = await storage.updateMedicationAdministration(parseInt(req.params.id), {
        status: 'administered',
        actualTime: new Date(),
        administeredBy: req.user.claims.sub,
        doseGiven,
        notes,
        siteOfAdministration,
        vitalSignsBefore: vitalsBefore,
        vitalSignsAfter: vitalsAfter,
        witnessedBy
      });
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'update',
        entityType: 'medication_administration',
        entityId: req.params.id,
        details: { action: 'administered', doseGiven }
      });
      
      res.json(administration);
    } catch (error) {
      console.error("Error administering medication:", error);
      res.status(400).json({ message: "Failed to record medication administration" });
    }
  });

  // ============ VITAL SIGNS ROUTES ============
  app.get("/api/vital-signs", isAuthenticated, async (req: any, res) => {
    try {
      const { patientId, limit } = req.query;
      if (patientId) {
        const vitals = await storage.getVitalSigns(
          parseInt(patientId as string),
          limit ? parseInt(limit as string) : 50
        );
        return res.json(vitals);
      }
      const vitals = await storage.getAllVitalSigns(limit ? parseInt(limit as string) : 50);
      res.json(vitals);
    } catch (error) {
      console.error("Error fetching vital signs:", error);
      res.status(500).json({ message: "Failed to fetch vital signs" });
    }
  });

  app.post("/api/vital-signs", isAuthenticated, requireRole('doctor', 'nurse'), async (req: any, res) => {
    try {
      const validatedData = insertVitalSignsSchema.parse({
        ...req.body,
        recordedBy: req.user.claims.sub
      });
      const vitals = await storage.createVitalSigns(validatedData);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'vital_signs',
        entityId: vitals.id.toString(),
        details: { patientId: validatedData.patientId }
      });
      
      res.status(201).json(vitals);
    } catch (error) {
      console.error("Error recording vital signs:", error);
      res.status(400).json({ message: "Failed to record vital signs" });
    }
  });

  app.get("/api/patients/:patientId/vitals", isAuthenticated, async (req: any, res) => {
    try {
      const { limit } = req.query;
      const vitals = await storage.getVitalSigns(
        parseInt(req.params.patientId),
        limit ? parseInt(limit as string) : 50
      );
      res.json(vitals);
    } catch (error) {
      console.error("Error fetching vital signs:", error);
      res.status(500).json({ message: "Failed to fetch vital signs" });
    }
  });

  app.post("/api/patients/:patientId/vitals", isAuthenticated, requireRole('doctor', 'nurse'), async (req: any, res) => {
    try {
      const validatedData = insertVitalSignsSchema.parse({
        ...req.body,
        patientId: parseInt(req.params.patientId),
        recordedBy: req.user.claims.sub
      });
      const vitals = await storage.createVitalSigns(validatedData);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'vital_signs',
        entityId: vitals.id.toString(),
        details: { patientId: req.params.patientId }
      });
      
      res.status(201).json(vitals);
    } catch (error) {
      console.error("Error recording vital signs:", error);
      res.status(400).json({ message: "Failed to record vital signs" });
    }
  });

  // ============ LAB RESULTS ROUTES ============
  app.get("/api/patients/:patientId/labs", isAuthenticated, async (req: any, res) => {
    try {
      const { limit } = req.query;
      const labs = await storage.getLabResults(
        parseInt(req.params.patientId),
        limit ? parseInt(limit as string) : 50
      );
      res.json(labs);
    } catch (error) {
      console.error("Error fetching lab results:", error);
      res.status(500).json({ message: "Failed to fetch lab results" });
    }
  });

  app.post("/api/patients/:patientId/labs", isAuthenticated, requireRole('doctor', 'director'), async (req: any, res) => {
    try {
      const validatedData = insertLabResultSchema.parse({
        ...req.body,
        patientId: parseInt(req.params.patientId),
        orderedBy: req.user.claims.sub
      });
      const lab = await storage.createLabResult(validatedData);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'lab_result',
        entityId: lab.id.toString(),
        details: { patientId: req.params.patientId, testName: validatedData.testName }
      });
      
      res.status(201).json(lab);
    } catch (error) {
      console.error("Error recording lab result:", error);
      res.status(400).json({ message: "Failed to record lab result" });
    }
  });

  // ============ MEDICATION DATABASE ROUTES ============
  app.get("/api/medications", async (req, res) => {
    try {
      const { category, search, isActive } = req.query;
      let medications;
      
      if (search) {
        medications = await storage.searchMedications(search as string);
      } else {
        medications = await storage.getMedications({
          category: category as string,
          isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
        });
      }
      
      res.json(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  app.get("/api/medications/:id", async (req, res) => {
    try {
      const medication = await storage.getMedication(parseInt(req.params.id));
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      res.json(medication);
    } catch (error) {
      console.error("Error fetching medication:", error);
      res.status(500).json({ message: "Failed to fetch medication" });
    }
  });

  // ============ DOSE CALCULATION (RULE-BASED LOGIC) ============
  app.post("/api/calculate-dose", isAuthenticated, async (req: any, res) => {
    try {
      const { medicationId, patientId, indication } = req.body;
      
      const medication = await storage.getMedication(medicationId);
      const patient = await storage.getPatient(patientId);
      
      if (!medication || !patient) {
        return res.status(404).json({ message: "Medication or patient not found" });
      }
      
      const doseResult = calculateDose(medication, patient, indication);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'calculate',
        entityType: 'dose_calculation',
        details: { medicationId, patientId, result: doseResult }
      });
      
      res.json(doseResult);
    } catch (error) {
      console.error("Error calculating dose:", error);
      res.status(500).json({ message: "Failed to calculate dose" });
    }
  });

  // ============ DRUG SAFETY CHECK ============
  app.post("/api/drug-safety-check", isAuthenticated, async (req: any, res) => {
    try {
      const { medicationId, patientId } = req.body;
      
      const medication = await storage.getMedication(medicationId);
      const patient = await storage.getPatient(patientId);
      
      if (!medication || !patient) {
        return res.status(404).json({ message: "Medication or patient not found" });
      }
      
      const safetyInfo = getDrugSafetyInfo(medication, patient);
      res.json(safetyInfo);
    } catch (error) {
      console.error("Error checking drug safety:", error);
      res.status(500).json({ message: "Failed to check drug safety" });
    }
  });

  // ============ EMERGENCY PROTOCOLS ============
  app.get("/api/emergency-protocols", async (req, res) => {
    try {
      const { category } = req.query;
      const protocols = await storage.getEmergencyProtocols(category as string);
      res.json(protocols);
    } catch (error) {
      console.error("Error fetching emergency protocols:", error);
      res.status(500).json({ message: "Failed to fetch emergency protocols" });
    }
  });

  app.get("/api/emergency-protocols/:id", async (req, res) => {
    try {
      const protocol = await storage.getEmergencyProtocol(parseInt(req.params.id));
      if (!protocol) {
        return res.status(404).json({ message: "Protocol not found" });
      }
      res.json(protocol);
    } catch (error) {
      console.error("Error fetching emergency protocol:", error);
      res.status(500).json({ message: "Failed to fetch emergency protocol" });
    }
  });

  // ============ REMINDERS ============
  app.get("/api/medication-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // Next 4 hours
      const reminders = await storage.getPendingReminders(now, endTime);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.post("/api/medication-reminders/:id/acknowledge", isAuthenticated, async (req: any, res) => {
    try {
      await storage.acknowledgeReminder(parseInt(req.params.id), req.user.claims.sub);
      res.json({ success: true });
    } catch (error) {
      console.error("Error acknowledging reminder:", error);
      res.status(500).json({ message: "Failed to acknowledge reminder" });
    }
  });

  // ============ AUDIT LOGS (Directors only) ============
  app.get("/api/audit-logs", isAuthenticated, requireRole('director'), async (req: any, res) => {
    try {
      const { userId, entityType, startDate, endDate } = req.query;
      const logs = await storage.getAuditLogs({
        userId: userId as string,
        entityType: entityType as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      });
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // ============ USER MANAGEMENT (Directors only) ============
  app.get("/api/users", isAuthenticated, requireRole('director'), async (req: any, res) => {
    try {
      const { role } = req.query;
      if (role) {
        const users = await storage.getUsersByRole(role as string);
        return res.json(users);
      }
      // Get all roles
      const doctors = await storage.getUsersByRole('doctor');
      const nurses = await storage.getUsersByRole('nurse');
      const directors = await storage.getUsersByRole('director');
      const pharmacists = await storage.getUsersByRole('pharmacist');
      res.json([...doctors, ...nurses, ...directors, ...pharmacists]);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/users/:id/role", isAuthenticated, requireRole('director'), async (req: any, res) => {
    try {
      const { role } = req.body;
      const user = await storage.updateUserRole(req.params.id, role);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'update',
        entityType: 'user',
        entityId: req.params.id,
        details: { newRole: role }
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Enhanced Hospital Database endpoints
  app.get("/api/hospitals", (req, res) => {
    const { country, lat, lng, service, emergency } = req.query;
    
    import("../client/src/data/hospitalDatabase2025").then(({ 
      enhancedHospitalDatabase, 
      searchHospitalsByCountry, 
      searchHospitalsByLocation, 
      searchHospitalsByService,
      getEmergencyHospitals 
    }) => {
      let hospitals = enhancedHospitalDatabase;
      
      if (emergency === 'true') {
        hospitals = getEmergencyHospitals();
      } else if (country) {
        hospitals = searchHospitalsByCountry(country as string);
      } else if (lat && lng) {
        hospitals = searchHospitalsByLocation(
          parseFloat(lat as string), 
          parseFloat(lng as string), 
          50
        );
      } else if (service) {
        hospitals = searchHospitalsByService(service as any);
      }
      
      res.json(hospitals);
    }).catch(error => {
      console.error('Hospital data error:', error);
      res.status(500).json({ error: "Unable to retrieve hospital data" });
    });
  });

  // ============ MEDICATION ADVISOR ROUTES (Rule-Based) ============
  app.get("/api/advisor/symptoms", async (req, res) => {
    try {
      const { getAvailableSymptoms } = await import("./medicationAdvisor");
      const symptoms = getAvailableSymptoms();
      res.json(symptoms);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      res.status(500).json({ message: "Failed to fetch symptoms" });
    }
  });

  app.get("/api/advisor/conditions", async (req, res) => {
    try {
      const { getConditionCategories } = await import("./medicationAdvisor");
      const conditions = getConditionCategories();
      res.json(conditions);
    } catch (error) {
      console.error("Error fetching conditions:", error);
      res.status(500).json({ message: "Failed to fetch conditions" });
    }
  });

  app.post("/api/advisor/recommend", async (req: any, res) => {
    try {
      const { getMedicationRecommendations } = await import("./medicationAdvisor");
      const { symptoms, patientContext } = req.body;
      
      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ message: "Symptoms array is required" });
      }
      
      if (!patientContext) {
        return res.status(400).json({ message: "Patient context is required" });
      }
      
      const recommendations = getMedicationRecommendations(symptoms, {
        ageGroup: patientContext.ageGroup || 'adult',
        weight: patientContext.weight,
        isPregnant: patientContext.isPregnant || false,
        allergies: patientContext.allergies || [],
        currentMedications: patientContext.currentMedications || [],
        chronicConditions: patientContext.chronicConditions || [],
        renalFunction: patientContext.renalFunction || 'normal',
        hepaticFunction: patientContext.hepaticFunction || 'normal'
      });
      
      if (req.user) {
        await storage.createAuditLog({
          userId: req.user.claims.sub,
          action: 'medication_advisory',
          entityType: 'symptom_assessment',
          details: { 
            symptoms, 
            matchedConditions: recommendations.matchedConditions.map(c => c.condition),
            recommendationCount: recommendations.recommendations.length
          }
        });
      }
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting medication recommendations:", error);
      res.status(500).json({ message: "Failed to get medication recommendations" });
    }
  });

  // ============ CLINICAL NOTES ROUTES (Doctor Charts) ============
  app.get("/api/patients/:patientId/notes", isAuthenticated, async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const notes = await storage.getClinicalNotes(patientId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching clinical notes:", error);
      res.status(500).json({ message: "Failed to fetch clinical notes" });
    }
  });

  app.post("/api/patients/:patientId/notes", isAuthenticated, requireRole('doctor', 'nurse'), async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const note = await storage.createClinicalNote({
        patientId,
        authorId: req.user.claims.sub,
        noteType: req.body.noteType,
        title: req.body.title,
        content: req.body.content,
        isSigned: false
      });
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'clinical_note',
        entityId: note.id.toString(),
        details: { patientId, noteType: req.body.noteType }
      });
      
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating clinical note:", error);
      res.status(400).json({ message: "Failed to create clinical note" });
    }
  });

  // ============ PROBLEM LIST ROUTES ============
  app.get("/api/patients/:patientId/problems", isAuthenticated, async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const problems = await storage.getProblemList(patientId);
      res.json(problems);
    } catch (error) {
      console.error("Error fetching problem list:", error);
      res.status(500).json({ message: "Failed to fetch problem list" });
    }
  });

  app.post("/api/patients/:patientId/problems", isAuthenticated, requireRole('doctor'), async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const problem = await storage.createProblem({
        patientId,
        icdCode: req.body.icdCode,
        description: req.body.description,
        status: req.body.status || 'active',
        onsetDate: req.body.onsetDate,
        severity: req.body.severity,
        addedBy: req.user.claims.sub,
        notes: req.body.notes
      });
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'create',
        entityType: 'problem',
        entityId: problem.id.toString(),
        details: { patientId, icdCode: req.body.icdCode }
      });
      
      res.status(201).json(problem);
    } catch (error) {
      console.error("Error creating problem:", error);
      res.status(400).json({ message: "Failed to create problem" });
    }
  });

  app.patch("/api/problems/:id", isAuthenticated, requireRole('doctor'), async (req: any, res) => {
    try {
      const problem = await storage.updateProblem(parseInt(req.params.id), req.body);
      
      await storage.createAuditLog({
        userId: req.user.claims.sub,
        action: 'update',
        entityType: 'problem',
        entityId: req.params.id,
        details: req.body
      });
      
      res.json(problem);
    } catch (error) {
      console.error("Error updating problem:", error);
      res.status(400).json({ message: "Failed to update problem" });
    }
  });

  // ============ MEDICATION DATABASE ROUTES ============
  
  // Get all medications (paginated)
  app.get("/api/medications-database", async (req, res) => {
    try {
      const { page = 1, limit = 50, category, search, controlled, blackbox } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 100);
      
      let medications = [...medicationsDatabase];
      
      // Apply filters
      if (category) {
        medications = getMedicationsByCategory(category as string);
      }
      if (search) {
        medications = searchMedications(search as string);
      }
      if (controlled === 'true') {
        medications = getControlledSubstances();
      }
      if (blackbox === 'true') {
        medications = getMedicationsWithBlackBoxWarning();
      }
      
      // Paginate
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedMeds = medications.slice(startIndex, startIndex + limitNum);
      
      res.json({
        medications: paginatedMeds,
        totalCount: medications.length,
        page: pageNum,
        totalPages: Math.ceil(medications.length / limitNum),
        categories: Array.from(new Set(medicationsDatabase.map(m => m.category)))
      });
    } catch (error) {
      console.error("Error fetching medications database:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  // Get single medication by name
  app.get("/api/medications-database/:name", async (req, res) => {
    try {
      const medication = getMedicationByName(req.params.name);
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      res.json(medication);
    } catch (error) {
      console.error("Error fetching medication:", error);
      res.status(500).json({ message: "Failed to fetch medication" });
    }
  });

  // Get medication categories
  app.get("/api/medications-database-categories", async (req, res) => {
    try {
      const categories = Array.from(new Set(medicationsDatabase.map(m => m.category)));
      const categoryCounts = categories.map(cat => ({
        name: cat,
        count: medicationsDatabase.filter(m => m.category === cat).length
      }));
      res.json(categoryCounts);
    } catch (error) {
      console.error("Error fetching medication categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get medications by regulatory agency
  app.get("/api/medications-by-agency/:agency", async (req, res) => {
    try {
      const agency = req.params.agency.toUpperCase() as any;
      const validAgencies = ['FDA', 'EMA', 'PMDA', 'NMPA', 'MFDS', 'HSA', 'TGA', 'MOHRU'];
      
      if (!validAgencies.includes(agency)) {
        return res.status(400).json({ 
          message: "Invalid regulatory agency",
          validAgencies: ['FDA', 'EMA', 'PMDA', 'NMPA', 'MFDS', 'HSA', 'TGA', 'MOHRU']
        });
      }
      
      const medications = getMedicationsByRegulatoryAgency(agency);
      res.json({
        agency,
        count: medications.length,
        medications
      });
    } catch (error) {
      console.error("Error fetching medications by agency:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  // Get medications grouped by all regulatory agencies
  app.get("/api/medications-grouped-by-agency", async (req, res) => {
    try {
      const grouped = getMedicationsGroupedByAgency();
      const counts = getMedicationCountByAgency();
      
      res.json({
        agencies: {
          FDA: { name: "U.S. Food and Drug Administration", count: counts.FDA, region: "USA" },
          EMA: { name: "European Medicines Agency", count: counts.EMA, region: "EU" },
          PMDA: { name: "Pharmaceuticals and Medical Devices Agency", count: counts.PMDA, region: "Japan" },
          NMPA: { name: "National Medical Products Administration", count: counts.NMPA, region: "China" },
          MFDS: { name: "Ministry of Food and Drug Safety", count: counts.MFDS, region: "Korea" },
          HSA: { name: "Health Sciences Authority", count: counts.HSA, region: "Singapore" },
          TGA: { name: "Therapeutic Goods Administration", count: counts.TGA, region: "Australia" },
          MOHRU: { name: "Roszdravnadzor / Ministry of Health", count: counts.MOHRU, region: "Russia" }
        },
        medications: grouped
      });
    } catch (error) {
      console.error("Error fetching grouped medications:", error);
      res.status(500).json({ message: "Failed to fetch grouped medications" });
    }
  });

  // Get medication approval status
  app.get("/api/medication-approval/:name/:agency", async (req, res) => {
    try {
      const { name, agency } = req.params;
      const approval = getMedicationApprovalStatus(name, agency.toUpperCase() as any);
      
      if (!approval) {
        return res.status(404).json({ 
          message: "Medication not found or not approved by this agency" 
        });
      }
      
      res.json(approval);
    } catch (error) {
      console.error("Error fetching medication approval:", error);
      res.status(500).json({ message: "Failed to fetch approval status" });
    }
  });

  // ============ TREATMENT PROTOCOL ROUTES ============
  
  // Get all treatment protocols (paginated)
  app.get("/api/treatment-protocols", async (req, res) => {
    try {
      const { page = 1, limit = 20, category, search, severity, icd } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 50);
      
      let protocols = [...treatmentProtocols];
      
      // Apply filters
      if (category) {
        protocols = getProtocolsByCategory(category as string);
      }
      if (search) {
        protocols = searchProtocols(search as string);
      }
      if (severity) {
        protocols = protocols.filter(p => p.severity === severity);
      }
      if (icd) {
        protocols = getProtocolsByICD(icd as string);
      }
      
      // Paginate
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedProtocols = protocols.slice(startIndex, startIndex + limitNum);
      
      res.json({
        protocols: paginatedProtocols,
        totalCount: protocols.length,
        page: pageNum,
        totalPages: Math.ceil(protocols.length / limitNum),
        categories: Array.from(new Set(treatmentProtocols.map(p => p.category)))
      });
    } catch (error) {
      console.error("Error fetching treatment protocols:", error);
      res.status(500).json({ message: "Failed to fetch protocols" });
    }
  });

  // Get single treatment protocol by ID
  app.get("/api/treatment-protocols/:id", async (req, res) => {
    try {
      const protocol = getProtocolById(req.params.id);
      if (!protocol) {
        return res.status(404).json({ message: "Protocol not found" });
      }
      res.json(protocol);
    } catch (error) {
      console.error("Error fetching protocol:", error);
      res.status(500).json({ message: "Failed to fetch protocol" });
    }
  });

  // Get protocol categories
  app.get("/api/treatment-protocols-categories", async (req, res) => {
    try {
      const categories = Array.from(new Set(treatmentProtocols.map(p => p.category)));
      const categoryCounts = categories.map(cat => ({
        name: cat,
        count: treatmentProtocols.filter(p => p.category === cat).length
      }));
      res.json(categoryCounts);
    } catch (error) {
      console.error("Error fetching protocol categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // ============ RULE-BASED MEDICATION ADVISOR ============
  
  // Get medication recommendations based on condition (NO AI - rule-based only)
  app.post("/api/medication-advisor", async (req, res) => {
    try {
      const { 
        condition, 
        symptoms, 
        patientAge, 
        patientWeight, 
        allergies = [], 
        currentMedications = [],
        renalFunction,
        hepaticFunction,
        isPregnant = false 
      } = req.body;

      if (!condition) {
        return res.status(400).json({ message: "Condition is required" });
      }

      // Find matching treatment protocol
      const matchingProtocol = searchProtocols(condition)[0];
      
      if (!matchingProtocol) {
        return res.json({
          found: false,
          message: "No matching protocol found for this condition",
          recommendation: {
            generalAdvice: "Please consult with a healthcare provider for personalized treatment recommendations.",
            disclaimer: "This is not medical advice. Always consult a qualified healthcare professional."
          }
        });
      }

      // Get first-line medications with details
      const recommendedMedications = matchingProtocol.firstLineMedications.map(med => {
        const fullMedInfo = getMedicationByName(med.name);
        
        // Check for contraindications
        const contraindicated = allergies.some((allergy: string) => 
          med.name.toLowerCase().includes(allergy.toLowerCase())
        );
        
        // Check for pregnancy contraindications
        const pregnancyContraindicated = isPregnant && fullMedInfo?.pregnancyCategory && 
          ['D', 'X'].includes(fullMedInfo.pregnancyCategory);
        
        // Check drug interactions
        const interactions = currentMedications.filter((current: string) =>
          fullMedInfo?.drugInteractions?.some(interaction => 
            interaction.toLowerCase().includes(current.toLowerCase())
          )
        );

        return {
          name: med.name,
          dose: med.dose,
          route: med.route,
          frequency: med.frequency,
          duration: med.duration,
          notes: med.notes,
          contraindicated,
          pregnancyContraindicated,
          interactions,
          fullDetails: fullMedInfo ? {
            category: fullMedInfo.category,
            sideEffects: fullMedInfo.sideEffects.slice(0, 5),
            blackBoxWarning: fullMedInfo.blackBoxWarning,
            pregnancyCategory: fullMedInfo.pregnancyCategory,
            monitoringParameters: fullMedInfo.monitoringParameters
          } : null
        };
      });

      // Filter safe medications
      const safeMedications = recommendedMedications.filter(med => 
        !med.contraindicated && !med.pregnancyContraindicated
      );

      res.json({
        found: true,
        protocol: {
          name: matchingProtocol.name,
          category: matchingProtocol.category,
          severity: matchingProtocol.severity,
          description: matchingProtocol.description
        },
        steps: matchingProtocol.steps,
        recommendedMedications,
        safeMedications,
        warningSymptoms: matchingProtocol.warningSymptoms,
        referralCriteria: matchingProtocol.referralCriteria,
        followUp: matchingProtocol.followUp,
        references: matchingProtocol.references,
        disclaimer: "This is clinical decision support only. All medication decisions must be made by a licensed healthcare provider. This system does not replace professional medical judgment."
      });
    } catch (error) {
      console.error("Error in medication advisor:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Calculate dose based on patient parameters (rule-based)
  app.post("/api/calculate-dose", async (req, res) => {
    try {
      const { 
        medicationName, 
        patientWeight, 
        patientAge, 
        renalFunction,
        hepaticFunction,
        indication 
      } = req.body;

      if (!medicationName || !patientWeight) {
        return res.status(400).json({ message: "Medication name and patient weight are required" });
      }

      const medication = getMedicationByName(medicationName);
      
      if (!medication) {
        return res.status(404).json({ message: "Medication not found in database" });
      }

      let calculatedDose = medication.standardDoseAdult;
      let adjustmentNotes: string[] = [];

      // Weight-based dosing calculation
      if (medication.weightBasedDosing && medication.weightBasedFormula) {
        const match = medication.weightBasedFormula.match(/(\d+(?:\.\d+)?)/);
        if (match) {
          const dosePerKg = parseFloat(match[1]);
          const calculatedAmount = dosePerKg * patientWeight;
          calculatedDose = `${calculatedAmount.toFixed(1)}mg based on ${patientWeight}kg`;
          adjustmentNotes.push(`Calculated using ${dosePerKg}mg/kg formula`);
        }
      }

      // Renal adjustment
      if (renalFunction && medication.renalAdjustment) {
        adjustmentNotes.push(`Renal adjustment: ${medication.renalAdjustment}`);
      }

      // Hepatic adjustment
      if (hepaticFunction && medication.hepaticAdjustment) {
        adjustmentNotes.push(`Hepatic adjustment: ${medication.hepaticAdjustment}`);
      }

      // Pediatric dosing
      if (patientAge && patientAge < 18 && medication.standardDosePediatric) {
        calculatedDose = medication.standardDosePediatric;
        adjustmentNotes.push("Pediatric dosing applied");
      }

      res.json({
        medication: medication.name,
        standardDose: medication.standardDoseAdult,
        calculatedDose,
        maxDailyDose: medication.maxDailyDose,
        frequency: medication.dosingFrequency,
        route: medication.route,
        adjustmentNotes,
        monitoringRequired: medication.monitoringParameters,
        labsRequired: medication.labsRequired,
        administrationNotes: medication.administrationNotes,
        warnings: medication.blackBoxWarning ? [medication.blackBoxWarning] : [],
        disclaimer: "Dose calculations are for reference only. All doses must be verified by a licensed healthcare provider."
      });
    } catch (error) {
      console.error("Error calculating dose:", error);
      res.status(500).json({ message: "Failed to calculate dose" });
    }
  });

  // Check drug interactions (rule-based)
  app.post("/api/check-interactions", async (req, res) => {
    try {
      const { medications } = req.body;

      if (!medications || !Array.isArray(medications) || medications.length < 2) {
        return res.status(400).json({ message: "At least two medications are required to check interactions" });
      }

      const interactions: Array<{
        drug1: string;
        drug2: string;
        severity: 'major' | 'moderate' | 'minor';
        description: string;
      }> = [];

      // Check each pair of medications for interactions
      for (let i = 0; i < medications.length; i++) {
        const med1 = getMedicationByName(medications[i]);
        if (!med1) continue;

        for (let j = i + 1; j < medications.length; j++) {
          const med2Name = medications[j].toLowerCase();
          
          // Check if med1's interactions include med2
          const hasInteraction = med1.drugInteractions.some(interaction => 
            interaction.toLowerCase().includes(med2Name) ||
            med2Name.includes(interaction.toLowerCase())
          );

          if (hasInteraction) {
            interactions.push({
              drug1: med1.name,
              drug2: medications[j],
              severity: 'moderate', // Could be enhanced with severity data
              description: `${med1.name} may interact with ${medications[j]}. Review medication profiles for details.`
            });
          }
        }
      }

      res.json({
        medicationsChecked: medications,
        interactionsFound: interactions.length,
        interactions,
        recommendation: interactions.length > 0 
          ? "Potential interactions found. Please review with a pharmacist or physician."
          : "No known interactions found between these medications.",
        disclaimer: "This interaction checker is for reference only. Not all interactions may be detected. Always consult with a pharmacist for comprehensive interaction screening."
      });
    } catch (error) {
      console.error("Error checking interactions:", error);
      res.status(500).json({ message: "Failed to check interactions" });
    }
  });

  // Legacy endpoints for backward compatibility  
  app.post("/api/analyze-damage", analyzeMockDamage);
  app.post("/api/analyze-xray", analyzeMockXray);
  app.post("/api/analyze-mri", analyzeMockMRI);
  app.post("/api/analyze-medical", analyzeMockMedical);
  app.post("/api/medical-chat", mockMedicalChat);

  const httpServer = createServer(app);
  return httpServer;
}

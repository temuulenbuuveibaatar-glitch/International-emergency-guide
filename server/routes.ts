import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireRole } from "./replitAuth";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ============ AUTH ROUTES ============
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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
      const validatedData = insertPatientSchema.parse(req.body);
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

  // Legacy endpoints for backward compatibility  
  app.post("/api/analyze-damage", analyzeMockDamage);
  app.post("/api/analyze-xray", analyzeMockXray);
  app.post("/api/analyze-mri", analyzeMockMRI);
  app.post("/api/analyze-medical", analyzeMockMedical);
  app.post("/api/medical-chat", mockMedicalChat);

  const httpServer = createServer(app);
  return httpServer;
}

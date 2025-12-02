import {
  authUsers,
  patients,
  medications,
  prescriptions,
  medicationAdministrations,
  vitalSigns,
  labResults,
  auditLogs,
  emergencyProtocols,
  medicationReminders,
  clinicalNotes,
  problemList,
  patientPortalAccounts,
  type User,
  type UpsertUser,
  type Patient,
  type InsertPatient,
  type Medication,
  type InsertMedication,
  type Prescription,
  type InsertPrescription,
  type MedicationAdministration,
  type InsertMedicationAdministration,
  type VitalSigns,
  type InsertVitalSigns,
  type LabResult,
  type InsertLabResult,
  type AuditLog,
  type InsertAuditLog,
  type EmergencyProtocol,
  type MedicationReminder,
  type ClinicalNote,
  type InsertClinicalNote,
  type Problem,
  type InsertProblem,
  type PatientPortalAccount,
  type InsertPatientPortalAccount,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  
  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByMRN(mrn: string): Promise<Patient | undefined>;
  getPatients(filters?: { status?: string; physicianId?: string }): Promise<Patient[]>;
  searchPatients(query: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  
  // Medication operations
  getMedication(id: number): Promise<Medication | undefined>;
  getMedications(filters?: { category?: string; isActive?: boolean }): Promise<Medication[]>;
  searchMedications(query: string): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication | undefined>;
  
  // Prescription operations
  getPrescription(id: number): Promise<Prescription | undefined>;
  getPrescriptionsByPatient(patientId: number): Promise<Prescription[]>;
  getActivePrescriptions(patientId: number): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription | undefined>;
  
  // Medication Administration operations
  getMedicationAdministration(id: number): Promise<MedicationAdministration | undefined>;
  getAdministrationsByPatient(patientId: number, date?: Date): Promise<MedicationAdministration[]>;
  getScheduledAdministrations(startTime: Date, endTime: Date): Promise<MedicationAdministration[]>;
  createMedicationAdministration(admin: InsertMedicationAdministration): Promise<MedicationAdministration>;
  updateMedicationAdministration(id: number, admin: Partial<InsertMedicationAdministration>): Promise<MedicationAdministration | undefined>;
  
  // Vital Signs operations
  getVitalSigns(patientId: number, limit?: number): Promise<VitalSigns[]>;
  getAllVitalSigns(limit?: number): Promise<VitalSigns[]>;
  createVitalSigns(vitals: InsertVitalSigns): Promise<VitalSigns>;
  
  // Get all medication administrations
  getAllMedicationAdministrations(date?: Date, limit?: number): Promise<MedicationAdministration[]>;
  
  // Lab Results operations
  getLabResults(patientId: number, limit?: number): Promise<LabResult[]>;
  createLabResult(lab: InsertLabResult): Promise<LabResult>;
  
  // Audit Log operations
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: { userId?: string; entityType?: string; startDate?: Date; endDate?: Date }): Promise<AuditLog[]>;
  
  // Emergency Protocols
  getEmergencyProtocols(category?: string): Promise<EmergencyProtocol[]>;
  getEmergencyProtocol(id: number): Promise<EmergencyProtocol | undefined>;
  
  // Medication Reminders
  getPendingReminders(startTime: Date, endTime: Date): Promise<MedicationReminder[]>;
  acknowledgeReminder(id: number, userId: string): Promise<void>;
  
  // Clinical Notes
  getClinicalNotes(patientId: number): Promise<ClinicalNote[]>;
  createClinicalNote(note: InsertClinicalNote): Promise<ClinicalNote>;
  
  // Problem List
  getProblemList(patientId: number): Promise<Problem[]>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: number, problem: Partial<InsertProblem>): Promise<Problem | undefined>;
  
  // Additional User operations
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Patient Portal Accounts
  createPatientPortalAccount(account: InsertPatientPortalAccount): Promise<PatientPortalAccount>;
  getPatientPortalAccount(id: number): Promise<PatientPortalAccount | undefined>;
  getPatientPortalAccountByEmail(email: string): Promise<PatientPortalAccount | undefined>;
  updatePatientPortalAccount(id: number, data: { lastLoginAt?: Date; isVerified?: boolean }): Promise<PatientPortalAccount | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(authUsers)
      .values(userData)
      .onConflictDoUpdate({
        target: authUsers.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(authUsers).where(eq(authUsers.role, role));
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(authUsers)
      .set({ role, updatedAt: new Date() })
      .where(eq(authUsers.id, id))
      .returning();
    return user;
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getPatientByMRN(mrn: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.mrn, mrn));
    return patient;
  }

  async getPatients(filters?: { status?: string; physicianId?: string }): Promise<Patient[]> {
    let query = db.select().from(patients);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(patients.status, filters.status));
    }
    if (filters?.physicianId) {
      conditions.push(eq(patients.primaryPhysicianId, filters.physicianId));
    }
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(patients.admissionDate));
    }
    return await query.orderBy(desc(patients.admissionDate));
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(patients).where(
      or(
        like(patients.firstName, searchTerm),
        like(patients.lastName, searchTerm),
        like(patients.mrn, searchTerm)
      )
    );
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [updated] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updated;
  }

  // Medication operations
  async getMedication(id: number): Promise<Medication | undefined> {
    const [medication] = await db.select().from(medications).where(eq(medications.id, id));
    return medication;
  }

  async getMedications(filters?: { category?: string; isActive?: boolean }): Promise<Medication[]> {
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(medications.category, filters.category));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(medications.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(medications).where(and(...conditions)).orderBy(asc(medications.name));
    }
    return await db.select().from(medications).orderBy(asc(medications.name));
  }

  async searchMedications(query: string): Promise<Medication[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(medications).where(
      or(
        like(medications.name, searchTerm),
        like(medications.genericName, searchTerm)
      )
    );
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const [newMed] = await db.insert(medications).values(medication).returning();
    return newMed;
  }

  async updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication | undefined> {
    const [updated] = await db
      .update(medications)
      .set({ ...medication, updatedAt: new Date() })
      .where(eq(medications.id, id))
      .returning();
    return updated;
  }

  // Prescription operations
  async getPrescription(id: number): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return prescription;
  }

  async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions)
      .where(eq(prescriptions.patientId, patientId))
      .orderBy(desc(prescriptions.createdAt));
  }

  async getActivePrescriptions(patientId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions)
      .where(and(
        eq(prescriptions.patientId, patientId),
        eq(prescriptions.status, 'active')
      ))
      .orderBy(desc(prescriptions.startDate));
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
    return newPrescription;
  }

  async updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription | undefined> {
    const [updated] = await db
      .update(prescriptions)
      .set({ ...prescription, updatedAt: new Date() })
      .where(eq(prescriptions.id, id))
      .returning();
    return updated;
  }

  // Medication Administration operations
  async getMedicationAdministration(id: number): Promise<MedicationAdministration | undefined> {
    const [admin] = await db.select().from(medicationAdministrations).where(eq(medicationAdministrations.id, id));
    return admin;
  }

  async getAdministrationsByPatient(patientId: number, date?: Date): Promise<MedicationAdministration[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db.select().from(medicationAdministrations)
        .where(and(
          eq(medicationAdministrations.patientId, patientId),
          gte(medicationAdministrations.scheduledTime, startOfDay),
          lte(medicationAdministrations.scheduledTime, endOfDay)
        ))
        .orderBy(asc(medicationAdministrations.scheduledTime));
    }
    
    return await db.select().from(medicationAdministrations)
      .where(eq(medicationAdministrations.patientId, patientId))
      .orderBy(desc(medicationAdministrations.scheduledTime));
  }

  async getScheduledAdministrations(startTime: Date, endTime: Date): Promise<MedicationAdministration[]> {
    return await db.select().from(medicationAdministrations)
      .where(and(
        gte(medicationAdministrations.scheduledTime, startTime),
        lte(medicationAdministrations.scheduledTime, endTime),
        eq(medicationAdministrations.status, 'scheduled')
      ))
      .orderBy(asc(medicationAdministrations.scheduledTime));
  }

  async createMedicationAdministration(admin: InsertMedicationAdministration): Promise<MedicationAdministration> {
    const [newAdmin] = await db.insert(medicationAdministrations).values(admin).returning();
    return newAdmin;
  }

  async updateMedicationAdministration(id: number, admin: Partial<InsertMedicationAdministration>): Promise<MedicationAdministration | undefined> {
    const [updated] = await db
      .update(medicationAdministrations)
      .set({ ...admin, updatedAt: new Date() })
      .where(eq(medicationAdministrations.id, id))
      .returning();
    return updated;
  }

  // Vital Signs operations
  async getVitalSigns(patientId: number, limit: number = 50): Promise<VitalSigns[]> {
    return await db.select().from(vitalSigns)
      .where(eq(vitalSigns.patientId, patientId))
      .orderBy(desc(vitalSigns.recordedAt))
      .limit(limit);
  }

  async getAllVitalSigns(limit: number = 50): Promise<VitalSigns[]> {
    return await db.select().from(vitalSigns)
      .orderBy(desc(vitalSigns.recordedAt))
      .limit(limit);
  }

  async createVitalSigns(vitals: InsertVitalSigns): Promise<VitalSigns> {
    const [newVitals] = await db.insert(vitalSigns).values(vitals).returning();
    return newVitals;
  }

  async getAllMedicationAdministrations(date?: Date, limit: number = 100): Promise<MedicationAdministration[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db.select().from(medicationAdministrations)
        .where(and(
          gte(medicationAdministrations.scheduledTime, startOfDay),
          lte(medicationAdministrations.scheduledTime, endOfDay)
        ))
        .orderBy(asc(medicationAdministrations.scheduledTime))
        .limit(limit);
    }
    return await db.select().from(medicationAdministrations)
      .orderBy(desc(medicationAdministrations.scheduledTime))
      .limit(limit);
  }

  // Lab Results operations
  async getLabResults(patientId: number, limit: number = 50): Promise<LabResult[]> {
    return await db.select().from(labResults)
      .where(eq(labResults.patientId, patientId))
      .orderBy(desc(labResults.resultedAt))
      .limit(limit);
  }

  async createLabResult(lab: InsertLabResult): Promise<LabResult> {
    const [newLab] = await db.insert(labResults).values(lab).returning();
    return newLab;
  }

  // Audit Log operations
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAuditLogs(filters?: { userId?: string; entityType?: string; startDate?: Date; endDate?: Date }): Promise<AuditLog[]> {
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters?.entityType) {
      conditions.push(eq(auditLogs.entityType, filters.entityType));
    }
    if (filters?.startDate) {
      conditions.push(gte(auditLogs.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(auditLogs.createdAt, filters.endDate));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(auditLogs).where(and(...conditions)).orderBy(desc(auditLogs.createdAt)).limit(1000);
    }
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(1000);
  }

  // Emergency Protocols
  async getEmergencyProtocols(category?: string): Promise<EmergencyProtocol[]> {
    if (category) {
      return await db.select().from(emergencyProtocols)
        .where(and(eq(emergencyProtocols.category, category), eq(emergencyProtocols.isActive, true)))
        .orderBy(asc(emergencyProtocols.name));
    }
    return await db.select().from(emergencyProtocols)
      .where(eq(emergencyProtocols.isActive, true))
      .orderBy(asc(emergencyProtocols.name));
  }

  async getEmergencyProtocol(id: number): Promise<EmergencyProtocol | undefined> {
    const [protocol] = await db.select().from(emergencyProtocols).where(eq(emergencyProtocols.id, id));
    return protocol;
  }

  // Medication Reminders
  async getPendingReminders(startTime: Date, endTime: Date): Promise<MedicationReminder[]> {
    return await db.select().from(medicationReminders)
      .where(and(
        gte(medicationReminders.scheduledTime, startTime),
        lte(medicationReminders.scheduledTime, endTime),
        eq(medicationReminders.status, 'pending')
      ))
      .orderBy(asc(medicationReminders.scheduledTime));
  }

  async acknowledgeReminder(id: number, userId: string): Promise<void> {
    await db.update(medicationReminders)
      .set({
        acknowledged: true,
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
        status: 'acknowledged'
      })
      .where(eq(medicationReminders.id, id));
  }

  // Clinical Notes
  async getClinicalNotes(patientId: number): Promise<ClinicalNote[]> {
    return await db.select().from(clinicalNotes)
      .where(eq(clinicalNotes.patientId, patientId))
      .orderBy(desc(clinicalNotes.createdAt));
  }

  async createClinicalNote(note: InsertClinicalNote): Promise<ClinicalNote> {
    const [newNote] = await db.insert(clinicalNotes).values(note).returning();
    return newNote;
  }

  // Problem List
  async getProblemList(patientId: number): Promise<Problem[]> {
    return await db.select().from(problemList)
      .where(eq(problemList.patientId, patientId))
      .orderBy(desc(problemList.addedAt));
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const [newProblem] = await db.insert(problemList).values(problem).returning();
    return newProblem;
  }

  async updateProblem(id: number, problem: Partial<InsertProblem>): Promise<Problem | undefined> {
    const [updated] = await db.update(problemList)
      .set(problem)
      .where(eq(problemList.id, id))
      .returning();
    return updated;
  }

  // Additional User operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email));
    return user;
  }

  // Patient Portal Accounts
  async createPatientPortalAccount(account: InsertPatientPortalAccount): Promise<PatientPortalAccount> {
    const [newAccount] = await db.insert(patientPortalAccounts).values(account).returning();
    return newAccount;
  }

  async getPatientPortalAccount(id: number): Promise<PatientPortalAccount | undefined> {
    const [account] = await db.select().from(patientPortalAccounts).where(eq(patientPortalAccounts.id, id));
    return account;
  }

  async getPatientPortalAccountByEmail(email: string): Promise<PatientPortalAccount | undefined> {
    const [account] = await db.select().from(patientPortalAccounts).where(eq(patientPortalAccounts.email, email));
    return account;
  }

  async updatePatientPortalAccount(id: number, data: { lastLoginAt?: Date; isVerified?: boolean }): Promise<PatientPortalAccount | undefined> {
    // Only allow updating safe fields - never allow passwordHash to be set to null
    const safeData: Record<string, unknown> = {};
    if (data.lastLoginAt !== undefined) safeData.lastLoginAt = data.lastLoginAt;
    if (data.isVerified !== undefined) safeData.isVerified = data.isVerified;
    
    if (Object.keys(safeData).length === 0) return undefined;
    
    const [updated] = await db.update(patientPortalAccounts)
      .set(safeData)
      .where(eq(patientPortalAccounts.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();

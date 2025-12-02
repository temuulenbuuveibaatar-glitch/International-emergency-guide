import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  serial,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Auth users table for Replit Auth (varchar IDs for OpenID Connect)
export const authUsers = pgTable("auth_users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).default("nurse").notNull(),
  department: varchar("department", { length: 100 }),
  licenseNumber: varchar("license_number", { length: 100 }),
  passwordHash: varchar("password_hash", { length: 255 }), // Bcrypt hashed password for standalone auth
  isActive: boolean("is_active").default(true).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret", { length: 255 }), // TOTP secret for MFA
  lastLoginAt: timestamp("last_login_at"),
  legacyUserId: integer("legacy_user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  mrn: varchar("mrn", { length: 50 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  bloodType: varchar("blood_type", { length: 10 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  height: decimal("height", { precision: 5, scale: 2 }),
  allergies: text("allergies").array(),
  chronicConditions: text("chronic_conditions").array(),
  emergencyContactName: varchar("emergency_contact_name", { length: 200 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 50 }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  insuranceProvider: varchar("insurance_provider", { length: 200 }),
  insuranceNumber: varchar("insurance_number", { length: 100 }),
  roomNumber: varchar("room_number", { length: 20 }),
  bedNumber: varchar("bed_number", { length: 20 }),
  admissionDate: timestamp("admission_date"),
  dischargeDate: timestamp("discharge_date"),
  status: varchar("status", { length: 50 }).default("admitted").notNull(),
  primaryPhysicianId: varchar("primary_physician_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medications database with validated dosing information
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  genericName: varchar("generic_name", { length: 200 }),
  brandNames: text("brand_names").array(),
  category: varchar("category", { length: 100 }).notNull(),
  form: varchar("form", { length: 100 }).notNull(),
  strength: varchar("strength", { length: 100 }).notNull(),
  route: varchar("route", { length: 100 }).notNull(),
  standardDoseAdult: varchar("standard_dose_adult", { length: 200 }),
  standardDosePediatric: varchar("standard_dose_pediatric", { length: 200 }),
  maxDailyDose: varchar("max_daily_dose", { length: 200 }),
  dosingFrequency: varchar("dosing_frequency", { length: 200 }),
  weightBasedDosing: boolean("weight_based_dosing").default(false),
  weightBasedFormula: varchar("weight_based_formula", { length: 200 }),
  renalAdjustment: text("renal_adjustment"),
  hepaticAdjustment: text("hepatic_adjustment"),
  contraindications: text("contraindications").array(),
  drugInteractions: text("drug_interactions").array(),
  sideEffects: text("side_effects").array(),
  blackBoxWarning: text("black_box_warning"),
  pregnancyCategory: varchar("pregnancy_category", { length: 10 }),
  administrationNotes: text("administration_notes"),
  storageRequirements: varchar("storage_requirements", { length: 200 }),
  specialPrecautions: text("special_precautions"),
  monitoringParameters: text("monitoring_parameters").array(),
  labsRequired: text("labs_required").array(),
  isControlled: boolean("is_controlled").default(false),
  controlledSchedule: varchar("controlled_schedule", { length: 20 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Prescriptions/Medication Orders
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  medicationId: integer("medication_id").references(() => medications.id).notNull(),
  prescriberId: varchar("prescriber_id").notNull(),
  dose: varchar("dose", { length: 100 }).notNull(),
  doseUnit: varchar("dose_unit", { length: 50 }).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  route: varchar("route", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  instructions: text("instructions"),
  reason: text("reason"),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  discontinuedReason: text("discontinued_reason"),
  discontinuedBy: varchar("discontinued_by"),
  discontinuedAt: timestamp("discontinued_at"),
  verifiedByPharmacist: boolean("verified_by_pharmacist").default(false),
  pharmacistId: varchar("pharmacist_id"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medication Administration Records (MAR)
export const medicationAdministrations = pgTable("medication_administrations", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id").references(() => prescriptions.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  actualTime: timestamp("actual_time"),
  doseGiven: varchar("dose_given", { length: 100 }),
  administeredBy: varchar("administered_by"),
  witnessedBy: varchar("witnessed_by"),
  status: varchar("status", { length: 50 }).default("scheduled").notNull(),
  holdReason: text("hold_reason"),
  refusedReason: text("refused_reason"),
  vitalSignsBefore: jsonb("vitals_before"),
  vitalSignsAfter: jsonb("vitals_after"),
  siteOfAdministration: varchar("site_of_administration", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vital Signs tracking
export const vitalSigns = pgTable("vital_signs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  recordedBy: varchar("recorded_by").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  temperatureUnit: varchar("temperature_unit", { length: 10 }).default("C"),
  heartRate: integer("heart_rate"),
  respiratoryRate: integer("respiratory_rate"),
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  oxygenSaturation: integer("oxygen_saturation"),
  painLevel: integer("pain_level"),
  bloodGlucose: decimal("blood_glucose", { precision: 5, scale: 1 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lab Results
export const labResults = pgTable("lab_results", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  orderedBy: varchar("ordered_by").notNull(),
  testName: varchar("test_name", { length: 200 }).notNull(),
  testCode: varchar("test_code", { length: 50 }),
  category: varchar("category", { length: 100 }),
  result: varchar("result", { length: 200 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  referenceRange: varchar("reference_range", { length: 100 }),
  interpretation: varchar("interpretation", { length: 50 }),
  collectedAt: timestamp("collected_at"),
  resultedAt: timestamp("resulted_at"),
  isCritical: boolean("is_critical").default(false),
  criticalNotifiedTo: varchar("critical_notified_to"),
  criticalNotifiedAt: timestamp("critical_notified_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medication Reminders
export const medicationReminders = pgTable("medication_reminders", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id").references(() => prescriptions.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  reminderType: varchar("reminder_type", { length: 50 }).notNull(),
  notifiedStaff: text("notified_staff").array(),
  notifiedAt: timestamp("notified_at"),
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Log for compliance
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Emergency Protocols
export const emergencyProtocols = pgTable("emergency_protocols", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 50 }).notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").notNull(),
  medications: jsonb("medications"),
  equipment: text("equipment").array(),
  contraindications: text("contraindications").array(),
  specialConsiderations: text("special_considerations"),
  referenceSource: varchar("reference_source", { length: 200 }),
  lastReviewedDate: date("last_reviewed_date"),
  reviewedBy: varchar("reviewed_by"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Offline Sync Queue
export const offlineSyncQueue = pgTable("offline_sync_queue", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  operation: varchar("operation", { length: 50 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }),
  data: jsonb("data").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  conflictResolution: text("conflict_resolution"),
  createdOfflineAt: timestamp("created_offline_at").notNull(),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Symptom Assessments for medication advisor
export const symptomAssessments = pgTable("symptom_assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  assessedBy: varchar("assessed_by"),
  symptoms: text("symptoms").array().notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  vitalSigns: jsonb("vital_signs"),
  allergies: text("allergies").array(),
  currentMedications: text("current_medications").array(),
  chronicConditions: text("chronic_conditions").array(),
  ageGroup: varchar("age_group", { length: 20 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  isPregnant: boolean("is_pregnant").default(false),
  recommendations: jsonb("recommendations"),
  warnings: text("warnings").array(),
  referralRequired: boolean("referral_required").default(false),
  referralReason: text("referral_reason"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinical Notes for doctor charts
export const clinicalNotes = pgTable("clinical_notes", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  authorId: varchar("author_id").notNull(),
  noteType: varchar("note_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }),
  content: text("content").notNull(),
  isSigned: boolean("is_signed").default(false),
  signedAt: timestamp("signed_at"),
  signedBy: varchar("signed_by"),
  isAddendum: boolean("is_addendum").default(false),
  parentNoteId: integer("parent_note_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Problem List for patient charts
export const problemList = pgTable("problem_list", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  icdCode: varchar("icd_code", { length: 20 }),
  description: varchar("description", { length: 500 }).notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  onsetDate: date("onset_date"),
  resolvedDate: date("resolved_date"),
  severity: varchar("severity", { length: 20 }),
  addedBy: varchar("added_by").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
  notes: text("notes"),
});

// Patient Portal Accounts
export const patientPortalAccounts = pgTable("patient_portal_accounts", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull().unique(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationToken: varchar("verification_token", { length: 255 }),
  lastLoginAt: timestamp("last_login_at"),
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret", { length: 100 }),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient Medication Tracking (for outpatient portal)
export const patientMedicationTracking = pgTable("patient_medication_tracking", {
  id: serial("id").primaryKey(),
  portalAccountId: integer("portal_account_id").references(() => patientPortalAccounts.id).notNull(),
  prescriptionId: integer("prescription_id").references(() => prescriptions.id),
  medicationName: varchar("medication_name", { length: 200 }).notNull(),
  dose: varchar("dose", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  takenAt: timestamp("taken_at"),
  skipped: boolean("skipped").default(false),
  skipReason: text("skip_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Secure Messages (patient-provider communication)
export const secureMessages = pgTable("secure_messages", {
  id: serial("id").primaryKey(),
  patientPortalId: integer("patient_portal_id").references(() => patientPortalAccounts.id).notNull(),
  providerId: varchar("provider_id"),
  subject: varchar("subject", { length: 200 }).notNull(),
  content: text("content").notNull(),
  senderType: varchar("sender_type", { length: 20 }).notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  parentMessageId: integer("parent_message_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const authUsersRelations = relations(authUsers, ({ many }) => ({
  patients: many(patients),
  prescriptions: many(prescriptions),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  prescriptions: many(prescriptions),
  vitalSigns: many(vitalSigns),
  labResults: many(labResults),
  medicationAdministrations: many(medicationAdministrations),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one, many }) => ({
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
  medication: one(medications, {
    fields: [prescriptions.medicationId],
    references: [medications.id],
  }),
  administrations: many(medicationAdministrations),
  reminders: many(medicationReminders),
}));

export const medicationAdministrationsRelations = relations(medicationAdministrations, ({ one }) => ({
  prescription: one(prescriptions, {
    fields: [medicationAdministrations.prescriptionId],
    references: [prescriptions.id],
  }),
  patient: one(patients, {
    fields: [medicationAdministrations.patientId],
    references: [patients.id],
  }),
}));

// Zod schemas for validation
export const insertAuthUserSchema = createInsertSchema(authUsers).omit({ createdAt: true, updatedAt: true });
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMedicationSchema = createInsertSchema(medications).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMedicationAdministrationSchema = createInsertSchema(medicationAdministrations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertVitalSignsSchema = createInsertSchema(vitalSigns).omit({ id: true, createdAt: true });
export const insertLabResultSchema = createInsertSchema(labResults).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertSymptomAssessmentSchema = createInsertSchema(symptomAssessments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertClinicalNoteSchema = createInsertSchema(clinicalNotes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProblemListSchema = createInsertSchema(problemList).omit({ id: true, addedAt: true });
export const insertPatientPortalAccountSchema = createInsertSchema(patientPortalAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPatientMedicationTrackingSchema = createInsertSchema(patientMedicationTracking).omit({ id: true, createdAt: true });
export const insertSecureMessageSchema = createInsertSchema(secureMessages).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof authUsers.$inferInsert;
export type User = typeof authUsers.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;
export type InsertMedicationAdministration = z.infer<typeof insertMedicationAdministrationSchema>;
export type MedicationAdministration = typeof medicationAdministrations.$inferSelect;
export type InsertVitalSigns = z.infer<typeof insertVitalSignsSchema>;
export type VitalSigns = typeof vitalSigns.$inferSelect;
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type LabResult = typeof labResults.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type EmergencyProtocol = typeof emergencyProtocols.$inferSelect;
export type MedicationReminder = typeof medicationReminders.$inferSelect;
export type InsertSymptomAssessment = z.infer<typeof insertSymptomAssessmentSchema>;
export type SymptomAssessment = typeof symptomAssessments.$inferSelect;
export type InsertClinicalNote = z.infer<typeof insertClinicalNoteSchema>;
export type ClinicalNote = typeof clinicalNotes.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemListSchema>;
export type Problem = typeof problemList.$inferSelect;
export type InsertPatientPortalAccount = z.infer<typeof insertPatientPortalAccountSchema>;
export type PatientPortalAccount = typeof patientPortalAccounts.$inferSelect;
export type InsertPatientMedicationTracking = z.infer<typeof insertPatientMedicationTrackingSchema>;
export type PatientMedicationTracking = typeof patientMedicationTracking.$inferSelect;
export type InsertSecureMessage = z.infer<typeof insertSecureMessageSchema>;
export type SecureMessage = typeof secureMessages.$inferSelect;

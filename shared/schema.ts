import { pgTable, text, serial, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  isStaff: boolean("is_staff").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const yearlyReports = pgTable("yearly_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  fileUrl: text("file_url").notNull(),
  description: text("description"),
  uploadedBy: serial("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
});

export const aboutUsContent = pgTable("about_us_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  lastUpdatedBy: serial("last_updated_by").references(() => users.id),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
  isPublished: boolean("is_published").default(false).notNull()
});

// User schema
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  isStaff: true
});

// Yearly Report schema
export const insertYearlyReportSchema = createInsertSchema(yearlyReports).pick({
  title: true,
  year: true,
  fileUrl: true, 
  description: true,
  uploadedBy: true
});

// About Us content schema
export const insertAboutUsSchema = createInsertSchema(aboutUsContent).pick({
  title: true,
  content: true,
  lastUpdatedBy: true,
  isPublished: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertYearlyReport = z.infer<typeof insertYearlyReportSchema>;
export type YearlyReport = typeof yearlyReports.$inferSelect;

export type InsertAboutUs = z.infer<typeof insertAboutUsSchema>;
export type AboutUs = typeof aboutUsContent.$inferSelect;

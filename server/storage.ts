import { users, yearlyReports, aboutUsContent, type User, type InsertUser, type YearlyReport, type InsertYearlyReport, type AboutUs, type InsertAboutUs } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Report operations
  getYearlyReports(): Promise<YearlyReport[]>;
  getYearlyReportById(id: number): Promise<YearlyReport | undefined>;
  createYearlyReport(report: InsertYearlyReport): Promise<YearlyReport>;
  
  // About us operations
  getAboutUsContent(): Promise<AboutUs[]>;
  getPublishedAboutUsContent(): Promise<AboutUs[]>;
  getAboutUsById(id: number): Promise<AboutUs | undefined>;
  createAboutUs(content: InsertAboutUs): Promise<AboutUs>;
  updateAboutUs(id: number, content: Partial<InsertAboutUs>): Promise<AboutUs | undefined>;
  
  // Session store for auth
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Yearly Report methods
  async getYearlyReports(): Promise<YearlyReport[]> {
    return await db.select().from(yearlyReports).orderBy(yearlyReports.year);
  }
  
  async getYearlyReportById(id: number): Promise<YearlyReport | undefined> {
    const [report] = await db.select().from(yearlyReports).where(eq(yearlyReports.id, id));
    return report || undefined;
  }
  
  async createYearlyReport(report: InsertYearlyReport): Promise<YearlyReport> {
    const [newReport] = await db
      .insert(yearlyReports)
      .values(report)
      .returning();
    return newReport;
  }
  
  // About Us methods
  async getAboutUsContent(): Promise<AboutUs[]> {
    return await db.select().from(aboutUsContent);
  }
  
  async getPublishedAboutUsContent(): Promise<AboutUs[]> {
    return await db.select().from(aboutUsContent).where(eq(aboutUsContent.isPublished, true));
  }
  
  async getAboutUsById(id: number): Promise<AboutUs | undefined> {
    const [content] = await db.select().from(aboutUsContent).where(eq(aboutUsContent.id, id));
    return content || undefined;
  }
  
  async createAboutUs(content: InsertAboutUs): Promise<AboutUs> {
    const [newContent] = await db
      .insert(aboutUsContent)
      .values(content)
      .returning();
    return newContent;
  }
  
  async updateAboutUs(id: number, content: Partial<InsertAboutUs>): Promise<AboutUs | undefined> {
    const [updatedContent] = await db
      .update(aboutUsContent)
      .set({
        ...content,
        lastUpdatedAt: new Date()
      })
      .where(eq(aboutUsContent.id, id))
      .returning();
    return updatedContent || undefined;
  }
}

export const storage = new DatabaseStorage();

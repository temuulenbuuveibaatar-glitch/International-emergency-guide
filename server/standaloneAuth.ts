import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { storage } from "./storage";

declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: string;
    userEmail: string;
    userName: string;
    isPatient: boolean;
    patientId?: number;
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'hospital-management-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

export async function setupStandaloneAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Get current user session
  app.get("/api/auth/user", (req, res) => {
    if (req.session.userId) {
      res.json({
        id: req.session.userId,
        email: req.session.userEmail,
        firstName: req.session.userName,
        role: req.session.userRole,
        isPatient: req.session.isPatient,
        patientId: req.session.patientId,
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Staff login (doctors, nurses, directors)
  app.post("/api/auth/login/staff", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isActive) {
        return res.status(403).json({ 
          message: "Your account is pending verification. Please wait for approval." 
        });
      }

      // Set session data
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userEmail = user.email || '';
      req.session.userName = user.firstName || '';
      req.session.isPatient = false;

      // Update last login
      await storage.upsertUser({
        ...user,
        lastLoginAt: new Date(),
      });

      // Log the login
      await storage.createAuditLog({
        userId: user.id,
        action: 'staff_login',
        entityType: 'auth_user',
        entityId: user.id,
        details: {
          email,
          role: user.role,
          loginAt: new Date().toISOString(),
        }
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
        }
      });
    } catch (error) {
      console.error("Error during staff login:", error);
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  });

  // Patient login
  app.post("/api/auth/login/patient", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const portalAccount = await storage.getPatientPortalAccountByEmail(email);
      
      if (!portalAccount) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!portalAccount.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, portalAccount.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const patient = await storage.getPatient(portalAccount.patientId);
      if (!patient) {
        return res.status(500).json({ message: "Patient record not found" });
      }

      // Set session data
      req.session.userId = `patient_${portalAccount.id}`;
      req.session.userRole = 'patient';
      req.session.userEmail = portalAccount.email;
      req.session.userName = patient.firstName;
      req.session.isPatient = true;
      req.session.patientId = patient.id;

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
          loginAt: new Date().toISOString(),
        }
      });

      res.json({
        success: true,
        user: {
          id: `patient_${portalAccount.id}`,
          email: portalAccount.email,
          firstName: patient.firstName,
          lastName: patient.lastName,
          role: 'patient',
          patientId: patient.id,
          mrn: patient.mrn,
        }
      });
    } catch (error) {
      console.error("Error during patient login:", error);
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    const userId = req.session.userId;
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // Legacy logout route for compatibility
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized - Please log in" });
};

export const requireRole = (...allowedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userRole = req.session.userRole;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    // Add user info to request for downstream use
    (req as any).user = {
      claims: {
        sub: req.session.userId,
      },
      role: userRole,
      email: req.session.userEmail,
    };
    
    next();
  };
};

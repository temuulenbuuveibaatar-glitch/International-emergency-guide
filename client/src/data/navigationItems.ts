// We'll define icons that will be imported in the Navigation component
export const navigationItems = [
  { path: "/", key: "home", icon: "Home" },
  { path: "/emergency", key: "emergency", icon: "AlertTriangle" },
  { path: "/treatment", key: "treatment", icon: "Stethoscope" },
  { path: "/medications", key: "medications", icon: "Pill" },
  { path: "/symptoms", key: "symptoms", icon: "ActivitySquare" },
  { path: "/hospitals", key: "hospitals", icon: "Building2" },
  { path: "/contacts", key: "contacts", icon: "Phone" },
  { path: "/fire-safety", key: "fireSafety", icon: "Flame" },
  { path: "/damage-assessment", key: "damageAssessment", icon: "Camera" },
  { path: "/medical-imaging", key: "medicalImaging", icon: "FileImage" }
];

// Internal/admin navigation items (not shown to public users)
export const adminNavigationItems = [
  { path: "/maintenance", key: "maintenance", icon: "Wrench" }
];

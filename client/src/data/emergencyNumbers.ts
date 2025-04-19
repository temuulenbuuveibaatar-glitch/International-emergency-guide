import { Phone, HeartPulse, Flame, Building, AlertCircle, RotateCw } from "lucide-react";

// Define icon types for type safety
export type IconType = "phone" | "ambulance" | "fire" | "police" | "emergency" | "redcross";

// Mongolia emergency numbers with appropriate icons
export const mongoliaEmergencyNumbers = [
  {
    id: "mn1",
    type: "ambulance",
    number: "103",
    icon: "ambulance" // Reference icon by string identifier
  },
  {
    id: "mn2",
    type: "fire",
    number: "101",
    icon: "fire"
  },
  {
    id: "mn3",
    type: "police",
    number: "102",
    icon: "police"
  },
  {
    id: "mn4",
    type: "emergency",
    number: "105",
    icon: "emergency"
  },
  {
    id: "mn5",
    type: "redcross",
    number: "7035-1221",
    icon: "redcross"
  }
];

// Function to get icon component based on type
export const getIconComponent = (iconType: IconType | string) => {
  switch (iconType) {
    case "ambulance":
      return HeartPulse;
    case "fire":
      return Flame;
    case "police":
      return Building;
    case "emergency":
      return AlertCircle;
    case "redcross":
      return RotateCw;
    case "phone":
    default:
      return Phone;
  }
};

// Predefined emergency numbers for other countries
export const countryEmergencyNumbers: Record<string, any[]> = {
  kr: [
    { id: "kr1", type: "ambulance", number: "119", icon: "ambulance" },
    { id: "kr2", type: "police", number: "112", icon: "police" },
    { id: "kr3", type: "emergency", number: "119", icon: "emergency" }
  ],
  de: [
    { id: "de1", type: "ambulance", number: "112", icon: "ambulance" },
    { id: "de2", type: "police", number: "110", icon: "police" },
    { id: "de3", type: "emergency", number: "112", icon: "emergency" }
  ],
  cn: [
    { id: "cn1", type: "ambulance", number: "120", icon: "ambulance" },
    { id: "cn2", type: "police", number: "110", icon: "police" },
    { id: "cn3", type: "fire", number: "119", icon: "fire" }
  ],
  jp: [
    { id: "jp1", type: "ambulance", number: "119", icon: "ambulance" },
    { id: "jp2", type: "police", number: "110", icon: "police" }
  ],
  es: [
    { id: "es1", type: "emergency", number: "112", icon: "emergency" },
    { id: "es2", type: "police", number: "091", icon: "police" }
  ],
  us: [
    { id: "us1", type: "emergency", number: "911", icon: "emergency" }
  ],
  uk: [
    { id: "uk1", type: "emergency", number: "999", icon: "emergency" },
    { id: "uk2", type: "nonEmergency", number: "111", icon: "phone" }
  ],
  ru: [
    { id: "ru1", type: "emergency", number: "112", icon: "emergency" },
    { id: "ru2", type: "ambulance", number: "103", icon: "ambulance" },
    { id: "ru3", type: "police", number: "102", icon: "police" },
    { id: "ru4", type: "fire", number: "101", icon: "fire" }
  ]
};

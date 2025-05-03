import { Phone, HeartPulse, Flame, Building, AlertCircle, RotateCw, HelpCircle, PlusCircle, Factory, Shield } from "lucide-react";

// Define icon types for type safety
export type IconType = "phone" | "ambulance" | "fire" | "police" | "emergency" | "redcross" | "hospital" | "rescue" | "gas" | "children";

// Mongolia emergency numbers with appropriate icons
export const mongoliaEmergencyNumbers = [
  {
    id: "mn1",
    type: "ambulance",
    number: "103",
    icon: "ambulance", // Reference icon by string identifier
    description: "National Ambulance Service",
    available: "24/7"
  },

  {
    id: "mn2",
    type: "fire",
    number: "101",
    icon: "fire",
    description: "Fire Department",
    available: "24/7"
  },
  {
    id: "mn3",
    type: "police",
    number: "102",
    icon: "police",
    description: "Police Department",
    available: "24/7"
  },
  {
    id: "mn4",
    type: "emergency",
    number: "105",
    icon: "emergency",
    description: "General Emergency Services",
    available: "24/7"
  },
  {
    id: "mn5",
    type: "redcross",
    number: "7035-1221",
    icon: "redcross",
    description: "Orkhon Province Red Cross HQ",
    available: "Mon-Fri 9:00-18:00"
  },
  {
    id: "mn6",
    type: "hospital",
    number: "7035-4444",
    icon: "hospital",
    description: "Orkhon Provincial Hospital",
    available: "24/7"
  },
  {
    id: "mn7",
    type: "rescue",
    number: "108",
    icon: "rescue",
    description: "Search and Rescue Service",
    available: "24/7"
  },
  {
    id: "mn8",
    type: "gas",
    number: "104",
    icon: "gas",
    description: "Gas Emergency Service",
    available: "24/7"
  },
  {
    id: "mn9",
    type: "children",
    number: "108",
    icon: "children",
    description: "Child Protection Service",
    available: "24/7"
  },
  {
    id: "mn10",
    type: "redcross",
    number: "7035-3388",
    icon: "redcross",
    description: "Red Cross Volunteer Coordinator (Orkhon)",
    available: "Mon-Fri 9:00-17:00"
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
    case "hospital":
      return PlusCircle;
    case "rescue":
      return HelpCircle;
    case "gas":
      return Factory;
    case "children":
      return Shield;
    case "phone":
    default:
      return Phone;
  }
};

// Predefined emergency numbers for other countries
export const countryEmergencyNumbers: Record<string, any[]> = {
  // South Korea
  kr: [
    { id: "kr1", type: "ambulance", number: "119", icon: "ambulance", description: "Fire and Ambulance Service", available: "24/7" },
    { id: "kr2", type: "police", number: "112", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "kr3", type: "emergency", number: "119", icon: "emergency", description: "General Emergency", available: "24/7" },
    { id: "kr4", type: "gas", number: "1544-4500", icon: "gas", description: "Korea Gas Safety Corporation", available: "24/7" },
    { id: "kr5", type: "redcross", number: "02-3705-3705", icon: "redcross", description: "Korean Red Cross", available: "Mon-Fri 9:00-18:00" },
    { id: "kr6", type: "children", number: "1391", icon: "children", description: "Child Protection Hotline", available: "24/7" },
    { id: "kr7", type: "rescue", number: "122", icon: "rescue", description: "Maritime Police (Coast Guard)", available: "24/7" },
    { id: "kr8", type: "hospital", number: "1339", icon: "hospital", description: "Emergency Medical Information Center", available: "24/7" },
    { id: "kr9", type: "emergency", number: "129", icon: "emergency", description: "First Aid Advice & Health Consultation", available: "24/7" }
  ],

  // Germany
  de: [
    { id: "de1", type: "ambulance", number: "112", icon: "ambulance", description: "Ambulance and Fire Service", available: "24/7" },
    { id: "de2", type: "police", number: "110", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "de3", type: "emergency", number: "112", icon: "emergency", description: "European Emergency Number", available: "24/7" },
    { id: "de4", type: "gas", number: "0800-0800-694", icon: "gas", description: "Gas Emergency Service", available: "24/7" },
    { id: "de5", type: "redcross", number: "0800-1414-350", icon: "redcross", description: "German Red Cross", available: "Mon-Fri 8:00-17:00" },
    { id: "de6", type: "children", number: "0800-111-0333", icon: "children", description: "Child Protection Hotline", available: "24/7" },
    { id: "de7", type: "hospital", number: "116-117", icon: "hospital", description: "Medical On-Call Service", available: "After hours" },
    { id: "de8", type: "rescue", number: "19222", icon: "rescue", description: "Non-emergency Ambulance Transport", available: "24/7" },
    { id: "de9", type: "police", number: "115", icon: "police", description: "Federal & Municipal Information", available: "Mon-Fri 8:00-18:00" }
  ],

  // China
  cn: [
    { id: "cn1", type: "ambulance", number: "120", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "cn2", type: "police", number: "110", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "cn3", type: "fire", number: "119", icon: "fire", description: "Fire Emergency", available: "24/7" },
    { id: "cn4", type: "rescue", number: "122", icon: "rescue", description: "Traffic Police", available: "24/7" },
    { id: "cn5", type: "emergency", number: "112", icon: "emergency", description: "General Emergency (redirects)", available: "24/7" },
    { id: "cn6", type: "gas", number: "96119", icon: "gas", description: "Gas Emergency", available: "24/7" },
    { id: "cn7", type: "children", number: "12355", icon: "children", description: "Youth Services Hotline", available: "24/7" },
    { id: "cn8", type: "hospital", number: "999", icon: "hospital", description: "Private Ambulance Service (Beijing)", available: "24/7" },
    { id: "cn9", type: "emergency", number: "95119", icon: "emergency", description: "Disaster & Emergency Rescue", available: "24/7" }
  ],

  // Japan
  jp: [
    { id: "jp1", type: "ambulance", number: "119", icon: "ambulance", description: "Fire and Ambulance", available: "24/7" },
    { id: "jp2", type: "police", number: "110", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "jp3", type: "emergency", number: "118", icon: "emergency", description: "Maritime Emergency", available: "24/7" },
    { id: "jp4", type: "rescue", number: "0120-279-338", icon: "rescue", description: "Japan Coast Guard", available: "24/7" },
    { id: "jp5", type: "hospital", number: "#7119", icon: "hospital", description: "Emergency Medical Consultation (Tokyo)", available: "24/7" },
    { id: "jp6", type: "redcross", number: "03-3438-1311", icon: "redcross", description: "Japanese Red Cross Society", available: "Mon-Fri 9:00-17:00" },
    { id: "jp7", type: "children", number: "189", icon: "children", description: "Child Consultation Center", available: "24/7" },
    { id: "jp8", type: "gas", number: "0570-002-299", icon: "gas", description: "Gas Leak Emergency (Tokyo Gas)", available: "24/7" },
    { id: "jp9", type: "emergency", number: "03-3501-0110", icon: "emergency", description: "Tourist Information Center (Tokyo)", available: "9:00-17:00" }
  ],

  // Spain
  es: [
    { id: "es1", type: "emergency", number: "112", icon: "emergency", description: "European Emergency Number", available: "24/7" },
    { id: "es2", type: "police", number: "091", icon: "police", description: "National Police", available: "24/7" },
    { id: "es3", type: "police", number: "062", icon: "police", description: "Civil Guard", available: "24/7" },
    { id: "es4", type: "ambulance", number: "061", icon: "ambulance", description: "Health Emergency", available: "24/7" },
    { id: "es5", type: "fire", number: "080", icon: "fire", description: "Fire Brigade", available: "24/7" },
    { id: "es6", type: "redcross", number: "902-222-292", icon: "redcross", description: "Spanish Red Cross", available: "24/7" },
    { id: "es7", type: "children", number: "900-202-010", icon: "children", description: "Child Protection", available: "24/7" },
    { id: "es8", type: "gas", number: "900-750-750", icon: "gas", description: "Gas Emergency (Naturgy)", available: "24/7" },
    { id: "es9", type: "emergency", number: "016", icon: "emergency", description: "Gender Violence Helpline", available: "24/7" }
  ],

  // United States
  us: [
    { id: "us1", type: "emergency", number: "911", icon: "emergency", description: "General Emergency (Police, Fire, Ambulance)", available: "24/7" },
    { id: "us2", type: "redcross", number: "1-800-733-2767", icon: "redcross", description: "American Red Cross", available: "24/7" },
    { id: "us3", type: "poison", number: "1-800-222-1222", icon: "emergency", description: "Poison Control Center", available: "24/7" },
    { id: "us4", type: "children", number: "1-800-422-4453", icon: "children", description: "Child Abuse Hotline", available: "24/7" },
    { id: "us5", type: "gas", number: "811", icon: "gas", description: "Call Before You Dig", available: "24/7" },
    { id: "us6", type: "rescue", number: "1-800-273-8255", icon: "rescue", description: "National Suicide Prevention Lifeline", available: "24/7" },
    { id: "us7", type: "ambulance", number: "911", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "us8", type: "police", number: "911", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "us9", type: "fire", number: "911", icon: "fire", description: "Fire Emergency", available: "24/7" }
  ],

  // United Kingdom
  uk: [
    { id: "uk1", type: "emergency", number: "999", icon: "emergency", description: "General Emergency (Police, Fire, Ambulance)", available: "24/7" },
    { id: "uk2", type: "nonEmergency", number: "111", icon: "phone", description: "NHS Non-Emergency", available: "24/7" },
    { id: "uk3", type: "police", number: "101", icon: "police", description: "Police Non-Emergency", available: "24/7" },
    { id: "uk4", type: "gas", number: "0800-111-999", icon: "gas", description: "Gas Emergency", available: "24/7" },
    { id: "uk5", type: "redcross", number: "0344-871-1111", icon: "redcross", description: "British Red Cross", available: "Mon-Fri 9:00-17:00" },
    { id: "uk6", type: "children", number: "0800-1111", icon: "children", description: "Childline", available: "24/7" },
    { id: "uk7", type: "rescue", number: "0300-123-1110", icon: "rescue", description: "Samaritans", available: "24/7" },
    { id: "uk8", type: "ambulance", number: "999", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "uk9", type: "police", number: "999", icon: "police", description: "Police Emergency", available: "24/7" }
  ],

  // Russia
  ru: [
    { id: "ru1", type: "emergency", number: "112", icon: "emergency", description: "General Emergency", available: "24/7" },
    { id: "ru2", type: "ambulance", number: "103", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "ru3", type: "police", number: "102", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "ru4", type: "fire", number: "101", icon: "fire", description: "Fire Emergency", available: "24/7" },
    { id: "ru5", type: "gas", number: "104", icon: "gas", description: "Gas Emergency", available: "24/7" },
    { id: "ru6", type: "redcross", number: "+7-495-126-75-71", icon: "redcross", description: "Russian Red Cross Society", available: "Mon-Fri 9:00-18:00" },
    { id: "ru7", type: "children", number: "8-800-2000-122", icon: "children", description: "Children's Support Service", available: "24/7" },
    { id: "ru8", type: "rescue", number: "8-495-637-22-22", icon: "rescue", description: "Ministry of Emergency Situations", available: "24/7" },
    { id: "ru9", type: "hospital", number: "+7-495-627-24-00", icon: "hospital", description: "Ministry of Health Hotline", available: "Mon-Fri 9:00-18:00" }
  ]
};

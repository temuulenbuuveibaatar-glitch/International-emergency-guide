import { Phone, HeartPulse, Flame, Building, AlertCircle, HelpCircle, PlusCircle, Factory, Shield } from "lucide-react";

export type IconType = "phone" | "ambulance" | "fire" | "police" | "emergency" | "hospital" | "rescue" | "gas" | "children";

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

export const countryEmergencyNumbers: Record<string, any[]> = {
  kr: [
    { id: "kr1", type: "ambulance", number: "119", icon: "ambulance", description: "Fire and Ambulance Service", available: "24/7" },
    { id: "kr2", type: "police", number: "112", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "kr3", type: "emergency", number: "119", icon: "emergency", description: "General Emergency", available: "24/7" },
    { id: "kr4", type: "gas", number: "1544-4500", icon: "gas", description: "Korea Gas Safety Corporation", available: "24/7" },
    { id: "kr6", type: "children", number: "1391", icon: "children", description: "Child Protection Hotline", available: "24/7" },
    { id: "kr7", type: "rescue", number: "122", icon: "rescue", description: "Maritime Police (Coast Guard)", available: "24/7" },
    { id: "kr8", type: "hospital", number: "1339", icon: "hospital", description: "Emergency Medical Information Center", available: "24/7" },
    { id: "kr9", type: "emergency", number: "129", icon: "emergency", description: "First Aid Advice & Health Consultation", available: "24/7" }
  ],

  de: [
    { id: "de1", type: "ambulance", number: "112", icon: "ambulance", description: "Ambulance and Fire Service", available: "24/7" },
    { id: "de2", type: "police", number: "110", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "de3", type: "emergency", number: "112", icon: "emergency", description: "European Emergency Number", available: "24/7" },
    { id: "de4", type: "gas", number: "0800-0800-694", icon: "gas", description: "Gas Emergency Service", available: "24/7" },
    { id: "de6", type: "children", number: "0800-111-0333", icon: "children", description: "Child Protection Hotline", available: "24/7" },
    { id: "de7", type: "hospital", number: "116-117", icon: "hospital", description: "Medical On-Call Service", available: "After hours" },
    { id: "de8", type: "rescue", number: "19222", icon: "rescue", description: "Non-emergency Ambulance Transport", available: "24/7" },
    { id: "de9", type: "police", number: "115", icon: "police", description: "Federal & Municipal Information", available: "Mon-Fri 8:00-18:00" }
  ],

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

  jp: [
    { id: "jp1", type: "ambulance", number: "119", icon: "ambulance", description: "Fire and Ambulance", available: "24/7" },
    { id: "jp2", type: "police", number: "110", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "jp3", type: "emergency", number: "118", icon: "emergency", description: "Maritime Emergency", available: "24/7" },
    { id: "jp4", type: "rescue", number: "0120-279-338", icon: "rescue", description: "Japan Coast Guard", available: "24/7" },
    { id: "jp5", type: "hospital", number: "#7119", icon: "hospital", description: "Emergency Medical Consultation (Tokyo)", available: "24/7" },
    { id: "jp7", type: "children", number: "189", icon: "children", description: "Child Consultation Center", available: "24/7" },
    { id: "jp8", type: "gas", number: "0570-002-299", icon: "gas", description: "Gas Leak Emergency (Tokyo Gas)", available: "24/7" },
    { id: "jp9", type: "emergency", number: "03-3501-0110", icon: "emergency", description: "Tourist Information Center (Tokyo)", available: "9:00-17:00" }
  ],

  es: [
    { id: "es1", type: "emergency", number: "112", icon: "emergency", description: "European Emergency Number", available: "24/7" },
    { id: "es2", type: "police", number: "091", icon: "police", description: "National Police", available: "24/7" },
    { id: "es3", type: "police", number: "062", icon: "police", description: "Civil Guard", available: "24/7" },
    { id: "es4", type: "ambulance", number: "061", icon: "ambulance", description: "Health Emergency", available: "24/7" },
    { id: "es5", type: "fire", number: "080", icon: "fire", description: "Fire Brigade", available: "24/7" },
    { id: "es7", type: "children", number: "900-202-010", icon: "children", description: "Child Protection", available: "24/7" },
    { id: "es8", type: "gas", number: "900-750-750", icon: "gas", description: "Gas Emergency (Naturgy)", available: "24/7" },
    { id: "es9", type: "emergency", number: "016", icon: "emergency", description: "Gender Violence Helpline", available: "24/7" }
  ],

  us: [
    { id: "us1", type: "emergency", number: "911", icon: "emergency", description: "General Emergency (Police, Fire, Ambulance)", available: "24/7" },
    { id: "us3", type: "poison", number: "1-800-222-1222", icon: "emergency", description: "Poison Control Center", available: "24/7" },
    { id: "us4", type: "children", number: "1-800-422-4453", icon: "children", description: "Child Abuse Hotline", available: "24/7" },
    { id: "us5", type: "gas", number: "811", icon: "gas", description: "Call Before You Dig", available: "24/7" },
    { id: "us6", type: "rescue", number: "1-800-273-8255", icon: "rescue", description: "National Suicide Prevention Lifeline", available: "24/7" },
    { id: "us7", type: "ambulance", number: "911", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "us8", type: "police", number: "911", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "us9", type: "fire", number: "911", icon: "fire", description: "Fire Emergency", available: "24/7" }
  ],

  uk: [
    { id: "uk1", type: "emergency", number: "999", icon: "emergency", description: "General Emergency (Police, Fire, Ambulance)", available: "24/7" },
    { id: "uk2", type: "nonEmergency", number: "111", icon: "phone", description: "NHS Non-Emergency", available: "24/7" },
    { id: "uk3", type: "police", number: "101", icon: "police", description: "Police Non-Emergency", available: "24/7" },
    { id: "uk4", type: "gas", number: "0800-111-999", icon: "gas", description: "Gas Emergency", available: "24/7" },
    { id: "uk6", type: "children", number: "0800-1111", icon: "children", description: "Childline", available: "24/7" },
    { id: "uk7", type: "rescue", number: "0300-123-1110", icon: "rescue", description: "Samaritans", available: "24/7" },
    { id: "uk8", type: "ambulance", number: "999", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "uk9", type: "police", number: "999", icon: "police", description: "Police Emergency", available: "24/7" }
  ],

  ru: [
    { id: "ru1", type: "emergency", number: "112", icon: "emergency", description: "General Emergency", available: "24/7" },
    { id: "ru2", type: "ambulance", number: "103", icon: "ambulance", description: "Ambulance Emergency", available: "24/7" },
    { id: "ru3", type: "police", number: "102", icon: "police", description: "Police Emergency", available: "24/7" },
    { id: "ru4", type: "fire", number: "101", icon: "fire", description: "Fire Emergency", available: "24/7" },
    { id: "ru5", type: "gas", number: "104", icon: "gas", description: "Gas Emergency", available: "24/7" },
    { id: "ru7", type: "children", number: "8-800-2000-122", icon: "children", description: "Children's Support Service", available: "24/7" },
    { id: "ru8", type: "rescue", number: "8-495-637-22-22", icon: "rescue", description: "Ministry of Emergency Situations", available: "24/7" },
    { id: "ru9", type: "hospital", number: "+7-495-627-24-00", icon: "hospital", description: "Ministry of Health Hotline", available: "Mon-Fri 9:00-18:00" }
  ]
};

// Enhanced Hospital Database - Updated 2025
// Comprehensive hospital information with accurate locations and services

export interface EnhancedHospital {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    emergency: string;
    fax?: string;
    email?: string;
    website?: string;
  };
  services: {
    emergency: boolean;
    trauma: boolean;
    pediatrics: boolean;
    cardiology: boolean;
    neurology: boolean;
    oncology: boolean;
    maternity: boolean;
    surgery: boolean;
    icu: boolean;
    dialysis: boolean;
    mentalHealth: boolean;
    rehabilitation: boolean;
  };
  specialties: string[];
  capacity: {
    totalBeds: number;
    icuBeds: number;
    emergencyBeds: number;
  };
  certifications: string[];
  operatingHours: {
    emergency: string;
    outpatient: string;
    visiting: string;
  };
  languagesSpoken: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    parkingAvailable: boolean;
    publicTransport: boolean;
  };
  insurance: string[];
  rating: number;
  lastUpdated: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  distanceFromUser?: number;
}

export const enhancedHospitalDatabase: EnhancedHospital[] = [
  // Mongolia Hospitals
  {
    id: "mn-001",
    name: "National Center for Maternal and Child Health",
    address: "Peace Avenue 29, Ulaanbaatar 14210",
    city: "Ulaanbaatar",
    country: "Mongolia",
    coordinates: {
      lat: 47.9184,
      lng: 106.9177
    },
    contact: {
      phone: "+976 11 458801",
      emergency: "+976 11 458802",
      email: "info@ncmch.gov.mn",
      website: "https://ncmch.gov.mn"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: true,
      cardiology: true,
      neurology: false,
      oncology: false,
      maternity: true,
      surgery: true,
      icu: true,
      dialysis: false,
      mentalHealth: false,
      rehabilitation: true
    },
    specialties: ["Maternal Health", "Pediatrics", "Neonatology", "Obstetrics", "Gynecology"],
    capacity: {
      totalBeds: 350,
      icuBeds: 25,
      emergencyBeds: 40
    },
    certifications: ["WHO Baby-Friendly Hospital", "Joint Commission International"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "08:00-18:00",
      visiting: "10:00-12:00, 14:00-17:00"
    },
    languagesSpoken: ["Mongolian", "English", "Russian"],
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    insurance: ["State Insurance", "Private Insurance", "International Insurance"],
    rating: 4.2,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  },
  {
    id: "mn-002",
    name: "State Central Hospital",
    address: "Peace Avenue 15, Ulaanbaatar 14210",
    city: "Ulaanbaatar",
    country: "Mongolia",
    coordinates: {
      lat: 47.9207,
      lng: 106.9068
    },
    contact: {
      phone: "+976 11 322288",
      emergency: "+976 11 322289",
      email: "info@sch.mn"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: true,
      cardiology: true,
      neurology: true,
      oncology: true,
      maternity: true,
      surgery: true,
      icu: true,
      dialysis: true,
      mentalHealth: true,
      rehabilitation: true
    },
    specialties: ["General Medicine", "Emergency Medicine", "Surgery", "Internal Medicine"],
    capacity: {
      totalBeds: 500,
      icuBeds: 40,
      emergencyBeds: 60
    },
    certifications: ["Ministry of Health Accredited"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "07:00-19:00",
      visiting: "09:00-11:00, 15:00-18:00"
    },
    languagesSpoken: ["Mongolian", "English"],
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    insurance: ["State Insurance", "Private Insurance"],
    rating: 4.0,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  },
  {
    id: "mn-003",
    name: "Intermed Hospital",
    address: "Seoul Street 23, Ulaanbaatar 14240",
    city: "Ulaanbaatar",
    country: "Mongolia",
    coordinates: {
      lat: 47.9089,
      lng: 106.8832
    },
    contact: {
      phone: "+976 11 314455",
      emergency: "+976 11 314456",
      email: "info@intermed.mn",
      website: "https://intermed.mn"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: true,
      cardiology: true,
      neurology: true,
      oncology: false,
      maternity: true,
      surgery: true,
      icu: true,
      dialysis: true,
      mentalHealth: false,
      rehabilitation: true
    },
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Emergency Medicine"],
    capacity: {
      totalBeds: 200,
      icuBeds: 20,
      emergencyBeds: 30
    },
    certifications: ["Joint Commission International", "ISO 9001:2015"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "08:00-20:00",
      visiting: "10:00-12:00, 16:00-19:00"
    },
    languagesSpoken: ["Mongolian", "English", "Korean", "Japanese"],
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    insurance: ["Private Insurance", "International Insurance"],
    rating: 4.5,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  },
  {
    id: "mn-004",
    name: "Erdenet General Hospital",
    address: "Sukhbaatar Street 15, Erdenet 81000",
    city: "Erdenet",
    country: "Mongolia",
    coordinates: {
      lat: 49.0347,
      lng: 104.0761
    },
    contact: {
      phone: "+976 1352 4455",
      emergency: "+976 1352 4456"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: true,
      cardiology: false,
      neurology: false,
      oncology: false,
      maternity: true,
      surgery: true,
      icu: true,
      dialysis: false,
      mentalHealth: false,
      rehabilitation: false
    },
    specialties: ["General Medicine", "Emergency Medicine", "Surgery"],
    capacity: {
      totalBeds: 150,
      icuBeds: 10,
      emergencyBeds: 20
    },
    certifications: ["Ministry of Health Accredited"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "08:00-17:00",
      visiting: "10:00-12:00, 15:00-17:00"
    },
    languagesSpoken: ["Mongolian", "Russian"],
    accessibility: {
      wheelchairAccessible: false,
      parkingAvailable: true,
      publicTransport: true
    },
    insurance: ["State Insurance"],
    rating: 3.8,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  },
  {
    id: "mn-005",
    name: "Darkhan General Hospital",
    address: "Central Street 8, Darkhan 81500",
    city: "Darkhan",
    country: "Mongolia",
    coordinates: {
      lat: 49.4864,
      lng: 105.9622
    },
    contact: {
      phone: "+976 1372 3344",
      emergency: "+976 1372 3345"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: true,
      cardiology: false,
      neurology: false,
      oncology: false,
      maternity: true,
      surgery: true,
      icu: false,
      dialysis: false,
      mentalHealth: false,
      rehabilitation: false
    },
    specialties: ["General Medicine", "Emergency Medicine"],
    capacity: {
      totalBeds: 100,
      icuBeds: 5,
      emergencyBeds: 15
    },
    certifications: ["Ministry of Health Accredited"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "08:00-17:00",
      visiting: "10:00-12:00, 15:00-17:00"
    },
    languagesSpoken: ["Mongolian"],
    accessibility: {
      wheelchairAccessible: false,
      parkingAvailable: true,
      publicTransport: false
    },
    insurance: ["State Insurance"],
    rating: 3.5,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  },

  // International Hospitals for Reference
  {
    id: "us-001",
    name: "Johns Hopkins Hospital",
    address: "1800 Orleans St, Baltimore, MD 21287",
    city: "Baltimore",
    country: "United States",
    coordinates: {
      lat: 39.2970,
      lng: -76.5929
    },
    contact: {
      phone: "+1 410-955-5000",
      emergency: "+1 410-955-6070",
      website: "https://hopkinsmedicine.org"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: true,
      cardiology: true,
      neurology: true,
      oncology: true,
      maternity: true,
      surgery: true,
      icu: true,
      dialysis: true,
      mentalHealth: true,
      rehabilitation: true
    },
    specialties: ["Neurology", "Neurosurgery", "Cardiology", "Oncology", "Transplant"],
    capacity: {
      totalBeds: 1154,
      icuBeds: 185,
      emergencyBeds: 90
    },
    certifications: ["Joint Commission", "Magnet Recognition", "DNV GL"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "06:00-22:00",
      visiting: "Varies by unit"
    },
    languagesSpoken: ["English", "Spanish", "Korean", "Arabic"],
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    insurance: ["Medicare", "Medicaid", "Most Private Insurance"],
    rating: 4.8,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  },
  {
    id: "uk-001",
    name: "St Bartholomew's Hospital",
    address: "West Smithfield, London EC1A 7BE",
    city: "London",
    country: "United Kingdom",
    coordinates: {
      lat: 51.5170,
      lng: -0.1007
    },
    contact: {
      phone: "+44 20 3465 5000",
      emergency: "+44 20 3465 6000",
      website: "https://bartshealth.nhs.uk"
    },
    services: {
      emergency: true,
      trauma: true,
      pediatrics: false,
      cardiology: true,
      neurology: true,
      oncology: true,
      maternity: false,
      surgery: true,
      icu: true,
      dialysis: true,
      mentalHealth: false,
      rehabilitation: true
    },
    specialties: ["Cardiac Surgery", "Trauma", "Emergency Medicine", "Oncology"],
    capacity: {
      totalBeds: 388,
      icuBeds: 45,
      emergencyBeds: 50
    },
    certifications: ["CQC Outstanding", "NHS Foundation Trust"],
    operatingHours: {
      emergency: "24/7",
      outpatient: "08:00-18:00",
      visiting: "15:00-20:00"
    },
    languagesSpoken: ["English", "Various interpreter services"],
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: false,
      publicTransport: true
    },
    insurance: ["NHS", "Private Insurance"],
    rating: 4.6,
    lastUpdated: "2025-01-01",
    verificationStatus: "verified"
  }
];

// Hospital search and filtering functions
export const searchHospitalsByLocation = (
  lat: number, 
  lng: number, 
  radiusKm: number = 50
): EnhancedHospital[] => {
  return enhancedHospitalDatabase
    .map(hospital => ({
      ...hospital,
      distanceFromUser: calculateDistance(lat, lng, hospital.coordinates.lat, hospital.coordinates.lng)
    }))
    .filter(hospital => hospital.distanceFromUser! <= radiusKm)
    .sort((a, b) => a.distanceFromUser! - b.distanceFromUser!);
};

export const searchHospitalsByService = (service: keyof EnhancedHospital['services']): EnhancedHospital[] => {
  return enhancedHospitalDatabase.filter(hospital => hospital.services[service]);
};

export const searchHospitalsByCountry = (country: string): EnhancedHospital[] => {
  return enhancedHospitalDatabase.filter(hospital => 
    hospital.country.toLowerCase() === country.toLowerCase()
  );
};

export const getEmergencyHospitals = (): EnhancedHospital[] => {
  return enhancedHospitalDatabase.filter(hospital => hospital.services.emergency);
};

export const getTraumaHospitals = (): EnhancedHospital[] => {
  return enhancedHospitalDatabase.filter(hospital => hospital.services.trauma);
};

// Utility function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Hospital verification and quality metrics
export const getHospitalQualityScore = (hospital: EnhancedHospital): number => {
  let score = 0;
  
  // Base score from rating
  score += hospital.rating * 20;
  
  // Certification bonuses
  score += hospital.certifications.length * 5;
  
  // Service availability bonuses
  const serviceCount = Object.values(hospital.services).filter(Boolean).length;
  score += serviceCount * 2;
  
  // Accessibility bonuses
  if (hospital.accessibility.wheelchairAccessible) score += 5;
  if (hospital.accessibility.parkingAvailable) score += 3;
  if (hospital.accessibility.publicTransport) score += 3;
  
  // Verification status
  if (hospital.verificationStatus === 'verified') score += 10;
  
  return Math.min(100, score);
};

// Emergency contact information by country
export const emergencyContactsByCountry = {
  "Mongolia": {
    police: "102",
    fire: "101",
    ambulance: "103",
    general: "108"
  },
  "United States": {
    emergency: "911"
  },
  "United Kingdom": {
    emergency: "999",
    nonEmergency: "111"
  }
};
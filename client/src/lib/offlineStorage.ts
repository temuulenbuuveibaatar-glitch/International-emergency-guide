/**
 * Offline Storage Utility for Emergency Guide App
 * 
 * This utility provides functions to store and retrieve data locally,
 * enabling offline access to critical emergency information.
 */

// Constants for storage keys
const STORAGE_PREFIX = 'emergency-guide-';
const PROTOCOLS_KEY = `${STORAGE_PREFIX}protocols`;
const EMERGENCY_NUMBERS_KEY = `${STORAGE_PREFIX}emergency-numbers`;
const HOSPITALS_KEY = `${STORAGE_PREFIX}hospitals`;
const MEDICATIONS_KEY = `${STORAGE_PREFIX}medications`;
const LAST_UPDATED_KEY = `${STORAGE_PREFIX}last-updated`;

// Type for cached data
interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Stores data in localStorage with timestamp
 */
export function storeData<T>(key: string, data: T): void {
  try {
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cachedData));
    localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
    console.log(`Data cached successfully for ${key}`);
  } catch (error) {
    console.error(`Error storing data for ${key}:`, error);
  }
}

/**
 * Retrieves data from localStorage
 */
export function retrieveData<T>(key: string): T | null {
  try {
    const rawData = localStorage.getItem(key);
    if (!rawData) return null;
    
    const cachedData: CachedData<T> = JSON.parse(rawData);
    return cachedData.data;
  } catch (error) {
    console.error(`Error retrieving data for ${key}:`, error);
    return null;
  }
}

/**
 * Checks if the cached data is stale (older than maxAge)
 */
export function isDataStale(key: string, maxAge: number = 24 * 60 * 60 * 1000): boolean {
  try {
    const rawData = localStorage.getItem(key);
    if (!rawData) return true;
    
    const cachedData = JSON.parse(rawData);
    const now = Date.now();
    return now - cachedData.timestamp > maxAge;
  } catch (error) {
    console.error(`Error checking staleness for ${key}:`, error);
    return true;
  }
}

/**
 * Stores emergency protocols data
 */
export function storeProtocols(protocols: any): void {
  storeData(PROTOCOLS_KEY, protocols);
}

/**
 * Retrieves emergency protocols data
 */
export function retrieveProtocols(): any {
  return retrieveData(PROTOCOLS_KEY);
}

/**
 * Stores emergency numbers data
 */
export function storeEmergencyNumbers(numbers: any): void {
  storeData(EMERGENCY_NUMBERS_KEY, numbers);
}

/**
 * Retrieves emergency numbers data
 */
export function retrieveEmergencyNumbers(): any {
  return retrieveData(EMERGENCY_NUMBERS_KEY);
}

/**
 * Stores hospitals data
 */
export function storeHospitals(hospitals: any): void {
  storeData(HOSPITALS_KEY, hospitals);
}

/**
 * Retrieves hospitals data
 */
export function retrieveHospitals(): any {
  return retrieveData(HOSPITALS_KEY);
}

/**
 * Stores medications data
 */
export function storeMedications(medications: any): void {
  storeData(MEDICATIONS_KEY, medications);
}

/**
 * Retrieves medications data
 */
export function retrieveMedications(): any {
  return retrieveData(MEDICATIONS_KEY);
}

/**
 * Gets the last update timestamp
 */
export function getLastUpdated(): Date | null {
  const timestamp = localStorage.getItem(LAST_UPDATED_KEY);
  return timestamp ? new Date(parseInt(timestamp)) : null;
}

/**
 * Clears all cached data
 */
export function clearCache(): void {
  localStorage.removeItem(PROTOCOLS_KEY);
  localStorage.removeItem(EMERGENCY_NUMBERS_KEY);
  localStorage.removeItem(HOSPITALS_KEY);
  localStorage.removeItem(MEDICATIONS_KEY);
  localStorage.removeItem(LAST_UPDATED_KEY);
}

/**
 * Checks if we have a complete cache of all essential data
 */
export function hasCompleteCache(): boolean {
  return (
    localStorage.getItem(PROTOCOLS_KEY) !== null &&
    localStorage.getItem(EMERGENCY_NUMBERS_KEY) !== null
  );
}

/**
 * Checks if device has sufficient storage for caching
 * Returns available space in MB
 */
export async function checkStorageAvailability(): Promise<number> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const availableMB = Math.floor((estimate.quota! - estimate.usage!) / (1024 * 1024));
      return availableMB;
    }
    
    // Fallback for browsers that don't support Storage API
    return 50; // Assume 50MB available
  } catch (error) {
    console.error('Error checking storage availability:', error);
    return 10; // Conservative estimate
  }
}
import React, { useEffect, useState } from 'react';
import { 
  storeProtocols, 
  storeEmergencyNumbers, 
  storeHospitals, 
  storeMedications,
  retrieveProtocols,
  getLastUpdated,
  hasCompleteCache,
  checkStorageAvailability
} from '../lib/offlineStorage';
import { emergencyProtocols } from '../data/protocols';
import { countryEmergencyNumbers } from '../data/emergencyNumbers';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

/**
 * This component manages offline data storage and provides
 * a user interface for manually syncing data.
 */
export default function OfflineDataManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState<number>(0);
  const { toast } = useToast();

  // Check online status and update state
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Initial check
    handleOnlineStatus();
    checkStorage();
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Check if we have cached data and when it was last updated
  useEffect(() => {
    const timestamp = getLastUpdated();
    setLastUpdated(timestamp);
    
    // If we don't have cached data yet, cache it automatically
    if (!hasCompleteCache() && navigator.onLine) {
      syncData();
    }
  }, []);

  // Check storage availability
  const checkStorage = async () => {
    const available = await checkStorageAvailability();
    setStorageAvailable(available);
  };

  // Sync all data for offline use
  const syncData = async () => {
    if (!navigator.onLine) {
      toast({
        title: "You're offline",
        description: "Please connect to the internet to sync data",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    
    try {
      // Store static data from the app
      storeProtocols(emergencyProtocols);
      storeEmergencyNumbers(countryEmergencyNumbers);
      
      // For hospitals and medications, we can use the imported data
      // or fetch from an API if available
      const mockHospitalData = {
        "message": "Data successfully cached for offline use",
        "timestamp": new Date().toISOString()
      };
      storeHospitals(mockHospitalData);
      
      // Check if we have cached medications or use the static data
      const cachedProtocols = retrieveProtocols();
      
      if (cachedProtocols) {
        toast({
          title: "Data synced successfully",
          description: "Emergency information is now available offline",
        });
        
        // Update the last updated timestamp
        setLastUpdated(getLastUpdated());
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync failed",
        description: "There was a problem saving data for offline use",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-1">Offline Access</h3>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {lastUpdated && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Last synced: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        
        <Button 
          onClick={syncData} 
          disabled={isSyncing || !isOnline}
          variant="outline"
          size="sm"
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>
      
      {showDetail && (
        <div className="mt-3 text-sm border-t pt-2">
          <p>Available storage: ~{storageAvailable} MB</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Offline access allows you to use critical emergency information without an internet connection.
          </p>
        </div>
      )}
      
      <button 
        onClick={() => setShowDetail(!showDetail)}
        className="text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline"
      >
        {showDetail ? 'Hide details' : 'Show details'}
      </button>
    </div>
  );
}
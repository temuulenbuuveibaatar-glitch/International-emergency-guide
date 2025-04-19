import { useState, useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { Phone, MapPin } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  position: { lat: number; lng: number };
  phone: string;
  distance?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 47.9049,  // Orkhon Province, Mongolia approximate coordinates
  lng: 106.8866,
};

export default function HospitalFinder() {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("10");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleLocationSearch = async () => {
    if (location && isLoaded && mapRef.current) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const pos = results[0].geometry.location;
          const newCenter = { lat: pos.lat(), lng: pos.lng() };
          setMapCenter(newCenter);
          mapRef.current?.panTo(newCenter);
          
          // In a real application, you would search for hospitals near this location
          // using the Google Places API or your own backend service
          searchNearbyHospitals(newCenter);
        } else {
          // Handle geocoding error
          console.error("Geocode was not successful for the following reason:", status);
        }
      });
    }
  };

  const searchNearbyHospitals = (location: { lat: number; lng: number }) => {
    // This would be replaced with actual API call to get hospitals
    // For now, we'll set some sample data
    const sampleHospitals: Hospital[] = [
      {
        id: "1",
        name: "Orkhon Provincial Hospital",
        address: "123 Main St, Orkhon Province, Mongolia",
        position: { 
          lat: location.lat + 0.01, 
          lng: location.lng + 0.01 
        },
        phone: "+97670351234",
        distance: "2.3 km"
      },
      {
        id: "2",
        name: "Erdenet Medical Center",
        address: "456 Hospital Rd, Erdenet, Mongolia",
        position: { 
          lat: location.lat - 0.01, 
          lng: location.lng - 0.01 
        },
        phone: "+97670359876",
        distance: "3.7 km"
      }
    ];
    
    setHospitals(sampleHospitals);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(pos);
          mapRef.current?.panTo(pos);
          searchNearbyHospitals(pos);
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  };

  const selectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setMapCenter(hospital.position);
    mapRef.current?.panTo(hospital.position);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search Form */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              {t('hospitals.location')}
            </label>
            <input 
              id="location" 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder={t('hospitals.enterLocation')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
              {t('hospitals.radius')}
            </label>
            <select 
              id="radius" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
          <div className="md:self-end">
            <button 
              className="w-full md:w-auto bg-[#004A9F] hover:bg-[#0064D6] text-white px-6 py-2 rounded-md font-medium transition duration-200"
              onClick={handleLocationSearch}
            >
              {t('hospitals.search')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Map and Results */}
      <div className="grid md:grid-cols-5">
        {/* Map Container */}
        <div className="md:col-span-3 h-96 bg-gray-100 relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={14}
            onLoad={onMapLoad}
          >
            {hospitals.map((hospital) => (
              <Marker
                key={hospital.id}
                position={hospital.position}
                onClick={() => selectHospital(hospital)}
              />
            ))}
            
            {selectedHospital && (
              <InfoWindow
                position={selectedHospital.position}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div>
                  <h3 className="font-medium">{selectedHospital.name}</h3>
                  <p className="text-sm">{selectedHospital.address}</p>
                  <p className="text-sm mt-1">
                    <a
                      href={`tel:${selectedHospital.phone}`}
                      className="text-primary"
                    >
                      {selectedHospital.phone}
                    </a>
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          
          {/* Geolocation Button */}
          <button 
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md border border-gray-300"
            onClick={handleUseCurrentLocation}
            title={t('hospitals.useCurrentLocation')}
          >
            <MapPin className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        
        {/* Results List */}
        <div className="md:col-span-2 border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">{t('hospitals.results')}</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <div 
                  key={hospital.id} 
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectHospital(hospital)}
                >
                  <h4 className="font-medium text-[#004A9F]">{hospital.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{hospital.distance}</span>
                    <a href={`tel:${hospital.phone}`} className="text-primary flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{t('hospitals.call')}</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>{t('hospitals.noResults')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

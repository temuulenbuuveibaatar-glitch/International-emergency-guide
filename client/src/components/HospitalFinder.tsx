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
  const [selectedCountry, setSelectedCountry] = useState<string>("Mongolia");
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Initialize with default country's hospitals
    const defaultCountry = "Mongolia";
    const countryCenter = countryCenters[defaultCountry];
    
    // Set initial zoom level to see the whole country
    map.setZoom(5);
    
    // Load the country's hospitals
    searchNearbyHospitals(countryCenter, defaultCountry);
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

  // Global database of major hospitals by country
  const hospitalDatabase: Record<string, Hospital[]> = {
    "Mongolia": [
      {
        id: "mn_1",
        name: "Orkhon Provincial Hospital",
        address: "Bayan-Undur, Orkhon Province, Mongolia",
        position: { lat: 49.0453, lng: 104.0487 },
        phone: "+97670351234"
      },
      {
        id: "mn_2",
        name: "Erdenet Medical Center",
        address: "Hospital Rd, Erdenet, Mongolia",
        position: { lat: 49.0295, lng: 104.0825 },
        phone: "+97670359876"
      },
      {
        id: "mn_3",
        name: "National Trauma Center",
        address: "Ulaanbaatar, Mongolia",
        position: { lat: 47.9185, lng: 106.9171 },
        phone: "+97611450002"
      },
      {
        id: "mn_4",
        name: "Mongolian National University of Medical Sciences Hospital",
        address: "S. Zorig Street, Ulaanbaatar, Mongolia",
        position: { lat: 47.9212, lng: 106.9018 },
        phone: "+97611321259"
      },
      {
        id: "mn_5",
        name: "State Third Hospital",
        address: "Bayangol District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9132, lng: 106.8834 },
        phone: "+97611461115"
      },
      {
        id: "mn_6",
        name: "UB Songdo Hospital",
        address: "Seoul Street, Ulaanbaatar, Mongolia",
        position: { lat: 47.9177, lng: 106.9286 },
        phone: "+97677000002"
      },
      {
        id: "mn_7",
        name: "Intermed Hospital",
        address: "Chinggis Avenue, Ulaanbaatar, Mongolia",
        position: { lat: 47.9100, lng: 106.9166 },
        phone: "+97611701111"
      },
      {
        id: "mn_8",
        name: "Darkhan-Uul General Hospital",
        address: "Darkhan, Mongolia",
        position: { lat: 49.4724, lng: 105.9745 },
        phone: "+97613722401"
      },
      {
        id: "mn_9",
        name: "Khovd Provincial Hospital",
        address: "Khovd, Mongolia",
        position: { lat: 48.0056, lng: 91.6419 },
        phone: "+97614322052"
      },
      {
        id: "mn_10",
        name: "Selenge Provincial Hospital",
        address: "Sukhbaatar, Selenge, Mongolia",
        position: { lat: 50.2289, lng: 106.2082 },
        phone: "+97613614220"
      }
    ],
    "China": [
      {
        id: "cn_1",
        name: "Peking Union Medical College Hospital",
        address: "1 Shuaifuyuan, Dongcheng, Beijing, China",
        position: { lat: 39.9139, lng: 116.4110 },
        phone: "+861069156114"
      },
      {
        id: "cn_2",
        name: "Shanghai Huashan Hospital",
        address: "12 Wulumuqi Middle Rd, Shanghai, China",
        position: { lat: 31.2161, lng: 121.4399 },
        phone: "+862152888999"
      }
    ],
    "Japan": [
      {
        id: "jp_1",
        name: "Tokyo University Hospital",
        address: "7-3-1 Hongo, Bunkyo, Tokyo, Japan",
        position: { lat: 35.7126, lng: 139.7598 },
        phone: "+81338155411"
      },
      {
        id: "jp_2",
        name: "Osaka University Hospital",
        address: "2-15 Yamadaoka, Suita, Osaka, Japan",
        position: { lat: 34.8202, lng: 135.5212 },
        phone: "+81668793111"
      }
    ],
    "Korea": [
      {
        id: "kr_1",
        name: "Seoul National University Hospital",
        address: "101 Daehak-ro, Jongno-gu, Seoul, Korea",
        position: { lat: 37.5806, lng: 126.9993 },
        phone: "+82220721001"
      },
      {
        id: "kr_2",
        name: "Asan Medical Center",
        address: "88 Olympic-ro 43-gil, Songpa-gu, Seoul, Korea",
        position: { lat: 37.5270, lng: 127.1081 },
        phone: "+82230101111"
      }
    ],
    "USA": [
      {
        id: "us_1",
        name: "Mayo Clinic",
        address: "200 First St SW, Rochester, MN, USA",
        position: { lat: 44.0225, lng: -92.4667 },
        phone: "+15072842511"
      },
      {
        id: "us_2",
        name: "Cleveland Clinic",
        address: "9500 Euclid Ave, Cleveland, OH, USA",
        position: { lat: 41.5022, lng: -81.6169 },
        phone: "+12164448302"
      }
    ],
    "UK": [
      {
        id: "uk_1",
        name: "St Thomas' Hospital",
        address: "Westminster Bridge Rd, London, UK",
        position: { lat: 51.4983, lng: -0.1188 },
        phone: "+442071887188"
      },
      {
        id: "uk_2",
        name: "Royal London Hospital",
        address: "Whitechapel Rd, London, UK",
        position: { lat: 51.5180, lng: -0.0599 },
        phone: "+442073777000"
      }
    ],
    "Germany": [
      {
        id: "de_1",
        name: "Charité – Universitätsmedizin Berlin",
        address: "Charitéplatz 1, Berlin, Germany",
        position: { lat: 52.5273, lng: 13.3792 },
        phone: "+493045050"
      },
      {
        id: "de_2",
        name: "University Hospital Heidelberg",
        address: "Im Neuenheimer Feld 672, Heidelberg, Germany",
        position: { lat: 49.4141, lng: 8.6735 },
        phone: "+4962215600"
      }
    ],
    "Russia": [
      {
        id: "ru_1",
        name: "National Medical Research Center for Cardiology",
        address: "3rd Cherepkovskaya St, 15A, Moscow, Russia",
        position: { lat: 55.7325, lng: 37.4851 },
        phone: "+74954146326"
      },
      {
        id: "ru_2",
        name: "Pirogov National Medical & Surgical Center",
        address: "Nizhnyaya Pervomayskaya St, 70, Moscow, Russia",
        position: { lat: 55.8008, lng: 37.7949 },
        phone: "+74994639303"
      }
    ]
  };

  // Emergency numbers by country
  const emergencyNumbers: Record<string, {ambulance: string, general: string}> = {
    "Mongolia": {ambulance: "103", general: "105"},
    "China": {ambulance: "120", general: "110"},
    "Japan": {ambulance: "119", general: "110"},
    "Korea": {ambulance: "119", general: "112"},
    "USA": {ambulance: "911", general: "911"},
    "UK": {ambulance: "999", general: "999"},
    "Germany": {ambulance: "112", general: "112"},
    "Russia": {ambulance: "103", general: "112"}
  };

  // Country centers for map focusing
  const countryCenters = {
    "Mongolia": { lat: 46.8625, lng: 103.8467 },
    "China": { lat: 35.8617, lng: 104.1954 },
    "Japan": { lat: 36.2048, lng: 138.2529 },
    "Korea": { lat: 35.9078, lng: 127.7669 },
    "USA": { lat: 37.0902, lng: -95.7129 },
    "UK": { lat: 55.3781, lng: -3.4360 },
    "Germany": { lat: 51.1657, lng: 10.4515 },
    "Russia": { lat: 61.5240, lng: 105.3188 }
  };

  // Handle country selection change
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const countryCenter = countryCenters[country as keyof typeof countryCenters];
    if (countryCenter && mapRef.current) {
      setMapCenter(countryCenter);
      mapRef.current.panTo(countryCenter);
      mapRef.current.setZoom(5); // Zoom out to see the whole country
      searchNearbyHospitals(countryCenter, country);
    }
  };

  const searchNearbyHospitals = (location: { lat: number; lng: number }, forcedCountry?: string) => {
    // Use forced country if provided, otherwise detect based on location
    let countryName = forcedCountry || "Mongolia";
    
    if (!forcedCountry) {
      let minDistance = Number.MAX_VALUE;
      
      // Find the closest country if not forced
      Object.entries(countryCenters).forEach(([country, center]) => {
        const distance = Math.sqrt(
          Math.pow(location.lat - center.lat, 2) + 
          Math.pow(location.lng - center.lng, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          countryName = country;
        }
      });
      
      // Update selected country in UI
      setSelectedCountry(countryName);
    }

    // Get hospitals for that country
    const countryHospitals = hospitalDatabase[countryName] || [];
    
    // Calculate distances (simplified)
    const hospitalsWithDistance = countryHospitals.map(hospital => {
      const distance = Math.sqrt(
        Math.pow(hospital.position.lat - location.lat, 2) + 
        Math.pow(hospital.position.lng - location.lng, 2)
      ) * 111; // Rough conversion to km (1 degree is approximately 111km)
      
      return {
        ...hospital,
        distance: `${distance.toFixed(1)} km`
      };
    });
    
    // Sort by distance
    hospitalsWithDistance.sort((a, b) => 
      parseFloat((a.distance || "0").replace(" km", "")) - 
      parseFloat((b.distance || "0").replace(" km", ""))
    );
    
    setHospitals(hospitalsWithDistance);

    // Add emergency number info to the map
    if (mapRef.current && emergencyNumbers[countryName]) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'emergency-info';
      infoDiv.innerHTML = `
        <div style="
          position: absolute; 
          top: 10px; 
          left: 10px; 
          background: white; 
          padding: 10px; 
          border-radius: 4px; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
          z-index: 1;
          font-family: sans-serif;
          font-size: 14px;
        ">
          <strong>${countryName} Emergency:</strong><br>
          Ambulance: <a href="tel:${emergencyNumbers[countryName].ambulance}" style="color: #004A9F; font-weight: bold;">${emergencyNumbers[countryName].ambulance}</a><br>
          General: <a href="tel:${emergencyNumbers[countryName].general}" style="color: #004A9F; font-weight: bold;">${emergencyNumbers[countryName].general}</a>
        </div>
      `;
      
      // Remove any existing emergency info
      const existingInfo = document.querySelector('.emergency-info');
      if (existingInfo) {
        existingInfo.remove();
      }
      
      // Add the new info
      mapRef.current.controls[google.maps.ControlPosition.TOP_LEFT].clear();
      mapRef.current.controls[google.maps.ControlPosition.TOP_LEFT].push(infoDiv);
    }
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
        {/* Country Selector */}
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Object.keys(hospitalDatabase).map((country) => (
              <button
                key={country}
                onClick={() => handleCountryChange(country)}
                className={`p-2 text-xs sm:text-sm border rounded-md ${
                  selectedCountry === country
                    ? 'bg-[#004A9F] text-white border-[#004A9F]'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

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

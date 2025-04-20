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
  
  // We'll continue to use the Google Maps API, but we'll also provide a fallback
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
      },
      {
        id: "cn_3",
        name: "West China Hospital",
        address: "No. 37 Guoxue Lane, Chengdu, China",
        position: { lat: 30.6421, lng: 104.0665 },
        phone: "+862885422222"
      },
      {
        id: "cn_4",
        name: "Peking University Third Hospital",
        address: "49 N Garden Rd, Beijing, China",
        position: { lat: 39.9831, lng: 116.3543 },
        phone: "+861082266699"
      },
      {
        id: "cn_5",
        name: "Zhongshan Hospital",
        address: "180 Fenglin Rd, Shanghai, China",
        position: { lat: 31.1947, lng: 121.4353 },
        phone: "+862164041990"
      },
      {
        id: "cn_6",
        name: "Beijing Hospital",
        address: "1 Dahua Rd, Dongcheng, Beijing, China",
        position: { lat: 39.9061, lng: 116.4270 },
        phone: "+861065282171"
      },
      {
        id: "cn_7",
        name: "Guangzhou First People's Hospital",
        address: "1 Panfu Rd, Guangzhou, China",
        position: { lat: 23.1435, lng: 113.2594 },
        phone: "+862081048888"
      },
      {
        id: "cn_8",
        name: "Xiangya Hospital",
        address: "87 Xiangya Rd, Changsha, China",
        position: { lat: 28.1979, lng: 112.9793 },
        phone: "+867318975628"
      },
      {
        id: "cn_9",
        name: "Xijing Hospital",
        address: "15 Changle W Rd, Xi'an, China",
        position: { lat: 34.2551, lng: 108.9487 },
        phone: "+862984775507"
      },
      {
        id: "cn_10",
        name: "Tianjin Medical University General Hospital",
        address: "154 Anshan Rd, Tianjin, China",
        position: { lat: 39.1088, lng: 117.1651 },
        phone: "+862260362255"
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
      },
      {
        id: "jp_3",
        name: "Kyoto University Hospital",
        address: "54 Kawaharacho, Shogoin, Sakyo Ward, Kyoto, Japan",
        position: { lat: 35.0262, lng: 135.7800 },
        phone: "+81757513111"
      },
      {
        id: "jp_4",
        name: "St. Luke's International Hospital",
        address: "9-1 Akashicho, Chuo, Tokyo, Japan",
        position: { lat: 35.6655, lng: 139.7707 },
        phone: "+81335415151"
      },
      {
        id: "jp_5",
        name: "Keio University Hospital",
        address: "35 Shinanomachi, Shinjuku City, Tokyo, Japan",
        position: { lat: 35.6834, lng: 139.7156 },
        phone: "+81333531211"
      },
      {
        id: "jp_6",
        name: "National Cancer Center Hospital",
        address: "5-1-1 Tsukiji, Chuo, Tokyo, Japan",
        position: { lat: 35.6654, lng: 139.7699 },
        phone: "+81335422511"
      },
      {
        id: "jp_7",
        name: "Hokkaido University Hospital",
        address: "Kita 14, Nishi 5, Kita-ku, Sapporo, Hokkaido, Japan",
        position: { lat: 43.0686, lng: 141.3486 },
        phone: "+81117161161"
      },
      {
        id: "jp_8",
        name: "Tohoku University Hospital",
        address: "1-1 Seiryomachi, Aoba Ward, Sendai, Miyagi, Japan",
        position: { lat: 38.2682, lng: 140.8694 },
        phone: "+81227177000"
      },
      {
        id: "jp_9",
        name: "Nagoya University Hospital",
        address: "65 Tsurumai, Showa Ward, Nagoya, Aichi, Japan",
        position: { lat: 35.1548, lng: 136.9324 },
        phone: "+81527411101"
      },
      {
        id: "jp_10",
        name: "Fukuoka University Hospital",
        address: "7-45-1 Nanakuma, Jonan Ward, Fukuoka, Japan",
        position: { lat: 33.5516, lng: 130.3610 },
        phone: "+81928011011"
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
      },
      {
        id: "kr_3",
        name: "Samsung Medical Center",
        address: "81 Irwon-ro, Gangnam-gu, Seoul, Korea",
        position: { lat: 37.4886, lng: 127.0865 },
        phone: "+82234100200"
      },
      {
        id: "kr_4",
        name: "Severance Hospital",
        address: "50-1 Yonsei-ro, Seodaemun-gu, Seoul, Korea",
        position: { lat: 37.5636, lng: 126.9410 },
        phone: "+82222281000"
      },
      {
        id: "kr_5",
        name: "Seoul St. Mary's Hospital",
        address: "222 Banpo-daero, Seocho-gu, Seoul, Korea",
        position: { lat: 37.5014, lng: 127.0047 },
        phone: "+82222586011"
      },
      {
        id: "kr_6",
        name: "Pusan National University Hospital",
        address: "179 Gudeok-ro, Seo-gu, Busan, Korea",
        position: { lat: 35.1047, lng: 129.0242 },
        phone: "+82512402000"
      },
      {
        id: "kr_7",
        name: "Kyungpook National University Hospital",
        address: "130 Dongdeok-ro, Jung-gu, Daegu, Korea",
        position: { lat: 35.8692, lng: 128.6038 },
        phone: "+82534200100"
      },
      {
        id: "kr_8",
        name: "Chonnam National University Hospital",
        address: "42 Jebong-ro, Dong-gu, Gwangju, Korea",
        position: { lat: 35.1495, lng: 126.9253 },
        phone: "+82622205437"
      },
      {
        id: "kr_9",
        name: "Gachon University Gil Medical Center",
        address: "21 Namdong-daero 774beon-gil, Namdong-gu, Incheon, Korea",
        position: { lat: 37.4563, lng: 126.7052 },
        phone: "+82214400114"
      },
      {
        id: "kr_10",
        name: "Hallym University Sacred Heart Hospital",
        address: "22 Gwanpyeong-ro 170beon-gil, Dongan-gu, Anyang, Korea",
        position: { lat: 37.3909, lng: 126.9510 },
        phone: "+82313803771"
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
      },
      {
        id: "us_3",
        name: "Johns Hopkins Hospital",
        address: "1800 Orleans St, Baltimore, MD, USA",
        position: { lat: 39.2965, lng: -76.5920 },
        phone: "+14109555000"
      },
      {
        id: "us_4",
        name: "Massachusetts General Hospital",
        address: "55 Fruit Street, Boston, MA, USA",
        position: { lat: 42.3626, lng: -71.0686 },
        phone: "+16177262000"
      },
      {
        id: "us_5",
        name: "UCLA Medical Center",
        address: "757 Westwood Plaza, Los Angeles, CA, USA",
        position: { lat: 34.0658, lng: -118.4451 },
        phone: "+13102677890"
      },
      {
        id: "us_6",
        name: "UCSF Medical Center",
        address: "505 Parnassus Ave, San Francisco, CA, USA",
        position: { lat: 37.7631, lng: -122.4583 },
        phone: "+14154764000"
      },
      {
        id: "us_7",
        name: "New York-Presbyterian Hospital",
        address: "525 E 68th St, New York, NY, USA",
        position: { lat: 40.7651, lng: -73.9546 },
        phone: "+12127463000"
      },
      {
        id: "us_8",
        name: "Stanford Health Care",
        address: "300 Pasteur Dr, Stanford, CA, USA",
        position: { lat: 37.4351, lng: -122.1760 },
        phone: "+16507236861"
      },
      {
        id: "us_9",
        name: "Houston Methodist Hospital",
        address: "6565 Fannin St, Houston, TX, USA",
        position: { lat: 29.7105, lng: -95.4009 },
        phone: "+17134416565"
      },
      {
        id: "us_10",
        name: "Mount Sinai Hospital",
        address: "1 Gustave L. Levy Place, New York, NY, USA",
        position: { lat: 40.7901, lng: -73.9523 },
        phone: "+12122417981"
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
      },
      {
        id: "uk_3",
        name: "Guy's Hospital",
        address: "Great Maze Pond, London, UK",
        position: { lat: 51.5044, lng: -0.0879 },
        phone: "+442071887188"
      },
      {
        id: "uk_4",
        name: "University College Hospital",
        address: "235 Euston Rd, London, UK",
        position: { lat: 51.5241, lng: -0.1351 },
        phone: "+442034567890"
      },
      {
        id: "uk_5",
        name: "Addenbrooke's Hospital",
        address: "Hills Rd, Cambridge, UK",
        position: { lat: 52.1749, lng: 0.1401 },
        phone: "+441223245151"
      },
      {
        id: "uk_6",
        name: "John Radcliffe Hospital",
        address: "Headley Way, Oxford, UK",
        position: { lat: 51.7634, lng: -1.2171 },
        phone: "+441865741166"
      },
      {
        id: "uk_7",
        name: "Royal Infirmary of Edinburgh",
        address: "51 Little France Crescent, Edinburgh, UK",
        position: { lat: 55.9217, lng: -3.1093 },
        phone: "+441315361000"
      },
      {
        id: "uk_8",
        name: "Queen Elizabeth Hospital Birmingham",
        address: "Mindelsohn Way, Birmingham, UK",
        position: { lat: 52.4535, lng: -1.9418 },
        phone: "+441213712000"
      },
      {
        id: "uk_9",
        name: "Manchester Royal Infirmary",
        address: "Oxford Rd, Manchester, UK",
        position: { lat: 53.4628, lng: -2.2319 },
        phone: "+441612761234"
      },
      {
        id: "uk_10",
        name: "Royal Victoria Infirmary",
        address: "Queen Victoria Rd, Newcastle upon Tyne, UK",
        position: { lat: 54.9797, lng: -1.6127 },
        phone: "+441912336161"
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
      },
      {
        id: "de_3",
        name: "LMU University Hospital Munich",
        address: "Marchioninistraße 15, Munich, Germany",
        position: { lat: 48.1144, lng: 11.4714 },
        phone: "+498944000"
      },
      {
        id: "de_4",
        name: "University Hospital Hamburg-Eppendorf",
        address: "Martinistraße 52, Hamburg, Germany",
        position: { lat: 53.5893, lng: 9.9749 },
        phone: "+4940741050"
      },
      {
        id: "de_5",
        name: "University Hospital Frankfurt",
        address: "Theodor-Stern-Kai 7, Frankfurt, Germany",
        position: { lat: 50.0937, lng: 8.6589 },
        phone: "+496963016301"
      },
      {
        id: "de_6",
        name: "University Hospital Cologne",
        address: "Kerpener Straße 62, Cologne, Germany",
        position: { lat: 50.9245, lng: 6.9177 },
        phone: "+492214780"
      },
      {
        id: "de_7",
        name: "University Hospital Bonn",
        address: "Venusberg-Campus 1, Bonn, Germany",
        position: { lat: 50.7006, lng: 7.1029 },
        phone: "+49228287335"
      },
      {
        id: "de_8",
        name: "University Hospital Dresden",
        address: "Fetscherstraße 74, Dresden, Germany",
        position: { lat: 51.0538, lng: 13.7836 },
        phone: "+493514580"
      },
      {
        id: "de_9",
        name: "Medical Center – University of Freiburg",
        address: "Hugstetter Straße 55, Freiburg, Germany",
        position: { lat: 47.9949, lng: 7.8510 },
        phone: "+4976127027270"
      },
      {
        id: "de_10",
        name: "University Hospital Tübingen",
        address: "Geissweg 3, Tübingen, Germany",
        position: { lat: 48.5294, lng: 9.0456 },
        phone: "+497071290"
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
      },
      {
        id: "ru_3",
        name: "Almazov National Medical Research Centre",
        address: "2 Akkuratova St, St. Petersburg, Russia",
        position: { lat: 59.9941, lng: 30.3271 },
        phone: "+78127023756"
      },
      {
        id: "ru_4",
        name: "Clinical Hospital No. 1 (Volynka)",
        address: "10 Volynskaya St, Moscow, Russia",
        position: { lat: 55.7127, lng: 37.4488 },
        phone: "+74954413121"
      },
      {
        id: "ru_5",
        name: "Federal Center for Cardiovascular Surgery",
        address: "140 Novosibirskaya St, Novosibirsk, Russia",
        position: { lat: 54.8567, lng: 83.0933 },
        phone: "+73833474939"
      },
      {
        id: "ru_6",
        name: "Pavlov First St. Petersburg State Medical University",
        address: "6-8 Lva Tolstogo St, St. Petersburg, Russia",
        position: { lat: 59.9560, lng: 30.3122 },
        phone: "+78123386600"
      },
      {
        id: "ru_7",
        name: "V.M. Bekhterev National Research Medical Center for Psychiatry and Neurology",
        address: "3 Bekhtereva St, St. Petersburg, Russia",
        position: { lat: 59.8847, lng: 30.4267 },
        phone: "+78126700220"
      },
      {
        id: "ru_8",
        name: "Kazan State Medical University Hospital",
        address: "49 Butlerova St, Kazan, Russia",
        position: { lat: 55.7879, lng: 49.1360 },
        phone: "+78432360652"
      },
      {
        id: "ru_9",
        name: "Privolzhsky Research Medical University",
        address: "10/1 Minin and Pozharsky Square, Nizhny Novgorod, Russia",
        position: { lat: 56.3268, lng: 44.0075 },
        phone: "+78314225431"
      },
      {
        id: "ru_10",
        name: "Sechenov First Moscow State Medical University",
        address: "8/2 Trubetskaya St, Moscow, Russia",
        position: { lat: 55.7325, lng: 37.5712 },
        phone: "+74992486688"
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
    
    // Always search for hospitals even if map is not available
    if (countryCenter) {
      setMapCenter(countryCenter);
      
      // Only manipulate map if it's available
      if (mapRef.current) {
        mapRef.current.panTo(countryCenter);
        mapRef.current.setZoom(5); // Zoom out to see the whole country
      }
      
      // Always search for hospitals regardless of map status
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

  // Initialize hospitals for the default country even if the map doesn't load
  // We'll now handle the load error more gracefully
  if (!isLoaded && hospitals.length === 0) {
    // If the map isn't loaded yet and we don't have any hospitals displayed,
    // let's pre-populate hospitals for the default country
    const defaultCountry = "Mongolia";
    const countryCenter = countryCenters[defaultCountry];
    searchNearbyHospitals(countryCenter, defaultCountry);
  }

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
          {loadError ? (
            <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-100">
              <div className="bg-white p-4 rounded-lg shadow-md max-w-md text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('hospitals.mapLoadError')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('hospitals.usingListOnly')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('hospitals.apiKeyRequired')}
                </p>
              </div>
            </div>
          ) : !isLoaded ? (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="spinner border-4 border-t-4 border-gray-200 border-t-primary rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : (
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
          )}
          
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

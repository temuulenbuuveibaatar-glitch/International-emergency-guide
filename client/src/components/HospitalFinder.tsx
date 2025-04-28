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
      },
      {
        id: "mn_11",
        name: "Bayankhongor Provincial Hospital",
        address: "Bayankhongor, Mongolia",
        position: { lat: 46.1944, lng: 100.7182 },
        phone: "+97614462123"
      },
      {
        id: "mn_12",
        name: "Gobi-Altai Provincial Hospital",
        address: "Altai, Gobi-Altai, Mongolia",
        position: { lat: 45.7512, lng: 96.2589 },
        phone: "+97614452234"
      },
      {
        id: "mn_13",
        name: "Dornod Provincial Hospital",
        address: "Choibalsan, Dornod, Mongolia",
        position: { lat: 48.0553, lng: 114.5285 },
        phone: "+97615822256"
      },
      {
        id: "mn_14",
        name: "Dornogovi Provincial Hospital",
        address: "Sainshand, Dornogovi, Mongolia",
        position: { lat: 44.8785, lng: 110.1330 },
        phone: "+97615252276"
      },
      {
        id: "mn_15",
        name: "Dundgovi Provincial Hospital",
        address: "Mandalgovi, Dundgovi, Mongolia",
        position: { lat: 45.7477, lng: 106.2714 },
        phone: "+97615592312"
      },
      {
        id: "mn_16",
        name: "Govi-Sumber Provincial Hospital",
        address: "Choir, Govi-Sumber, Mongolia",
        position: { lat: 46.3611, lng: 108.2167 },
        phone: "+97615442378"
      },
      {
        id: "mn_17",
        name: "Khentii Provincial Hospital",
        address: "Chinggis, Khentii, Mongolia",
        position: { lat: 47.3147, lng: 110.6525 },
        phone: "+97615662387"
      },
      {
        id: "mn_18",
        name: "Khuvsgul Provincial Hospital",
        address: "Murun, Khuvsgul, Mongolia",
        position: { lat: 49.6342, lng: 100.1672 },
        phone: "+97613822451"
      },
      {
        id: "mn_19",
        name: "Umnugovi Provincial Hospital",
        address: "Dalanzadgad, Umnugovi, Mongolia",
        position: { lat: 43.5775, lng: 104.4272 },
        phone: "+97615332461"
      },
      {
        id: "mn_20",
        name: "Sukhbaatar Provincial Hospital",
        address: "Baruun-Urt, Sukhbaatar, Mongolia",
        position: { lat: 46.6806, lng: 113.2792 },
        phone: "+97615152522"
      },
      {
        id: "mn_21",
        name: "Tuv Provincial Hospital",
        address: "Zuunmod, Tuv, Mongolia",
        position: { lat: 47.7069, lng: 106.9552 },
        phone: "+97612722567"
      },
      {
        id: "mn_22",
        name: "Uvs Provincial Hospital",
        address: "Ulaangom, Uvs, Mongolia",
        position: { lat: 49.9811, lng: 92.0667 },
        phone: "+97614532617"
      },
      {
        id: "mn_23",
        name: "Zavkhan Provincial Hospital",
        address: "Uliastai, Zavkhan, Mongolia",
        position: { lat: 47.7400, lng: 96.8419 },
        phone: "+97614622721"
      },
      {
        id: "mn_24",
        name: "Khan-Uul District Hospital",
        address: "Khan-Uul District, Ulaanbaatar, Mongolia",
        position: { lat: 47.8729, lng: 106.8935 },
        phone: "+97611341020"
      },
      {
        id: "mn_25",
        name: "SOS Medica Mongolia",
        address: "Sukhbaatar District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9182, lng: 106.9207 },
        phone: "+97711464325"
      },
      {
        id: "mn_26",
        name: "National Center for Maternal and Child Health",
        address: "Bayanzurkh District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9312, lng: 106.9367 },
        phone: "+97611362600"
      },
      {
        id: "mn_27",
        name: "National Cancer Center of Mongolia",
        address: "Bayanzurkh District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9220, lng: 106.9350 },
        phone: "+97611450095"
      },
      {
        id: "mn_28",
        name: "National Center for Communicable Diseases",
        address: "Bayanzurkh District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9245, lng: 106.9278 },
        phone: "+97611452869"
      },
      {
        id: "mn_29",
        name: "Grand Med Hospital",
        address: "Khan-Uul District, Ulaanbaatar, Mongolia",
        position: { lat: 47.8688, lng: 106.8044 },
        phone: "+97675551111"
      },
      {
        id: "mn_30",
        name: "State Second Central Hospital",
        address: "Chingeltei District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9245, lng: 106.9102 },
        phone: "+97611324002"
      },
      {
        id: "mn_31",
        name: "Urgoo Maternity Hospital",
        address: "Ulaanbaatar, Mongolia",
        position: { lat: 47.9182, lng: 106.9321 },
        phone: "+97677262600"
      },
      {
        id: "mn_32",
        name: "Achtan Elite Hospital",
        address: "Ulaanbaatar, Mongolia",
        position: { lat: 47.9212, lng: 106.9452 },
        phone: "+97677100003"
      },
      {
        id: "mn_33",
        name: "Bayan-Ulgii Provincial Hospital",
        address: "Ulgii, Bayan-Ulgii, Mongolia",
        position: { lat: 48.9681, lng: 89.9620 },
        phone: "+97614222456"
      },
      {
        id: "mn_34",
        name: "Sukhbaatar District Medical Center",
        address: "Sukhbaatar District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9232, lng: 106.9398 },
        phone: "+97677120000"
      },
      {
        id: "mn_35",
        name: "Songinokhairkhan District Hospital",
        address: "Songinokhairkhan District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9312, lng: 106.8756 },
        phone: "+97611633074"
      },
      {
        id: "mn_36",
        name: "Enerel Hospital",
        address: "Khan-Uul District, Ulaanbaatar, Mongolia",
        position: { lat: 47.8924, lng: 106.8844 },
        phone: "+97675757888"
      },
      {
        id: "mn_37",
        name: "Bayanzurkh District Hospital",
        address: "Bayanzurkh District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9367, lng: 106.9523 },
        phone: "+97611453073"
      },
      {
        id: "mn_38",
        name: "Amgalan Hospital",
        address: "Bayanzurkh District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9475, lng: 106.9821 },
        phone: "+97611456789"
      },
      {
        id: "mn_39",
        name: "National Center for Infectious Diseases",
        address: "Bayanzurkh District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9281, lng: 106.9434 },
        phone: "+97611289175"
      },
      {
        id: "mn_40",
        name: "Millennium Health Center",
        address: "Sukhbaatar District, Ulaanbaatar, Mongolia",
        position: { lat: 47.9176, lng: 106.9285 },
        phone: "+97611319926"
      },
      {
        id: "mn_41",
        name: "Enerel Hospital",
        address: "Khan-Uul district, Ulaanbaatar, Mongolia",
        position: { lat: 47.8954, lng: 106.9043 },
        phone: "+97687074444"
      },
      {
        id: "mn_42",
        name: "Ulaanbaatar Songdo Hospital",
        address: "Seoul Street, Ulaanbaatar, Mongolia",
        position: { lat: 47.9125, lng: 106.9314 },
        phone: "+97677111111"
      },
      {
        id: "mn_43",
        name: "Achtan Hospital",
        address: "Bayanzurkh district, Ulaanbaatar, Mongolia",
        position: { lat: 47.9287, lng: 106.9590 },
        phone: "+97677033555"
      },
      {
        id: "mn_44",
        name: "International Medical Center",
        address: "Chingeltei district, Ulaanbaatar, Mongolia",
        position: { lat: 47.9198, lng: 106.9156 },
        phone: "+97611310601"
      },
      {
        id: "mn_45",
        name: "Central Military Hospital",
        address: "Bayanzurkh district, Ulaanbaatar, Mongolia",
        position: { lat: 47.9342, lng: 106.9513 },
        phone: "+97644113"
      },
      {
        id: "mn_46",
        name: "Dr.Chuluunkhuu's Maternity Hospital",
        address: "Khan-Uul district, Ulaanbaatar, Mongolia",
        position: { lat: 47.8775, lng: 106.8904 },
        phone: "+97611458787"
      },
      {
        id: "mn_47",
        name: "Jiagmed Hospital",
        address: "Bayangol district, Ulaanbaatar, Mongolia",
        position: { lat: 47.9116, lng: 106.8856 },
        phone: "+97699111818"
      },
      {
        id: "mn_48",
        name: "Sun Medical Center",
        address: "Khan-Uul district, Ulaanbaatar, Mongolia",
        position: { lat: 47.8891, lng: 106.9082 },
        phone: "+97677778080"
      },
      {
        id: "mn_49",
        name: "Bud International Hospital",
        address: "Sukhbaatar district, Ulaanbaatar, Mongolia",
        position: { lat: 47.9187, lng: 106.9307 },
        phone: "+97688001000"
      },
      {
        id: "mn_50",
        name: "Darkhan Medical Center",
        address: "Darkhan City, Mongolia",
        position: { lat: 49.4650, lng: 105.9775 },
        phone: "+97670371111"
      },
      {
        id: "mn_51",
        name: "Erdenet Regional Diagnostic Center",
        address: "Erdenet City, Mongolia",
        position: { lat: 49.0536, lng: 104.0730 },
        phone: "+97670154444"
      },
      {
        id: "mn_52",
        name: "Hovd Provincial Hospital",
        address: "Hovd City, Mongolia",
        position: { lat: 48.0057, lng: 91.6419 },
        phone: "+97670432233"
      },
      {
        id: "mn_53",
        name: "Bulgan Provincial Hospital",
        address: "Bulgan City, Mongolia",
        position: { lat: 48.8125, lng: 103.5347 },
        phone: "+97670342259"
      },
      {
        id: "mn_54",
        name: "Khovsgol Provincial Hospital",
        address: "Murun, Khovsgol Province, Mongolia",
        position: { lat: 49.6325, lng: 100.1644 },
        phone: "+97679387234"
      },
      {
        id: "mn_55",
        name: "Uvs Provincial Hospital",
        address: "Ulaangom, Uvs Province, Mongolia",
        position: { lat: 49.9811, lng: 92.0667 },
        phone: "+97670453289"
      },
      {
        id: "mn_56",
        name: "Umnugovi Provincial Hospital",
        address: "Dalanzadgad, Umnugovi Province, Mongolia",
        position: { lat: 43.5775, lng: 104.4272 },
        phone: "+97670532288"
      },
      {
        id: "mn_57",
        name: "Dornod Provincial Hospital",
        address: "Choibalsan, Dornod Province, Mongolia",
        position: { lat: 48.0694, lng: 114.5297 },
        phone: "+97670582222"
      },
      {
        id: "mn_58",
        name: "Bayankhongor Provincial Hospital",
        address: "Bayankhongor City, Mongolia",
        position: { lat: 46.1923, lng: 100.7152 },
        phone: "+97670442244"
      },
      {
        id: "mn_59",
        name: "Govisumber Provincial Hospital",
        address: "Choir, Govisumber Province, Mongolia",
        position: { lat: 46.3614, lng: 108.3595 },
        phone: "+97670542255"
      },
      {
        id: "mn_60",
        name: "Dundgovi Provincial Hospital",
        address: "Mandalgovi, Dundgovi Province, Mongolia",
        position: { lat: 45.7473, lng: 106.2714 },
        phone: "+97670592555"
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
      },
      {
        id: "cn_11",
        name: "Tongji Hospital",
        address: "1095 Jiefang Ave, Wuhan, China",
        position: { lat: 30.5833, lng: 114.2833 },
        phone: "+862783663666"
      },
      {
        id: "cn_12",
        name: "Shanghai Children's Medical Center",
        address: "1678 Dongfang Rd, Shanghai, China",
        position: { lat: 31.2231, lng: 121.5347 },
        phone: "+862138626161"
      },
      {
        id: "cn_13",
        name: "Beijing Children's Hospital",
        address: "56 Nanlishi Rd, Beijing, China",
        position: { lat: 39.8946, lng: 116.3543 },
        phone: "+861059616161"
      },
      {
        id: "cn_14",
        name: "Hunan Provincial People's Hospital",
        address: "61 Jiefang W Rd, Changsha, China",
        position: { lat: 28.1914, lng: 112.9721 },
        phone: "+867318392222"
      },
      {
        id: "cn_15",
        name: "Harbin Medical University Hospital",
        address: "23 Youzheng St, Harbin, China",
        position: { lat: 45.7500, lng: 126.6333 },
        phone: "+864518502000"
      },
      {
        id: "cn_16",
        name: "Fudan University Shanghai Cancer Center",
        address: "270 Dong'an Rd, Shanghai, China",
        position: { lat: 31.1964, lng: 121.4354 },
        phone: "+862164175590"
      },
      {
        id: "cn_17",
        name: "First Affiliated Hospital of Xinjiang Medical University",
        address: "137 Liyushan S Rd, Urumqi, China",
        position: { lat: 43.8231, lng: 87.6142 },
        phone: "+869914366487"
      },
      {
        id: "cn_18",
        name: "Second Affiliated Hospital of Zhejiang University",
        address: "88 Jiefang Rd, Hangzhou, China",
        position: { lat: 30.2936, lng: 120.1614 },
        phone: "+8657187783777"
      },
      {
        id: "cn_19",
        name: "Shandong Provincial Hospital",
        address: "324 Jingwu Rd, Jinan, China",
        position: { lat: 36.6512, lng: 117.0300 },
        phone: "+865318926911"
      },
      {
        id: "cn_20",
        name: "Ruijin Hospital",
        address: "197 Ruijin Er Rd, Shanghai, China",
        position: { lat: 31.2123, lng: 121.4652 },
        phone: "+862164370045"
      },
      {
        id: "cn_21",
        name: "Fuwai Hospital",
        address: "167 Beilishi Rd, Beijing, China",
        position: { lat: 39.9102, lng: 116.3331 },
        phone: "+861088398888"
      },
      {
        id: "cn_22",
        name: "First Affiliated Hospital of Sun Yat-sen University",
        address: "58 Zhongshan 2nd Rd, Guangzhou, China",
        position: { lat: 23.1291, lng: 113.2644 },
        phone: "+862087755766"
      },
      {
        id: "cn_23",
        name: "Qilu Hospital of Shandong University",
        address: "107 Wenhua W Rd, Jinan, China",
        position: { lat: 36.6522, lng: 117.0206 },
        phone: "+865318216916"
      },
      {
        id: "cn_24",
        name: "Nanfang Hospital",
        address: "1838 Guangzhou N Ave, Guangzhou, China",
        position: { lat: 23.1360, lng: 113.3244 },
        phone: "+862061641888"
      },
      {
        id: "cn_25",
        name: "First Affiliated Hospital of China Medical University",
        address: "155 Nanjing N St, Shenyang, China",
        position: { lat: 41.8027, lng: 123.4186 },
        phone: "+862483282114"
      },
      {
        id: "cn_26",
        name: "Drum Tower Hospital",
        address: "321 Zhongshan Rd, Nanjing, China",
        position: { lat: 32.0500, lng: 118.7833 },
        phone: "+862583304616"
      },
      {
        id: "cn_27",
        name: "Shanghai East Hospital",
        address: "150 Jimo Rd, Shanghai, China",
        position: { lat: 31.2304, lng: 121.5452 },
        phone: "+862138804518"
      },
      {
        id: "cn_28",
        name: "First Hospital of Jilin University",
        address: "71 Xinmin St, Changchun, China",
        position: { lat: 43.8800, lng: 125.3236 },
        phone: "+8643181876666"
      },
      {
        id: "cn_29",
        name: "Union Hospital, Tongji Medical College",
        address: "1277 Jiefang Ave, Wuhan, China",
        position: { lat: 30.5851, lng: 114.3001 },
        phone: "+862785726114"
      },
      {
        id: "cn_30",
        name: "Beijing Friendship Hospital",
        address: "95 Yongan Rd, Beijing, China",
        position: { lat: 39.8836, lng: 116.3664 },
        phone: "+861063138888"
      },
      {
        id: "cn_31",
        name: "Beijing Anzhen Hospital",
        address: "2 Anzhen Rd, Chaoyang District, Beijing, China",
        position: { lat: 39.9778, lng: 116.4175 },
        phone: "+861064456677"
      },
      {
        id: "cn_32",
        name: "Shanghai Tenth People's Hospital",
        address: "301 Yanchang Middle Rd, Shanghai, China",
        position: { lat: 31.2602, lng: 121.4592 },
        phone: "+862166301000"
      },
      {
        id: "cn_33",
        name: "Guangzhou Women and Children's Medical Center",
        address: "9 Jinsui Rd, Guangzhou, China",
        position: { lat: 23.1175, lng: 113.3245 },
        phone: "+862038367602"
      },
      {
        id: "cn_34",
        name: "Shanghai Chest Hospital",
        address: "241 Huaihai West Rd, Shanghai, China",
        position: { lat: 31.2005, lng: 121.4288 },
        phone: "+862162821990"
      },
      {
        id: "cn_35",
        name: "West China Second University Hospital",
        address: "20 Renmin South Rd, Chengdu, China",
        position: { lat: 30.6285, lng: 104.0614 },
        phone: "+862885503601"
      },
      {
        id: "cn_36",
        name: "Tianjin First Central Hospital",
        address: "24 Fukang Rd, Tianjin, China",
        position: { lat: 39.0897, lng: 117.1957 },
        phone: "+862223626988"
      },
      {
        id: "cn_37",
        name: "Zhejiang Provincial People's Hospital",
        address: "158 Shangtang Rd, Hangzhou, China",
        position: { lat: 30.3031, lng: 120.1418 },
        phone: "+865718893333"
      },
      {
        id: "cn_38",
        name: "Henan Provincial People's Hospital",
        address: "7 Weiwu Rd, Zhengzhou, China",
        position: { lat: 34.7561, lng: 113.6653 },
        phone: "+863716580114"
      },
      {
        id: "cn_39",
        name: "Sichuan Provincial People's Hospital",
        address: "32 West Second Section First Ring Rd, Chengdu, China",
        position: { lat: 30.6532, lng: 104.0655 },
        phone: "+862887393339"
      },
      {
        id: "cn_40",
        name: "Zhujiang Hospital of Southern Medical University",
        address: "253 Gongye Ave, Guangzhou, China",
        position: { lat: 23.1725, lng: 113.3428 },
        phone: "+862061643010"
      },
      {
        id: "cn_41",
        name: "Sir Run Run Shaw Hospital",
        address: "3 Qingchun E Rd, Hangzhou, China",
        position: { lat: 30.2404, lng: 120.1694 },
        phone: "+86057186006000"
      },
      {
        id: "cn_42",
        name: "The First Hospital of Jiaxing",
        address: "1882 Zhonghuan S Rd, Jiaxing, China",
        position: { lat: 30.7536, lng: 120.7406 },
        phone: "+86057382082937"
      },
      {
        id: "cn_43",
        name: "Nanjing First Hospital",
        address: "68 Changle Rd, Nanjing, China",
        position: { lat: 32.0469, lng: 118.7880 },
        phone: "+862552271000"
      },
      {
        id: "cn_44",
        name: "Shanghai Tenth People's Hospital",
        address: "301 Yanchang Rd, Shanghai, China",
        position: { lat: 31.2560, lng: 121.4539 },
        phone: "+862166301000"
      },
      {
        id: "cn_45",
        name: "The Second Hospital of Dalian Medical University",
        address: "467 Zhongshan Rd, Dalian, China",
        position: { lat: 38.9167, lng: 121.6147 },
        phone: "+8641184671291"
      },
      {
        id: "cn_46",
        name: "The First People's Hospital of Foshan",
        address: "81 Lingnan N Ave, Foshan, China",
        position: { lat: 23.0220, lng: 113.1300 },
        phone: "+86075783833633"
      },
      {
        id: "cn_47",
        name: "Tangdu Hospital",
        address: "1 Xinsi Rd, Xi'an, China",
        position: { lat: 34.2591, lng: 108.9872 },
        phone: "+862984777777"
      },
      {
        id: "cn_48",
        name: "Henan Provincial People's Hospital",
        address: "7 Weiwu Rd, Zhengzhou, China",
        position: { lat: 34.7539, lng: 113.6541 },
        phone: "+8637165580014"
      },
      {
        id: "cn_49",
        name: "Hainan General Hospital",
        address: "19 Xiuhua Rd, Haikou, China",
        position: { lat: 20.0422, lng: 110.3250 },
        phone: "+8689868622222"
      },
      {
        id: "cn_50",
        name: "The Third Affiliated Hospital of Kunming Medical University",
        address: "519 Kunzhou Rd, Kunming, China",
        position: { lat: 25.0520, lng: 102.7056 },
        phone: "+868715317662"
      },
      {
        id: "cn_51",
        name: "Beijing Tongren Hospital",
        address: "1 Dongjiaomin Ln, Beijing, China",
        position: { lat: 39.9047, lng: 116.4199 },
        phone: "+861058269911"
      },
      {
        id: "cn_52",
        name: "The First Affiliated Hospital of Jinan University",
        address: "613 Huangpu W Ave, Guangzhou, China",
        position: { lat: 23.1249, lng: 113.2623 },
        phone: "+862038688888"
      },
      {
        id: "cn_53",
        name: "Xuzhou Central Hospital",
        address: "199 Jiefang S Rd, Xuzhou, China",
        position: { lat: 34.2738, lng: 117.1824 },
        phone: "+8651683956001"
      },
      {
        id: "cn_54",
        name: "Ningbo First Hospital",
        address: "59 Liuting St, Ningbo, China",
        position: { lat: 29.8736, lng: 121.5470 },
        phone: "+86574187085555"
      },
      {
        id: "cn_55",
        name: "Guangdong Provincial People's Hospital",
        address: "106 Zhongshan 2nd Rd, Guangzhou, China",
        position: { lat: 23.1393, lng: 113.2594 },
        phone: "+862083827812"
      },
      {
        id: "cn_56",
        name: "Shenzhen People's Hospital",
        address: "1017 Dongmen N Rd, Shenzhen, China",
        position: { lat: 22.5550, lng: 114.1232 },
        phone: "+8675525533018"
      },
      {
        id: "cn_57",
        name: "The First Affiliated Hospital of Nanchang University",
        address: "17 Yongwai St, Nanchang, China",
        position: { lat: 28.6832, lng: 115.8935 },
        phone: "+867918693001"
      },
      {
        id: "cn_58",
        name: "Wuhan Union Hospital West Campus",
        address: "473 Hanzheng St, Wuhan, China",
        position: { lat: 30.5858, lng: 114.2882 },
        phone: "+862785351234"
      },
      {
        id: "cn_59",
        name: "Suzhou Municipal Hospital",
        address: "242 Guangji Rd, Suzhou, China",
        position: { lat: 31.3009, lng: 120.6279 },
        phone: "+865126522812"
      },
      {
        id: "cn_60",
        name: "Zhongshan Hospital, Xiamen University",
        address: "201-209 Hubin S Rd, Xiamen, China",
        position: { lat: 24.4452, lng: 118.0879 },
        phone: "+865922993082"
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
      },
      {
        id: "jp_11",
        name: "Jikei University Hospital",
        address: "3-19-18 Nishi-Shinbashi, Minato, Tokyo, Japan",
        position: { lat: 35.6702, lng: 139.7519 },
        phone: "+81334331111"
      },
      {
        id: "jp_12",
        name: "Hiroshima University Hospital",
        address: "1-2-3 Kasumi, Minami, Hiroshima, Japan",
        position: { lat: 34.3959, lng: 132.4566 },
        phone: "+81822575555"
      },
      {
        id: "jp_13",
        name: "Okayama University Hospital",
        address: "2-5-1 Shikata-cho, Kita, Okayama, Japan",
        position: { lat: 34.6573, lng: 133.9207 },
        phone: "+81862235111"
      },
      {
        id: "jp_14",
        name: "Niigata University Medical & Dental Hospital",
        address: "1-754 Asahimachi-dori, Chuo, Niigata, Japan",
        position: { lat: 37.9170, lng: 139.0403 },
        phone: "+81252272000"
      },
      {
        id: "jp_15",
        name: "Keiyukai Sapporo Hospital",
        address: "14-291 Hondori, Shiroishi, Sapporo, Hokkaido, Japan",
        position: { lat: 43.0483, lng: 141.3630 },
        phone: "+81118651111"
      },
      {
        id: "jp_16",
        name: "Juntendo University Hospital",
        address: "3-1-3 Hongo, Bunkyo, Tokyo, Japan",
        position: { lat: 35.7056, lng: 139.7669 },
        phone: "+81338133111"
      },
      {
        id: "jp_17",
        name: "Kobe City Medical Center General Hospital",
        address: "2-1-1 Minatojima-minamimachi, Chuo, Kobe, Japan",
        position: { lat: 34.6720, lng: 135.1993 },
        phone: "+81783025001"
      },
      {
        id: "jp_18",
        name: "Kameda Medical Center",
        address: "929 Higashi-cho, Kamogawa, Chiba, Japan",
        position: { lat: 35.1147, lng: 140.1211 },
        phone: "+81470922211"
      },
      {
        id: "jp_19",
        name: "Wakayama Medical University Hospital",
        address: "811-1 Kimiidera, Wakayama, Japan",
        position: { lat: 34.2326, lng: 135.1736 },
        phone: "+81734471300"
      },
      {
        id: "jp_20",
        name: "Kumamoto University Hospital",
        address: "1-1-1 Honjo, Chuo, Kumamoto, Japan",
        position: { lat: 32.8046, lng: 130.7199 },
        phone: "+81963735224"
      },
      {
        id: "jp_21",
        name: "Tsukuba University Hospital",
        address: "2-1-1 Amakubo, Tsukuba, Ibaraki, Japan",
        position: { lat: 36.0940, lng: 140.1065 },
        phone: "+81298531000"
      },
      {
        id: "jp_22",
        name: "Tokushima University Hospital",
        address: "2-50-1 Kuramoto-cho, Tokushima, Japan",
        position: { lat: 34.0706, lng: 134.5542 },
        phone: "+81886315111"
      },
      {
        id: "jp_23",
        name: "Showa University Hospital",
        address: "1-5-8 Hatanodai, Shinagawa, Tokyo, Japan",
        position: { lat: 35.6250, lng: 139.7157 },
        phone: "+81337848000"
      },
      {
        id: "jp_24",
        name: "Ehime University Hospital",
        address: "Shitsukawa, Toon, Ehime, Japan",
        position: { lat: 33.8493, lng: 132.7692 },
        phone: "+81899641111"
      },
      {
        id: "jp_25",
        name: "Tokyo Medical University Hospital",
        address: "6-7-1 Nishi-Shinjuku, Shinjuku, Tokyo, Japan",
        position: { lat: 35.6888, lng: 139.6909 },
        phone: "+81333426111"
      },
      {
        id: "jp_26",
        name: "Kochi Medical School Hospital",
        address: "Kohasu, Oko-cho, Nankoku, Kochi, Japan",
        position: { lat: 33.5976, lng: 133.6134 },
        phone: "+81888802222"
      },
      {
        id: "jp_27",
        name: "Kagawa University Hospital",
        address: "1750-1 Ikenobe, Miki, Kita, Kagawa, Japan",
        position: { lat: 34.2783, lng: 134.1358 },
        phone: "+81878912171"
      },
      {
        id: "jp_28",
        name: "Saitama Medical University Hospital",
        address: "38 Morohongo, Moroyama, Saitama, Japan",
        position: { lat: 35.9424, lng: 139.2878 },
        phone: "+81492761111"
      },
      {
        id: "jp_29",
        name: "Chiba University Hospital",
        address: "1-8-1 Inohana, Chuo, Chiba, Japan",
        position: { lat: 35.6075, lng: 140.1240 },
        phone: "+81432222051"
      },
      {
        id: "jp_30",
        name: "Kanazawa University Hospital",
        address: "13-1 Takara-machi, Kanazawa, Ishikawa, Japan",
        position: { lat: 36.5649, lng: 136.6628 },
        phone: "+81762652000"
      },
      {
        id: "jp_31",
        name: "Japanese Red Cross Medical Center",
        address: "4-1-22 Hiroo, Shibuya, Tokyo, Japan",
        position: { lat: 35.6506, lng: 139.7113 },
        phone: "+81334001311"
      },
      {
        id: "jp_32",
        name: "Osaka City University Hospital",
        address: "1-5-7 Asahi-machi, Abeno, Osaka, Japan",
        position: { lat: 34.6366, lng: 135.5166 },
        phone: "+81666453096"
      },
      {
        id: "jp_33",
        name: "Tokai University Hospital",
        address: "143 Shimokasuya, Isehara, Kanagawa, Japan",
        position: { lat: 35.3738, lng: 139.2731 },
        phone: "+81463931121"
      },
      {
        id: "jp_34",
        name: "Fujita Health University Hospital",
        address: "1-98 Dengakugakubo, Kutsukake-cho, Toyoake, Aichi, Japan",
        position: { lat: 35.0481, lng: 137.0114 },
        phone: "+81562939288"
      },
      {
        id: "jp_35",
        name: "Gifu University Hospital",
        address: "1-1 Yanagido, Gifu, Japan",
        position: { lat: 35.4644, lng: 136.7615 },
        phone: "+81582303131"
      },
      {
        id: "jp_36",
        name: "Kurume University Hospital",
        address: "67 Asahi-machi, Kurume, Fukuoka, Japan",
        position: { lat: 33.3111, lng: 130.5211 },
        phone: "+81942353311"
      },
      {
        id: "jp_37",
        name: "Shiga University of Medical Science Hospital",
        address: "Seta Tsukinowa-cho, Otsu, Shiga, Japan",
        position: { lat: 35.0026, lng: 135.9954 },
        phone: "+81775482111"
      },
      {
        id: "jp_38",
        name: "Yamaguchi University Hospital",
        address: "1-1-1 Minamikogushi, Ube, Yamaguchi, Japan",
        position: { lat: 33.9518, lng: 131.2617 },
        phone: "+81836222111"
      },
      {
        id: "jp_39",
        name: "Akita University Hospital",
        address: "1-1-1 Hondo, Akita, Japan",
        position: { lat: 39.8172, lng: 140.0743 },
        phone: "+81188341111"
      },
      {
        id: "jp_40",
        name: "Iwate Medical University Hospital",
        address: "1-1-1 Idaidori, Yahaba-cho, Shiwa-gun, Iwate, Japan",
        position: { lat: 39.6126, lng: 141.1545 },
        phone: "+81196515111"
      },
      {
        id: "jp_41",
        name: "Japanese Red Cross Ashikaga Hospital",
        address: "3-2100 Honjo, Ashikaga, Tochigi, Japan",
        position: { lat: 36.3337, lng: 139.4480 },
        phone: "+81284224411"
      },
      {
        id: "jp_42",
        name: "Kanazawa University Hospital",
        address: "13-1 Takara-machi, Kanazawa, Ishikawa, Japan",
        position: { lat: 36.5602, lng: 136.6526 },
        phone: "+81762652000"
      },
      {
        id: "jp_43",
        name: "Fujita Health University Hospital",
        address: "1-98 Dengakugakubo, Kutsukake, Toyoake, Aichi, Japan",
        position: { lat: 35.0824, lng: 137.0334 },
        phone: "+81562931101"
      },
      {
        id: "jp_44",
        name: "Kurume University Hospital",
        address: "67 Asahi-machi, Kurume, Fukuoka, Japan",
        position: { lat: 33.3142, lng: 130.5179 },
        phone: "+81942353311"
      },
      {
        id: "jp_45",
        name: "Aichi Medical University Hospital",
        address: "1-1 Yazakokarimata, Nagakute, Aichi, Japan",
        position: { lat: 35.1788, lng: 137.0620 },
        phone: "+81561623311"
      },
      {
        id: "jp_46",
        name: "Sapporo Medical University Hospital",
        address: "South 1 West 16, Chuo Ward, Sapporo, Hokkaido, Japan",
        position: { lat: 43.0456, lng: 141.3414 },
        phone: "+81116111111"
      },
      {
        id: "jp_47",
        name: "Akita University Hospital",
        address: "1-1-1 Hondo, Akita, Japan",
        position: { lat: 39.8083, lng: 140.0917 },
        phone: "+81188343652"
      },
      {
        id: "jp_48",
        name: "Hyogo College of Medicine Hospital",
        address: "1-1 Mukogawacho, Nishinomiya, Hyogo, Japan",
        position: { lat: 34.7381, lng: 135.3656 },
        phone: "+81798456111"
      },
      {
        id: "jp_49",
        name: "Iwaki City Medical Center",
        address: "16 Kusehara, Uchigomimayamachi, Iwaki, Fukushima, Japan",
        position: { lat: 37.0505, lng: 140.8901 },
        phone: "+81246261234"
      },
      {
        id: "jp_50",
        name: "Saga University Hospital",
        address: "5-1-1 Nabeshima, Saga, Japan",
        position: { lat: 33.2499, lng: 130.2970 },
        phone: "+81952316511"
      },
      {
        id: "jp_51",
        name: "Gifu University Hospital",
        address: "1-1 Yanagido, Gifu, Japan",
        position: { lat: 35.4660, lng: 136.7422 },
        phone: "+81582306000"
      },
      {
        id: "jp_52",
        name: "Mie University Hospital",
        address: "2-174 Edobashi, Tsu, Mie, Japan",
        position: { lat: 34.7364, lng: 136.5102 },
        phone: "+81592321111"
      },
      {
        id: "jp_53",
        name: "Aizawa Hospital",
        address: "2-5-1 Honjo, Matsumoto, Nagano, Japan",
        position: { lat: 36.2380, lng: 137.9717 },
        phone: "+81263333151"
      },
      {
        id: "jp_54",
        name: "Yamagata University Hospital",
        address: "2-2-2 Iida-Nishi, Yamagata, Japan",
        position: { lat: 38.2420, lng: 140.3324 },
        phone: "+81236335111"
      },
      {
        id: "jp_55",
        name: "Japanese Red Cross Kyoto Daiichi Hospital",
        address: "15-749 Honmachi, Higashiyama Ward, Kyoto, Japan",
        position: { lat: 35.0098, lng: 135.7719 },
        phone: "+81752611121"
      },
      {
        id: "jp_56",
        name: "Tottori University Hospital",
        address: "36-1 Nishi-cho, Yonago, Tottori, Japan",
        position: { lat: 35.5144, lng: 133.4852 },
        phone: "+81859333000"
      },
      {
        id: "jp_57",
        name: "Shimane University Hospital",
        address: "89-1 Enya-cho, Izumo, Shimane, Japan",
        position: { lat: 35.3693, lng: 132.7655 },
        phone: "+81853201111"
      },
      {
        id: "jp_58",
        name: "Kagoshima University Hospital",
        address: "8-35-1 Sakuragaoka, Kagoshima, Japan",
        position: { lat: 31.5834, lng: 130.5584 },
        phone: "+81992641111"
      },
      {
        id: "jp_59",
        name: "Nihon University Hospital",
        address: "30-1 Oyaguchi Kamicho, Itabashi, Tokyo, Japan",
        position: { lat: 35.7633, lng: 139.6924 },
        phone: "+81339721101"
      },
      {
        id: "jp_60",
        name: "National Center for Global Health and Medicine",
        address: "1-21-1 Toyama, Shinjuku, Tokyo, Japan",
        position: { lat: 35.7047, lng: 139.7348 },
        phone: "+81332027181"
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
      },
      {
        id: "kr_11",
        name: "Korea University Anam Hospital",
        address: "73 Inchon-ro, Seongbuk-gu, Seoul, Korea",
        position: { lat: 37.5870, lng: 127.0266 },
        phone: "+82220405114"
      },
      {
        id: "kr_12",
        name: "Seoul National University Bundang Hospital",
        address: "82 Gumi-ro 173beon-gil, Bundang-gu, Seongnam, Korea",
        position: { lat: 37.3591, lng: 127.1247 },
        phone: "+821588001589"
      },
      {
        id: "kr_13",
        name: "Gangnam Severance Hospital",
        address: "211 Eonju-ro, Gangnam-gu, Seoul, Korea",
        position: { lat: 37.4923, lng: 127.0356 },
        phone: "+82220193114"
      },
      {
        id: "kr_14",
        name: "Catholic University of Korea Incheon St. Mary's Hospital",
        address: "56 Dongsu-ro, Bupyeong-gu, Incheon, Korea",
        position: { lat: 37.4837, lng: 126.7224 },
        phone: "+82328201011"
      },
      {
        id: "kr_15",
        name: "Konkuk University Medical Center",
        address: "120-1 Neungdong-ro, Gwangjin-gu, Seoul, Korea",
        position: { lat: 37.5402, lng: 127.0789 },
        phone: "+82220305555"
      },
      {
        id: "kr_16",
        name: "Ulsan University Hospital",
        address: "877 Bangeojinsunhwando-ro, Dong-gu, Ulsan, Korea",
        position: { lat: 35.5370, lng: 129.3177 },
        phone: "+82522508000"
      },
      {
        id: "kr_17",
        name: "Chungnam National University Hospital",
        address: "282 Munhwa-ro, Jung-gu, Daejeon, Korea",
        position: { lat: 36.3219, lng: 127.4213 },
        phone: "+82422807114"
      },
      {
        id: "kr_18",
        name: "Chungbuk National University Hospital",
        address: "776 1sunhwan-ro, Seowon-gu, Cheongju, Korea",
        position: { lat: 36.6219, lng: 127.4975 },
        phone: "+82432696950"
      },
      {
        id: "kr_19",
        name: "Jeju National University Hospital",
        address: "15 Aran 13-gil, Jeju-si, Jeju, Korea",
        position: { lat: 33.4612, lng: 126.5450 },
        phone: "+82647171075"
      },
      {
        id: "kr_20",
        name: "Kyung Hee University Hospital",
        address: "23 Kyungheedae-ro, Dongdaemun-gu, Seoul, Korea",
        position: { lat: 37.5941, lng: 127.0518 },
        phone: "+82129582114"
      },
      {
        id: "kr_21",
        name: "Ewha Womans University Medical Center",
        address: "1071 Anyangcheon-ro, Yangcheon-gu, Seoul, Korea",
        position: { lat: 37.5573, lng: 126.8965 },
        phone: "+82226505114"
      },
      {
        id: "kr_22",
        name: "Ajou University Hospital",
        address: "164 World cup-ro, Yeongtong-gu, Suwon, Korea",
        position: { lat: 37.2784, lng: 127.0436 },
        phone: "+82312195678"
      },
      {
        id: "kr_23",
        name: "Inha University Hospital",
        address: "27 Inhang-ro, Jung-gu, Incheon, Korea",
        position: { lat: 37.4562, lng: 126.6326 },
        phone: "+82328909114"
      },
      {
        id: "kr_24",
        name: "Chonbuk National University Hospital",
        address: "20 Geonji-ro, Deokjin-gu, Jeonju, Korea",
        position: { lat: 35.8460, lng: 127.1429 },
        phone: "+82632501114"
      },
      {
        id: "kr_25",
        name: "Dongguk University Ilsan Hospital",
        address: "27 Dongguk-ro, Ilsandong-gu, Goyang, Korea",
        position: { lat: 37.6608, lng: 126.8306 },
        phone: "+82319617000"
      },
      {
        id: "kr_26",
        name: "Soonchunhyang University Seoul Hospital",
        address: "59 Daesagwan-ro, Yongsan-gu, Seoul, Korea",
        position: { lat: 37.5446, lng: 126.9665 },
        phone: "+82227099114"
      },
      {
        id: "kr_27",
        name: "Yeungnam University Medical Center",
        address: "170 Hyeonchung-ro, Nam-gu, Daegu, Korea",
        position: { lat: 35.8417, lng: 128.5962 },
        phone: "+82532505114"
      },
      {
        id: "kr_28",
        name: "Wonkwang University Hospital",
        address: "895 Muwang-ro, Iksan, Korea",
        position: { lat: 35.9586, lng: 126.9631 },
        phone: "+82638591114"
      },
      {
        id: "kr_29",
        name: "Inje University Busan Paik Hospital",
        address: "75 Bokji-ro, Busanjin-gu, Busan, Korea",
        position: { lat: 35.1686, lng: 129.0533 },
        phone: "+82518906114"
      },
      {
        id: "kr_30",
        name: "Hanyang University Seoul Hospital",
        address: "222-1 Wangsimni-ro, Seongdong-gu, Seoul, Korea",
        position: { lat: 37.5574, lng: 127.0442 },
        phone: "+82222908114"
      },
      {
        id: "kr_31",
        name: "CHA Bundang Medical Center",
        address: "59 Yatap-ro, Bundang-gu, Seongnam, Korea",
        position: { lat: 37.3846, lng: 127.1246 },
        phone: "+82317801114"
      },
      {
        id: "kr_32",
        name: "Kyung Hee University Hospital at Gangdong",
        address: "892 Dongnam-ro, Gangdong-gu, Seoul, Korea",
        position: { lat: 37.5536, lng: 127.1575 },
        phone: "+82214405114"
      },
      {
        id: "kr_33",
        name: "Keimyung University Dongsan Medical Center",
        address: "56 Dalseong-ro, Jung-gu, Daegu, Korea",
        position: { lat: 35.8686, lng: 128.5935 },
        phone: "+82532507114"
      },
      {
        id: "kr_34",
        name: "Gyeongsang National University Hospital",
        address: "79 Gangnam-ro, Jinju, Korea",
        position: { lat: 35.1761, lng: 128.0933 },
        phone: "+82557508114"
      },
      {
        id: "kr_35",
        name: "Pusan National University Yangsan Hospital",
        address: "20 Geumo-ro, Mulgeum-eup, Yangsan, Korea",
        position: { lat: 35.2392, lng: 129.0177 },
        phone: "+82553601000"
      },
      {
        id: "kr_36",
        name: "Catholic Kwandong University International St. Mary's Hospital",
        address: "25 Simgok-ro 100beon-gil, Seo-gu, Incheon, Korea",
        position: { lat: 37.5644, lng: 126.6672 },
        phone: "+82327116000"
      },
      {
        id: "kr_37",
        name: "Kangwon National University Hospital",
        address: "156 Baengnyeong-ro, Chuncheon, Korea",
        position: { lat: 37.8566, lng: 127.7505 },
        phone: "+82332582000"
      },
      {
        id: "kr_38",
        name: "Dankook University Hospital",
        address: "201 Manghyang-ro, Dongnam-gu, Cheonan, Korea",
        position: { lat: 36.8220, lng: 127.1478 },
        phone: "+82415506000"
      },
      {
        id: "kr_39",
        name: "Gangnam Sacred Heart Hospital",
        address: "1 Singil-ro, Yeongdeungpo-gu, Seoul, Korea",
        position: { lat: 37.5267, lng: 126.9000 },
        phone: "+82228298200"
      },
      {
        id: "kr_40",
        name: "Korea Cancer Center Hospital",
        address: "75 Nowon-ro, Nowon-gu, Seoul, Korea",
        position: { lat: 37.6486, lng: 127.0787 },
        phone: "+82220701000"
      },
      {
        id: "kr_41",
        name: "Chung-Ang University Hospital",
        address: "102 Heukseok-ro, Dongjak-gu, Seoul, Korea",
        position: { lat: 37.5049, lng: 126.9600 },
        phone: "+82622246161"
      },
      {
        id: "kr_42",
        name: "Yonsei University Wonju Severance Christian Hospital",
        address: "20 Ilsan-ro, Wonju, Gangwon, Korea",
        position: { lat: 37.3449, lng: 127.9443 },
        phone: "+82337410114"
      },
      {
        id: "kr_43",
        name: "Inje University Ilsan Paik Hospital",
        address: "170 Juhwa-ro, Ilsanseo-gu, Goyang, Korea",
        position: { lat: 37.6682, lng: 126.7742 },
        phone: "+82319101114"
      },
      {
        id: "kr_44",
        name: "St. Vincent's Hospital",
        address: "93 Jungbu-daero, Paldal-gu, Suwon, Korea",
        position: { lat: 37.2863, lng: 127.0132 },
        phone: "+82312498204"
      },
      {
        id: "kr_45",
        name: "Gyeongsang National University Hospital",
        address: "79 Gangnam-ro, Jinju, Korea",
        position: { lat: 35.1803, lng: 128.0911 },
        phone: "+82557508779"
      },
      {
        id: "kr_46",
        name: "Kangbuk Samsung Hospital",
        address: "29 Saemunan-ro, Jongno-gu, Seoul, Korea",
        position: { lat: 37.5702, lng: 126.9703 },
        phone: "+82220012001"
      },
      {
        id: "kr_47",
        name: "CHA Bundang Medical Center",
        address: "59 Yatap-ro, Bundang-gu, Seongnam, Korea",
        position: { lat: 37.3981, lng: 127.1263 },
        phone: "+82317801000"
      },
      {
        id: "kr_48",
        name: "Daegu Catholic University Medical Center",
        address: "33 Duryugongwon-ro 17-gil, Nam-gu, Daegu, Korea",
        position: { lat: 35.8463, lng: 128.5669 },
        phone: "+82536504000"
      },
      {
        id: "kr_49",
        name: "Daegu Fatima Hospital",
        address: "99 Ayang-ro, Dong-gu, Daegu, Korea",
        position: { lat: 35.8770, lng: 128.6423 },
        phone: "+82532406000"
      },
      {
        id: "kr_50",
        name: "Kangwon National University Hospital",
        address: "156 Baengnyeong-ro, Chuncheon, Korea",
        position: { lat: 37.8650, lng: 127.7467 },
        phone: "+82332585000"
      },
      {
        id: "kr_51",
        name: "Kosin University Gospel Hospital",
        address: "262 Gamcheon-ro, Seo-gu, Busan, Korea",
        position: { lat: 35.0856, lng: 129.0179 },
        phone: "+82519900114"
      },
      {
        id: "kr_52",
        name: "Cheju Halla Hospital",
        address: "65 Doryeong-ro, Jeju-si, Jeju, Korea",
        position: { lat: 33.4917, lng: 126.4769 },
        phone: "+82647406000"
      },
      {
        id: "kr_53",
        name: "Kyungpook National University Chilgok Hospital",
        address: "807 Hoguk-ro, Buk-gu, Daegu, Korea",
        position: { lat: 35.9429, lng: 128.5720 },
        phone: "+82534230000"
      },
      {
        id: "kr_54",
        name: "Busan St. Mary's Hospital",
        address: "25-14 Yongho-ro 232beon-gil, Nam-gu, Busan, Korea",
        position: { lat: 35.1292, lng: 129.1021 },
        phone: "+82515108000"
      },
      {
        id: "kr_55",
        name: "Pusan National University Yangsan Hospital",
        address: "20 Geumo-ro, Mulgeum-eup, Yangsan, Korea",
        position: { lat: 35.3238, lng: 129.0090 },
        phone: "+82553601000"
      },
      {
        id: "kr_56",
        name: "Soonchunhyang University Cheonan Hospital",
        address: "31 Suncheonhyang 6-gil, Dongnam-gu, Cheonan, Korea",
        position: { lat: 36.8142, lng: 127.1481 },
        phone: "+82415701000"
      },
      {
        id: "kr_57",
        name: "Gwangju Christian Hospital",
        address: "37 Yangrim-ro, Nam-gu, Gwangju, Korea",
        position: { lat: 35.1345, lng: 126.9118 },
        phone: "+82622229000"
      },
      {
        id: "kr_58",
        name: "Dankook University Hospital",
        address: "201 Manghyang-ro, Dongnam-gu, Cheonan, Korea",
        position: { lat: 36.8454, lng: 127.1711 },
        phone: "+82415506000"
      },
      {
        id: "kr_59",
        name: "Inje University Haeundae Paik Hospital",
        address: "875 Haeun-daero, Haeundae-gu, Busan, Korea",
        position: { lat: 35.1633, lng: 129.1756 },
        phone: "+82517970100"
      },
      {
        id: "kr_60",
        name: "Seoul Red Cross Hospital",
        address: "9 Saemunan-ro, Jongno-gu, Seoul, Korea",
        position: { lat: 37.5725, lng: 126.9710 },
        phone: "+82220020100"
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
      },
      {
        id: "us_11",
        name: "Northwestern Memorial Hospital",
        address: "251 E Huron St, Chicago, IL, USA",
        position: { lat: 41.8949, lng: -87.6208 },
        phone: "+13129262000"
      },
      {
        id: "us_12",
        name: "Duke University Hospital",
        address: "2301 Erwin Rd, Durham, NC, USA",
        position: { lat: 36.0074, lng: -78.9338 },
        phone: "+19196842413"
      },
      {
        id: "us_13",
        name: "Barnes-Jewish Hospital",
        address: "1 Barnes Jewish Hospital Plaza, St. Louis, MO, USA",
        position: { lat: 38.6362, lng: -90.2648 },
        phone: "+13147475000"
      },
      {
        id: "us_14",
        name: "Vanderbilt University Medical Center",
        address: "1211 Medical Center Dr, Nashville, TN, USA",
        position: { lat: 36.1435, lng: -86.8029 },
        phone: "+16159222000"
      },
      {
        id: "us_15",
        name: "NYU Langone Hospitals",
        address: "550 1st Ave, New York, NY, USA",
        position: { lat: 40.7421, lng: -73.9739 },
        phone: "+12122636000"
      },
      {
        id: "us_16",
        name: "Cedars-Sinai Medical Center",
        address: "8700 Beverly Blvd, Los Angeles, CA, USA",
        position: { lat: 34.0746, lng: -118.3801 },
        phone: "+13104232336"
      },
      {
        id: "us_17",
        name: "University of Michigan Hospitals",
        address: "1500 E Medical Center Dr, Ann Arbor, MI, USA",
        position: { lat: 42.2834, lng: -83.7297 },
        phone: "+17349364000"
      },
      {
        id: "us_18",
        name: "University of Washington Medical Center",
        address: "1959 NE Pacific St, Seattle, WA, USA",
        position: { lat: 47.6498, lng: -122.3073 },
        phone: "+12065983300"
      },
      {
        id: "us_19",
        name: "Penn Medicine Hospital of the University of Pennsylvania",
        address: "3400 Spruce St, Philadelphia, PA, USA",
        position: { lat: 39.9498, lng: -75.1937 },
        phone: "+12156628000"
      },
      {
        id: "us_20",
        name: "UPMC Presbyterian",
        address: "200 Lothrop St, Pittsburgh, PA, USA",
        position: { lat: 40.4427, lng: -79.9612 },
        phone: "+14126476000"
      },
      {
        id: "us_21",
        name: "Emory University Hospital",
        address: "1364 Clifton Rd NE, Atlanta, GA, USA",
        position: { lat: 33.7906, lng: -84.3227 },
        phone: "+14047121400"
      },
      {
        id: "us_22",
        name: "UC Davis Medical Center",
        address: "2315 Stockton Blvd, Sacramento, CA, USA",
        position: { lat: 38.5547, lng: -121.4538 },
        phone: "+19167342011"
      },
      {
        id: "us_23",
        name: "Indiana University Health University Hospital",
        address: "550 N University Blvd, Indianapolis, IN, USA",
        position: { lat: 39.7773, lng: -86.1711 },
        phone: "+13179442000"
      },
      {
        id: "us_24",
        name: "Oregon Health & Science University Hospital",
        address: "3181 SW Sam Jackson Park Rd, Portland, OR, USA",
        position: { lat: 45.4984, lng: -122.6857 },
        phone: "+15034948311"
      },
      {
        id: "us_25",
        name: "The University of Kansas Hospital",
        address: "4000 Cambridge St, Kansas City, KS, USA",
        position: { lat: 39.0570, lng: -94.6080 },
        phone: "+19135886100"
      },
      {
        id: "us_26",
        name: "UT Southwestern Medical Center",
        address: "5323 Harry Hines Blvd, Dallas, TX, USA",
        position: { lat: 32.8134, lng: -96.8382 },
        phone: "+12146483111"
      },
      {
        id: "us_27",
        name: "Rush University Medical Center",
        address: "1620 W Harrison St, Chicago, IL, USA",
        position: { lat: 41.8746, lng: -87.6708 },
        phone: "+13129425000"
      },
      {
        id: "us_28",
        name: "University of Colorado Hospital",
        address: "12605 E 16th Ave, Aurora, CO, USA",
        position: { lat: 39.7417, lng: -104.8383 },
        phone: "+17208482989"
      },
      {
        id: "us_29",
        name: "Tampa General Hospital",
        address: "1 Tampa General Cir, Tampa, FL, USA",
        position: { lat: 27.9413, lng: -82.4592 },
        phone: "+18132537000"
      },
      {
        id: "us_30",
        name: "University of Alabama at Birmingham Hospital",
        address: "1802 6th Ave S, Birmingham, AL, USA",
        position: { lat: 33.5057, lng: -86.8024 },
        phone: "+12059345555"
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
      },
      {
        id: "uk_11",
        name: "Royal Free Hospital",
        address: "Pond St, Hampstead, London, UK",
        position: { lat: 51.5532, lng: -0.1673 },
        phone: "+442078302111"
      },
      {
        id: "uk_12",
        name: "King's College Hospital",
        address: "Denmark Hill, London, UK",
        position: { lat: 51.4685, lng: -0.0939 },
        phone: "+442032999000"
      },
      {
        id: "uk_13",
        name: "Great Ormond Street Hospital",
        address: "Great Ormond St, London, UK",
        position: { lat: 51.5224, lng: -0.1201 },
        phone: "+442074059200"
      },
      {
        id: "uk_14",
        name: "Royal Marsden Hospital",
        address: "Fulham Rd, London, UK",
        position: { lat: 51.4902, lng: -0.1746 },
        phone: "+442073528171"
      },
      {
        id: "uk_15",
        name: "Queen Elizabeth Hospital Glasgow",
        address: "1345 Govan Rd, Glasgow, UK",
        position: { lat: 55.8622, lng: -4.3371 },
        phone: "+441414515600"
      },
      {
        id: "uk_16",
        name: "Bristol Royal Infirmary",
        address: "Upper Maudlin St, Bristol, UK",
        position: { lat: 51.4590, lng: -2.5938 },
        phone: "+441173923999"
      },
      {
        id: "uk_17",
        name: "Royal Liverpool University Hospital",
        address: "Prescot St, Liverpool, UK",
        position: { lat: 53.4084, lng: -2.9692 },
        phone: "+441517062000"
      },
      {
        id: "uk_18",
        name: "Northern General Hospital",
        address: "Herries Rd, Sheffield, UK",
        position: { lat: 53.4121, lng: -1.4682 },
        phone: "+441142434343"
      },
      {
        id: "uk_19",
        name: "Royal Devon & Exeter Hospital",
        address: "Barrack Rd, Exeter, UK",
        position: { lat: 50.7271, lng: -3.5065 },
        phone: "+441392411611"
      },
      {
        id: "uk_20",
        name: "Southampton General Hospital",
        address: "Tremona Rd, Southampton, UK",
        position: { lat: 50.9338, lng: -1.4360 },
        phone: "+442381777222"
      },
      {
        id: "uk_21",
        name: "Royal Berkshire Hospital",
        address: "London Rd, Reading, UK",
        position: { lat: 51.4546, lng: -0.9431 },
        phone: "+441183225111"
      },
      {
        id: "uk_22",
        name: "Leicester Royal Infirmary",
        address: "Infirmary Square, Leicester, UK",
        position: { lat: 52.6298, lng: -1.1408 },
        phone: "+441162586822"
      },
      {
        id: "uk_23",
        name: "The James Cook University Hospital",
        address: "Marton Rd, Middlesbrough, UK",
        position: { lat: 54.5571, lng: -1.2142 },
        phone: "+441642850850"
      },
      {
        id: "uk_24",
        name: "Royal Sussex County Hospital",
        address: "Eastern Rd, Brighton, UK",
        position: { lat: 50.8197, lng: -0.1187 },
        phone: "+441273696955"
      },
      {
        id: "uk_25",
        name: "Aberdeen Royal Infirmary",
        address: "Foresterhill Rd, Aberdeen, UK",
        position: { lat: 57.1560, lng: -2.1370 },
        phone: "+441224681818"
      },
      {
        id: "uk_26",
        name: "Royal Stoke University Hospital",
        address: "Newcastle Rd, Stoke-on-Trent, UK",
        position: { lat: 53.0066, lng: -2.2157 },
        phone: "+441782715444"
      },
      {
        id: "uk_27",
        name: "University Hospital of Wales",
        address: "Heath Park Way, Cardiff, UK",
        position: { lat: 51.5106, lng: -3.1896 },
        phone: "+442920747747"
      },
      {
        id: "uk_28",
        name: "Norfolk and Norwich University Hospital",
        address: "Colney Ln, Norwich, UK",
        position: { lat: 52.6189, lng: 1.2204 },
        phone: "+441603286286"
      },
      {
        id: "uk_29",
        name: "Belfast City Hospital",
        address: "Lisburn Rd, Belfast, UK",
        position: { lat: 54.5830, lng: -5.9474 },
        phone: "+442890329241"
      },
      {
        id: "uk_30",
        name: "Ninewells Hospital",
        address: "Ninewells Ave, Dundee, UK",
        position: { lat: 56.4633, lng: -3.0128 },
        phone: "+441382660111"
      },
      {
        id: "uk_31",
        name: "Poole Hospital",
        address: "Longfleet Road, Poole, UK",
        position: { lat: 50.7287, lng: -1.9714 },
        phone: "+441202665511"
      },
      {
        id: "uk_32",
        name: "Peterborough City Hospital",
        address: "Bretton Gate, Peterborough, UK",
        position: { lat: 52.5887, lng: -0.2712 },
        phone: "+441733678000"
      },
      {
        id: "uk_33",
        name: "Queen's Medical Centre",
        address: "Derby Road, Nottingham, UK",
        position: { lat: 52.9412, lng: -1.1836 },
        phone: "+441159249924"
      },
      {
        id: "uk_34",
        name: "Gloucestershire Royal Hospital",
        address: "Great Western Road, Gloucester, UK",
        position: { lat: 51.8624, lng: -2.2407 },
        phone: "+441452394000"
      },
      {
        id: "uk_35",
        name: "Aberdeen Royal Infirmary",
        address: "Foresterhill Rd, Aberdeen, UK",
        position: { lat: 57.1522, lng: -2.1300 },
        phone: "+441224681818"
      },
      {
        id: "uk_36",
        name: "Royal Cornwall Hospital",
        address: "Treliske, Truro, UK",
        position: { lat: 50.2645, lng: -5.0920 },
        phone: "+441872250000"
      },
      {
        id: "uk_37",
        name: "Dumfries and Galloway Royal Infirmary",
        address: "Bankend Road, Dumfries, UK",
        position: { lat: 55.0529, lng: -3.5853 },
        phone: "+441387246246"
      },
      {
        id: "uk_38",
        name: "James Cook University Hospital",
        address: "Marton Road, Middlesbrough, UK",
        position: { lat: 54.5614, lng: -1.2007 },
        phone: "+441642850850"
      },
      {
        id: "uk_39",
        name: "Royal Berkshire Hospital",
        address: "London Road, Reading, UK",
        position: { lat: 51.4521, lng: -0.9558 },
        phone: "+441183225111"
      },
      {
        id: "uk_40",
        name: "West Suffolk Hospital",
        address: "Hardwick Lane, Bury St Edmunds, UK",
        position: { lat: 52.2435, lng: 0.7039 },
        phone: "+441284713000"
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
      },
      {
        id: "de_11",
        name: "University Hospital Würzburg",
        address: "Oberdürrbacher Str. 6, Würzburg, Germany",
        position: { lat: 49.8009, lng: 9.9568 },
        phone: "+4993120100"
      },
      {
        id: "de_12",
        name: "University Hospital Regensburg",
        address: "Franz-Josef-Strauß-Allee 11, Regensburg, Germany",
        position: { lat: 48.9970, lng: 12.0914 },
        phone: "+499419440"
      },
      {
        id: "de_13",
        name: "University Hospital Münster",
        address: "Albert-Schweitzer-Campus 1, Münster, Germany",
        position: { lat: 51.9648, lng: 7.5953 },
        phone: "+492518350"
      },
      {
        id: "de_14",
        name: "University Hospital of Giessen and Marburg",
        address: "Rudolf-Buchheim-Straße 8, Giessen, Germany",
        position: { lat: 50.5659, lng: 8.6658 },
        phone: "+496419985000"
      },
      {
        id: "de_15",
        name: "University Hospital Magdeburg",
        address: "Leipziger Str. 44, Magdeburg, Germany",
        position: { lat: 52.1347, lng: 11.6376 },
        phone: "+493916701"
      },
      {
        id: "de_16",
        name: "University Hospital Jena",
        address: "Am Klinikum 1, Jena, Germany",
        position: { lat: 50.9290, lng: 11.5706 },
        phone: "+493641930"
      },
      {
        id: "de_17",
        name: "University Medical Center Göttingen",
        address: "Robert-Koch-Straße 40, Göttingen, Germany",
        position: { lat: 51.5402, lng: 9.9431 },
        phone: "+495513960"
      },
      {
        id: "de_18",
        name: "University Hospital Schleswig-Holstein, Kiel",
        address: "Arnold-Heller-Straße 3, Kiel, Germany",
        position: { lat: 54.3143, lng: 10.1284 },
        phone: "+49431500"
      },
      {
        id: "de_19",
        name: "University Hospital Schleswig-Holstein, Lübeck",
        address: "Ratzeburger Allee 160, Lübeck, Germany",
        position: { lat: 53.8487, lng: 10.7062 },
        phone: "+4945150"
      },
      {
        id: "de_20",
        name: "University Hospital Halle",
        address: "Ernst-Grube-Straße 40, Halle, Germany",
        position: { lat: 51.4882, lng: 11.9681 },
        phone: "+493455570"
      },
      {
        id: "de_21",
        name: "University Hospital Mannheim",
        address: "Theodor-Kutzer-Ufer 1-3, Mannheim, Germany",
        position: { lat: 49.4841, lng: 8.4732 },
        phone: "+496213830"
      },
      {
        id: "de_22",
        name: "University Hospital Leipzig",
        address: "Liebigstraße 20, Leipzig, Germany",
        position: { lat: 51.3286, lng: 12.3797 },
        phone: "+493419710"
      },
      {
        id: "de_23",
        name: "University Hospital Düsseldorf",
        address: "Moorenstraße 5, Düsseldorf, Germany",
        position: { lat: 51.1889, lng: 6.7971 },
        phone: "+492118100"
      },
      {
        id: "de_24",
        name: "University Hospital Ulm",
        address: "Albert-Einstein-Allee 23, Ulm, Germany",
        position: { lat: 48.4212, lng: 9.9571 },
        phone: "+497311770"
      },
      {
        id: "de_25",
        name: "University Hospital Aachen",
        address: "Pauwelsstraße 30, Aachen, Germany",
        position: { lat: 50.7778, lng: 6.0493 },
        phone: "+492418088444"
      },
      {
        id: "de_26",
        name: "University Hospital Erlangen",
        address: "Ulmenweg 18, Erlangen, Germany",
        position: { lat: 49.5937, lng: 11.0121 },
        phone: "+4991318500"
      },
      {
        id: "de_27",
        name: "University Hospital Carl Gustav Carus Dresden",
        address: "Fetscherstraße 74, Dresden, Germany",
        position: { lat: 51.0562, lng: 13.7848 },
        phone: "+4935145826"
      },
      {
        id: "de_28",
        name: "University Hospital Rostock",
        address: "Schillingallee 35, Rostock, Germany",
        position: { lat: 54.0803, lng: 12.0957 },
        phone: "+4938174940"
      },
      {
        id: "de_29",
        name: "University Hospital Greifswald",
        address: "Sauerbruchstraße, Greifswald, Germany",
        position: { lat: 54.0909, lng: 13.4044 },
        phone: "+493834860"
      },
      {
        id: "de_30",
        name: "University Hospital Augsburg",
        address: "Stenglinstraße 2, Augsburg, Germany",
        position: { lat: 48.3491, lng: 10.8949 },
        phone: "+498214000"
      },
      {
        id: "de_31",
        name: "Asklepios Klinik St. Georg Hamburg",
        address: "Lohmühlenstraße 5, Hamburg, Germany",
        position: { lat: 53.5594, lng: 10.0134 },
        phone: "+4940181850"
      },
      {
        id: "de_32",
        name: "Sana Klinikum Offenbach",
        address: "Starkenburgring 66, Offenbach, Germany",
        position: { lat: 50.0892, lng: 8.7759 },
        phone: "+4969840050"
      },
      {
        id: "de_33",
        name: "Städtisches Klinikum München",
        address: "Thalkirchner Str. 48, Munich, Germany",
        position: { lat: 48.1187, lng: 11.5587 },
        phone: "+498951600"
      },
      {
        id: "de_34",
        name: "Vivantes Klinikum Neukölln",
        address: "Rudower Straße 48, Berlin, Germany",
        position: { lat: 52.4539, lng: 13.4425 },
        phone: "+4930130140"
      },
      {
        id: "de_35",
        name: "Universitätsklinikum des Saarlandes",
        address: "Kirrberger Straße 100, Homburg, Germany",
        position: { lat: 49.3016, lng: 7.3366 },
        phone: "+496841160"
      },
      {
        id: "de_36",
        name: "Klinikum Dortmund",
        address: "Beurhausstraße 40, Dortmund, Germany",
        position: { lat: 51.5097, lng: 7.4633 },
        phone: "+492315021"
      },
      {
        id: "de_37",
        name: "Helios Universitätsklinikum Wuppertal",
        address: "Heusnerstraße 40, Wuppertal, Germany",
        position: { lat: 51.2661, lng: 7.1767 },
        phone: "+49202896-0"
      },
      {
        id: "de_38",
        name: "Uniklinik RWTH Aachen",
        address: "Pauwelsstraße 30, Aachen, Germany",
        position: { lat: 50.7823, lng: 6.0457 },
        phone: "+492418088444"
      },
      {
        id: "de_39",
        name: "Universitätsklinikum Würzburg",
        address: "Josef-Schneider-Str. 2, Würzburg, Germany",
        position: { lat: 49.8016, lng: 9.9648 },
        phone: "+4993120100"
      },
      {
        id: "de_40",
        name: "Klinikum Stuttgart",
        address: "Kriegsbergstraße 60, Stuttgart, Germany",
        position: { lat: 48.7846, lng: 9.1749 },
        phone: "+497112781"
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
      },
      {
        id: "ru_11",
        name: "N.N. Burdenko National Medical Research Center of Neurosurgery",
        address: "16 4th Tverskaya-Yamskaya St, Moscow, Russia",
        position: { lat: 55.7696, lng: 37.5951 },
        phone: "+74992509571"
      },
      {
        id: "ru_12",
        name: "Research Institute of Emergency Care n.a. N.V. Sklifosovsky",
        address: "3 Bolshaya Sukharevskaya Square, Moscow, Russia",
        position: { lat: 55.7729, lng: 37.6210 },
        phone: "+74956806141"
      },
      {
        id: "ru_13",
        name: "Saint Petersburg State Pediatric Medical University",
        address: "2 Litovskaya St, St. Petersburg, Russia",
        position: { lat: 59.9989, lng: 30.3196 },
        phone: "+78122954751"
      },
      {
        id: "ru_14",
        name: "City Clinical Hospital No. 31",
        address: "3 Lobachevskogo St, Moscow, Russia",
        position: { lat: 55.7043, lng: 37.5024 },
        phone: "+74954320303"
      },
      {
        id: "ru_15",
        name: "Meshalkin National Medical Research Center",
        address: "15 Rechkunovskaya St, Novosibirsk, Russia",
        position: { lat: 54.8549, lng: 83.0617 },
        phone: "+73833477109"
      },
      {
        id: "ru_16",
        name: "Federal Scientific Center for Transplantology and Artificial Organs",
        address: "1 Shchukinskaya St, Moscow, Russia",
        position: { lat: 55.8087, lng: 37.4642 },
        phone: "+74991905121"
      },
      {
        id: "ru_17",
        name: "Siberian State Medical University",
        address: "2 Moskovsky Trakt, Tomsk, Russia",
        position: { lat: 56.4732, lng: 84.9844 },
        phone: "+73822530423"
      },
      {
        id: "ru_18",
        name: "Moscow Regional Research and Clinical Institute",
        address: "61/2 Shchepkina St, Moscow, Russia",
        position: { lat: 55.7837, lng: 37.6334 },
        phone: "+74956815585"
      },
      {
        id: "ru_19",
        name: "North-Western State Medical University named after I.I. Mechnikov",
        address: "41 Kirochnaya St, St. Petersburg, Russia",
        position: { lat: 59.9445, lng: 30.3603 },
        phone: "+78123035000"
      },
      {
        id: "ru_20",
        name: "Rostov State Medical University",
        address: "29 Nakhichevansky Ln, Rostov-on-Don, Russia",
        position: { lat: 47.2354, lng: 39.7097 },
        phone: "+78632504200"
      },
      {
        id: "ru_21",
        name: "Ural State Medical University",
        address: "3 Repina St, Yekaterinburg, Russia",
        position: { lat: 56.8351, lng: 60.6107 },
        phone: "+73432142863"
      },
      {
        id: "ru_22",
        name: "National Medical Research Center of Oncology named after N.N. Blokhin",
        address: "24 Kashirskoe Shosse, Moscow, Russia",
        position: { lat: 55.6553, lng: 37.6623 },
        phone: "+74993241314"
      },
      {
        id: "ru_23",
        name: "National Medical Research Center of Traumatology and Orthopedics",
        address: "10 Priorova St, Moscow, Russia",
        position: { lat: 55.8341, lng: 37.5372 },
        phone: "+74999409510"
      },
      {
        id: "ru_24",
        name: "Volgograd State Medical University",
        address: "1 Pavshikh Bortsov Square, Volgograd, Russia",
        position: { lat: 48.7126, lng: 44.5192 },
        phone: "+78442385005"
      },
      {
        id: "ru_25",
        name: "Far Eastern State Medical University",
        address: "35 Muravyev-Amursky St, Khabarovsk, Russia",
        position: { lat: 48.4733, lng: 135.0682 },
        phone: "+74212304518"
      },
      {
        id: "ru_26",
        name: "Tyumen State Medical University",
        address: "54 Odesskaya St, Tyumen, Russia",
        position: { lat: 57.1327, lng: 65.5686 },
        phone: "+73452202133"
      },
      {
        id: "ru_27",
        name: "City Clinical Hospital No. 40",
        address: "1 Kasatkina St, Moscow, Russia",
        position: { lat: 55.8360, lng: 37.6337 },
        phone: "+74956851368"
      },
      {
        id: "ru_28",
        name: "Ufa State Aviation Technical University Hospital",
        address: "12 Karl Marx St, Ufa, Russia",
        position: { lat: 54.7252, lng: 55.9435 },
        phone: "+73472733258"
      },
      {
        id: "ru_29",
        name: "Regional Clinical Hospital No. 1",
        address: "167 1st May St, Krasnodar, Russia",
        position: { lat: 45.0355, lng: 38.9745 },
        phone: "+78612525323"
      },
      {
        id: "ru_30",
        name: "Samara State Medical University Clinical Hospital",
        address: "89 Chapaevskaya St, Samara, Russia",
        position: { lat: 53.1955, lng: 50.1325 },
        phone: "+78463333071"
      },
      {
        id: "ru_31",
        name: "Altai Regional Clinical Hospital",
        address: "Lyapidevskogo St, 1, Barnaul, Russia",
        position: { lat: 53.3557, lng: 83.6770 },
        phone: "+73852689600"
      },
      {
        id: "ru_32",
        name: "Irkutsk Regional Clinical Hospital",
        address: "Yubileyniy Microdistrict, 100, Irkutsk, Russia",
        position: { lat: 52.2582, lng: 104.2786 },
        phone: "+73952469762"
      },
      {
        id: "ru_33",
        name: "Omsk Regional Clinical Hospital",
        address: "3 Berezovaya St, Omsk, Russia",
        position: { lat: 54.9893, lng: 73.3747 },
        phone: "+73812359222"
      },
      {
        id: "ru_34",
        name: "Perm Regional Clinical Hospital",
        address: "73A Pushkina St, Perm, Russia",
        position: { lat: 58.0104, lng: 56.2572 },
        phone: "+73422393111"
      },
      {
        id: "ru_35",
        name: "Murmansk Regional Clinical Hospital",
        address: "6 Pavlova St, Murmansk, Russia",
        position: { lat: 68.9707, lng: 33.0814 },
        phone: "+78152256019"
      },
      {
        id: "ru_36",
        name: "Kaliningrad Regional Clinical Hospital",
        address: "74 Klinicheskaya St, Kaliningrad, Russia",
        position: { lat: 54.7128, lng: 20.5033 },
        phone: "+74012592000"
      },
      {
        id: "ru_37",
        name: "Ivanovo Regional Clinical Hospital",
        address: "5 Lyubimova St, Ivanovo, Russia",
        position: { lat: 56.9988, lng: 40.9804 },
        phone: "+74932932233"
      },
      {
        id: "ru_38",
        name: "Belgorod Regional Clinical Hospital",
        address: "8/9 Nekrasova St, Belgorod, Russia",
        position: { lat: 50.5980, lng: 36.5888 },
        phone: "+74722504703"
      },
      {
        id: "ru_39",
        name: "Astrakhan Federal Center for Cardiovascular Surgery",
        address: "4 Pokrovskaya Roshcha St, Astrakhan, Russia",
        position: { lat: 46.3497, lng: 48.0389 },
        phone: "+78512311002"
      },
      {
        id: "ru_40",
        name: "Vladivostok Clinical Hospital No. 2",
        address: "57 Russkaya St, Vladivostok, Russia",
        position: { lat: 43.1198, lng: 131.9234 },
        phone: "+74232322130"
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

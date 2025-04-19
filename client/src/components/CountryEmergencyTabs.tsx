import { useState } from "react";
import { useTranslation } from "react-i18next";
import { countryEmergencyNumbers, getIconComponent, IconType } from "../data/emergencyNumbers";

type EmergencyNumber = {
  id: string;
  type: string;
  number: string;
  icon: string;
}

export default function CountryEmergencyTabs() {
  const { t } = useTranslation();
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  
  // List of countries with available emergency numbers
  const countries = [
    { code: 'kr', name: 'Korea' },
    { code: 'de', name: 'Germany' },
    { code: 'cn', name: 'China' },
    { code: 'jp', name: 'Japan' },
    { code: 'es', name: 'Spain' },
    { code: 'us', name: 'USA' },
    { code: 'uk', name: 'UK' },
    { code: 'ru', name: 'Russia' }
  ];
  
  const handleCountrySelect = (countryCode: string) => {
    setActiveCountry(countryCode);
  };
  
  const getEmergencyNumbersForCountry = (countryCode: string): EmergencyNumber[] => {
    return countryEmergencyNumbers[countryCode] || [];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex overflow-x-auto border-b border-gray-200">
        {countries.map((country) => (
          <button 
            key={country.code}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeCountry === country.code 
                ? 'text-primary border-primary' 
                : 'text-gray-700 border-transparent hover:text-primary'
            }`}
            onClick={() => handleCountrySelect(country.code)}
          >
            {t(`countries.${country.code}`)}
          </button>
        ))}
      </div>
      
      <div className="p-4">
        {activeCountry ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getEmergencyNumbersForCountry(activeCountry).map((number) => {
              const IconComponent = getIconComponent(number.icon);
              
              return (
                <div key={number.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                  <div className="bg-primary text-white p-2 rounded-md">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{t(`emergencyNumbers.${number.type}`)}</div>
                    <div className="font-mono font-bold text-lg">{number.number}</div>
                  </div>
                </div>
              );
            })}
            
            {getEmergencyNumbersForCountry(activeCountry).length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">{t('emergencyNumbers.noData')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{t('emergencyNumbers.selectCountry')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

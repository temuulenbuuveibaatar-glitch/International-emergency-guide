import { useTranslation } from "react-i18next";
import { Phone, Clock, Globe } from "lucide-react";
import { countryEmergencyNumbers, getIconComponent } from "../data/emergencyNumbers";
import { useState } from "react";

const countries = [
  { code: "kr", name: "Korea" },
  { code: "de", name: "Germany" },
  { code: "cn", name: "China" },
  { code: "jp", name: "Japan" },
  { code: "es", name: "Spain" },
  { code: "us", name: "USA" },
  { code: "uk", name: "UK" },
  { code: "ru", name: "Russia" },
];

export default function EmergencyNumbers() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/-/g, '')}`;
  };

  const emergencyNumbers = selectedCountry ? countryEmergencyNumbers[selectedCountry] : [];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {countries.map((country) => (
          <button
            key={country.code}
            data-testid={`button-country-tab-${country.code}`}
            onClick={() => setSelectedCountry(country.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedCountry === country.code
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{country.name}</span>
          </button>
        ))}
      </div>

      {!selectedCountry ? (
        <div className="bg-blue-50 rounded-lg p-12 flex flex-col items-center justify-center">
          <Globe className="w-12 h-12 text-blue-500 mb-4" />
          <p 
            data-testid="text-select-country-message"
            className="text-blue-600 text-lg"
          >
            Please select a country to view emergency numbers
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {emergencyNumbers.map((item) => {
              const IconComponent = getIconComponent(item.icon);
              const isHovered = hoveredCard === item.id;

              return (
                <div
                  key={item.id}
                  data-testid={`card-emergency-${item.id}`}
                  className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg transition-all duration-300 ${
                    isHovered
                      ? "border-primary shadow-md bg-gray-50 transform scale-[1.02]"
                      : "hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`p-3 rounded-full flex-shrink-0 transition-colors duration-300 ${
                      isHovered
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-primary"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-600 font-medium">
                          {t(`emergencyNumbers.${item.type}`, item.type)}
                        </div>
                        <div className="font-bold text-2xl text-gray-800 font-mono">
                          {item.number}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCall(item.number)}
                        data-testid={`button-call-${item.id}`}
                        className={`flex items-center justify-center transition-all duration-300 ${
                          isHovered
                            ? "bg-green-600 text-white w-12 h-12"
                            : "bg-green-100 text-green-700 w-10 h-10"
                        } rounded-full hover:bg-green-700 hover:text-white flex-shrink-0 shadow-sm hover:shadow-md`}
                        aria-label={`Call ${item.number}`}
                      >
                        <Phone
                          className={`transition-all duration-300 ${
                            isHovered ? "w-5 h-5" : "w-4 h-4"
                          }`}
                        />
                      </button>
                    </div>
                    {item.description && (
                      <div className="text-gray-700 text-sm mt-2">
                        {item.description}
                      </div>
                    )}
                    {item.available && (
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{item.available}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

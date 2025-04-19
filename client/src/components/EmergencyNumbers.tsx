import { useTranslation } from "react-i18next";
import { Phone } from "lucide-react";
import { mongoliaEmergencyNumbers, getIconComponent } from "../data/emergencyNumbers";

export default function EmergencyNumbers() {
  const { t } = useTranslation();
  
  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/-/g, '')}`;
  };
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-primary mb-4">
        {t('emergencyNumbers.mongolia')}
      </h3>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {mongoliaEmergencyNumbers.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            
            return (
              <div key={item.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-md hover:border-gray-300 hover:shadow-md transition-all">
                <div className="bg-primary text-white p-2 rounded-full flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-600">{t(`emergencyNumbers.${item.type}`, item.type)}</div>
                      <div className="font-bold text-xl text-gray-800">{item.number}</div>
                    </div>
                    <button 
                      onClick={() => handleCall(item.number)}
                      className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 flex-shrink-0"
                      aria-label={`Call ${item.number}`}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                  {item.description && (
                    <div className="text-gray-700 text-sm mt-1">{item.description}</div>
                  )}
                  {item.available && (
                    <div className="text-gray-500 text-xs mt-1">Available: {item.available}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
        <h4 className="font-semibold">Emergency Call Information</h4>
        <p className="text-sm mt-1">
          In Mongolia, emergency calls are free from any phone. When calling, please speak clearly, provide your location, 
          and describe the emergency situation. Remain on the line until instructed to disconnect.
        </p>
      </div>
    </div>
  );
}

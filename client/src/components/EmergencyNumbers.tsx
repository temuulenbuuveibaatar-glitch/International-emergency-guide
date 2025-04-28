import { useTranslation } from "react-i18next";
import { Phone, AlertTriangle, Clock, Info, ChevronRight } from "lucide-react";
import { mongoliaEmergencyNumbers, getIconComponent } from "../data/emergencyNumbers";
import { useState } from "react";

export default function EmergencyNumbers() {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/-/g, '')}`;
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-primary flex items-center">
          <span className="inline-block mr-2 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </span>
          {t('emergencyNumbers.mongolia')}
        </h3>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>Call Info</span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showInfo ? 'rotate-90' : ''}`} />
        </button>
      </div>
      
      {showInfo && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 animate-fadeIn">
          <h4 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            Emergency Call Information
          </h4>
          <p className="text-sm mt-2">
            In Mongolia, emergency calls are free from any phone. When calling, please speak clearly, provide your location, 
            and describe the emergency situation. Remain on the line until instructed to disconnect.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {mongoliaEmergencyNumbers.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            const isHovered = hoveredCard === item.id;
            
            return (
              <div 
                key={item.id} 
                className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg transition-all duration-300 ${
                  isHovered 
                    ? 'border-primary shadow-md bg-gray-50 transform scale-[1.02]' 
                    : 'hover:border-gray-300 hover:shadow-sm'
                }`}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`p-3 rounded-full flex-shrink-0 transition-colors duration-300 ${
                  isHovered 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-primary'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-600 font-medium">{t(`emergencyNumbers.${item.type}`, item.type)}</div>
                      <div className="font-bold text-2xl text-gray-800 font-mono">{item.number}</div>
                    </div>
                    <button 
                      onClick={() => handleCall(item.number)}
                      className={`flex items-center justify-center transition-all duration-300 ${
                        isHovered 
                          ? 'bg-green-600 text-white w-12 h-12' 
                          : 'bg-green-100 text-green-700 w-10 h-10'
                        } rounded-full hover:bg-green-700 hover:text-white flex-shrink-0 shadow-sm hover:shadow-md`}
                      aria-label={`Call ${item.number}`}
                    >
                      <Phone className={`transition-all duration-300 ${isHovered ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </button>
                  </div>
                  {item.description && (
                    <div className="text-gray-700 text-sm mt-2">{item.description}</div>
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
      
      <div className="mt-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Emergency Call Priority</h4>
              <p className="text-sm mt-1 opacity-90">
                Always call emergency services before administering aid in critical situations. When multiple services are needed,
                call ambulance (103) first, then fire (101) or police (102) as appropriate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

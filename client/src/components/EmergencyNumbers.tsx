import { useTranslation } from "react-i18next";
import { mongoliaEmergencyNumbers, getIconComponent } from "../data/emergencyNumbers";

export default function EmergencyNumbers() {
  const { t } = useTranslation();
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-primary mb-4">
        {t('emergencyNumbers.mongolia')}
      </h3>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {mongoliaEmergencyNumbers.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                <div className="bg-primary text-white p-2 rounded-md">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">{t(`emergencyNumbers.${item.type}`)}</div>
                  <div className="font-mono font-bold text-lg">{item.number}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

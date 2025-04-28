import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";

export default function EmergencyBanner() {
  const { t } = useTranslation();
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Create a blinking effect for the emergency banner
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`${isBlinking ? 'bg-red-700' : 'bg-destructive'} text-white py-3 px-4 transition-colors duration-700`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium">{t('emergency.title')}</span>
        </div>
        <a href={`tel:${t('emergency.number')}`} className="flex items-center gap-2 bg-white text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-100 transition-colors">
          <PhoneCall className="w-4 h-4" />
          <span className="font-mono">{t('emergency.number')}</span>
        </a>
      </div>
    </div>
  );
}

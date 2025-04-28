import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface EmergencyProtocolCardProps {
  id: string;
  title: string;
  description: string;
}

export default function EmergencyProtocolCard({ id, title, description }: EmergencyProtocolCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 ${
        isHovered ? "shadow-xl scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 bg-gradient-to-r from-primary to-red-700 text-white flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <AlertTriangle className={`w-5 h-5 transition-all duration-300 ${isHovered ? "rotate-12" : ""}`} />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <Link href={`/emergency/${id}`}>
          <div className={`inline-flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
            isHovered 
              ? "bg-[#004A9F] text-white" 
              : "bg-gray-100 text-[#004A9F] hover:bg-gray-200"
          }`}>
            <span>{t('protocols.viewDetails')}</span>
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              isHovered ? "translate-x-1" : ""
            }`} />
          </div>
        </Link>
      </div>
    </div>
  );
}

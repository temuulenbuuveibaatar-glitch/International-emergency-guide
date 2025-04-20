import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface EmergencyProtocolCardProps {
  id: string;
  title: string;
  description: string;
}

export default function EmergencyProtocolCard({ id, title, description }: EmergencyProtocolCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 bg-primary text-white">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <Link href={`/emergency/${id}`}>
          <div className="text-[#004A9F] hover:text-[#0064D6] font-medium inline-flex items-center cursor-pointer">
            <span>{t('protocols.viewDetails')}</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}

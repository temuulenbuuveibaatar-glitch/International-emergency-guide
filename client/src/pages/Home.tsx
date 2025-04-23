import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import EmergencyProtocolCard from "../components/EmergencyProtocolCard";
import { emergencyProtocols } from "../data/protocols";
import EmergencyNumbers from "../components/EmergencyNumbers";
import CountryEmergencyTabs from "../components/CountryEmergencyTabs";
import HospitalFinder from "../components/HospitalFinder";
import PromotionSection from "../components/PromotionSection";
import { Flame, MapPin, ArrowRight } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <>
      {/* Home Section */}
      <section id="home" className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#004A9F]">
                {t('home.title')}
              </h2>
              <p className="text-lg text-gray-700">
                {t('home.subtitle')}
              </p>
              <p className="text-gray-600">
                {t('home.description')}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/emergency">
                  <div className="bg-primary hover:bg-[#C41C2D] text-white px-6 py-3 rounded-md font-medium transition duration-200 inline-flex items-center gap-2 cursor-pointer">
                    <Flame className="w-5 h-5" />
                    <span>{t('home.emergencyButton')}</span>
                  </div>
                </Link>
                <Link href="/hospitals">
                  <div className="bg-[#004A9F] hover:bg-[#0064D6] text-white px-6 py-3 rounded-md font-medium transition duration-200 inline-flex items-center gap-2 cursor-pointer">
                    <MapPin className="w-5 h-5" />
                    <span>{t('home.findHospital')}</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Medical emergency team" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Numbers Section */}
      <section id="contacts" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('emergencyNumbers.title')}
          </h2>
          
          {/* Mongolia Emergency Numbers */}
          <EmergencyNumbers />
          
          {/* Other Countries Emergency Numbers */}
          <CountryEmergencyTabs />
        </div>
      </section>

      {/* Hospital Finder Section */}
      <section id="hospitals" className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {t('hospitals.title')}
          </h2>
          
          <HospitalFinder />
        </div>
      </section>

      {/* Emergency Protocols Section - Preview */}
      <section id="emergency" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {t('protocols.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyProtocols.slice(0, 3).map((protocol) => (
              <EmergencyProtocolCard
                key={protocol.id}
                id={protocol.id}
                title={protocol.title}
                description={protocol.description}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/emergency">
              <div className="bg-primary hover:bg-[#C41C2D] text-white px-6 py-3 rounded-md font-medium transition duration-200 inline-flex items-center gap-2 cursor-pointer">
                <span>{t('protocols.viewAll')}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Section */}
      <PromotionSection />
    </>
  );
}

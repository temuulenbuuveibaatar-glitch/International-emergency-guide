import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import EmergencyProtocolCard from "../components/EmergencyProtocolCard";
import { emergencyProtocols } from "../data/protocols";
import EmergencyNumbers from "../components/EmergencyNumbers";
import CountryEmergencyTabs from "../components/CountryEmergencyTabs";
import HospitalFinder from "../components/HospitalFinder";

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
                  <a className="bg-primary hover:bg-[#C41C2D] text-white px-6 py-3 rounded-md font-medium transition duration-200 inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                    <span>{t('home.emergencyButton')}</span>
                  </a>
                </Link>
                <Link href="/hospitals">
                  <a className="bg-[#004A9F] hover:bg-[#0064D6] text-white px-6 py-3 rounded-md font-medium transition duration-200 inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{t('home.findHospital')}</span>
                  </a>
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
              <a className="bg-primary hover:bg-[#C41C2D] text-white px-6 py-3 rounded-md font-medium transition duration-200 inline-flex items-center gap-2">
                <span>{t('protocols.viewAll')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import EmergencyProtocolCard from "../components/EmergencyProtocolCard";
import { emergencyProtocols } from "../data/protocols";
import EmergencyNumbers from "../components/EmergencyNumbers";
import CountryEmergencyTabs from "../components/CountryEmergencyTabs";
import HospitalFinder from "../components/HospitalFinder";
import OfflineDataManager from "../components/OfflineDataManager";
import { Flame, MapPin, ArrowRight, Download, Heart, AlertCircle, ArrowDown, Info } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  // Handle scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      {/* Home Section */}
      <section id="home" className="pt-8 pb-12 relative bg-gradient-to-b from-white to-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 relative z-10">
              <div className="inline-block bg-red-100 dark:bg-red-900/50 text-primary dark:text-red-300 px-4 py-1 rounded-full text-sm font-medium animate-pulse">
                {t('emergency.title')}
              </div>
              <h2 className="text-4xl font-bold text-[#004A9F] dark:text-blue-300 leading-tight">
                {t('home.title')}
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-200">
                {t('home.subtitle')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {t('home.description')}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/emergency">
                  <div className="bg-primary hover:bg-[#C41C2D] text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-lg inline-flex items-center gap-2 cursor-pointer">
                    <Flame className="w-5 h-5" />
                    <span>{t('home.emergencyButton')}</span>
                  </div>
                </Link>
                <Link href="/hospitals">
                  <div className="bg-[#004A9F] dark:bg-blue-700 hover:bg-[#0064D6] text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-lg inline-flex items-center gap-2 cursor-pointer">
                    <MapPin className="w-5 h-5" />
                    <span>{t('home.findHospital')}</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl relative transform transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Medical emergency team" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-medium">Save lives with quick response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-500">
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <span className="text-xs mb-2">Scroll for more</span>
              <ArrowDown className="w-5 h-5" />
            </div>
          </div>
        )}
      </section>

      {/* Quick Access Buttons */}
      <section className="py-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/emergency">
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-[100px]">
                <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full mb-2">
                  <AlertCircle className="w-5 h-5 text-primary dark:text-red-300" />
                </div>
                <span className="text-sm text-center dark:text-gray-200">Protocols</span>
              </div>
            </Link>
            <Link href="/hospitals">
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-[100px]">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mb-2">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <span className="text-sm text-center dark:text-gray-200">Hospitals</span>
              </div>
            </Link>
            <Link href="/contacts">
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-[100px]">
                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-2">
                  <Info className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
                <span className="text-sm text-center dark:text-gray-200">Contacts</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Numbers Section */}
      <section id="contacts" className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004A9F] dark:text-blue-300 mb-3">
              {t('emergencyNumbers.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('emergencyNumbers.description')}
            </p>
          </div>
          
          {/* Mongolia Emergency Numbers */}
          <div className="transform transition-all duration-500" style={{
            transform: scrollPosition > 200 ? 'translateY(0)' : 'translateY(20px)',
            opacity: scrollPosition > 200 ? 1 : 0,
          }}>
            <EmergencyNumbers />
          </div>
          
          {/* Other Countries Emergency Numbers */}
          <div className="mt-8 transform transition-all duration-500" style={{
            transform: scrollPosition > 300 ? 'translateY(0)' : 'translateY(20px)',
            opacity: scrollPosition > 300 ? 1 : 0,
          }}>
            <CountryEmergencyTabs />
          </div>
        </div>
      </section>

      {/* Hospital Finder Section */}
      <section id="hospitals" className="py-10 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004A9F] dark:text-blue-300 mb-3">
              {t('hospitals.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('hospitals.description')}
            </p>
          </div>
          
          <div className="transform transition-all duration-500" style={{
            transform: scrollPosition > 500 ? 'translateY(0)' : 'translateY(20px)',
            opacity: scrollPosition > 500 ? 1 : 0,
          }}>
            <HospitalFinder />
          </div>
        </div>
      </section>

      {/* Emergency Protocols Section - Preview */}
      <section id="emergency" className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004A9F] dark:text-blue-300 mb-3">
              {t('protocols.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('protocols.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform transition-all duration-500" style={{
            transform: scrollPosition > 800 ? 'translateY(0)' : 'translateY(20px)',
            opacity: scrollPosition > 800 ? 1 : 0,
          }}>
            {emergencyProtocols.slice(0, 3).map((protocol) => (
              <EmergencyProtocolCard
                key={protocol.id}
                id={protocol.id}
                title={protocol.title}
                description={protocol.description}
              />
            ))}
          </div>
          
          <div className="mt-10 text-center transform transition-all duration-500" style={{
            transform: scrollPosition > 900 ? 'translateY(0)' : 'translateY(20px)',
            opacity: scrollPosition > 900 ? 1 : 0,
          }}>
            <Link href="/emergency">
              <div className="bg-primary hover:bg-[#C41C2D] text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 inline-flex items-center gap-2 cursor-pointer hover:shadow-lg transform hover:translate-y-[-4px]">
                <span>{t('protocols.viewAll')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Offline Mode Section */}
      <section id="offline-access" className="py-10 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-[#004A9F] dark:text-blue-300">
                {t('offline.title', 'Offline Access')}
              </h2>
              <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-[#004A9F] dark:text-blue-300 shadow-sm">
                <Download className="w-4 h-4" />
                <span>{t('offline.savePrompt', 'Save for offline use')}</span>
              </div>
            </div>
            
            <OfflineDataManager />
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
              {t('offline.description', 'Save emergency information for offline use - access critical protocols, phone numbers, and medication information even without internet.')}
            </p>
          </div>
        </div>
      </section>

    </>
  );
}

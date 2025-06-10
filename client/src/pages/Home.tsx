import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import EmergencyProtocolCard from "../components/EmergencyProtocolCard";
import { emergencyProtocols } from "../data/protocols";
import EmergencyNumbers from "../components/EmergencyNumbers";
import CountryEmergencyTabs from "../components/CountryEmergencyTabs";
import HospitalFinder from "../components/HospitalFinder";
import OfflineDataManager from "../components/OfflineDataManager";
import { Flame, MapPin, ArrowRight, Download, Heart, AlertCircle, ArrowDown, Info, Shield, Zap, Globe, Users } from "lucide-react";
import { useState, useEffect } from "react";
import emergencyTeamImage from "@assets/emergency_1749561339422.jpg";

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
      {/* Hero Section with 3D Effects */}
      <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            <div className="space-y-8" style={{
              transform: `translateY(${scrollPosition * -0.1}px)`,
            }}>
              <div className="inline-flex items-center bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-200/50 text-red-700 dark:text-red-300 px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <AlertCircle size={16} className="mr-2 animate-pulse" />
                {t('emergency.title')}
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                International Emergency Guide
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 font-light leading-relaxed">
                Comprehensive multilingual emergency response platform providing critical medical and safety information for global users.
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Access detailed emergency protocols, locate nearby hospitals, find country-specific emergency numbers, and get AI-powered medical assistance - all available offline.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/emergency">
                  <div className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/25 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <Flame className="w-5 h-5 group-hover:animate-pulse" />
                      <span>Emergency Protocols</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
                <Link href="/hospitals">
                  <div className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-blue-500/25 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <MapPin className="w-5 h-5 group-hover:animate-pulse" />
                      <span>Find Hospitals</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2 rounded-full text-sm shadow-lg">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">7 Languages</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2 rounded-full text-sm shadow-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Offline Ready</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2 rounded-full text-sm shadow-lg">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700">AI Powered</span>
                </div>
              </div>
            </div>

            {/* Hero Image with 3D Effects */}
            <div className="relative" style={{
              transform: `translateY(${scrollPosition * 0.05}px)`,
            }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02]">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent z-10"></div>
                
                {/* Mongolian Emergency Service Personnel */}
                <img 
                  src={emergencyTeamImage} 
                  alt="Mongolian emergency service personnel and helicopter rescue team" 
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                
                {/* Floating Stats Cards */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-gray-700">Available</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                      <div className="text-2xl font-bold text-red-600">7</div>
                      <div className="text-sm text-gray-700">Languages</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                      <div className="text-2xl font-bold text-green-600">50+</div>
                      <div className="text-sm text-gray-700">Protocols</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Action Button */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 cursor-pointer">
                    <Heart className="w-6 h-6" />
                  </div>
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

      {/* Enhanced Feature Cards */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-blue-300 dark:to-white mb-4">
              Emergency Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Quick access to life-saving information and emergency resources
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/emergency">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Emergency Protocols</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Step-by-step life-saving procedures for critical medical emergencies</p>
                  <div className="flex items-center mt-6 text-red-600 dark:text-red-400 font-semibold">
                    <span>Access Now</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/hospitals">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Hospital Finder</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Locate nearby hospitals and medical facilities with interactive maps</p>
                  <div className="flex items-center mt-6 text-blue-600 dark:text-blue-400 font-semibold">
                    <span>Find Hospitals</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/contacts">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Emergency Contacts</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Country-specific emergency numbers and contact information</p>
                  <div className="flex items-center mt-6 text-green-600 dark:text-green-400 font-semibold">
                    <span>View Contacts</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Numbers Section */}
      <section id="contacts" className="py-20 relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-900/10 dark:via-gray-900 dark:to-orange-900/10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={{
            transform: `translateY(${scrollPosition > 300 ? '0' : '20px'})`,
            opacity: scrollPosition > 300 ? 1 : 0,
            transition: 'all 0.6s ease-out'
          }}>
            <div className="inline-flex items-center bg-red-100 dark:bg-red-900/30 border border-red-200/50 px-6 py-2 rounded-full mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300 font-medium">Emergency Services</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-transparent mb-4">
              Emergency Numbers
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
      <section id="hospitals" className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/10 dark:via-gray-900 dark:to-cyan-900/10">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={{
            transform: `translateY(${scrollPosition > 500 ? '0' : '20px'})`,
            opacity: scrollPosition > 500 ? 1 : 0,
            transition: 'all 0.6s ease-out'
          }}>
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 border border-blue-200/50 px-6 py-2 rounded-full mb-6">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">Medical Facilities</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Hospital Finder
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Locate nearby hospitals and medical facilities with interactive maps and real-time information
            </p>
          </div>
          
          <div className="transform transition-all duration-700" style={{
            transform: scrollPosition > 500 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            opacity: scrollPosition > 500 ? 1 : 0,
          }}>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <HospitalFinder />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Protocols Section - Preview */}
      <section id="emergency" className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-red-900/10 dark:to-pink-900/10">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={{
            transform: `translateY(${scrollPosition > 800 ? '0' : '20px'})`,
            opacity: scrollPosition > 800 ? 1 : 0,
            transition: 'all 0.6s ease-out'
          }}>
            <div className="inline-flex items-center bg-red-100 dark:bg-red-900/30 border border-red-200/50 px-6 py-2 rounded-full mb-6">
              <Flame className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300 font-medium">Life-Saving Protocols</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-red-800 bg-clip-text text-transparent mb-4">
              Emergency Protocols
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive step-by-step emergency response procedures for critical medical situations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {emergencyProtocols.slice(0, 3).map((protocol, index) => (
              <div
                key={protocol.id}
                className="transform transition-all duration-700"
                style={{
                  transform: scrollPosition > 800 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  opacity: scrollPosition > 800 ? 1 : 0,
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <EmergencyProtocolCard
                      id={protocol.id}
                      title={protocol.title}
                      description={protocol.description}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center" style={{
            transform: `translateY(${scrollPosition > 900 ? '0' : '20px'})`,
            opacity: scrollPosition > 900 ? 1 : 0,
            transition: 'all 0.6s ease-out'
          }}>
            <Link href="/emergency">
              <div className="group inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/25 cursor-pointer">
                <span>View All Emergency Protocols</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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

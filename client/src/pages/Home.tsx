import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import EmergencyProtocolCard from "../components/EmergencyProtocolCard";
import { emergencyProtocols } from "../data/protocols";
import EmergencyNumbers from "../components/EmergencyNumbers";
import CountryEmergencyTabs from "../components/CountryEmergencyTabs";
import HospitalFinder from "../components/HospitalFinder";
import OfflineDataManager from "../components/OfflineDataManager";
import { Flame, MapPin, ArrowRight, Download, Heart, AlertCircle, ArrowDown, Info, Shield, Zap, Globe, Users, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-mobile";
// Using Unsplash for emergency team image
const emergencyTeamImage = "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

export default function Home() {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
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
      {/* Hero Section with Advanced 3D Effects */}
      <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Advanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hidden md:block absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/15 rounded-full blur-xl md:blur-3xl md:animate-pulse"></div>
          <div className="hidden md:block absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-red-500/15 to-pink-500/10 rounded-full blur-xl md:blur-3xl md:animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="hidden md:block absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-500/15 to-emerald-500/10 rounded-full blur-xl md:blur-3xl md:animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Floating geometric shapes */}
          <div className="hidden md:block absolute top-1/4 left-1/5 w-12 h-12 bg-white/30 backdrop-blur-sm rotate-45 md:animate-bounce shadow-lg md:shadow-2xl" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
          <div className="hidden md:block absolute top-3/4 right-1/4 w-8 h-8 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 backdrop-blur-sm rounded-full md:animate-bounce shadow-xl" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
          <div className="hidden md:block absolute bottom-1/3 left-2/3 w-6 h-20 bg-gradient-to-b from-purple-400/30 to-pink-500/30 backdrop-blur-sm rounded-full md:animate-pulse shadow-lg" style={{animationDelay: '2.5s'}}></div>
          <div className="hidden md:block absolute top-2/3 left-1/6 w-10 h-10 bg-gradient-to-r from-orange-400/35 to-red-500/30 backdrop-blur-sm rounded-lg rotate-12 md:animate-pulse shadow-xl" style={{animationDelay: '3.5s'}}></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '50px 50px'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            <div className="space-y-8" style={isMobile || prefersReducedMotion ? {} : {
              transform: `translateY(${scrollPosition * -0.1}px)`,
            }}>
              <div className="inline-flex items-center bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-200/50 text-red-700 dark:text-red-300 px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <AlertCircle size={16} className="mr-2 md:animate-pulse" />
                {t('emergency.title')}
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                {t('home.title')}
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 font-light leading-relaxed">
                {t('home.heroDescription')}
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {t('home.heroSubDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-12">
                <Link href="/emergency" className="w-full sm:w-auto">
                  <div className="group relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 active:from-red-700 active:via-red-600 active:to-red-800 hover:from-red-700 hover:via-red-600 hover:to-red-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-bold transition-all duration-300 sm:duration-500 transform active:scale-95 sm:hover:scale-110 active:translate-y-1 sm:hover:-translate-y-2 shadow-lg sm:shadow-2xl active:shadow-md sm:hover:shadow-3xl shadow-red-500/30 cursor-pointer overflow-hidden touch-manipulation">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
                    <div className="absolute -top-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-red-300/20 rounded-full blur-xl group-hover:scale-150 group-active:scale-125 transition-transform duration-300 sm:duration-500"></div>
                    <div className="absolute top-2 left-2 w-2 sm:w-3 h-2 sm:h-3 bg-white/40 rounded-full animate-ping"></div>
                    <div className="relative flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                      <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl group-hover:rotate-12 group-active:rotate-6 transition-transform duration-300 sm:duration-500">
                        <Flame className="w-5 sm:w-6 h-5 sm:h-6 md:group-hover:animate-pulse" />
                      </div>
                      <span className="text-base sm:text-lg text-center sm:text-left">{t('home.emergencyButton')}</span>
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-2 group-active:translate-x-1 transition-transform duration-300 sm:duration-500 hidden sm:block" />
                    </div>
                  </div>
                </Link>
                <Link href="/hospitals" className="w-full sm:w-auto">
                  <div className="group relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 active:from-blue-700 active:via-blue-600 active:to-blue-800 hover:from-blue-700 hover:via-blue-600 hover:to-blue-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-bold transition-all duration-300 sm:duration-500 transform active:scale-95 sm:hover:scale-110 active:translate-y-1 sm:hover:-translate-y-2 shadow-lg sm:shadow-2xl active:shadow-md sm:hover:shadow-3xl shadow-blue-500/30 cursor-pointer overflow-hidden touch-manipulation">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
                    <div className="absolute -top-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-blue-300/20 rounded-full blur-xl group-hover:scale-150 group-active:scale-125 transition-transform duration-300 sm:duration-500"></div>
                    <div className="absolute top-2 left-2 w-2 sm:w-3 h-2 sm:h-3 bg-white/40 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="relative flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                      <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl group-hover:rotate-12 group-active:rotate-6 transition-transform duration-300 sm:duration-500">
                        <MapPin className="w-5 sm:w-6 h-5 sm:h-6 md:group-hover:animate-pulse" />
                      </div>
                      <span className="text-base sm:text-lg text-center sm:text-left">{t('home.findHospital')}</span>
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-2 group-active:translate-x-1 transition-transform duration-300 sm:duration-500 hidden sm:block" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Mobile-Optimized Feature Pills */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mt-8" style={isMobile || prefersReducedMotion ? {} : {
                transform: `translateY(${scrollPosition * -0.02}px)`,
                opacity: Math.max(0.7, 1 - scrollPosition * 0.0005)
              }}>
                <div className="group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/35 via-white/30 to-white/25 backdrop-blur-xl border border-white/50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm shadow-xl sm:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-500 transform active:scale-95 sm:hover:scale-105 active:translate-y-0.5 sm:hover:-translate-y-1 touch-manipulation">
                  <div className="p-1 sm:p-1.5 bg-blue-500/25 rounded-full group-hover:rotate-12 group-active:rotate-6 transition-transform duration-300 sm:duration-500">
                    <Globe className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600 group-hover:text-blue-500 group-active:text-blue-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">8 {t('home.languages')}</span>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full md:animate-pulse"></div>
                </div>
                <div className="group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/35 via-white/30 to-white/25 backdrop-blur-xl border border-white/50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm shadow-xl sm:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-500 transform active:scale-95 sm:hover:scale-105 active:translate-y-0.5 sm:hover:-translate-y-1 touch-manipulation">
                  <div className="p-1 sm:p-1.5 bg-green-500/25 rounded-full group-hover:rotate-12 group-active:rotate-6 transition-transform duration-300 sm:duration-500">
                    <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-green-600 group-hover:text-green-500 group-active:text-green-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{t('home.offlineReady')}</span>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full md:animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
                <div className="group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/35 via-white/30 to-white/25 backdrop-blur-xl border border-white/50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm shadow-xl sm:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-500 transform active:scale-95 sm:hover:scale-105 active:translate-y-0.5 sm:hover:-translate-y-1 touch-manipulation">
                  <div className="p-1 sm:p-1.5 bg-yellow-500/25 rounded-full group-hover:rotate-12 group-active:rotate-6 transition-transform duration-300 sm:duration-500">
                    <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-600 group-hover:text-yellow-500 group-active:text-yellow-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{t('home.aiPowered')}</span>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full md:animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>

            {/* Hero Image with 3D Effects */}
            <div className="relative" style={isMobile || prefersReducedMotion ? {} : {
              transform: `translateY(${scrollPosition * 0.05}px)`,
            }}>
              <div className="relative rounded-3xl overflow-hidden shadow-lg md:shadow-2xl hover:shadow-lg md:hover:shadow-3xl transition-all duration-700 transform md:hover:scale-[1.02]">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent z-10"></div>
                
                {/* Mongolian Emergency Service Personnel */}
                <img 
                  src={emergencyTeamImage} 
                  alt="Mongolian emergency service personnel and helicopter rescue team" 
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                
                {/* Mobile-Optimized Floating Stats Cards */}
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-20">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="group relative bg-gradient-to-br from-white/35 via-white/30 to-white/20 backdrop-blur-xl border border-white/60 p-3 sm:p-5 rounded-2xl sm:rounded-3xl text-center shadow-lg sm:shadow-xl md:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-700 transform active:scale-95 md:hover:scale-110 active:translate-y-1 sm:hover:-translate-y-3 overflow-hidden touch-manipulation">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 sm:duration-700"></div>
                      <div className="hidden md:block absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 sm:w-10 h-6 sm:h-10 bg-green-400/40 rounded-full blur-sm sm:blur-md md:animate-pulse"></div>
                      <div className="hidden md:block absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-2 sm:w-3 h-2 sm:h-3 bg-white/60 rounded-full animate-ping"></div>
                      <div className="relative">
                        <div className="text-xl sm:text-3xl font-black text-white mb-1 sm:mb-2 drop-shadow-xl sm:drop-shadow-2xl">24/7</div>
                        <div className="text-xs sm:text-sm text-white/95 font-semibold tracking-wide">{t('home.available')}</div>
                      </div>
                    </div>
                    <div className="group relative bg-gradient-to-br from-white/35 via-white/30 to-white/20 backdrop-blur-xl border border-white/60 p-3 sm:p-5 rounded-2xl sm:rounded-3xl text-center shadow-lg sm:shadow-xl md:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-700 transform active:scale-95 md:hover:scale-110 active:translate-y-1 sm:hover:-translate-y-3 overflow-hidden touch-manipulation">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 sm:duration-700"></div>
                      <div className="hidden md:block absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 sm:w-10 h-6 sm:h-10 bg-cyan-400/40 rounded-full blur-sm sm:blur-md md:animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="hidden md:block absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-2 sm:w-3 h-2 sm:h-3 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="relative">
                        <div className="text-xl sm:text-3xl font-black text-white mb-1 sm:mb-2 drop-shadow-xl sm:drop-shadow-2xl">8</div>
                        <div className="text-xs sm:text-sm text-white/95 font-semibold tracking-wide">{t('home.languages')}</div>
                      </div>
                    </div>
                    <div className="group relative bg-gradient-to-br from-white/35 via-white/30 to-white/20 backdrop-blur-xl border border-white/60 p-3 sm:p-5 rounded-2xl sm:rounded-3xl text-center shadow-lg sm:shadow-xl md:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-700 transform active:scale-95 md:hover:scale-110 active:translate-y-1 sm:hover:-translate-y-3 overflow-hidden touch-manipulation">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 sm:duration-700"></div>
                      <div className="hidden md:block absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 sm:w-10 h-6 sm:h-10 bg-orange-400/40 rounded-full blur-sm sm:blur-md md:animate-pulse" style={{animationDelay: '1s'}}></div>
                      <div className="hidden md:block absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-2 sm:w-3 h-2 sm:h-3 bg-white/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      <div className="relative">
                        <div className="text-xl sm:text-3xl font-black text-white mb-1 sm:mb-2 drop-shadow-xl sm:drop-shadow-2xl">50+</div>
                        <div className="text-xs sm:text-sm text-white/95 font-semibold tracking-wide">{t('home.protocols')}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Action Button */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg md:shadow-xl hover:shadow-lg md:hover:shadow-2xl transition-all duration-300 transform md:hover:scale-110 cursor-pointer">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 md:animate-bounce transition-opacity duration-500">
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <span className="text-xs mb-2">{t('home.scrollForMore')}</span>
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
              {t('home.emergencyServices')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.emergencyServicesDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/emergency">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg md:shadow-xl hover:shadow-lg md:hover:shadow-2xl transition-all duration-500 transform md:hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('home.emergencyProtocolsTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('home.emergencyProtocolsDesc')}</p>
                  <div className="flex items-center mt-6 text-red-600 dark:text-red-400 font-semibold">
                    <span>{t('home.accessNow')}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/hospitals">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg md:shadow-xl hover:shadow-lg md:hover:shadow-2xl transition-all duration-500 transform md:hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('home.hospitalFinder')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('home.hospitalFinderDesc')}</p>
                  <div className="flex items-center mt-6 text-blue-600 dark:text-blue-400 font-semibold">
                    <span>{t('home.findHospitals')}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/contacts">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg md:shadow-xl hover:shadow-lg md:hover:shadow-2xl transition-all duration-500 transform md:hover:scale-105 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('home.emergencyContacts')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('home.emergencyContactsDesc')}</p>
                  <div className="flex items-center mt-6 text-green-600 dark:text-green-400 font-semibold">
                    <span>{t('home.viewContacts')}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Hospital Staff Access */}
          <div className="mt-12 text-center">
            <Link href="/hospital/login">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform md:hover:scale-105 shadow-lg md:shadow-xl hover:shadow-lg md:hover:shadow-2xl cursor-pointer" data-testid="link-hospital-staff">
                <Building2 className="w-6 h-6" />
                <span>{t('home.hospitalStaffPortal')}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
              {t('home.hospitalStaffAccess')}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Numbers Section */}
      <section id="contacts" className="py-20 relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-900/10 dark:via-gray-900 dark:to-orange-900/10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl md:blur-2xl md:animate-pulse"></div>
          <div className="hidden md:block absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-xl md:blur-2xl md:animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={isMobile || prefersReducedMotion ? {} : {
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
          <div className="transform transition-all duration-500" style={isMobile || prefersReducedMotion ? {} : {
            transform: scrollPosition > 200 ? 'translateY(0)' : 'translateY(20px)',
            opacity: scrollPosition > 200 ? 1 : 0,
          }}>
            <EmergencyNumbers />
          </div>
          
          {/* Other Countries Emergency Numbers */}
          <div className="mt-8 transform transition-all duration-500" style={isMobile || prefersReducedMotion ? {} : {
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
          <div className="hidden md:block absolute top-10 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-xl md:blur-3xl md:animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="hidden md:block absolute bottom-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl md:blur-2xl md:animate-pulse" style={{animationDelay: '2.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={isMobile || prefersReducedMotion ? {} : {
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
          
          <div className="transform transition-all duration-500 sm:duration-700" style={isMobile || prefersReducedMotion ? {} : {
            transform: scrollPosition > 500 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
            opacity: scrollPosition > 500 ? 1 : 0,
          }}>
            <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl active:shadow-lg sm:hover:shadow-3xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-300 sm:duration-500 transform active:scale-98 sm:hover:scale-[1.01] touch-manipulation">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 sm:duration-500"></div>
              <div className="relative">
                <HospitalFinder />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Protocols Section - Preview */}
      <section id="emergency" className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-red-900/10 dark:to-pink-900/10">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-xl md:blur-3xl md:animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="hidden md:block absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-xl md:blur-3xl md:animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={isMobile || prefersReducedMotion ? {} : {
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
            {emergencyProtocols.slice(0, 3).map((protocol, index) => (
              <div
                key={protocol.id}
                className="transform transition-all duration-500 sm:duration-700"
                style={isMobile || prefersReducedMotion ? {} : {
                  transform: scrollPosition > 800 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
                  opacity: scrollPosition > 800 ? 1 : 0,
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-500 transform active:scale-98 sm:hover:scale-105 active:translate-y-1 sm:hover:-translate-y-2 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden touch-manipulation">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 sm:duration-500"></div>
                  <div className="absolute -top-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-red-400/10 rounded-full blur-xl group-hover:scale-150 group-active:scale-125 transition-transform duration-300 sm:duration-500"></div>
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
          
          <div className="text-center" style={isMobile || prefersReducedMotion ? {} : {
            transform: `translateY(${scrollPosition > 900 ? '0' : '20px'})`,
            opacity: scrollPosition > 900 ? 1 : 0,
            transition: 'all 0.6s ease-out'
          }}>
            <Link href="/emergency">
              <div className="group inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform md:hover:scale-105 shadow-lg md:shadow-2xl hover:shadow-lg md:hover:shadow-2xl shadow-red-500/25 cursor-pointer">
                <span>View All Emergency Protocols</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Offline Mode Section */}
      <section id="offline-access" className="py-20 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-blue-900/10">
        {/* Floating Particle Effects */}
        <div className="absolute inset-0">
          <div className="hidden md:block absolute top-1/4 left-1/6 w-4 h-4 bg-indigo-400/30 rounded-full md:animate-bounce" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
          <div className="hidden md:block absolute top-3/4 right-1/4 w-6 h-6 bg-purple-400/25 rounded-full md:animate-bounce" style={{animationDelay: '1s', animationDuration: '5s'}}></div>
          <div className="hidden md:block absolute bottom-1/3 left-1/2 w-3 h-3 bg-blue-400/35 rounded-full md:animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
          <div className="hidden md:block absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-sm md:animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="hidden md:block absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-purple-400/15 to-pink-500/15 rounded-full blur-md md:animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12" style={isMobile || prefersReducedMotion ? {} : {
              transform: `translateY(${scrollPosition > 1000 ? '0' : '20px'})`,
              opacity: scrollPosition > 1000 ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}>
              <div className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200/50 px-6 py-2 rounded-full mb-6">
                <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">Offline Ready</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
                Offline Access
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Save emergency information for offline use - access critical protocols and medical data even without internet
              </p>
            </div>
            
            <div className="transform transition-all duration-500 sm:duration-700" style={isMobile || prefersReducedMotion ? {} : {
              transform: scrollPosition > 1000 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
              opacity: scrollPosition > 1000 ? 1 : 0,
            }}>
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl active:shadow-lg sm:hover:shadow-3xl transition-all duration-300 sm:duration-500 overflow-hidden relative transform active:scale-98 sm:hover:scale-[1.01] touch-manipulation">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-transparent to-purple-500/8 opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 sm:duration-500"></div>
                <div className="hidden md:block absolute -top-8 sm:-top-10 -right-8 sm:-right-10 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-r from-blue-400/15 to-purple-500/15 rounded-full blur-xl md:blur-2xl sm:blur-3xl group-hover:scale-110 group-active:scale-105 transition-transform duration-300 sm:duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3 sm:gap-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                      Emergency Data Manager
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-gradient-to-r from-green-500/15 to-emerald-500/15 backdrop-blur-sm border border-green-200/60 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-green-700 dark:text-green-300 shadow-lg active:shadow-md sm:hover:shadow-xl transition-all duration-300 touch-manipulation">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full md:animate-pulse"></div>
                      <span className="font-medium">Ready for Offline Use</span>
                    </div>
                  </div>
                  
                  <OfflineDataManager />
                  
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/25 dark:to-indigo-900/25 backdrop-blur-sm border border-blue-200/40 rounded-xl sm:rounded-2xl group-hover:border-blue-300/50 transition-all duration-300">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-500/25 rounded-lg sm:rounded-xl group-hover:bg-blue-500/30 transition-colors duration-300">
                        <Info className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">How Offline Mode Works</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                          All emergency protocols, contact numbers, and critical medical information are saved locally on your device. 
                          This ensures you can access life-saving information even in areas with poor connectivity or during network outages.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

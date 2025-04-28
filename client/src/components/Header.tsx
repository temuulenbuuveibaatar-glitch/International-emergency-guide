import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import LanguageSelector from "./LanguageSelector";
import RedCrossLogo from "./RedCrossLogo";
import { useTranslation } from "react-i18next";
import { Menu, X, PhoneCall, Heart } from "lucide-react";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
    toggleMobileMenu();
  };
  
  return (
    <header className={`${
      scrolled 
        ? "bg-white shadow-md py-2" 
        : "bg-white border-b border-gray-200 py-3"
      } sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group transition-transform duration-300 hover:scale-105">
              <div className="transform transition-transform duration-300 group-hover:rotate-12">
                <RedCrossLogo />
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary">
                  {t('header.title')}
                </h1>
                <p className="text-xs text-gray-500">{t('header.subtitle')}</p>
              </div>
            </div>
          </Link>
          
          {/* Emergency Call Button - Shown on Medium+ screens */}
          <div className="hidden md:flex items-center">
            <a href={`tel:${t('emergency.number')}`} className="mr-4 flex items-center gap-2 bg-red-100 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
              <PhoneCall className="w-4 h-4" />
              <span>{t('emergency.number')}</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            <button 
              className="md:hidden flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handleToggleMenu}
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Emergency Call Button - Mobile Floating Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <a 
          href={`tel:${t('emergency.number')}`} 
          className="flex items-center justify-center bg-primary hover:bg-[#C41C2D] text-white w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-110"
          aria-label="Emergency Call"
        >
          <PhoneCall className="w-6 h-6" />
        </a>
      </div>
    </header>
  );
}

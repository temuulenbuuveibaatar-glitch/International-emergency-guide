import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import LanguageSelector from "./LanguageSelector";
import RedCrossLogo from "./RedCrossLogo";
import { useTranslation } from "react-i18next";
import { Menu, X, PhoneCall, Heart, LogIn, User, Moon, Sun, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };
  
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
          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${t('emergency.number')}`} className="flex items-center gap-2 bg-red-100 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300">
              <PhoneCall className="w-4 h-4" />
              <span>{t('emergency.number')}</span>
            </a>
            
            {!isLoading && !user && (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center gap-2" data-testid="btn-header-login">
                    <LogIn className="w-4 h-4" />
                    {t('common.login') as string}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="flex items-center gap-2" data-testid="btn-header-signup">
                    <UserPlus className="w-4 h-4" />
                    {t('common.signUp') as string}
                  </Button>
                </Link>
              </>
            )}
            
            {!isLoading && user && (
              <Link href="/hospital">
                <Button variant="ghost" size="sm" className="flex items-center gap-2" data-testid="btn-header-profile">
                  <User className="w-4 h-4" />
                  {t('common.hospitalPortal') as string}
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
              data-testid="btn-dark-mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            
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

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { Globe, Check, ChevronDown } from "lucide-react";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t, i18n } = useTranslation();
  const [animateIcon, setAnimateIcon] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'de', name: 'Deutsch' },
    { code: 'mn', name: 'Монгол' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'es', name: 'Español' },
    { code: 'ru', name: 'Русский' }
  ];
  
  // Animate globe icon when the component mounts
  useEffect(() => {
    setAnimateIcon(true);
    const timer = setTimeout(() => setAnimateIcon(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const changeLanguage = (code: string, name: string) => {
    i18n.changeLanguage(code);
    setLanguage({ code, name });
    setIsOpen(false);
    
    // Trigger animation when language changes
    setAnimateIcon(true);
    setTimeout(() => setAnimateIcon(false), 2000);
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      setIsOpen(false);
    }
  };
  
  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative language-selector">
      <button 
        className={`flex items-center gap-2 py-2 px-3 rounded-full text-sm transition-all duration-300 ${
          isOpen 
            ? "bg-gray-100 text-gray-900 shadow-inner" 
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className={`w-4 h-4 text-primary ${animateIcon ? 'animate-spin' : ''}`} />
        <span>{language.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div 
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 transition-all duration-200 transform origin-top-right ${
          isOpen 
            ? 'scale-100 opacity-100' 
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              language.code === lang.code ? 'text-primary font-medium' : 'text-gray-700'
            }`}
            onClick={() => changeLanguage(lang.code, lang.name)}
          >
            {lang.name}
            {language.code === lang.code && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}

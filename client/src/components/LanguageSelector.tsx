import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t, i18n } = useTranslation();

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
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const changeLanguage = (code: string, name: string) => {
    i18n.changeLanguage(code);
    setLanguage({ code, name });
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      setIsOpen(false);
    }
  };
  
  // Add event listener for clicking outside
  useState(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  
  return (
    <div className="relative language-selector">
      <button 
        className="flex items-center gap-2 bg-white text-gray-700 py-2 px-3 rounded-md border border-gray-300 text-sm"
        onClick={toggleDropdown}
      >
        <span>{language.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 ${isOpen ? 'block' : 'hidden'}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => changeLanguage(lang.code, lang.name)}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

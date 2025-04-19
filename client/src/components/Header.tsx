import { useState } from "react";
import { Link } from "wouter";
import LanguageSelector from "./LanguageSelector";
import RedCrossLogo from "./RedCrossLogo";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
              <RedCrossLogo />
              <div>
                <h1 className="font-semibold text-lg text-primary">
                  {t('header.title')}
                </h1>
                <p className="text-xs text-gray-500">{t('header.subtitle')}</p>
              </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            <button 
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

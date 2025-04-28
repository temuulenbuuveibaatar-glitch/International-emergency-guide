import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import EmergencyBanner from "./EmergencyBanner";
import { navigationItems } from "../data/navigationItems";
import { useTranslation } from "react-i18next";
import * as LucideIcons from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu when changing location
  useEffect(() => {
    setIsMobileMenuOpen(true); // Always show the bottom navigation bar
  }, [location]);
  
  // Handle scroll to hide/show mobile navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolling down or up
      if (currentScrollY > lastScrollY + 10) {
        // Scrolling down - hide mobile nav
        setIsMobileNavVisible(false);
      } else if (currentScrollY < lastScrollY - 10) {
        // Scrolling up - show mobile nav
        setIsMobileNavVisible(true);
      }
      
      // Only update last scroll position if there's significant change
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        setLastScrollY(currentScrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleMobileMenu={toggleMobileMenu} />
      <Navigation isMobileMenuOpen={isMobileNavVisible} />
      
      {/* Emergency Banner */}
      <EmergencyBanner />
      
      <main className="flex-grow mb-24 md:mb-0">
        {children}
      </main>
      
      {/* Mobile Drawer Menu - Only shown when menu button is clicked */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <LucideIcons.X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto">
            <div className="space-y-4">
              {navigationItems.map((item) => {
                const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
                const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
                
                return (
                  <a 
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-red-50 text-primary font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{t(`nav.${item.key}`)}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <LucideIcons.CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { navigationItems } from "../data/navigationItems";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

interface NavigationProps {
  isMobileMenuOpen: boolean;
}

export default function Navigation({ isMobileMenuOpen }: NavigationProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [activeIndicatorStyles, setActiveIndicatorStyles] = useState({
    left: "0px",
    width: "0px",
    opacity: 0
  });
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  // Find and track the active menu item
  useEffect(() => {
    const activeIndex = navigationItems.findIndex(item => {
      // Check if current location matches this path exactly or if it's a sub-path
      if (item.path === "/") {
        return location === "/";
      }
      return location.startsWith(item.path);
    });
    
    setActiveItemIndex(activeIndex >= 0 ? activeIndex : null);
  }, [location]);

  // Update the position of the active indicator when window resizes or active item changes
  useEffect(() => {
    const updateIndicator = () => {
      if (activeItemIndex !== null) {
        const activeItem = document.getElementById(`nav-item-${activeItemIndex}`);
        if (activeItem) {
          const rect = activeItem.getBoundingClientRect();
          const navRect = document.getElementById('desktop-nav')?.getBoundingClientRect();
          
          if (navRect) {
            setActiveIndicatorStyles({
              left: `${rect.left - navRect.left}px`,
              width: `${rect.width}px`,
              opacity: 1
            });
          }
        }
      } else {
        setActiveIndicatorStyles({
          left: "0px",
          width: "0px",
          opacity: 0
        });
      }
    };
    
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeItemIndex]);
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-gradient-to-r from-primary to-red-700 text-white shadow-md hidden md:block sticky top-16 z-40">
        <div className="container mx-auto px-4 relative">
          <div 
            id="desktop-nav"
            className="flex items-center justify-center h-12 relative"
          >
            {/* Active indicator line */}
            <div 
              className="absolute bottom-0 h-1 bg-white rounded-t-full transition-all duration-300 ease-in-out"
              style={{
                left: activeIndicatorStyles.left,
                width: activeIndicatorStyles.width,
                opacity: activeIndicatorStyles.opacity,
              }}
            ></div>
            
            {navigationItems.map((item, index) => {
              // Dynamically import the icon from Lucide
              const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
              const isActive = index === activeItemIndex;
              const isHovered = index === hoveredItem;
              
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                >
                  <div 
                    id={`nav-item-${index}`}
                    className={`relative px-4 py-2 mx-1 text-sm font-medium cursor-pointer transition-all duration-300 rounded-t-lg ${
                      isActive 
                        ? 'text-white' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent 
                        className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} 
                      />
                      <span className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0.5' : ''}`}>
                        {t(`nav.${item.key}`)}
                      </span>
                    </div>
                    
                    {/* Hover indicator dot */}
                    {!isActive && isHovered && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation - Bottom Fixed Menu */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'transform-none' : 'transform translate-y-full'}`}>
        <div className="grid grid-cols-4 gap-1 p-1">
          {navigationItems.slice(0, 4).map((item, index) => {
            const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                  isActive 
                    ? 'bg-red-50 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                  <IconComponent className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{t(`nav.${item.key}`)}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="grid grid-cols-4 gap-1 p-1 pb-safe">
          {navigationItems.slice(4, 8).map((item, index) => {
            const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                  isActive 
                    ? 'bg-red-50 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                  <IconComponent className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{t(`nav.${item.key}`)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

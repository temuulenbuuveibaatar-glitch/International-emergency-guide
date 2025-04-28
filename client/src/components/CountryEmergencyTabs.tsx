import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { countryEmergencyNumbers, getIconComponent, IconType } from "../data/emergencyNumbers";
import { Phone, Globe, ChevronLeft, ChevronRight } from "lucide-react";

type EmergencyNumber = {
  id: string;
  type: string;
  number: string;
  icon: string;
}

export default function CountryEmergencyTabs() {
  const { t } = useTranslation();
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  
  // List of countries with available emergency numbers
  const countries = [
    { code: 'kr', name: 'Korea' },
    { code: 'de', name: 'Germany' },
    { code: 'cn', name: 'China' },
    { code: 'jp', name: 'Japan' },
    { code: 'es', name: 'Spain' },
    { code: 'us', name: 'USA' },
    { code: 'uk', name: 'UK' },
    { code: 'ru', name: 'Russia' }
  ];
  
  // Check if scrolling controls are needed
  useEffect(() => {
    const checkScroll = () => {
      if (tabsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);
  
  // Handle scroll buttons
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsRef.current.scrollLeft;
      
      tabsRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
      
      // Update scroll button visibility after scrolling
      setTimeout(() => {
        if (tabsRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
          setShowLeftScroll(scrollLeft > 0);
          setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
        }
      }, 300);
    }
  };
  
  const handleCountrySelect = (countryCode: string) => {
    setActiveCountry(countryCode);
  };
  
  const getEmergencyNumbersForCountry = (countryCode: string): EmergencyNumber[] => {
    return countryEmergencyNumbers[countryCode] || [];
  };
  
  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/-/g, '')}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <div className="relative">
        {/* Left scroll button */}
        {showLeftScroll && (
          <button 
            onClick={() => scrollTabs('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10 text-gray-600 hover:text-primary"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Country tabs */}
        <div 
          ref={tabsRef}
          className="flex overflow-x-auto border-b border-gray-200 py-1 px-6 scrollbar-hide"
          onScroll={() => {
            if (tabsRef.current) {
              const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
              setShowLeftScroll(scrollLeft > 0);
              setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
            }
          }}
        >
          {countries.map((country) => (
            <button 
              key={country.code}
              className={`px-4 py-3 mx-1 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-300 ${
                activeCountry === country.code 
                  ? 'text-primary border-primary bg-red-50 rounded-t-lg' 
                  : 'text-gray-700 border-transparent hover:text-primary hover:bg-gray-50 hover:rounded-t-lg'
              }`}
              onClick={() => handleCountrySelect(country.code)}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t(`countries.${country.code}`)}
              </div>
            </button>
          ))}
        </div>
        
        {/* Right scroll button */}
        {showRightScroll && (
          <button 
            onClick={() => scrollTabs('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10 text-gray-600 hover:text-primary"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="p-6">
        {activeCountry ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {getEmergencyNumbersForCountry(activeCountry).map((number) => {
              const IconComponent = getIconComponent(number.icon);
              const isHovered = hoveredCard === number.id;
              
              return (
                <div 
                  key={number.id} 
                  className={`flex items-center gap-3 p-4 border border-gray-200 rounded-lg transition-all duration-300 ${
                    isHovered 
                      ? 'shadow-md border-primary bg-gray-50 transform scale-[1.03]' 
                      : 'hover:shadow-sm hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredCard(number.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`p-3 rounded-full flex-shrink-0 transition-colors duration-300 ${
                    isHovered ? 'bg-primary text-white' : 'bg-red-100 text-primary'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm text-gray-600 font-medium">{t(`emergencyNumbers.${number.type}`)}</div>
                    <div className="font-mono font-bold text-lg">{number.number}</div>
                  </div>
                  <button 
                    onClick={() => handleCall(number.number)}
                    className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                      isHovered ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={`Call ${number.number}`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            
            {getEmergencyNumbersForCountry(activeCountry).length === 0 && (
              <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">{t('emergencyNumbers.noData')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-100">
            <Globe className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-blue-700 font-medium">{t('emergencyNumbers.selectCountry')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

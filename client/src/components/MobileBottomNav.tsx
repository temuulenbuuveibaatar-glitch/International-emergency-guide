import { useLocation, Link } from "wouter";
import { Home, Pill, Search, Filter, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  activeColor?: string;
}

interface MobileBottomNavProps {
  items?: NavItem[];
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home, activeColor: "text-blue-600" },
  { path: "/medications", label: "Meds", icon: Pill, activeColor: "text-green-600" },
  { path: "/symptoms", label: "Symptoms", icon: Search, activeColor: "text-purple-600" },
  { path: "/emergency", label: "Emergency", icon: Filter, activeColor: "text-red-600" },
  { path: "/hospitals", label: "Hospitals", icon: Settings, activeColor: "text-orange-600" },
];

export function MobileBottomNav({ 
  items = defaultNavItems,
  className 
}: MobileBottomNavProps) {
  const [location] = useLocation();

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg md:hidden safe-area-pb",
        className
      )}
      data-testid="mobile-bottom-nav"
    >
      <div className="flex items-stretch justify-around h-16">
        {items.map((item) => {
          const isActive = location === item.path || 
            (item.path !== "/" && location.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-h-[64px] px-2 transition-colors",
                "active:bg-gray-100 dark:active:bg-gray-800",
                isActive 
                  ? cn("text-primary", item.activeColor) 
                  : "text-gray-500 dark:text-gray-400"
              )}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon 
                className={cn(
                  "h-6 w-6 mb-1",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface MedicationsNavProps {
  activeSection?: 'all' | 'fda' | 'ema' | 'asia';
  onSectionChange?: (section: 'all' | 'fda' | 'ema' | 'asia') => void;
  className?: string;
}

export function MedicationsBottomNav({ 
  activeSection = 'all',
  onSectionChange,
  className 
}: MedicationsNavProps) {
  const sections = [
    { id: 'all' as const, label: 'All', flag: '🌍' },
    { id: 'fda' as const, label: 'FDA', flag: '🇺🇸' },
    { id: 'ema' as const, label: 'EMA', flag: '🇪🇺' },
    { id: 'asia' as const, label: 'Asia', flag: '🌏' },
  ];

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg md:hidden safe-area-pb",
        className
      )}
      data-testid="medications-bottom-nav"
    >
      <div className="flex items-stretch justify-around h-16">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange?.(section.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-h-[64px] px-2 transition-colors",
                "active:bg-gray-100 dark:active:bg-gray-800",
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-gray-500 dark:text-gray-400"
              )}
              data-testid={`nav-section-${section.id}`}
            >
              <span className="text-xl mb-0.5">{section.flag}</span>
              <span className={cn(
                "text-xs",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

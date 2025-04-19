import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { navigationItems } from "../data/navigationItems";

interface NavigationProps {
  isMobileMenuOpen: boolean;
}

export default function Navigation({ isMobileMenuOpen }: NavigationProps) {
  const { t } = useTranslation();
  
  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="hidden md:flex items-center h-12 space-x-8">
          {navigationItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className="text-white text-sm font-medium hover:text-gray-200"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

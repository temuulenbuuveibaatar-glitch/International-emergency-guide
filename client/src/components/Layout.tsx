import { ReactNode, useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import EmergencyBanner from "./EmergencyBanner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleMobileMenu={toggleMobileMenu} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} />
      
      {/* Mobile Menu (Hidden by default) */}
      <div className={`md:hidden bg-white border-b border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <a href="/" className="block text-gray-800 font-medium hover:text-primary">Home</a>
          <a href="/emergency" className="block text-gray-800 font-medium hover:text-primary">Emergency Protocols</a>
          <a href="/treatment" className="block text-gray-800 font-medium hover:text-primary">Treatment Guidelines</a>
          <a href="/medications" className="block text-gray-800 font-medium hover:text-primary">Medications</a>
          <a href="/symptoms" className="block text-gray-800 font-medium hover:text-primary">Symptom Checker</a>
          <a href="/hospitals" className="block text-gray-800 font-medium hover:text-primary">Nearby Hospitals</a>
          <a href="/contacts" className="block text-gray-800 font-medium hover:text-primary">Emergency Numbers</a>
        </div>
      </div>
      
      <EmergencyBanner />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}

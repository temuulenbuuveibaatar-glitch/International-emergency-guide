import { useTranslation } from "react-i18next";
import { Phone, Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-[#004A9F] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                <div className="text-primary font-bold text-xl">+</div>
              </div>
              <h3 className="font-semibold text-lg">{t('footer.title')}</h3>
            </div>
            <p className="text-sm text-gray-300">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white">{t('nav.home')}</a></li>
              <li><a href="/emergency" className="text-gray-300 hover:text-white">{t('nav.emergency')}</a></li>
              <li><a href="/treatment" className="text-gray-300 hover:text-white">{t('nav.treatment')}</a></li>
              <li><a href="/hospitals" className="text-gray-300 hover:text-white">{t('nav.hospitals')}</a></li>
              <li><a href="/contacts" className="text-gray-300 hover:text-white">{t('nav.contacts')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="w-5 h-5 mt-0.5" />
                <span>{t('footer.instagram')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-300">
              © 2023 International Emergency Guide. <span>{t('footer.rights')}</span>
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/youtuber_temka?igsh=MWVqZnJ4cmtreG5oag%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white" 
                aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

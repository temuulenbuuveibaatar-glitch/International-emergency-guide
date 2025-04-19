import { useTranslation } from "react-i18next";
import EmergencyNumbers from "../components/EmergencyNumbers";
import CountryEmergencyTabs from "../components/CountryEmergencyTabs";

export default function EmergencyContacts() {
  const { t } = useTranslation();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('emergencyNumbers.title')}
        </h1>

        <div className="max-w-5xl mx-auto">
          <p className="text-gray-600 text-center mb-8">
            {t('emergencyNumbers.description')}
          </p>

          <EmergencyNumbers />
          <CountryEmergencyTabs />
        </div>
      </div>
    </section>
  );
}

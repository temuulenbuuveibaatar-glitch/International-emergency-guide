import { useTranslation } from "react-i18next";
import EmergencyProtocolCard from "../components/EmergencyProtocolCard";
import { emergencyProtocols } from "../data/protocols";

export default function EmergencyProtocols() {
  const { t } = useTranslation();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('protocols.title')}
        </h1>

        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-gray-600 text-center">
            {t('protocols.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyProtocols.map((protocol) => (
            <EmergencyProtocolCard
              key={protocol.id}
              id={protocol.id}
              title={protocol.title}
              description={protocol.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import HospitalFinder from "../components/HospitalFinder";

export default function Hospitals() {
  const { t } = useTranslation();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('hospitals.title')}
        </h1>

        <div className="max-w-5xl mx-auto">
          <p className="text-gray-600 text-center mb-8">
            {t('hospitals.description')}
          </p>

          <HospitalFinder />
        </div>
      </div>
    </section>
  );
}

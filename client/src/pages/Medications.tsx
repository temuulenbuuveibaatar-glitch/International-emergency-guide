import { useTranslation } from "react-i18next";

export default function Medications() {
  const { t } = useTranslation();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('medications.title')}
        </h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {t('medications.description')}
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold text-lg">
                    {t('medications.comingSoon')}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {t('medications.comingSoonDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

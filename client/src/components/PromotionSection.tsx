import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Award, CheckCircle, Mail, User, AlertCircle } from "lucide-react";

export default function PromotionSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError(t('promotion.errorMessage'));
      return;
    }
    
    // In a real app, this would send the data to a server
    console.log("Submitting promotion request:", { name, email });
    
    // Clear form and show success message
    setEmail("");
    setName("");
    setError(null);
    setIsSubmitted(true);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-[#004A9F] to-[#0064D6] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-8 h-8 text-yellow-300" />
                <h2 className="text-3xl font-bold">{t('promotion.title')}</h2>
              </div>
              <p className="text-lg mb-6">{t('promotion.description')}</p>
              
              <h3 className="text-xl font-medium mb-3">{t('promotion.benefits')}</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>{t('promotion.benefit1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>{t('promotion.benefit2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>{t('promotion.benefit3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>{t('promotion.benefit4')}</span>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2 w-full">
              <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800">
                <h3 className="text-xl font-bold mb-4 text-[#004A9F]">{t('promotion.signUp')}</h3>
                
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{t('promotion.successMessage')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('footer.contact')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#004A9F] focus:border-[#004A9F]"
                          placeholder={t('promotion.namePlaceholder')}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#004A9F] focus:border-[#004A9F]"
                          placeholder={t('promotion.emailPlaceholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className="w-full bg-[#004A9F] hover:bg-[#0064D6] text-white py-2 px-4 rounded-md transition duration-200"
                    >
                      {t('promotion.subscribe')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
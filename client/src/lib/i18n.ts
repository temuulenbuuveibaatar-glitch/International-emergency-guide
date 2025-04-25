import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/translation.json";
import koTranslation from "../locales/ko/translation.json";
import deTranslation from "../locales/de/translation.json";
import mnTranslation from "../locales/mn/translation.json";
import zhTranslation from "../locales/zh/translation.json";
import jaTranslation from "../locales/ja/translation.json";
import esTranslation from "../locales/es/translation.json";
import ruTranslation from "../locales/ru/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ko: { translation: koTranslation },
      de: { translation: deTranslation },
      mn: { translation: mnTranslation },
      zh: { translation: zhTranslation },
      ja: { translation: jaTranslation },
      es: { translation: esTranslation },
      ru: { translation: ruTranslation }
    },
    fallbackLng: "en",
    debug: process.env.NODE_ENV !== "production",
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;

import { useState } from "react";
import { Sun, Moon, Eye, Type, Plus, Minus, Settings } from "lucide-react";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { useTranslation } from "react-i18next";

export default function AccessibilityPanel() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    setFontSize,
    isDarkMode,
    toggleDarkMode,
    highContrast,
    toggleHighContrast
  } = useAccessibility();

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
      {/* Panel content */}
      {isOpen && (
        <div className="mb-4 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-lg text-gray-800 dark:text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              {t('accessibility.title', 'Accessibility Settings')}
            </h3>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('accessibility.fontSize', 'Font Size')}
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-3 py-1.5 rounded-md flex items-center justify-center ${
                    fontSize === 'normal'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Type className="w-4 h-4 mr-1" />
                  <span className="text-sm">A</span>
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-3 py-1.5 rounded-md flex items-center justify-center ${
                    fontSize === 'large'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Type className="w-4 h-4 mr-1" />
                  <span className="text-base">A</span>
                </button>
                <button
                  onClick={() => setFontSize('x-large')}
                  className={`px-3 py-1.5 rounded-md flex items-center justify-center ${
                    fontSize === 'x-large'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Type className="w-4 h-4 mr-1" />
                  <span className="text-lg">A</span>
                </button>
              </div>
            </div>
            
            {/* Dark Mode */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('accessibility.theme', 'Display Mode')}
              </label>
              <div className="flex items-center">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="flex items-center">
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 mr-2" />
                    ) : (
                      <Sun className="w-4 h-4 mr-2" />
                    )}
                    {isDarkMode
                      ? t('accessibility.darkMode', 'Dark Mode')
                      : t('accessibility.lightMode', 'Light Mode')}
                  </span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
            
            {/* High Contrast */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('accessibility.contrast', 'High Contrast')}
              </label>
              <div className="flex items-center">
                <button
                  onClick={toggleHighContrast}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {t('accessibility.highContrast', 'High Contrast')}
                  </span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      highContrast ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('accessibility.note', 'Settings are saved automatically and will persist when you return.')}
            </p>
          </div>
        </div>
      )}
      
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center"
        aria-label={isOpen ? 'Close accessibility panel' : 'Open accessibility panel'}
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
}
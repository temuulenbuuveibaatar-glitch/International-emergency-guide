import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if the app is already installed
    const checkIfStandalone = () => {
      const isAppInstalled = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes('android-app://');
      
      setIsStandalone(isAppInstalled);
      return isAppInstalled;
    };

    // Check if it's an iOS device
    const checkIfIOS = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOSDevice(isIOS);
      return isIOS;
    };

    // Handle the beforeinstallprompt event for non-iOS devices
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Check if we should show the install prompt
      const hasUserDismissed = localStorage.getItem('app-install-dismissed');
      if (!hasUserDismissed) {
        setIsVisible(true);
      }
    };

    // Initialize
    const isAppAlreadyInstalled = checkIfStandalone();
    const isIOS = checkIfIOS();

    if (!isAppAlreadyInstalled) {
      // For iOS, we'll show our custom instructions
      if (isIOS) {
        // Only show iOS instructions if not recently dismissed
        const hasIOSDismissed = localStorage.getItem('ios-install-dismissed');
        const lastDismissed = parseInt(hasIOSDismissed || '0', 10);
        
        // Only show every 7 days
        if (!hasIOSDismissed || (Date.now() - lastDismissed > 7 * 24 * 60 * 60 * 1000)) {
          // Delay showing the iOS instructions to avoid annoying users
          const iosPromptTimer = setTimeout(() => {
            setIsVisible(true);
          }, 60000); // Show after 1 minute of use
          
          return () => clearTimeout(iosPromptTimer);
        }
      } else {
        // For Android/Chrome, listen for the install prompt
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOSDevice) {
      // For iOS, just show instructions toast
      toast({
        title: t('install.iosInstructionsTitle', 'Install on iOS'),
        description: t('install.iosInstructions', 'Tap the share button and then "Add to Home Screen"'),
        duration: 10000,
      });
      setIsVisible(false);
      // Remember that user has seen this
      localStorage.setItem('ios-install-dismissed', Date.now().toString());
    } else if (installPrompt) {
      // For Android/Chrome, trigger the install prompt
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          toast({
            title: t('install.success', 'Installation Started'),
            description: t('install.successDesc', 'Thanks for installing our app!'),
            duration: 3000,
          });
          setInstallPrompt(null);
        } else {
          // User declined, remember this to avoid showing again
          localStorage.setItem('app-install-dismissed', 'true');
        }
        
        setIsVisible(false);
      } catch (error) {
        console.error('Error installing app:', error);
      }
    }
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    if (isIOSDevice) {
      localStorage.setItem('ios-install-dismissed', Date.now().toString());
    } else {
      localStorage.setItem('app-install-dismissed', 'true');
    }
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700 md:w-auto md:max-w-md md:left-auto">
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="mr-3 flex-shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t('install.title', 'Install Emergency Guide')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {isIOSDevice
                ? t('install.iosDesc', 'Install this app on your device for offline access to critical emergency information.')
                : t('install.androidDesc', 'Install this app for quick access and offline use.')}
            </p>
          </div>
        </div>
        <button
          onClick={dismissPrompt}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <Button variant="outline" size="sm" onClick={dismissPrompt}>
          {t('install.later', 'Later')}
        </Button>
        <Button size="sm" onClick={handleInstallClick}>
          {t('install.install', 'Install')}
        </Button>
      </div>
    </div>
  );
}
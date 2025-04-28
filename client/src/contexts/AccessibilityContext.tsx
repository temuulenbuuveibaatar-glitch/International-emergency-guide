import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  fontSize: 'normal' | 'large' | 'x-large';
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Load saved settings from localStorage or use defaults
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>(() => {
    const savedSize = localStorage.getItem('accessibility_fontSize');
    return (savedSize as 'normal' | 'large' | 'x-large') || 'normal';
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('accessibility_darkMode');
    return savedMode === 'true' || false;
  });
  
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const savedContrast = localStorage.getItem('accessibility_highContrast');
    return savedContrast === 'true' || false;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibility_fontSize', fontSize);
    localStorage.setItem('accessibility_darkMode', isDarkMode.toString());
    localStorage.setItem('accessibility_highContrast', highContrast.toString());
    
    // Apply settings to the root HTML element
    document.documentElement.dataset.fontSize = fontSize;
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.dataset.highContrast = highContrast ? 'true' : 'false';
    
    // Apply dark mode class for tailwind
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [fontSize, isDarkMode, highContrast]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        fontSize, 
        setFontSize, 
        isDarkMode, 
        toggleDarkMode,
        highContrast,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
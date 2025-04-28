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

// Helper function to update the theme.json file content
const updateThemeAppearance = (isDark: boolean) => {
  try {
    // Update body class for immediate feedback
    if (isDark) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
    
    // Add the theme-dark class to html element
    if (isDark) {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (error) {
    console.error('Error updating theme appearance:', error);
  }
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Load saved settings from localStorage or use defaults
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>(() => {
    const savedSize = localStorage.getItem('accessibility_fontSize');
    return (savedSize as 'normal' | 'large' | 'x-large') || 'normal';
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check for user's preferred color scheme if no saved preference
    const savedMode = localStorage.getItem('accessibility_darkMode');
    if (savedMode === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedMode === 'true';
  });
  
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const savedContrast = localStorage.getItem('accessibility_highContrast');
    return savedContrast === 'true' || false;
  });

  // Initialize theme on component mount
  useEffect(() => {
    // Update theme appearance based on initial state
    updateThemeAppearance(isDarkMode);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibility_fontSize', fontSize);
    localStorage.setItem('accessibility_darkMode', isDarkMode.toString());
    localStorage.setItem('accessibility_highContrast', highContrast.toString());
    
    // Apply settings to the root HTML element
    document.documentElement.dataset.fontSize = fontSize;
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.dataset.highContrast = highContrast ? 'true' : 'false';
    
    // Apply dark mode updates
    updateThemeAppearance(isDarkMode);
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
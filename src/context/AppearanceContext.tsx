
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

const LOCAL_STORAGE_THEME_KEY = 'employmint-theme';
const LOCAL_STORAGE_ZOOM_KEY = 'employmint-zoom';

type Theme = 'light' | 'dark';

interface AppearanceContextType {
  theme: Theme;
  toggleTheme: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [zoomLevel, setZoomLevelState] = useState<number>(100);

  useEffect(() => {
    const localTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localTheme) {
      setThemeState(localTheme);
      if (localTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (prefersDark) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    } else {
      setThemeState('light');
       document.documentElement.classList.remove('dark');
    }

    const localZoom = localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY);
    if (localZoom) {
      setZoomLevelState(parseInt(localZoom, 10));
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    const newZoomLevel = Math.max(50, Math.min(200, level)); // Clamp between 50% and 200%
    setZoomLevelState(newZoomLevel);
    localStorage.setItem(LOCAL_STORAGE_ZOOM_KEY, newZoomLevel.toString());
  }, []);

  return (
    <AppearanceContext.Provider value={{ theme, toggleTheme, zoomLevel, setZoomLevel }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};

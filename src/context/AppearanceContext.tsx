
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

const LOCAL_STORAGE_THEME_KEY = 'employmint-theme';
const LOCAL_STORAGE_ZOOM_KEY = 'employmint-zoom';
const LOCAL_STORAGE_VIEW_MODE_KEY = 'employmint-view-mode';

type Theme = 'light' | 'dark';
type ViewMode = 'desktop' | 'mobile';

interface AppearanceContextType {
  theme: Theme;
  toggleTheme: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

// Helper functions for Fullscreen API
function requestFullscreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen().catch(err => console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
  } else if ((element as any).mozRequestFullScreen) { // Firefox
    (element as any).mozRequestFullScreen();
  } else if ((element as any).webkitRequestFullscreen) { // Chrome, Safari and Opera
    (element as any).webkitRequestFullscreen();
  } else if ((element as any).msRequestFullscreen) { // IE/Edge
    (element as any).msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(err => console.warn(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
  } else if ((document as any).mozCancelFullScreen) { // Firefox
    (document as any).mozCancelFullScreen();
  } else if ((document as any).webkitExitFullscreen) { // Chrome, Safari and Opera
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) { // IE/Edge
    (document as any).msExitFullscreen();
  }
}

function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).msFullscreenElement
  );
}


export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [zoomLevel, setZoomLevelState] = useState<number>(100);
  const [viewMode, setViewModeState] = useState<ViewMode>('desktop');

  useEffect(() => {
    // Theme initialization
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

    // Zoom level initialization
    const localZoom = localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY);
    if (localZoom) {
      setZoomLevelState(parseInt(localZoom, 10));
    }

    // View mode initialization
    const localViewMode = localStorage.getItem(LOCAL_STORAGE_VIEW_MODE_KEY) as ViewMode | null;
    if (localViewMode) {
      setViewModeState(localViewMode);
      // Note: We don't trigger fullscreen on initial load based on stored preference,
      // only on explicit user interaction via setViewMode.
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

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(LOCAL_STORAGE_VIEW_MODE_KEY, mode);

    if (typeof window !== 'undefined' && document.documentElement) {
        if (mode === 'mobile') {
          if (!isFullscreen()) {
            requestFullscreen(document.documentElement);
          }
        } else if (mode === 'desktop') {
          if (isFullscreen()) {
            exitFullscreen();
          }
        }
      }
  }, []);

  // Listen for fullscreen changes triggered by browser (e.g., Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!isFullscreen() && viewMode === 'mobile') {
        // If fullscreen was exited externally while in mobile view mode,
        // you might want to revert viewMode to 'desktop', or just let it be.
        // For now, we'll just log it. If desired, we can change viewModeState here.
        // setViewModeState('desktop'); // Example: revert to desktop if fullscreen exited
        console.log("Fullscreen exited, current view mode is still mobile.");
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [viewMode]);


  return (
    <AppearanceContext.Provider value={{ theme, toggleTheme, zoomLevel, setZoomLevel, viewMode, setViewMode }}>
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

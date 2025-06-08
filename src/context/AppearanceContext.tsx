
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

const LOCAL_STORAGE_THEME_KEY = 'employmint-theme';
const LOCAL_STORAGE_ZOOM_KEY = 'employmint-zoom';
const LOCAL_STORAGE_VIEW_MODE_KEY = 'employmint-view-mode';
const LOCAL_STORAGE_COLOR_PALETTE_KEY = 'employmint-color-palette';

type Theme = 'light' | 'dark';
type ViewMode = 'desktop' | 'mobile';

export interface ColorPalette {
  name: string;
  colors: {
    primary: string; // HSL string
    accent: string;  // HSL string
    secondary: string; // HSL string
  };
}

const availableColorPalettes: ColorPalette[] = [
  {
    name: 'Default',
    colors: { 
      primary: '207 88% 68%', 
      accent: '125 39% 64%',  
      secondary: '210 40% 92%', 
    },
  },
  {
    name: 'EmployMint',
    colors: {
      primary: '150 60% 50%',  
      accent: '207 88% 68%',   
      secondary: '170 50% 90%', 
    },
  },
  {
    name: 'Oceanic',
    colors: {
      primary: '220 70% 55%', 
      accent: '170 60% 45%',  
      secondary: '190 80% 92%', 
    },
  },
  {
    name: 'Sunset',
    colors: {
      primary: '30 90% 60%',   
      accent: '0 80% 70%',    
      secondary: '50 100% 90%', 
    },
  },
  {
    name: 'Forest',
    colors: {
      primary: '120 60% 35%',  
      accent: '30 40% 50%',   
      secondary: '90 30% 88%',  
    },
  }
];


interface AppearanceContextType {
  theme: Theme;
  toggleTheme: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeColorPaletteName: string;
  setActiveColorPalette: (paletteName: string) => void;
  availableColorPalettes: ColorPalette[];
  isDesktopFullscreen: boolean;
  toggleDesktopFullscreen: () => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

function requestFullscreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen().catch(err => console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
  } else if ((element as any).mozRequestFullScreen) { 
    (element as any).mozRequestFullScreen();
  } else if ((element as any).webkitRequestFullscreen) { 
    (element as any).webkitRequestFullscreen();
  } else if ((element as any).msRequestFullscreen) { 
    (element as any).msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(err => console.warn(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
  } else if ((document as any).mozCancelFullScreen) { 
    (document as any).mozCancelFullScreen();
  } else if ((document as any).webkitExitFullscreen) { 
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) { 
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
  const [activeColorPaletteName, setActiveColorPaletteNameState] = useState<string>(availableColorPalettes[0].name);
  const [isDesktopFullscreen, setIsDesktopFullscreen] = useState<boolean>(false);

  const applyColorPalette = useCallback((paletteName: string) => {
    const selectedPalette = availableColorPalettes.find(p => p.name === paletteName);
    if (selectedPalette && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary', selectedPalette.colors.primary);
      document.documentElement.style.setProperty('--accent', selectedPalette.colors.accent);
      document.documentElement.style.setProperty('--secondary', selectedPalette.colors.secondary);
    }
  }, []);
  
  useEffect(() => {
    const localTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localTheme) {
      setThemeState(localTheme);
      if (localTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else if (prefersDark) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    } else {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
    }

    const localZoom = localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY);
    if (localZoom) setZoomLevelState(parseInt(localZoom, 10));

    const localViewMode = localStorage.getItem(LOCAL_STORAGE_VIEW_MODE_KEY) as ViewMode | null;
    if (localViewMode) setViewModeState(localViewMode); // Initial set without triggering fullscreen side effects

    const localPaletteName = localStorage.getItem(LOCAL_STORAGE_COLOR_PALETTE_KEY);
    const initialPaletteName = localPaletteName && availableColorPalettes.find(p => p.name === localPaletteName) 
                              ? localPaletteName 
                              : availableColorPalettes[0].name;
    setActiveColorPaletteNameState(initialPaletteName);
    applyColorPalette(initialPaletteName);

  }, [applyColorPalette]);

  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
      if (newTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return newTheme;
    });
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    const newZoomLevel = Math.max(50, Math.min(200, level));
    setZoomLevelState(newZoomLevel);
    localStorage.setItem(LOCAL_STORAGE_ZOOM_KEY, newZoomLevel.toString());
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(LOCAL_STORAGE_VIEW_MODE_KEY, mode);

    if (typeof window !== 'undefined' && document.documentElement) {
        if (mode === 'mobile') {
          if (isDesktopFullscreen) { // Exit desktop fullscreen if active
              exitFullscreen();
              setIsDesktopFullscreen(false);
          }
          if (!isFullscreen()) { // Request fullscreen for mobile view simulation
            requestFullscreen(document.documentElement);
          }
        } else if (mode === 'desktop') {
          if (isFullscreen()) { // Exit any fullscreen when switching to desktop
            exitFullscreen();
          }
          setIsDesktopFullscreen(false); // Reset desktop fullscreen state
        }
      }
  }, [isDesktopFullscreen]);

  const setActiveColorPalette = useCallback((paletteName: string) => {
    setActiveColorPaletteNameState(paletteName);
    localStorage.setItem(LOCAL_STORAGE_COLOR_PALETTE_KEY, paletteName);
    applyColorPalette(paletteName);
  }, [applyColorPalette]);

  const toggleDesktopFullscreen = useCallback(() => {
    if (viewMode === 'desktop') {
      if (!isDesktopFullscreen) {
        requestFullscreen(document.documentElement);
        setIsDesktopFullscreen(true);
      } else {
        exitFullscreen();
        // Event listener will set isDesktopFullscreen to false
      }
    }
  }, [viewMode, isDesktopFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenStatus = isFullscreen();
      if (viewMode === 'desktop' && !fullscreenStatus && isDesktopFullscreen) {
        // User exited desktop-initiated fullscreen (e.g., Esc key)
        setIsDesktopFullscreen(false);
      }
      // If exiting fullscreen while in mobile view mode, setViewMode logic should handle re-entry if needed,
      // or the view might remain non-fullscreen until explicitly set again.
      // For this iteration, if user exits mobile-simulated fullscreen, it stays exited.
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
  }, [viewMode, isDesktopFullscreen]);


  return (
    <AppearanceContext.Provider value={{ 
      theme, toggleTheme, 
      zoomLevel, setZoomLevel, 
      viewMode, setViewMode,
      activeColorPaletteName, setActiveColorPalette,
      availableColorPalettes,
      isDesktopFullscreen, toggleDesktopFullscreen
    }}>
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

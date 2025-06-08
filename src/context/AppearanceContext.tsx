
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
    // Optional: specify foregrounds if default ones don't work
    // primaryForeground?: string;
    // accentForeground?: string;
    // secondaryForeground?: string;
  };
}

const availableColorPalettes: ColorPalette[] = [
  {
    name: 'Default',
    colors: { // Values from existing globals.css (light mode)
      primary: '207 88% 68%', // Soft Blue
      accent: '125 39% 64%',  // Muted Green
      secondary: '210 40% 92%', // Light Greyish Blue
    },
  },
  {
    name: 'EmployMint',
    colors: {
      primary: '150 60% 50%',  // Mint Green
      accent: '207 88% 68%',   // Soft Blue
      secondary: '170 50% 90%', // Light Teal/Aqua
    },
  },
  {
    name: 'Oceanic',
    colors: {
      primary: '220 70% 55%', // Deep Blue
      accent: '170 60% 45%',  // Teal
      secondary: '190 80% 92%', // Light Sky Blue
    },
  },
  {
    name: 'Sunset',
    colors: {
      primary: '30 90% 60%',   // Warm Orange
      accent: '0 80% 70%',    // Soft Red/Pink
      secondary: '50 100% 90%', // Pale Yellow
    },
  },
  {
    name: 'Forest',
    colors: {
      primary: '120 60% 35%',  // Deep Green
      accent: '30 40% 50%',   // Brown
      secondary: '90 30% 88%',  // Light Moss Green
    },
  }
];


interface AppearanceContextType {
  theme: Theme; // light | dark for base theme
  toggleTheme: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeColorPaletteName: string;
  setActiveColorPalette: (paletteName: string) => void;
  availableColorPalettes: ColorPalette[];
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
  const [activeColorPaletteName, setActiveColorPaletteNameState] = useState<string>(availableColorPalettes[0].name);

  const applyColorPalette = useCallback((paletteName: string) => {
    const selectedPalette = availableColorPalettes.find(p => p.name === paletteName);
    if (selectedPalette && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary', selectedPalette.colors.primary);
      document.documentElement.style.setProperty('--accent', selectedPalette.colors.accent);
      document.documentElement.style.setProperty('--secondary', selectedPalette.colors.secondary);
      // Note: If palettes defined specific foregrounds, set them here too.
      // e.g., document.documentElement.style.setProperty('--primary-foreground', selectedPalette.colors.primaryForeground);
    }
  }, []);
  
  useEffect(() => {
    // Theme (light/dark) initialization
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
    }

    // Color Palette Initialization
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
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
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

  const setActiveColorPalette = useCallback((paletteName: string) => {
    setActiveColorPaletteNameState(paletteName);
    localStorage.setItem(LOCAL_STORAGE_COLOR_PALETTE_KEY, paletteName);
    applyColorPalette(paletteName);
  }, [applyColorPalette]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!isFullscreen() && viewMode === 'mobile') {
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
    <AppearanceContext.Provider value={{ 
      theme, toggleTheme, 
      zoomLevel, setZoomLevel, 
      viewMode, setViewMode,
      activeColorPaletteName, setActiveColorPalette,
      availableColorPalettes
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


'use client';

import Link from 'next/link';
import { Cog, UserCircle, Maximize, Minimize } from 'lucide-react'; // Changed Briefcase to Cog
import { Button } from '@/components/ui/button';
import { SettingsPopover } from './SettingsPopover';
import { useAppearance } from '@/context/AppearanceContext'; 
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, toggleTheme, zoomLevel, setZoomLevel, viewMode, setViewMode, isDesktopFullscreen, toggleDesktopFullscreen } = useAppearance();

  return (
    <header className="py-6 px-4 md:px-8 border-b bg-card sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Cog className="h-8 w-8 text-primary" /> {/* Changed icon here */}
          <h1 className="text-3xl font-headline font-bold text-foreground">
            SkillSync
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          {viewMode === 'desktop' && (
            <>
              <Link href="/profile" passHref>
                <Button variant="ghost" size="icon" aria-label="User Profile">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDesktopFullscreen} 
                aria-label={isDesktopFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isDesktopFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
              </Button>
            </>
          )}
          <SettingsPopover 
            currentTheme={theme} 
            onToggleTheme={toggleTheme}
            currentZoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            currentViewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>
    </header>
  );
}

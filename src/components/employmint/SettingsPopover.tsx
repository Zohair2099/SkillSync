
'use client';

import React from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Info, Gift, Monitor, Smartphone, Palette as PaletteIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppearance } from '@/context/AppearanceContext';
import type { ColorPalette } from '@/context/AppearanceContext';

interface SettingsPopoverProps {
  currentTheme: 'light' | 'dark'; // This refers to the base light/dark mode
  onToggleTheme: () => void;
  currentZoomLevel: number;
  onZoomChange: (level: number) => void;
  currentViewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  // activeColorPaletteName and setActiveColorPalette will be taken from context
}

export function SettingsPopover({ 
  currentTheme, 
  onToggleTheme, 
  currentZoomLevel, 
  onZoomChange,
  currentViewMode,
  onViewModeChange
}: SettingsPopoverProps) {
  const { activeColorPaletteName, setActiveColorPalette, availableColorPalettes } = useAppearance();

  const handleZoomChange = (value: number[]) => {
    onZoomChange(value[0]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize your experience.
            </p>
          </div>
          <Separator />
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                <span>Dark Mode</span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Toggle base light/dark themes.
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={currentTheme === 'dark'}
                onCheckedChange={onToggleTheme}
                aria-label="Toggle dark mode"
              />
            </div>
            <Separator />
            <div>
              <Label className="block mb-1 text-sm font-medium">Color Palette</Label>
               <span className="text-xs font-normal leading-snug text-muted-foreground mb-2 block">
                  Choose a palette for primary & accent colors.
                </span>
              <RadioGroup
                value={activeColorPaletteName}
                onValueChange={setActiveColorPalette}
                className="grid grid-cols-2 gap-2 mt-1"
              >
                {availableColorPalettes.map((palette: ColorPalette) => (
                  <div key={palette.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={palette.name} id={`palette-${palette.name}`} />
                    <Label htmlFor={`palette-${palette.name}`} className="text-sm font-normal flex items-center gap-1.5">
                      <PaletteIcon className="h-4 w-4" style={{ color: `hsl(${palette.colors.primary})` }} /> 
                      {palette.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
             <Separator />
            <div>
              <Label htmlFor="display-size" className="block mb-1">Display Size: {currentZoomLevel}%</Label>
               <span className="text-xs font-normal leading-snug text-muted-foreground mb-2 block">
                  Scales text and all UI elements.
                </span>
              <Slider
                id="display-size"
                min={50}
                max={200} 
                step={10}
                value={[currentZoomLevel]}
                onValueChange={handleZoomChange}
              />
            </div>
            <Separator />
            <div>
                <Label className="block mb-2">View Mode</Label>
                <RadioGroup 
                  value={currentViewMode} 
                  onValueChange={(value: 'desktop' | 'mobile') => onViewModeChange(value)} 
                  className="flex space-x-2"
                >
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="desktop" id="desktop-view" />
                        <Label htmlFor="desktop-view" className="flex items-center gap-1.5 text-sm font-normal"><Monitor className="h-4 w-4"/>Desktop</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="mobile" id="mobile-view" />
                        <Label htmlFor="mobile-view" className="flex items-center gap-1.5 text-sm font-normal"><Smartphone className="h-4 w-4"/>Mobile</Label>
                    </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-1">Simulates a narrower viewport for mobile view. Actual mobile rendering may vary.</p>
            </div>
          </div>
          <Separator />
           <div className="grid gap-2">
             <Link href="/faqs" passHref>
               <Button variant="ghost" className="justify-start w-full">
                  <Info className="mr-2 h-4 w-4" /> FAQs
               </Button>
             </Link>
             <Link href="/credits" passHref>
               <Button variant="ghost" className="justify-start w-full">
                  <Gift className="mr-2 h-4 w-4" /> Credits
               </Button>
             </Link>
           </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

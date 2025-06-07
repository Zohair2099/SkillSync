
'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Moon, Sun, ZoomIn, Info, Gift } from 'lucide-react';
import { Separator } from '../ui/separator';

interface SettingsPopoverProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function SettingsPopover({ currentTheme, onToggleTheme }: SettingsPopoverProps) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
    // Note: True application zoom is complex. This is a placeholder.
    // For a simple visual effect, you could use:
    // document.body.style.transform = `scale(${value[0] / 100})`;
    // document.body.style.transformOrigin = 'top left'; 
    // However, this has many side effects and is not recommended for production.
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
                  Toggle between light and dark themes.
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
              <Label htmlFor="zoom-level" className="block mb-1">Zoom Level: {zoomLevel}%</Label>
               <span className="text-xs font-normal leading-snug text-muted-foreground mb-2 block">
                  Adjust application zoom (UI placeholder).
                </span>
              <Slider
                id="zoom-level"
                min={50}
                max={200}
                step={10}
                defaultValue={[100]}
                onValueChange={handleZoomChange}
                disabled // Disabled for now as true app zoom is complex
              />
              <p className="text-xs text-muted-foreground mt-1">Note: Full app zoom is typically handled by your browser (Ctrl/Cmd + +/-).</p>
            </div>
          </div>
          <Separator />
           <div className="grid gap-2">
             <Button variant="ghost" className="justify-start w-full">
                <Info className="mr-2 h-4 w-4" /> FAQs
             </Button>
             <Button variant="ghost" className="justify-start w-full">
                <Gift className="mr-2 h-4 w-4" /> Credits
             </Button>
           </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

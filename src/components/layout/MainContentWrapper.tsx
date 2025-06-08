
'use client'; // This component uses client-side hooks

import React from 'react';
import { useAppearance } from '@/context/AppearanceContext';
import { cn } from '@/lib/utils'; // Import cn utility

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { zoomLevel, viewMode } = useAppearance();

  const wrapperStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel / 100})`,
    transformOrigin: 'top',
    transition: 'transform 0.2s ease-out, max-width 0.3s ease-out',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  if (viewMode === 'mobile') {
    wrapperStyle.maxWidth = '420px';
    wrapperStyle.margin = '0 auto';
  } else {
    wrapperStyle.maxWidth = '100%';
  }

  return (
    <div
      style={wrapperStyle}
      className={cn(
        "main-content-wrapper",
        "bg-background" // Added bg-background here
      )}
    >
      {children}
    </div>
  );
}

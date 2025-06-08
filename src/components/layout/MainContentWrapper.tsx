
'use client'; // This component uses client-side hooks

import React from 'react';
import { useAppearance } from '@/context/AppearanceContext';

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
    // Optionally, add a subtle border or shadow to better distinguish the "mobile" view
    // wrapperStyle.borderLeft = '1px solid hsl(var(--border))';
    // wrapperStyle.borderRight = '1px solid hsl(var(--border))';
    // wrapperStyle.boxShadow = '0 0 15px rgba(0,0,0,0.1)';
  } else {
    wrapperStyle.maxWidth = '100%'; // Ensure it takes full width in desktop mode
  }

  return (
    <div
      style={wrapperStyle}
      className="main-content-wrapper" // This class can be used for additional global styling if needed
    >
      {children}
    </div>
  );
}

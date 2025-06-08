
'use client'; // This component uses client-side hooks

import React from 'react';
import { useAppearance } from '@/context/AppearanceContext';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { zoomLevel } = useAppearance();
  return (
    <div
      style={{
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'top',
        transition: 'transform 0.2s ease-out',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      className="main-content-wrapper"
    >
      {children}
    </div>
  );
}

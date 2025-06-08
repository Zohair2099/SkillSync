
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { JobResultsProvider } from '@/context/JobResultsContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { ResumeDataProvider } from '@/context/ResumeDataContext';
import { AppearanceProvider, useAppearance } from '@/context/AppearanceContext';


export const metadata: Metadata = {
  title: 'EmployMint',
  description: 'AI-Powered Career Advancement Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppearanceProvider>
          <ProfileProvider>
            <JobResultsProvider>
              <ResumeDataProvider>
                <MainContentWrapper>
                  {children}
                </MainContentWrapper>
              </ResumeDataProvider>
            </JobResultsProvider>
          </ProfileProvider>
          <Toaster />
        </AppearanceProvider>
      </body>
    </html>
  );
}

// This new component will consume the context
function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { zoomLevel } = useAppearance();
  return (
    <div 
      style={{ 
        transform: `scale(${zoomLevel / 100})`, 
        transformOrigin: 'top',
        transition: 'transform 0.2s ease-out', // Optional: smooth transition for zoom
        minHeight: '100vh', // Ensure the scaled content still takes up height
        display: 'flex',
        flexDirection: 'column'
      }}
      className="main-content-wrapper" // Added for potential fine-tuning with CSS
    >
      {children}
    </div>
  );
}

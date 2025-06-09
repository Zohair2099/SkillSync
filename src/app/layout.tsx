
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { JobResultsProvider } from '@/context/JobResultsContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { ResumeDataProvider } from '@/context/ResumeDataContext';
import { AppearanceProvider } from '@/context/AppearanceContext';
import MainContentWrapper from '@/components/layout/MainContentWrapper';
import { MobileBottomNavigation } from '@/components/layout/MobileBottomNavigation'; // Added import

export const metadata: Metadata = {
  title: 'SkillSync',
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
                <MobileBottomNavigation /> 
              </ResumeDataProvider>
            </JobResultsProvider>
          </ProfileProvider>
          <Toaster />
        </AppearanceProvider>
      </body>
    </html>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Brain, Plus, UserCircle } from 'lucide-react'; // Assuming these are the icons used
import { useAppearance } from '@/context/AppearanceContext';
import { cn } from '@/lib/utils';

const tabDefinitions = [
  { href: "/", value: "job-matcher", title: "Matcher", icon: Briefcase },
  { href: "/#job-analyzer", internalTabValue:"job-analyzer", title: "Analyzer", icon: Brain }, // Assuming page.tsx handles tab switching via hash
  { href: "/#employmint-plus", internalTabValue:"employmint-plus", title: "EmployMint+", icon: Plus },
  { href: "/profile", title: "Profile", icon: UserCircle },
];

export function MobileBottomNavigation() {
  const { viewMode } = useAppearance();
  const pathname = usePathname();

  if (viewMode !== 'mobile') {
    return null;
  }

  // For tabs that are sections on the homepage, we might need a more complex active check if using hashes
  // For now, direct href match is primary.
  const isActive = (tabHref: string, internalTabValue?: string) => {
    if (tabHref === "/profile") return pathname === "/profile";
    // For homepage tabs, ideally the main page component would set a context or query param for active internal tab
    // Simplified check: if on homepage, and no other specific page is active, consider "Matcher" active by default.
    // This logic may need refinement based on how page.tsx manages its internal Tabs state or if using URL hashes.
    if (pathname === "/") {
        if (internalTabValue) {
            // This part is tricky as this component doesn't know about page.tsx's internal tab state
            // A more robust solution might involve a global state for the active tab on the homepage.
            // For now, we'll just highlight the main "Matcher" if on "/"
            return tabHref === "/";
        }
        return tabHref === "/";
    }
    return pathname === tabHref;
  };
  

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 h-20 border-t bg-background shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] dark:shadow-[-2px_0px_10px_rgba(255,255,255,0.05)] p-0 rounded-none",
        )}
      >
        {tabDefinitions.map((tab) => {
            const active = isActive(tab.href, tab.internalTabValue);
            const linkHref = tab.internalTabValue ? `/#${tab.internalTabValue}` : tab.href;

            return (
              <Link
                href={linkHref}
                key={tab.title}
                className={cn(
                  "mobile-nav-item flex flex-col items-center justify-center h-full text-xs p-1 rounded-none text-muted-foreground",
                   active && "mobile-tab-active"
                )}
              >
                <tab.icon className={cn("h-5 w-5", active && "text-primary-foreground")} />
                <span className={cn("text-xs order-first mb-1 font-medium", active && "text-primary-foreground")}>
                  {tab.title.split(' ')[0]}
                </span>
              </Link>
            );
        })}
      </div>
      <style jsx global>{`
        .mobile-tab-active {
          background-color: hsl(var(--primary)) !important;
          box-shadow: inset 0 3px 0 0 hsl(var(--primary)) !important; /* This shadow might be redundant if bg is primary */
        }
        .mobile-tab-active span,
        .mobile-tab-active svg {
          color: hsl(var(--primary-foreground)) !important;
        }
      `}</style>
    </>
  );
}

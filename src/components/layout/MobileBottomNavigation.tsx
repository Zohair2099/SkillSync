
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Brain, Plus, UserCircle } from 'lucide-react';
import { useAppearance } from '@/context/AppearanceContext';
import { cn } from '@/lib/utils';

// Define tab IDs consistent with HOME_PAGE_TAB_IDS in page.tsx
const HOMEPAGE_TAB_IDS = ["job-matcher", "job-analyzer", "employmint-plus"];

const TABS = [
  { href: `/#${HOMEPAGE_TAB_IDS[0]}`, title: "Matcher", icon: Briefcase, id: HOMEPAGE_TAB_IDS[0] },
  { href: `/#${HOMEPAGE_TAB_IDS[1]}`, title: "Analyzer", icon: Brain, id: HOMEPAGE_TAB_IDS[1] },
  { href: `/#${HOMEPAGE_TAB_IDS[2]}`, title: "EmployMint+", icon: Plus, id: HOMEPAGE_TAB_IDS[2] },
  { href: "/profile", title: "Profile", icon: UserCircle, id: "profile" },
];

export function MobileBottomNavigation() {
  const { viewMode } = useAppearance();
  const pathname = usePathname();
  const [activeTabId, setActiveTabId] = useState<string>(TABS[0].id);

  useEffect(() => {
    const determineActiveTab = () => {
      const currentPath = pathname; // From usePathname(), reliable
      const currentHash = typeof window !== "undefined" ? window.location.hash.substring(1) : "";

      if (currentPath === "/profile") {
        return "profile";
      }
      if (currentPath === "/") {
        if (HOMEPAGE_TAB_IDS.includes(currentHash)) {
          return currentHash;
        }
        return HOMEPAGE_TAB_IDS[0]; // Default for homepage
      }
      // Fallback for other pages, though MobileBottomNavigation is primarily for / and /profile
      const foundTab = TABS.find(tab => tab.href === currentPath || (currentPath === '/' && tab.href.startsWith('/#')));
      return foundTab ? foundTab.id : TABS[0].id;
    };

    setActiveTabId(determineActiveTab());

    // Listen for hash changes and popstate (browser back/forward)
    const handleRouteChange = () => {
      setActiveTabId(determineActiveTab());
    };
    
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange); // Important for back/forward navigation
    
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [pathname]); // Re-evaluate when pathname changes


  if (viewMode !== 'mobile') {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 h-20 border-t bg-background shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] dark:shadow-[-2px_0px_10px_rgba(255,255,255,0.05)] p-0 rounded-none",
        )}
      >
        {TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <Link
                href={tab.href} 
                key={tab.id}
                className={cn(
                  "mobile-nav-item flex flex-col items-center justify-center h-full text-xs p-1 text-muted-foreground transition-all duration-150 ease-in-out",
                   isActive ? "mobile-tab-active rounded-lg" : "rounded-none"
                )}
                // onClick might be needed if Link alone doesn't trigger hashchange reliably for page.tsx
                // For now, relying on Link to change URL and `page.tsx` to listen to hashchange.
              >
                <span className={cn("text-xs order-first mb-0.5 font-medium", isActive && "text-primary-foreground")}>
                  {tab.title}
                </span>
                <tab.icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
              </Link>
            );
        })}
      </div>
      <style jsx global>{`
        .mobile-tab-active {
          background-color: hsl(var(--primary)) !important;
        }
        .mobile-tab-active span,
        .mobile-tab-active svg {
          color: hsl(var(--primary-foreground)) !important;
        }
      `}</style>
    </>
  );
}

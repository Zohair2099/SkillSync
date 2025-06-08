
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Brain, Plus, UserCircle } from 'lucide-react';
import { useAppearance } from '@/context/AppearanceContext';
import { cn } from '@/lib/utils';

// Simplified tab definitions with a unique 'id' for state management
const TABS = [
  { href: "/#job-matcher", title: "Matcher", icon: Briefcase, id: "job-matcher" },
  { href: "/#job-analyzer", title: "Analyzer", icon: Brain, id: "job-analyzer" },
  { href: "/#employmint-plus", title: "EmployMint+", icon: Plus, id: "employmint-plus" },
  { href: "/profile", title: "Profile", icon: UserCircle, id: "profile" },
];

export function MobileBottomNavigation() {
  const { viewMode } = useAppearance();
  const pathname = usePathname();
  // State to track the currently active tab's ID
  const [currentActiveTabId, setCurrentActiveTabId] = useState<string>(TABS[0].id);

  useEffect(() => {
    const determineActiveTab = () => {
      const hash = window.location.hash.substring(1);
      if (pathname === "/profile") {
        return "profile";
      }
      // For homepage tabs, the active tab is determined by the hash
      if (pathname === "/") {
        if (hash === "job-analyzer") return "job-analyzer";
        if (hash === "employmint-plus") return "employmint-plus";
        // Default to job-matcher if no hash or if hash is job-matcher (or any other unrecognized hash on /)
        return "job-matcher"; 
      }
      return TABS[0].id; // Fallback to the first tab's id if no specific match
    };

    setCurrentActiveTabId(determineActiveTab());

    // Listen to hash changes to update the active tab styling
    const handleHashChange = () => {
      setCurrentActiveTabId(determineActiveTab());
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]); // Re-evaluate when pathname changes (e.g., navigating to /profile or back to /)


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
            const active = currentActiveTabId === tab.id;
            return (
              <Link
                href={tab.href} // Use the direct href from tab definition
                key={tab.id}
                className={cn(
                  "mobile-nav-item flex flex-col items-center justify-center h-full text-xs p-1 text-muted-foreground transition-all duration-150 ease-in-out",
                   active ? "mobile-tab-active rounded-lg" : "rounded-none"
                )}
              >
                <span className={cn("text-xs order-first mb-0.5 font-medium", active && "text-primary-foreground")}>
                  {tab.title}
                </span>
                <tab.icon className={cn("h-5 w-5", active && "text-primary-foreground")} />
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

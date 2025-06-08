
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Brain, Plus, UserCircle } from 'lucide-react';
import { useAppearance } from '@/context/AppearanceContext';
import { cn } from '@/lib/utils';

const tabDefinitions = [
  { href: "/", title: "Matcher", icon: Briefcase, baseTabValue: "job-matcher" },
  { href: "/#job-analyzer", internalTabValue:"job-analyzer", title: "Analyzer", icon: Brain },
  { href: "/#employmint-plus", internalTabValue:"employmint-plus", title: "EmployMint+", icon: Plus },
  { href: "/profile", title: "Profile", icon: UserCircle },
];

export function MobileBottomNavigation() {
  const { viewMode } = useAppearance();
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState(
    typeof window !== 'undefined' ? window.location.hash.substring(1) : ''
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.substring(1));
    };

    // Set initial hash correctly
    setCurrentHash(window.location.hash.substring(1));
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);


  if (viewMode !== 'mobile') {
    return null;
  }

  const isActive = (tabHref: string, internalTabValue?: string, baseTabValue?: string) => {
    if (tabHref === "/profile") return pathname === "/profile";

    if (pathname === "/") {
      if (currentHash && internalTabValue) {
        return currentHash === internalTabValue;
      }
      if (baseTabValue) { // For Matcher tab
        return currentHash === baseTabValue || (!currentHash && tabHref === "/");
      }
      // Fallback if no internalTabValue and no baseTabValue (shouldn't happen with current defs)
      if (!currentHash && tabHref === "/") {
        return true;
      }
    }
    return false;
  };


  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 h-20 border-t bg-background shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] dark:shadow-[-2px_0px_10px_rgba(255,255,255,0.05)] p-0 rounded-none",
        )}
      >
        {tabDefinitions.map((tab) => {
            const active = isActive(tab.href, tab.internalTabValue, tab.baseTabValue);
            const linkHref = tab.internalTabValue ? `/#${tab.internalTabValue}` : (tab.baseTabValue && tab.href === "/" ? `/#${tab.baseTabValue}`: tab.href) ;


            return (
              <Link
                href={linkHref}
                key={tab.title}
                className={cn(
                  "mobile-nav-item flex flex-col items-center justify-center h-full text-xs p-1 text-muted-foreground transition-all duration-150 ease-in-out",
                   active ? "mobile-tab-active rounded-lg" : "rounded-none"
                )}
              >
                <span className={cn("text-xs order-first mb-0.5 font-medium", active && "text-primary-foreground")}>
                  {tab.title.split(' ')[0]}
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

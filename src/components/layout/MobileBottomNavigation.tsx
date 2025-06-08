
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Brain, Plus, UserCircle } from 'lucide-react'; 
import { useAppearance } from '@/context/AppearanceContext';
import { cn } from '@/lib/utils';

const tabDefinitions = [
  { href: "/", value: "job-matcher", title: "Matcher", icon: Briefcase },
  { href: "/#job-analyzer", internalTabValue:"job-analyzer", title: "Analyzer", icon: Brain }, 
  { href: "/#employmint-plus", internalTabValue:"employmint-plus", title: "EmployMint+", icon: Plus },
  { href: "/profile", title: "Profile", icon: UserCircle },
];

export function MobileBottomNavigation() {
  const { viewMode } = useAppearance();
  const pathname = usePathname();
  const hash = typeof window !== 'undefined' ? window.location.hash.substring(1) : '';


  if (viewMode !== 'mobile') {
    return null;
  }

  const isActive = (tabHref: string, internalTabValue?: string) => {
    if (tabHref === "/profile") return pathname === "/profile";
    
    if (pathname === "/") {
      // If there's a hash, it determines the active tab
      if (hash && internalTabValue) {
        return hash === internalTabValue;
      }
      // If no hash, and it's the base "Matcher" tab, it's active
      if (!hash && tabHref === "/") {
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
            const active = isActive(tab.href, tab.internalTabValue);
            const linkHref = tab.internalTabValue ? `/#${tab.internalTabValue}` : tab.href;

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

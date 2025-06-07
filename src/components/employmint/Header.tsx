
'use client';

import Link from 'next/link';
import { Briefcase, UserCircle, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SettingsPopover } from './SettingsPopover';

export function Header() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const localTheme = localStorage.getItem('employmint-theme');
    if (localTheme) {
      setTheme(localTheme);
      if (localTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('employmint-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="py-6 px-4 md:px-8 border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-foreground">
            EmployMint
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/profile" passHref>
            <Button variant="ghost" size="icon" aria-label="User Profile">
              <UserCircle className="h-6 w-6" />
            </Button>
          </Link>
          <SettingsPopover currentTheme={theme} onToggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
}


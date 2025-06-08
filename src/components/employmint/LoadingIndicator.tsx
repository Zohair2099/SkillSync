
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const motivationalQuotes = [
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Opportunities don't happen, you create them. - Chris Grosser",
  "Don’t stop when you’re tired. Stop when you’re done. - Unknown",
  "Wake up with determination. Go to bed with satisfaction. - Unknown",
  "It’s going to be hard, but hard does not mean impossible. - Unknown",
  "The key to success is to focus on goals, not obstacles. - Unknown"
];

interface LoadingIndicatorProps {
  loadingText?: string;
  className?: string;
}

export function LoadingIndicator({ loadingText = "Loading...", className }: LoadingIndicatorProps) {
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    const getRandomQuote = () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(getRandomQuote());

    const intervalId = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 py-10 text-center", className)}>
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-semibold text-foreground">{loadingText}</p>
      {currentQuote && (
        <p className="text-sm text-muted-foreground italic">
          &quot;{currentQuote}&quot;
        </p>
      )}
    </div>
  );
}

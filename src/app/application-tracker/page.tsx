
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';

export default function ApplicationTrackerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl rounded-xl animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
                <ClipboardCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Job Application Tracker</CardTitle>
            <CardDescription>
              Keep all your job applications organized in one place. 
              This feature is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="my-6 h-48 w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <Image src="https://placehold.co/300x200.png" alt="Application Tracker Placeholder" width={300} height={200} data-ai-hint="organizer checklist" className="object-contain"/>
            </div>
            <p className="text-muted-foreground">
              Soon, you'll be able to add applications, track their status,
              log interview dates, and manage follow-ups.
            </p>
            <div className="p-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
              <p className="text-lg font-semibold text-foreground">Coming Soon!</p>
            </div>
          </CardContent>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} SkillSync. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

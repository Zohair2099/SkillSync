
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bell } from 'lucide-react';

export default function NotificationsPage() {
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
                <Bell className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Smart Notifications & Reminders</CardTitle>
            <CardDescription>
              Stay updated with relevant job openings and reminders.
              This feature is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="my-6 h-48 w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <Image src="https://placehold.co/300x200.png" alt="Notifications Placeholder" width={300} height={200} data-ai-hint="bell alert" className="object-contain"/>
            </div>
            <p className="text-muted-foreground">
              Soon, you'll receive notifications for new job openings matching your skills
              and get reminders to complete skill-building goals or update your profiles.
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

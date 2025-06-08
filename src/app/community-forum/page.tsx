
'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';

export default function CommunityForumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/social-networking" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Social Networking
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
                <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">EmployMint Community Forum</CardTitle>
            <CardDescription>
              Connect with peers, share experiences, and grow your network.
              This feature is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Soon, you'll be able to join discussions, ask career-related questions,
              share job search tips, and learn from others in the EmployMint community.
            </p>
            <div className="p-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
              <p className="text-lg font-semibold text-foreground">Coming Soon!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              We are working hard to build a vibrant and supportive space for all EmployMint users. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

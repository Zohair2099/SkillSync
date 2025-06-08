
'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Share2, Linkedin, Users, Edit3 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SocialNetworkingPage() {
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

        <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
                <Share2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Social Integration & Networking</CardTitle>
            <CardDescription>
              Expand your professional reach and connect with the EmployMint community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <div className="flex items-center mb-3">
                <Linkedin className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-foreground">Connect Your Profiles</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Add links to your professional profiles (like LinkedIn, GitHub, or your personal portfolio) on your EmployMint profile.
                This helps in showcasing your complete professional identity when using features like the Resume Builder or sharing your achievements.
              </p>
              <Link href="/profile" passHref>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Edit3 className="mr-2 h-4 w-4" /> Go to Your Profile to Add Links
                </Button>
              </Link>
            </div>

            <Separator />

            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <div className="flex items-center mb-3">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-foreground">Community Forum</h3>
              </div>
              <p className="text-muted-foreground mb-2">
                A dedicated space for EmployMint users to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 pl-4">
                <li>Discuss job search strategies and interview tips.</li>
                <li>Share experiences and learn from peers.</li>
                <li>Network with other professionals in various fields.</li>
                <li>Get advice on skill development and career growth.</li>
              </ul>
              <div className="p-6 border-2 border-dashed border-border rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-semibold text-foreground">Coming Soon!</p>
                <p className="text-sm text-muted-foreground mt-1">We're working on building a vibrant community space for you.</p>
              </div>
            </div>
          </CardContent>
           <CardFooter className="text-center mt-4">
            <p className="text-xs text-muted-foreground mx-auto">
              EmployMint aims to foster connections. Actual integration with social platforms for automated posting or data import is a future consideration.
            </p>
          </CardFooter>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

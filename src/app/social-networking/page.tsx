
'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Share2, Linkedin, Users, Edit3, MessageSquare, Lightbulb } from 'lucide-react';
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
              Expand your professional reach and connect with the SkillSync community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <div className="flex items-center mb-3">
                <Linkedin className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-foreground">Connect Your Profiles</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Add links to your professional profiles (like LinkedIn, GitHub, or your personal portfolio) on your SkillSync profile.
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
                A dedicated space for SkillSync users to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 pl-4">
                <li>Discuss job search strategies and interview tips.</li>
                <li>Share experiences and learn from peers.</li>
                <li>Network with other professionals in various fields.</li>
                <li>Get advice on skill development and career growth.</li>
              </ul>
              <Link href="/community-forum" passHref>
                <Button variant="secondary" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Go to Community Forum (Interactive Demo)
                </Button>
              </Link>
            </div>
            <Separator />
            <div className="text-center space-y-4 pt-4">
                <div className="flex justify-center items-center text-lg font-semibold text-foreground mb-2">
                    <Lightbulb className="h-6 w-6 text-primary mr-2" />
                    <span>Advanced Networking Features</span>
                </div>
                <p className="text-muted-foreground">
                    Features like direct mentor matching within SkillSync, advanced professional networking tools, and deeper integrations with platforms like LinkedIn are planned for future updates.
                </p>
                <div className="p-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
                    <p className="text-lg font-semibold text-foreground">More Networking Features Coming Soon!</p>
                </div>
            </div>
          </CardContent>
           <CardFooter className="text-center mt-4">
            <p className="text-xs text-muted-foreground mx-auto">
              SkillSync aims to foster connections. Deeper integration with social platforms for automated actions is a future consideration.
            </p>
          </CardFooter>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} SkillSync. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

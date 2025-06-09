
'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/employmint/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

const creators = [
  {
    name: "Zohair Shahid Khan",
    rollNumber: "160923733200",
    imageUrl: "https://placehold.co/150x150.png",
    aiHint: "person portrait"
  },
  {
    name: "Syeda Hafsa Sadf",
    rollNumber: "160923733238",
    imageUrl: "https://placehold.co/150x150.png",
    aiHint: "person portrait"
  }
];

export default function CreditsPage() {
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
                <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Credits</CardTitle>
            <CardDescription>This application was developed by:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {creators.map((creator, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 border rounded-lg shadow-md bg-card">
                <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4 ring-2 ring-primary">
                  <Image
                    src={creator.imageUrl}
                    alt={`Placeholder for ${creator.name}`}
                    width={150}
                    height={150}
                    data-ai-hint={creator.aiHint}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{creator.name}</h3>
                <p className="text-muted-foreground">Roll No: {creator.rollNumber}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} SkillSync. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

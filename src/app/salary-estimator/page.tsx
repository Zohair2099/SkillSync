
'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign } from 'lucide-react';

export default function SalaryEstimatorPage() {
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
                <DollarSign className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">AI-Based Salary Estimator</CardTitle>
            <CardDescription>
              Predict expected salary ranges based on your profile.
              This feature is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Soon, you'll be able to predict expected salary ranges based on your
              experience, skills, and job role using AI-powered market data.
            </p>
            <div className="p-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
              <p className="text-lg font-semibold text-foreground">Coming Soon!</p>
            </div>
          </CardContent>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}


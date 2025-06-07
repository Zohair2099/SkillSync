
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { SkillGapDisplay } from '@/components/employmint/SkillGapDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Brain, Download } from 'lucide-react';
import { performJobFocusedSkillComparison } from '@/app/actions';
import type { JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/context/ProfileContext';

export default function PersonalizedSkillPathPage() {
  const { profile } = useProfile();
  const userSkills = profile.skills;
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [skillPathResult, setSkillPathResult] = useState<JobFocusedSkillComparisonOutput | null>(null);
  const [isLoading, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (userSkills.length === 0) {
      toast({
        title: "Missing Skills",
        description: "Please add your skills in your Profile first to generate a personalized path.",
        variant: "destructive",
      });
      return;
    }
    setSkillPathResult(null);
    startTransition(async () => {
      try {
        const result = await performJobFocusedSkillComparison({
          userSkills,
          jobDescription: jobDescription || undefined,
        });
        setSkillPathResult(result);
        if (!result.missingSkills?.length && !result.suggestedJobCategories?.length && !result.skillDevelopmentRoadmap?.length) {
            toast({
                title: "Analysis Complete",
                description: "General career advice provided. No specific skill gaps for the input or strong alignment found for a detailed roadmap.",
            });
        }
      } catch (error) {
        console.error("Error generating skill path:", error);
        toast({
          title: "Error Generating Path",
          description: (error as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDownloadPdf = () => {
    // Placeholder for PDF generation. 
    // In a real app, this could use window.print() with print-specific CSS,
    // or a library like jsPDF + html2canvas.
    toast({
      title: "PDF Download (Placeholder)",
      description: "This feature will be implemented soon. For now, you can use your browser's print to PDF function.",
    });
    // Example: window.print(); 
    // (Requires careful CSS @media print styling for good results)
  };

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
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Brain className="mr-3 h-8 w-8" /> Personalized Skill Development Path
            </CardTitle>
            <CardDescription>
              Enter a target job description or role below. The AI will analyze it against your profile skills (from the Profile page) and suggest a development path including a step-by-step roadmap.
              If you leave the field blank, it will provide general career advice and a generic roadmap based on your current skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="skillPathJobDesc" className="block text-sm font-medium text-foreground mb-1">
                Target Job Description / Role (Optional)
              </Label>
              <Textarea
                id="skillPathJobDesc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g., 'Senior Frontend Developer at TechCorp' or paste full job description..."
                rows={6}
                className="bg-card"
              />
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || userSkills.length === 0} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Development Path
            </Button>
            {userSkills.length === 0 && (
                <p className="text-sm text-destructive text-center">Please add skills to your profile to use this feature.</p>
            )}
          </CardContent>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 px-6">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground mt-2">Generating your personalized path... This may take a moment.</p>
            </div>
          )}

          {skillPathResult && !isLoading && (
            <CardFooter className="flex flex-col items-start p-6 border-t">
              <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">Your Personalized Path & Advice:</h3>
                <Button variant="outline" onClick={handleDownloadPdf}>
                  <Download className="mr-2 h-4 w-4" /> Download as PDF (Placeholder)
                </Button>
              </div>
              <SkillGapDisplay
                missingSkills={skillPathResult.missingSkills || []}
                suggestedHardSkillsResources={skillPathResult.suggestedHardSkillsResources || []}
                skillComparisonSummary={skillPathResult.skillComparisonSummary || "Analysis summary pending."}
                interviewTips={skillPathResult.interviewTips}
                suggestedJobCategories={skillPathResult.suggestedJobCategories}
                suggestedSoftSkills={skillPathResult.suggestedSoftSkills}
                mentorshipAdvice={skillPathResult.mentorshipAdvice}
                skillDevelopmentRoadmap={skillPathResult.skillDevelopmentRoadmap}
              />
            </CardFooter>
          )}
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}


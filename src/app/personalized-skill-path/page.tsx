
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { SkillGapDisplay } from '@/components/employmint/SkillGapDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Brain, Download } from 'lucide-react';
import { performJobFocusedSkillComparison } from '@/app/actions';
// Import types from actions.ts
import type { JobFocusedSkillComparisonOutput, JobFocusedSkillComparisonInput } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/context/ProfileContext';
import { LoadingIndicator } from '@/components/employmint/LoadingIndicator'; 

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
        const input: JobFocusedSkillComparisonInput = {
            userSkills,
            jobDescription: jobDescription || undefined,
        };
        const result = await performJobFocusedSkillComparison(input);
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
    toast({
      title: "PDF Download (Placeholder)",
      description: "This feature will be implemented soon. For now, you can use your browser's print to PDF function.",
    });
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
            {isLoading ? (
               <LoadingIndicator loadingText="Generating your personalized path..." />
            ) : (
              <>
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
                <Button onClick={handleSubmit} disabled={userSkills.length === 0} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Generate Development Path
                </Button>
                {userSkills.length === 0 && (
                    <p className="text-sm text-destructive text-center">Please add skills to your profile to use this feature.</p>
                )}
              </>
            )}
          </CardContent>

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
        © {new Date().getFullYear()} SkillSync. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

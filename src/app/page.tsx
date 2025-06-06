'use client';

import React, { useState, useTransition } from 'react';
import { Header } from '@/components/employmint/Header';
import { SkillInput } from '@/components/employmint/SkillInput';
import { JobRecommendationCard } from '@/components/employmint/JobRecommendationCard';
import { SkillGapDisplay } from '@/components/employmint/SkillGapDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { performSkillBasedJobMatching, performJobFocusedSkillComparison } from './actions';
import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import type { JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { useToast } from "@/hooks/use-toast";


interface JobMatchResult extends SkillBasedJobMatchingOutput {
  jobTitleDisplay: string;
}

export default function EmployMintPage() {
  const [userSkills, setUserSkills] = useState<string[]>([]);
  
  // State for Skill-Based Job Matching
  const [jobMatchTitle, setJobMatchTitle] = useState('');
  const [jobMatchDescription, setJobMatchDescription] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);
  
  // State for Job-Focused Skill Comparison
  const [skillCompareDescription, setSkillCompareDescription] = useState('');
  const [skillGapResult, setSkillGapResult] = useState<JobFocusedSkillComparisonOutput | null>(null);

  const [isJobMatchingLoading, startJobMatchingTransition] = useTransition();
  const [isSkillComparingLoading, startSkillComparingTransition] = useTransition();
  
  const { toast } = useToast();

  const handleSkillsChange = (newSkills: string[]) => {
    setUserSkills(newSkills);
  };

  const handleJobMatchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userSkills.length === 0 || !jobMatchTitle || !jobMatchDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide your skills, job title, and job description.",
        variant: "destructive",
      });
      return;
    }
    setJobMatchResult(null);
    startJobMatchingTransition(async () => {
      try {
        const result = await performSkillBasedJobMatching({
          userSkills,
          jobTitle: jobMatchTitle,
          jobDescription: jobMatchDescription,
        });
        setJobMatchResult({...result, jobTitleDisplay: jobMatchTitle});
      } catch (error) {
        console.error(error);
        toast({
          title: "Error Matching Job",
          description: (error as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const handleSkillCompareSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userSkills.length === 0 || !skillCompareDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide your skills and the job description.",
        variant: "destructive",
      });
      return;
    }
    setSkillGapResult(null);
    startSkillComparingTransition(async () => {
      try {
        const result = await performJobFocusedSkillComparison({
          userSkills,
          jobDescription: skillCompareDescription,
        });
        setSkillGapResult(result);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error Analyzing Skills",
          description: (error as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Profile</CardTitle>
            <CardDescription>Start by telling us about your skills.</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillInput skills={userSkills} onSkillsChange={handleSkillsChange} />
          </CardContent>
        </Card>

        <Tabs defaultValue="job-matcher" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="job-matcher">Find Matching Jobs</TabsTrigger>
            <TabsTrigger value="job-analyzer">Analyze Job Fit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-matcher">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Skill-Based Job Matching</CardTitle>
                <CardDescription>
                  Enter a job title and description to see how well your skills match.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobMatchSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="jobMatchTitle" className="block text-sm font-medium text-foreground mb-1">
                      Job Title
                    </label>
                    <Input
                      id="jobMatchTitle"
                      value={jobMatchTitle}
                      onChange={(e) => setJobMatchTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="jobMatchDescription" className="block text-sm font-medium text-foreground mb-1">
                      Job Description
                    </label>
                    <Textarea
                      id="jobMatchDescription"
                      value={jobMatchDescription}
                      onChange={(e) => setJobMatchDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      rows={8}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isJobMatchingLoading} className="w-full md:w-auto">
                    {isJobMatchingLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Match Skills to Job
                  </Button>
                </form>
                {jobMatchResult && !isJobMatchingLoading && (
                  <div className="mt-8">
                    <JobRecommendationCard
                      jobTitle={jobMatchResult.jobTitleDisplay}
                      matchPercentage={jobMatchResult.matchPercentage}
                      rationale={jobMatchResult.rationale}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job-analyzer">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Job-Focused Skill Comparison</CardTitle>
                <CardDescription>
                  Assess your readiness for a job and get learning suggestions for any skill gaps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSkillCompareSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="skillCompareDescription" className="block text-sm font-medium text-foreground mb-1">
                      Job Description
                    </label>
                    <Textarea
                      id="skillCompareDescription"
                      value={skillCompareDescription}
                      onChange={(e) => setSkillCompareDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      rows={8}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSkillComparingLoading} className="w-full md:w-auto">
                    {isSkillComparingLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Analyze Skill Gaps
                  </Button>
                </form>
                {skillGapResult && !isSkillComparingLoading && (
                  <div className="mt-8">
                    <SkillGapDisplay
                      missingSkills={skillGapResult.missingSkills}
                      suggestedResources={skillGapResult.suggestedResources}
                      skillComparisonSummary={skillGapResult.skillComparisonSummary}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} EmployMint. All rights reserved.
      </footer>
    </div>
  );
}

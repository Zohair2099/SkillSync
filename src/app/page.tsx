'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { Header } from '@/components/employmint/Header';
import { SkillInput, type Skill } from '@/components/employmint/SkillInput';
import { JobRecommendationCard } from '@/components/employmint/JobRecommendationCard';
import { SkillGapDisplay } from '@/components/employmint/SkillGapDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, ListFilter } from 'lucide-react';
import { performSkillBasedJobMatching, performJobFocusedSkillComparison } from './actions';
import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching'; // This is now an array
import type { JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { useToast } from "@/hooks/use-toast";

type JobMatchResultItem = SkillBasedJobMatchingOutput[0]; // Assuming SkillBasedJobMatchingOutput is an array

export default function EmployMintPage() {
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  
  // State for Skill-Based Job Matching
  const [jobMatchTitle, setJobMatchTitle] = useState('');
  const [jobMatchDescription, setJobMatchDescription] = useState('');
  const [jobMatchResults, setJobMatchResults] = useState<JobMatchResultItem[]>([]);
  const [jobMatchSortOrder, setJobMatchSortOrder] = useState<'highest' | 'lowest'>('highest');
  
  // State for Job-Focused Skill Comparison
  const [skillCompareDescription, setSkillCompareDescription] = useState('');
  const [skillGapResult, setSkillGapResult] = useState<JobFocusedSkillComparisonOutput | null>(null);

  const [isJobMatchingLoading, startJobMatchingTransition] = useTransition();
  const [isSkillComparingLoading, startSkillComparingTransition] = useTransition();
  
  const { toast } = useToast();

  const handleSkillsChange = (newSkills: Skill[]) => {
    setUserSkills(newSkills);
  };

  const handleJobMatchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userSkills.length === 0 || !jobMatchTitle || !jobMatchDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide your skills, a desired job title, and an ideal job description.",
        variant: "destructive",
      });
      return;
    }
    setJobMatchResults([]);
    startJobMatchingTransition(async () => {
      try {
        const results = await performSkillBasedJobMatching({
          userSkills,
          jobTitle: jobMatchTitle,
          jobDescription: jobMatchDescription,
        });
        setJobMatchResults(results);
         if (results.length === 0) {
          toast({
            title: "No Jobs Found",
            description: "We couldn't find any job matches based on your criteria. Try broadening your search.",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error Matching Jobs",
          description: (error as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const handleSkillCompareSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userSkills.length === 0) { // Job description is now optional
      toast({
        title: "Missing Skills",
        description: "Please provide your skills.",
        variant: "destructive",
      });
      return;
    }
    setSkillGapResult(null);
    startSkillComparingTransition(async () => {
      try {
        const result = await performJobFocusedSkillComparison({
          userSkills,
          jobDescription: skillCompareDescription, // Can be empty
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

  const sortedJobMatchResults = useMemo(() => {
    return [...jobMatchResults].sort((a, b) => {
      if (jobMatchSortOrder === 'highest') {
        return b.matchPercentage - a.matchPercentage;
      } else {
        return a.matchPercentage - b.matchPercentage;
      }
    });
  }, [jobMatchResults, jobMatchSortOrder]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-foreground">Your Profile</CardTitle>
            <CardDescription>Tell us about your skills and experience to get personalized job insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillInput skills={userSkills} onSkillsChange={handleSkillsChange} />
          </CardContent>
        </Card>

        <Tabs defaultValue="job-matcher" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
            <TabsTrigger value="job-matcher" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Find Matching Jobs</TabsTrigger>
            <TabsTrigger value="job-analyzer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analyze Job Fit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-matcher">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">Skill-Based Job Matching</CardTitle>
                <CardDescription>
                  Enter your ideal job title and description to discover potential job matches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobMatchSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="jobMatchTitle" className="block text-sm font-medium text-foreground mb-1">
                      Ideal Job Title
                    </label>
                    <Input
                      id="jobMatchTitle"
                      value={jobMatchTitle}
                      onChange={(e) => setJobMatchTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer, Marketing Manager"
                      required
                      className="bg-card"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobMatchDescription" className="block text-sm font-medium text-foreground mb-1">
                      Ideal Job Description / Responsibilities
                    </label>
                    <Textarea
                      id="jobMatchDescription"
                      value={jobMatchDescription}
                      onChange={(e) => setJobMatchDescription(e.target.value)}
                      placeholder="Describe your ideal role, key responsibilities, or paste a sample job description..."
                      rows={6}
                      required
                      className="bg-card"
                    />
                  </div>
                  <Button type="submit" disabled={isJobMatchingLoading || userSkills.length === 0} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isJobMatchingLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Find Matching Jobs
                  </Button>
                </form>
                {jobMatchResults.length > 0 && !isJobMatchingLoading && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-headline text-foreground">Job Recommendations</h3>
                      <div className="flex items-center gap-2">
                        <ListFilter className="h-5 w-5 text-muted-foreground" />
                        <Select value={jobMatchSortOrder} onValueChange={(value: 'highest' | 'lowest') => setJobMatchSortOrder(value)}>
                          <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="highest">Highest Match</SelectItem>
                            <SelectItem value="lowest">Lowest Match</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {sortedJobMatchResults.map((job, index) => (
                        <JobRecommendationCard
                          key={index} // Ideally use a unique ID from the job data if available
                          jobTitle={job.jobTitle}
                          companyName={job.companyName}
                          location={job.location}
                          jobDescription={job.jobDescription}
                          matchPercentage={job.matchPercentage}
                          rationale={job.rationale}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job-analyzer">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">Job-Focused Skill Comparison</CardTitle>
                <CardDescription>
                  Assess your readiness for a specific job (optional) or get general feedback on your skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSkillCompareSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="skillCompareDescription" className="block text-sm font-medium text-foreground mb-1">
                      Job Description (Optional)
                    </label>
                    <Textarea
                      id="skillCompareDescription"
                      value={skillCompareDescription}
                      onChange={(e) => setSkillCompareDescription(e.target.value)}
                      placeholder="Paste a job description here to analyze against your skills, or leave blank for general advice..."
                      rows={8}
                      className="bg-card"
                    />
                  </div>
                  <Button type="submit" disabled={isSkillComparingLoading || userSkills.length === 0} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isSkillComparingLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Analyze Skills
                  </Button>
                </form>
                {skillGapResult && !isSkillComparingLoading && (
                  <div className="mt-8">
                    <SkillGapDisplay
                      missingSkills={skillGapResult.missingSkills}
                      suggestedResources={skillGapResult.suggestedResources}
                      skillComparisonSummary={skillGapResult.skillComparisonSummary}
                      interviewTips={skillGapResult.interviewTips}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

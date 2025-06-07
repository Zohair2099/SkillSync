
'use client';

import React, { useState, useTransition, useMemo, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, ListFilter, ChevronsUpDown } from 'lucide-react';
import { performSkillBasedJobMatching, performJobFocusedSkillComparison } from './actions';
import type { SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import type { JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { useToast } from "@/hooks/use-toast";

type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

// Minimal lists for demo purposes
const COUNTRIES = ["USA", "Canada", "UK", "Germany", "India"];
const US_STATES = ["California", "New York", "Texas", "Florida", "Illinois"];
const JOB_TITLES_PREDEFINED = ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Marketing Manager", "Sales Representative", "Project Manager"];

export default function EmployMintPage() {
  // Profile State
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  
  // State for Skill-Based Job Matching
  const [jobMatchTitle, setJobMatchTitle] = useState('');
  const [openJobTitleCombobox, setOpenJobTitleCombobox] = useState(false);
  const [jobMatchIdealDescription, setJobMatchIdealDescription] = useState('');
  const [jobMatchCountry, setJobMatchCountry] = useState('');
  const [jobMatchState, setJobMatchState] = useState(''); // Relevant if country is USA, for example
  const [jobMatchMinSalary, setJobMatchMinSalary] = useState('');
  const [jobMatchMaxSalary, setJobMatchMaxSalary] = useState('');
  const [jobMatchWorkModel, setJobMatchWorkModel] = useState<'any' | 'on-site' | 'remote' | 'hybrid'>('any');
  const [jobMatchResults, setJobMatchResults] = useState<JobMatchResultItem[]>([]);
  const [jobMatchSortOrder, setJobMatchSortOrder] = useState<'highest' | 'lowest'>('highest');
  
  // State for Job-Focused Skill Comparison
  const [skillCompareJobDescription, setSkillCompareJobDescription] = useState('');
  const [skillGapResult, setSkillGapResult] = useState<JobFocusedSkillComparisonOutput | null>(null);

  const [isJobMatchingLoading, startJobMatchingTransition] = useTransition();
  const [isSkillComparingLoading, startSkillComparingTransition] = useTransition();
  
  const { toast } = useToast();

  const handleSkillsChange = (newSkills: Skill[]) => {
    setUserSkills(newSkills);
  };

  const handleJobMatchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userSkills.length === 0 || !jobMatchTitle || !jobMatchIdealDescription) {
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
        const input: SkillBasedJobMatchingInput = {
          userSkills,
          jobTitle: jobMatchTitle,
          jobDescription: jobMatchIdealDescription, 
          country: jobMatchCountry || undefined,
          state: jobMatchState || undefined,
          minSalary: jobMatchMinSalary ? parseInt(jobMatchMinSalary) : undefined,
          maxSalary: jobMatchMaxSalary ? parseInt(jobMatchMaxSalary) : undefined,
          workModel: jobMatchWorkModel === 'any' ? undefined : jobMatchWorkModel,
        };
        const results = await performSkillBasedJobMatching(input);
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
    if (userSkills.length === 0) {
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
          jobDescription: skillCompareJobDescription || undefined, // Pass undefined if empty
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

  useEffect(() => {
    // Clear state selection if country is not USA
    if (jobMatchCountry !== "USA") {
      setJobMatchState("");
    }
  }, [jobMatchCountry]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-foreground">Your Profile</CardTitle>
            <CardDescription>Tell us about yourself to get personalized job insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName" className="text-sm font-medium">Name</Label>
                <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Name" className="mt-1 bg-card" />
              </div>
              <div>
                <Label htmlFor="userAge" className="text-sm font-medium">Age</Label>
                <Input id="userAge" type="number" value={userAge} onChange={(e) => setUserAge(e.target.value)} placeholder="Your Age" className="mt-1 bg-card" />
              </div>
            </div>
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
                  Enter your ideal job criteria to discover potential job matches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobMatchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobMatchTitle" className="block text-sm font-medium text-foreground mb-1">
                        Ideal Job Title
                      </Label>
                      <Popover open={openJobTitleCombobox} onOpenChange={setOpenJobTitleCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openJobTitleCombobox}
                            className="w-full justify-between text-muted-foreground bg-card"
                            id="jobMatchTitle"
                          >
                            {jobMatchTitle || "Select or type job title..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput 
                              value={jobMatchTitle} 
                              onValueChange={setJobMatchTitle}
                              placeholder="Search or type new title..." 
                            />
                            <CommandList>
                              <CommandEmpty>No title found. Type to add new.</CommandEmpty>
                              <CommandGroup>
                                {JOB_TITLES_PREDEFINED.filter(title => title.toLowerCase().includes(jobMatchTitle.toLowerCase())).map((title) => (
                                  <CommandItem
                                    key={title}
                                    value={title}
                                    onSelect={(currentValue) => {
                                      setJobMatchTitle(currentValue === jobMatchTitle.toLowerCase() ? '' : currentValue);
                                      setOpenJobTitleCombobox(false);
                                    }}
                                  >
                                    {title}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="jobMatchCountry" className="block text-sm font-medium text-foreground mb-1">
                        Country (Optional)
                      </Label>
                      <Select value={jobMatchCountry} onValueChange={setJobMatchCountry}>
                        <SelectTrigger id="jobMatchCountry" className="w-full bg-card">
                          <SelectValue placeholder="Any Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any-country-placeholder">Any Country</SelectItem> 
                          {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {jobMatchCountry === "USA" && (
                       <div>
                        <Label htmlFor="jobMatchState" className="block text-sm font-medium text-foreground mb-1">
                          State (USA) (Optional)
                        </Label>
                        <Select value={jobMatchState} onValueChange={setJobMatchState}>
                          <SelectTrigger id="jobMatchState" className="w-full bg-card">
                            <SelectValue placeholder="Any State" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="any-state-placeholder">Any State</SelectItem>
                            {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="jobMatchIdealDescription" className="block text-sm font-medium text-foreground mb-1">
                      Ideal Job Description / Responsibilities
                    </Label>
                    <Textarea
                      id="jobMatchIdealDescription"
                      value={jobMatchIdealDescription}
                      onChange={(e) => setJobMatchIdealDescription(e.target.value)}
                      placeholder="Describe your ideal role, key responsibilities, or paste a sample job description..."
                      rows={4}
                      required
                      className="bg-card"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <Label className="block text-sm font-medium text-foreground mb-1">Salary Range (Optional)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={jobMatchMinSalary}
                            onChange={(e) => setJobMatchMinSalary(e.target.value)}
                            placeholder="Min Salary"
                            className="bg-card"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            value={jobMatchMaxSalary}
                            onChange={(e) => setJobMatchMaxSalary(e.target.value)}
                            placeholder="Max Salary"
                            className="bg-card"
                          />
                        </div>
                     </div>
                     <div>
                        <Label className="block text-sm font-medium text-foreground mb-1">Work Model (Optional)</Label>
                        <Select value={jobMatchWorkModel} onValueChange={(value: 'any' | 'on-site' | 'remote' | 'hybrid')=> setJobMatchWorkModel(value)}>
                            <SelectTrigger className="w-full bg-card">
                                <SelectValue placeholder="Any Work Model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="on-site">On-site</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
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
                          key={index}
                          jobTitle={job.jobTitle}
                          companyName={job.companyName}
                          location={job.location}
                          jobDescription={job.jobDescription} 
                          matchPercentage={job.matchPercentage}
                          rationale={job.rationale}
                          responsibilities={job.responsibilities || []}
                          requiredSkills={job.requiredSkills || []}
                          preferredSkills={job.preferredSkills || []}
                          experienceLevel={job.experienceLevel || ''}
                          educationLevel={job.educationLevel || ''}
                          employmentType={job.employmentType || ''}
                          salaryRange={job.salaryRange || ''}
                          workModel={job.workModel}
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
                    <Label htmlFor="skillCompareJobDescription" className="block text-sm font-medium text-foreground mb-1">
                      Job Description (Optional)
                    </Label>
                    <Textarea
                      id="skillCompareJobDescription"
                      value={skillCompareJobDescription}
                      onChange={(e) => setSkillCompareJobDescription(e.target.value)}
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
                      suggestedJobCategories={skillGapResult.suggestedJobCategories}
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
    

'use client';

import React, { useState, useTransition, useMemo, useEffect, useContext } from 'react';
import Link from 'next/link';
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
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, ListFilter, ChevronsUpDown, User, Briefcase, Brain, HelpCircle } from 'lucide-react';
import { performSkillBasedJobMatching, performJobFocusedSkillComparison } from './actions';
import type { SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import type { JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { useToast } from "@/hooks/use-toast";
import { JobResultsContext } from '@/context/JobResultsContext';


type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

// Minimal lists for demo purposes
const COUNTRIES = ["USA", "Canada", "UK", "Germany", "India", "Australia", "France", "Japan", "Brazil", "Netherlands"];
const US_STATES = ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Massachusetts", "Georgia", "North Carolina", "Virginia"];

const JOB_TITLES_PREDEFINED = [
  // Tech - Software & Engineering
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "Mobile App Developer (iOS/Android)", "DevOps Engineer", "Site Reliability Engineer (SRE)",
  "Cloud Engineer (AWS/Azure/GCP)", "Cybersecurity Analyst", "Security Engineer", 
  "Data Scientist", "Machine Learning Engineer", "AI Engineer", "Data Analyst", "Business Intelligence Analyst",
  "Database Administrator (DBA)", "Network Engineer", "Systems Administrator", 
  "QA Engineer/Software Tester", "Embedded Systems Engineer", "Game Developer", "Blockchain Developer",
  // Tech - Product & Design
  "Product Manager", "Technical Product Manager", "UX Designer", "UI Designer", "Product Designer",
  "UX Researcher", "Interaction Designer", "Graphic Designer", "Motion Designer",
  // Business & Management
  "Project Manager", "Program Manager", "Operations Manager", "Business Analyst", 
  "Management Consultant", "Financial Analyst", "Accountant", "Investment Banker", 
  "Human Resources Manager", "Recruiter/Talent Acquisition Specialist", "Marketing Manager", 
  "Digital Marketing Specialist", "SEO Specialist", "Content Marketing Manager", "Social Media Manager",
  "Sales Representative", "Account Executive", "Sales Manager", "Customer Success Manager",
  "Supply Chain Manager", "Logistics Coordinator", "Business Development Manager", "Chief Executive Officer (CEO)",
  "Chief Operating Officer (COO)", "Chief Financial Officer (CFO)", "Chief Technology Officer (CTO)",
  // Creative & Media
  "Writer/Editor", "Journalist", "Copywriter", "Technical Writer", "Video Editor", 
  "Photographer", "Illustrator", "Animator", "Art Director", "Public Relations Specialist",
  // Healthcare
  "Registered Nurse (RN)", "Doctor/Physician", "Pharmacist", "Medical Assistant", "Physical Therapist",
  "Occupational Therapist", "Lab Technician", "Healthcare Administrator", "Medical Researcher",
  // Education
  "Teacher (K-12)", "Professor/Lecturer", "Instructional Designer", "Curriculum Developer", "Academic Advisor",
  // Trades & Skilled Labor
  "Electrician", "Plumber", "HVAC Technician", "Carpenter", "Welder", "Mechanic",
  // Legal
  "Lawyer/Attorney", "Paralegal", "Legal Secretary",
  // Science & Research
  "Research Scientist", "Biologist", "Chemist", "Physicist", "Environmental Scientist",
  // Hospitality & Service
  "Restaurant Manager", "Chef", "Hotel Manager", "Event Planner", "Customer Service Representative",
  // Other
  "Architect", "Real Estate Agent", "Pilot", "Librarian", "Social Worker", "Psychologist", "Urban Planner"
];


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
  const [jobMatchState, setJobMatchState] = useState(''); 
  const [jobMatchMinSalary, setJobMatchMinSalary] = useState('');
  const [jobMatchMaxSalary, setJobMatchMaxSalary] = useState('');
  const [jobMatchWorkModel, setJobMatchWorkModel] = useState<'any' | 'on-site' | 'remote' | 'hybrid'>('any');
  // const [jobMatchResults, setJobMatchResults] = useState<JobMatchResultItem[]>([]); // Moved to context
  const [jobMatchSortOrder, setJobMatchSortOrder] = useState<'highest' | 'lowest'>('highest');
  
  // State for Job-Focused Skill Comparison
  const [skillCompareJobDescription, setSkillCompareJobDescription] = useState('');
  const [skillGapResult, setSkillGapResult] = useState<JobFocusedSkillComparisonOutput | null>(null);

  const [isJobMatchingLoading, startJobMatchingTransition] = useTransition();
  const [isSkillComparingLoading, startSkillComparingTransition] = useTransition();
  
  const { toast } = useToast();
  const { jobMatchResults, setJobMatchResults } = useContext(JobResultsContext);


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
    setJobMatchResults([]); // Clear previous results from context
    startJobMatchingTransition(async () => {
      try {
        const input: SkillBasedJobMatchingInput = {
          userSkills,
          jobTitle: jobMatchTitle,
          jobDescription: jobMatchIdealDescription, 
          country: jobMatchCountry === 'any-country-placeholder' ? undefined : jobMatchCountry || undefined,
          state: jobMatchState === 'any-state-placeholder' ? undefined : jobMatchState || undefined,
          minSalary: jobMatchMinSalary ? parseInt(jobMatchMinSalary) : undefined,
          maxSalary: jobMatchMaxSalary ? parseInt(jobMatchMaxSalary) : undefined,
          workModel: jobMatchWorkModel === 'any' ? undefined : jobMatchWorkModel,
        };
        const results = await performSkillBasedJobMatching(input);
        setJobMatchResults(results); // Set results in context
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
          jobDescription: skillCompareJobDescription || undefined, 
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
    if (jobMatchCountry !== "USA") {
      setJobMatchState("");
    }
  }, [jobMatchCountry]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted p-1 rounded-lg mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><User className="mr-2 h-4 w-4 inline-block"/>Profile</TabsTrigger>
            <TabsTrigger value="job-matcher" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Briefcase className="mr-2 h-4 w-4 inline-block"/>Find Matching Jobs</TabsTrigger>
            <TabsTrigger value="job-analyzer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Brain className="mr-2 h-4 w-4 inline-block"/>Analyze Job Fit</TabsTrigger>
            <TabsTrigger value="more-help" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><HelpCircle className="mr-2 h-4 w-4 inline-block"/>More Help</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">Your Profile</CardTitle>
                <CardDescription>Tell us about yourself to get personalized job insights.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                 <CardDescription className="text-xs pt-2">
                  Tip: Categorizing skills into 'Hard Skills' and 'Soft Skills' can further refine your job matches and analysis. This feature will be available in a future update.
                </CardDescription>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="job-matcher">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">Skill-Based Job Matching</CardTitle>
                <CardDescription>
                  Enter your ideal job criteria to discover potential job matches. The AI will generate example job postings based on your input.
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
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-80 overflow-y-auto">
                          <Command>
                            <CommandInput 
                              value={jobMatchTitle} 
                              onValueChange={(search) => {
                                const exists = JOB_TITLES_PREDEFINED.some(title => title.toLowerCase() === search.toLowerCase());
                                if (exists) {
                                  setJobMatchTitle(JOB_TITLES_PREDEFINED.find(title => title.toLowerCase() === search.toLowerCase())!);
                                } else {
                                   setJobMatchTitle(search);
                                }
                              }}
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
                                      setJobMatchTitle(currentValue === jobMatchTitle ? '' : currentValue);
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
                        <Label className="block text-sm font-medium text-foreground mb-1">Salary Range (USD Annual, Optional)</Label>
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
                {sortedJobMatchResults.length > 0 && !isJobMatchingLoading && (
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
                          key={`${job.jobTitle}-${index}`} // Ensure unique key
                          job={job}
                          jobIndex={index} // Pass index for navigation
                        />
                      ))}
                    </div>
                     <CardDescription className="text-xs pt-4">
                      Note: The skill comparison table on the detailed job page will be implemented in a future update.
                    </CardDescription>
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
                  This feature helps you understand how your current skillset aligns with specific job requirements or general career paths. 
                  Paste a job description from a posting you're interested in to get a detailed analysis of matching and missing skills, along with suggested learning resources. 
                  If you don't have a specific job in mind, leave the job description blank. The AI will then provide a general assessment of your skills, 
                  suggest suitable job categories you might excel in, and offer interview tips to help you prepare for your next opportunity.
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
                      suggestedHardSkillsResources={skillGapResult.suggestedHardSkillsResources}
                      skillComparisonSummary={skillGapResult.skillComparisonSummary}
                      interviewTips={skillGapResult.interviewTips}
                      suggestedJobCategories={skillGapResult.suggestedJobCategories}
                      suggestedSoftSkills={skillGapResult.suggestedSoftSkills}
                      mentorshipAdvice={skillGapResult.mentorshipAdvice}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="more-help">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">More Help & Resources</CardTitle>
                <CardDescription>
                  This section will be updated with more tools and resources to aid your career journey. Stay tuned!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Content coming soon...</p>
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


'use client';

import React, { useState, useTransition, useMemo, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'; // Added useSearchParams and useRouter
import { Header } from '@/components/employmint/Header';
import { JobRecommendationCard } from '@/components/employmint/JobRecommendationCard';
import { SkillGapDisplay } from '@/components/employmint/SkillGapDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ListFilter, ChevronsUpDown, Briefcase, Brain, Plus, Route, FileText, MessageSquare, BarChart3, Mic, Share2, Building, Bell, ClipboardCheck, DollarSign as SalaryIcon, Users, LayoutGrid, List } from 'lucide-react';
import { performSkillBasedJobMatching, performJobFocusedSkillComparison } from './actions';
import type { SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput } from '@/app/actions';
import type { JobFocusedSkillComparisonOutput } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { JobResultsContext } from '@/context/JobResultsContext';
import { useProfile } from '@/context/ProfileContext';
import { LoadingIndicator } from '@/components/employmint/LoadingIndicator';
import { useAppearance } from '@/context/AppearanceContext'; 
import { cn } from '@/lib/utils'; 

type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

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
  "UX Researcher", "Interaction Designer", "Graphic Designer", "Motion Designer", "UI/UX Developer",
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
  "Content Strategist", "Videographer", "Sound Designer", "Game Designer",
  // Healthcare
  "Registered Nurse (RN)", "Doctor/Physician", "Pharmacist", "Medical Assistant", "Physical Therapist",
  "Occupational Therapist", "Lab Technician", "Healthcare Administrator", "Medical Researcher",
  "Dental Hygienist", "Radiologic Technologist", "Clinical Research Coordinator", "Speech-Language Pathologist",
  // Education
  "Teacher (K-12)", "Professor/Lecturer", "Instructional Designer", "Curriculum Developer", "Academic Advisor",
  "School Counselor", "Corporate Trainer", "Education Administrator", "Librarian",
  // Trades & Skilled Labor
  "Electrician", "Plumber", "HVAC Technician", "Carpenter", "Welder", "Mechanic",
  "Machinist", "Construction Manager", "Heavy Equipment Operator", "Automotive Technician",
  // Legal
  "Lawyer/Attorney", "Paralegal", "Legal Secretary", "Compliance Officer", "Mediator",
  // Science & Research
  "Research Scientist", "Biologist", "Chemist", "Physicist", "Environmental Scientist",
  "Geologist", "Statistician", "Mathematician", "Astronomer",
  // Hospitality & Service
  "Restaurant Manager", "Chef", "Hotel Manager", "Event Planner", "Customer Service Representative",
  "Flight Attendant", "Travel Agent", "Barista", "Concierge",
  // Finance & Economics
  "Economist", "Actuary", "Auditor", "Insurance Underwriter", "Loan Officer",
  // Arts & Culture
  "Museum Curator", "Archivist", "Conservator", "Musician", "Actor",
  // Sports & Fitness
  "Personal Trainer", "Coach", "Athletic Director", "Fitness Instructor",
  // Government & Public Service
  "Police Officer", "Firefighter", "Social Worker", "Urban Planner", "Policy Analyst",
  // Agriculture & Environment
  "Farmer/Agricultural Manager", "Forester", "Conservation Scientist", "Horticulturist",
  // Other
  "Architect", "Real Estate Agent", "Pilot", "Psychologist", "Surveyor", "Interior Designer"
];

const employMintPlusFeatures = [
  {
    id: "skill-dev-path",
    icon: Route,
    title: "Personalized Skill Development Path",
    description: "If you lack skills for a desired job, get a personalized learning roadmap with course recommendations to bridge the gap.",
    href: "/personalized-skill-path",
    actionText: "Get Your Path",
  },
  {
    id: "resume-builder",
    icon: FileText,
    title: "Resume Builder",
    description: "Craft a professional resume by entering your details and choosing from various layouts. Download as PDF.",
    href: "/resume-builder",
    actionText: "Build Your Resume",
  },
  {
    id: "soft-skill-assessment",
    icon: MessageSquare,
    title: "Soft Skill Assessment",
    description: "Analyze your soft skills like communication and leadership through AI-powered questionnaires or game-based assessments, and get suggestions for improvement.",
    href: "/soft-skill-assessment", 
    actionText: "Assess Skills",
  },
  {
    id: "market-trends",
    icon: BarChart3,
    title: "Real-Time Job Market Trends",
    description: "Get insights into job demand based on industry trends, see which skills are currently in high demand, and discover alternative roles in emerging fields.",
    href: "/market-trends",
    actionText: "View Trends",
  },
  {
    id: "interview-practice",
    icon: Mic,
    title: "AI Interview Practice",
    description: "Practice with an AI tool that generates real interview questions based on job roles and assesses your responses with feedback.",
    href: "/interview-practice",
    actionText: "Start Practice",
  },
  {
    id: "social-networking",
    icon: Share2,
    title: "Social Integration & Networking",
    description: "Connect with mentors, recruiters, and professionals. Access links to update your professional profiles.",
    href: "/social-networking",
    actionText: "Connect & Network",
  },
   {
    id: "community-forum",
    icon: Users,
    title: "Community Forum",
    description: "Join discussions, share tips, and network with other EmployMint users.",
    href: "/community-forum",
    actionText: "Join the Discussion",
  },
  {
    id: "salary-estimator",
    icon: SalaryIcon,
    title: "AI-Based Salary Estimator",
    description: "Predict expected salary ranges based on experience, skills, and job role using AI-powered market data.",
    href: "/salary-estimator",
    actionText: "Estimate Salary",
  },
  {
    id: "company-culture",
    icon: Building,
    title: "Company Culture & Work Environment Matching",
    description: "Find companies that match your values and work style by analyzing employer reviews and job satisfaction ratings.",
    href: "/company-culture",
    actionText: "Find Matches (Coming Soon)",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Smart Notifications & Reminders",
    description: "Receive notifications for new job openings matching your skills, and get reminders to complete skill-building goals or update your profile.",
    href: "/notifications",
    actionText: "Set Up Alerts (Coming Soon)",
  },
  {
    id: "app-tracker",
    icon: ClipboardCheck,
    title: "Job Application Tracker",
    description: "Track your job applications, interviews, and follow-up actions in one organized place.",
    href: "/application-tracker",
    actionText: "Track Applications (Coming Soon)",
  }
];

// Define the tab values that correspond to URL hashes
const HOME_PAGE_TAB_VALUES = ["job-matcher", "job-analyzer", "employmint-plus"];

export default function EmployMintPage() {
  const { profile } = useProfile();
  const userSkills = profile.skills;
  const { viewMode } = useAppearance(); 
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobMatchTitle, setJobMatchTitle] = useState('');
  const [openJobTitleCombobox, setOpenJobTitleCombobox] = useState(false);
  const [jobMatchIdealDescription, setJobMatchIdealDescription] = useState('');
  const [jobMatchCountry, setJobMatchCountry] = useState('');
  const [jobMatchState, setJobMatchState] = useState('');
  const [jobMatchMinSalary, setJobMatchMinSalary] = useState('');
  const [jobMatchMaxSalary, setJobMatchMaxSalary] = useState('');
  const [jobMatchWorkModel, setJobMatchWorkModel] = useState<'any' | 'on-site' | 'remote' | 'hybrid'>('any');
  const [jobMatchSortOrder, setJobMatchSortOrder] = useState<'highest' | 'lowest'>('highest');

  const [skillCompareJobDescription, setSkillCompareJobDescription] = useState('');
  const [skillGapResult, setSkillGapResult] = useState<JobFocusedSkillComparisonOutput | null>(null);

  const [isJobMatchingLoading, startJobMatchingTransition] = useTransition();
  const [isSkillComparingLoading, startSkillComparingTransition] = useTransition();


  const { toast } = useToast();
  const { jobMatchResults, setJobMatchResults } = useContext(JobResultsContext);

  const [employMintPlusLayout, setEmployMintPlusLayout] = useState<'list' | 'grid'>('grid');
  const [activeTab, setActiveTab] = useState(HOME_PAGE_TAB_VALUES[0]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (HOME_PAGE_TAB_VALUES.includes(hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab(HOME_PAGE_TAB_VALUES[0]); // Default to first tab
    }
  }, [searchParams]); // Re-check on searchParams change (though hash isn't in searchParams directly)

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (HOME_PAGE_TAB_VALUES.includes(value)) {
      router.replace(`/#${value}`, { scroll: false });
    }
  };


  useEffect(() => {
    if (viewMode === 'mobile') {
      setEmployMintPlusLayout('list'); 
    } else {
      setEmployMintPlusLayout('grid'); 
    }
  }, [viewMode]);


  const handleJobMatchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userSkills.length === 0) {
      toast({
        title: "Missing Skills",
        description: "Please add your skills in the Profile section first.",
        variant: "destructive",
      });
      return;
    }
    if (!jobMatchTitle || !jobMatchIdealDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide an ideal job title and description.",
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
          country: jobMatchCountry === 'any-country-placeholder' || !jobMatchCountry ? undefined : jobMatchCountry,
          state: jobMatchState === 'any-state-placeholder' || !jobMatchState ? undefined : jobMatchState,
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
        description: "Please add your skills in the Profile section first.",
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

  const desktopTabDefinitions = [
    { value: "job-matcher", title: "Find Matching Jobs", icon: Briefcase },
    { value: "job-analyzer", title: "Analyze Job Fit", icon: Brain },
    { value: "employmint-plus", title: "EmployMint+", icon: Plus },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={cn(
        "flex-grow container mx-auto px-4 py-8 space-y-8",
        viewMode === 'mobile' && "pb-24" // Padding for the global mobile bottom nav
      )}>
        {/* Tabs are only for desktop view now */}
        {viewMode === 'desktop' && (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className={cn(
              "text-muted-foreground",
              "grid w-full grid-cols-3 bg-muted p-1 rounded-lg mb-6" 
            )}>
              {desktopTabDefinitions.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "rounded-sm" 
                  )}
                >
                  <tab.icon className="mr-2 h-4 w-4 inline-block"/>{tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* TabsContent remains the same, controlled by activeTab state */}
            <TabsContent value="job-matcher">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">Skill-Based Job Matching</CardTitle>
                <CardDescription>
                  Enter your ideal job criteria to discover potential job matches. The AI will generate example job postings based on your input.
                  Ensure your skills are up-to-date in your Profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isJobMatchingLoading ? (
                  <LoadingIndicator loadingText="Finding matching jobs..." />
                ) : (
                  <>
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
                                    {JOB_TITLES_PREDEFINED.filter(title => title.toLowerCase().includes(jobMatchTitle.toLowerCase())).slice(0, 50).map((title) => (
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
                          <Select value={jobMatchWorkModel} onValueChange={(value: 'any' | 'on-site' | 'remote' | 'hybrid') => setJobMatchWorkModel(value)}>
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
                      <Button type="submit" disabled={userSkills.length === 0} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                        Find Matching Jobs
                      </Button>
                    </form>
                    {sortedJobMatchResults.length > 0 && (
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
                              key={`${job.jobTitle}-${index}-${job.companyName}`}
                              job={job}
                              jobIndex={jobMatchResults.findIndex(j => j === job)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job-analyzer">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">Job-Focused Skill Comparison</CardTitle>
                <CardDescription className="space-y-2">
                  <p>
                    This feature helps you understand how your current skillset aligns with specific job requirements or general career paths.
                    Your skills from your Profile will be used for this analysis.
                  </p>
                  <p>
                    <strong>Option 1: Analyze a Specific Job Posting.</strong> Paste a job description from a posting you're interested in. The AI will provide a detailed analysis of matching and missing skills, along with suggested learning resources tailored to that role.
                  </p>
                   <p>
                    <strong>Option 2: General Career Guidance.</strong> Leave the job description blank. The AI will then provide a general assessment of your skills (from your Profile),
                    suggest suitable job categories you might excel in (potentially with salary insights), and offer interview tips and mentorship advice to help you prepare for your next opportunity.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSkillComparingLoading ? (
                  <LoadingIndicator loadingText="Analyzing your skills..." />
                ) : (
                  <>
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
                      <Button type="submit" disabled={userSkills.length === 0} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                        Analyze Skills
                      </Button>
                    </form>
                    {skillGapResult && (
                      <div className="mt-8">
                        <SkillGapDisplay
                          missingSkills={skillGapResult.missingSkills || []}
                          suggestedHardSkillsResources={skillGapResult.suggestedHardSkillsResources || []}
                          skillComparisonSummary={skillGapResult.skillComparisonSummary || "Analysis complete."}
                          interviewTips={skillGapResult.interviewTips}
                          suggestedJobCategories={skillGapResult.suggestedJobCategories}
                          suggestedSoftSkills={skillGapResult.suggestedSoftSkills}
                          mentorshipAdvice={skillGapResult.mentorshipAdvice}
                          skillDevelopmentRoadmap={skillGapResult.skillDevelopmentRoadmap}
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="employmint-plus">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline text-2xl text-foreground flex items-center">
                    <Plus className="mr-2 h-6 w-6 text-primary"/>EmployMint+ Features
                  </CardTitle>
                  {/* Layout toggle removed for desktop view, only applies to mobile */}
                </div>
                <CardDescription>
                  Unlock advanced tools and personalized guidance to supercharge your career journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 {/* Desktop layout remains grid */}
                <div className='grid md:grid-cols-2 gap-6'>
                  {employMintPlusFeatures.map((feature) => (
                    <Card 
                      key={feature.id} 
                      className="bg-secondary/30 hover:shadow-md transition-shadow flex flex-col"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg text-primary flex items-center">
                          <feature.icon className="mr-2 h-5 w-5" />
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Link href={feature.href} passHref className="w-full">
                          <Button className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <feature.icon className="mr-2 h-4 w-4"/>
                            {feature.actionText || 'Explore Feature'}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        )}

        {/* Content for Mobile View - Render based on activeTab, but without Radix Tabs wrapper */}
        {viewMode === 'mobile' && (
          <>
            {activeTab === 'job-matcher' && (
                <Card className="shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-foreground">Skill-Based Job Matching</CardTitle>
                  <CardDescription>
                    Enter your ideal job criteria. Ensure skills are up-to-date in Profile.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isJobMatchingLoading ? (
                    <LoadingIndicator loadingText="Finding matching jobs..." />
                  ) : (
                    <>
                      <form onSubmit={handleJobMatchSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4"> {/* Single column for mobile */}
                          <div>
                            <Label htmlFor="jobMatchTitleMobile" className="block text-sm font-medium text-foreground mb-1">Ideal Job Title</Label>
                            <Popover open={openJobTitleCombobox} onOpenChange={setOpenJobTitleCombobox}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" role="combobox" aria-expanded={openJobTitleCombobox} className="w-full justify-between text-muted-foreground bg-card" id="jobMatchTitleMobile">
                                {jobMatchTitle || "Select or type job title..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-80 overflow-y-auto">
                              <Command>
                                <CommandInput value={jobMatchTitle} onValueChange={(search) => { const exists = JOB_TITLES_PREDEFINED.some(title => title.toLowerCase() === search.toLowerCase()); if (exists) {setJobMatchTitle(JOB_TITLES_PREDEFINED.find(title => title.toLowerCase() === search.toLowerCase())!);} else {setJobMatchTitle(search);}}} placeholder="Search or type new title..."/>
                                <CommandList><CommandEmpty>No title found. Type to add new.</CommandEmpty>
                                  <CommandGroup>
                                    {JOB_TITLES_PREDEFINED.filter(title => title.toLowerCase().includes(jobMatchTitle.toLowerCase())).slice(0, 50).map((title) => (<CommandItem key={title} value={title} onSelect={(currentValue) => {setJobMatchTitle(currentValue === jobMatchTitle ? '' : currentValue); setOpenJobTitleCombobox(false);}}>{title}</CommandItem>))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          </div>
                          <div>
                            <Label htmlFor="jobMatchCountryMobile" className="block text-sm font-medium text-foreground mb-1">Country (Optional)</Label>
                            <Select value={jobMatchCountry} onValueChange={setJobMatchCountry}>
                              <SelectTrigger id="jobMatchCountryMobile" className="w-full bg-card"><SelectValue placeholder="Any Country" /></SelectTrigger>
                              <SelectContent><SelectItem value="any-country-placeholder">Any Country</SelectItem>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          {jobMatchCountry === "USA" && (
                            <div>
                              <Label htmlFor="jobMatchStateMobile" className="block text-sm font-medium text-foreground mb-1">State (USA) (Optional)</Label>
                              <Select value={jobMatchState} onValueChange={setJobMatchState}>
                                <SelectTrigger id="jobMatchStateMobile" className="w-full bg-card"><SelectValue placeholder="Any State" /></SelectTrigger>
                                <SelectContent><SelectItem value="any-state-placeholder">Any State</SelectItem>{US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="jobMatchIdealDescriptionMobile" className="block text-sm font-medium text-foreground mb-1">Ideal Job Description</Label>
                          <Textarea id="jobMatchIdealDescriptionMobile" value={jobMatchIdealDescription} onChange={(e) => setJobMatchIdealDescription(e.target.value)} placeholder="Describe your ideal role..." rows={4} required className="bg-card"/>
                        </div>
                        <div className="grid grid-cols-1 gap-4"> {/* Single column for mobile */}
                          <div>
                            <Label className="block text-sm font-medium text-foreground mb-1">Salary Range (USD Annual, Opt.)</Label>
                            <div className="flex items-center gap-2">
                              <Input type="number" value={jobMatchMinSalary} onChange={(e) => setJobMatchMinSalary(e.target.value)} placeholder="Min" className="bg-card"/>
                              <span>-</span>
                              <Input type="number" value={jobMatchMaxSalary} onChange={(e) => setJobMatchMaxSalary(e.target.value)} placeholder="Max" className="bg-card"/>
                            </div>
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-foreground mb-1">Work Model (Opt.)</Label>
                            <Select value={jobMatchWorkModel} onValueChange={(value: 'any' | 'on-site' | 'remote' | 'hybrid') => setJobMatchWorkModel(value)}>
                              <SelectTrigger className="w-full bg-card"><SelectValue placeholder="Any Work Model" /></SelectTrigger>
                              <SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="on-site">On-site</SelectItem><SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button type="submit" disabled={userSkills.length === 0} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Find Matching Jobs</Button>
                      </form>
                      {sortedJobMatchResults.length > 0 && (
                        <div className="mt-8">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-headline text-foreground">Recommendations</h3>
                            <Select value={jobMatchSortOrder} onValueChange={(value: 'highest' | 'lowest') => setJobMatchSortOrder(value)}>
                              <SelectTrigger className="w-[150px] bg-card text-xs"><SelectValue placeholder="Sort by" /></SelectTrigger>
                              <SelectContent><SelectItem value="highest">Highest Match</SelectItem><SelectItem value="lowest">Lowest Match</SelectItem></SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-4">
                            {sortedJobMatchResults.map((job, index) => (<JobRecommendationCard key={`${job.jobTitle}-${index}-${job.companyName}`} job={job} jobIndex={jobMatchResults.findIndex(j => j === job)}/> ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
            {activeTab === 'job-analyzer' && (
                 <Card className="shadow-lg rounded-xl">
                 <CardHeader>
                   <CardTitle className="font-headline text-2xl text-foreground">Job-Focused Skill Comparison</CardTitle>
                   <CardDescription className="space-y-2 text-sm">
                     <p>Paste a job description or leave blank for general advice based on your profile skills.</p>
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   {isSkillComparingLoading ? (
                     <LoadingIndicator loadingText="Analyzing your skills..." />
                   ) : (
                     <>
                       <form onSubmit={handleSkillCompareSubmit} className="space-y-6">
                         <div>
                           <Label htmlFor="skillCompareJobDescriptionMobile" className="block text-sm font-medium text-foreground mb-1">Job Description (Optional)</Label>
                           <Textarea id="skillCompareJobDescriptionMobile" value={skillCompareJobDescription} onChange={(e) => setSkillCompareJobDescription(e.target.value)} placeholder="Paste job description or leave blank..." rows={8} className="bg-card"/>
                         </div>
                         <Button type="submit" disabled={userSkills.length === 0} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Analyze Skills</Button>
                       </form>
                       {skillGapResult && (
                         <div className="mt-8">
                           <SkillGapDisplay missingSkills={skillGapResult.missingSkills || []} suggestedHardSkillsResources={skillGapResult.suggestedHardSkillsResources || []} skillComparisonSummary={skillGapResult.skillComparisonSummary || "Analysis complete."} interviewTips={skillGapResult.interviewTips} suggestedJobCategories={skillGapResult.suggestedJobCategories} suggestedSoftSkills={skillGapResult.suggestedSoftSkills} mentorshipAdvice={skillGapResult.mentorshipAdvice} skillDevelopmentRoadmap={skillGapResult.skillDevelopmentRoadmap} />
                         </div>
                       )}
                     </>
                   )}
                 </CardContent>
               </Card>
            )}
            {activeTab === 'employmint-plus' && (
               <Card className="shadow-lg rounded-xl">
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <CardTitle className="font-headline text-2xl text-foreground flex items-center"><Plus className="mr-2 h-6 w-6 text-primary"/>EmployMint+ Features</CardTitle>
                   <div className="flex gap-1">
                     <Button variant={employMintPlusLayout === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setEmployMintPlusLayout('list')} aria-label="List view" className={employMintPlusLayout === 'list' ? 'bg-primary/20 text-primary' : ''}><List className="h-5 w-5" /></Button>
                     <Button variant={employMintPlusLayout === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setEmployMintPlusLayout('grid')} aria-label="Grid view" className={employMintPlusLayout === 'grid' ? 'bg-primary/20 text-primary' : ''}><LayoutGrid className="h-5 w-5" /></Button>
                   </div>
                 </div>
                 <CardDescription>Unlock advanced tools for your career journey.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className={cn(employMintPlusLayout === 'list' ? 'space-y-4' : 'grid grid-cols-1 gap-4')}> {/* Simplified grid for mobile, or list */}
                   {employMintPlusFeatures.map((feature) => (
                     <Card key={feature.id} className="bg-secondary/30 hover:shadow-md transition-shadow flex flex-col">
                       <CardHeader><CardTitle className="text-lg text-primary flex items-center"><feature.icon className="mr-2 h-5 w-5" />{feature.title}</CardTitle></CardHeader>
                       <CardContent className="flex-grow"><p className="text-sm text-muted-foreground">{feature.description}</p></CardContent>
                       <CardFooter>
                         <Link href={feature.href} passHref className="w-full">
                           <Button className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground"><feature.icon className="mr-2 h-4 w-4"/>{feature.actionText || 'Explore Feature'}</Button>
                         </Link>
                       </CardFooter>
                     </Card>
                   ))}
                 </div>
               </CardContent>
             </Card>
            )}
          </>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
      {/* Removed style jsx global block as it's now in MobileBottomNavigation */}
    </div>
  );
}

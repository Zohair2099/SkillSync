
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JobResultsContext } from '@/context/JobResultsContext';
import { useProfile } from '@/context/ProfileContext';
import { performJobFocusedSkillComparison } from '@/app/actions';
import type { JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, LocateFixed, DollarSign, BriefcaseBusiness, CheckCircle, Brain, Clock, GraduationCap, Users, Type as TypeIcon, FileText, ExternalLink, Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { jobMatchResults } = useContext(JobResultsContext);
  const { profile } = useProfile();

  const [job, setJob] = useState<JobMatchResultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [skillAnalysis, setSkillAnalysis] = useState<JobFocusedSkillComparisonOutput | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const jobIndex = params.jobIndex ? parseInt(params.jobIndex as string) : -1;

  useEffect(() => {
    if (jobIndex === -1) {
      setLoading(false);
      return;
    }
    if (jobMatchResults.length > 0 && jobIndex < jobMatchResults.length) {
      const currentJob = jobMatchResults[jobIndex];
      setJob(currentJob);
      setLoading(false);

      if (profile.skills.length > 0 && currentJob.jobDescription) {
        setIsAnalysisLoading(true);
        performJobFocusedSkillComparison({
          userSkills: profile.skills,
          jobDescription: currentJob.jobDescription,
        })
        .then(analysisResult => {
          setSkillAnalysis(analysisResult);
        })
        .catch(error => {
          console.error("Error performing skill analysis:", error);
          // Optionally set an error state to display to the user
        })
        .finally(() => {
          setIsAnalysisLoading(false);
        });
      }
    } else if (jobMatchResults.length === 0 && jobIndex !== -1) {
      console.warn("Job details page accessed without JobResultsContext or invalid index.");
      setLoading(false);
    }
  }, [jobIndex, jobMatchResults, router, profile.skills]);

  const renderSkillComparisonTable = () => {
    if (!job || !job.requiredSkills || job.requiredSkills.length === 0) {
      return <p className="text-muted-foreground text-sm">No specific required skills listed for this job to compare directly. See AI analysis below for insights.</p>;
    }

    const matchedSkillsCount = job.requiredSkills.filter(reqSkill =>
      profile.skills.some(userSkill => userSkill.name.toLowerCase() === reqSkill.toLowerCase())
    ).length;
    const totalRequiredSkills = job.requiredSkills.length;
    const allMatched = matchedSkillsCount === totalRequiredSkills;
    const someMissing = matchedSkillsCount < totalRequiredSkills;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
          <div>
            <h4 className="font-semibold text-lg mb-2 text-foreground">Your Skills ({profile.skills.length})</h4>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <Badge key={skill.name} variant="secondary">{skill.name} ({skill.experience || 'N/A'})</Badge>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">You haven't added any skills to your profile yet.</p>}
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-foreground">Required Skills for this Job ({totalRequiredSkills})</h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(reqSkill => {
                const isMatched = profile.skills.some(userSkill => userSkill.name.toLowerCase() === reqSkill.toLowerCase());
                return (
                  <Badge
                    key={reqSkill}
                    variant={isMatched ? 'default' : 'destructive'}
                    className={isMatched ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'}
                  >
                    {reqSkill}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-md text-sm ${allMatched ? 'bg-accent/20 text-accent-foreground border border-accent' : someMissing ? 'bg-destructive/10 text-destructive-foreground border border-destructive' : 'bg-muted'}`}>
          {allMatched && totalRequiredSkills > 0 && (
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" />
              <p><strong>Great news!</strong> Your skills align well with the primary requirements listed for this role.</p>
            </div>
          )}
          {someMissing && (
             <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              <p>You have <strong>{matchedSkillsCount} out of {totalRequiredSkills}</strong> listed required skills. Consider developing the missing skills.</p>
            </div>
          )}
          {!totalRequiredSkills && <p>This job posting did not list specific skills for direct comparison.</p>}
        </div>
        
        {skillAnalysis && skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0 && (
            <Card className="mt-4 bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-md flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-destructive"/>AI Identified Skill Gaps & Development Areas</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Based on the job description, the AI suggests focusing on these areas:</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skillAnalysis.missingSkills.map(skill => (
                            <Badge key={skill} variant="outline" className="border-destructive text-destructive">{skill}</Badge>
                        ))}
                    </div>
                    {skillAnalysis.suggestedHardSkillsResources && skillAnalysis.suggestedHardSkillsResources.length > 0 && (
                        <>
                            <h5 className="font-semibold text-sm mb-1 text-foreground">Learning Resources:</h5>
                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                {skillAnalysis.suggestedHardSkillsResources.map((res, i) => <li key={`res-${i}`}>{res}</li>)}
                            </ul>
                        </>
                    )}
                </CardContent>
            </Card>
        )}
         <p className="text-xs text-muted-foreground text-center mt-2">
           Tip: This comparison uses the skills explicitly listed by the job poster. The AI analysis above provides further insights from the full job description.
         </p>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <FileText className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-headline text-foreground mb-2">Job Details Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">
          The job details you are looking for could not be found. This might happen if you navigated here directly or the job list was cleared.
        </p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Button>

        <Card className="shadow-xl rounded-xl mb-8">
          <CardHeader className="border-b">
            <CardTitle className="font-headline text-3xl text-primary">{job.jobTitle}</CardTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-md text-muted-foreground mt-1">
              {job.companyName && (
                <span className="flex items-center"><Building2 className="mr-1.5 h-5 w-5" /> {job.companyName}</span>
              )}
              {job.location && (
                <span className="flex items-center"><LocateFixed className="mr-1.5 h-5 w-5" /> {job.location}</span>
              )}
            </div>
            {job.salaryRange && (
                <p className="text-sm text-accent flex items-center pt-1"><DollarSign className="mr-1.5 h-4 w-4" />{job.salaryRange}</p>
            )}
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {job.jobDescription && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Job Summary</h3>
                <p className="text-muted-foreground whitespace-pre-line">{job.jobDescription}</p>
              </div>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center"><BriefcaseBusiness className="mr-2 h-5 w-5 text-primary" />Key Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  {job.responsibilities.map((resp, i) => <li key={`resp-${i}`}>{resp}</li>)}
                </ul>
              </div>
            )}
            
            {/* Combined Required and Preferred Skills if job.requiredSkills exists from matching AI */}
             {(job.requiredSkills && job.requiredSkills.length > 0) || (job.preferredSkills && job.preferredSkills.length > 0) ? (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Key Skills</h3>
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="mb-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Required:</p>
                        <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, i) => <Badge key={`req-skill-${i}`} variant="secondary">{skill}</Badge>)}
                        </div>
                    </div>
                )}
                {job.preferredSkills && job.preferredSkills.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Preferred:</p>
                        <div className="flex flex-wrap gap-2">
                        {job.preferredSkills.map((skill, i) => <Badge key={`pref-skill-${i}`} variant="outline">{skill}</Badge>)}
                        </div>
                    </div>
                )}
              </div>
            ) : null}


            {(job.experienceLevel || job.educationLevel || job.employmentType || job.workModel) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t mt-4">
                    {job.experienceLevel && (
                        <div className="flex items-start"><Clock className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" /> <div><span className="font-medium text-foreground">Experience:</span> <span className="text-muted-foreground">{job.experienceLevel}</span></div></div>
                    )}
                    {job.educationLevel && (
                        <div className="flex items-start"><GraduationCap className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" /> <div><span className="font-medium text-foreground">Education:</span> <span className="text-muted-foreground">{job.educationLevel}</span></div></div>
                    )}
                    {job.employmentType && (
                        <div className="flex items-start"><TypeIcon className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" /> <div><span className="font-medium text-foreground">Employment Type:</span> <span className="text-muted-foreground">{job.employmentType}</span></div></div>
                    )}
                    {job.workModel && (
                        <div className="flex items-start"><Users className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" /> <div><span className="font-medium text-foreground">Work Model:</span> <span className="text-muted-foreground">{job.workModel.charAt(0).toUpperCase() + job.workModel.slice(1)}</span></div></div>
                    )}
                 </div>
            )}
            
            <CardDescription className="text-xs pt-4 text-center">
              This is an example job posting generated by AI. Always verify details with actual company postings.
            </CardDescription>

            <div className="text-center mt-6">
                <Button variant="default" disabled> 
                    <ExternalLink className="mr-2 h-4 w-4" /> View Original Posting (Example)
                </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Skill Comparison Section */}
        <Card className="shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Lightbulb className="mr-2 h-6 w-6" /> Your Fit Analysis
            </CardTitle>
            <CardDescription>
              Comparing your profile skills against the listed requirements for '{job.jobTitle}'. The AI also provides further analysis based on the full job description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalysisLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-muted-foreground">Analyzing your skills against this job...</p>
              </div>
            ) : profile.skills.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-muted-foreground mb-3">Please add skills to your profile to see a comparison.</p>
                    <Link href="/profile" passHref>
                        <Button variant="outline">Go to Profile</Button>
                    </Link>
                </div>
            ) : (
              renderSkillComparisonTable()
            )}

            {skillAnalysis && !isAnalysisLoading && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Insights & Recommendations:</h3>
                <Accordion type="single" collapsible className="w-full">
                  {skillAnalysis.skillComparisonSummary && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">Overall Summary</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{skillAnalysis.skillComparisonSummary}</AccordionContent>
                    </AccordionItem>
                  )}
                  {skillAnalysis.interviewTips && skillAnalysis.interviewTips.length > 0 && (
                     <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">Interview Tips</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {skillAnalysis.interviewTips.map((tip, i) => <li key={`tip-${i}`}>{tip}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                   {skillAnalysis.suggestedSoftSkills && skillAnalysis.suggestedSoftSkills.length > 0 && (
                     <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left">Valuable Soft Skills</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {skillAnalysis.suggestedSoftSkills.map((tip, i) => <li key={`soft-${i}`}>{tip}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {skillAnalysis.mentorshipAdvice && (
                     <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">Mentorship Advice</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{skillAnalysis.mentorshipAdvice}</AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Helper icon for loading states if not already globally available
const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);


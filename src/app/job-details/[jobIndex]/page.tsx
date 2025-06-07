
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JobResultsContext } from '@/context/JobResultsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, LocateFixed, DollarSign, BriefcaseBusiness, CheckCircle, Brain, Clock, GraduationCap, Users, Type as TypeIcon, FileText, ExternalLink } from 'lucide-react'; // Added FileText, ExternalLink
import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';

type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { jobMatchResults } = useContext(JobResultsContext);
  const [job, setJob] = useState<JobMatchResultItem | null>(null);
  const [loading, setLoading] = useState(true);

  const jobIndex = params.jobIndex ? parseInt(params.jobIndex as string) : -1;

  useEffect(() => {
    if (jobIndex === -1) {
      // Invalid index, redirect or show error
      setLoading(false);
      // Consider redirecting: router.push('/');
      return;
    }
    if (jobMatchResults.length > 0 && jobIndex < jobMatchResults.length) {
      setJob(jobMatchResults[jobIndex]);
      setLoading(false);
    } else if (jobMatchResults.length === 0 && jobIndex !== -1) {
      // This case means context might not be populated yet or direct navigation.
      // For a robust solution, you might fetch job details by an ID if they were persisted.
      // For now, we assume context should have it or it's an error state.
      // If you expect direct navigation without context, you'd need a fallback.
      console.warn("Job details page accessed without JobResultsContext being populated or invalid index.");
      setLoading(false);
      // Potentially redirect or show a "job not found" message.
      // For now, it will just show "Job details not found".
    }
  }, [jobIndex, jobMatchResults, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Loading job details...</p>
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

        <Card className="shadow-xl rounded-xl">
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

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, i) => <Badge key={`req-skill-${i}`} variant="secondary">{skill}</Badge>)}
                </div>
              </div>
            )}

            {job.preferredSkills && job.preferredSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center"><Brain className="mr-2 h-5 w-5 text-primary" />Preferred Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills.map((skill, i) => <Badge key={`pref-skill-${i}`} variant="outline">{skill}</Badge>)}
                </div>
              </div>
            )}

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
              The skill comparison table for this job against your profile will be available in a future update.
            </CardDescription>

            {/* Placeholder for a link to an "original" (mock) job posting */}
            <div className="text-center mt-6">
                <Button variant="default" disabled> 
                    <ExternalLink className="mr-2 h-4 w-4" /> View Original Posting (Example)
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

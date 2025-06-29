
import React from 'react';
import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Info, Building2, LocateFixed, DollarSign, ArrowRight } from 'lucide-react';
import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import { cn } from '@/lib/utils';

type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

interface JobRecommendationCardProps {
  job: JobMatchResultItem;
  jobIndex: number; 
}

const JobRecommendationCardComponent = ({
  job,
  jobIndex
}: JobRecommendationCardProps) => {
  
  const {
    jobTitle, 
    companyName, 
    location, 
    jobDescription, 
    matchPercentage, 
    rationale,
    salaryRange,
  } = job;

  let badgeBgClass = 'bg-destructive';
  let badgeTextClass = 'text-destructive-foreground';
  let progressIndicatorClass = 'bg-destructive';

  if (matchPercentage === 100) {
    badgeBgClass = 'bg-yellow'; // Uses theme's yellow-DEFAULT
    badgeTextClass = 'text-yellow-foreground';
    progressIndicatorClass = 'bg-yellow';
  } else if (matchPercentage >= 75) {
    badgeBgClass = 'bg-accent';
    badgeTextClass = 'text-accent-foreground';
    progressIndicatorClass = 'bg-accent';
  } else if (matchPercentage >= 45) {
    badgeBgClass = 'bg-orange-500'; // Uses theme's orange-500
    badgeTextClass = 'text-white'; // text-white should contrast well with orange-500 in both modes
    progressIndicatorClass = 'bg-orange-500';
  }
  
  return (
    <Card className={cn(
        "w-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:scale-[1.015]"
      )}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-2">
          <div className="flex-grow">
            <CardTitle className="font-headline text-xl">{jobTitle}</CardTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
              {companyName && (
                <span className="flex items-center"><Building2 className="mr-1.5 h-4 w-4" /> {companyName}</span>
              )}
              {location && (
                <span className="flex items-center"><LocateFixed className="mr-1.5 h-4 w-4" /> {location}</span>
              )}
              {salaryRange && (
                  <span className="flex items-center"><DollarSign className="mr-1.5 h-4 w-4" /> {salaryRange}</span>
              )}
            </div>
          </div>
          <Badge className={cn("whitespace-nowrap ml-auto shrink-0 self-start sm:self-center mt-2 sm:mt-0", badgeBgClass, badgeTextClass)}>
            <Target className="mr-1.5 h-4 w-4" />
            {matchPercentage.toFixed(0)}% Match
          </Badge>
        </div>
        {jobDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{jobDescription}</p>
        )}
        <div className="w-full space-y-1 mb-3">
          <Progress value={matchPercentage} indicatorClassName={cn("transition-all duration-500", progressIndicatorClass)} aria-label={`Match percentage: ${matchPercentage.toFixed(0)}%`} className="h-2" />
        </div>
        <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground flex items-center">
                <Info className="mr-1.5 h-3 w-3" /> {rationale} 
            </p>
            <Link href={`/job-details/${jobIndex}`} passHref legacyBehavior>
              <a className="text-sm text-primary hover:underline flex items-center group">
                More Details <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </Link>
        </div>
      </div>
    </Card>
  );
}

export const JobRecommendationCard = React.memo(JobRecommendationCardComponent);

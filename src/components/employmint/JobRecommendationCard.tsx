
import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Info, ChevronsUpDown, Building2, LocateFixed, DollarSign, ArrowRight } from 'lucide-react';
import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';

type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

interface JobRecommendationCardProps {
  job: JobMatchResultItem;
  jobIndex: number; // Used for linking to the details page
}

export function JobRecommendationCard({ 
  job,
  jobIndex
}: JobRecommendationCardProps) {
  
  const {
    jobTitle, 
    companyName, 
    location, 
    jobDescription, // Short summary
    matchPercentage, 
    rationale,
    salaryRange,
  } = job;

  let progressColor = 'bg-destructive'; 
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "destructive";
  let badgeClass = 'bg-destructive text-destructive-foreground';

  if (matchPercentage === 100) {
    progressColor = 'bg-yellow-400'; 
    badgeVariant = "default";
    badgeClass = 'bg-yellow-400 text-yellow-foreground dark:text-yellow-900';
  } else if (matchPercentage >= 75) {
    progressColor = 'bg-accent'; 
    badgeVariant = "default";
    badgeClass = 'bg-accent text-accent-foreground';
  } else if (matchPercentage >= 45) {
    progressColor = 'bg-orange-500'; 
    badgeVariant = "secondary";
    badgeClass = 'bg-orange-500 text-white dark:text-orange-950';
  }
  
  return (
    <Card className="w-full shadow-lg overflow-hidden">
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
          <Badge variant={badgeVariant} className={`${badgeClass} whitespace-nowrap ml-auto shrink-0 self-start sm:self-center mt-2 sm:mt-0`}>
            <Target className="mr-1.5 h-4 w-4" />
            {matchPercentage.toFixed(0)}% Match
          </Badge>
        </div>
        {jobDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{jobDescription}</p>
        )}
        <div className="w-full space-y-1 mb-3">
          <Progress value={matchPercentage} indicatorClassName={progressColor} aria-label={`Match percentage: ${matchPercentage.toFixed(0)}%`} className="h-2" />
        </div>
        <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground flex items-center">
                <Info className="mr-1.5 h-3 w-3" /> {rationale} 
            </p>
            <Link href={`/job-details/${jobIndex}`} passHref legacyBehavior>
              <a className="text-sm text-primary hover:underline flex items-center">
                More Details <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
        </div>
      </div>
    </Card>
  );
}

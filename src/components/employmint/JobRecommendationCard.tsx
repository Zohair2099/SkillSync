
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Target, Briefcase, MapPin, DollarSign, Users, GraduationCap, Type, Info, ChevronsUpDown, Building2, LocateFixed, BriefcaseBusiness, Clock, BookUser, CheckCircle, Brain } from 'lucide-react';

interface JobRecommendationCardProps {
  jobTitle: string;
  companyName?: string;
  location?: string;
  jobDescription?: string; // Short summary for preview
  matchPercentage: number;
  rationale: string;
  salaryRange?: string;
  employmentType?: string;
  workModel?: 'on-site' | 'remote' | 'hybrid';
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  experienceLevel?: string;
  educationLevel?: string;
}

export function JobRecommendationCard({ 
  jobTitle, 
  companyName, 
  location, 
  jobDescription, 
  matchPercentage, 
  rationale,
  salaryRange,
  employmentType,
  workModel,
  responsibilities,
  requiredSkills,
  preferredSkills,
  experienceLevel,
  educationLevel
}: JobRecommendationCardProps) {
  
  let progressColor = 'bg-destructive'; // Default red for < 45
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "destructive";
  let badgeClass = 'bg-destructive text-destructive-foreground';

  if (matchPercentage === 100) {
    progressColor = 'bg-yellow-400'; // Gold
    badgeVariant = "default";
    badgeClass = 'bg-yellow-400 text-yellow-foreground dark:text-yellow-900';
  } else if (matchPercentage >= 75) {
    progressColor = 'bg-accent'; // Green
    badgeVariant = "default";
    badgeClass = 'bg-accent text-accent-foreground';
  } else if (matchPercentage >= 45) {
    progressColor = 'bg-orange-500'; // Orange
    badgeVariant = "secondary";
    badgeClass = 'bg-orange-500 text-white dark:text-orange-950';
  }
  
  return (
    <Card className="w-full shadow-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex flex-col items-start w-full">
              <div className="flex items-start justify-between gap-4 w-full mb-2">
                <div>
                  <CardTitle className="font-headline text-xl text-left">{jobTitle}</CardTitle>
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
                <Badge variant={badgeVariant} className={`${badgeClass} whitespace-nowrap ml-auto shrink-0`}>
                  <Target className="mr-1.5 h-4 w-4" />
                  {matchPercentage.toFixed(0)}% Match
                </Badge>
              </div>
              {jobDescription && (
                <p className="text-sm text-muted-foreground text-left line-clamp-2 mb-1">{jobDescription}</p>
              )}
              <div className="w-full space-y-1 mb-2">
                <Progress value={matchPercentage} indicatorClassName={progressColor} aria-label={`Match percentage: ${matchPercentage.toFixed(0)}%`} className="h-2" />
              </div>
               <p className="text-xs text-muted-foreground text-left flex items-center">
                  <Info className="mr-1.5 h-3 w-3" /> {rationale} <ChevronsUpDown className="ml-auto h-4 w-4 text-primary group-data-[state=open]:rotate-180 transition-transform" />
               </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-0">
            <div className="space-y-4">
              {responsibilities && responsibilities.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-foreground mb-1 flex items-center"><BriefcaseBusiness className="mr-2 h-4 w-4 text-primary" />Key Responsibilities:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                    {responsibilities.map((resp, i) => <li key={`resp-${i}`}>{resp}</li>)}
                  </ul>
                </div>
              )}
              {requiredSkills && requiredSkills.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-foreground mb-1 flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-primary" />Required Skills:</h4>
                   <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((skill, i) => <Badge key={`req-skill-${i}`} variant="secondary">{skill}</Badge>)}
                  </div>
                </div>
              )}
               {preferredSkills && preferredSkills.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-foreground mb-1 flex items-center"><Brain className="mr-2 h-4 w-4 text-primary" />Preferred Skills:</h4>
                   <div className="flex flex-wrap gap-2">
                    {preferredSkills.map((skill, i) => <Badge key={`pref-skill-${i}`} variant="outline">{skill}</Badge>)}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {experienceLevel && (
                  <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary shrink-0" /> <span className="font-medium mr-1">Experience:</span> {experienceLevel}</div>
                )}
                {educationLevel && (
                  <div className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary shrink-0" /> <span className="font-medium mr-1">Education:</span> {educationLevel}</div>
                )}
                {employmentType && (
                  <div className="flex items-center"><Type className="mr-2 h-4 w-4 text-primary shrink-0" /> <span className="font-medium mr-1">Type:</span> {employmentType}</div>
                )}
                {workModel && (
                  <div className="flex items-center"><Users className="mr-2 h-4 w-4 text-primary shrink-0" /> <span className="font-medium mr-1">Model:</span> {workModel.charAt(0).toUpperCase() + workModel.slice(1)}</div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

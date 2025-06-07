import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BookOpen, Puzzle, PartyPopper, Brain } from 'lucide-react';

interface SkillGapDisplayProps {
  missingSkills: string[];
  suggestedResources: string[];
  skillComparisonSummary: string;
  interviewTips?: string[];
}

export function SkillGapDisplay({ missingSkills, suggestedResources, skillComparisonSummary, interviewTips }: SkillGapDisplayProps) {
  const noGapsFound = missingSkills.length === 0;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
           <Puzzle className="h-6 w-6 text-primary" />
           <CardTitle className="font-headline text-xl">Skill Gap Analysis</CardTitle>
        </div>
        <CardDescription className="text-sm pt-1">{skillComparisonSummary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {noGapsFound ? (
          <div className="text-center p-4 rounded-md bg-accent/10">
            <PartyPopper className="h-12 w-12 text-accent mx-auto mb-3" />
            <p className="text-lg font-semibold text-accent-foreground">No significant skill gaps identified!</p>
            <p className="text-sm text-muted-foreground mt-1">
              You can apply for this job based on your current skills.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(skill => (
                <Badge key={skill} variant="destructive" className="py-1 px-3 text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {suggestedResources.length > 0 && !noGapsFound && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Suggested Learning Resources
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {suggestedResources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
        
        {interviewTips && interviewTips.length > 0 && (
           <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <Brain className="mr-2 h-5 w-5 text-accent" />
              Helpful Interview Tips
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {interviewTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

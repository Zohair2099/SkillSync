import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BookOpen, Puzzle } from 'lucide-react';

interface SkillGapDisplayProps {
  missingSkills: string[];
  suggestedResources: string[];
  skillComparisonSummary: string;
}

export function SkillGapDisplay({ missingSkills, suggestedResources, skillComparisonSummary }: SkillGapDisplayProps) {
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
        {missingSkills.length > 0 && (
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
        {missingSkills.length === 0 && (
           <p className="text-green-600 font-medium">No significant skill gaps identified for this job based on your current skills!</p>
        )}

        {suggestedResources.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-accent" />
              Suggested Learning Resources
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {suggestedResources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

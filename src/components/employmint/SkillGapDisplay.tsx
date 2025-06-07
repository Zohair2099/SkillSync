
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BookOpen, Puzzle, PartyPopper, Brain, Briefcase, Users, MessageSquare } from 'lucide-react';

interface SkillGapDisplayProps {
  missingSkills: string[];
  suggestedHardSkillsResources: string[]; // Updated from suggestedResources
  skillComparisonSummary: string;
  interviewTips?: string[];
  suggestedJobCategories?: string[];
  suggestedSoftSkills?: string[]; // New prop
  mentorshipAdvice?: string; // New prop
}

export function SkillGapDisplay({ 
  missingSkills, 
  suggestedHardSkillsResources, 
  skillComparisonSummary, 
  interviewTips, 
  suggestedJobCategories,
  suggestedSoftSkills,
  mentorshipAdvice 
}: SkillGapDisplayProps) {
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
        {noGapsFound && !skillComparisonSummary.toLowerCase().includes("general analysis") ? ( // Check if it's not a general analysis
          <div className="text-center p-4 rounded-md bg-accent/10 border border-accent">
            <PartyPopper className="h-12 w-12 text-accent mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">No significant skill gaps identified!</p>
            <p className="text-sm text-muted-foreground mt-1">
              You appear to have the key skills for this role. Consider the tips below to further prepare.
            </p>
          </div>
        ) : (
          missingSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                Missing or Underdeveloped Hard Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <Badge key={skill} variant="destructive" className="py-1 px-3 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )
        )}

        {suggestedHardSkillsResources.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Develop Your Hard Skills
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {suggestedHardSkillsResources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
        
        {suggestedJobCategories && suggestedJobCategories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Suggested Job Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedJobCategories.map(category => (
                <Badge key={category} variant="secondary" className="py-1 px-3 text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {suggestedSoftSkills && suggestedSoftSkills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Valuable Soft Skills to Highlight
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {suggestedSoftSkills.map((skillTip, index) => (
                <li key={`softskill-${index}`}>{skillTip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {mentorshipAdvice && (
           <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Mentorship & Networking
            </h3>
            <p className="text-sm text-muted-foreground">{mentorshipAdvice}</p>
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
                <li key={`tip-${index}`}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

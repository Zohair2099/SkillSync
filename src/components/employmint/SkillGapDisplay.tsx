
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BookOpen, Puzzle, PartyPopper, Brain, Briefcase, Users, MessageSquare, DollarSign, Info } from 'lucide-react'; // Added DollarSign, Info
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Added Accordion

interface SuggestedJobCategory {
  categoryName: string;
  estimatedSalaryRange?: string;
}

interface SkillGapDisplayProps {
  missingSkills: string[];
  suggestedHardSkillsResources: string[]; 
  skillComparisonSummary: string;
  interviewTips?: string[];
  suggestedJobCategories?: SuggestedJobCategory[]; // Updated type
  suggestedSoftSkills?: string[]; 
  mentorshipAdvice?: string; 
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
  const noGapsFound = !missingSkills || missingSkills.length === 0;
  const isGeneralAnalysis = !skillComparisonSummary.toLowerCase().includes("specific job") && (suggestedJobCategories && suggestedJobCategories.length > 0);


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
           <Puzzle className="h-6 w-6 text-primary" />
           <CardTitle className="font-headline text-xl">Skills Analysis & Career Guidance</CardTitle>
        </div>
        <CardDescription className="text-sm pt-1">{skillComparisonSummary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {noGapsFound && !isGeneralAnalysis ? ( 
          <div className="text-center p-4 rounded-md bg-accent/10 border border-accent">
            <PartyPopper className="h-12 w-12 text-accent mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">No significant skill gaps identified for this specific role!</p>
            <p className="text-sm text-muted-foreground mt-1">
              You appear to have the key skills mentioned. Consider the tips below to further prepare.
            </p>
          </div>
        ) : (
          missingSkills && missingSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                Potential Skill Gaps or Development Areas
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

        {suggestedHardSkillsResources && suggestedHardSkillsResources.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Develop Your Hard Skills
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
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
              Suggested Job Categories & Paths
            </h3>
            <Accordion type="multiple" className="w-full space-y-2">
              {suggestedJobCategories.map((jobCat, index) => (
                <AccordionItem value={`cat-${index}`} key={jobCat.categoryName} className="border bg-card rounded-lg shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-left hover:no-underline text-foreground font-medium">
                        {jobCat.categoryName}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 text-sm">
                        {jobCat.estimatedSalaryRange ? (
                            <p className="text-muted-foreground flex items-center">
                                <DollarSign className="mr-1.5 h-4 w-4 text-accent"/> Estimated Salary: {jobCat.estimatedSalaryRange}
                            </p>
                        ) : (
                            <p className="text-muted-foreground flex items-center">
                                <Info className="mr-1.5 h-4 w-4 text-muted-foreground"/> Salary information varies for this role.
                            </p>
                        )}
                    </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
             <p className="text-xs text-muted-foreground mt-2">Salary estimates are approximate and can vary by location, experience, and company.</p>
          </div>
        )}
        
        {((suggestedSoftSkills && suggestedSoftSkills.length > 0) || mentorshipAdvice || (interviewTips && interviewTips.length > 0)) && (
            <div className="mt-6 pt-6 border-t">
                 <h3 className="text-lg font-semibold text-foreground mb-3">Additional Career Advice:</h3>
                 <Accordion type="multiple" collapsible className="w-full space-y-3">
                    {suggestedSoftSkills && suggestedSoftSkills.length > 0 && (
                        <AccordionItem value="soft-skills">
                            <AccordionTrigger><MessageSquare className="mr-2 h-5 w-5 text-primary" />Valuable Soft Skills</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                                    {suggestedSoftSkills.map((skillTip, index) => (
                                        <li key={`softskill-${index}`}>{skillTip}</li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {mentorshipAdvice && (
                        <AccordionItem value="mentorship">
                            <AccordionTrigger><Users className="mr-2 h-5 w-5 text-primary" />Mentorship & Networking</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">
                                {mentorshipAdvice}
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {interviewTips && interviewTips.length > 0 && (
                        <AccordionItem value="interview-tips">
                            <AccordionTrigger><Brain className="mr-2 h-5 w-5 text-accent" />Helpful Interview Tips</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                                    {interviewTips.map((tip, index) => (
                                    <li key={`tip-${index}`}>{tip}</li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                 </Accordion>
            </div>
        )}
      </CardContent>
    </Card>
  );
}


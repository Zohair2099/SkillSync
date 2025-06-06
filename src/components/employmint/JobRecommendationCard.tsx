import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface JobRecommendationCardProps {
  jobTitle: string;
  matchPercentage: number;
  rationale: string;
}

export function JobRecommendationCard({ jobTitle, matchPercentage, rationale }: JobRecommendationCardProps) {
  const progressColor = matchPercentage > 70 ? 'bg-accent' : matchPercentage > 40 ? 'bg-yellow-500' : 'bg-destructive';
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xl">{jobTitle}</CardTitle>
          <Badge variant={matchPercentage > 70 ? "default" : "secondary"} className={matchPercentage > 70 ? "bg-accent text-accent-foreground" : ""}>
            <Target className="mr-2 h-4 w-4" />
            {matchPercentage.toFixed(0)}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-foreground">Match Strength</p>
          <Progress value={matchPercentage} indicatorClassName={progressColor} aria-label={`Match percentage: ${matchPercentage.toFixed(0)}%`} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">Rationale:</h4>
          <CardDescription className="text-sm text-muted-foreground whitespace-pre-wrap">{rationale}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

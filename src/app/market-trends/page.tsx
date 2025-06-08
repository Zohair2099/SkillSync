
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BarChart3, Briefcase, Lightbulb, Sparkles, TrendingUp, Users, Cpu, DollarSign, Info, BookOpen } from 'lucide-react';
import { performMarketTrendsAnalysis } from '@/app/actions';
import type { MarketTrendsInput, MarketTrendsOutput } from '@/ai/flows/market-trends-flow';
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/context/ProfileContext';
import { LoadingIndicator } from '@/components/employmint/LoadingIndicator';

export default function MarketTrendsPage() {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [trendsResult, setTrendsResult] = useState<MarketTrendsOutput | null>(null);
  const [isLoading, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      setTrendsResult(null);
      try {
        const input: MarketTrendsInput = {
          areaOfInterest: areaOfInterest.trim() || undefined,
          userSkills: profile.skills.map(s => s.name),
        };
        const result = await performMarketTrendsAnalysis(input);
        setTrendsResult(result);
      } catch (error) {
        console.error("Error fetching market trends:", error);
        toast({
          title: "Error Fetching Trends",
          description: (error as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <Card className="max-w-3xl mx-auto shadow-xl rounded-xl">
          <CardHeader>
            <div className="flex items-center mb-2">
                <BarChart3 className="h-10 w-10 text-primary mr-3" />
                <CardTitle className="font-headline text-3xl text-primary">Real-Time Job Market Trends</CardTitle>
            </div>
            <CardDescription>
              Get AI-powered insights into current job demand, skill trends, emerging roles, and industry outlooks.
              Optionally, specify an area of interest (e.g., "USA", "Tech in Canada", "Remote roles globally") to focus the analysis. Your profile skills will also be considered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="areaOfInterest" className="block text-sm font-medium text-foreground mb-1">
                Area of Interest (Optional)
              </Label>
              <Input
                id="areaOfInterest"
                value={areaOfInterest}
                onChange={(e) => setAreaOfInterest(e.target.value)}
                placeholder="e.g., Software Engineering in California, Global Marketing roles"
                className="bg-card"
              />
            </div>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? 'Fetching Trends...' : 'Get Market Trends'}
            </Button>
          </CardContent>

          {isLoading && (
            <CardContent>
              <LoadingIndicator loadingText="Analyzing job market trends..." />
            </CardContent>
          )}

          {trendsResult && !isLoading && (
            <CardContent className="space-y-8 pt-6 border-t">
              <Card className="bg-secondary/30">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center"><Info className="mr-2 h-5 w-5"/>Analysis Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong className="text-foreground">Area Analyzed:</strong> {trendsResult.areaAnalyzed}</p>
                  <p><strong className="text-foreground">Data Freshness:</strong> <span className="text-muted-foreground">{trendsResult.dataFreshness}</span></p>
                  <p className="text-muted-foreground mt-2">{trendsResult.overallSummary}</p>
                  {trendsResult.userSkillsRelevance && <p className="mt-2 italic text-accent-foreground bg-accent/20 p-2 rounded-md"><strong className="text-accent">User Skills Note:</strong> {trendsResult.userSkillsRelevance}</p>}
                </CardContent>
              </Card>

              {trendsResult.trendingJobTitles && trendsResult.trendingJobTitles.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-lg flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Trending Job Titles</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {trendsResult.trendingJobTitles.map(title => <Badge key={title} variant="secondary" className="py-1 px-2.5">{title}</Badge>)}
                  </CardContent>
                </Card>
              )}

              {trendsResult.inDemandSkills && trendsResult.inDemandSkills.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-lg flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary"/>In-Demand Skills</CardTitle></CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full space-y-2">
                      {trendsResult.inDemandSkills.map(skill => (
                        <AccordionItem value={skill.skillName} key={skill.skillName} className="border bg-card rounded-md shadow-sm">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline text-foreground font-medium">
                            {skill.skillName}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground space-y-1">
                            <p>{skill.reason}</p>
                            {skill.relatedRoles && skill.relatedRoles.length > 0 && (
                                <p><strong className="text-foreground">Often seen in:</strong> {skill.relatedRoles.join(', ')}</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {trendsResult.emergingRoles && trendsResult.emergingRoles.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-lg flex items-center"><Cpu className="mr-2 h-5 w-5 text-primary"/>Emerging & Evolving Roles</CardTitle></CardHeader>
                  <CardContent>
                     <Accordion type="multiple" className="w-full space-y-2">
                      {trendsResult.emergingRoles.map(role => (
                        <AccordionItem value={role.roleName} key={role.roleName} className="border bg-card rounded-md shadow-sm">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline text-foreground font-medium">
                            {role.roleName}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground space-y-1">
                            <p>{role.description}</p>
                            {role.typicalSkills && role.typicalSkills.length > 0 && (
                                <p><strong className="text-foreground">Typical Skills:</strong> {role.typicalSkills.join(', ')}</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
              
              {trendsResult.industryInsights && trendsResult.industryInsights.length > 0 && (
                 <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Industry Insights</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {trendsResult.industryInsights.map(insight => (
                            <div key={insight.industryName} className="p-3 border rounded-md bg-muted/50">
                                <h4 className="font-semibold text-md text-foreground">{insight.industryName}
                                {insight.growthOutlook && <Badge variant="outline" className="ml-2 text-xs">{insight.growthOutlook}</Badge>}
                                </h4>
                                <p className="text-sm text-muted-foreground">{insight.insightText}</p>
                            </div>
                        ))}
                    </CardContent>
                 </Card>
              )}

              {trendsResult.salaryOutlook && (
                <Card>
                  <CardHeader><CardTitle className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary"/>Salary Outlook</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{trendsResult.salaryOutlook}</p></CardContent>
                </Card>
              )}

              {trendsResult.keyTakeaways && trendsResult.keyTakeaways.length > 0 && (
                <Card className="bg-accent/10 border-accent">
                  <CardHeader><CardTitle className="text-lg flex items-center text-accent-foreground"><Lightbulb className="mr-2 h-5 w-5"/>Key Takeaways for Job Seekers</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm text-accent-foreground/90">
                      {trendsResult.keyTakeaways.map((takeaway, i) => <li key={`takeaway-${i}`}>{takeaway}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          )}
          <CardFooter className="text-center mt-6">
            <p className="text-xs text-muted-foreground mx-auto">
              Market trend data is AI-generated and should be used for informational purposes. For the most up-to-date statistics, consult specialized market research reports.
            </p>
          </CardFooter>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

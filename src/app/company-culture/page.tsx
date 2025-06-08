
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Building, Users, Lightbulb, Sparkles, ThumbsDown, Search, CheckCircle } from 'lucide-react';
import { performCompanyCultureMatching } from '@/app/actions';
// Import the schema and type from the new shared location
import { CompanyCulturePreferencesInputSchema, type CompanyCulturePreferencesInput } from '@/lib/schemas/company-culture-schemas';
// Import the output type from actions.ts (or flows if it was re-exported from there, but actions.ts is safer for client)
import type { CompanyCultureMatchOutput } from '@/app/actions'; // Assuming actions.ts re-exports this type
import { useToast } from "@/hooks/use-toast";
import { LoadingIndicator } from '@/components/employmint/LoadingIndicator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


export default function CompanyCulturePage() {
  const { toast } = useToast();
  const [isLoading, startTransition] = useTransition();
  const [matchResults, setMatchResults] = useState<CompanyCultureMatchOutput | null>(null);

  const form = useForm<CompanyCulturePreferencesInput>({
    resolver: zodResolver(CompanyCulturePreferencesInputSchema), // Use the imported schema
    defaultValues: {
      workLifeBalance: "moderate",
      teamEnvironment: "mixed",
      innovationStyle: "balanced_risk",
      companySize: "any",
      decisionMaking: "consensus_driven",
      feedbackCulture: "formal_periodic",
      pace: "steady_predictable",
      learningOpportunities: true,
      socialImpactFocus: false,
      diversityAndInclusion: true,
    },
  });

  const onSubmit = (data: CompanyCulturePreferencesInput) => {
    setMatchResults(null);
    startTransition(async () => {
      try {
        const result = await performCompanyCultureMatching(data);
        setMatchResults(result);
        if (!result || result.length === 0) {
           toast({ title: "No Matches Found", description: "The AI couldn't generate specific company culture matches for your preferences. Try adjusting your selections.", variant: "default" });
        }
      } catch (error) {
        console.error("Error fetching company culture matches:", error);
        toast({
          title: "Error Fetching Matches",
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
                <Building className="h-10 w-10 text-primary mr-3" />
                <CardTitle className="font-headline text-3xl text-primary">Company Culture & Work Environment Matching</CardTitle>
            </div>
            <CardDescription>
              Define your ideal work environment, and our AI will generate mock company profiles that could be a great cultural fit for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Accordion type="multiple" defaultValue={['item-work-style', 'item-values']} className="w-full space-y-3">
                  <AccordionItem value="item-work-style" className="border bg-card rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">Work Style Preferences</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="workLifeBalance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work-Life Balance</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="flexible">Flexible (Emphasis on results, flexible hours)</SelectItem>
                                <SelectItem value="moderate">Moderate (Some flexibility, core hours expected)</SelectItem>
                                <SelectItem value="structured">Structured (Clear 9-5, predictable schedule)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teamEnvironment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Environment</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="collaborative">Highly Collaborative (Frequent team projects)</SelectItem>
                                <SelectItem value="independent">Independent Focus (Autonomy valued)</SelectItem>
                                <SelectItem value="mixed">Mixed (Balance of solo and team work)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="innovationStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Innovation Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="experimental">Experimental (Cutting-edge, embrace failure)</SelectItem>
                                <SelectItem value="stable">Stable (Proven methods, minimize risk)</SelectItem>
                                <SelectItem value="balanced_risk">Balanced Risk (Calculated risks, innovation valued)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="pace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Pace</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="fast_dynamic">Fast & Dynamic (Agile, quick changes)</SelectItem>
                                <SelectItem value="steady_predictable">Steady & Predictable (Planned, consistent)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-company-attributes" className="border bg-card rounded-md shadow-sm">
                     <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">Company Attributes</AccordionTrigger>
                     <AccordionContent className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="companySize"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Size</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                   <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                                    <SelectItem value="mid_size">Mid-size (51-500 employees)</SelectItem>
                                    <SelectItem value="large_enterprise">Large Enterprise (500+ employees)</SelectItem>
                                    <SelectItem value="any">Any Size</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="decisionMaking"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Decision Making Style</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="top_down">Top-down (Clear direction from leadership)</SelectItem>
                                    <SelectItem value="bottom_up">Bottom-up (Employee input valued)</SelectItem>
                                    <SelectItem value="consensus_driven">Consensus-driven (Collaborative decisions)</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="feedbackCulture"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Feedback Culture</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="direct_frequent">Direct & Frequent (Regular, open feedback)</SelectItem>
                                    <SelectItem value="formal_periodic">Formal & Periodic (Scheduled reviews)</SelectItem>
                                    <SelectItem value="peer_driven">Peer-driven (Emphasis on team feedback)</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-values" className="border bg-card rounded-md shadow-sm">
                     <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">Core Values & Environment</AccordionTrigger>
                     <AccordionContent className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="learningOpportunities"
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background col-span-full md:col-span-1">
                                <div className="space-y-0.5">
                                <FormLabel>Learning Opportunities</FormLabel>
                                <FormDescription>Emphasis on continuous learning and skill development.</FormDescription>
                                </div>
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="socialImpactFocus"
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background col-span-full md:col-span-1">
                                <div className="space-y-0.5">
                                <FormLabel>Social Impact Focus</FormLabel>
                                <FormDescription>Company has a strong mission for social good.</FormDescription>
                                </div>
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="diversityAndInclusion"
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background col-span-full md:col-span-1">
                                <div className="space-y-0.5">
                                <FormLabel>Diversity & Inclusion</FormLabel>
                                <FormDescription>Strong D&I initiatives and inclusive environment.</FormDescription>
                                </div>
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                            )}
                        />
                     </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button type="submit" disabled={isLoading} className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Search className="mr-2 h-4 w-4" /> Find Matching Company Cultures
                </Button>
              </form>
            </Form>
          </CardContent>

          {isLoading && (
            <CardContent>
              <LoadingIndicator loadingText="Finding company cultures that match your preferences..." />
            </CardContent>
          )}

          {matchResults && !isLoading && matchResults.length > 0 && (
            <CardContent className="space-y-6 pt-8 border-t">
              <h2 className="text-2xl font-headline text-foreground text-center">AI-Suggested Company Cultures</h2>
              {matchResults.map((company, index) => (
                <Card key={index} className="shadow-md rounded-lg overflow-hidden">
                  <CardHeader className="bg-secondary/50">
                    <CardTitle className="text-xl text-primary">{company.companyName}</CardTitle>
                    <CardDescription>
                      {company.companyIndustry} - {company.companySizeIndicator}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground italic">{company.cultureSummary}</p>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1 flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-600"/>Key Cultural Aspects:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
                        {company.keyCulturalAspects.map((aspect, i) => <li key={i}>{aspect}</li>)}
                      </ul>
                    </div>

                    {company.potentialConsideration && (
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-1 flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-yellow-500"/>Potential Consideration:</h4>
                        <p className="text-sm text-muted-foreground">{company.potentialConsideration}</p>
                      </div>
                    )}
                     <div>
                        <h4 className="font-semibold text-sm text-foreground mb-1 flex items-center"><Sparkles className="mr-2 h-4 w-4 text-accent"/>Why it's a Match:</h4>
                        <p className="text-sm text-muted-foreground">{company.alignmentRationale}</p>
                      </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          )}
           <CardFooter className="text-center mt-4">
            <p className="text-xs text-muted-foreground mx-auto">
             Culture matches are AI-generated examples based on your preferences and are for illustrative purposes. Always research actual companies thoroughly.
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

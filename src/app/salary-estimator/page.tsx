
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, DollarSign, Lightbulb, AlertTriangle, BarChartHorizontalBig } from 'lucide-react';
import { performSalaryEstimation } from '@/app/actions';
import type { SalaryEstimatorInput, SalaryEstimatorOutput } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { LoadingIndicator } from '@/components/employmint/LoadingIndicator';
import { cn } from '@/lib/utils';

// Client-side Zod schema for form validation
const formSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters long."),
  yearsExperience: z.coerce.number().min(0, "Years of experience cannot be negative.").max(50, "Years of experience seems too high (max 50)."),
  skills: z.string()
    .min(1, "Please enter at least one skill.") // Check raw string not empty
    .transform(value => value.split(',').map(skill => skill.trim()).filter(skill => skill))
    .pipe(z.array(z.string()).min(1, "Please provide at least one valid skill. Ensure skills are separated by commas and are not just whitespace.")),
  location: z.string().optional(),
  companySize: z.enum(["startup", "mid-size", "large-enterprise", "any"]).optional(),
  industry: z.string().optional(),
});

type SalaryFormValues = z.infer<typeof formSchema>;

export default function SalaryEstimatorPage() {
  const { toast } = useToast();
  const [estimationResult, setEstimationResult] = useState<SalaryEstimatorOutput | null>(null);
  const [isLoading, startTransition] = useTransition();

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      yearsExperience: 0,
      skills: "",
      location: "",
      companySize: "any",
      industry: "",
    },
  });

  const onSubmit = (values: SalaryFormValues) => {
    if (values.skills.length === 0) {
        form.setError("skills", { type: "manual", message: "Please provide at least one valid skill after filtering." });
         toast({
            title: "Invalid Input",
            description: "Please ensure you have entered at least one valid skill.",
            variant: "destructive",
         });
        return;
    }

    setEstimationResult(null);
    startTransition(async () => {
      try {
        const inputForApi: SalaryEstimatorInput = {
          ...values, 
          companySize: values.companySize === "any" ? undefined : values.companySize,
        };
        const result = await performSalaryEstimation(inputForApi);
        setEstimationResult(result);
      } catch (error) {
        console.error("Error estimating salary:", error);
        toast({
          title: "Estimation Error",
          description: (error as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const getConfidenceColorClass = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'text-accent'; // Theme's green
      case 'medium':
        return 'text-yellow'; // Theme's yellow
      case 'low':
        return 'text-destructive'; // Theme's red
      default:
        return 'text-foreground';
    }
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

        <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
          <CardHeader>
            <div className="flex items-center mb-2">
              <DollarSign className="h-10 w-10 text-primary mr-3" />
              <CardTitle className="font-headline text-3xl text-primary">AI-Powered Salary Estimator</CardTitle>
            </div>
            <CardDescription>
              Enter job details to get an AI-driven salary estimation. More details can lead to a more accurate prediction.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Software Engineer, Product Manager" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Relevant Experience</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Skills (comma-separated)</FormLabel>
                      <FormControl><Textarea placeholder="e.g., React, Python, Project Management, SEO" {...field} /></FormControl>
                      <FormDescription>List skills most relevant to the job title.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., New York, NY or London, UK" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "any"}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="any">Any Size</SelectItem>
                            <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                            <SelectItem value="mid-size">Mid-size (51-500 employees)</SelectItem>
                            <SelectItem value="large-enterprise">Large Enterprise (500+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Technology, Healthcare, Finance" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isLoading ? 'Estimating Salary...' : 'Estimate Salary'}
                </Button>
              </CardContent>
            </form>
          </Form>

          {isLoading && (
            <CardContent><LoadingIndicator loadingText="Calculating salary estimation..." /></CardContent>
          )}

          {estimationResult && !isLoading && (
            <CardFooter className="flex-col items-start space-y-4 border-t pt-6">
              <CardTitle className="text-xl text-primary flex items-center"><BarChartHorizontalBig className="mr-2 h-6 w-6"/>Estimation Results</CardTitle>
              <Card className="w-full p-6 bg-secondary/30 shadow-inner">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Estimated Annual Salary Range</p>
                  <p className="text-3xl font-bold text-accent">
                    {estimationResult.estimatedLow.toLocaleString()} - {estimationResult.estimatedHigh.toLocaleString()} <span className="text-xl text-muted-foreground">{estimationResult.currency}</span>
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-foreground">Confidence Level:</strong> <span className={cn("font-semibold", getConfidenceColorClass(estimationResult.confidenceLevel))}>{estimationResult.confidenceLevel.charAt(0).toUpperCase() + estimationResult.confidenceLevel.slice(1)}</span></p>
                  
                  <div>
                    <strong className="text-foreground flex items-center mb-1"><Lightbulb className="mr-2 h-4 w-4 text-primary"/>Influencing Factors:</strong>
                    <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                      {estimationResult.influencingFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  {estimationResult.notes && (
                    <div>
                      <strong className="text-foreground flex items-center mb-1"><AlertTriangle className="mr-2 h-4 w-4 text-orange-500"/>Additional Notes:</strong>
                      <p className="text-muted-foreground italic">{estimationResult.notes}</p>
                    </div>
                  )}
                </div>
              </Card>
               <p className="text-xs text-muted-foreground text-center w-full pt-2">
                This is an AI-generated estimate and actual salaries can vary. Consider it as one data point in your research.
              </p>
            </CardFooter>
          )}
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

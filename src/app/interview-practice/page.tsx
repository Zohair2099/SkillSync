
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge'; // Added import
import { ArrowLeft, Mic, Brain, Sparkles, ThumbsUp, AlertTriangle, Lightbulb, Send, RotateCcw, CheckCircle } from 'lucide-react';
import { performGenerateInterviewQuestions, performEvaluateInterviewAnswer } from '@/app/actions';
import type { GenerateInterviewQuestionsOutput, EvaluateInterviewAnswerOutput } from '@/ai/flows/interview-practice-flow';
import { useToast } from "@/hooks/use-toast";
import { LoadingIndicator } from '@/components/employmint/LoadingIndicator';

type FeedbackItem = EvaluateInterviewAnswerOutput & { questionText: string, userAnswer: string };

export default function InterviewPracticePage() {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [feedbackList, setFeedbackList] = useState<Record<number, EvaluateInterviewAnswerOutput | null>>({});
  
  const [sessionPhase, setSessionPhase] = useState<'setup' | 'practicing' | 'review'>('setup');
  
  const [isGeneratingQuestions, startGeneratingQuestionsTransition] = useTransition();
  const [isEvaluatingAnswer, startEvaluatingAnswerTransition] = useTransition();

  const handleStartPractice = () => {
    if (!jobTitle.trim()) {
      toast({ title: "Job Title Required", description: "Please enter a job title to start.", variant: "destructive" });
      return;
    }
    startGeneratingQuestionsTransition(async () => {
      try {
        const result = await performGenerateInterviewQuestions({ jobTitle, numQuestions });
        if (result.questions && result.questions.length > 0) {
          setQuestions(result.questions);
          setUserAnswers({});
          setFeedbackList({});
          setCurrentQuestionIndex(0);
          setSessionPhase('practicing');
        } else {
          toast({ title: "No Questions Generated", description: "The AI couldn't generate questions for this job title. Please try another.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error generating questions:", error);
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      }
    });
  };

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleSubmitAnswer = () => {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer || !currentAnswer.trim()) {
      toast({ title: "Answer Required", description: "Please provide an answer before submitting.", variant: "destructive" });
      return;
    }
    startEvaluatingAnswerTransition(async () => {
      try {
        const result = await performEvaluateInterviewAnswer({
          jobTitle,
          question: questions[currentQuestionIndex],
          userAnswer: currentAnswer,
        });
        setFeedbackList(prev => ({ ...prev, [currentQuestionIndex]: result }));
      } catch (error) {
        console.error("Error evaluating answer:", error);
        toast({ title: "Evaluation Error", description: (error as Error).message, variant: "destructive" });
        setFeedbackList(prev => ({ ...prev, [currentQuestionIndex]: { overallFeedback: "Error evaluating answer.", strengths: [], areasForImprovement: [] } }));
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setSessionPhase('review'); // All questions answered, move to review
    }
  };
  
  const handlePreviousQuestion = () => {
     if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestartSession = () => {
    setJobTitle('');
    setQuestions([]);
    setUserAnswers({});
    setFeedbackList({});
    setCurrentQuestionIndex(0);
    setSessionPhase('setup');
  };

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const currentFeedback = feedbackList[currentQuestionIndex];

  if (sessionPhase === 'setup') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6"><Link href="/" passHref><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Button></Link></div>
          <Card className="max-w-xl mx-auto shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3"><Mic className="h-12 w-12 text-primary" /></div>
              <CardTitle className="font-headline text-3xl text-primary">AI Interview Practice</CardTitle>
              <CardDescription>Hone your interview skills. Enter a job title to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">Job Title / Role</Label>
                <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Software Engineer, Marketing Manager" />
              </div>
              <div>
                <Label htmlFor="numQuestions">Number of Questions (3-10)</Label>
                <Input id="numQuestions" type="number" value={numQuestions} onChange={(e) => setNumQuestions(Math.max(3, Math.min(10, parseInt(e.target.value) || 5)))} min="3" max="10" />
              </div>
              <Button onClick={handleStartPractice} disabled={isGeneratingQuestions} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isGeneratingQuestions ? 'Generating Questions...' : 'Start Practice Session'}
              </Button>
              {isGeneratingQuestions && <LoadingIndicator loadingText="Preparing your session..." />}
            </CardContent>
          </Card>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">© {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.</footer>
      </div>
    );
  }

  if (sessionPhase === 'practicing') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
           <div className="mb-4 flex justify-between items-center">
            <Link href="/" passHref><Button variant="outline" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Exit Practice</Button></Link>
            <Button variant="outline" size="sm" onClick={handleRestartSession}><RotateCcw className="mr-2 h-4 w-4"/> New Session</Button>
          </div>
          <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="font-headline text-xl text-primary">Practicing for: {jobTitle}</CardTitle>
                <Badge variant="secondary">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
              </div>
              <Progress value={progressPercentage} className="w-full h-2" />
              <CardDescription className="pt-4 text-lg text-foreground">{questions[currentQuestionIndex]}</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="userAnswer" className="sr-only">Your Answer</Label>
              <Textarea
                id="userAnswer"
                value={userAnswers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
                className="text-base"
                disabled={isEvaluatingAnswer || !!currentFeedback}
              />
              {!currentFeedback && !isEvaluatingAnswer && (
                <Button onClick={handleSubmitAnswer} disabled={!userAnswers[currentQuestionIndex]?.trim()} className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send className="mr-2 h-4 w-4" /> Submit Answer & Get Feedback
                </Button>
              )}
               {isEvaluatingAnswer && <LoadingIndicator loadingText="Evaluating your answer..." className="mt-4"/>}
            </CardContent>

            {currentFeedback && (
              <CardContent className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><Brain className="mr-2 h-5 w-5 text-primary"/>AI Feedback:</h3>
                <Accordion type="single" collapsible defaultValue="feedback-overall" className="w-full space-y-2">
                  <AccordionItem value="feedback-overall" className="border bg-card rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline text-foreground font-medium"><Lightbulb className="mr-2 h-4 w-4 text-primary"/>Overall Assessment</AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">{currentFeedback.overallFeedback}</AccordionContent>
                  </AccordionItem>
                  {currentFeedback.strengths && currentFeedback.strengths.length > 0 && (
                    <AccordionItem value="feedback-strengths" className="border bg-card rounded-md shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline text-foreground font-medium"><ThumbsUp className="mr-2 h-4 w-4 text-green-500"/>Strengths</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1">{currentFeedback.strengths.map((s, i) => <li key={`strength-${i}`}>{s}</li>)}</ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {currentFeedback.areasForImprovement && currentFeedback.areasForImprovement.length > 0 && (
                     <AccordionItem value="feedback-improvement" className="border bg-card rounded-md shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline text-foreground font-medium"><AlertTriangle className="mr-2 h-4 w-4 text-orange-500"/>Areas for Improvement</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1">{currentFeedback.areasForImprovement.map((a, i) => <li key={`area-${i}`}>{a}</li>)}</ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {currentFeedback.suggestedAlternative && (
                     <AccordionItem value="feedback-alternative" className="border bg-card rounded-md shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline text-foreground font-medium"><Sparkles className="mr-2 h-4 w-4 text-purple-500"/>Suggested Alternative</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">{currentFeedback.suggestedAlternative}</AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            )}
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous Question</Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion} disabled={!currentFeedback && !isEvaluatingAnswer} className="bg-primary hover:bg-primary/90 text-primary-foreground">Next Question</Button>
              ) : (
                <Button onClick={() => setSessionPhase('review')} disabled={!currentFeedback && !isEvaluatingAnswer} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" /> Finish & Review All
                </Button>
              )}
            </CardFooter>
          </Card>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">© {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.</footer>
      </div>
    );
  }

  if (sessionPhase === 'review') {
     return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
             <Link href="/" passHref><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Exit Practice</Button></Link>
             <Button variant="default" onClick={handleRestartSession} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <RotateCcw className="mr-2 h-4 w-4"/> Start New Session
             </Button>
          </div>
          <Card className="max-w-3xl mx-auto shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Interview Practice Review</CardTitle>
              <CardDescription>Review your answers and the AI's feedback for the role of: <strong>{jobTitle}</strong></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((q, index) => (
                <Card key={index} className="bg-card shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Question {index + 1}:</CardTitle>
                    <p className="text-md text-muted-foreground">{q}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-foreground mb-1">Your Answer:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-secondary/30 rounded-md">
                      {userAnswers[index] || <span className="italic">No answer provided.</span>}
                    </p>
                    {feedbackList[index] && (
                      <div className="mt-4 pt-3 border-t">
                        <h4 className="font-semibold text-primary mb-2 flex items-center"><Brain className="mr-2 h-5 w-5"/>AI Feedback:</h4>
                        <Accordion type="single" collapsible className="w-full space-y-1">
                          <AccordionItem value={`review-overall-${index}`} className="border-none">
                            <AccordionTrigger className="text-sm hover:no-underline p-2 bg-muted/50 rounded-t-md text-left">Overall Assessment</AccordionTrigger>
                            <AccordionContent className="p-2 text-xs text-muted-foreground bg-muted/20 rounded-b-md">{feedbackList[index]!.overallFeedback}</AccordionContent>
                          </AccordionItem>
                          {feedbackList[index]!.strengths.length > 0 && (
                            <AccordionItem value={`review-strengths-${index}`} className="border-none">
                              <AccordionTrigger className="text-sm hover:no-underline p-2 bg-muted/50 rounded-t-md text-left">Strengths</AccordionTrigger>
                              <AccordionContent className="p-2 text-xs text-muted-foreground bg-muted/20 rounded-b-md"><ul className="list-disc list-inside">{feedbackList[index]!.strengths.map((s, i) => <li key={`rev-s-${i}`}>{s}</li>)}</ul></AccordionContent>
                            </AccordionItem>
                          )}
                          {feedbackList[index]!.areasForImprovement.length > 0 && (
                             <AccordionItem value={`review-improve-${index}`} className="border-none">
                              <AccordionTrigger className="text-sm hover:no-underline p-2 bg-muted/50 rounded-t-md text-left">Areas for Improvement</AccordionTrigger>
                              <AccordionContent className="p-2 text-xs text-muted-foreground bg-muted/20 rounded-b-md"><ul className="list-disc list-inside">{feedbackList[index]!.areasForImprovement.map((a, i) => <li key={`rev-a-${i}`}>{a}</li>)}</ul></AccordionContent>
                            </AccordionItem>
                          )}
                          {feedbackList[index]!.suggestedAlternative && (
                            <AccordionItem value={`review-alt-${index}`} className="border-none">
                              <AccordionTrigger className="text-sm hover:no-underline p-2 bg-muted/50 rounded-t-md text-left">Suggested Alternative</AccordionTrigger>
                              <AccordionContent className="p-2 text-xs text-muted-foreground bg-muted/20 rounded-b-md">{feedbackList[index]!.suggestedAlternative}</AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">© {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.</footer>
      </div>
    );
  }
  return null; // Should not happen if sessionPhase is one of the defined states
}

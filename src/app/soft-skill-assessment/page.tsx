
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, MessageSquare, Lightbulb, CheckCircle, AlertTriangle, Info, ThumbsUp, TrendingUp, ArrowRight, ArrowLeftCircle, Brain } from 'lucide-react';
import { performSoftSkillAssessment } from '@/app/actions';
import type { SoftSkillAssessmentOutput } from '@/ai/flows/soft-skill-assessment-flow';
import { useToast } from "@/hooks/use-toast";

const softSkillQuestions = [
  { id: 'q1', text: "Describe a time you had to work with a difficult colleague or team member. How did you approach the situation and what was the outcome?" },
  { id: 'q2', text: "Tell me about a situation where you faced a significant setback or failure in a project. How did you react, and what did you learn from it?" },
  { id: 'q3', text: "Describe a complex problem you had to solve. What was your process, and what was the solution?" },
  { id: 'q4', text: "How do you typically prioritize your tasks when you have multiple competing deadlines and responsibilities?" },
  { id: 'q5', text: "Give an example of a time you had to adapt to an unexpected change in your work or a project. How did you manage it?" },
  { id: 'q6', text: "Describe a situation where you had to persuade someone (e.g., a client, a manager, a team member) to adopt your idea or point of view. What was your approach?" },
  { id: 'q7', text: "Tell me about a time you took the initiative to improve a process or suggest a new idea that benefited your team or organization." },
  { id: 'q8', text: "How do you handle constructive criticism or feedback on your work?" },
  { id: 'q9', text: "Describe your preferred method of communication within a team (e.g., email, instant messaging, face-to-face meetings) and why." },
  { id: 'q10', text: "Imagine you are leading a project and a key team member is not performing up to expectations. How would you address this?" },
  { id: 'q11', text: "How do you stay motivated and maintain a positive attitude during long or challenging projects?" },
  { id: 'q12', text: "Describe a time you had to learn a new skill or technology quickly for a job or project. How did you approach the learning process?" },
  { id: 'q13', text: "What strategies do you use to manage stress and maintain work-life balance?" },
  { id: 'q14', text: "Tell me about a time you had to make an important decision with incomplete information. What was your thought process?" },
  { id: 'q15', text: "How do you contribute to creating an inclusive and collaborative team environment?" },
];


export default function SoftSkillAssessmentPage() {
  const { toast } = useToast();
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<SoftSkillAssessmentOutput | null>(null);
  const [isLoading, startTransition] = useTransition();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < softSkillQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    const allQuestionsAnswered = softSkillQuestions.every(q => answers[q.id]?.trim());
    if (!allQuestionsAnswered && softSkillQuestions.some(q=> !answers[q.id]?.trim())) {
       const unanswered = softSkillQuestions.filter(q => !answers[q.id]?.trim());
       toast({
        title: "Incomplete Assessment",
        description: `Please answer all questions before submitting. You are missing: ${unanswered.map(u => `Q${softSkillQuestions.indexOf(u)+1}`).join(', ')}.`,
        variant: "destructive",
      });
      // Optionally, navigate to the first unanswered question
      const firstUnansweredIndex = softSkillQuestions.findIndex(q => !answers[q.id]?.trim());
      if(firstUnansweredIndex !== -1) setCurrentQuestionIndex(firstUnansweredIndex);
      return;
    }

    const formattedAnswers = softSkillQuestions.map(q => ({
      question: q.text,
      answer: answers[q.id] || "User did not provide an answer.", // Fallback, though validation should prevent this
    }));

    startTransition(async () => {
      try {
        const result = await performSoftSkillAssessment({ answers: formattedAnswers });
        setAssessmentResult(result);
      } catch (error) {
        console.error("Error performing soft skill assessment:", error);
        toast({
          title: "Assessment Error",
          description: (error as Error).message || "An unexpected error occurred while assessing your skills.",
          variant: "destructive",
        });
      }
    });
  };

  const currentQuestion = softSkillQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / softSkillQuestions.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-xl text-foreground">Analyzing your soft skills...</p>
          <p className="text-muted-foreground">This may take a few moments.</p>
        </main>
      </div>
    );
  }

  if (assessmentResult) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => { setAssessmentResult(null); setAnswers({}); setCurrentQuestionIndex(0); setAssessmentStarted(false); }}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Start / Retake
            </Button>
          </div>
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary flex items-center"><Brain className="mr-3 h-8 w-8" />Your Soft Skill Assessment Results</CardTitle>
              <CardDescription>{assessmentResult.overallSummary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground mt-4">Detailed Skill Analysis:</h3>
              <Accordion type="multiple" defaultValue={assessmentResult.skillAssessments.map(s => s.skillName)} className="w-full space-y-3">
                {assessmentResult.skillAssessments.map((skill, index) => (
                  <AccordionItem value={skill.skillName} key={index} className="border-b-0">
                    <Card className="bg-card rounded-lg shadow-sm">
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-left hover:no-underline text-foreground">
                            <Lightbulb className="mr-3 h-5 w-5 text-primary" /> {skill.skillName}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-3">
                            <p className="text-muted-foreground italic">&quot;{skill.assessment}&quot;</p>
                            {skill.strengths.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm text-accent flex items-center mb-1"><ThumbsUp className="mr-2 h-4 w-4"/>Strengths:</h4>
                                    <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground pl-4">
                                        {skill.strengths.map((strength, i) => <li key={`strength-${i}`}>{strength}</li>)}
                                    </ul>
                                </div>
                            )}
                            {skill.areasForImprovement.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm text-destructive flex items-center mb-1"><AlertTriangle className="mr-2 h-4 w-4"/>Areas for Improvement:</h4>
                                    <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground pl-4">
                                        {skill.areasForImprovement.map((area, i) => <li key={`area-${i}`}>{area}</li>)}
                                    </ul>
                                </div>
                            )}
                            {skill.developmentTips.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm text-primary flex items-center mb-1"><TrendingUp className="mr-2 h-4 w-4"/>Development Tips:</h4>
                                    <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground pl-4">
                                        {skill.developmentTips.map((tip, i) => <li key={`tip-${i}`}>{tip}</li>)}
                                    </ul>
                                </div>
                            )}
                        </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">This assessment is AI-generated based on your responses and should be used as a tool for self-reflection and development.</p>
            </CardFooter>
          </Card>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
          © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!assessmentStarted ? (
          <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                  <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl text-primary">Soft Skill Self-Assessment</CardTitle>
              <CardDescription>
                Welcome! This assessment will help you understand your soft skills.
                Answer {softSkillQuestions.length} questions thoughtfully to get personalized insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" onClick={() => setAssessmentStarted(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Assessment <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </CardContent>
             <CardFooter className="text-center">
                <p className="text-xs text-muted-foreground mx-auto">Your responses will be analyzed by AI to provide feedback.</p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                 <CardTitle className="font-headline text-2xl text-primary">Question {currentQuestionIndex + 1} of {softSkillQuestions.length}</CardTitle>
                 <Link href="/" passHref>
                    <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Exit</Button>
                 </Link>
              </div>
              <Progress value={progressPercentage} className="w-full mt-2 h-2" indicatorClassName="bg-primary"/>
              <CardDescription className="pt-4 text-lg text-foreground">{currentQuestion.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id={`answer-${currentQuestion.id}`}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Your thoughtful answer here..."
                rows={8}
                className="text-base"
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                <ArrowLeftCircle className="mr-2 h-4 w-4"/> Previous
              </Button>
              {currentQuestionIndex < softSkillQuestions.length - 1 ? (
                <Button onClick={handleNextQuestion} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Next <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              ) : (
                <Button onClick={handleSubmitAssessment} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                  Finish & Analyze
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

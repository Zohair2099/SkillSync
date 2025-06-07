
'use client';

import React from 'react';
import { Header } from '@/components/employmint/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const faqData = [
  {
    category: "Skill-Based Job Matching FAQs",
    questions: [
      {
        q: "How does the skill-based job matching work?",
        a: "You select or input your skills, and our AI compares them with job listings. The system recommends roles where your skill set closely matches the requirements, giving you a match percentage for each role."
      },
      {
        q: "Can I add or edit my skills later?",
        a: "Yes, you can update your skills anytime. Your job recommendations will adjust instantly based on your new skill set."
      },
      {
        q: "What is the match percentage and how is it calculated?",
        a: "The match percentage shows how well your current skills align with a job’s required skills. It's based on overlap, skill importance, and job type."
      }
    ]
  },
  {
    category: "Job-Focused Skill Comparison FAQs",
    questions: [
      {
        q: "How do I check if I'm qualified for a specific job?",
        a: "Search for the job title and select it. Our app compares your skills to the job requirements and shows whether you're fully qualified or what skills you're missing."
      },
      {
        q: "What happens if I don’t meet all job requirements?",
        a: "You’ll see which skills are missing, and we’ll recommend resources to help you learn those skills and become job-ready."
      }
    ]
  },
  {
    category: "Personalized Skill Development Path FAQs",
    questions: [
      {
        q: "How are the learning resources selected for me?",
        a: "Our system analyzes the skills you need and pulls relevant, high-quality courses from platforms like Coursera, Udemy, or LinkedIn Learning based on reviews, difficulty level, and relevance."
      },
      {
        q: "Are the recommended courses free?",
        a: "We include both free and paid course options. You can filter recommendations based on your budget."
      }
    ]
  },
  {
    category: "AI Resume Builder FAQs",
    questions: [
      {
        q: "How do I generate a resume using this app?",
        a: "Once you’ve entered your skills and experience, just go to the Resume Builder section. The app will auto-generate a resume tailored to your selected job types."
      },
      {
        q: "Can I download or edit the resume?",
        a: "Yes, you can download your resume in PDF format or edit sections before finalizing."
      }
    ]
  },
  {
    category: "Soft Skill Assessment FAQs",
    questions: [
      {
        q: "How are my soft skills evaluated?",
        a: "Through AI-driven quizzes, scenario-based questions, and behavioral assessments. These help determine skills like leadership, teamwork, and communication."
      },
      {
        q: "How can I improve my soft skills?",
        a: "Based on your results, we provide tips, exercises, and learning resources to strengthen specific soft skill areas."
      }
    ]
  },
  {
    category: "Real-Time Job Market Trends FAQs",
    questions: [
      {
        q: "What are job trend insights?",
        a: "These are real-time stats showing which jobs are in demand, what skills employers are searching for, and what industries are growing."
      },
      {
        q: "Can I get suggestions for trending roles I might like?",
        a: "Yes! Based on your current skills and interests, we recommend emerging job roles you could pursue with minimal upskilling."
      }
    ]
  },
  {
    category: "AI Interview Practice FAQs",
    questions: [
      {
        q: "How does AI interview practice work?",
        a: "You choose a job title, and the app asks role-specific interview questions. Your answers are analyzed for clarity, confidence, and relevance, then scored with feedback."
      },
      {
        q: "Do I need a mic or webcam for this feature?",
        a: "Voice and text options are available. For a full experience, a mic helps the AI analyze tone and fluency."
      }
    ]
  },
  {
    category: "Social Integration & Networking FAQs",
    questions: [
      {
        q: "Can I connect my LinkedIn profile to this app?",
        a: "Yes. Linking your profile helps personalize your job matches and connect you with mentors, recruiters, and professionals in your industry."
      },
      {
        q: "What is the community forum for?",
        a: "It's a space to ask career-related questions, share tips, discuss job trends, and learn from others' experiences."
      }
    ]
  },
  {
    category: "Company Culture & Environment Matching FAQs",
    questions: [
      {
        q: "How does the app match me to company culture?",
        a: "We analyze company reviews, culture descriptions, and user feedback to suggest workplaces that align with your values and work style."
      }
    ]
  },
  {
    category: "Smart Notifications & Reminders FAQs",
    questions: [
      {
        q: "Will I get alerts for new jobs?",
        a: "Yes, you’ll receive smart notifications when new jobs match your profile or when a saved job deadline is approaching."
      },
      {
        q: "Can I customize the frequency of notifications?",
        a: "Absolutely. You can set how often you want to receive updates in the notification settings."
      }
    ]
  },
  {
    category: "Job Application Tracker FAQs",
    questions: [
      {
        q: "How do I track my job applications?",
        a: "Every time you apply through our app or mark an application, it’s added to your tracker — where you can log interview dates, feedback, and reminders."
      }
    ]
  },
  {
    category: "AI-Based Salary Estimator FAQs",
    questions: [
      {
        q: "How does the salary estimator work?",
        a: "It uses your skills, experience, job role, and current market data to predict a realistic salary range for your profile."
      }
    ]
  },
  {
    category: "General FAQs",
    questions: [
      {
        q: "Is my personal data safe?",
        a: "Yes. We use end-to-end encryption and never share your data without consent. Your privacy is our top priority."
      },
      {
        q: "Is this app free to use?",
        a: "Core features are free. Some advanced features like premium resume templates or AI coaching may have a subscription or one-time fee."
      },
      {
        q: "Can I use this app without a technical background?",
        a: "Yes! The app is user-friendly and suitable for users from all industries, not just tech."
      },
      {
        q: "Can I use this on both mobile and desktop?",
        a: "Yes. Our app is available on both Android and iOS, and you can also access it through the web."
      },
      {
        q: "What if I need help or have issues?",
        a: "You can reach our support team through the Help section or email us directly. We’re here to assist you 24/7."
      }
    ]
  }
];

export default function FAQsPage() {
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
        <Card className="shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-4">
              {faqData.map((categoryItem, index) => (
                <AccordionItem value={`category-${index}`} key={categoryItem.category} className="border-b-0">
                   <Card className="bg-card rounded-lg shadow-md">
                     <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-left hover:no-underline text-foreground">
                       {categoryItem.category}
                     </AccordionTrigger>
                     <AccordionContent className="px-6 pb-4 space-y-3">
                       {categoryItem.questions.map((faq, qIndex) => (
                         <div key={qIndex} className="pt-2">
                           <p className="font-semibold text-primary-foreground bg-primary p-2 rounded-t-md">{`Q${faq.q.split(" ")[0].replace("Q","")}: ${faq.q.substring(faq.q.indexOf(" ") + 1)}`}</p>
                           <p className="text-muted-foreground p-2 bg-secondary rounded-b-md">{faq.a}</p>
                         </div>
                       ))}
                     </AccordionContent>
                   </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

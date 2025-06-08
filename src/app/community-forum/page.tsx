
'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Users, MessageSquareText, Lightbulb, Briefcase } from 'lucide-react';

interface MockPost {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
}

interface MockCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  posts: MockPost[];
}

const mockForumData: MockCategory[] = [
  {
    id: 'cat1',
    name: 'Interview Experiences & Tips',
    description: 'Share your interview stories, ask for advice, and help others prepare.',
    icon: MessageSquareText,
    posts: [
      { id: 'post1', title: "My FAANG On-Site Loop - What to Expect (Software Engineer)", author: 'UserAlex', replies: 12, lastActivity: '2h ago' },
      { id: 'post2', title: "Behavioral Questions: Best way to use STAR method?", author: 'UserSarah', replies: 7, lastActivity: '5h ago' },
    ],
  },
  {
    id: 'cat2',
    name: 'Skill Development & Learning',
    description: 'Discuss learning resources, courses, and strategies for upskilling.',
    icon: Lightbulb,
    posts: [
      { id: 'post3', title: "Best Online Courses for Advanced Python in 2024?", author: 'DevGuru', replies: 22, lastActivity: '1d ago' },
      { id: 'post4', title: "Looking for project ideas to practice DevOps skills", author: 'CloudNewbie', replies: 5, lastActivity: '3d ago' },
    ],
  },
  {
    id: 'cat3',
    name: 'Job Search Strategies',
    description: 'Networking, resume building, cover letters, and navigating the job market.',
    icon: Briefcase,
    posts: [
        { id: 'post5', title: "Effective networking strategies for introverts?", author: 'QuietAchiever', replies: 15, lastActivity: '6h ago'},
    ],
  },
];


export default function CommunityForumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/social-networking" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Social Networking
            </Button>
          </Link>
        </div>

        <Card className="max-w-3xl mx-auto shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
                <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">EmployMint Community Forum</CardTitle>
            <CardDescription className="text-lg">
              Connect with peers, share experiences, and grow your network.
            </CardDescription>
             <p className="mt-2 text-sm text-destructive font-semibold">
                This feature is currently under development. Below is a visual concept.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="p-6 border-2 border-dashed border-border rounded-lg bg-muted/30 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Forum Access - Coming Soon!</h2>
              <p className="text-muted-foreground">
                We're working hard to build a vibrant and supportive space for all EmployMint users.
                You'll soon be able to join discussions, ask career-related questions, and more.
              </p>
            </div>

            <Accordion type="multiple" className="w-full space-y-3">
              {mockForumData.map((category) => (
                <AccordionItem value={category.id} key={category.id} className="border-b-0">
                   <Card className="bg-card rounded-lg shadow">
                     <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-left hover:no-underline text-foreground">
                       <div className="flex items-center">
                         <category.icon className="mr-3 h-6 w-6 text-primary" />
                         {category.name}
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="px-6 pb-4 space-y-3">
                       <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                       {category.posts.map((post) => (
                         <div key={post.id} className="p-3 border rounded-md bg-secondary/50 hover:shadow-sm transition-shadow cursor-not-allowed opacity-70">
                           <h4 className="font-medium text-foreground">{post.title}</h4>
                           <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                             <span>by {post.author}</span>
                             <span>{post.replies} replies | Last activity: {post.lastActivity}</span>
                           </div>
                         </div>
                       ))}
                       {category.posts.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No discussions here yet (example).</p>
                       )}
                       <Button variant="outline" size="sm" className="mt-3 cursor-not-allowed" disabled>
                         View Category (Coming Soon)
                       </Button>
                     </AccordionContent>
                   </Card>
                </AccordionItem>
              ))}
            </Accordion>
            
          </CardContent>
           <CardFooter className="text-center mt-4">
            <p className="text-xs text-muted-foreground mx-auto">
              The forum interface above is a conceptual demonstration. Full functionality will be available in a future update.
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


    

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, MessageSquareText, Lightbulb, Briefcase } from 'lucide-react';

interface MockReply {
  id: string;
  author: string;
  avatarFallback: string;
  timestamp: string;
  text: string;
}

interface MockPost {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  content: string; 
  categoryName: string;
  repliesContent?: MockReply[];
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
      { 
        id: 'post1', 
        title: "My FAANG On-Site Loop - What to Expect (Software Engineer)", 
        author: 'UserAlex', 
        replies: 4, 
        lastActivity: '2h ago',
        categoryName: 'Interview Experiences & Tips',
        content: "Hey everyone,\n\nI just had my on-site loop at a major tech company (think FAANG) for a Software Engineer L4 role and wanted to share my experience to help others prepare.\n\n**Day Structure:**\n- Morning: 2 coding rounds (45 mins each). Focus was heavily on data structures (trees, graphs, hashmaps) and algorithms (dynamic programming, sorting).\n- Afternoon: 1 system design round (60 mins) - asked to design a basic URL shortener, and 1 behavioral round (45 mins) with a hiring manager focusing on leadership principles and past project experiences.\n\n**Key Takeaways:**\n- Practice LeetCode mediums/hards consistently. Don't just solve, understand the patterns.\n- Be able to articulate your thought process clearly, even if you don't arrive at the perfect solution immediately.\n- For system design, discuss trade-offs, scalability, and potential bottlenecks. Start high-level and dive deeper as requested.\n- Prepare STAR method examples for behavioral questions.\n\nOverall, it was challenging but fair. Preparation is key! Good luck to everyone else interviewing!",
        repliesContent: [
          { 
            id: 'reply1-1', 
            author: 'TechLeadTom', 
            avatarFallback: 'TT',
            timestamp: '1h 50m ago', 
            text: "Great summary, Alex! For the system design, did they ask about specific database choices or consistency models? That's where they usually dig in for L4+." 
          },
          { 
            id: 'reply1-2', 
            author: 'UserAlex', 
            avatarFallback: 'UA',
            timestamp: '1h 30m ago', 
            text: "Good question, @TechLeadTom! They didn't push too hard on a specific DB, but I discussed the pros/cons of SQL vs NoSQL for different aspects of the URL shortener (e.g., analytics vs. core mapping). I emphasized eventual consistency for analytics to keep writes fast."
          },
          { 
            id: 'reply1-3', 
            author: 'NewGradNina', 
            avatarFallback: 'NN',
            timestamp: '45m ago', 
            text: "Thanks for sharing, Alex! This is super helpful. For behavioral, any particular STAR example that seemed to resonate well?" 
          },
           { 
            id: 'reply1-4', 
            author: 'UserAlex', 
            avatarFallback: 'UA',
            timestamp: '15m ago', 
            text: "@NewGradNina, I used an example about a time I had to debug a critical production issue with limited information. Focused on my systematic approach (Task), the steps I took (Action), and how it led to a quick resolution and a post-mortem (Result). They seemed to like the emphasis on learning from it." 
          },
        ]
      },
      { 
        id: 'post2', 
        title: "Behavioral Questions: Best way to use STAR method?", 
        author: 'UserSarah', 
        replies: 2, 
        lastActivity: '5h ago',
        categoryName: 'Interview Experiences & Tips',
        content: "Hi all,\n\nI'm preparing for some upcoming interviews and keep hearing about the STAR method for behavioral questions (Situation, Task, Action, Result).\n\nDoes anyone have tips on how to effectively structure answers using this method without sounding too robotic?\n\nSpecifically, I'm wondering:\n- How much detail to go into for each part?\n- How to choose the best examples from my experience?\n- Common pitfalls to avoid?\n\nAny advice or examples would be greatly appreciated!\n\nThanks!",
        repliesContent: [
          {
            id: 'reply2-1',
            author: 'HiringManagerHR',
            avatarFallback: 'HM',
            timestamp: '4h 30m ago',
            text: "Great question, Sarah! A common pitfall is spending too much time on Situation/Task and not enough on Action/Result. Focus on *your* specific actions and quantify the results whenever possible. Avoid overly long stories."
          },
          {
            id: 'reply2-2',
            author: 'CareerCoachChris',
            avatarFallback: 'CC',
            timestamp: '3h ago',
            text: "To add to that, choose examples that highlight skills relevant to the job you're interviewing for. If it's a leadership role, pick a story where you led. If it's problem-solving, choose one showcasing that. Tailor your examples!"
          }
        ]
      },
    ],
  },
  {
    id: 'cat2',
    name: 'Skill Development & Learning',
    description: 'Discuss learning resources, courses, and strategies for upskilling.',
    icon: Lightbulb,
    posts: [
      { 
        id: 'post3', 
        title: "Best Online Courses for Advanced Python in 2024?", 
        author: 'DevGuru', 
        replies: 3, 
        lastActivity: '1d ago',
        categoryName: 'Skill Development & Learning',
        content: "Hello Pythonistas,\n\nI've been working with Python for a few years, mainly for web development with Django and some basic scripting. I'm looking to deepen my understanding of more advanced Python concepts.\n\nWhat are your recommendations for online courses or resources in 2024 that cover topics like:\n- Metaprogramming and decorators\n- Concurrency and asynchronous programming (asyncio)\n- Performance optimization and Cython\n- Advanced data structures and algorithms in Python\n- Design patterns in Python\n\nPaid or free resources are welcome. I'm looking for something comprehensive and up-to-date. Thanks in advance!",
        repliesContent: [
          {
            id: 'reply3-1',
            author: 'PythonProDev',
            avatarFallback: 'PP',
            timestamp: '20h ago',
            text: "Hey DevGuru, I recently took 'Advanced Python Mastery' on Udemy by Professor CodeAlot – it covered asyncio and metaprogramming quite well. A bit lengthy, but worth it if you have the time."
          },
          {
            id: 'reply3-2',
            author: 'DataSciQueen',
            avatarFallback: 'DQ',
            timestamp: '15h ago',
            text: "For performance, 'Fluent Python' by Luciano Ramalho is an excellent book, though not a course. Also, the official Python documentation on `asyncio` is surprisingly good for practical examples once you grasp the basics."
          },
          {
            id: 'reply3-3',
            author: 'DevGuru',
            avatarFallback: 'DG',
            timestamp: '10h ago',
            text: "Thanks @PythonProDev and @DataSciQueen! I'll check those out. 'Fluent Python' has been on my list for a while."
          }
        ]
      },
      { 
        id: 'post4', 
        title: "Looking for project ideas to practice DevOps skills", 
        author: 'CloudNewbie', 
        replies: 2, 
        lastActivity: '3d ago',
        categoryName: 'Skill Development & Learning',
        content: "Hey folks,\n\nI'm trying to transition into a DevOps role and have been learning tools like Docker, Kubernetes, Jenkins, and Terraform. I'm looking for some practical project ideas (small to medium complexity) where I can apply these skills.\n\nIdeally, something that would look good on a portfolio.\n\nSome initial thoughts I had:\n- CI/CD pipeline for a sample web application.\n- Deploying a microservices app on Kubernetes.\n- Setting up infrastructure as code with Terraform for a cloud provider.\n\nAny other suggestions or resources for finding good DevOps projects?\n\nCheers!",
        repliesContent: [
          {
            id: 'reply4-1',
            author: 'InfraWizard',
            avatarFallback: 'IW',
            timestamp: '2d 20h ago',
            text: "Consider setting up a CI/CD pipeline for a simple static site (like one built with Hugo or Jekyll) and deploying it to GitHub Pages or Netlify using GitHub Actions. It's a good starting point for understanding workflows."
          },
          {
            id: 'reply4-2',
            author: 'K8sFan',
            avatarFallback: 'KF',
            timestamp: '2d 10h ago',
            text: "If you're feeling adventurous, try deploying a multi-container application (e.g., a WordPress site with a separate MySQL container) to a local Kubernetes cluster like Minikube or Kind. Then, try to automate the deployment with Helm or Kustomize."
          }
        ]
      },
    ],
  },
  {
    id: 'cat3',
    name: 'Job Search Strategies',
    description: 'Networking, resume building, cover letters, and navigating the job market.',
    icon: Briefcase,
    posts: [
        { 
          id: 'post5', 
          title: "Effective networking strategies for introverts?", 
          author: 'QuietAchiever', 
          replies: 3, 
          lastActivity: '6h ago',
          categoryName: 'Job Search Strategies',
          content: "Hi everyone,\n\nAs an introvert, networking events and reaching out to strangers online feel incredibly daunting to me, but I know it's crucial for job searching and career growth.\n\nDoes anyone have tips or strategies for networking that are more introvert-friendly?\n\nThings I'm struggling with:\n- Initiating conversations at events.\n- Following up without feeling like I'm bothering people.\n- Building meaningful connections rather than just collecting contacts.\n\nI'd love to hear what has worked for other introverts out there. Thanks!",
          repliesContent: [
            {
              id: 'reply5-1',
              author: 'ShyConnector',
              avatarFallback: 'SC',
              timestamp: '5h ago',
              text: "I feel you! What works for me is focusing on quality over quantity. Instead of trying to talk to everyone at an event, I aim for 1-2 meaningful conversations. Also, online informational interviews (via LinkedIn DMs) are less pressure than big events."
            },
            {
              id: 'reply5-2',
              author: 'EventPro',
              avatarFallback: 'EP',
              timestamp: '4h ago',
              text: "Try attending smaller, more focused meetups or workshops related to your specific interests. The conversations tend to be more natural. And for following up, a simple 'Nice to meet you, I enjoyed our chat about X. Here's that article/link I mentioned...' works well."
            },
            {
              id: 'reply5-3',
              author: 'QuietAchiever',
              avatarFallback: 'QA',
              timestamp: '2h ago',
              text: "These are great suggestions, @ShyConnector and @EventPro! Smaller meetups sound much more manageable. Thank you!"
            }
          ]
        },
    ],
  },
];


export default function CommunityForumPage() {
  const [selectedPost, setSelectedPost] = useState<MockPost | null>(null);

  const handlePostClick = (post: MockPost) => {
    setSelectedPost(post);
  };

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
                This feature is currently under development. Below is an interactive visual concept.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
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
                         <div 
                           key={post.id} 
                           className="p-3 border rounded-md bg-secondary/50 hover:shadow-sm hover:bg-secondary/70 transition-shadow cursor-pointer"
                           onClick={() => handlePostClick(post)}
                           role="button"
                           tabIndex={0}
                           onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePostClick(post);}}
                           aria-label={`View details for post: ${post.title}`}
                          >
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

        {selectedPost && (
          <Dialog open={!!selectedPost} onOpenChange={(isOpen) => { if (!isOpen) setSelectedPost(null); }}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-primary text-xl sm:text-2xl">{selectedPost.title}</DialogTitle>
                <DialogDescription>
                  In <span className="font-medium">{selectedPost.categoryName}</span> <br />
                  Posted by: <span className="font-medium">{selectedPost.author}</span> | {selectedPost.replies} replies | Last activity: {selectedPost.lastActivity}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 overflow-y-auto flex-grow space-y-6">
                {/* Original Post */}
                <Card className="bg-card shadow-md">
                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={`https://placehold.co/40x40.png?text=${selectedPost.author.substring(0,2)}`} alt={selectedPost.author} data-ai-hint="person lettermark"/>
                                <AvatarFallback>{selectedPost.author.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-foreground">{selectedPost.author} (OP)</p>
                                <p className="text-xs text-muted-foreground">Original Post</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground whitespace-pre-line">{selectedPost.content}</p>
                    </CardContent>
                </Card>

                {/* Replies */}
                {selectedPost.repliesContent && selectedPost.repliesContent.length > 0 && (
                    <div className="space-y-4 pl-4 border-l-2 border-primary/50">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Replies:</h3>
                        {selectedPost.repliesContent.map((reply) => (
                            <Card key={reply.id} className="bg-secondary/50 shadow-sm">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                             <AvatarImage src={`https://placehold.co/32x32.png?text=${reply.avatarFallback}`} alt={reply.author} data-ai-hint="person lettermark small"/>
                                            <AvatarFallback className="text-xs">{reply.avatarFallback}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{reply.author}</p>
                                            <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground whitespace-pre-line">{reply.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                <p className="mt-6 text-xs text-destructive text-center font-semibold">
                  (This is a mock discussion content. Full forum functionality, including actual replies and interactions, is coming soon.)
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedPost(null)} variant="outline">Close</Button>
                <Button variant="default" className="cursor-not-allowed" disabled>Reply (Coming Soon)</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}



'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import { Header } from '@/components/employmint/Header';
import { SkillInput, type Skill } from '@/components/employmint/SkillInput';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud, Linkedin, Github, XCircleIcon, Globe, ArrowLeft, Trash } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/context/ProfileContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, saveProfile, loadProfile } = useProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [skills, setSkills] = useState<Skill[]>(profile.skills);
  const [profilePicture, setProfilePicture] = useState<string | null>(profile.profilePicture);
  const [linkedin, setLinkedin] = useState(profile.socialLinks.linkedin);
  const [github, setGithub] = useState(profile.socialLinks.github);
  const [twitter, setTwitter] = useState(profile.socialLinks.twitter);
  const [website, setWebsite] = useState(profile.socialLinks.website);

  const [showResetConfirmationDialog, setShowResetConfirmationDialog] = useState(false);

  const LOCAL_STORAGE_KEYS_TO_RESET = [
    'employmint-user-profile',
    'employmint-theme',
    'employmint-zoom',
    'employmint-view-mode',
    'employmint-color-palette',
    // Add any other app-specific localStorage keys here if they exist.
  ];

  useEffect(() => {
    loadProfile(); 
  }, [loadProfile]);

  useEffect(() => {
    setName(profile.name);
    setAge(profile.age);
    setSkills(profile.skills);
    setProfilePicture(profile.profilePicture);
    setLinkedin(profile.socialLinks.linkedin);
    setGithub(profile.socialLinks.github);
    setTwitter(profile.socialLinks.twitter);
    setWebsite(profile.socialLinks.website);
  }, [profile]);


  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillsChange = (newSkills: Skill[]) => {
    setSkills(newSkills);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name,
      age,
      skills,
      profilePicture,
      socialLinks: {
        linkedin,
        github,
        twitter,
        website,
      },
    });
    saveProfile(); 
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated locally.",
    });
  };

  const handleFullAppReset = () => {
    if (typeof window !== 'undefined') {
      LOCAL_STORAGE_KEYS_TO_RESET.forEach(key => {
        localStorage.removeItem(key);
      });
      toast({
        title: "App Data Reset",
        description: "All application data has been cleared. The app will now reload.",
        variant: "destructive"
      });
      setShowResetConfirmationDialog(false); 
      setTimeout(() => {
        window.location.reload();
      }, 700); 
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">Your Profile</CardTitle>
            <CardDescription>Manage your personal information, skills, and connections. This data is saved locally in your browser.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 ring-4 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={profilePicture || undefined} alt={name || "User"} data-ai-hint="person avatar" />
                <AvatarFallback className="text-4xl">{name ? name.substring(0, 2).toUpperCase() : <UploadCloud className="h-12 w-12"/>}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Change Picture
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="userName" className="text-lg font-semibold">Name</Label>
                <Input id="userName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Full Name" className="mt-1 text-base" />
              </div>
              <div>
                <Label htmlFor="userAge" className="text-lg font-semibold">Age</Label>
                <Input id="userAge" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your Age" className="mt-1 text-base" />
              </div>
            </div>
            
            <SkillInput skills={skills} onSkillsChange={handleSkillsChange} />

            <div>
              <h3 className="text-lg font-semibold mb-3 font-headline text-foreground">Social Links (Optional)</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Linkedin className="h-6 w-6 text-blue-700" />
                  <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn Profile URL" className="text-base"/>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                  <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub Profile URL" className="text-base"/>
                </div>
                <div className="flex items-center gap-3">
                  <XCircleIcon className="h-6 w-6 text-sky-500" /> 
                  <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="X.com (Twitter) Profile URL" className="text-base"/>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-green-600" />
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Personal Website/Portfolio URL" className="text-base"/>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <h3 className="text-xl font-semibold text-destructive mb-3">Danger Zone</h3>
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center"><Trash className="mr-2 h-5 w-5" />Reset Application Data</CardTitle>
                  <CardDescription className="text-destructive/80">
                    This will clear all your profile information, skills, appearance settings, and any other data stored by EmployMint in this browser. This action cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setShowResetConfirmationDialog(true)}
                  >
                     Reset All App Data
                  </Button>
                </CardContent>
              </Card>
            </div>

          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"> 
            <Link href="/" passHref className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back to Home
              </Button>
            </Link>
            <Button onClick={handleSaveProfile} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Profile
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={showResetConfirmationDialog} onOpenChange={setShowResetConfirmationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive flex items-center">
                <Trash className="mr-2 h-5 w-5"/>FINAL WARNING: Confirm Reset
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>You are about to permanently erase ALL EmployMint application data from this browser. This includes:</p>
                <ul className="list-disc list-inside pl-4 text-sm">
                    <li>Your profile information (name, age, picture)</li>
                    <li>All added skills and their experience levels</li>
                    <li>All social media links</li>
                    <li>Custom appearance settings (theme, zoom, color palette)</li>
                    <li>Any saved job matches or analysis results (if applicable in future)</li>
                    <li>Any resume data you've entered</li>
                </ul>
                <p className="font-semibold">This action CANNOT BE UNDONE. The application will reload after the reset.</p>
                <p>Are you absolutely sure you want to proceed?</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowResetConfirmationDialog(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFullAppReset}
                className={buttonVariants({ variant: "destructive" })}
              >
                Yes, Delete All My Data & Reset App
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} EmployMint. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

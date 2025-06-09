
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/employmint/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Trash2, PlusCircle, Eye, Palette } from 'lucide-react';
import { ResumeDataProvider, useResumeData } from '@/context/ResumeDataContext';
import type { ResumeLayoutType, ResumeWorkExperience, ResumeEducation, ResumeSkill, ResumeProject, ResumeCertification } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/context/ProfileContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PersonalDetailsForm = () => {
  const { resumeData, updatePersonalDetails } = useResumeData();
  const { profile } = useProfile();

  useEffect(() => {
    const fieldsToUpdate: Partial<typeof resumeData.personalDetails> = {};
    if (!resumeData.personalDetails.fullName && profile.name) fieldsToUpdate.fullName = profile.name;
    // @ts-ignore - profile does not have email
    if (!resumeData.personalDetails.email && profile.email) fieldsToUpdate.email = profile.email; 
    if (!resumeData.personalDetails.linkedin && profile.socialLinks.linkedin) fieldsToUpdate.linkedin = profile.socialLinks.linkedin;
    if (!resumeData.personalDetails.github && profile.socialLinks.github) fieldsToUpdate.github = profile.socialLinks.github;
    if (!resumeData.personalDetails.portfolio && profile.socialLinks.website) fieldsToUpdate.portfolio = profile.socialLinks.website;
    
    if (Object.keys(fieldsToUpdate).length > 0) {
      updatePersonalDetails(fieldsToUpdate);
    }
  }, [profile, resumeData.personalDetails, updatePersonalDetails]);

  return (
    <Card className="bg-card border-none shadow-none">
      <CardContent className="space-y-4 pt-6">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={resumeData.personalDetails.fullName} onChange={(e) => updatePersonalDetails({ fullName: e.target.value })} placeholder="e.g., Jane Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={resumeData.personalDetails.email} onChange={(e) => updatePersonalDetails({ email: e.target.value })} placeholder="e.g., jane.doe@example.com" />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" value={resumeData.personalDetails.phoneNumber} onChange={(e) => updatePersonalDetails({ phoneNumber: e.target.value })} placeholder="e.g., (123) 456-7890" />
        </div>
        <div>
          <Label htmlFor="address">Address (Optional)</Label>
          <Input id="address" value={resumeData.personalDetails.address} onChange={(e) => updatePersonalDetails({ address: e.target.value })} placeholder="e.g., 123 Main St, Anytown, USA" />
        </div>
         <div>
          <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
          <Input id="linkedin" value={resumeData.personalDetails.linkedin} onChange={(e) => updatePersonalDetails({ linkedin: e.target.value })} placeholder="Your LinkedIn URL" />
        </div>
        <div>
          <Label htmlFor="github">GitHub Profile (Optional)</Label>
          <Input id="github" value={resumeData.personalDetails.github} onChange={(e) => updatePersonalDetails({ github: e.target.value })} placeholder="Your GitHub URL" />
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
          <Input id="portfolio" value={resumeData.personalDetails.portfolio} onChange={(e) => updatePersonalDetails({ portfolio: e.target.value })} placeholder="Your Portfolio URL" />
        </div>
        <div>
          <Label htmlFor="summary">Professional Summary/Objective</Label>
          <Textarea id="summary" value={resumeData.personalDetails.summary} onChange={(e) => updatePersonalDetails({ summary: e.target.value })} placeholder="Briefly introduce yourself and your career goals (2-4 sentences)" rows={4}/>
        </div>
      </CardContent>
    </Card>
  );
};

const WorkExperienceForm = () => {
  const { resumeData, addWorkExperience, updateWorkExperience, removeWorkExperience, updateWorkExperienceResponsibility, addWorkExperienceResponsibility, removeWorkExperienceResponsibility } = useResumeData();

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
        {resumeData.workExperience.map((exp, index) => (
          <Card key={exp.id} className="p-4 bg-secondary/30 relative">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => removeWorkExperience(exp.id)}
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 z-10"
                aria-label="Remove work experience"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            <div className="space-y-4">
              <div>
                <Label htmlFor={`jobTitle-${exp.id}`}>Job Title</Label>
                <Input id={`jobTitle-${exp.id}`} value={exp.jobTitle} onChange={(e) => updateWorkExperience(index, { jobTitle: e.target.value })} />
              </div>
              <div>
                <Label htmlFor={`companyName-${exp.id}`}>Company Name</Label>
                <Input id={`companyName-${exp.id}`} value={exp.companyName} onChange={(e) => updateWorkExperience(index, { companyName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor={`location-${exp.id}`}>Location</Label>
                <Input id={`location-${exp.id}`} value={exp.location} onChange={(e) => updateWorkExperience(index, { location: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                  <Input id={`startDate-${exp.id}`} type="month" value={exp.startDate} onChange={(e) => updateWorkExperience(index, { startDate: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor={`endDate-${exp.id}`}>End Date (YYYY-MM or 'Present')</Label>
                  <Input id={`endDate-${exp.id}`} type="text" value={exp.endDate} onChange={(e) => updateWorkExperience(index, { endDate: e.target.value })} placeholder="YYYY-MM or Present"/>
                </div>
              </div>
              <div>
                <Label>Responsibilities/Achievements (one per line)</Label>
                {exp.responsibilities.map((resp, respIndex) => (
                  <div key={respIndex} className="flex items-center gap-2 mt-1">
                    <Textarea value={resp} onChange={(e) => updateWorkExperienceResponsibility(exp.id, respIndex, e.target.value)} placeholder={`Responsibility ${respIndex + 1}`} rows={1}/>
                    {exp.responsibilities.length > 1 && (
                       <Button variant="ghost" size="icon" onClick={() => removeWorkExperienceResponsibility(exp.id, respIndex)} aria-label="Remove responsibility">
                         <Trash2 className="h-4 w-4 text-destructive" />
                       </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addWorkExperienceResponsibility(exp.id)} className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4"/> Add Responsibility
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <Button onClick={addWorkExperience} variant="secondary" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4"/> Add Work Experience
        </Button>
      </CardContent>
    </Card>
  );
};

const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeData();
   return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
         {resumeData.education.map((edu, index) => (
          <Card key={edu.id} className="p-4 bg-secondary/30 relative">
             <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 z-10" aria-label="Remove education entry">
                <Trash2 className="h-4 w-4" />
            </Button>
            <div className="space-y-4">
              <div><Label htmlFor={`degree-${edu.id}`}>Degree/Certificate</Label><Input id={`degree-${edu.id}`} value={edu.degree} onChange={(e) => updateEducation(index, { degree: e.target.value })} /></div>
              <div><Label htmlFor={`institution-${edu.id}`}>Institution</Label><Input id={`institution-${edu.id}`} value={edu.institution} onChange={(e) => updateEducation(index, { institution: e.target.value })} /></div>
              <div><Label htmlFor={`eduLocation-${edu.id}`}>Location</Label><Input id={`eduLocation-${edu.id}`} value={edu.location} onChange={(e) => updateEducation(index, { location: e.target.value })} /></div>
              <div><Label htmlFor={`gradDate-${edu.id}`}>Graduation Date (YYYY-MM or Expected)</Label><Input id={`gradDate-${edu.id}`} type="text" value={edu.graduationDate} onChange={(e) => updateEducation(index, { graduationDate: e.target.value })} placeholder="YYYY-MM or Expected YYYY-MM"/></div>
              <div><Label htmlFor={`eduDetails-${edu.id}`}>Details (e.g., GPA, Honors, Relevant Coursework)</Label><Textarea id={`eduDetails-${edu.id}`} value={edu.details} onChange={(e) => updateEducation(index, { details: e.target.value })} rows={2}/></div>
            </div>
          </Card>
         ))}
        <Button onClick={addEducation} variant="secondary" className="w-full"><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
      </CardContent>
    </Card>
  );
};

const SkillsForm = () => {
  const { resumeData, addSkill, removeSkill, setResumeData } = useResumeData(); 
  const { profile } = useProfile();

  useEffect(() => {
    if (resumeData.skills.length === 0 && profile.skills.length > 0) {
      const profileSkillsToResumeSkills: ResumeSkill[] = profile.skills.map(s => ({
        id: s.name, 
        name: s.name,
      }));
      profileSkillsToResumeSkills.forEach(ps => {
        if(!resumeData.skills.find(rs => rs.name === ps.name)) {
           addSkill({name: ps.name});
        }
      });
    }
  }, [profile.skills, resumeData.skills, addSkill]);


  const [newSkillName, setNewSkillName] = useState('');
  const handleAddNewSkill = () => {
    if (newSkillName.trim() && !resumeData.skills.find(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      addSkill({ name: newSkillName.trim() });
      setNewSkillName('');
    }
  };

   return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="flex gap-2 mb-4">
          <Input value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Enter a skill" />
          <Button onClick={handleAddNewSkill}><PlusCircle className="mr-2 h-4 w-4"/>Add Skill</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map(skill => (
            <Badge key={skill.id} variant="secondary" className="py-1.5 px-3 text-sm items-center group">
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="ml-2 rounded-full hover:bg-destructive/20 p-0.5"
                aria-label={`Remove ${skill.name}`}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive group-hover:text-destructive-foreground" />
              </button>
            </Badge>
          ))}
        </div>
        {profile.skills.length > 0 && (
        <CardDescription className="text-xs mt-3">
            Skills are initially populated from your profile. You can customize them here for this resume.
        </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectsForm = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResumeData();
  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
        {resumeData.projects.map((proj, index) => (
          <Card key={proj.id} className="p-4 bg-secondary/30 relative">
            <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 z-10"><Trash2 className="h-4 w-4" /></Button>
            <div className="space-y-4">
              <div><Label htmlFor={`projName-${proj.id}`}>Project Name</Label><Input id={`projName-${proj.id}`} value={proj.name} onChange={(e) => updateProject(index, { name: e.target.value })} /></div>
              <div><Label htmlFor={`projDesc-${proj.id}`}>Description</Label><Textarea id={`projDesc-${proj.id}`} value={proj.description} onChange={(e) => updateProject(index, { description: e.target.value })} rows={3}/></div>
              <div><Label htmlFor={`projTech-${proj.id}`}>Technologies (comma-separated)</Label><Input id={`projTech-${proj.id}`} value={proj.technologies.join(', ')} onChange={(e) => updateProject(index, { technologies: e.target.value.split(',').map(t => t.trim()) })} /></div>
              <div><Label htmlFor={`projLink-${proj.id}`}>Project Link (Optional)</Label><Input id={`projLink-${proj.id}`} value={proj.link} onChange={(e) => updateProject(index, { link: e.target.value })} /></div>
            </div>
          </Card>
        ))}
        <Button onClick={addProject} variant="secondary" className="w-full"><PlusCircle className="mr-2 h-4 w-4"/>Add Project</Button>
      </CardContent>
    </Card>
  );
};

const CertificationsForm = () => {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResumeData();
  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
        {resumeData.certifications.map((cert, index) => (
          <Card key={cert.id} className="p-4 bg-secondary/30 relative">
            <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)} className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 z-10"><Trash2 className="h-4 w-4" /></Button>
            <div className="space-y-4">
              <div><Label htmlFor={`certName-${cert.id}`}>Certification Name</Label><Input id={`certName-${cert.id}`} value={cert.name} onChange={(e) => updateCertification(index, { name: e.target.value })} /></div>
              <div><Label htmlFor={`certOrg-${cert.id}`}>Issuing Organization</Label><Input id={`certOrg-${cert.id}`} value={cert.issuingOrganization} onChange={(e) => updateCertification(index, { issuingOrganization: e.target.value })} /></div>
              <div><Label htmlFor={`certDate-${cert.id}`}>Date Earned (YYYY-MM)</Label><Input id={`certDate-${cert.id}`} type="month" value={cert.dateEarned} onChange={(e) => updateCertification(index, { dateEarned: e.target.value })} /></div>
              <div><Label htmlFor={`certId-${cert.id}`}>Credential ID (Optional)</Label><Input id={`certId-${cert.id}`} value={cert.credentialId} onChange={(e) => updateCertification(index, { credentialId: e.target.value })} /></div>
            </div>
          </Card>
        ))}
        <Button onClick={addCertification} variant="secondary" className="w-full"><PlusCircle className="mr-2 h-4 w-4"/>Add Certification</Button>
      </CardContent>
    </Card>
  );
};


const LayoutSelectorAndPreview = () => {
  const { resumeData, selectedLayout, setSelectedLayout } = useResumeData();
  const layouts: { type: ResumeLayoutType; name: string; imageUrl: string; aiHint: string }[] = [
    { type: 'classic', name: 'Classic Professional', imageUrl: 'https://placehold.co/210x297.png', aiHint: 'resume classic' },
    { type: 'modern', name: 'Modern Minimalist', imageUrl: 'https://placehold.co/210x297.png', aiHint: 'resume modern' },
    { type: 'compact', name: 'Compact Two-Column', imageUrl: 'https://placehold.co/210x297.png', aiHint: 'resume compact' },
  ];

  const renderPreview = () => {
    return (
      <div id="resume-preview-content" className="border p-6 h-[600px] overflow-y-auto bg-white text-gray-900 font-sans text-xs print:h-auto print:overflow-visible print:border-none print:p-0 print:text-[10pt]">
        <style jsx global>{`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin:0; padding:0; background-color: white !important; color: black !important; }
            .resume-preview-container { margin: 0; padding: 20px; border: none; box-shadow: none; background-color: white !important; color: black !important; }
            .no-print { display: none !important; }
            /* Add more print-specific styles based on layout */
            h1, h2, h3, p, li, a, span { color: black !important; }
            .text-gray-800 { color: #2d3748 !important; }
            .text-gray-700 { color: #4a5568 !important; }
            .text-gray-600 { color: #718096 !important; }
            .text-gray-500 { color: #a0aec0 !important; }
            .border-gray-400 { border-color: #cbd5e0 !important; }
            .text-blue-600 { color: #3182ce !important; }
          }
        `}</style>
        <div className="resume-preview-container">
          <header className="text-center mb-4 print:mb-2">
            <h1 className="text-2xl font-bold text-gray-800 print:text-xl">{resumeData.personalDetails.fullName || "YOUR NAME"}</h1>
            <p className="text-xs text-gray-600 print:text-[8pt]">
              {resumeData.personalDetails.email}
              {resumeData.personalDetails.phoneNumber && ` | ${resumeData.personalDetails.phoneNumber}`}
              {resumeData.personalDetails.address && ` | ${resumeData.personalDetails.address}`}
            </p>
            <p className="text-xs text-gray-600 print:text-[8pt]">
              {resumeData.personalDetails.linkedin && <a href={resumeData.personalDetails.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>}
              {resumeData.personalDetails.github && ` | <a href={resumeData.personalDetails.github} className="text-blue-600 hover:underline">GitHub</a>`}
              {resumeData.personalDetails.portfolio && ` | <a href={resumeData.personalDetails.portfolio} className="text-blue-600 hover:underline">Portfolio</a>`}
            </p>
          </header>

          {resumeData.personalDetails.summary && (
            <section className="mb-3 print:mb-1.5">
              <h2 className="text-sm font-bold border-b border-gray-400 pb-0.5 mb-1 text-gray-700 print:text-[10pt]">SUMMARY</h2>
              <p className="text-xs text-gray-700 print:text-[8pt]">{resumeData.personalDetails.summary}</p>
            </section>
          )}

          {resumeData.workExperience.length > 0 && (
            <section className="mb-3 print:mb-1.5">
              <h2 className="text-sm font-bold border-b border-gray-400 pb-0.5 mb-1 text-gray-700 print:text-[10pt]">WORK EXPERIENCE</h2>
              {resumeData.workExperience.map(exp => (
                <div key={exp.id} className="mb-2 print:mb-1">
                  <h3 className="text-xs font-semibold text-gray-700 print:text-[9pt]">{exp.jobTitle}</h3>
                  <p className="text-xs text-gray-600 print:text-[8pt]">{exp.companyName} | {exp.location}</p>
                  <p className="text-xs text-gray-500 print:text-[7pt]">{exp.startDate} - {exp.endDate}</p>
                  <ul className="list-disc list-inside text-xs text-gray-700 pl-3 print:text-[8pt] print:pl-2">
                    {exp.responsibilities.map((r, i) => r.trim() && <li key={i} className="mt-0.5">{r}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {resumeData.education.length > 0 && (
             <section className="mb-3 print:mb-1.5">
              <h2 className="text-sm font-bold border-b border-gray-400 pb-0.5 mb-1 text-gray-700 print:text-[10pt]">EDUCATION</h2>
              {resumeData.education.map(edu => (
                <div key={edu.id} className="mb-2 print:mb-1">
                  <h3 className="text-xs font-semibold text-gray-700 print:text-[9pt]">{edu.degree}</h3>
                  <p className="text-xs text-gray-600 print:text-[8pt]">{edu.institution} | {edu.location}</p>
                  <p className="text-xs text-gray-500 print:text-[7pt]">{edu.graduationDate}</p>
                  {edu.details && <p className="text-xs text-gray-700 print:text-[8pt]">{edu.details}</p>}
                </div>
              ))}
            </section>
          )}
          
          {resumeData.skills.length > 0 && (
            <section className="mb-3 print:mb-1.5">
                <h2 className="text-sm font-bold border-b border-gray-400 pb-0.5 mb-1 text-gray-700 print:text-[10pt]">SKILLS</h2>
                <p className="text-xs text-gray-700 print:text-[8pt]">
                    {resumeData.skills.map(skill => skill.name).join(' | ')}
                </p>
            </section>
          )}
          
          {resumeData.projects.length > 0 && (
             <section className="mb-3 print:mb-1.5">
                <h2 className="text-sm font-bold border-b border-gray-400 pb-0.5 mb-1 text-gray-700 print:text-[10pt]">PROJECTS</h2>
                 {resumeData.projects.map(proj => (
                    <div key={proj.id} className="mb-2 print:mb-1">
                        <h3 className="text-xs font-semibold text-gray-700 print:text-[9pt]">{proj.name} {proj.link && <a href={proj.link} className="text-blue-600 hover:underline print:text-blue-700">(Link)</a>}</h3>
                        <p className="text-xs text-gray-700 print:text-[8pt]">{proj.description}</p>
                        {proj.technologies.length > 0 && <p className="text-xs text-gray-600 print:text-[7pt]">Technologies: {proj.technologies.join(', ')}</p>}
                    </div>
                 ))}
            </section>
          )}

          {resumeData.certifications.length > 0 && (
            <section className="mb-3 print:mb-1.5">
                <h2 className="text-sm font-bold border-b border-gray-400 pb-0.5 mb-1 text-gray-700 print:text-[10pt]">CERTIFICATIONS</h2>
                 {resumeData.certifications.map(cert => (
                    <div key={cert.id} className="mb-1 print:mb-0.5">
                        <p className="text-xs text-gray-700 print:text-[8pt]">
                            <span className="font-medium">{cert.name}</span> - {cert.issuingOrganization} ({cert.dateEarned})
                            {cert.credentialId && <span className="text-gray-500 print:text-[7pt]"> (ID: {cert.credentialId})</span>}
                        </p>
                    </div>
                 ))}
            </section>
          )}
        </div>
        <p className="text-center mt-4 text-gray-500 text-xs no-print">(Basic Preview for {selectedLayout} layout. Print to PDF for a better view.)</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/>Choose Your Layout & Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {layouts.map(layout => (
            <Card
              key={layout.type}
              onClick={() => setSelectedLayout(layout.type)}
              className={`cursor-pointer transition-all p-2 ${selectedLayout === layout.type ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md bg-muted/30'}`}
            >
              <div className="relative w-full aspect-[210/297] overflow-hidden rounded">
                <Image src={layout.imageUrl} alt={layout.name} layout="fill" objectFit="contain" className="rounded" data-ai-hint={layout.aiHint}/>
              </div>
              <CardFooter className="p-2 pt-3 border-t mt-2">
                <p className="text-sm font-medium text-center w-full">{layout.name}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center"><Eye className="mr-2 h-5 w-5 text-primary"/>Live Preview (Basic)</h3>
          {renderPreview()}
        </div>
      </CardContent>
    </Card>
  );
}


function ResumeBuilderPageContent() {
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    const input = document.getElementById('resume-preview-content');
    if (!input) {
      toast({
        title: "Error Downloading PDF",
        description: "Could not find the resume content to download.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure background color of the preview is white for html2canvas
      input.style.backgroundColor = 'white';
      const canvas = await html2canvas(input, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // If using external images
        backgroundColor: '#ffffff', // Explicitly set background for canvas
      });
      input.style.backgroundColor = ''; // Reset background color

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4', // Standard A4 size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // The canvas from html2canvas might have different dimensions than the PDF page
      // We want to scale the image to fit the A4 page, maintaining aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const newImgWidth = imgWidth * ratio;
      const newImgHeight = imgHeight * ratio;

      // Center the image on the PDF page (optional, can adjust x, y for margins)
      const x = (pdfWidth - newImgWidth) / 2;
      const y = (pdfHeight - newImgHeight) / 2; // Centering vertically too
      // Or const y = 0; for top alignment

      pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
      pdf.save('resume.pdf');

      toast({
        title: "Resume Downloaded",
        description: "Your resume has been downloaded as resume.pdf.",
      });

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Downloading PDF",
        description: "An unexpected error occurred while generating the PDF.",
        variant: "destructive",
      });
    }
  };

  const defaultAccordionItems = ["item-personal", "item-experience", "item-education", "item-skills"];


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 no-print">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl rounded-xl">
          <CardHeader className="no-print">
            <CardTitle className="font-headline text-3xl text-primary">Resume Builder</CardTitle>
            <CardDescription>
              Fill in your details, choose a layout, and download your professional resume.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="no-print">
              <Accordion type="multiple" defaultValue={defaultAccordionItems} className="w-full space-y-4">
                <AccordionItem value="item-personal">
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted p-4 rounded-md">Personal Details</AccordionTrigger>
                  <AccordionContent className="p-0 pt-2"><PersonalDetailsForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-experience">
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted p-4 rounded-md">Work Experience</AccordionTrigger>
                  <AccordionContent className="p-0 pt-2"><WorkExperienceForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-education">
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted p-4 rounded-md">Education</AccordionTrigger>
                  <AccordionContent className="p-0 pt-2"><EducationForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-skills">
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted p-4 rounded-md">Skills</AccordionTrigger>
                  <AccordionContent className="p-0 pt-2"><SkillsForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-projects">
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted p-4 rounded-md">Projects</AccordionTrigger>
                  <AccordionContent className="p-0 pt-2"><ProjectsForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-certifications">
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted p-4 rounded-md">Certifications</AccordionTrigger>
                  <AccordionContent className="p-0 pt-2"><CertificationsForm /></AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <LayoutSelectorAndPreview />
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end no-print">
            <Button onClick={handleDownloadPdf} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="mr-2 h-5 w-5" /> Download as PDF
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border no-print">
        © {new Date().getFullYear()} SkillSync. AI-Powered Career Advancement.
      </footer>
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <ResumeDataProvider>
      <ResumeBuilderPageContent />
    </ResumeDataProvider>
  );
}


export interface ResumePersonalDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string; 
}

export interface ResumeWorkExperience {
  id: string; 
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string; 
  responsibilities: string[]; 
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  details: string; 
}

export interface ResumeSkill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; 
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  dateEarned: string;
  credentialId?: string;
}

export interface ResumeData {
  personalDetails: ResumePersonalDetails;
  workExperience: ResumeWorkExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
}

export type ResumeLayoutType = 'classic' | 'modern' | 'compact';


'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { ResumeData, ResumePersonalDetails, ResumeWorkExperience, ResumeEducation, ResumeSkill, ResumeProject, ResumeCertification, ResumeLayoutType } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

const defaultResumeData: ResumeData = {
  personalDetails: {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

interface ResumeDataContextType {
  resumeData: ResumeData;
  updatePersonalDetails: (details: Partial<ResumePersonalDetails>) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (index: number, experience: Partial<ResumeWorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (index: number, edu: Partial<ResumeEducation>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<ResumeSkill, 'id'>) => void;
  updateSkill: (id: string, skillUpdate: Partial<ResumeSkill>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (index: number, project: Partial<ResumeProject>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (index: number, certification: Partial<ResumeCertification>) => void;
  removeCertification: (id: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  selectedLayout: ResumeLayoutType;
  setSelectedLayout: React.Dispatch<React.SetStateAction<ResumeLayoutType>>;
  updateWorkExperienceResponsibility: (expId: string, respIndex: number, value: string) => void;
  addWorkExperienceResponsibility: (expId: string) => void;
  removeWorkExperienceResponsibility: (expId: string, respIndex: number) => void;
}

const ResumeDataContext = createContext<ResumeDataContextType | undefined>(undefined);

export const ResumeDataProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedLayout, setSelectedLayout] = useState<ResumeLayoutType>('classic');

  const updatePersonalDetails = useCallback((details: Partial<ResumePersonalDetails>) => {
    setResumeData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...details },
    }));
  }, []);

  const addWorkExperience = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: uuidv4(),
          jobTitle: '',
          companyName: '',
          location: '',
          startDate: '',
          endDate: '',
          responsibilities: [''],
        },
      ],
    }));
  }, []);

  const updateWorkExperience = useCallback((index: number, experience: Partial<ResumeWorkExperience>) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((item, i) =>
        i === index ? { ...item, ...experience } : item
      ),
    }));
  }, []);
  
  const removeWorkExperience = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id),
    }));
  }, []);

  const updateWorkExperienceResponsibility = useCallback((expId: string, respIndex: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => {
        if (exp.id === expId) {
          const newResponsibilities = [...exp.responsibilities];
          newResponsibilities[respIndex] = value;
          return { ...exp, responsibilities: newResponsibilities };
        }
        return exp;
      }),
    }));
  }, []);

  const addWorkExperienceResponsibility = useCallback((expId: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, responsibilities: [...exp.responsibilities, ''] };
        }
        return exp;
      }),
    }));
  }, []);

  const removeWorkExperienceResponsibility = useCallback((expId: string, respIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, responsibilities: exp.responsibilities.filter((_, i) => i !== respIndex) };
        }
        return exp;
      }),
    }));
  }, []);

  const addEducation = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: uuidv4(),
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          details: '',
        },
      ],
    }));
  }, []);

  const updateEducation = useCallback((index: number, edu: Partial<ResumeEducation>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, ...edu } : item
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  }, []);

  const addSkill = useCallback((skill: Omit<ResumeSkill, 'id'>) => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: uuidv4() }]
    }));
  }, []);

  const updateSkill = useCallback((id: string, skillUpdate: Partial<ResumeSkill>) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...skillUpdate } : s)
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  }, []);

  const addProject = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: uuidv4(), name: '', description: '', technologies: [], link: '' }]
    }));
  }, []);

  const updateProject = useCallback((index: number, project: Partial<ResumeProject>) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((p, i) => i === index ? { ...p, ...project } : p)
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  }, []);
  
  const addCertification = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: uuidv4(), name: '', issuingOrganization: '', dateEarned: '' }]
    }));
  }, []);

  const updateCertification = useCallback((index: number, certification: Partial<ResumeCertification>) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map((c, i) => i === index ? { ...c, ...certification } : c)
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  }, []);


  return (
    <ResumeDataContext.Provider
      value={{
        resumeData,
        updatePersonalDetails,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        updateCertification,
        removeCertification,
        setResumeData,
        selectedLayout,
        setSelectedLayout,
        updateWorkExperienceResponsibility,
        addWorkExperienceResponsibility,
        removeWorkExperienceResponsibility,
      }}
    >
      {children}
    </ResumeDataContext.Provider>
  );
};

export const useResumeData = () => {
  const context = useContext(ResumeDataContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeDataProvider');
  }
  return context;
};

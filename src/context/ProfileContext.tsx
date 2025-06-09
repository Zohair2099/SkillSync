
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { Skill } from '@/components/employmint/SkillInput';

const LOCAL_STORAGE_PROFILE_KEY = 'skillsync-user-profile';

interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
}

interface UserProfile {
  name: string;
  age: string;
  skills: Skill[];
  profilePicture: string | null; // Store as base64 data URL
  socialLinks: SocialLinks;
}

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  skills: [],
  profilePicture: null,
  socialLinks: {
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
  },
};

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (newProfileData: Partial<UserProfile>) => void;
  saveProfile: () => void;
  loadProfile: () => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (skillName: string) => void;
  updateSkillExperience: (skillName: string, experience: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const loadProfile = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          // Basic validation or migration could happen here
          setProfile(parsedProfile);
        } catch (error) {
          console.error("Failed to parse profile from localStorage", error);
          localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY); // Clear corrupted data
          setProfile(defaultProfile);
        }
      } else {
        setProfile(defaultProfile);
      }
    }
  }, []);
  
  const saveProfile = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Load profile on initial mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);


  const updateProfile = useCallback((newProfileData: Partial<UserProfile>) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      ...newProfileData,
      socialLinks: { // Ensure socialLinks is always an object
        ...prevProfile.socialLinks,
        ...newProfileData.socialLinks,
      }
    }));
  }, []);

  const addSkill = useCallback((skill: Skill) => {
    setProfile(prevProfile => {
      if (!prevProfile.skills.find(s => s.name.toLowerCase() === skill.name.toLowerCase())) {
        return { ...prevProfile, skills: [...prevProfile.skills, skill] };
      }
      return prevProfile;
    });
  }, []);

  const removeSkill = useCallback((skillName: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      skills: prevProfile.skills.filter(s => s.name !== skillName),
    }));
  }, []);

  const updateSkillExperience = useCallback((skillName: string, experience: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      skills: prevProfile.skills.map(s =>
        s.name === skillName ? { ...s, experience } : s
      ),
    }));
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, loadProfile, addSkill, removeSkill, updateSkillExperience }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

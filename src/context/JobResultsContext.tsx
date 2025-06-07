
'use client';

import type { SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type JobMatchResultItem = SkillBasedJobMatchingOutput[0];

interface JobResultsContextType {
  jobMatchResults: JobMatchResultItem[];
  setJobMatchResults: Dispatch<SetStateAction<JobMatchResultItem[]>>;
}

export const JobResultsContext = createContext<JobResultsContextType>({
  jobMatchResults: [],
  setJobMatchResults: () => {},
});

interface JobResultsProviderProps {
  children: ReactNode;
}

export const JobResultsProvider: React.FC<JobResultsProviderProps> = ({ children }) => {
  const [jobMatchResults, setJobMatchResults] = useState<JobMatchResultItem[]>([]);

  return (
    <JobResultsContext.Provider value={{ jobMatchResults, setJobMatchResults }}>
      {children}
    </JobResultsContext.Provider>
  );
};

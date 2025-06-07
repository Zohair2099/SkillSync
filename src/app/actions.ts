
'use server';

import { skillBasedJobMatching, SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import { jobFocusedSkillComparison, JobFocusedSkillComparisonInput, JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';

export async function performSkillBasedJobMatching(input: SkillBasedJobMatchingInput): Promise<SkillBasedJobMatchingOutput> {
  try {
    const processedSkills = input.userSkills.map(skill => ({
      ...skill,
      experience: skill.experience?.trim() ? skill.experience.trim() : undefined
    }));

    const processedInput: SkillBasedJobMatchingInput = {
      ...input,
      userSkills: processedSkills,
      country: input.country || undefined,
      state: input.state || undefined,
      minSalary: input.minSalary ? Number(input.minSalary) : undefined,
      maxSalary: input.maxSalary ? Number(input.maxSalary) : undefined,
      workModel: input.workModel === 'any' ? undefined : input.workModel,
    };
    
    const result = await skillBasedJobMatching(processedInput);
    return result;
  } catch (error) {
    console.error('Error in skillBasedJobMatching:', error);
    throw new Error('Failed to match jobs based on skills. Please try again.');
  }
}

export async function performJobFocusedSkillComparison(input: JobFocusedSkillComparisonInput): Promise<JobFocusedSkillComparisonOutput> {
  try {
     const processedSkills = input.userSkills.map(skill => ({
      ...skill,
      experience: skill.experience?.trim() ? skill.experience.trim() : undefined
    }));
    const result = await jobFocusedSkillComparison({ ...input, userSkills: processedSkills, jobDescription: input.jobDescription || undefined });
    return result;
  } catch (error)
   {
    console.error('Error in jobFocusedSkillComparison:', error);
    throw new Error('Failed to compare skills for the job. Please try again.');
  }
}

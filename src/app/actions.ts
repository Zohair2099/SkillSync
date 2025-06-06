'use server';

import { skillBasedJobMatching, SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import { jobFocusedSkillComparison, JobFocusedSkillComparisonInput, JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';

export async function performSkillBasedJobMatching(input: SkillBasedJobMatchingInput): Promise<SkillBasedJobMatchingOutput> {
  try {
    const result = await skillBasedJobMatching(input);
    return result;
  } catch (error) {
    console.error('Error in skillBasedJobMatching:', error);
    throw new Error('Failed to match job based on skills. Please try again.');
  }
}

export async function performJobFocusedSkillComparison(input: JobFocusedSkillComparisonInput): Promise<JobFocusedSkillComparisonOutput> {
  try {
    const result = await jobFocusedSkillComparison(input);
    return result;
  } catch (error) {
    console.error('Error in jobFocusedSkillComparison:', error);
    throw new Error('Failed to compare skills for the job. Please try again.');
  }
}

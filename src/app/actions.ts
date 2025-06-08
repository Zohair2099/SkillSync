
'use server';

import { skillBasedJobMatching, SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import { jobFocusedSkillComparison, JobFocusedSkillComparisonInput, JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { assessSoftSkills, SoftSkillAssessmentInput, SoftSkillAssessmentOutput } from '@/ai/flows/soft-skill-assessment-flow';
import { generateMarketTrends, MarketTrendsInput, MarketTrendsOutput } from '@/ai/flows/market-trends-flow';

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

export async function performSoftSkillAssessment(input: SoftSkillAssessmentInput): Promise<SoftSkillAssessmentOutput> {
  try {
    // Validate answers: ensure no answer is empty, though the AI might handle it.
    // For now, we'll pass them as is.
    const result = await assessSoftSkills(input);
    return result;
  } catch (error) {
    console.error('Error in performSoftSkillAssessment:', error);
    throw new Error('Failed to assess soft skills. Please try again.');
  }
}

export async function performMarketTrendsAnalysis(input: MarketTrendsInput): Promise<MarketTrendsOutput> {
  try {
    const result = await generateMarketTrends(input);
    return result;
  } catch (error) {
    console.error('Error in performMarketTrendsAnalysis:', error);
    throw new Error('Failed to generate market trends. Please try again.');
  }
}

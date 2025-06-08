
'use server';

import { skillBasedJobMatching, type SkillBasedJobMatchingInput, type SkillBasedJobMatchingOutput } from '@/ai/flows/skill-based-job-matching';
import { jobFocusedSkillComparison, type JobFocusedSkillComparisonInput, type JobFocusedSkillComparisonOutput } from '@/ai/flows/job-focused-skill-comparison';
import { assessSoftSkills, type SoftSkillAssessmentInput, type SoftSkillAssessmentOutput } from '@/ai/flows/soft-skill-assessment-flow';
import { generateMarketTrends, type MarketTrendsInput, type MarketTrendsOutput } from '@/ai/flows/market-trends-flow';
import { 
  generateInterviewQuestions, type GenerateInterviewQuestionsInput, type GenerateInterviewQuestionsOutput,
  evaluateInterviewAnswer, type EvaluateInterviewAnswerInput, type EvaluateInterviewAnswerOutput
} from '@/ai/flows/interview-practice-flow';
import { estimateSalary, type SalaryEstimatorInput, type SalaryEstimatorOutput } from '@/ai/flows/salary-estimator-flow';

// Re-export types for client-side usage
export type { 
  SkillBasedJobMatchingInput, SkillBasedJobMatchingOutput,
  JobFocusedSkillComparisonInput, JobFocusedSkillComparisonOutput,
  SoftSkillAssessmentInput, SoftSkillAssessmentOutput,
  MarketTrendsInput, MarketTrendsOutput,
  GenerateInterviewQuestionsInput, GenerateInterviewQuestionsOutput,
  EvaluateInterviewAnswerInput, EvaluateInterviewAnswerOutput,
  SalaryEstimatorInput, SalaryEstimatorOutput // Added Salary Estimator types
};


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

export async function performGenerateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  try {
    const result = await generateInterviewQuestions(input);
    return result;
  } catch (error) {
    console.error('Error in performGenerateInterviewQuestions:', error);
    throw new Error('Failed to generate interview questions. Please try again.');
  }
}

export async function performEvaluateInterviewAnswer(input: EvaluateInterviewAnswerInput): Promise<EvaluateInterviewAnswerOutput> {
  try {
    const result = await evaluateInterviewAnswer(input);
    return result;
  } catch (error) {
    console.error('Error in performEvaluateInterviewAnswer:', error);
    throw new Error('Failed to evaluate interview answer. Please try again.');
  }
}

export async function performSalaryEstimation(input: SalaryEstimatorInput): Promise<SalaryEstimatorOutput> {
  try {
    const result = await estimateSalary(input);
    return result;
  } catch (error) {
    console.error('Error in performSalaryEstimation:', error);
    throw new Error('Failed to estimate salary. Please try again.');
  }
}

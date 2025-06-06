// use server'

/**
 * @fileOverview Compares user skills against job requirements and identifies skill gaps.
 *
 * - jobFocusedSkillComparison - A function that analyzes job requirements against a user's skills.
 * - JobFocusedSkillComparisonInput - The input type for the jobFocusedSkillComparison function.
 * - JobFocusedSkillComparisonOutput - The return type for the jobFocusedSkillComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobFocusedSkillComparisonInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The full text description of the job posting.'),
  userSkills: z.array(z.string()).describe('A list of skills the user possesses.'),
});
export type JobFocusedSkillComparisonInput = z.infer<typeof JobFocusedSkillComparisonInputSchema>;

const JobFocusedSkillComparisonOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('A list of skills required for the job that the user is missing.'),
  suggestedResources: z
    .array(z.string())
    .describe('A list of resources for learning the missing skills.'),
  skillComparisonSummary: z
    .string()
    .describe('A summary of the skill comparison between the job description and the user skills.'),
});
export type JobFocusedSkillComparisonOutput = z.infer<typeof JobFocusedSkillComparisonOutputSchema>;

export async function jobFocusedSkillComparison(input: JobFocusedSkillComparisonInput): Promise<JobFocusedSkillComparisonOutput> {
  return jobFocusedSkillComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobFocusedSkillComparisonPrompt',
  input: {schema: JobFocusedSkillComparisonInputSchema},
  output: {schema: JobFocusedSkillComparisonOutputSchema},
  prompt: `You are a career advisor. You will be given a job description and a list of user skills.

You will compare the job description against the user skills and identify any missing skills.
For each missing skill, you will provide a list of resources for learning that skill.

Job Description: {{{jobDescription}}}
User Skills: {{#each userSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Missing Skills: 
Suggested Resources:
Skill Comparison Summary:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const jobFocusedSkillComparisonFlow = ai.defineFlow(
  {
    name: 'jobFocusedSkillComparisonFlow',
    inputSchema: JobFocusedSkillComparisonInputSchema,
    outputSchema: JobFocusedSkillComparisonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

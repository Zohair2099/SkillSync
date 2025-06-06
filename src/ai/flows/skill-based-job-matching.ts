// use server'

/**
 * @fileOverview Matches open jobs to the user based on their specified skills, ranking results to highlight strongest fits.
 *
 * - skillBasedJobMatching - A function that handles the job matching process.
 * - SkillBasedJobMatchingInput - The input type for the skillBasedJobMatching function.
 * - SkillBasedJobMatchingOutput - The return type for the skillBasedJobMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillBasedJobMatchingInputSchema = z.object({
  userSkills: z.array(z.string()).describe('A list of skills possessed by the user.'),
  jobDescription: z.string().describe('The description of the job posting.'),
  jobTitle: z.string().describe('The title of the job posting.'),
});

export type SkillBasedJobMatchingInput = z.infer<typeof SkillBasedJobMatchingInputSchema>;

const SkillBasedJobMatchingOutputSchema = z.object({
  matchPercentage: z.number().describe('The percentage match between the user skills and job requirements.'),
  rationale: z.string().describe('Explanation of how well the user skills align with the job requirements.'),
});

export type SkillBasedJobMatchingOutput = z.infer<typeof SkillBasedJobMatchingOutputSchema>;

export async function skillBasedJobMatching(input: SkillBasedJobMatchingInput): Promise<SkillBasedJobMatchingOutput> {
  return skillBasedJobMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillBasedJobMatchingPrompt',
  input: {schema: SkillBasedJobMatchingInputSchema},
  output: {schema: SkillBasedJobMatchingOutputSchema},
  prompt: `You are an expert job matching assistant. Given the job description and the user's skills, determine the match percentage and provide a rationale.

Job Title: {{{jobTitle}}}
Job Description: {{{jobDescription}}}
User Skills: {{#each userSkills}}{{{this}}}, {{/each}}

Match Percentage: 
Rationale: `,
});

const skillBasedJobMatchingFlow = ai.defineFlow(
  {
    name: 'skillBasedJobMatchingFlow',
    inputSchema: SkillBasedJobMatchingInputSchema,
    outputSchema: SkillBasedJobMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

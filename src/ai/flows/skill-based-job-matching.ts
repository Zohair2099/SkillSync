// use server'

/**
 * @fileOverview Matches open jobs to the user based on their specified skills, 
 * generating multiple example job postings with match scores.
 *
 * - skillBasedJobMatching - A function that handles the job matching process.
 * - SkillBasedJobMatchingInput - The input type for the skillBasedJobMatching function.
 * - SkillBasedJobMatchingOutput - The return type for the skillBasedJobMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
  experience: z.string().optional().describe('Years of experience with the skill (e.g., "2", "5+", "0-1"). Can be omitted.'),
});

const SkillBasedJobMatchingInputSchema = z.object({
  userSkills: z.array(SkillSchema).describe('A list of skills possessed by the user, optionally with years of experience.'),
  jobTitle: z.string().describe('The desired job title or type of job the user is looking for.'),
  jobDescription: z.string().describe('A description of the ideal job or responsibilities the user is interested in.'),
});

export type SkillBasedJobMatchingInput = z.infer<typeof SkillBasedJobMatchingInputSchema>;

const JobMatchSchema = z.object({
  jobTitle: z.string().describe('The title of the generated job posting.'),
  jobDescription: z.string().describe('A brief description of the generated job posting (2-3 sentences).'),
  companyName: z.string().describe('An invented company name for the job posting.'),
  location: z.string().describe('An invented location (e.g., City, ST) for the job posting.'),
  matchPercentage: z.number().min(0).max(100).describe('The estimated percentage match (0-100) between the user skills and this generated job.'),
  rationale: z.string().describe('A concise explanation (1-2 sentences) of why this job is a good match for the user based on their skills.'),
});

const SkillBasedJobMatchingOutputSchema = z.array(JobMatchSchema).describe('An array of 3-5 generated job postings that match the user criteria.');

export type SkillBasedJobMatchingOutput = z.infer<typeof SkillBasedJobMatchingOutputSchema>;

export async function skillBasedJobMatching(input: SkillBasedJobMatchingInput): Promise<SkillBasedJobMatchingOutput> {
  return skillBasedJobMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillBasedJobMatchingPrompt',
  input: {schema: SkillBasedJobMatchingInputSchema},
  output: {schema: SkillBasedJobMatchingOutputSchema},
  prompt: `You are an expert job matching assistant. Based on the user's skills and their interest in a role like '{{jobTitle}}' with responsibilities '{{jobDescription}}', generate 3 diverse example job postings that would be a good fit.
For each job, provide:
1.  A unique job title.
2.  A brief job description (2-3 sentences).
3.  An invented company name.
4.  An invented location (e.g., City, ST).
5.  An estimated match percentage (an integer between 0 and 100).
6.  A concise rationale (1-2 sentences) for why it's a good match considering the user's skills.

Ensure variety in the generated job postings.

User Skills:
{{#each userSkills}}
- {{this.name}}{{#if this.experience}} ({{this.experience}} years experience){{/if}}
{{/each}}

Desired Job Title: {{{jobTitle}}}
Ideal Job Description: {{{jobDescription}}}

Generate the response as a JSON array of objects, where each object adheres to the output schema.
`,
});

const skillBasedJobMatchingFlow = ai.defineFlow(
  {
    name: 'skillBasedJobMatchingFlow',
    inputSchema: SkillBasedJobMatchingInputSchema,
    outputSchema: SkillBasedJobMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is an array, even if LLM returns a single object by mistake for some reason
    if (output && !Array.isArray(output)) {
      // This case should ideally not happen if the LLM follows the schema, but as a fallback.
      console.warn("LLM returned a single object for an array schema, wrapping it.");
      return [output] as SkillBasedJobMatchingOutput;
    }
    return output || [];
  }
);



// use server'

/**
 * @fileOverview Compares user skills against job requirements (optional) and identifies skill gaps.
 * Provides interview tips if no gaps are found or if job description is not provided.
 * Suggests job categories if no job description is provided.
 *
 * - jobFocusedSkillComparison - A function that analyzes job requirements against a user's skills.
 * - JobFocusedSkillComparisonInput - The input type for the jobFocusedSkillComparison function.
 * - JobFocusedSkillComparisonOutput - The return type for the jobFocusedSkillComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
  experience: z.string().optional().describe('Years of experience with the skill (e.g., "2", "5+", "0-1"). Can be omitted.'),
});

const JobFocusedSkillComparisonInputSchema = z.object({
  jobDescription: z
    .string()
    .optional()
    .describe('The full text description of the job posting. This is optional.'),
  userSkills: z.array(SkillSchema).describe('A list of skills the user possesses, optionally with years of experience.'),
});
export type JobFocusedSkillComparisonInput = z.infer<typeof JobFocusedSkillComparisonInputSchema>;

const JobFocusedSkillComparisonOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('A list of skills required for the job (if provided) that the user is missing.'),
  suggestedResources: z
    .array(z.string())
    .describe('A list of resources for learning the missing skills (if any).'),
  skillComparisonSummary: z
    .string()
    .describe('A summary of the skill comparison between the job description (if provided) and the user skills. If no job description, summarize the general strength and applicability of the user skills.'),
  interviewTips: z
    .array(z.string())
    .optional()
    .describe('A list of 3-5 helpful and actionable interview tips, provided if no significant skill gaps are found OR if no job description was given and skills are generally strong.'),
  suggestedJobCategories: z
    .array(z.string())
    .optional()
    .describe('If no job description was provided, this lists 2-3 types of job roles or career paths that might align well with the user\'s skills.')
});
export type JobFocusedSkillComparisonOutput = z.infer<typeof JobFocusedSkillComparisonOutputSchema>;

export async function jobFocusedSkillComparison(input: JobFocusedSkillComparisonInput): Promise<JobFocusedSkillComparisonOutput> {
  return jobFocusedSkillComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobFocusedSkillComparisonPrompt',
  input: {schema: JobFocusedSkillComparisonInputSchema},
  output: {schema: JobFocusedSkillComparisonOutputSchema},
  prompt: `You are a career advisor. You will be given a list of user skills, and optionally, a job description.

User Skills:
{{#each userSkills}}
- {{this.name}}{{#if this.experience}} ({{this.experience}} years experience){{/if}}
{{/each}}

{{#if jobDescription}}
Job Description:
{{{jobDescription}}}
{{else}}
The user has not provided a specific job description. Please provide a general analysis of their skillset and suggest some suitable job categories.
{{/if}}

Your tasks:
1.  Skill Comparison Summary: Provide a summary of how the user's skills align with the job description (if provided). If no job description, summarize the general strength and applicability of the user's skills.
2.  Missing Skills: If a job description is provided, identify skills required by the job that the user appears to be missing from their list. If no job description, or if all listed job skills are met, this should be an empty array.
3.  Suggested Resources: For each missing skill (if any), provide a list of 1-2 brief, actionable suggestions for learning resources (e.g., "Online courses on Coursera/Udemy for [Skill Name]", "Read [Specific Book/Blog] on [Topic]").
4.  Interview Tips:
    *   If a job description was provided AND no significant skills are missing, OR
    *   If no job description was provided AND the user has a reasonably strong and diverse skillset,
    Then provide a list of 3-5 helpful and actionable interview tips (e.g., "Research the company thoroughly", "Prepare STAR method stories for behavioral questions").
    *   Otherwise (if skills are missing for a provided job), do not provide interview tips (make it an empty array or omit the field).
5.  Suggested Job Categories:
    *   If no jobDescription was provided, suggest 2-3 types of job roles or career paths (e.g., "Data Analyst", "Frontend Developer", "Digital Marketing Specialist") that seem like a good fit for the user's skills. Keep these brief.
    *   If a jobDescription was provided, this field should be an empty array or omitted.

Structure your response according to the output schema.
`,
  config: {
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


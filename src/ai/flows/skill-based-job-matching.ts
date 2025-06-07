
// use server'

/**
 * @fileOverview Matches open jobs to the user based on their specified skills and preferences, 
 * generating multiple example job postings with match scores and detailed information.
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
  jobDescription: z.string().describe('A description of the ideal job or responsibilities the user is interested in.'), // User's ideal job desc
  country: z.string().optional().describe('The desired country for the job (e.g., "USA", "Canada"). Optional.'),
  state: z.string().optional().describe('The desired state/province within the country (e.g., "California", "Ontario"). Optional, depends on country.'),
  minSalary: z.number().optional().describe('The minimum desired annual salary. Optional.'),
  maxSalary: z.number().optional().describe('The maximum desired annual salary. Optional.'),
  workModel: z.enum(['on-site', 'remote', 'hybrid']).optional().describe('The preferred work model (on-site, remote, hybrid). Optional.'),
});

export type SkillBasedJobMatchingInput = z.infer<typeof SkillBasedJobMatchingInputSchema>;

const JobMatchSchema = z.object({
  jobTitle: z.string().describe('The title of the generated job posting.'),
  companyName: z.string().describe('An invented company name for the job posting.'),
  location: z.string().describe('An invented location (e.g., City, ST or City, Country) for the job posting, respecting country/state inputs if provided.'),
  salaryRange: z.string().optional().describe('An estimated salary range for the job (e.g., "$80,000 - $120,000 annually"). Should respect min/max salary inputs if provided. Optional.'),
  employmentType: z.string().optional().describe('Type of employment (e.g., "Full-time", "Contract", "Part-time"). Optional.'),
  workModel: z.enum(['on-site', 'remote', 'hybrid']).optional().describe('The work model for this job. Should respect user input if provided. Optional.'),
  
  jobDescription: z.string().describe('A brief, engaging summary of the generated job posting (2-4 sentences). This is the short description for the card preview.'),
  
  responsibilities: z.array(z.string()).optional().describe('A list of key responsibilities for the role. Optional.'),
  requiredSkills: z.array(z.string()).optional().describe('A list of essential skills for the role. Optional.'),
  preferredSkills: z.array(z.string()).optional().describe('A list of preferred/bonus skills for the role. Optional.'),
  experienceLevel: z.string().optional().describe('Required or typical experience level (e.g., "Entry-level", "3-5 years", "Senior", "Lead"). Optional.'),
  educationLevel: z.string().optional().describe('Typical or required education level (e.g., "Bachelor\'s Degree in CS", "Master\'s preferred"). Optional.'),
  
  matchPercentage: z.number().min(0).max(100).describe('The estimated percentage match (0-100) between the user skills and this generated job. Higher means better fit.'),
  rationale: z.string().describe('A concise explanation (1-2 sentences) of why this job is a good match for the user based on their skills and preferences.'),
});

const SkillBasedJobMatchingOutputSchema = z.array(JobMatchSchema).describe('An array of 3-5 generated job postings that match the user criteria and preferences.');

export type SkillBasedJobMatchingOutput = z.infer<typeof SkillBasedJobMatchingOutputSchema>;

export async function skillBasedJobMatching(input: SkillBasedJobMatchingInput): Promise<SkillBasedJobMatchingOutput> {
  return skillBasedJobMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillBasedJobMatchingPrompt',
  input: {schema: SkillBasedJobMatchingInputSchema},
  output: {schema: SkillBasedJobMatchingOutputSchema},
  prompt: `You are an expert job matching assistant. The user is looking for jobs.
Generate 3-5 diverse example job postings that would be a good fit based on their profile and preferences.

User Profile & Preferences:
User Skills:
{{#each userSkills}}
- {{this.name}}{{#if this.experience}} ({{this.experience}} years experience){{/if}}
{{/each}}

Desired Job Title: {{{jobTitle}}}
Ideal Job Description (user's ideal): {{{jobDescription}}}
{{#if country}}Desired Country: {{{country}}}{{/if}}
{{#if state}}Desired State/Province: {{{state}}}{{/if}}
{{#if minSalary}}Minimum Desired Salary: {{{minSalary}}}{{/if}}
{{#if maxSalary}}Maximum Desired Salary: {{{maxSalary}}}{{/if}}
{{#if workModel}}Preferred Work Model: {{{workModel}}}{{/if}}

For each generated job posting, provide the following details. Adhere strictly to the output schema.
1.  jobTitle: A unique and realistic job title for the generated posting.
2.  companyName: An invented, plausible company name.
3.  location: An invented location (e.g., "San Francisco, CA" or "Remote (USA)" or "Berlin, Germany"). If country/state are provided by user, try to make the location consistent or clearly state if it's remote-friendly for that region.
4.  salaryRange: An estimated realistic salary range for this role and location (e.g., "$90,000 - $110,000 per year"). If user provided salary preferences, try to align with them if realistic for the role. This field is optional.
5.  employmentType: e.g., "Full-time", "Contract". Optional.
6.  workModel: e.g., "on-site", "remote", "hybrid". Align with user preference if specified and realistic for the role. Optional.
7.  jobDescription: A brief, engaging summary of the job (2-4 sentences) for a card preview.
8.  responsibilities: (Optional) A list of 3-5 key responsibilities.
9.  requiredSkills: (Optional) A list of 3-5 essential skills for THIS generated job.
10. preferredSkills: (Optional) A list of 2-3 preferred/bonus skills for THIS generated job.
11. experienceLevel: (Optional) e.g., "Entry-level", "Mid-Senior level (5+ years)".
12. educationLevel: (Optional) e.g., "Bachelor's degree in a related field".
13. matchPercentage: An estimated integer percentage (0-100) indicating how well THIS generated job matches the USER'S SKILLS and stated preferences. Critically evaluate against the user's skill list.
14. rationale: A concise (1-2 sentences) explanation of why this job is a good match, highlighting specific skill alignments or preference matches.

Ensure variety in the generated job postings (e.g., different company sizes, slightly different role focuses if possible within the user's main interest).
If the user's salary expectations are very misaligned with typical salaries for the role/location, you can generate jobs with more typical salaries and note the discrepancy subtly in the rationale or by not providing a salary range for that specific job.

Generate the response as a JSON array of objects, where each object adheres to the JobMatchSchema.
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
    if (output && !Array.isArray(output)) {
      console.warn("LLM returned a single object for an array schema, wrapping it.");
      return [output] as SkillBasedJobMatchingOutput;
    }
    return output || [];
  }
);

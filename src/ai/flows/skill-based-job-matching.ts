
'use server';

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
  salaryRange: z.string().optional().describe('An estimated salary range for the job (e.g., "$80,000 - $120,000 annually"). Should respect min/max salary inputs if provided. This is a key detail and should be included if plausible for the role.'),
  employmentType: z.string().describe('Type of employment (e.g., "Full-time", "Contract", "Part-time"). Should generally be provided.'),
  workModel: z.enum(['on-site', 'remote', 'hybrid']).describe('The work model for this job. Should respect user input if provided and clearly stated (e.g., "Remote (USA)", "Hybrid (Office/Home)", "On-site").'),
  
  jobDescription: z.string().describe('A brief, engaging summary of the generated job posting (2-4 sentences). This is the short description for the card preview.'),
  
  responsibilities: z.array(z.string()).describe('A list of 3-5 key responsibilities for the role. This is important for a realistic job posting.'),
  requiredSkills: z.array(z.string()).describe('A list of 3-5 essential hard and soft skills for the role. This is important for a realistic job posting.'),
  preferredSkills: z.array(z.string()).optional().describe('A list of 2-3 preferred/bonus skills for the role. Optional but good to include.'),
  experienceLevel: z.string().describe('Required or typical experience level (e.g., "Entry-level", "3-5 years of relevant experience", "Senior (7+ years)", "Lead (10+ years)"). This is important for a realistic job posting.'),
  educationLevel: z.string().optional().describe('Typical or required education level (e.g., "Bachelor\'s Degree in Computer Science or related field", "Master\'s degree preferred", "Relevant certifications considered"). Optional but good to include.'),
  
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
These job postings should be detailed and realistic, as if they were real job listings.

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

For each generated job posting, provide comprehensive details. Adhere strictly to the output schema. Make each job posting unique and plausible.
1.  jobTitle: A unique and realistic job title.
2.  companyName: An invented, plausible company name.
3.  location: An invented location (e.g., "San Francisco, CA" or "Remote (USA)" or "Berlin, Germany"). If country/state are provided by user, make the location consistent or clearly state if it's remote-friendly for that region.
4.  salaryRange: (Crucial) An estimated realistic salary range (e.g., "$90,000 - $110,000 per year"). If user provided salary preferences, try to align with them if realistic. If no user preference, generate a typical market range.
5.  employmentType: (Crucial) e.g., "Full-time", "Contract", "Part-time".
6.  workModel: (Crucial) e.g., "on-site", "remote", "hybrid". Align with user preference if specified and realistic. Be specific (e.g., "Remote (Canada-wide)", "Hybrid (3 days in office, Toronto)").
7.  jobDescription: (Crucial) A brief, engaging summary of the job (2-4 sentences) for a card preview.
8.  responsibilities: (Crucial) A list of 3-5 key responsibilities. Be specific and action-oriented.
9.  requiredSkills: (Crucial) A list of 3-5 essential hard AND soft skills.
10. preferredSkills: (Optional, but Recommended) A list of 2-3 preferred/bonus skills.
11. experienceLevel: (Crucial) e.g., "Entry-level (0-2 years)", "Mid-Senior level (5+ years of professional experience in X)".
12. educationLevel: (Optional, but Recommended) e.g., "Bachelor's degree in a related field such as Computer Science or Engineering", "Master's degree is a plus".
13. matchPercentage: An estimated integer percentage (0-100) indicating how well THIS generated job matches the USER'S SKILLS and stated preferences. Critically evaluate against the user's skill list.
14. rationale: A concise (1-2 sentences) explanation of why this job is a good match, highlighting specific skill alignments or preference matches.

Ensure variety in the generated job postings (e.g., different company sizes, slightly different role focuses if possible within the user's main interest).
If the user's salary expectations are very misaligned with typical salaries for the role/location, you can generate jobs with more typical salaries and note the discrepancy subtly in the rationale or by not providing a salary range for that specific job if it's too hard to estimate.

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


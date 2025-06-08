
'use server';
/**
 * @fileOverview Provides AI-powered salary estimation based on job details and user profile.
 * - estimateSalary: Generates a salary estimation.
 * - SalaryEstimatorInput - The input type for the estimateSalary function.
 * - SalaryEstimatorOutput - The return type for the estimateSalary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// This schema object is not exported directly from this file
const SalaryEstimatorInputSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters").describe('The specific job title for which the salary is being estimated (e.g., "Senior Software Engineer", "Marketing Manager").'),
  yearsExperience: z.number().min(0).max(50).describe('The number of years of relevant professional experience for the given job title.'),
  skills: z.array(z.string()).min(1, "At least one skill is required").describe('A list of key skills relevant to the job title (e.g., ["JavaScript", "React", "Node.js", "Project Management"]).'),
  location: z.string().optional().describe('The geographical location for the job (e.g., "San Francisco, CA", "London, UK", "Remote (USA)"). If not provided, a more general estimate will be given.'),
  companySize: z.enum(["startup", "mid-size", "large-enterprise", "any"]).optional().describe('The approximate size of the company (e.g., startup, mid-size, large-enterprise). Defaults to "any" if not specified.'),
  industry: z.string().optional().describe('The industry of the company or role (e.g., "Technology", "Healthcare", "Finance", "E-commerce").'),
});
export type SalaryEstimatorInput = z.infer<typeof SalaryEstimatorInputSchema>;

// This schema object is not exported directly from this file
const SalaryEstimatorOutputSchema = z.object({
  estimatedLow: z.number().describe('The estimated lower bound of the annual salary range.'),
  estimatedHigh: z.number().describe('The estimated upper bound of the annual salary range.'),
  currency: z.string().default("USD").describe('The currency for the estimated salary (e.g., USD, EUR, GBP). Defaults to USD.'),
  confidenceLevel: z.enum(["high", "medium", "low"]).describe("The AI's confidence level in the provided estimate (high, medium, or low)."),
  influencingFactors: z.array(z.string()).min(1).describe('A list of 2-4 key factors that influenced this salary estimation (e.g., "High demand for specific skills like AI/ML.", "Location cost of living adjustment.", "Based on typical compensation for similar roles in mid-size tech companies.").'),
  notes: z.string().optional().describe('Any additional notes or disclaimers from the AI, such as limitations of the estimate or advice to consult multiple sources (e.g., "Salary data for niche roles in this specific location is limited, wider range provided.").'),
});
export type SalaryEstimatorOutput = z.infer<typeof SalaryEstimatorOutputSchema>;


export async function estimateSalary(input: SalaryEstimatorInput): Promise<SalaryEstimatorOutput> {
  return salaryEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'salaryEstimatorPrompt',
  input: {schema: SalaryEstimatorInputSchema},
  output: {schema: SalaryEstimatorOutputSchema},
  prompt: `You are an expert Compensation Analyst AI. Your task is to provide a realistic annual salary range estimation based on the provided job details.

Job Title: {{{jobTitle}}}
Years of Relevant Experience: {{yearsExperience}}
Key Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if location}}Location: {{{location}}}{{else}}Location: Not specified (provide a general estimate based on common markets for this role, e.g., US or global if applicable){{/if}}
{{#if companySize}}Company Size: {{{companySize}}}{{/if}}
{{#if industry}}Industry: {{{industry}}}{{/if}}

Based on these factors, provide an estimated annual salary range (low and high values).
Specify the currency (default to USD if location is US-based or not specified, otherwise try to infer from location).
Indicate your confidence level (high, medium, low) in this estimation.
List 2-4 key influencing factors for your estimation. These factors should explain why the salary is in that range (e.g., skill demand, experience level impact, location-specific adjustments, industry benchmarks).
Provide brief notes if there are any caveats or important context (e.g., "Data for this niche role in this specific location is limited, resulting in a wider range.").

Ensure the estimatedLow is less than or equal to estimatedHigh.
The difference between low and high should be reasonable (e.g., not excessively narrow or wide unless justified by confidence/notes).
Prioritize providing a helpful and plausible estimate even if some optional fields (location, companySize, industry) are not provided.
If location is very generic (e.g., "USA"), assume major metropolitan areas unless otherwise specified.
If skills include highly specialized or in-demand technologies (e.g., specific AI/ML frameworks, blockchain), reflect this in the estimate and influencing factors.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const salaryEstimatorFlow = ai.defineFlow(
  {
    name: 'salaryEstimatorFlow',
    inputSchema: SalaryEstimatorInputSchema,
    outputSchema: SalaryEstimatorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a salary estimation.");
    }
    // Ensure low <= high, basic sanity check
    if (output.estimatedLow > output.estimatedHigh) {
        // Swap them or adjust, here we'll just log and potentially return an adjusted version or error.
        // For now, let's assume the LLM gets this mostly right but a robust app might adjust.
        console.warn("AI returned estimatedLow > estimatedHigh, attempting to correct or needs prompt refinement.");
        // A simple correction for now, could be more sophisticated
        const tempLow = output.estimatedLow;
        output.estimatedLow = Math.min(tempLow, output.estimatedHigh);
        output.estimatedHigh = Math.max(tempLow, output.estimatedHigh);
    }
    return output;
  }
);

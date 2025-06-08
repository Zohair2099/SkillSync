
'use server';
/**
 * @fileOverview Provides AI-powered company culture matching.
 * - matchCompanyCulture: Generates mock company profiles based on user's cultural preferences.
 * - CompanyCulturePreferencesInput - The input type for the matchCompanyCulture function.
 * - CompanyCultureMatchOutput - The return type for the matchCompanyCulture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Import the schema from the shared location
import { CompanyCulturePreferencesInputSchema, type CompanyCulturePreferencesInput } from '@/lib/schemas/company-culture-schemas';

// Re-export the type if needed by actions.ts or other server components
export type { CompanyCulturePreferencesInput };

const MockCompanyProfileSchema = z.object({
    companyName: z.string().describe("An invented, plausible name for a company matching the cultural preferences (e.g., 'Innovatech Solutions', 'GreenLeaf Organics', 'Momentum Dynamics')."),
    companyIndustry: z.string().describe("A plausible industry for this mock company (e.g., 'Software Development', 'Sustainable Agriculture', 'Management Consulting')."),
    companySizeIndicator: z.string().describe("A general size indicator consistent with user preference if specified (e.g., 'Boutique Startup (approx. 30 employees)', 'Established Mid-Sized Tech Firm (around 250 staff)', 'Global Conglomerate (10,000+ employees worldwide)')."),
    cultureSummary: z.string().describe("A 2-3 sentence summary of this mock company's culture, tailored to align with the user's specified preferences."),
    keyCulturalAspects: z.array(z.string().min(1)).min(3).max(5).describe("A list of 3-5 specific, positive cultural aspects that directly align with and highlight the user's preferences (e.g., 'Emphasis on flexible work arrangements and remote options', 'Strong focus on cross-functional teamwork and open communication', 'Encourages experimentation and learning from failures')."),
    potentialConsideration: z.string().optional().describe("A brief (1-sentence) potential cultural aspect that might be a minor consideration or trade-off for some, based on the user's preferences, or a neutral but defining characteristic (e.g., 'Decisions can sometimes take longer due to the consensus-driven approach.', 'Highly specialized roles might offer less cross-departmental exposure initially.'). Omit if no clear trade-off is apparent."),
    alignmentRationale: z.string().describe("A concise (1-2 sentences) explanation of WHY this company's generated culture is a strong match for the user's stated preferences, referencing specific inputs.")
});

// This schema object is not exported
const CompanyCultureMatchOutputSchema = z.array(MockCompanyProfileSchema)
    .min(2)
    .max(3)
    .describe("An array of 2-3 diverse, mock company profiles that strongly match the user's cultural preferences. Each profile should be unique.");

export type CompanyCultureMatchOutput = z.infer<typeof CompanyCultureMatchOutputSchema>;


export async function matchCompanyCulture(input: CompanyCulturePreferencesInput): Promise<CompanyCultureMatchOutput> {
  return matchCompanyCultureFlow(input);
}


const prompt = ai.definePrompt({
  name: 'companyCultureMatchPrompt',
  input: {schema: CompanyCulturePreferencesInputSchema}, // Uses the imported schema
  output: {schema: CompanyCultureMatchOutputSchema},
  prompt: `You are an expert career advisor specializing in company culture and work environment fit.
A user has provided their preferences for various cultural aspects. Your task is to generate 2-3 distinct, mock company profiles that would be an excellent cultural match for them.
These profiles should be plausible and engaging, highlighting how their (invented) culture aligns with the user's preferences.

User's Cultural Preferences:
- Work-Life Balance: {{{workLifeBalance}}}
- Team Environment: {{{teamEnvironment}}}
- Innovation Style: {{{innovationStyle}}}
- Company Size: {{{companySize}}}
- Decision Making: {{{decisionMaking}}}
- Feedback Culture: {{{feedbackCulture}}}
- Pace: {{{pace}}}
- Values Learning Opportunities: {{#if learningOpportunities}}Yes{{else}}No strong preference{{/if}}
- Values Social Impact: {{#if socialImpactFocus}}Yes{{else}}No strong preference{{/if}}
- Values Diversity & Inclusion: {{#if diversityAndInclusion}}Yes{{else}}No strong preference{{/if}}

For each mock company profile, provide:
1.  **companyName**: An invented, professional, and plausible company name.
2.  **companyIndustry**: A suitable industry for the mock company.
3.  **companySizeIndicator**: A descriptive size indicator (e.g., "Growing Startup", "Mid-Sized Enterprise", "Global Leader") that aligns with user preference if specified.
4.  **cultureSummary**: A 2-3 sentence summary describing the company's overall culture, emphasizing aspects that match the user's input.
5.  **keyCulturalAspects**: A list of 3-5 bullet points detailing specific cultural elements that strongly align with the user's preferences. Make these concrete and appealing.
6.  **potentialConsideration**: (Optional) A brief, balanced point that might be a trade-off or a specific characteristic to note (e.g., "Due to its rapid growth, some processes are still evolving.").
7.  **alignmentRationale**: A 1-2 sentence explanation of why this mock company is a good fit based on the provided preferences.

Ensure the generated companies are diverse in their mock details (name, industry) even if the cultural alignment points are similar due to shared user preferences.
Strictly adhere to the output schema. Create 2 to 3 such profiles.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});


const matchCompanyCultureFlow = ai.defineFlow(
  {
    name: 'matchCompanyCultureFlow',
    inputSchema: CompanyCulturePreferencesInputSchema, // Uses the imported schema
    outputSchema: CompanyCultureMatchOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output && !Array.isArray(output)) {
      // Handle cases where LLM might return a single object for an array schema
      console.warn("LLM returned a single object for an array schema, wrapping it.");
      return [output] as CompanyCultureMatchOutput;
    }
    return output || [];
  }
);

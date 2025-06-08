
'use server';
/**
 * @fileOverview Generates real-time job market trends.
 *
 * - generateMarketTrends - A function that provides insights into the current job market.
 * - MarketTrendsInput - The input type for the generateMarketTrends function.
 * - MarketTrendsOutput - The return type for the generateMarketTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// This schema object is not exported
const MarketTrendsInputSchema = z.object({
  areaOfInterest: z
    .string()
    .optional()
    .describe('An optional area of interest to focus the trend analysis (e.g., "USA", "Technology Sector in Europe", "Remote Marketing Jobs globally", "Healthcare in Canada"). If not provided, general global trends will be generated.'),
  userSkills: z.array(z.string()).optional().describe('Optional: A list of user skills to tailor some insights, like which of their skills are currently in high demand.')
});
export type MarketTrendsInput = z.infer<typeof MarketTrendsInputSchema>;

const InDemandSkillSchema = z.object({
  skillName: z.string().describe('The name of the in-demand skill.'),
  reason: z.string().describe('A brief explanation (1-2 sentences) of why this skill is currently in demand or how it applies to current trends.'),
  relatedRoles: z.array(z.string()).optional().describe('A few example job roles that often require this skill.')
});

const EmergingRoleSchema = z.object({
  roleName: z.string().describe('The name of the emerging or evolving job role.'),
  description: z.string().describe('A short description (2-3 sentences) of the role and why it is emerging or how it is changing.'),
  typicalSkills: z.array(z.string()).optional().describe('Common skills associated with this emerging role.')
});

const IndustryInsightSchema = z.object({
  industryName: z.string().describe('The name of the industry (e.g., "Technology", "Healthcare", "Fintech", "Renewable Energy").'),
  insightText: z.string().describe('A key trend or insight (2-4 sentences) for this industry, focusing on job market implications.'),
  growthOutlook: z.string().optional().describe("Brief comment on the industry's growth outlook (e.g., 'Strong Growth', 'Stable', 'Transforming').")
});

// This schema object is not exported
const MarketTrendsOutputSchema = z.object({
  areaAnalyzed: z.string().describe("A confirmation of the area/focus of the trend analysis (e.g., 'Global Job Market', 'Technology Sector in Europe')."),
  dataFreshness: z.string().describe("A statement about the AI's knowledge cutoff or perceived recency of data (e.g., 'Based on general knowledge up to early 2024. For precise real-time data, consult specialized market reports.')."),
  overallSummary: z.string().describe('A concise (3-5 sentences) overview of the current job market climate for the specified area, highlighting major themes.'),
  trendingJobTitles: z.array(z.string()).describe('A list of 5-7 job titles that are currently trending or seeing increased demand.'),
  inDemandSkills: z.array(InDemandSkillSchema).describe('A list of 5-7 key hard and soft skills that are highly sought after by employers, with reasons and optionally related roles.'),
  emergingRoles: z.array(EmergingRoleSchema).optional().describe('A list of 2-4 job roles that are new, rapidly evolving, or becoming more prominent, with descriptions and typical skills.'),
  industryInsights: z.array(IndustryInsightSchema).optional().describe('Insights for 2-3 key industries relevant to the area of interest, focusing on job market implications and growth outlook.'),
  salaryOutlook: z.string().optional().describe('A general (1-2 sentences) qualitative comment on salary trends (e.g., "Salaries in tech remain competitive, particularly for specialized AI roles.", "Wage growth is moderate in traditional sectors."). Avoid giving specific numbers unless they are very well-established general trends for the area.'),
  keyTakeaways: z.array(z.string()).min(3).max(5).describe('3-5 bullet points summarizing the most critical advice or observations for job seekers based on these trends.'),
  userSkillsRelevance: z.string().optional().describe("If user skills were provided, a brief (1-2 sentences) comment on how the user's skills align with current demands, or which of their skills are particularly valuable. Omit if no user skills provided.")
});
export type MarketTrendsOutput = z.infer<typeof MarketTrendsOutputSchema>;

export async function generateMarketTrends(input: MarketTrendsInput): Promise<MarketTrendsOutput> {
  return marketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketTrendsPrompt',
  input: {schema: MarketTrendsInputSchema},
  output: {schema: MarketTrendsOutputSchema},
  prompt: `You are an expert job market analyst AI. Your task is to provide insights into current job market trends.
{{#if areaOfInterest}}
The user is specifically interested in trends related to: {{{areaOfInterest}}}. Focus your analysis here.
Let the 'areaAnalyzed' field reflect this focus.
{{else}}
The user has not specified an area of interest. Provide general global job market trends.
Let the 'areaAnalyzed' field state 'Global Job Market'.
{{/if}}

{{#if userSkills}}
The user has the following skills: {{#each userSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
Briefly comment on the relevance of these skills in the 'userSkillsRelevance' output field.
{{/if}}

Provide the following information, adhering strictly to the output schema:
1.  **areaAnalyzed**: Confirm the focus of the analysis.
2.  **dataFreshness**: State the recency of your knowledge (e.g., "Based on general knowledge up to early-2024. For precise real-time data, consult specialized market reports.").
3.  **overallSummary**: A concise (3-5 sentences) overview of the job market.
4.  **trendingJobTitles**: List 5-7 job titles currently in high demand.
5.  **inDemandSkills**: List 5-7 key skills (hard and soft). For each:
    *   **skillName**: The skill.
    *   **reason**: Why it's in demand (1-2 sentences).
    *   **relatedRoles**: (Optional) Example roles needing this skill.
6.  **emergingRoles**: (Optional) List 2-4 emerging or rapidly evolving roles. For each:
    *   **roleName**: The role.
    *   **description**: What it is and why it's emerging (2-3 sentences).
    *   **typicalSkills**: (Optional) Common skills for this role.
7.  **industryInsights**: (Optional) Insights for 2-3 key industries. For each:
    *   **industryName**: The industry.
    *   **insightText**: Job market implications/trends (2-4 sentences).
    *   **growthOutlook**: (Optional) Brief comment on growth (e.g., 'Strong Growth').
8.  **salaryOutlook**: (Optional) General (1-2 sentences) qualitative comment on salary trends. Avoid specific numbers unless very general and well-known for the area.
9.  **keyTakeaways**: 3-5 actionable bullet points for job seekers based on these trends.
10. **userSkillsRelevance**: (Optional) If user skills were provided, a brief comment on their current market relevance.

Generate comprehensive and realistic information.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

const marketTrendsFlow = ai.defineFlow(
  {
    name: 'marketTrendsFlow',
    inputSchema: MarketTrendsInputSchema,
    outputSchema: MarketTrendsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

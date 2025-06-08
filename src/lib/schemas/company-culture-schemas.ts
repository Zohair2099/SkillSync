
import {z} from 'genkit';

// This schema is used by the client-side form in company-culture/page.tsx
// and by the server-side AI flow.
export const CompanyCulturePreferencesInputSchema = z.object({
  workLifeBalance: z.enum(["flexible", "moderate", "structured"]).describe("User's preference for work-life balance (e.g., flexible hours, standard 9-5, results-oriented)."),
  teamEnvironment: z.enum(["collaborative", "independent", "mixed"]).describe("Preferred team environment (e.g., highly collaborative, independent work focus, social/team events)."),
  innovationStyle: z.enum(["experimental", "stable", "balanced_risk"]).describe("Approach to innovation and risk (e.g., cutting-edge, proven methods, calculated risks)."),
  companySize: z.enum(["startup", "mid_size", "large_enterprise", "any"]).describe("Preferred company size (e.g., Startup (1-50), Mid-size (51-500), Large Enterprise (500+))."),
  decisionMaking: z.enum(["top_down", "bottom_up", "consensus_driven"]).describe("Preferred decision-making style within a company."),
  feedbackCulture: z.enum(["direct_frequent", "formal_periodic", "peer_driven"]).describe("Preferred feedback culture."),
  pace: z.enum(["fast_dynamic", "steady_predictable"]).describe("Preferred work pace (e.g., fast-paced and dynamic, or steady and predictable)."),
  learningOpportunities: z.boolean().describe("Importance of continuous learning and development opportunities."),
  socialImpactFocus: z.boolean().describe("Preference for companies with a strong social impact mission."),
  diversityAndInclusion: z.boolean().describe("Importance of strong diversity and inclusion initiatives and a welcoming environment for all."),
});
export type CompanyCulturePreferencesInput = z.infer<typeof CompanyCulturePreferencesInputSchema>;


// use server'

/**
 * @fileOverview Compares user skills against job requirements (optional) and identifies skill gaps.
 * Provides interview tips, suggests job categories, soft skills, learning resources, and mentorship advice.
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
    .describe('A list of specific hard skills required for the job (if provided) that the user is missing or has significantly less experience in than typically expected.'),
  suggestedHardSkillsResources: z
    .array(z.string())
    .describe('A list of detailed, actionable resources (e.g., specific online course platforms, book titles, project ideas) for learning the missing hard skills (if any). For each missing skill, provide 1-2 distinct resource suggestions.'),
  skillComparisonSummary: z
    .string()
    .describe('A summary of the skill comparison between the job description (if provided) and the user skills. If no job description, summarize the general strength and applicability of the user skills for common roles.'),
  interviewTips: z
    .array(z.string())
    .optional()
    .describe('A list of 3-5 helpful and actionable interview tips, provided if no significant skill gaps are found OR if no job description was given and skills are generally strong. Tailor tips to the context (e.g., technical interview, behavioral).'),
  suggestedJobCategories: z
    .array(z.string())
    .optional()
    .describe('If no job description was provided, this lists 2-3 types of job roles or career paths that might align well with the user\'s skills. If a job description was provided, this field should be empty or omitted.'),
  suggestedSoftSkills: z
    .array(z.string())
    .optional()
    .describe("A list of 2-4 relevant soft skills (e.g., Communication, Teamwork, Problem Solving, Adaptability) that are generally valuable or specifically for the type of role implied by the user's skills or job description. Include a brief (1-sentence) explanation of why each is important."),
  mentorshipAdvice: z
    .string()
    .optional()
    .describe("General advice on the importance of mentorship, how to find mentors (e.g., professional networks, industry events, online platforms like LinkedIn), and potentially suggesting types of well-known figures or communities in relevant fields to follow for insights (e.g., 'Thought leaders in AI on X/Twitter', 'Open-source project communities on GitHub'). Keep this actionable but generic.")
});
export type JobFocusedSkillComparisonOutput = z.infer<typeof JobFocusedSkillComparisonOutputSchema>;

export async function jobFocusedSkillComparison(input: JobFocusedSkillComparisonInput): Promise<JobFocusedSkillComparisonOutput> {
  return jobFocusedSkillComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobFocusedSkillComparisonPrompt',
  input: {schema: JobFocusedSkillComparisonInputSchema},
  output: {schema: JobFocusedSkillComparisonOutputSchema},
  prompt: `You are an expert career advisor and skills analyst. You will be given a list of user skills, and optionally, a job description.

User Skills:
{{#each userSkills}}
- {{this.name}}{{#if this.experience}} ({{this.experience}} years experience){{/if}}
{{/each}}

{{#if jobDescription}}
Job Description:
{{{jobDescription}}}
{{else}}
The user has not provided a specific job description. Please provide a general analysis of their skillset and suggest some suitable job categories, along with advice applicable to a general job search.
{{/if}}

Your tasks:
1.  Skill Comparison Summary: Provide a concise (2-3 sentences) summary of how the user's skills align with the job description (if provided). If no job description, summarize the general strength and applicability of the user's skills for common roles.
2.  Missing Skills: If a job description is provided, identify specific hard skills required by the job that the user appears to be missing or has significantly less experience in than typically expected. If no job description, or if all listed job skills are met, this should be an empty array.
3.  Suggested Hard Skills Resources: For each missing hard skill (if any), provide 1-2 distinct, detailed, and actionable suggestions for learning resources. Examples: "For [Missing Skill], explore advanced courses on Coursera like '[Specific Course Name]' or contribute to open-source projects like '[Example Project]' to gain practical experience." or "To learn [Missing Skill], read 'Highly Recommended Book Title' and practice with exercises from [Specific Website/Platform]."
4.  Interview Tips:
    *   If a job description was provided AND no significant skills are missing, OR
    *   If no job description was provided AND the user has a reasonably strong and diverse skillset,
    Then provide a list of 3-5 helpful and actionable interview tips (e.g., "Research the company's recent projects and align your answers to their values.", "Prepare 3 STAR method stories for common behavioral questions like 'Tell me about a time you failed'.", "For technical roles, refresh your knowledge on core data structures and algorithms.").
    *   Otherwise (if skills are missing for a provided job), do not provide interview tips (make it an empty array or omit the field).
5.  Suggested Job Categories:
    *   If no jobDescription was provided, suggest 2-3 types of job roles or career paths (e.g., "Data Analyst", "Frontend Developer", "Digital Marketing Specialist") that seem like a good fit for the user's skills. Keep these brief.
    *   If a jobDescription was provided, this field should be an empty array or omitted.
6.  Suggested Soft Skills: Provide a list of 2-4 relevant soft skills (e.g., "Communication: Clearly articulating your ideas is crucial in collaborative environments.", "Problem-Solving: Demonstrate your ability to analyze complex issues and devise effective solutions."). These should be generally valuable or tailored if a job context is clear. For each, include a brief (1-sentence) explanation of its importance.
7.  Mentorship Advice: Provide actionable advice on the importance of mentorship. Suggest ways to find mentors, such as "Leverage LinkedIn to connect with professionals in your target field; many are open to brief informational interviews." or "Attend industry meetups or virtual conferences to network." You can also suggest following thought leaders or specific communities, e.g., "Follow key influencers in [User's Field, e.g., Cybersecurity] on platforms like X (formerly Twitter) or Medium for trends and insights." or "Engage with relevant open-source communities on GitHub or forums like Stack Overflow." Make this 2-3 sentences.

Structure your response strictly according to the output schema.
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

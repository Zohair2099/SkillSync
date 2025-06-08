
'use server';

/**
 * @fileOverview Compares user skills against job requirements (optional) and identifies skill gaps.
 * Provides interview tips, suggests job categories (with potential salary ranges), soft skills, learning resources, mentorship advice, and a skill development roadmap.
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

// This schema object is not exported
const JobFocusedSkillComparisonInputSchema = z.object({
  jobDescription: z
    .string()
    .optional()
    .describe('The full text description of the job posting. This is optional. If not provided, a general career analysis will be performed.'),
  userSkills: z.array(SkillSchema).describe('A list of skills the user possesses, optionally with years of experience.'),
});
export type JobFocusedSkillComparisonInput = z.infer<typeof JobFocusedSkillComparisonInputSchema>;

const SuggestedJobCategorySchema = z.object({
    categoryName: z.string().describe("The name of the suggested job category or career path."),
    estimatedSalaryRange: z.string().optional().describe("An estimated typical annual salary range for this category (e.g., '$70,000 - $90,000 USD'). Omit if not commonly known or too variable.")
});

const RoadmapStepSchema = z.object({
  stepTitle: z.string().describe("A concise title for this step or topic in the roadmap (e.g., 'Master JavaScript Fundamentals')."),
  stepDetails: z.string().describe("More detailed explanation, key concepts, or sub-tasks for this step."),
  difficulty: z.string().optional().describe("Estimated difficulty (e.g., 'Beginner', 'Intermediate', 'Advanced', or 'Foundational').")
});

// This schema object is not exported
const JobFocusedSkillComparisonOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('A list of specific hard skills explicitly mentioned or strongly implied by the job (if provided) that the user is missing or has significantly less experience in than typically expected. If no job description, or if all skills are met, this should be an empty array.'),
  suggestedHardSkillsResources: z
    .array(z.string())
    .describe('A list of 2-3 detailed, actionable resources (e.g., specific online course platforms like Coursera/Udemy, specific book titles, project ideas, relevant certifications) for learning the missing hard skills (if any). For each missing skill, provide 1-2 distinct resource suggestions.'),
  skillComparisonSummary: z
    .string()
    .describe('A concise (2-4 sentences) summary of the skill comparison. If a job description is provided, focus on alignment. If no job description, summarize the general strength, applicability of user skills, and potential career directions.'),
  interviewTips: z
    .array(z.string())
    .optional()
    .describe('A list of 3-5 helpful and actionable interview tips. Provide if no significant skill gaps are found for a specific job OR if no job description was given and skills are generally strong. Tailor tips to the context (e.g., technical interview, behavioral questions, portfolio presentation).'),
  suggestedJobCategories: z
    .array(SuggestedJobCategorySchema) 
    .optional()
    .describe('If no job description was provided, this lists 3-5 types of job roles or career paths that might align well with the user\'s skills, including an optional estimated salary range for each. If a job description was provided, this field should be empty or omitted.'),
  suggestedSoftSkills: z
    .array(z.string())
    .optional()
    .describe("A list of 2-4 relevant soft skills (e.g., 'Communication: Clearly articulating your ideas is crucial...', 'Teamwork: Highlight your experience in collaborative projects...') that are generally valuable or specifically for the type of role implied. Include a brief (1-sentence) explanation of why each is important."),
  mentorshipAdvice: z
    .string()
    .optional()
    .describe("General advice (2-3 sentences) on the importance of mentorship. Suggest actionable ways to find mentors (e.g., 'Leverage LinkedIn to connect with professionals...', 'Attend industry meetups or virtual conferences...'). Optionally, mention types of thought leaders or communities (e.g., 'Follow AI experts on X/Twitter', 'Join open-source communities on GitHub')."),
  skillDevelopmentRoadmap: z
    .array(RoadmapStepSchema)
    .optional()
    .describe("A structured, ordered roadmap of 3-7 steps for acquiring missing skills or advancing in a career path, from foundational to advanced. Include if missing skills are identified or if general career advice is sought without a specific job description.")
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
Your analysis should focus on this specific job.
{{else}}
The user has not provided a specific job description. Please perform a general career analysis based on their skills.
{{/if}}

Your tasks are to provide:
1.  **Skill Comparison Summary**: A concise (2-4 sentences) summary. If a job description is provided, focus on how the user's skills align with it. If no job description, summarize the general strength and applicability of the user's skills and suggest potential career directions.
2.  **Missing Skills**: If a job description is provided, identify specific hard skills explicitly mentioned or strongly implied by the job that the user appears to be missing or has significantly less experience in. If no job description or all skills are met, this should be an empty array.
3.  **Suggested Hard Skills Resources**: For each missing hard skill (if any), provide 1-2 distinct, detailed, and actionable suggestions for learning resources. Examples: "For [Missing Skill], explore advanced courses on Coursera like '[Specific Course Name]' or contribute to open-source projects like '[Example Project]'." or "To learn [Missing Skill], read 'Highly Recommended Book Title' and practice with exercises from [Specific Website/Platform], or consider [Relevant Certification]." Aim for specific and high-quality resources.
4.  **Interview Tips**: (Optional) Provide 3-5 helpful and actionable interview tips if:
    *   A job description was provided AND no significant skills are missing, OR
    *   No job description was provided AND the user has a reasonably strong/diverse skillset.
    Tailor tips to the context (e.g., "For behavioral questions, use the STAR method to structure answers about your experiences.", "Prepare questions to ask the interviewer that show your genuine interest in the role and company."). If significant skills are missing for a provided job, this field can be omitted or be an empty array.
5.  **Suggested Job Categories**: (Optional)
    *   If NO jobDescription was provided, suggest 3-5 types of job roles or career paths (e.g., "Data Analyst", "Frontend Developer", "Digital Marketing Specialist") that seem like a good fit. For each category, provide an 'estimatedSalaryRange' (e.g., "$70,000 - $90,000 USD per year") if such information is commonly available and reasonably stable for that role type. If salary is highly variable or unknown, omit it for that category.
    *   If a jobDescription WAS provided, this field should be an empty array or omitted.
6.  **Suggested Soft Skills**: (Optional) Provide a list of 2-4 relevant soft skills with a brief (1-sentence) explanation of their importance in a professional context or for the type of role implied. Examples: "Problem-Solving: Demonstrate your ability to analyze complex issues and devise effective solutions.", "Adaptability: Show your capacity to adjust to new challenges and work environments effectively."
7.  **Mentorship Advice**: (Optional) Provide actionable advice (2-3 sentences) on finding mentors and the value of networking. Examples: "Seek mentors on LinkedIn by searching for professionals in your target roles and sending personalized connection requests.", "Attend virtual industry events or webinars to learn from experts and expand your network.", "Follow influential figures and communities in fields like [User's Field, if inferable, e.g., 'UX Design'] on platforms such as Medium or X (formerly Twitter) for insights."
8.  **Skill Development Roadmap**: (Optional) If missing skills are identified OR if general career advice is being provided (no job description), generate a structured, step-by-step roadmap to guide the user.
    *   The roadmap should consist of 3-7 logical steps, ordered from foundational/easiest to more advanced/hardest (or a logical learning progression).
    *   For each step, provide a clear 'stepTitle' (e.g., "Master JavaScript Fundamentals", "Build a Portfolio Project with React", "Learn Advanced Python for Data Science").
    *   Also provide 'stepDetails' with a brief explanation or key sub-topics for that step.
    *   Optionally, indicate a 'difficulty' (e.g., "Beginner", "Intermediate", "Advanced", "Foundational") for each step.
    *   This roadmap should be practical and actionable. Focus on skills relevant to the identified gaps or the user's general profile. If no specific skills are missing (e.g., user is well-qualified for a job or has very strong general skills), this roadmap can focus on general career advancement or specialization within their field.

Structure your response strictly according to the output schema. Ensure all fields are populated appropriately based on the context (job description provided or not).
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

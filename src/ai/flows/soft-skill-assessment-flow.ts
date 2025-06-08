
'use server';
/**
 * @fileOverview Assesses user's soft skills based on their answers to a predefined set of questions.
 *
 * - assessSoftSkills - A function that handles the soft skill assessment process.
 * - SoftSkillAssessmentInput - The input type for the assessSoftSkills function.
 * - SoftSkillAssessmentOutput - The return type for the assessSoftSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionAnswerSchema = z.object({
  question: z.string().describe('The question asked to the user.'),
  answer: z.string().describe('The user\'s answer to the question.'),
});

// This schema object is not exported
const SoftSkillAssessmentInputSchema = z.object({
  answers: z.array(QuestionAnswerSchema).describe('A list of questions and the user\'s answers.'),
});
export type SoftSkillAssessmentInput = z.infer<typeof SoftSkillAssessmentInputSchema>;

const SpecificSkillAssessmentSchema = z.object({
  skillName: z.string().describe('The name of the soft skill being assessed (e.g., Communication, Problem-Solving, Teamwork, Leadership, Adaptability, Creativity, Time Management, Emotional Intelligence).'),
  assessment: z.string().describe('A detailed textual assessment of the user\'s proficiency in this skill, based on their answers. This should be 2-3 sentences.'),
  strengths: z.array(z.string()).describe('A list of 1-3 key strengths identified for this specific soft skill from the user\'s answers.'),
  areasForImprovement: z.array(z.string()).describe('A list of 1-3 specific areas where the user can improve this soft skill, based on their answers.'),
  developmentTips: z.array(z.string()).describe('A list of 1-2 actionable tips or resources for developing this soft skill.'),
});

// This schema object is not exported
const SoftSkillAssessmentOutputSchema = z.object({
  overallSummary: z.string().describe('A concise (3-5 sentences) overall summary of the user\'s soft skill profile based on their answers. Highlight key themes and general takeaways.'),
  skillAssessments: z.array(SpecificSkillAssessmentSchema).describe('An array of assessments for various key soft skills. Aim to cover at least 5-7 distinct soft skills evident from the answers (e.g., Communication, Problem-Solving, Teamwork, Leadership, Adaptability, Time Management, Creativity, Emotional Intelligence).'),
});
export type SoftSkillAssessmentOutput = z.infer<typeof SoftSkillAssessmentOutputSchema>;

export async function assessSoftSkills(input: SoftSkillAssessmentInput): Promise<SoftSkillAssessmentOutput> {
  return softSkillAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'softSkillAssessmentPrompt',
  input: {schema: SoftSkillAssessmentInputSchema},
  output: {schema: SoftSkillAssessmentOutputSchema},
  prompt: `You are an expert career coach and soft skills analyst. You will be given a series of questions and the user's answers to them.
Your task is to analyze these answers to assess the user's soft skills.

User's Questions and Answers:
{{#each answers}}
Question: {{this.question}}
Answer: {{this.answer}}

{{/each}}

Based on ALL the answers provided, please provide:
1.  **Overall Summary**: A concise (3-5 sentences) overall summary of the user's soft skill profile. Highlight key themes, general strengths, and potential overarching areas for development.
2.  **Skill Assessments**: An array of assessments for at least 5-7 distinct, relevant soft skills. For each skill, ensure you identify:
    *   **skillName**: The specific soft skill (e.g., "Communication", "Problem-Solving", "Teamwork", "Leadership", "Adaptability", "Creativity", "Time Management", "Emotional Intelligence"). Choose skills that are clearly inferable from the user's answers.
    *   **assessment**: A detailed (2-3 sentences) textual evaluation of the user's proficiency in **this specific skill**, drawing evidence from their answers.
    *   **strengths**: 1-3 bullet points highlighting specific strengths demonstrated for **this skill**.
    *   **areasForImprovement**: 1-3 bullet points identifying areas for growth for **this skill**.
    *   **developmentTips**: 1-2 actionable tips or resources for improving **this skill**.

Be constructive and provide practical, actionable feedback. Focus on insights derived directly from the user's responses.
If certain soft skills are not clearly demonstrated or assessable from the answers, do not invent an assessment for them; focus on what is evident.
Ensure your output strictly adheres to the defined SoftSkillAssessmentOutputSchema.
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

const softSkillAssessmentFlow = ai.defineFlow(
  {
    name: 'softSkillAssessmentFlow',
    inputSchema: SoftSkillAssessmentInputSchema,
    outputSchema: SoftSkillAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

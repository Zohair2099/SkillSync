
'use server';
/**
 * @fileOverview Provides AI-powered interview practice capabilities.
 * - generateInterviewQuestions: Generates interview questions for a given job title.
 * - evaluateInterviewAnswer: Evaluates a user's answer to an interview question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for generating interview questions
const GenerateInterviewQuestionsInputSchema = z.object({
  jobTitle: z.string().describe('The job title or role the user is practicing for (e.g., "Software Engineer", "Product Manager").'),
  numQuestions: z.number().min(3).max(10).default(5).describe('The number of interview questions to generate.'),
  questionCategories: z.array(z.enum(["behavioral", "technical", "situational", "general", "role-specific"])).optional().describe("Optional: Preferred categories of questions. If omitted, a mix tailored to the role will be generated."),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated interview questions tailored to the job title.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

// Schema for evaluating an interview answer
const EvaluateInterviewAnswerInputSchema = z.object({
  jobTitle: z.string().describe('The job title or role the user is practicing for.'),
  question: z.string().describe('The interview question that was asked.'),
  userAnswer: z.string().describe("The user's answer to the interview question."),
});
export type EvaluateInterviewAnswerInput = z.infer<typeof EvaluateInterviewAnswerInputSchema>;

const EvaluateInterviewAnswerOutputSchema = z.object({
  overallFeedback: z.string().describe("A concise overall assessment of the answer (2-4 sentences). Highlight key good points and main areas for improvement."),
  strengths: z.array(z.string()).describe("A list of 2-3 specific positive aspects or strengths demonstrated in the answer."),
  areasForImprovement: z.array(z.string()).describe("A list of 2-3 specific, actionable areas where the answer could be improved."),
  suggestedAlternative: z.string().optional().describe("If significantly beneficial, provide a brief example of how the answer, or a key part of it, could be rephrased for better impact or clarity."),
  // For behavioral questions, mention if STAR method was used effectively or could be.
  // For technical questions, comment on correctness and clarity of explanation.
});
export type EvaluateInterviewAnswerOutput = z.infer<typeof EvaluateInterviewAnswerOutputSchema>;


// --- Wrapper Functions for Flows ---

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

export async function evaluateInterviewAnswer(input: EvaluateInterviewAnswerInput): Promise<EvaluateInterviewAnswerOutput> {
  return evaluateInterviewAnswerFlow(input);
}


// --- Genkit Prompts and Flows ---

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert Interview Coach AI.
Given a job title: **{{{jobTitle}}}**
And a request for **{{numQuestions}}** questions.
{{#if questionCategories}}
And preferred question categories: {{#each questionCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{/if}}

Please generate a diverse set of **{{numQuestions}}** realistic interview questions appropriate for the specified job title.
If question categories are provided, try to include questions from those categories. Otherwise, generate a balanced mix (e.g., behavioral, technical relevant to the role, situational, general fit).
Ensure questions are clear, concise, and typical for an interview for this role.
Focus on creating questions that allow the candidate to demonstrate their skills, experience, and problem-solving abilities.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const evaluateAnswerPrompt = ai.definePrompt({
  name: 'evaluateInterviewAnswerPrompt',
  input: {schema: EvaluateInterviewAnswerInputSchema},
  output: {schema: EvaluateInterviewAnswerOutputSchema},
  prompt: `You are an expert Interview Coach AI providing feedback.
The user is practicing for the role of: **{{{jobTitle}}}**
The question asked was: "**{{{question}}}**"
The user's answer was: "**{{{userAnswer}}}**"

Please evaluate the user's answer. Provide constructive feedback including:
1.  **Overall Feedback**: A concise overall assessment (2-4 sentences).
2.  **Strengths**: 2-3 specific positive aspects of the answer.
3.  **Areas for Improvement**: 2-3 specific, actionable areas for improvement.
4.  **Suggested Alternative**: (Optional) If a part of the answer could be significantly improved by rephrasing, provide a brief example.

Consider the following when evaluating:
- Clarity and conciseness of the answer.
- Relevance to the question and the specified job role.
- For behavioral questions (like "Tell me about a time..."), assess if the STAR (Situation, Task, Action, Result) method was used or could have been used more effectively.
- For technical questions, assess correctness, depth of understanding, and clarity of explanation.
- Professionalism and tone.

Be encouraging but also direct in your feedback to help the user improve.
`,
  config: {
    safetySettings: [
       { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});


const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuestionsPrompt(input);
    return output || { questions: [] };
  }
);

const evaluateInterviewAnswerFlow = ai.defineFlow(
  {
    name: 'evaluateInterviewAnswerFlow',
    inputSchema: EvaluateInterviewAnswerInputSchema,
    outputSchema: EvaluateInterviewAnswerOutputSchema,
  },
  async (input) => {
    const {output} = await evaluateAnswerPrompt(input);
    if (!output) {
        throw new Error("AI failed to provide evaluation for the answer.");
    }
    return output;
  }
);

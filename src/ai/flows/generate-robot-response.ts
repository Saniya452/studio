'use server';

/**
 * @fileOverview An AI agent for generating responses from a robot assistant.
 *
 * - generateRobotResponse - A function that generates a robot's response to a user's query.
 * - GenerateRobotResponseInput - The input type for the generateRobotResponse function.
 * - GenerateRobotResponseOutput - The return type for the generateRobotResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRobotResponseInputSchema = z.object({
  query: z.string().describe('The user query to respond to.'),
});

export type GenerateRobotResponseInput = z.infer<typeof GenerateRobotResponseInputSchema>;

const GenerateRobotResponseOutputSchema = z.object({
  response: z.string().describe('The robot assistant response to the query.'),
});

export type GenerateRobotResponseOutput = z.infer<typeof GenerateRobotResponseOutputSchema>;

export async function generateRobotResponse(input: GenerateRobotResponseInput): Promise<GenerateRobotResponseOutput> {
  return generateRobotResponseFlow(input);
}

const generateRobotResponsePrompt = ai.definePrompt({
  name: 'generateRobotResponsePrompt',
  input: {schema: GenerateRobotResponseInputSchema},
  output: {schema: GenerateRobotResponseOutputSchema},
  prompt: `You are a helpful and friendly robot assistant named Gemini Buddy. Respond to the following user query:

{{{query}}}`,
});

const generateRobotResponseFlow = ai.defineFlow(
  {
    name: 'generateRobotResponseFlow',
    inputSchema: GenerateRobotResponseInputSchema,
    outputSchema: GenerateRobotResponseOutputSchema,
  },
  async input => {
    const {output} = await generateRobotResponsePrompt(input);
    return output!;
  }
);

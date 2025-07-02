'use server';

/**
 * @fileOverview A mood analyzer AI agent.
 *
 * - understandMood - A function that handles the mood analysis process.
 * - UnderstandMoodInput - The input type for the understandMood function.
 * - UnderstandMoodOutput - The return type for the understandMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandMoodInputSchema = z.object({
  message: z.string().describe('The message to analyze for mood.'),
});
export type UnderstandMoodInput = z.infer<typeof UnderstandMoodInputSchema>;

const UnderstandMoodOutputSchema = z.object({
  mood: z
    .string()
    .describe(
      'The overall mood of the message, e.g., happy, sad, angry, neutral.'
    ),
  intensity: z
    .number()
    .describe('The intensity of the mood, on a scale of 0 to 1.'),
  reason: z
    .string()
    .describe('The reason for the identified mood based on the message.'),
});
export type UnderstandMoodOutput = z.infer<typeof UnderstandMoodOutputSchema>;

export async function understandMood(input: UnderstandMoodInput): Promise<UnderstandMoodOutput> {
  return understandMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandMoodPrompt',
  input: {schema: UnderstandMoodInputSchema},
  output: {schema: UnderstandMoodOutputSchema},
  prompt: `You are a sentiment analysis expert. Analyze the mood of the following message and determine its intensity and the reason for the mood.

Message: {{{message}}}

Respond in a JSON format.
`,
});

const understandMoodFlow = ai.defineFlow(
  {
    name: 'understandMoodFlow',
    inputSchema: UnderstandMoodInputSchema,
    outputSchema: UnderstandMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

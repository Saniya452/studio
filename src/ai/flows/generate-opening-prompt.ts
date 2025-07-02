'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an engaging opening prompt for the robot assistant.
 *
 * The flow takes no input and returns a string that serves as the initial prompt for the user.
 * This helps the user understand the robot's capabilities and encourages interaction.
 *
 * @interface GenerateOpeningPromptOutput - The output type for the generateOpeningPrompt function.
 * @function generateOpeningPrompt - A function that generates the opening prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOpeningPromptOutputSchema = z.object({
  openingPrompt: z.string().describe('An engaging opening prompt for the robot assistant.'),
});

export type GenerateOpeningPromptOutput = z.infer<typeof GenerateOpeningPromptOutputSchema>;

export async function generateOpeningPrompt(): Promise<GenerateOpeningPromptOutput> {
  return generateOpeningPromptFlow({});
}

const prompt = ai.definePrompt({
  name: 'generateOpeningPromptPrompt',
  prompt: `You are a helpful and friendly robot assistant. Generate an engaging opening prompt to encourage the user to start a conversation.  Make it short and easy to understand. Focus on explaining what the robot can do.  Make sure to mention you can understand speech and generate voice responses.  Do not include any personal opinions or beliefs. Keep the response professional and respectful.

Opening Prompt:`,
  output: {schema: GenerateOpeningPromptOutputSchema},
});

const generateOpeningPromptFlow = ai.defineFlow(
  {
    name: 'generateOpeningPromptFlow',
    inputSchema: z.object({}),
    outputSchema: GenerateOpeningPromptOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);

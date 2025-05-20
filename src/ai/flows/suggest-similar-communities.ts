// Implemented Genkit flow for suggesting similar communities based on shared tags when no communities are found for a searched topic.

'use server';

/**
 * @fileOverview AI agent that suggests similar communities based on shared tags when no communities are found for a searched topic.
 *
 * - suggestSimilarCommunities - A function that handles the suggestion of similar communities.
 * - SuggestSimilarCommunitiesInput - The input type for the suggestSimilarCommunities function.
 * - SuggestSimilarCommunitiesOutput - The return type for the suggestSimilarCommunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarCommunitiesInputSchema = z.object({
  topicName: z.string().describe('The name of the topic for which to find similar communities.'),
  tags: z.array(z.string()).describe('An array of tags associated with the topic.'),
});
export type SuggestSimilarCommunitiesInput = z.infer<typeof SuggestSimilarCommunitiesInputSchema>;

const SuggestSimilarCommunitiesOutputSchema = z.object({
  communities: z.array(
    z.object({
      name: z.string().describe('The name of the suggested community.'),
      description: z.string().describe('A brief description of the community.'),
    })
  ).describe('A list of suggested similar communities.'),
});
export type SuggestSimilarCommunitiesOutput = z.infer<typeof SuggestSimilarCommunitiesOutputSchema>;

export async function suggestSimilarCommunities(input: SuggestSimilarCommunitiesInput): Promise<SuggestSimilarCommunitiesOutput> {
  return suggestSimilarCommunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarCommunitiesPrompt',
  input: {schema: SuggestSimilarCommunitiesInputSchema},
  output: {schema: SuggestSimilarCommunitiesOutputSchema},
  prompt: `Based on the topic "{{topicName}}" and its tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}, suggest a list of communities that would be relevant to the user.

  Each community in the list should have a name and a brief description. Focus on communities that share multiple tags or cover similar subtopics.
  Return no more than 5 communities.
  `,
});

const suggestSimilarCommunitiesFlow = ai.defineFlow(
  {
    name: 'suggestSimilarCommunitiesFlow',
    inputSchema: SuggestSimilarCommunitiesInputSchema,
    outputSchema: SuggestSimilarCommunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

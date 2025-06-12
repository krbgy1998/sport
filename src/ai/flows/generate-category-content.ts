
'use server';
/**
 * @fileOverview Generates rich, SEO-friendly content for sports categories.
 *
 * - generateCategoryContent - A function that generates descriptive content for a sports category.
 * - GenerateCategoryContentInput - The input type for the generateCategoryContent function.
 * - GenerateCategoryContentOutput - The return type for the generateCategoryContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCategoryContentInputSchema = z.object({
  categoryName: z
    .string()
    .describe('The name of the sports category (e.g., "Soccer", "Boxing").'),
});
export type GenerateCategoryContentInput = z.infer<typeof GenerateCategoryContentInputSchema>;

const GenerateCategoryContentOutputSchema = z.object({
  description: z.string().describe('The AI-generated SEO-friendly description for the sports category.'),
});
export type GenerateCategoryContentOutput = z.infer<typeof GenerateCategoryContentOutputSchema>;

export async function generateCategoryContent(input: GenerateCategoryContentInput): Promise<GenerateCategoryContentOutput> {
  return generateCategoryContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCategoryContentPrompt',
  input: {schema: GenerateCategoryContentInputSchema},
  output: {schema: GenerateCategoryContentOutputSchema},
  prompt: `You are an expert sports journalist and SEO content writer for a website called "sportsurge".

Your task is to generate a rich, engaging, and SEO-friendly description for the sports category: {{{categoryName}}}.

Instructions:
- The description should be suitable for display on the sportsurge website.
- The description must be **unique and original** for the sports category '{{{categoryName}}}', providing specific insights rather than generic statements.
- Highlight the excitement, key aspects, and common leagues/tournaments associated with {{{categoryName}}}.
- Incorporate relevant keywords naturally. For example:
    - If {{{categoryName}}} is "Soccer", mention terms like 'live soccer scores', 'football results', 'Premier League', 'Champions League', 'World Cup', 'goals', 'matches', 'teams', 'latest soccer action', 'football updates'.
    - If {{{categoryName}}} is "Boxing", mention 'live boxing matches', 'fight night results', 'championship belts', 'knockouts', 'undercard', 'main event', 'sweet science', 'ringside action'.
    - If {{{categoryName}}} is "Tennis", mention 'live tennis scores', 'ATP tour', 'WTA tour', 'Grand Slam tournaments', 'match points', 'aces', 'court coverage'.
    - If {{{categoryName}}} is "Basketball", mention 'live basketball scores', 'NBA action', 'college hoops', 'three-pointers', 'slam dunks', 'court battles', 'final buzzer'.
- The tone should be enthusiastic and informative.
- The output should be a single block of text, approximately 2-3 paragraphs long.
- Use varied sentence structures to ensure readability and engagement.
- Ensure the content explicitly mentions "sportsurge" as the go-to source for information related to {{{categoryName}}}.
- Conclude by reinforcing why sportsurge is the premier destination for '{{{categoryName}}}' enthusiasts and invite users to explore further.
- Focus on providing value to the reader and search engines.
`,
});

const generateCategoryContentFlow = ai.defineFlow(
  {
    name: 'generateCategoryContentFlow',
    inputSchema: GenerateCategoryContentInputSchema,
    outputSchema: GenerateCategoryContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate content for the category.");
    }
    return output;
  }
);


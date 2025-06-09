// src/ai/flows/summarize-news-article.ts
'use server';

/**
 * @fileOverview Summarizes sports news articles using AI.
 *
 * - summarizeNewsArticle - A function that summarizes a news article.
 * - SummarizeNewsArticleInput - The input type for the summarizeNewsArticle function.
 * - SummarizeNewsArticleOutput - The return type for the summarizeNewsArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNewsArticleInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the news article to be summarized.'),
});
export type SummarizeNewsArticleInput = z.infer<typeof SummarizeNewsArticleInputSchema>;

const SummarizeNewsArticleOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the news article.'),
  shouldSummarize: z
    .boolean()
    .describe(
      'Whether the article should be summarized. If the article is short and easy to understand, shouldSummarize should be false.'
    ),
});
export type SummarizeNewsArticleOutput = z.infer<typeof SummarizeNewsArticleOutputSchema>;

export async function summarizeNewsArticle(input: SummarizeNewsArticleInput): Promise<SummarizeNewsArticleOutput> {
  return summarizeNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsArticlePrompt',
  input: {schema: SummarizeNewsArticleInputSchema},
  output: {schema: SummarizeNewsArticleOutputSchema},
  prompt: `You are an AI expert in summarization. You are provided the content of a sports news article.

  Your task is to:
  1. Determine if the article needs to be summarized. Articles that are short, simple and easy to understand should not be summarized, in which case, set the shouldSummarize output field to false.
  2. If the article needs to be summarized (is long, complex, or difficult to understand), create a summary of the article.

  Article content: {{{articleContent}}}`,
});

const summarizeNewsArticleFlow = ai.defineFlow(
  {
    name: 'summarizeNewsArticleFlow',
    inputSchema: SummarizeNewsArticleInputSchema,
    outputSchema: SummarizeNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

"use client";

import type { NewsArticle } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { summarizeNewsArticle } from "@/ai/flows/summarize-news-article";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

interface NewsArticleCardProps {
  article: NewsArticle;
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryRequested, setSummaryRequested] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummaryRequested(true);

    toast({
      title: "Summarizing Article",
      description: "AI is working on summarizing the article...",
    });

    try {
      const result = await summarizeNewsArticle({ articleContent: article.content });
      if (result.shouldSummarize) {
        setSummary(result.summary);
        toast({
          title: "Summary Ready!",
          description: "The article summary has been generated.",
        });
      } else {
        setSummary("This article is concise and doesn't require a summary.");
         toast({
          title: "No Summary Needed",
          description: "The article is already concise.",
        });
      }
    } catch (err) {
      console.error("Error summarizing article:", err);
      setError("Failed to summarize the article. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to summarize the article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow duration-200 hover:shadow-xl">
      <div className="relative w-full h-48">
        <Image
          src={article.imageUrl}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={article.imageAiHint || "sports action"}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
          <a href={`/news/${article.id}`}>{article.title}</a>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {article.category} - {article.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
        {summaryRequested && (
          <div className="mt-4 p-3 bg-secondary/50 rounded-md">
            {isLoading && <p className="text-sm text-primary flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating summary...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {summary && !isLoading && (
              <>
                <h4 className="text-sm font-semibold mb-1 text-foreground font-headline">AI Summary:</h4>
                <p className="text-sm text-muted-foreground">{summary}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSummarize} 
          disabled={isLoading || summaryRequested}
          className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {summaryRequested ? (summary ? "Summary Generated" : "Concise Article") : "Summarize with AI"}
        </Button>
      </CardFooter>
    </Card>
  );
}

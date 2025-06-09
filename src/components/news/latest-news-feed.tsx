import type { NewsArticle } from "@/types";
import { NewsArticleCard } from "./news-article-card";

// Mock data for demonstration
const mockNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Titans Clash in Epic Football Final",
    excerpt: "The much-anticipated final saw an underdog victory after a grueling match that went into extra time.",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "football game",
    category: "Football",
    date: "October 26, 2023",
    content: "The stadium was roaring as the City Wanderers faced off against the Northern Kings. From the first whistle, it was clear this would be a battle of titans. The Wanderers, typically dominant, found themselves on the back foot early as the Kings pressed high and hard. A stunning free-kick from Kings' captain, Alex Stone, opened the scoring in the 20th minute. The Wanderers fought back, equalizing just before halftime with a controversial penalty converted by star striker, Sam Rivera. The second half was a tense affair with chances at both ends, but neither team could find a winner. Extra time beckoned, and it was in the 115th minute that a moment of brilliance from Kings' substitute, Maria Chen, sealed their historic victory with a long-range screamer. This victory marks the Kings' first major trophy in over a decade and sends their fans into delirium."
  },
  {
    id: "2",
    title: "Hoops Sensation: Record-Breaking Basketball Game",
    excerpt: "A new league record was set last night in a game that analysts are calling one of the best of the decade.",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "basketball action",
    category: "Basketball",
    date: "October 25, 2023",
    content: "Last night's basketball game between the Dragons and the Vipers was one for the history books. Not only did it feature end-to-end action, but it also saw Vipers' point guard, Jordan Lee, break the single-game assist record with an incredible 28 assists. The game itself was a high-scoring affair, with the final scoreline reading 135-130 in favor of the Vipers. Both teams shot exceptionally well from beyond the arc, contributing to the offensive explosion. This game is already being hailed as an instant classic and a testament to the incredible talent in the league. It was a very long and complicated game that required a lot of skill from both teams. The fans were on the edge of their seats for the entire duration of the match."
  },
  {
    id: "3",
    title: "Short & Sweet: Quick Sports Update",
    excerpt: "A very brief update on today's tennis results.",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "tennis court",
    category: "Tennis",
    date: "October 24, 2023",
    content: "In today's tennis action, the top seed advanced to the semi-finals after a straight-sets victory. The match was quick and decisive."
  },
   {
    id: "4",
    title: "Grand Slam Glory: A New Champion Emerges",
    excerpt: "The underdog fought through five grueling sets to claim their first Grand Slam title in a stunning upset.",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "tennis champion",
    category: "Tennis",
    date: "October 23, 2023",
    content: "The final match of the Grand Slam tournament was an absolute spectacle of grit, determination, and skill. Facing the reigning champion, the challenger, ranked outside the top 20, played the match of their life. The first set went to the champion, but the challenger roared back to take the next two sets with aggressive baseline play and pinpoint accuracy. The fourth set was a nail-biter, going to a tie-break which the champion narrowly won, forcing a decider. In the fifth set, momentum swung back and forth, with both players showing signs of fatigue but refusing to yield. Ultimately, a crucial break of serve in the ninth game gave the challenger the opportunity to serve for the championship, an opportunity they seized with clinical precision, closing out the match and collapsing to the ground in a mixture of exhaustion and elation. This victory is a testament to their hard work and has shaken up the world tennis rankings."
  },
];

export function LatestNewsFeed() {
  // In a real app, you would fetch these articles from an API
  const articles = mockNewsArticles;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

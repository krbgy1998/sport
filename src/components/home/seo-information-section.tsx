
// src/components/home/seo-information-section.tsx
'use client';

import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent } from "@/components/ui/card";

export default function SeoInformationSection() {
  return (
    <section aria-labelledby="team-information-seo-title" className="mt-12">
      <SectionTitle id="team-information-seo-title" title="sportsurge v3" />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-0">
            Your Premier Destination for Sporting Insights: sportsurge
          </h3>
          <p className="text-muted-foreground mb-4">
            Welcome to sportsurge, where we unlock a universe of comprehensive team information and live sports action. Whether you're meticulously tracking your favorite NFL franchise's journey through the season, following the dynamic plays of an NBA powerhouse, keeping pace with top-tier soccer clubs across global leagues, or diving deep into the stats of MLB and NHL games, sportsurge is your definitive source. We provide the detailed statistics, rich historical data, and insightful analysis that sports enthusiasts crave. With sportsurge, you get more than just scores; you get a deeper understanding of the game.
          </p>
          <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-4">
            sportsurge: More Than Just Scores
          </h3>
          <p className="text-muted-foreground mb-4">
            At sportsurge, our platform is meticulously designed to bring you closer to the teams and sports you love. We offer an extensive repository of information that extends far beyond basic score reporting. Discover detailed player rosters, analyze team performance trends over time, explore head-to-head records for upcoming matchups, and delve into advanced metrics. Every piece of content on sportsurge is curated to significantly enhance your sports viewing and engagement experience, making us the go-to sportsurge hub for fans who demand depth.
          </p>
          <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-4">
            The Ultimate sportsurge Hub for Every Fan
          </h3>
          <p className="text-muted-foreground mb-4">
            Stay informed, stay ahead, and stay engaged with sportsurge's dedicated team and sports information hub. We are committed to being your ultimate resource for sports knowledge, offering insights that help you understand every critical play, every pivotal game, and the narrative of every season across a multitude of sports. From pre-game analysis to post-game breakdowns, sportsurge delivers.
          </p>
          <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-4">
            Live Action and In-Depth Coverage on sportsurge
          </h3>
          <p className="text-muted-foreground">
            Not only does sportsurge provide rich historical data and team insights, but we also connect you to the thrill of live sports. Find information on where to catch live streams, get up-to-the-minute score updates, and access schedules for a wide array of sports including Football, Basketball, Baseball, Hockey, Soccer, MMA, Boxing, Tennis, Golf, and even WWE events. Trust sportsurge to be your comprehensive guide to the world of sports.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

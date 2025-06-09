
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SportsCategoryGrid } from "@/components/sports/sports-category-grid";
import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section aria-labelledby="sports-categories-title">
          <SectionTitle id="sports-categories-title" title="sportsurge" />
          <p className="text-muted-foreground mb-6 text-center md:text-left">
            Welcome to sportsurge, your premier hub for a diverse range of sports! 
            Whether you're looking for live soccer scores, basketball highlights, NFL action, or updates from many other sports, 
            sportsurge has you covered. Explore our categories below to find the latest scores, news, and in-depth information.
          </p>
          <SportsCategoryGrid />
        </section>

        <section aria-labelledby="team-information-seo-title" className="mt-12">
          <SectionTitle id="team-information-seo-title" title="Deep Dive into Team Information with sportsurge" />
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-0">
                Comprehensive Sporting Insights
              </h3>
              <p className="text-muted-foreground mb-4">
                Unlock a world of comprehensive team information with sportsurge. Whether you're tracking your favorite NFL franchise, 
                following an NBA powerhouse, or keeping up with top soccer clubs globally, sportsurge provides the detailed stats, 
                historical data, and insightful analysis you need. 
              </p>
              <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-4">
                Beyond the Scores
              </h3>
              <p className="text-muted-foreground mb-4">
                Our platform is dedicated to bringing you closer to the teams you love, offering a rich repository of information that goes beyond the scores.
                Discover player rosters, team performance trends, head-to-head records, and much more, all curated to enhance your 
                sports experience on sportsurge. 
              </p>
              <h3 className="text-xl font-semibold font-headline text-foreground mb-2 mt-4">
                Your Ultimate Sportsurge Hub
              </h3>
              <p className="text-muted-foreground">
                Stay informed and ahead of the game with sportsurge's dedicated team information hub. It's your ultimate resource for sports knowledge, 
                helping you understand every play, every game, and every season.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

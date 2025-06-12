
import dynamic from 'next/dynamic';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SportsCategoryGrid } from "@/components/sports/sports-category-grid";
import { SectionTitle } from "@/components/shared/section-title";

const DynamicSeoInformationSection = dynamic(() => import('@/components/home/seo-information-section'), {
  loading: () => <div className="mt-12"><SectionTitle title="sportsurge v3" /><div className="h-60 w-full bg-card rounded-lg animate-pulse"></div></div>,
});

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section aria-labelledby="sports-categories-title">
          <SectionTitle as="h1" id="sports-categories-title" title="sportsurge" />
          <p className="text-muted-foreground mb-6 text-center md:text-left">
            Welcome to sportsurge, your premier hub for a diverse range of sports! 
            Whether you're looking for live soccer scores, basketball highlights, NFL action, or updates from many other sports, 
            sportsurge has you covered. Explore our categories below to find the latest scores, news, and in-depth information.
          </p>
          <SportsCategoryGrid />
        </section>

        <DynamicSeoInformationSection />
      </main>
      <Footer />
    </div>
  );
}

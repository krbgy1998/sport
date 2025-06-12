
import type { Metadata, ResolvingMetadata } from 'next';
import { sportCategories as allSportCategoriesDetails, getCategoryDetails, CategoryDetails } from '@/lib/sports-data.tsx';
import CategoryClientContent from '@/components/category/category-client-content';
import { generateCategoryContent } from '@/ai/flows/generate-category-content';

const CURRENT_CATEGORY_ID = "tennis";

export async function generateMetadata(
  _: unknown, // Placeholder for params
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categoryId = CURRENT_CATEGORY_ID;
  const categoryDetails = getCategoryDetails(categoryId, allSportCategoriesDetails);

  if (!categoryDetails) {
    return {
      title: 'Category Not Found',
      description: 'The sports category you are looking for does not exist on sportsurge.',
      openGraph: {
        title: 'Category Not Found | sportsurge',
        description: 'The sports category you are looking for does not exist on sportsurge.',
      },
      twitter: {
        title: 'Category Not Found | sportsurge',
        description: 'The sports category you are looking for does not exist on sportsurge.',
      }
    };
  }

  const categoryName = categoryDetails.name;
  const newPageTitle = `Sportsurge ${categoryName} - Live ${categoryName} Matches, Fixtures & Results`;
  const metaDescription = categoryDetails.metaDescription || `Get live ${categoryName.toLowerCase()} scores (ATP, WTA), latest news, schedules, and in-depth updates on sportsurge. Your premier source for all ${categoryName.toLowerCase()} action.`;
  const canonicalUrlPath = `/${categoryId}`;
  const ogImageUrl = `https://placehold.co/1200x630.png`; 
  const baseKeywords = ['live scores', 'results', 'news', 'schedule', 'updates', 'sportsurge', 'matches', 'fixtures', 'ATP', 'WTA', 'Grand Slam'];
  const categoryKeywords = categoryName.toLowerCase().split(' ').map(k => `${categoryName} ${k}`);
  const keywords = [categoryName, ...baseKeywords, ...categoryKeywords];

  return {
    title: {
      absolute: newPageTitle,
    },
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrlPath, 
    },
    openGraph: {
      title: newPageTitle,
      description: metaDescription,
      url: canonicalUrlPath, 
      siteName: 'sportsurge',
      images: [
        {
          url: ogImageUrl, 
          width: 1200,
          height: 630,
          alt: `Live ${categoryName} matches, fixtures, and results on Sportsurge`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: newPageTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function TennisPage() {
  const categoryId = CURRENT_CATEGORY_ID;
  const categoryDetails = getCategoryDetails(categoryId, allSportCategoriesDetails);
  
  let description = categoryDetails?.onPageContent || null;
  if (categoryDetails?.name) {
    try {
      const aiContent = await generateCategoryContent({ categoryName: categoryDetails.name });
      if (aiContent && aiContent.description) {
        description = aiContent.description;
      }
    } catch (error) {
      console.error(`Failed to generate AI content for ${categoryDetails.name} on server:`, error);
    }
  }

  return <CategoryClientContent categoryDetails={categoryDetails} initialDescription={description} />;
}

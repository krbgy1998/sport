
import type { Metadata, ResolvingMetadata } from 'next';
import { sportCategories as allSportCategoriesDetails, getCategoryDetails, CategoryDetails } from '@/lib/sports-data.tsx'; // Use .tsx for detailed data
import CategoryClientContent from '@/components/category/category-client-content';
import { generateCategoryContent } from '@/ai/flows/generate-category-content';

type Props = {
  params: { categoryId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categoryId = params.categoryId;
  const categoryDetails = getCategoryDetails(categoryId, allSportCategoriesDetails);

  if (!categoryDetails) {
    return {
      title: 'Category Not Found', // Will be combined with template from layout
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
  // New title format
  const newPageTitle = `Sportsurge ${categoryName} - Live ${categoryName} Matches, Fixtures & Results`;

  const metaDescription = categoryDetails.metaDescription || `Get live ${categoryName.toLowerCase()} scores, latest news, schedules, and in-depth updates on sportsurge. Your premier source for all ${categoryName.toLowerCase()} action.`;
  const canonicalUrlPath = `/category/${categoryId}`;
  
  const ogImageUrl = `https://placehold.co/1200x630.png`; 

  const baseKeywords = ['live scores', 'results', 'news', 'schedule', 'updates', 'sportsurge', 'matches', 'fixtures'];
  const categoryKeywords = categoryName.toLowerCase().split(' ').map(k => `${categoryName} ${k}`);
  const keywords = [categoryName, ...baseKeywords, ...categoryKeywords];


  return {
    title: {
      absolute: newPageTitle, // Use absolute to override layout template
    },
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrlPath, 
    },
    openGraph: {
      title: newPageTitle, // Use the new page title for OG
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
      title: newPageTitle, // Use the new page title for Twitter
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const categoryId = params.categoryId;
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
      // Fallback to static description is already handled by 'description' initial value
    }
  }

  return <CategoryClientContent categoryDetails={categoryDetails} initialDescription={description} />;
}

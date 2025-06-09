
import type { Metadata, ResolvingMetadata } from 'next';
import { sportCategories as allSportCategoriesDetails, getCategoryDetails, CategoryDetails } from '@/lib/sports-data.tsx'; // Use .tsx for detailed data
import CategoryClientContent from '@/components/category/category-client-content';
// Removed: import { generateCategoryContent } from '@/ai/flows/generate-category-content';

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
      title: 'Category Not Found | sportsurge',
      description: 'The sports category you are looking for does not exist.',
    };
  }

  const title = categoryDetails.pageTitle || `${categoryDetails.name} Scores | sportsurge`;
  const description = categoryDetails.metaDescription || `Live scores and updates for ${categoryDetails.name} on sportsurge.`;

  return {
    title,
    description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const categoryId = params.categoryId;
  const categoryDetails = getCategoryDetails(categoryId, allSportCategoriesDetails);
  
  // AI-generated description will now be fetched client-side in CategoryClientContent
  // We can pass the static onPageContent as an initial fallback.
  const staticDescription = categoryDetails?.onPageContent || null;

  return <CategoryClientContent categoryDetails={categoryDetails} initialDescription={staticDescription} />;
}


// This file now re-exports data from sports-data.tsx to ensure a single source of truth.
// All primary data, including icons and SEO fields, is managed in sports-data.tsx.

export { 
    sportCategories, 
    SPORT_LEAGUE_OPTIONS_FULL, 
    getCategoryDetails 
} from './sports-data.tsx';

export type { 
    SportLeagueOption, 
    CategoryDetails 
} from './sports-data.tsx';

// The SportCategoryType is defined in types/index.ts and used by sports-data.tsx
// If you need to import it here for some reason, ensure it's from the original source.
// For example: import type { SportCategory as SportCategoryType } from '@/types';
// However, it's better if types are consistently imported where they are used.
// Since this file only re-exports, direct type imports for its own logic are minimal.


import type { SportCategory } from "@/types";
import { SportsCategoryCard } from "./sports-category-card";
import { sportCategories } from "@/lib/sports-data";


export function SportsCategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {sportCategories.map((category) => (
        <SportsCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
